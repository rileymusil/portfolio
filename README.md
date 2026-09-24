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

| Studio section | Appears on |
| --- | --- |
| Photo Sessions | `/photography/[category]` |
| Video Projects | `/video/narrative`, `/video/commercial` |
| About Page | `/about` |

Photo and video galleries fetch from Sanity in the browser. The About page does both: it is prerendered with the content Sanity held at build time, so it paints real text immediately and its meta description is filled in, then it refreshes from Sanity in the browser and swaps in anything newer.

That means the only thing a rebuild changes on the About page is its `<meta name="description">`, which is taken from the banner subheading. Everything a visitor reads is current either way.

If Sanity is unreachable, the About page falls back to the copy in `src/lib/about.ts`, so a missing secret degrades to the previous content rather than an empty page.

## Search and social metadata

Every page ships a canonical URL, Open Graph and Twitter card tags, and
`schema.org` structured data, all built from `NEXT_PUBLIC_SITE_URL` (falling
back to `https://rileymusil.com`, the domain in `public/CNAME`) plus
`NEXT_PUBLIC_BASE_PATH`.

| What | Where |
| --- | --- |
| Canonical + Open Graph + Twitter tags | `src/lib/metadata.ts` — each page calls `pageMetadata()` |
| Site-wide defaults, `metadataBase`, robots directives | `src/app/layout.tsx` |
| `ProfessionalService` / `Person` / `WebSite` JSON-LD | `src/lib/structured-data.ts` |
| `sitemap.xml` | `src/app/sitemap.ts`, from the route list in `src/lib/routes.ts` |
| `robots.txt` | `src/app/robots.ts` — allows everything except `/studio/` |
| Link preview image (1200×630) | `public/og-image.png` |

Add a new public page to `src/lib/routes.ts` and it appears in the sitemap;
nothing else needs touching. `/studio` is deliberately excluded from both the
sitemap and `robots.txt` — it is the editor, not content.

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
4. Push to `main` (or run the **Deploy to GitHub Pages** workflow). Custom domain is `public/CNAME`.

Sanity Studio stays available locally at `/studio` during `pnpm dev`. Hosted Studio can also be deployed with `pnpm dlx sanity@latest deploy`.
