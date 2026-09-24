import { type DragEvent, type ReactElement } from "react";
import { type ObjectInputProps } from "sanity";
import {
  useImageUpload,
  type ImageFieldValue,
} from "@/sanity/components/use-image-upload";

function isImageFile(file: File | undefined): file is File {
  return Boolean(file?.type.startsWith("image/"));
}

export function CompressedImageInput(
  props: ObjectInputProps<ImageFieldValue>,
): ReactElement {
  const { status, upload } = useImageUpload(props.onChange, props.value?.alt);

  function uploadCompressed(file: File): void {
    void upload(file, "Optimizing image…");
  }

  function interceptDrop(event: DragEvent<HTMLDivElement>): void {
    const file = event.dataTransfer.files[0];
    if (!isImageFile(file)) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    uploadCompressed(file);
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
        uploadCompressed(file);
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
        uploadCompressed(file);
        target.value = "";
      }}
    >
      {props.renderDefault(props)}
      <p className="text-muted-foreground mt-2 text-sm">
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
