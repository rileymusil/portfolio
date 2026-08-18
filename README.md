# Business Template

A template repository for quickly spinning up small business websites.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Component Dev:** [Storybook](https://storybook.js.org/)
- **Unit Testing:** [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/react)
- **E2E Testing:** [Playwright](https://playwright.dev/)
- **Deployment:** [Vercel](https://vercel.com/)
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

| Command | Description |
| --- | --- |
| `pnpm dev` | Start development server (Turbopack) |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Lint with ESLint |
| `pnpm test` | Run unit tests (Vitest) |
| `pnpm test:e2e` | Run E2E tests (Playwright) |
| `pnpm storybook` | Start Storybook |
| `pnpm format` | Format code with Prettier |

## Creating a New Business Site

1. Click **"Use this template"** on GitHub to create a new repository
2. Update `src/app/layout.tsx` with your business name and metadata
3. Add your components in `src/components/`
4. Add shadcn/ui components: `pnpm dlx shadcn@latest add button`
5. Deploy to Vercel
