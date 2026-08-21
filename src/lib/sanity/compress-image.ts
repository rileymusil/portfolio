export const UPLOAD_MAX_EDGE_PX = 2400;
export const UPLOAD_JPEG_QUALITY = 0.82;
export const UPLOAD_COMPRESS_IF_LARGER_THAN_BYTES = 800_000;

export interface UploadImageMetrics {
  width: number;
  height: number;
  byteSize: number;
}

export function shouldCompressUpload(input: UploadImageMetrics): boolean {
  return (
    Math.max(input.width, input.height) > UPLOAD_MAX_EDGE_PX ||
    input.byteSize > UPLOAD_COMPRESS_IF_LARGER_THAN_BYTES
  );
}

export function uploadTargetSize(
  width: number,
  height: number,
): { width: number; height: number } {
  const longEdge = Math.max(width, height);
  if (longEdge <= UPLOAD_MAX_EDGE_PX) {
    return { width, height };
  }

  const scale = UPLOAD_MAX_EDGE_PX / longEdge;
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  };
}

function shouldSkipCompression(file: File): boolean {
  return (
    !file.type.startsWith("image/") ||
    file.type === "image/gif" ||
    file.type === "image/svg+xml"
  );
}

export async function compressImageFile(file: File): Promise<File> {
  if (shouldSkipCompression(file)) {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file);
    try {
      if (
        !shouldCompressUpload({
          width: bitmap.width,
          height: bitmap.height,
          byteSize: file.size,
        })
      ) {
        return file;
      }

      const { width, height } = uploadTargetSize(bitmap.width, bitmap.height);
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (!context) {
        return file;
      }

      context.drawImage(bitmap, 0, 0, width, height);
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, "image/jpeg", UPLOAD_JPEG_QUALITY);
      });

      if (!blob || blob.size >= file.size) {
        return file;
      }

      const name = file.name.replace(/\.[^.]+$/u, ".jpg");
      return new File([blob], name, {
        type: "image/jpeg",
        lastModified: Date.now(),
      });
    } finally {
      bitmap.close();
    }
  } catch {
    return file;
  }
}
