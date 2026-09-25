import { Button, Card, Spinner, Text } from "@sanity/ui";
import { useEffect, useRef, useState } from "react";
import {
  autoSelectFrame,
  captureVideoFrame,
  formatTimecode,
  frameFileName,
  isVideoFile,
} from "@/lib/capture-frame";
import type { VideoEmbed } from "@/lib/video-embed";
import {
  canFetchAutomatically,
  getThumbnailApiUrl,
  getThumbnailStrategy,
  oembedRequestUrl,
  parseOembedThumbnail,
  thumbnailApiEnv,
  thumbnailApiImageUrl,
} from "@/lib/video-thumbnail";

export interface VideoThumbnailPanelProps {
  embed: VideoEmbed | null;
  /** Suppresses the automatic fetch when a cover is already set. */
  hasCover: boolean;
  busy: boolean;
  status: string | null;
  onStatus: (status: string | null) => void;
  onBusy: (busy: boolean) => void;
  upload: (file: File, working: string) => Promise<boolean>;
}

function guidanceFor(embed: VideoEmbed | null, relay: boolean): string {
  if (!embed) {
    return "Add the video link above, then a cover can be fetched or generated here.";
  }

  switch (getThumbnailStrategy(embed.source)) {
    case "embedded":
      return `${embed.label} already provides a thumbnail. Use this only to override it.`;
    case "oembed":
      return `${embed.label} publishes a thumbnail. Fetch it, or generate one from the source video.`;
    default:
      return relay
        ? `${embed.label} publishes no thumbnail through an API, so its cover is read from the post itself.`
        : `${embed.label} publishes no thumbnail. Deploy the thumbnail relay to fetch it from the post, or generate one from the source video.`;
  }
}

/* Split out from the input so it can be rendered on its own against the Studio
   theme to check how it looks. */
