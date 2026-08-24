import type { PortableTextBlock } from "@portabletext/types";
import { aboutCopy, experience, skillGroups } from "@/lib/about";
import { sizedSanityImageUrl } from "@/lib/sanity/image";
import type {
  AboutExperienceItem,
  AboutImage,
  AboutPage,
  AboutSkillGroup,
} from "@/lib/sanity/types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function asStringList(value: unknown): string[] {
  return Array.isArray(value)
    ? value.flatMap((item) => {
        const text = asString(item);
        return text ? [text] : [];
      })
    : [];
}

function paragraph(text: string, index: number): PortableTextBlock {
  return {
    _type: "block",
    _key: `fallback${index}`,
    style: "normal",
    markDefs: [],
    children: [
      { _type: "span", _key: `fallback${index}s`, text, marks: [] },
    ],
  } as unknown as PortableTextBlock;
}

/* Used when Sanity has no About document yet, or when the site is built without
   Sanity credentials (a fork, or a CI job with no secrets). Without this the
   About page would build empty rather than falling back to the copy that was
   already in the repo. */
export const aboutFallback: AboutPage = {
  bannerTitle: aboutCopy.bannerTitle,
  bannerSubtitle: aboutCopy.bannerSubtitle,
  role: aboutCopy.role,
  headshot: { url: "/AboutPageHeadshot.jpg", alt: "Riley Musil" },
  intro: aboutCopy.intro.map(paragraph),
  skillGroups,
  experience,
  fieldPhotos: aboutCopy.fieldPhotos.map((photo) => ({
    url: photo.src,
    alt: photo.alt,
  })),
  education: aboutCopy.education,
  honors: aboutCopy.honors,
  hobbies: aboutCopy.hobbies,
};

function toImage(value: unknown, fallbackAlt: string): AboutImage | null {
  if (!isRecord(value)) {
    return null;
  }
  const url = asString(value.url);
  if (!url) {
    return null;
  }
  const lqip = asString(value.lqip);
  return {
    url: sizedSanityImageUrl(url, "cover"),
    alt: asString(value.alt) ?? fallbackAlt,
    ...(lqip ? { lqip } : {}),
  };
}

function toSkillGroups(value: unknown): AboutSkillGroup[] {
  return Array.isArray(value)
    ? value.flatMap((group) => {
        if (!isRecord(group)) {
          return [];
        }
        const title = asString(group.title);
        return title ? [{ title, tags: asStringList(group.tags) }] : [];
      })
    : [];
}

function toExperience(value: unknown): AboutExperienceItem[] {
  return Array.isArray(value)
    ? value.flatMap((item) => {
        if (!isRecord(item)) {
          return [];
        }
        const role = asString(item.role);
        if (!role) {
          return [];
        }
        return [
          {
            role,
            organization: asString(item.organization) ?? "",
            dates: asString(item.dates) ?? "",
            bullets: asStringList(item.bullets),
          },
        ];
      })
    : [];
}

/* Each section falls back independently: an About document that has not had its
   photos uploaded yet still renders the rest of the page rather than a gap. */
export function mapAboutPage(doc: unknown): AboutPage {
  if (!isRecord(doc)) {
    return aboutFallback;
  }

  const intro = Array.isArray(doc.intro)
    ? (doc.intro.filter(isRecord) as unknown as PortableTextBlock[])
    : [];

  const fieldPhotos = Array.isArray(doc.fieldPhotos)
    ? doc.fieldPhotos.flatMap((photo) => {
        const image = toImage(photo, "Riley Musil in the field");
        return image ? [image] : [];
      })
    : [];

  const skills = toSkillGroups(doc.skillGroups);
  const roles = toExperience(doc.experience);
  const honors = asStringList(doc.honors);
  const hobbies = asStringList(doc.hobbies);
  const education = isRecord(doc.education)
    ? {
        title: asString(doc.education.title) ?? aboutFallback.education.title,
        school: asString(doc.education.school) ?? aboutFallback.education.school,
      }
    : aboutFallback.education;

  return {
    bannerTitle: asString(doc.bannerTitle) ?? aboutFallback.bannerTitle,
    bannerSubtitle: asString(doc.bannerSubtitle) ?? aboutFallback.bannerSubtitle,
    role: asString(doc.role) ?? aboutFallback.role,
    headshot: toImage(doc.headshot, "Riley Musil") ?? aboutFallback.headshot,
    intro: intro.length ? intro : aboutFallback.intro,
    skillGroups: skills.length ? skills : aboutFallback.skillGroups,
    experience: roles.length ? roles : aboutFallback.experience,
    fieldPhotos: fieldPhotos.length ? fieldPhotos : aboutFallback.fieldPhotos,
    education,
    honors: honors.length ? honors : aboutFallback.honors,
    hobbies: hobbies.length ? hobbies : aboutFallback.hobbies,
  };
}
