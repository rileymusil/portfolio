import { useEffect, useRef, useState, type ReactElement } from "react";
import { useFormValue, type ObjectInputProps } from "sanity";
import {
  captureVideoFrame,
  formatTimecode,
  frameFileName,
  isVideoFile,
} from "@/lib/capture-frame";
import { parseVideoUrl, type VideoEmbed } from "@/lib/video-embed";
import {
  getThumbnailStrategy,
  oembedRequestUrl,
  parseOembedThumbnail,
} from "@/lib/video-thumbnail";
import { CompressedImageInput } from "@/sanity/components/CompressedImageInput";
import {
  useImageUpload,
  type ImageFieldValue,
} from "@/sanity/components/use-image-upload";

interface VideoProjectDocument {
  videoUrl?: unknown;
  youtubeId?: unknown;
}

const buttonClass =
  "rounded-md border border-[#ccc] bg-white px-3 py-2 text-sm font-medium text-[#333] transition hover:bg-[#f2f4f6] disabled:cursor-not-allowed disabled:opacity-50";

function guidanceFor(embed: VideoEmbed | null): string {
  if (!embed) {
    return "Add the video link above and this panel can fetch or capture a cover for you.";
  }

  switch (getThumbnailStrategy(embed.source)) {
    case "embedded":
      return `${embed.label} already serves a thumbnail, so this is only needed to override it.`;
    case "oembed":
      return `${embed.label} publishes a thumbnail — fetch it, or capture your own frame below.`;
    default:
      return `${embed.label} serves no thumbnail. Capture a frame from the source video below, or upload an image.`;
  }
}

export function VideoThumbnailInput(
  props: ObjectInputProps<ImageFieldValue>,
): ReactElement {
  const doc = useFormValue([]) as VideoProjectDocument | undefined;
  const embed =
    parseVideoUrl(doc?.videoUrl) ?? parseVideoUrl(doc?.youtubeId) ?? null;
  const oembedUrl = embed ? oembedRequestUrl(embed) : null;

  const { status, setStatus, upload } = useImageUpload(
    props.onChange,
    props.value?.alt,
  );

  const videoRef = useRef<HTMLVideoElement>(null);
  const [sourceName, setSourceName] = useState<string | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [busy, setBusy] = useState(false);

  /* Object URLs hold the file in memory until revoked, and a long edit session
     can go through several takes. */
  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  function chooseVideo(file: File | undefined): void {
    if (!isVideoFile(file)) {
      setStatus("That is not a video file.");
      return;
    }
    setObjectUrl((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous);
      }
      return URL.createObjectURL(file);
    });
    setSourceName(file.name);
    setCurrentTime(0);
    setStatus(null);
  }

  async function fetchFromPlatform(): Promise<void> {
    if (!oembedUrl || !embed) {
      return;
    }
    setBusy(true);
    setStatus(`Asking ${embed.label} for a thumbnail…`);
    try {
      const response = await fetch(oembedUrl);
      if (!response.ok) {
        throw new Error(`${embed.label} answered ${response.status}`);
      }
      const thumbnailUrl = parseOembedThumbnail(await response.json());
      if (!thumbnailUrl) {
        throw new Error(`${embed.label} returned no thumbnail`);
      }

      /* Re-hosted in Sanity rather than linked: TikTok's thumbnail URLs are
         signed and expire, which would leave dead images on the site. */
      const image = await fetch(thumbnailUrl);
      if (!image.ok) {
        throw new Error(`the thumbnail answered ${image.status}`);
      }
      const blob = await image.blob();
      const file = new File([blob], `${embed.source}-thumbnail.jpg`, {
        type: blob.type || "image/jpeg",
      });
      await upload(file, "Uploading thumbnail…");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error(`Failed to fetch a thumbnail: ${message}`);
      setStatus(
        `Couldn't fetch one automatically (${message}). Capture a frame below instead.`,
      );
    } finally {
      setBusy(false);
    }
  }

  async function captureCurrentFrame(): Promise<void> {
    const video = videoRef.current;
    if (!video || !sourceName) {
      return;
    }
    setBusy(true);
    try {
      const file = await captureVideoFrame({
        video,
        fileName: frameFileName(sourceName, video.currentTime),
      });
      await upload(file, "Uploading the captured frame…");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error(`Failed to capture a frame: ${message}`);
      setStatus(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <CompressedImageInput {...props} />

      <div className="mt-3 rounded-lg border border-[#e0e0e0] bg-[#fafbfc] p-3">
        <p className="m-0 text-sm text-[#555]">{guidanceFor(embed)}</p>

        {oembedUrl ? (
          <button
            type="button"
            className={`${buttonClass} mt-3`}
            onClick={() => void fetchFromPlatform()}
            disabled={busy}
          >
            Fetch thumbnail from {embed?.label}
          </button>
        ) : null}

        <div className="mt-3">
          <label className="block text-sm font-medium text-[#333]">
            Capture a frame from the source video
            <input
              type="file"
              accept="video/*"
              className="mt-1 block w-full text-sm"
              onChange={(event) => {
                chooseVideo(event.target.files?.[0]);
                event.target.value = "";
              }}
            />
          </label>
          <p className="mt-1 text-xs text-[#777]">
            The video stays on your computer — only the captured image is
            uploaded.
          </p>
        </div>

        {objectUrl ? (
          <div className="mt-3">
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
              ref={videoRef}
              src={objectUrl}
              controls
              preload="metadata"
              className="max-h-[320px] w-full rounded-md bg-black"
              onTimeUpdate={(event) =>
                setCurrentTime(event.currentTarget.currentTime)
              }
              onSeeked={(event) =>
                setCurrentTime(event.currentTarget.currentTime)
              }
            />
            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                className={buttonClass}
                onClick={() => void captureCurrentFrame()}
                disabled={busy}
              >
                Use the frame at {formatTimecode(currentTime)}
              </button>
              <span className="text-xs text-[#777]">
                Scrub to the moment you want, then capture.
              </span>
            </div>
          </div>
        ) : null}

        {status ? (
          <p role="status" className="mt-2 text-sm">
            {status}
          </p>
        ) : null}
      </div>
    </div>
  );
}
