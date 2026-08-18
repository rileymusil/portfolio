import { site } from "@/lib/site";

export function ContactBar() {
  return (
    <div className="border-t border-[#eee] bg-white px-8 py-12 text-center">
      <p className="mb-3">
        <a
          href={`mailto:${site.email}`}
          className="mx-3 font-semibold text-primary no-underline hover:text-[#3498db]"
        >
          {site.email}
        </a>
        <span aria-hidden="true">|</span>
        <a
          href={site.phoneHref}
          className="mx-3 font-semibold text-primary no-underline hover:text-[#3498db]"
        >
          {site.phoneDisplay}
        </a>
      </p>
      <p>
        <a
          href={site.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mx-3 font-semibold text-primary no-underline hover:text-[#3498db]"
        >
          LinkedIn
        </a>
        <span aria-hidden="true">|</span>
        <a
          href={site.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mx-3 font-semibold text-primary no-underline hover:text-[#3498db]"
        >
          Instagram
        </a>
      </p>
    </div>
  );
}
