import { site } from "@/lib/site";

export function DemoReel() {
  return (
    <section className="bg-white px-[5%] py-16 text-center">
      <div className="relative mx-auto aspect-video max-w-[900px] overflow-hidden rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${site.showReelYoutubeId}`}
          title="Riley Musil Show Reel"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 size-full border-0"
        />
      </div>
    </section>
  );
}
