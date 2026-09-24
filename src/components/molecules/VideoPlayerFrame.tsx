import type { VideoEmbed } from "@/lib/video-embed";
import { withAutoplay } from "@/lib/video-embed";
import { cn } from "@/lib/utils";

interface VideoPlayerFrameProps {
  embed: VideoEmbed;
  title: string;
  className?: string;
}

export function VideoPlayerFrame({
  embed,
  title,
  className,
}: VideoPlayerFrameProps) {
  const portrait = embed.orientation === "portrait";

  return (
    <div
      className={cn(
        "relative bg-black",
        /* A 9:16 player at full modal width would run off the screen. Capping
           the width by viewport height as well as by 420px keeps the whole
           player, the title under it, and the close button on one screen. */
        portrait
          ? "mx-auto aspect-[9/16] w-full max-w-[min(420px,39vh)]"
          : "aspect-video w-full",
        className,
      )}
    >
      <iframe
        src={withAutoplay(embed)}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="absolute inset-0 size-full border-0"
      />
    </div>
  );
}
