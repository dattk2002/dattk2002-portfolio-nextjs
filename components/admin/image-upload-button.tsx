"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { ImagePlus, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ImageUploadButtonProps = {
  label?: string;
  onUploaded: (url: string) => void;
  className?: string;
  variant?: "default" | "outline" | "ghost";
};

export function ImageUploadButton({ label = "Upload image", onUploaded, className, variant = "outline" }: ImageUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Choose a JPEG, PNG, WebP, or GIF image.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("Images must be 8 MB or smaller.");
      return;
    }

    setError("");
    setUploading(true);
    try {
      const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
      const blob = await upload(`blog/${Date.now()}-${safeName}`, file, {
        access: "public",
        handleUploadUrl: "/api/blog/upload",
        contentType: file.type,
      });
      onUploaded(blob.url);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The image could not be uploaded.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className={cn("inline-flex flex-col items-start gap-2", className)}>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) void handleFile(file); }} />
      <Button type="button" variant={variant} disabled={uploading} onClick={() => inputRef.current?.click()}>
        {uploading ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <ImagePlus className="size-4" aria-hidden="true" />}
        {uploading ? "Uploading…" : label}
      </Button>
      {error ? <p className="max-w-xs text-xs leading-5 text-error" role="alert">{error}</p> : null}
    </div>
  );
}
