/* ==========================================================================
   migrate-about-page.ts

   One-time move of the About page copy in src/lib/about.ts into Sanity, so it
   can be edited in the Studio at /studio -> About Page.

   src/lib/about.ts stays afterwards: it is the fallback the site builds from
   when Sanity is unreachable or has no About document yet. This script only
   seeds the Sanity copy.

   Usage:
     1. .env.local needs NEXT_PUBLIC_SANITY_PROJECT_ID and an Editor token in
        SANITY_API_WRITE_TOKEN (see .env.example).
     2. npx.cmd tsx --env-file=.env.local scripts/migrate-about-page.ts
        Add --dry-run to preview without writing.

   Re-running is safe: the document has a fixed ID and is replaced, not
   duplicated. Images already uploaded are reused rather than re-uploaded.
   ========================================================================== */

import { readFile } from "node:fs/promises";
import { basename, resolve } from "node:path";
import { createClient } from "@sanity/client";
import { aboutCopy, experience, skillGroups } from "../src/lib/about";

const ABOUT_PAGE_ID = "aboutPage";
const HEADSHOT = "/AboutPageHeadshot.jpg";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-08-17";
const token = process.env.SANITY_API_WRITE_TOKEN;
const dryRun = process.argv.includes("--dry-run");

if (!projectId) {
  throw new Error(
    "NEXT_PUBLIC_SANITY_PROJECT_ID is not set. Add it to .env.local.",
  );
}
if (!token && !dryRun) {
  throw new Error(
    "SANITY_API_WRITE_TOKEN is not set. Create an Editor token at sanity.io/manage and add it to .env.local, or pass --dry-run.",
  );
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

async function uploadImage(src: string): Promise<string> {
  const filename = basename(src);
  const path = resolve(process.cwd(), "public", src.replace(/^\//, ""));
  const buffer = await readFile(path);
  const asset = await client.assets.upload("image", buffer, { filename });
  console.log(`  uploaded ${filename} -> ${asset._id}`);
  return asset._id;
}

async function imageField(src: string, alt: string, key?: string) {
  return {
    _type: "image",
    ...(key ? { _key: key } : {}),
    asset: dryRun
      ? { _type: "reference", _ref: "dry-run" }
      : { _type: "reference", _ref: await uploadImage(src) },
    alt,
  };
}

/* The intro is plain prose today, so each paragraph becomes one Portable Text
   block. Links can be added afterwards in the Studio. */
function paragraphs(lines: string[]) {
  return lines.map((text, index) => ({
    _type: "block",
    _key: `intro${index + 1}`,
    style: "normal",
    markDefs: [],
    children: [
      { _type: "span", _key: `intro${index + 1}s`, text, marks: [] },
    ],
  }));
}

async function migrate(): Promise<void> {
  console.log(
    `${dryRun ? "[dry run] " : ""}Seeding the About page into ${projectId}/${dataset}\n`,
  );

  const doc = {
    _id: ABOUT_PAGE_ID,
    _type: "aboutPage",
    bannerTitle: aboutCopy.bannerTitle,
    bannerSubtitle: aboutCopy.bannerSubtitle,
    role: aboutCopy.role,
    headshot: await imageField(HEADSHOT, "Riley Musil"),
    intro: paragraphs(aboutCopy.intro),
    skillGroups: skillGroups.map((group, index) => ({
      _type: "skillGroup",
      _key: `skills${index + 1}`,
      title: group.title,
      tags: group.tags,
    })),
    experience: experience.map((item, index) => ({
      _type: "experienceItem",
      _key: `role${index + 1}`,
      role: item.role,
      organization: item.organization,
      dates: item.dates,
      bullets: item.bullets,
    })),
    fieldPhotos: await Promise.all(
      aboutCopy.fieldPhotos.map((photo, index) =>
        imageField(photo.src, photo.alt, `photo${index + 1}`),
      ),
    ),
    education: { _type: "object", ...aboutCopy.education },
    honors: aboutCopy.honors,
    hobbies: aboutCopy.hobbies,
  };

  console.log(
    `  ${doc.intro.length} intro paragraph(s), ${doc.skillGroups.length} skill group(s), ` +
      `${doc.experience.length} role(s), ${doc.fieldPhotos.length} field photo(s), ` +
      `${doc.honors.length} honor(s), ${doc.hobbies.length} hobby(ies)`,
  );

  if (dryRun) {
    console.log("\nDry run complete — nothing was written.");
    return;
  }

  await client.createOrReplace(doc);
  console.log(`  saved ${doc._id}`);

  /* Confirm it reads back the way the build reads it: no token, no CDN. */
  const visible: { bannerTitle?: string } | null = await createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
  }).fetch(`*[_type == "aboutPage" && _id == "${ABOUT_PAGE_ID}"][0]{bannerTitle}`);

  if (!visible?.bannerTitle) {
    throw new Error(
      "The About document is not publicly readable. Do not deploy — the page would fall back to the copy in the repo.",
    );
  }
  console.log(`\nVisible to an anonymous reader: yes ("${visible.bannerTitle}")`);
  console.log("\nDone. Edit it in the Studio at /studio -> About Page.");
}

migrate().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
