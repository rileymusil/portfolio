import { evaluate, parse } from "groq-js";
import { describe, expect, it } from "vitest";
import { PHOTO_CATEGORIES } from "@/lib/photography";
import { absoluteUrl } from "@/lib/site-url";
import { VIDEO_CATEGORIES } from "@/lib/video";
import config from "@/sanity/webhooks/discord-notifications.json";

interface WebhookConfig {
  name: string;
  trigger: string[];
  includeDrafts: boolean;
  httpMethod: string;
  filter: string;
  projection: string;
}

interface DiscordEmbed {
  title: string;
  url: string;
  description: string;
  color: number;
  image: { url: string };
  footer: { text: string };
  timestamp: string;
}

const webhooks = config.webhooks as WebhookConfig[];

function webhookFor(type: string): WebhookConfig {
  const found = webhooks.find((hook) => hook.filter.includes(`"${type}"`));
  if (!found) {
    throw new Error(`no webhook configured for ${type}`);
  }
  return found;
}

const IMAGE_URL =
  "https://cdn.sanity.io/images/p1/production/abc-2000x1500.jpg";

/* Enough of a dataset to dereference a cover image, cover a video with and
   without one, and prove a draft is left alone. */
const dataset = [
  { _id: "img1", _type: "sanity.imageAsset", url: IMAGE_URL },
  {
    _id: "ps1",
    _type: "photoSession",
    title: "Harrison Wedding",
    category: "event",
    _createdAt: "2026-10-01T12:00:00Z",
    cover: { _type: "image", asset: { _type: "reference", _ref: "img1" } },
  },
  {
    _id: "vp1",
    _type: "videoProject",
    title: "The Man in the Woods",
    category: "narrative",
    _createdAt: "2026-10-02T09:30:00Z",
    thumbnail: { _type: "image", asset: { _type: "reference", _ref: "img1" } },
  },
  {
    _id: "vp2",
    _type: "videoProject",
    title: "Reel With No Cover",
    category: "commercial",
    _createdAt: "2026-10-02T10:00:00Z",
  },
  {
    _id: "drafts.vp3",
    _type: "videoProject",
    title: "Still Being Written",
    category: "narrative",
    _createdAt: "2026-10-02T11:00:00Z",
  },
];

/* Runs the webhook's own GROQ, so these assertions are about the body Discord
   actually receives rather than about the text of the configuration. */
async function bodyFor(hook: WebhookConfig, id: string): Promise<DiscordEmbed> {
  const tree = parse(`*[_id == "${id}"][0]${hook.projection}`);
  const result = await (await evaluate(tree, { dataset })).get();
  return (result as { embeds: DiscordEmbed[] }).embeds[0];
}

async function selectedBy(hook: WebhookConfig): Promise<string[]> {
  const tree = parse(`*[${hook.filter}]._id`);
  return (await (await evaluate(tree, { dataset })).get()) as string[];
}

describe("Discord webhook filters", () => {
  it("picks up a published photo session and nothing else", async () => {
    await expect(selectedBy(webhookFor("photoSession"))).resolves.toEqual([
      "ps1",
    ]);
  });

  it("picks up published video projects but never a draft", async () => {
    const selected = await selectedBy(webhookFor("videoProject"));
    expect(selected).toEqual(["vp1", "vp2"]);
    expect(selected).not.toContain("drafts.vp3");
  });

  it.each(["photoSession", "videoProject"])(
    "%s fires only when something is first published",
    (type) => {
      const hook = webhookFor(type);
      expect(hook.trigger).toEqual(["create"]);
      expect(hook.includeDrafts).toBe(false);
      expect(hook.httpMethod).toBe("POST");
    },
  );
});

describe("the message Discord receives", () => {
  it("announces a photo session with its cover and a link to the gallery", async () => {
    const embed = await bodyFor(webhookFor("photoSession"), "ps1");
    expect(embed.title).toBe("Harrison Wedding");
    expect(embed.url).toBe(absoluteUrl("/photography/event"));
    expect(embed.description).toBe("New photo session in event");
    expect(embed.timestamp).toBe("2026-10-01T12:00:00Z");
    expect(embed.image.url).toBe(`${IMAGE_URL}?w=1200&fit=max&auto=format`);
  });

  it("announces a video project with its cover and a link to the category", async () => {
    const embed = await bodyFor(webhookFor("videoProject"), "vp1");
    expect(embed.title).toBe("The Man in the Woods");
    expect(embed.url).toBe(absoluteUrl("/video/narrative"));
    expect(embed.image.url).toBe(`${IMAGE_URL}?w=1200&fit=max&auto=format`);
  });

  it("falls back to the site's own card when a video has no cover", async () => {
    /* A null image URL is refused by Discord with an invalid-body error, which
       would lose the notification entirely. */
    const embed = await bodyFor(webhookFor("videoProject"), "vp2");
    expect(embed.image.url).toBe("https://rileymusil.com/og-image.png");
    expect(embed.title).toBe("Reel With No Cover");
  });

  it("asks Sanity for a sized image rather than the original upload", async () => {
    const embed = await bodyFor(webhookFor("photoSession"), "ps1");
    expect(embed.image.url).toContain("w=1200");
    expect(embed.image.url).toContain("auto=format");
  });

  it("carries an integer colour, the only form Discord accepts", async () => {
    const embed = await bodyFor(webhookFor("photoSession"), "ps1");
    expect(Number.isInteger(embed.color)).toBe(true);
  });

  it("links every category to the page the site actually serves", async () => {
    for (const category of PHOTO_CATEGORIES) {
      const doc = { ...dataset[1], _id: `ps-${category}`, category };
      const tree = parse(
        `*[_id == "${doc._id}"][0]${webhookFor("photoSession").projection}`,
      );
      const result = (await (
        await evaluate(tree, { dataset: [...dataset, doc] })
      ).get()) as { embeds: DiscordEmbed[] };
      expect(result.embeds[0].url).toBe(
        absoluteUrl(`/photography/${category}`),
      );
    }

    for (const category of VIDEO_CATEGORIES) {
      const doc = { ...dataset[2], _id: `vp-${category}`, category };
      const tree = parse(
        `*[_id == "${doc._id}"][0]${webhookFor("videoProject").projection}`,
      );
      const result = (await (
        await evaluate(tree, { dataset: [...dataset, doc] })
      ).get()) as { embeds: DiscordEmbed[] };
      expect(result.embeds[0].url).toBe(absoluteUrl(`/video/${category}`));
    }
  });
});
