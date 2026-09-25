/* Capturing what is on screen sidesteps the whole cross-origin problem: the
   pixels come from the operating system's screen share, not from the page, so
   it works on any embed regardless of what the platform serves or blocks. */

export interface CropRect {
  /** All four are fractions of the frame, 0-1. */
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PixelRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/* A drag shorter than this in either direction is a stray click rather than a
   selection, and is treated as "no crop". */
export const MIN_CROP_FRACTION = 0.02;

export function isScreenCaptureSupported(): boolean {
  return (
    typeof navigator !== "undefined" &&
    typeof navigator.mediaDevices?.getDisplayMedia === "function"
  );
}

function clamp01(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.min(1, Math.max(0, value));
}

/* Built from two corners, so dragging in any direction gives the same rect. */
export function normalizeCropRect(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
): CropRect {
  const x1 = clamp01(startX);
  const y1 = clamp01(startY);
  const x2 = clamp01(endX);
  const y2 = clamp01(endY);

  return {
    x: Math.min(x1, x2),
    y: Math.min(y1, y2),
    width: Math.abs(x2 - x1),
    height: Math.abs(y2 - y1),
  };
}

export function isUsableCrop(rect: CropRect | null): rect is CropRect {
  return (
    rect !== null &&
    rect.width >= MIN_CROP_FRACTION &&
    rect.height >= MIN_CROP_FRACTION
  );
}

/* Rounds outward to whole pixels and keeps the rect inside the frame, so a
   selection dragged to the edge does not read past it. */
export function cropRectToPixels(
  rect: CropRect,
  frameWidth: number,
  frameHeight: number,
): PixelRect {
  const x = Math.min(
    Math.max(0, Math.round(rect.x * frameWidth)),
    Math.max(0, frameWidth - 1),
  );
  const y = Math.min(
    Math.max(0, Math.round(rect.y * frameHeight)),
    Math.max(0, frameHeight - 1),
  );
  const width = Math.max(
    1,
    Math.min(Math.round(rect.width * frameWidth), frameWidth - x),
  );
  const height = Math.max(
    1,
    Math.min(Math.round(rect.height * frameHeight), frameHeight - y),
  );

  return { x, y, width, height };
}

/* Prompts for a screen, window or tab. The browser requires this to be called
   from a user gesture, so it is wired to a button rather than an effect. */
export async function startScreenCapture(): Promise<MediaStream> {
  if (!isScreenCaptureSupported()) {
    throw new Error("This browser cannot capture the screen.");
  }

  return navigator.mediaDevices.getDisplayMedia({
    video: true,
    audio: false,
  });
}

export function stopScreenCapture(stream: MediaStream | null): void {
  for (const track of stream?.getTracks() ?? []) {
    track.stop();
  }
}
