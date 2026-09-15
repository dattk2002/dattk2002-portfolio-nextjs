import { upload } from "@vercel/blob/client";

export const MAX_BLOG_IMAGE_BYTES = 8 * 1024 * 1024;

const acceptedImageTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const imageExtensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export function validateBlogImage(file: Blob) {
  if (!acceptedImageTypes.has(file.type)) {
    return "Choose a JPEG, PNG, WebP, or GIF image.";
  }

  if (file.size > MAX_BLOG_IMAGE_BYTES) {
    return "Images must be 8 MB or smaller.";
  }

  return null;
}

function safeImageName(name: string, contentType: string) {
  const fallback = `pasted-image.${imageExtensions[contentType] ?? "jpg"}`;
  return (name || fallback).toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
}

export async function uploadBlogImage(file: File) {
  const validationError = validateBlogImage(file);
  if (validationError) throw new Error(validationError);

  const blob = await upload(
    `blog/${Date.now()}-${safeImageName(file.name, file.type)}`,
    file,
    {
      access: "public",
      handleUploadUrl: "/api/blog/upload",
      contentType: file.type,
    },
  );

  return blob.url;
}

export async function downloadBlogImage(source: string) {
  const url = new URL(source);
  if (url.protocol !== "https:") {
    throw new Error("Only HTTPS image sources can be imported.");
  }

  const response = await fetch(url, {
    credentials: "omit",
    mode: "cors",
    referrerPolicy: "no-referrer",
    signal: AbortSignal.timeout(8_000),
  });

  if (!response.ok) {
    throw new Error("The copied image source could not be downloaded.");
  }

  const contentLength = Number(response.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_BLOG_IMAGE_BYTES) {
    throw new Error("Images must be 8 MB or smaller.");
  }

  const blob = await response.blob();
  const validationError = validateBlogImage(blob);
  if (validationError) throw new Error(validationError);

  const sourceName = decodeURIComponent(url.pathname.split("/").pop() ?? "");
  return new File([blob], safeImageName(sourceName, blob.type), {
    type: blob.type,
  });
}
