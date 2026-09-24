import { useState } from "react";
import { set, useClient, type ObjectInputProps } from "sanity";
import { compressImageFile } from "@/lib/sanity/compress-image";
import { sanityEnv } from "@/lib/sanity/env";

export interface ImageFieldValue {
  _type?: string;
  alt?: string;
  hotspot?: unknown;
  crop?: unknown;
  asset?: {
    _type: string;
    _ref: string;
  };
}

export interface ImageUpload {
  status: string | null;
  setStatus: (status: string | null) => void;
  /** Resolves true when the field was set, false when the upload failed. */
  upload: (file: File, working: string) => Promise<boolean>;
}

/* Shared by the plain image input and the video thumbnail input so there is one
   compress-then-upload path rather than two that can drift. */
export function useImageUpload(
  onChange: ObjectInputProps<ImageFieldValue>["onChange"],
  currentAlt: string | undefined,
): ImageUpload {
  const client = useClient({ apiVersion: sanityEnv.apiVersion });
  const [status, setStatus] = useState<string | null>(null);

  async function upload(file: File, working: string): Promise<boolean> {
    setStatus(working);
    try {
      const compressed = await compressImageFile(file);
      const asset = await client.assets.upload("image", compressed, {
        filename: compressed.name,
      });
      onChange(
        set({
          _type: "image",
          alt: currentAlt,
          asset: {
            _type: "reference",
            _ref: asset._id,
          },
        }),
      );
      setStatus(null);
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error(`Failed to upload image: ${message}`);
      setStatus("Couldn't upload that image. Try another file.");
      return false;
    }
  }

  return { status, setStatus, upload };
}
