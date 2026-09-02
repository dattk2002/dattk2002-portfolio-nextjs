"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { Resend } from "resend";
import { z } from "zod";

export type ContactState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Partial<Record<"name" | "email" | "subject" | "message", string[]>>;
};

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter at least two characters.").max(80, "Please keep your name under 80 characters."),
  email: z.email("Please enter a valid email address.").max(160),
  subject: z.string().trim().min(3, "Please add a short subject.").max(140, "Please keep the subject under 140 characters."),
  message: z.string().trim().min(20, "Please share at least 20 characters.").max(4000, "Please keep the message under 4,000 characters."),
});

async function isRateLimited(identity: string) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return false;

  const maxRequests = Number(process.env.CONTACT_RATE_LIMIT_MAX ?? "5");
  const windowSeconds = Number(process.env.CONTACT_RATE_LIMIT_WINDOW_SECONDS ?? "3600");
  const key = `portfolio:contact:${createHash("sha256").update(identity).digest("hex")}`;

  try {
    const response = await fetch(`${url}/multi-exec`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", key],
        ["EXPIRE", key, windowSeconds, "NX"],
      ]),
      cache: "no-store",
    });

    if (!response.ok) return false;
    const result = (await response.json()) as Array<{ result?: number }>;
    return Number(result[0]?.result ?? 0) > maxRequests;
  } catch {
    return false;
  }
}

export async function sendContactMessage(_previousState: ContactState, formData: FormData): Promise<ContactState> {
  const honeypot = String(formData.get("company") ?? "");
  if (honeypot) return { status: "success", message: "Thanks — your message has been sent." };

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please review the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const requestHeaders = await headers();
  const forwardedFor = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim();
  const identity = forwardedFor || parsed.data.email.toLowerCase();
  if (await isRateLimited(identity)) {
    return { status: "error", message: "Too many messages were sent recently. Please email me directly instead." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !from || !to) {
    return { status: "error", message: "The contact service is not configured yet. Please use the email link beside this form." };
  }

  const resend = new Resend(apiKey);
  const { name, email, subject, message } = parsed.data;
  const safeName = name.replace(/[\r\n]+/g, " ").trim();
  const safeSubject = subject.replace(/[\r\n]+/g, " ").trim();
  const { error } = await resend.batch.send([
    {
      from,
      to: [to],
      replyTo: email,
      subject: `[Portfolio] ${safeSubject}`,
      text: ["New portfolio enquiry", "", `Name: ${name}`, `Email: ${email}`, `Subject: ${safeSubject}`, "", message].join("\n"),
    },
    {
      from,
      to: [email],
      replyTo: to,
      subject: `Thanks for reaching out, ${safeName}`,
      text: [
        `Hi ${safeName},`,
        "",
        "Thanks for getting in touch through my portfolio. I have received your message and will reply as soon as I can.",
        "",
        `Subject: ${safeSubject}`,
        "",
        "Best,",
        "Tran Kim Dat",
        "Full-stack Developer",
      ].join("\n"),
    },
  ]);

  if (error) {
    return { status: "error", message: "The message could not be sent. Please try again or email me directly." };
  }

  return { status: "success", message: "Thanks — your message has been sent, and a confirmation is on its way to your inbox." };
}
