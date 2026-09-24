/* Capturing a frame needs the source video file, because the platforms that
   serve no thumbnail play inside a cross-origin iframe: the browser will not
   let a page read pixels out of one, and the underlying media URLs are signed
   and expiring. Reading the file the editor already has avoids both. */

export const FRAME_JPEG_QUALITY = 0.86;

export function isVideoFile(file: File | undefined | null): file is File {
  return Boolean(file && file.type.startsWith("video/"));
}

/* "0:07", "1:23", "12:05" — enough to say which frame was taken. */
export function formatTimecode(seconds: number): string {
  const safe =
    Number.isFinite(seconds) && seconds > 0 ? Math.floor(seconds) : 0;
  const minutes = Math.floor(safe / 60);
  const rest = safe % 60;
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

/* Names the frame after its source and timestamp, so a project with several
   captures does not end up with a list of identical filenames in Sanity. */
export function frameFileName(sourceName: string, seconds: number): string {
  const base = sourceName
    .replace(/\.[^.]+$/u, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
  const stem = base || "video";
  const at = formatTimecode(seconds).replace(":", "m");
  return `${stem}-frame-${at}s.jpg`;
}

export interface CaptureFrameOptions {
  video: HTMLVideoElement;
  fileName: string;
}

/* Draws the frame currently displayed. The caller seeks first and waits for
   "seeked", so whatever the editor sees in the preview is what is captured. */
export async function captureVideoFrame({
  video,
  fileName,
}: CaptureFrameOptions): Promise<File> {
  const width = video.videoWidth;
  const height = video.videoHeight;

  if (!width || !height) {
    throw new Error("The video has not loaded far enough to read a frame yet.");
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("This browser would not provide a canvas to draw into.");
  }

  context.drawImage(video, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/jpeg", FRAME_JPEG_QUALITY);
  });

  if (!blob) {
    throw new Error("The frame could not be encoded as an image.");
  }

  return new File([blob], fileName, {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
}
