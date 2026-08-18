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

## GitHub Pages

The app is statically exported (`output: "export"`) so it can be hosted on GitHub Pages. The page shells are static files; photography galleries fetch Sanity from the browser, so new sessions show up without a rebuild.

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