export function VideoThumbnailPanel({
  embed,
  hasCover,
  busy,
  status,
  onStatus,
  onBusy,
  upload,
}: VideoThumbnailPanelProps) {
  const oembedUrl = embed ? oembedRequestUrl(embed) : null;
  const apiBase = getThumbnailApiUrl(thumbnailApiEnv);
  const canFetch = embed
    ? canFetchAutomatically(embed.source, Boolean(apiBase))
    : false;
  /* Remembers which links have been tried, so a failure is reported once rather
     than retried on every keystroke in the form. */
  const attempted = useRef<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [sourceName, setSourceName] = useState<string | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);

  /* An object URL pins the file in memory until it is revoked, and an edit
     session can go through several takes. */
  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  async function captureAt(
    video: HTMLVideoElement,
    name: string,
  ): Promise<void> {
    const file = await captureVideoFrame({
      video,
      fileName: frameFileName(name, video.currentTime),
    });
    await upload(file, "Uploading the generated cover…");
  }

  /* Choosing a file is the whole interaction: the frame is picked, captured and
     uploaded without another click. Scrubbing and recapturing is there for when
     the automatic choice is not the wanted one. */
  async function generateFrom(file: File): Promise<void> {
    setSourceName(file.name);
    setObjectUrl((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous);
      }
      return URL.createObjectURL(file);
    });

    onBusy(true);
    onStatus("Reading the video…");
    try {
      const video = document.createElement("video");
      video.preload = "auto";
      video.muted = true;
      video.src = URL.createObjectURL(file);
      try {
        await new Promise<void>((resolve, reject) => {
          video.onloadeddata = () => resolve();
          video.onerror = () =>
            reject(new Error("That video could not be read in this browser."));
        });

        onStatus("Looking for a good frame…");
        const time = await autoSelectFrame(video);
        setCurrentTime(time);
        onStatus("Capturing…");
        await captureAt(video, file.name);
      } finally {
        URL.revokeObjectURL(video.src);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error(`Failed to generate a cover: ${message}`);
      onStatus(message);
    } finally {
      onBusy(false);
    }
  }

  async function recaptureCurrentFrame(): Promise<void> {
    const video = videoRef.current;
    if (!video || !sourceName) {
      return;
    }
    onBusy(true);
    try {
      await captureAt(video, sourceName);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error(`Failed to capture a frame: ${message}`);
      onStatus(message);
    } finally {
      onBusy(false);
    }
  }

  async function fetchViaOembed(
    embed_: VideoEmbed,
    url: string,
  ): Promise<void> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`${embed_.label} answered ${response.status}`);
    }
    const thumbnailUrl = parseOembedThumbnail(await response.json());
    if (!thumbnailUrl) {
      throw new Error(`${embed_.label} returned no thumbnail`);
    }
    /* Re-hosted rather than linked: TikTok's thumbnail URLs are signed and
       expire, which would leave dead images on the site. */
    const image = await fetch(thumbnailUrl);
    if (!image.ok) {
      throw new Error(`the thumbnail answered ${image.status}`);
    }
    await uploadBlob(await image.blob(), embed_.source);
  }

  /* Facebook and Instagram put a poster in their page's Open Graph tags — the
     same one that makes a pasted link show a preview. The browser cannot read
     it cross-origin, so the relay fetches the page and returns the bytes. */
  async function fetchViaRelay(
    embed_: VideoEmbed,
    base: string,
  ): Promise<void> {
    const response = await fetch(thumbnailApiImageUrl(base, embed_.watchUrl));
    if (!response.ok) {
      const detail = await response
        .json()
        .then((body: { error?: string }) => body.error)
        .catch(() => null);
      throw new Error(detail ?? `the relay answered ${response.status}`);
    }
    await uploadBlob(await response.blob(), embed_.source);
  }

  async function uploadBlob(blob: Blob, source: string): Promise<void> {
    await upload(
      new File([blob], `${source}-thumbnail.jpg`, {
        type: blob.type || "image/jpeg",
      }),
      "Uploading thumbnail…",
    );
  }

  async function fetchAutomatically(): Promise<void> {
    if (!embed || !canFetch) {
      return;
    }
    onBusy(true);
    onStatus(`Fetching a cover from ${embed.label}…`);
    try {
      if (oembedUrl) {
        await fetchViaOembed(embed, oembedUrl);
      } else if (apiBase) {
        await fetchViaRelay(embed, apiBase);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error(`Failed to fetch a thumbnail: ${message}`);
      onStatus(`Couldn't fetch one (${message}). Generate one instead.`);
    } finally {
      onBusy(false);
    }
  }

  /* Pasting the link is the whole interaction where a cover can be fetched:
     this runs once per link, and only when there is no cover already. */
  useEffect(() => {
    if (!embed || !canFetch || hasCover) {
      return;
    }
    if (attempted.current === embed.watchUrl) {
      return;
    }
    attempted.current = embed.watchUrl;
    void fetchAutomatically();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [embed?.watchUrl, canFetch, hasCover]);

  return (
    /* Sanity UI supplies the theming — Card, Button and Text pick up the
       Studio's colour scheme. Layout is inline rather than Stack/space, because
       those props resolve spacing from the theme and silently fall back to no
       gap if that lookup misses. */
    <Card
      padding={3}
      radius={2}
      shadow={1}
      style={{ marginTop: 12 }}
      tone="transparent"
    >
      <div style={{ display: "grid", gap: 12 }}>
        <Text muted size={1}>
          {guidanceFor(embed, Boolean(apiBase))}
        </Text>

        <div style={{ display: "grid", gap: 8 }}>
          {canFetch ? (
            <Button
              disabled={busy}
              mode="ghost"
              onClick={() => void fetchAutomatically()}
              text={`Fetch the cover from ${embed?.label} again`}
            />
          ) : null}

          <Button
            disabled={busy}
            mode="ghost"
            onClick={() => fileRef.current?.click()}
            text={
              objectUrl
                ? "Generate from another video"
                : "Generate from the video file"
            }
            tone="primary"
          />
          <input
            accept="video/*"
            hidden
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (!isVideoFile(file)) {
                onStatus("That is not a video file.");
                return;
              }
              void generateFrom(file);
            }}
            ref={fileRef}
            type="file"
          />
          <Text muted size={0}>
            Picks a frame, skipping the black and blown-out ones. The video
            stays on your computer — only the image is uploaded.
          </Text>
        </div>

        {objectUrl ? (
          <div style={{ display: "grid", gap: 8 }}>
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
              controls
              onSeeked={(event) =>
                setCurrentTime(event.currentTarget.currentTime)
              }
              onTimeUpdate={(event) =>
                setCurrentTime(event.currentTarget.currentTime)
              }
              preload="metadata"
              ref={videoRef}
              src={objectUrl}
              style={{
                background: "#000",
                borderRadius: 4,
                display: "block",
                maxHeight: 280,
                width: "100%",
              }}
            />
            <Button
              disabled={busy}
              mode="bleed"
              onClick={() => void recaptureCurrentFrame()}
              text={`Use the frame at ${formatTimecode(currentTime)} instead`}
            />
          </div>
        ) : null}

        {status ? (
          <Card padding={2} radius={2} tone={busy ? "primary" : "caution"}>
            <div style={{ alignItems: "center", display: "flex", gap: 8 }}>
              {busy ? <Spinner muted size={1} /> : null}
              <Text size={1}>{status}</Text>
            </div>
          </Card>
        ) : null}
      </div>
    </Card>
  );
}
