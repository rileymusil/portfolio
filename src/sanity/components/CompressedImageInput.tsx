import { useState, type DragEvent, type ReactElement } from "react";
import { set, useClient, type ObjectInputProps } from "sanity";
import { compressImageFile } from "@/lib/sanity/compress-image";
import { sanityEnv } from "@/lib/sanity/env";

interface ImageFieldValue {
  _type?: string;
  alt?: string;
  hotspot?: unknown;
  crop?: unknown;
  asset?: {
    _type: string;
    _ref: string;
  };
}

function isImageFile(file: File | undefined): file is File {
  return Boolean(file?.type.startsWith("image/"));
}

export function CompressedImageInput(
  props: ObjectInputProps<ImageFieldValue>,
): ReactElement {
  const client = useClient({ apiVersion: sanityEnv.apiVersion });
  const [status, setStatus] = useState<string | null>(null);

  async function uploadCompressed(file: File): Promise<void> {
    setStatus("Optimizing image…");
    try {
      const compressed = await compressImageFile(file);
      const asset = await client.assets.upload("image", compressed, {
        filename: compressed.name,
      });
      props.onChange(
        set({
          _type: "image",
          alt: props.value?.alt,
          asset: {
            _type: "reference",
            _ref: asset._id,
          },
        }),
      );
      setStatus(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error(`Failed to upload compressed image: ${message}`);
      setStatus("Couldn't optimize that image. Try another file.");
    }
  }

  function interceptDrop(event: DragEvent<HTMLDivElement>): void {
    const file = event.dataTransfer.files[0];
    if (!isImageFile(file)) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    void uploadCompressed(file);
  }

  return (
    <div
      onDragOverCapture={(event) => {
        if ([...event.dataTransfer.types].includes("Files")) {
          event.preventDefault();
        }
      }}
      onDropCapture={interceptDrop}
      onPasteCapture={(event) => {
        const file = [...(event.clipboardData?.files ?? [])].find((item) =>
          item.type.startsWith("image/"),
        );
        if (!file) {
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        void uploadCompressed(file);
      }}
      onChangeCapture={(event) => {
        const target = event.target;
        if (!(target instanceof HTMLInputElement) || target.type !== "file") {
          return;
        }
        const file = target.files?.[0];
        if (!isImageFile(file)) {
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        void uploadCompressed(file);
        target.value = "";
      }}
    >
      {props.renderDefault(props)}
      <p className="mt-2 text-sm text-muted-foreground">
        Large photos are resized to 2400px on the long edge before upload.
      </p>
      {status ? (
        <p role="status" className="mt-1 text-sm">
          {status}
        </p>
      ) : null}
    </div>
  );
}
