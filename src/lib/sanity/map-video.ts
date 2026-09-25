import type { PortableTextBlock } from "@portabletext/types";
import { sizedSanityImageUrl } from "@/lib/sanity/image";
import type {
  SanityVideoDoc,
  VideoProject,
  VideoStill,
} from "@/lib/sanity/types";
import { displayNumber, isVideoCategory } from "@/lib/video";
import { parseVideoUrl } from "@/lib/video-embed";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function toStill(
  url: string,
  alt: string,
  caption: string,
  lqip: string | null,
): VideoStill {
  return {
    alt,
    caption,
    thumbUrl: sizedSanityImageUrl(url, "cover"),
    fullUrl: sizedSanityImageUrl(url, "lightbox"),
    ...(lqip ? { lqip } : {}),
  };
}

interface OrderKeys {
  /* Set by dragging a row in the Studio. A lexicographic rank, so inserting
     between two projects does not renumber the rest. */
  orderRank: string | null;
  /* The numeric field this replaced, still set on projects nobody has dragged. */
  order: number | null;
  createdAt: string | null;
}

function orderKeys(doc: unknown): OrderKeys {
  if (!isRecord(doc)) {
    return { orderRank: null, order: null, createdAt: null };
  }
  return {
    orderRank: asString(doc.orderRank),
    order: typeof doc.order === "number" ? doc.order : null,
    createdAt: asString(doc._createdAt),
  };
}

/* Sorting here rather than in the query so the mixed state is defined: while
   some projects have been dragged and others have not, a dragged one is
   deliberately placed and comes first, and the rest keep the order they had
   under the old numeric field. */
export function compareByDisplayOrder(a: unknown, b: unknown): number {
  const left = orderKeys(a);
  const right = orderKeys(b);

  if (left.orderRank && right.orderRank) {
    return left.orderRank < right.orderRank
      ? -1
      : left.orderRank > right.orderRank
        ? 1
        : 0;
  }
  if (left.orderRank) {
    return -1;
  }
  if (right.orderRank) {
    return 1;
  }

  const byOrder = (left.order ?? 0) - (right.order ?? 0);
  if (byOrder !== 0) {
    return byOrder;
  }

  /* Newest first, matching what the old query did on a tie. */
  return (right.createdAt ?? "").localeCompare(left.createdAt ?? "");
}

/* `index` is the project's position in the already-sorted list, which is where
   the "01"/"02" label comes from. See displayNumber in @/lib/video. */
export function mapVideoProject(
  doc: unknown,
  index: number,
): VideoProject | null {
  if (!isRecord(doc)) {
    return null;
  }

  const id = asString(doc._id);
  const title = asString(doc.title);
  const category = asString(doc.category);

  if (!id || !title || !category || !isVideoCategory(category)) {
    return null;
  }

  /* videoUrl is the field editors fill in now; youtubeId is what documents
     created before multi-platform support hold, and parseVideoUrl reads a bare
     ID as YouTube, so both keep working without a migration. */
  const embed = parseVideoUrl(doc.videoUrl) ?? parseVideoUrl(doc.youtubeId);

  /* An unrecognised link would render an iframe pointing at nothing, so drop
     the project rather than ship a dead embed. */
  if (!embed) {
    return null;
  }

  /* Only YouTube and Google Drive hand out a thumbnail without an API key, so
     an uploaded cover wins where it exists and is the only option elsewhere. */
  const uploaded = isRecord(doc.thumbnail) ? doc.thumbnail : null;
  const uploadedUrl = uploaded ? asString(uploaded.url) : null;
  const uploadedLqip = uploaded ? asString(uploaded.lqip) : null;
  const thumbnailUrl = uploadedUrl
    ? sizedSanityImageUrl(uploadedUrl, "cover")
    : embed.thumbnailUrl;

  const badges = Array.isArray(doc.badges)
    ? doc.badges.flatMap((badge) => {
        const text = asString(badge);
        return text ? [text] : [];
      })
    : [];

  /* Portable Text is passed straight through to the renderer, so validate only
     that each entry is an object and let the renderer ignore what it can't
     draw. */
  const description = Array.isArray(doc.description)
    ? (doc.description.filter(isRecord) as unknown as PortableTextBlock[])
    : [];

  const stills = Array.isArray(doc.stills)
    ? doc.stills.flatMap((still) => {
        if (!isRecord(still)) {
          return [];
        }
        const url = asString(still.url);
        if (!url) {
          return [];
        }
        return [
          toStill(
            url,
            asString(still.alt) ?? title,
            asString(still.caption) ?? "",
            asString(still.lqip),
          ),
        ];
      })
    : [];

  return {
    id,
    number: displayNumber(index),
    title,
    category,
    embed,
    thumbnailUrl,
    ...(uploadedUrl && uploadedLqip ? { thumbnailLqip: uploadedLqip } : {}),
    badges,
    description,
    stills,
  };
}

export function mapVideoProjects(docs: unknown[]): VideoProject[] {
  /* Numbering runs over the projects that survive validation, so a rejected
     document can't leave a gap in the sequence. */
  const projects: VideoProject[] = [];
  [...docs].sort(compareByDisplayOrder).forEach((doc) => {
    const project = mapVideoProject(doc, projects.length);
    if (project) {
      projects.push(project);
    }
  });
  return projects;
}

export function isSanityVideoDoc(value: unknown): value is SanityVideoDoc {
  return mapVideoProject(value, 0) !== null;
}
