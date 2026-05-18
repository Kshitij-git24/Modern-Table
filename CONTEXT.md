# Project Context — Companies Dashboard Table

Snapshot of where we left off so we can pick up cleanly next session.

## Goal

A modern, "wow-factor" companies table that someone else can drop into their existing React website (which already has its own navbar/sidebar/routing) — they just replace whatever table they had with `<CompanyTable />` and pass in their data.

## Stack (locked in)

- **Build**: Vite 8 + React 19 + TypeScript 6
- **Styling**: Tailwind CSS v4 + shadcn/ui (new-york style, zinc base, Radix primitives)
- **Table**: TanStack Table v8 (headless) + `@tanstack/react-virtual` (row virtualization)
- **Icons**: `lucide-react`
- **Mock data**: `@faker-js/faker` (demo only — host throws this away)

## Fixed contract — non-negotiable

The 7 columns are **fixed**: Company name · Account number · Street address · City · State · Zip · Email.

The host doesn't pass column configs; they only pass `data: Company[]`.

## Features wired

- Global fuzzy search with **column-scope selector** (All / Company / Account # / Street / City / State / Zip / Email)
- Per-column header dropdown: **Sort asc / Sort desc / Pin left / Pin right / Unpin**
- Row selection (checkboxes, with select-all-on-page)
- **Export selected to CSV** (bulk action)
- **Export all filtered to CSV** (respects active search)
- Column visibility toggle
- Sticky header on scroll
- Row virtualization (smooth at 5k–10k rows)
- Clickable rows — `onRowClick(company)` callback (no-op in demo)
- Footer: "Showing X–Y of N records (filtered from M) · Page A of B" + 10/25/50/100 page size selector + first/prev/next/last buttons
- Light/dark mode toggle (demo only — host has their own theme system)
- Responsive — stacks on mobile, horizontal-scroll when columns exceed viewport, table height adapts via `calc(100svh - 260px)`

## Folder structure

```
src/
├── App.tsx                              ← demo host shell (mock navbar + table)
├── main.tsx
├── index.css                            ← Tailwind v4 import + full zinc theme vars
├── lib/
│   ├── mock-data.ts                     ← demo only (faker, 5,000 rows)
│   └── utils.ts                         ← cn() helper from shadcn
├── hooks/use-theme.ts                   ← demo only
├── components/
│   ├── theme-toggle.tsx                 ← demo only
│   ├── ui/                              ← shadcn primitives (8 of them)
│   └── data-table/                      ← ★ the drop-in folder ★
│       ├── index.ts                     ← exports CompanyTable + Company type
│       ├── types.ts                     ← Company shape + SearchScope
│       ├── columns.tsx                  ← the 7 fixed column defs
│       ├── column-header.tsx            ← per-column dropdown (sort/pin)
│       ├── data-table.tsx               ← main <CompanyTable> component
│       ├── toolbar.tsx                  ← scoped search + columns + export
│       ├── pagination.tsx               ← footer (record count + page nav)
│       └── lib/csv.ts                   ← CSV export (travels with the table)
```

The `data-table/` folder is fully self-contained — it only imports from `@/components/ui/*` and `@/lib/utils` (both shadcn standards). No imports from `src/lib/mock-data`, `src/hooks/*`, or anywhere else outside it.

## Build status as of last session

- `npx tsc -b --noEmit` — **clean**
- `npm run build` — **succeeds** (832kB raw / 282kB gzipped — normal for React 19 + TanStack + Radix)
- `npm run dev` — boots on http://localhost:5173/ in ~570ms

## Not yet verified

- **Visual rendering — no confirmation yet.** Dev server was running and ready, user paused before opening it in a browser.
- Likely tuning opportunities once we see it: spacing/density, dark-mode contrast on pinned columns, header backdrop-blur behavior across browsers, pinned-cell hover color (uses an `oklch(from var(--accent) ...)` expression that may need a fallback).

## Commands

```bash
npm run dev               # dev server on :5173
npm run build             # prod build (tsc -b + vite build)
npx tsc -b --noEmit       # typecheck only
```

## Decisions worth remembering

- **`npx shadcn@latest init` is broken non-interactively** in v4.7.0 — `-y` hangs. We hand-wrote `components.json`, `src/index.css` (with the full zinc theme block), and `src/lib/utils.ts`. The `shadcn add` command works fine — used it to add the 8 primitives in one go.
- **TypeScript 6 deprecates `baseUrl`** — `paths` alone works. Removed `baseUrl` from both `tsconfig.json` and `tsconfig.app.json`.
- **Folder name "New folder" has a space** — sanitized `package.json` name field to `company-dashboard`.
- **User clarified the per-column "filters" they wanted are actually sort+pin via header dropdown**, NOT per-column text filter inputs. Global search (with scope selector) is the only text-filter mechanism.
- **Whole row is clickable, no row-action ⋮ menu** — `onClick` is on the entire `<TableRow>`; the checkbox column wrapper has `stopPropagation()` so clicking the box doesn't trigger the row.
- **Columns are fixed, not generic.** User explicitly chose this over a generic `DataTable<T>` — keeps the component opinionated and host-side wiring trivial.

## Open items for next session

1. **User opens localhost:5173 and gives visual feedback** — this is the main pending step.
2. Likely follow-ups: tighten spacing if too airy, adjust header tint, possibly add a subtle animation on row hover.
3. The `oklch(from ...)` color expression on pinned-cell hover is a 2024+ feature — if it doesn't render in some target browser, swap to a static color or Tailwind class.

## Related files in repo root

- `INTEGRATION.md` — the doc handed to a host developer who wants to use this table in their own site.
