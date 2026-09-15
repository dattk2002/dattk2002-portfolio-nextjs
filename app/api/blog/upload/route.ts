import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/admin";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    await requireAdmin();
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ error: "Vercel Blob is not configured." }, { status: 503 });
    }
    const body = (await request.json()) as HandleUploadBody;
    const response = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith("blog/")) throw new Error("Invalid upload path.");
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
          maximumSizeInBytes: MAX_IMAGE_BYTES,
          addRandomSuffix: true,
          cacheControlMaxAge: 60 * 60 * 24 * 30,
          tokenPayload: JSON.stringify({ scope: "blog-image" }),
        };
      },
      onUploadCompleted: async () => undefined,
    });
    return NextResponse.json(response);
  } catch (error) {
    const unauthorized = error instanceof Error && error.message === "Unauthorized";
    return NextResponse.json(
      { error: unauthorized ? "Unauthorized" : "The image could not be uploaded." },
      { status: unauthorized ? 401 : 400 },
    );
  }
}
