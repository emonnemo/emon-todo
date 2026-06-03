# emon-todo

Next.js 15 (App Router, `"use client"`) + Tailwind CSS 4 + TypeScript 5.7.

## Commands

| Command | Action |
|---|---|
| `npm run dev` | Dev server on `localhost:3000` |
| `npm run build` | Production build |
| `npm run type-check` | `tsc --noEmit` (only type check; no lint/test scripts exist) |

There are no lint, test, or formatter tools configured.

## Key quirks

- **Local UI dependency**: `@emonnemo/ui` is resolved from `file:../emonnemo-ui` (sibling directory). After pulling or switching branches there, run `npm install` to relink it.
- **Tailwind v4** uses `@tailwindcss/postcss` (not `tailwindcss` v3 plugin). CSS source scanning is configured in `app/globals.css` with `@source` directives — the one scanning `node_modules/@emonnemo/ui/dist/**/*.{js,mjs}` is required for the UI package's styles to work.
- **`next.config.ts`** transpiles `@emonnemo/ui` via `transpilePackages` — no other custom config.
- **Single page** at `app/page.tsx` — entire app is one `"use client"` component with local state (`useState`), no server actions, no API routes, no routing beyond `/`.
- Path alias `@/*` maps to project root (standard Next.js).
