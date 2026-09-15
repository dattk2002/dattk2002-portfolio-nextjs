"use client";

import { useRef, useState } from "react";
import { ImagePlus, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { uploadBlogImage, validateBlogImage } from "@/lib/blog/image-upload";
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
    const validationError = validateBlogImage(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setUploading(true);
    try {
      onUploaded(await uploadBlogImage(file));
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
