import { useState, type ReactElement } from "react";
import { useFormValue, type ObjectInputProps } from "sanity";
import { parseVideoUrl } from "@/lib/video-embed";
import { CompressedImageInput } from "@/sanity/components/CompressedImageInput";
import { VideoThumbnailPanel } from "@/sanity/components/VideoThumbnailPanel";
import {
  useImageUpload,
  type ImageFieldValue,
} from "@/sanity/components/use-image-upload";

interface VideoProjectDocument {
  videoUrl?: unknown;
  youtubeId?: unknown;
}

export function VideoThumbnailInput(
  props: ObjectInputProps<ImageFieldValue>,
): ReactElement {
  const doc = useFormValue([]) as VideoProjectDocument | undefined;
  const embed =
    parseVideoUrl(doc?.videoUrl) ?? parseVideoUrl(doc?.youtubeId) ?? null;

  const { status, setStatus, upload } = useImageUpload(
    props.onChange,
    props.value?.alt,
  );
  const [busy, setBusy] = useState(false);

  return (
    <div>
      <CompressedImageInput {...props} />
      <VideoThumbnailPanel
        busy={busy}
        embed={embed}
        onBusy={setBusy}
        onStatus={setStatus}
        status={status}
        upload={upload}
      />
    </div>
  );
}
