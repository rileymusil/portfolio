# Business Template

A template repository for quickly spinning up small business websites.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Component Dev:** [Storybook](https://storybook.js.org/)
- **Unit Testing:** [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/react)
- **E2E Testing:** [Playwright](https://playwright.dev/)
- **Deployment:** [GitHub Pages](https://pages.github.com/) (static export)
- **Package Manager:** [pnpm](https://pnpm.io/)
- **Node Version:** managed via [fnm](https://github.com/Schniz/fnm) (`.node-version`)

## Getting Started

```bash
# Install fnm if you haven't already
# https://github.com/Schniz/fnm#installation

# Use the correct Node version
fnm use

# Install dependencies
pnpm install

# Start development
pnpm dev
```

## Project Structure

```
├── src/
│   ├── app/           # Next.js App Router pages
│   ├── components/    # React components
│   ├── lib/           # Utility functions (cn, etc.)
│   ├── hooks/         # Custom React hooks
│   └── styles/        # Global CSS / Tailwind theme
├── e2e/               # Playwright E2E tests
├── public/            # Static assets
└── .storybook/        # Storybook configuration
```

## Commands

| Command          | Description                            |
| ---------------- | -------------------------------------- |
| `pnpm dev`       | Start development server (Turbopack)   |
| `pnpm build`     | Production build                       |
| `pnpm start`     | Serve the static `out/` folder locally |
| `pnpm lint`      | Lint with ESLint                       |
| `pnpm test`      | Run unit tests (Vitest)                |
| `pnpm test:e2e`  | Run E2E tests (Playwright)             |
| `pnpm storybook` | Start Storybook                        |
| `pnpm format`    | Format code with Prettier              |

## Creating a New Business Site

1. Click **"Use this template"** on GitHub to create a new repository
2. Update `src/app/layout.tsx` with your business name and metadata
3. Add your components in `src/components/`
4. Add shadcn/ui components: `pnpm dlx shadcn@latest add button`
5. Deploy with GitHub Pages (see below)

## Editing content

Everything editable lives in Sanity Studio at `/studio`. Publish there and the change is live — no rebuild, no deploy, nothing to configure.

| Studio section                    | Appears on                              |
| --------------------------------- | --------------------------------------- |
| Photo Sessions                    | `/photography/[category]`               |
| Narrative Video, Commercial Video | `/video/narrative`, `/video/commercial` |
| — Video link                      | any supported platform, see below       |
| About Page                        | `/about`                                |

Photo and video galleries fetch from Sanity in the browser. The About page does both: it is prerendered with the content Sanity held at build time, so it paints real text immediately and its meta description is filled in, then it refreshes from Sanity in the browser and swaps in anything newer.

That means the only thing a rebuild changes on the About page is its `<meta name="description">`, which is taken from the banner subheading. Everything a visitor reads is current either way.

If Sanity is unreachable, the About page falls back to the copy in `src/lib/about.ts`, so a missing secret degrades to the previous content rather than an empty page.

## Ordering video projects

Drag the rows. Video projects appear in the Studio as two lists, **Narrative
Video** and **Commercial Video**, each ordered by dragging a row to where it
should sit. A drag-to-reorder list can only order what it shows, which is why
the categories are separate lists rather than one.

Position is stored as a lexicographic rank (`orderRank`, from
`@sanity/orderable-document-list`) rather than a number, so dropping a project
between two others does not renumber the rest.

The numeric **Display order** field it replaced is hidden and read-only rather
than deleted, because it still orders any project nobody has dragged yet.
`compareByDisplayOrder` in `src/lib/sanity/map-video.ts` defines the mixed
state: a dragged project is deliberately placed and comes first, and the rest
keep the order their old numbers gave them. Drag every project in a category
once and the old field stops mattering.

## Embedding video

A video project takes a **Video link** — paste the URL, the platform is detected
from it. Parsing and embed-URL construction live in `src/lib/video-embed.ts`.

| Platform     | Accepted links                                                               | Thumbnail  |
| ------------ | ---------------------------------------------------------------------------- | ---------- |
| YouTube      | `watch?v=`, `youtu.be/`, `shorts/`, `embed/`, `live/`, or a bare 11-char ID  | automatic  |
| Vimeo        | `vimeo.com/123`, channel and group links, unlisted links with a privacy hash | upload one |
| Facebook     | `/videos/`, `/reel/`, `/watch?v=`, `fb.watch/` short links                   | upload one |
| Google Drive | `/file/d/…/view`, `?id=…` — file must be shared with "anyone with the link"  | automatic  |
| Instagram    | `/p/`, `/reel/`, `/tv/`                                                      | upload one |
| TikTok       | `tiktok.com/@user/video/123…`                                                | upload one |

### Cover images

Only YouTube and Google Drive expose a thumbnail from a predictable URL. The
**Cover image** field fills the gap for the rest, three ways, in the Studio:

| Platform              | How the cover is obtained                                     |
| --------------------- | ------------------------------------------------------------- |
| YouTube, Google Drive | automatic, from the embed                                     |
| Vimeo, TikTok         | automatic, via their public oEmbed endpoints                  |
| Facebook, Instagram   | capture the screen, or the relay below if deployed            |
| anything, to override | capture the screen, or generate a frame from the source video |

Where a platform publishes a thumbnail, pasting the link fetches it on its own.

**Fetching** (`src/lib/video-thumbnail.ts`) calls the platform's oEmbed endpoint
and re-hosts the image in Sanity rather than linking it, because TikTok's
thumbnail URLs are signed and expire. Facebook and Instagram retired their
token-free oEmbed in 2020, so neither can be fetched without a Meta developer
app.

### Capturing from the screen

The route that needs nothing deployed and cannot be broken by a platform. Open
the post in another tab, press **Capture from the screen**, and pick that tab
when the browser asks. The pixels come from the operating system's screen share
rather than from the page, so the cross-origin restriction that blocks every
other approach does not apply — it works on any embed regardless of what the
platform serves.

Freeze a frame, drag across the video to crop it out of the surrounding browser
chrome, and it is encoded and uploaded. Sharing stops as soon as a frame is
chosen or the capture is cancelled. `src/lib/screen-capture.ts` holds the crop
maths; `getDisplayMedia` needs a secure context, so this works on the deployed
Studio and on localhost.

### The thumbnail relay

Facebook and Instagram publish a poster in their page's Open Graph tags — the
same one that makes a pasted link show a preview in Slack or iMessage. A browser
cannot read it, because the fetch is cross-origin, and their CDNs send no CORS
headers either. A server can do both, so `src/lib/thumbnail-endpoint.ts` fetches
the page, reads `og:image`, and relays the bytes back with CORS.

Deploy it either way — the handler is the same:

```bash
# Vercel: api/video-thumbnail.ts deploys as an Edge Function
vercel deploy

# or Cloudflare, without moving the site
npx wrangler deploy workers/video-thumbnail.ts
```

Then set `NEXT_PUBLIC_THUMBNAIL_API` to the deployed URL — as a repository
variable for the build, and in `.env.local` for the Studio in development. Leave
it unset and Facebook and Instagram fall back to generating a frame.

It only ever fetches a URL that parses as one of the six supported platforms, so
it cannot be pointed at an internal address or used as a general proxy, and it
caps what it relays at 10MB.

**Generating** (`src/lib/capture-frame.ts`) takes a frame from the source video
file. Choosing the file is the whole interaction: it samples five frames across
the middle of the clip, scores each by brightness and detail, discards the ones
that are near-black or blown out, and captures the most detailed of what is
left — then encodes and uploads it. The video file never leaves the browser;
only the image is sent. Scrubbing the preview and recapturing is there for when
the automatic choice is not the wanted one.

This exists because a frame cannot be taken from the embed itself: the player is
a cross-origin iframe, so the browser will not let the page read its pixels, and
the underlying media URLs are signed and expiring. Automating Facebook and
Instagram entirely would need a Meta developer app and an App Access Token,
which cannot live in client-side code.

Whatever is set here overrides an automatic thumbnail, and takes over if a
platform thumbnail fails to load. With no cover at all, the card falls back to a
branded tile showing the platform name.

YouTube Shorts, Facebook Reels, Instagram, and TikTok play in a 9:16 frame;
everything else is 16:9. Grid cards stay 16:9 either way so the layout does not
go ragged. Autoplay is only applied to YouTube and Vimeo, the two that honour it
from a URL parameter.

A link the parser does not recognise fails validation in the Studio, and a
project whose link cannot be parsed is dropped from the page rather than
rendering an empty player.

Projects created before this used a **YouTube video ID** field. They keep
playing untouched — the field is still read as a fallback — and it disappears
from the Studio once a Video link is filled in.

**Instagram caveat:** the `/embed/` endpoint is undocumented and Meta has
narrowed it over time. It works for public posts today, but it is the one
platform here that could stop working without notice. If that matters for a
given piece, upload the video to YouTube or Vimeo as well.

## Search and social metadata

Every page ships a canonical URL, Open Graph and Twitter card tags, and
`schema.org` structured data, all built from `NEXT_PUBLIC_SITE_URL` (falling
back to `https://rileymusil.com`, the domain in `public/CNAME`) plus
`NEXT_PUBLIC_BASE_PATH`.

| What                                                  | Where                                                            |
| ----------------------------------------------------- | ---------------------------------------------------------------- |
| Canonical + Open Graph + Twitter tags                 | `src/lib/metadata.ts` — each page calls `pageMetadata()`         |
| Site-wide defaults, `metadataBase`, robots directives | `src/app/layout.tsx`                                             |
| `ProfessionalService` / `Person` / `WebSite` JSON-LD  | `src/lib/structured-data.ts`                                     |
| `sitemap.xml`                                         | `src/app/sitemap.ts`, from the route list in `src/lib/routes.ts` |
| `robots.txt`                                          | `src/app/robots.ts` — allows everything except `/studio/`        |
| Link preview image (1200×630)                         | `public/og-image.png`                                            |

Add a new public page to `src/lib/routes.ts` and it appears in the sitemap;
nothing else needs touching. `/studio` is deliberately excluded from both the
sitemap and `robots.txt` — it is the editor, not content.

## Analytics

Google Analytics 4, loaded only when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set to a
valid `G-…` ID — so local dev and preview builds report nothing.

Because the site is a static export with client-side navigation, gtag's own
`page_view` would fire once per hard load and miss every in-site link. It is
switched off in the config call and `AnalyticsRouteTracker` sends a `page_view`
on each route change instead, including the first.

GA4 sets cookies and, depending on where your visitors are, may need a consent
notice. There is none on the site today; to ship without one, use a
cookieless alternative instead.

## GitHub Pages

The app is statically exported (`output: "export"`) so it can be hosted on GitHub Pages. The page shells are static files; photography galleries and video projects fetch Sanity from the browser, so new sessions show up without a rebuild.

1. In the repo, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
2. Add repository secrets (Settings → Secrets and variables → Actions):
   - `NEXT_PUBLIC_SANITY_PROJECT_ID` (required so the browser can call Sanity)
   - `NEXT_PUBLIC_SANITY_DATASET` (optional, defaults to `production`)
   - `NEXT_PUBLIC_SANITY_API_VERSION` (optional)
3. Optional repository variables:
   - `NEXT_PUBLIC_SITE_URL` — canonical URL, e.g. `https://rileymusil.com`
   - `NEXT_PUBLIC_BASE_PATH` — repo name only if this is a project site (`https://org.github.io/repo`). Leave empty for a custom domain or `username.github.io` site.
   - `NEXT_PUBLIC_GA_MEASUREMENT_ID` — Google Analytics 4 measurement ID, e.g. `G-ABC1234567`. Leave unset to ship without analytics.
4. Push to `main` (or run the **Deploy to GitHub Pages** workflow). Custom domain is `public/CNAME`.

Sanity Studio stays available locally at `/studio` during `pnpm dev`. Hosted Studio can also be deployed with `pnpm dlx sanity@latest deploy`.
