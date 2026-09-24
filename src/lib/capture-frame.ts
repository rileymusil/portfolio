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

/* Picking a frame automatically. A clip usually opens on black, a fade, or a
   slate, so the first frame is the worst possible cover. These sample a spread
   of the runtime and keep the one with the most going on in it. */

export interface FrameSample {
  time: number;
  /** Mean luminance, 0-255. */
  mean: number;
  /** Variance of luminance: low means flat, high means detail. */
  variance: number;
}

const TOO_DARK = 24;
const TOO_BRIGHT = 236;

export function candidateTimes(duration: number, count = 5): number[] {
  if (!Number.isFinite(duration) || duration <= 0) {
    return [0];
  }

  /* Spread across the middle of the clip: the opening and the closing are where
     titles, fades, and black frames live. */
  const from = duration * 0.15;
  const span = duration * 0.7;
  const steps = Math.max(1, count);

  return Array.from({ length: steps }, (_, index) => {
    const position = steps === 1 ? 0.5 : index / (steps - 1);
    return Number((from + span * position).toFixed(3));
  });
}

/* A frame that is nearly black or blown out is rejected outright; among the
   rest, more detail wins. */
export function pickBestFrame(samples: FrameSample[]): number | null {
  if (samples.length === 0) {
    return null;
  }

  const usable = samples.filter(
    (sample) => sample.mean >= TOO_DARK && sample.mean <= TOO_BRIGHT,
  );
  const pool = usable.length > 0 ? usable : samples;

  return pool.reduce((best, sample) =>
    sample.variance > best.variance ? sample : best,
  ).time;
}

export function seekTo(video: HTMLVideoElement, time: number): Promise<void> {
  return new Promise((resolve) => {
    if (Math.abs(video.currentTime - time) < 0.01) {
      resolve();
      return;
    }
    const done = (): void => {
      video.removeEventListener("seeked", done);
      resolve();
    };
    video.addEventListener("seeked", done);
    video.currentTime = time;
  });
}

/* Downsampled on purpose: this only needs the statistics, and a 64px read per
   candidate keeps the scan quick even on a 4K source. */
export function sampleFrameStats(video: HTMLVideoElement): FrameSample {
  const width = 64;
  const height = Math.max(
    1,
    Math.round((video.videoHeight / video.videoWidth) * width) || 36,
  );

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    return { time: video.currentTime, mean: 0, variance: 0 };
  }

  context.drawImage(video, 0, 0, width, height);
  const { data } = context.getImageData(0, 0, width, height);

  let total = 0;
  let totalSquares = 0;
  const pixels = width * height;
  for (let i = 0; i < data.length; i += 4) {
    const luma = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    total += luma;
    totalSquares += luma * luma;
  }

  const mean = total / pixels;
  return {
    time: video.currentTime,
    mean,
    variance: Math.max(0, totalSquares / pixels - mean * mean),
  };
}

/* Scans the candidates and leaves the video parked on the winner, so the
   preview shows the editor exactly what was chosen. */
export async function autoSelectFrame(
  video: HTMLVideoElement,
): Promise<number> {
  const samples: FrameSample[] = [];

  for (const time of candidateTimes(video.duration)) {
    await seekTo(video, time);
    samples.push(sampleFrameStats(video));
  }

  const best = pickBestFrame(samples) ?? 0;
  await seekTo(video, best);
  return best;
}
