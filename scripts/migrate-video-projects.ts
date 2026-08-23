/* ==========================================================================
   migrate-video-projects.ts

   One-time move of the hardcoded video projects in src/lib/video-projects.ts
   into Sanity, so they can be edited in the Studio at /studio.

   Run it once, check the results in the Studio, then delete this script,
   src/lib/video-projects.ts, src/lib/sanity/html-to-blocks.ts, and
   public/video-stills/.

   Usage:
     1. Create a token with Editor rights at https://www.sanity.io/manage
        (API -> Tokens). Put it in .env.local, which is already gitignored:
            SANITY_API_WRITE_TOKEN=sk...
     2. pnpm migrate:video          (add --dry-run to preview without writing)

   Re-running is safe: documents use deterministic IDs and are replaced, not
   duplicated. Stills already uploaded are reused rather than uploaded twice.
   ========================================================================== */

import { readFile } from "node:fs/promises";
import { basename, resolve } from "node:path";
import { createClient } from "@sanity/client";
import { JSDOM } from "jsdom";
import { htmlToBlocks } from "../src/lib/sanity/html-to-blocks";
import {
  commercialProjects,
  narrativeProjects,
  type VideoProject,
} from "../src/lib/video-projects";

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

const parse = (html: string): Document => new JSDOM(html).window.document;

/* Same file can appear in more than one project; upload it once. */
const assetCache = new Map<string, string>();

async function uploadStill(src: string): Promise<string> {
  const cached = assetCache.get(src);
  if (cached) {
    return cached;
  }

  const filename = basename(src);
  const path = resolve(process.cwd(), "public", src.replace(/^\//, ""));
  const buffer = await readFile(path);
  const asset = await client.assets.upload("image", buffer, { filename });

  assetCache.set(src, asset._id);
  console.log(`  uploaded ${filename} -> ${asset._id}`);
  return asset._id;
}

async function buildDocument(
  project: VideoProject,
  category: "narrative" | "commercial",
  order: number,
) {
  const stills = [];
  for (const [index, still] of (project.stills ?? []).entries()) {
    stills.push({
      _type: "image",
      _key: `still${index + 1}`,
      asset: dryRun
        ? { _type: "reference", _ref: "dry-run" }
        : { _type: "reference", _ref: await uploadStill(still.src) },
      alt: still.alt,
      caption: still.caption,
    });
  }

  return {
    _id: `videoProject.${project.id}`,
    _type: "videoProject",
    title: project.title,
    category,
    youtubeId: project.youtubeId,
    order,
    badges: project.badges,
    description: htmlToBlocks(project.descriptionHtml, parse),
    stills,
  };
}

async function migrate(): Promise<void> {
  const groups: Array<[("narrative" | "commercial"), VideoProject[]]> = [
    ["narrative", narrativeProjects],
    ["commercial", commercialProjects],
  ];

  console.log(
    `${dryRun ? "[dry run] " : ""}Migrating into ${projectId}/${dataset}\n`,
  );

  for (const [category, projects] of groups) {
    for (const [index, project] of projects.entries()) {
      console.log(`${category} ${index + 1}/${projects.length}: ${project.title}`);
      const doc = await buildDocument(project, category, index);

      const linkCount = doc.description.reduce(
        (total, block) => total + (block.markDefs?.length ?? 0),
        0,
      );
      console.log(
        `  ${doc.description.length} paragraph(s), ${linkCount} link(s), ${doc.stills.length} still(s)`,
      );

      if (dryRun) {
        continue;
      }
      await client.createOrReplace(doc);
      console.log(`  saved ${doc._id}`);
    }
  }

  console.log(
    dryRun
      ? "\nDry run complete — nothing was written."
      : "\nDone. Check the projects in the Studio at /studio before deleting video-projects.ts.",
  );
}

migrate().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
