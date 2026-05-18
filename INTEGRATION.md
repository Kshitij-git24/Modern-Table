# Integrating CompanyTable into your project

A drop-in React table for company records. You already have your own site (navbar, sidebar, routing, theme) — this just replaces your existing companies table.

---

## What you get

- **7 fixed columns**: Company name · Account number · Street address · City · State · Zip · Email
- **Scoped global search**: one search box with a dropdown to scope to a single column (or "All columns")
- **Per-column sort & pin** (left / right) via header dropdown
- **Row selection** with bulk **CSV export**
- **Full-table CSV export** (respects active filters)
- **Column visibility** toggle
- **Sticky header** + **row virtualization** (smooth at 10k+ rows)
- **Clickable rows** — you wire navigation to your detail page
- **Theme follows the host** (light / dark / whatever you have)
- **Responsive** — stacks on mobile, horizontal-scrolls when columns exceed viewport

---

## Prerequisites

Your project needs:

1. **React 18 or 19**
2. **Tailwind CSS v4** with `@tailwindcss/vite` (or your bundler's equivalent)
3. **shadcn/ui** configured — zinc base color, CSS variables enabled. The component imports from `@/components/ui/*` and uses shadcn's CSS-variable system (`--background`, `--primary`, etc.)
4. **Path alias** `@/* → src/*` in your `tsconfig.json` and bundler config

If you don't already have shadcn/ui set up, follow [ui.shadcn.com/docs/installation](https://ui.shadcn.com/docs/installation) for your bundler first (~15–30 min one-time setup).

---

## Install — three steps

### 1. Add the two peer dependencies

```bash
npm install @tanstack/react-table @tanstack/react-virtual
```

### 2. Add the 8 shadcn primitives (skip ones you already have)

```bash
npx shadcn@latest add button input checkbox dropdown-menu select table badge separator
```

### 3. Copy one folder into `src/components/`

Copy the entire `data-table/` folder, preserving the `lib/` subfolder inside:

```
src/components/data-table/
├── index.ts
├── types.ts
├── columns.tsx
├── column-header.tsx
├── data-table.tsx
├── toolbar.tsx
├── pagination.tsx
└── lib/
    └── csv.ts
```

That's it — no other files from this repo are needed. (`mock-data.ts`, `theme-toggle.tsx`, `use-theme.ts`, `App.tsx` are demo-only.)

---

## Usage

Drop it inside your existing layout wherever your old table was:

```tsx
import { CompanyTable, type Company } from "@/components/data-table"
import { useNavigate } from "react-router-dom"   // or whichever router you use

export function CompaniesPage() {
  const navigate = useNavigate()
  const { data, isLoading } = useCompaniesQuery()   // your existing data fetch

  if (isLoading) return <YourSpinner />

  return (
    <YourAppLayout>           {/* your navbar / sidebar / footer all unchanged */}
      <YourPageHeader title="Companies" />
      <CompanyTable
        data={data}
        onRowClick={(company) => navigate(`/companies/${company.id}`)}
        csvFilename="acme-companies"
      />
    </YourAppLayout>
  )
}
```

That's the whole integration.

---

## The data contract

Your backend response must map to this exact shape:

```ts
type Company = {
  id: string              // unique key — used for React keys + row selection
  companyName: string
  accountNumber: string
  streetAddress: string
  city: string
  state: string           // 2-letter code looks best (rendered as a badge)
  zip: string
  email: string
}
```

If your API uses different field names, map once before passing the array:

```ts
const rows: Company[] = apiResponse.map((r) => ({
  id: r.uuid,
  companyName: r.business_name,
  accountNumber: r.acct_no,
  streetAddress: r.address.line1,
  city: r.address.city,
  state: r.address.state_code,
  zip: r.address.postal_code,
  email: r.primary_email,
}))
```

---

## Props reference

| Prop | Type | Required | Default | Purpose |
|---|---|---|---|---|
| `data` | `Company[]` | ✓ | — | Full dataset. Table paginates and filters client-side. |
| `onRowClick` | `(c: Company) => void` | — | — | Fires when a row is clicked. Use it to navigate to a detail page. |
| `csvFilename` | `string` | — | `"companies"` | Base name for CSV downloads (`-all.csv` or `-selected.csv` is appended). |

---

## How it fits inside your existing UI

- **No layout assumptions** — the table renders as a self-contained card and fills its parent container's width. Your navbar / sidebar / footer keep working exactly as before.
- **No global side effects** — it doesn't inject CSS globals, attach to `document`, register routes, or hold app-wide state.
- **No data fetching** — bring your own (React Query, SWR, RTK Query, plain fetch — whatever) and pass the array.
- **Theme follows the host** — uses shadcn's CSS variables. If you toggle `.dark` on `<html>`, the table follows automatically.
- **Sits anywhere in your layout tree** — top of a page, inside a tab, inside a modal — as long as the parent gives it a width, it works.

---

## What it does NOT do (by design)

- **Server-side pagination** — purely client-side. Fine up to ~10k rows; beyond that, switch to a server-side approach.
- **Edit-in-place** — read-only. No inline editing.
- **Row-action ⋮ menus** — whole row is clickable instead; wire your detail navigation via `onRowClick`.
- **Per-column text filters** — filtering is the global scoped search, not per-column inputs.

---

## Customising

### Column widths or labels

Open `src/components/data-table/columns.tsx`. Each column has a `size` (in pixels) and a `title` — change them directly.

```ts
{
  accessorKey: "email",
  header: ({ column }) => <ColumnHeader column={column} title="Email Address" />,
  cell: ...,
  size: 320,   // was 240
}
```

### Page size options

Open `src/components/data-table/pagination.tsx`:

```ts
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100]   // edit as you like
```

### Default page size

In `src/components/data-table/data-table.tsx`, near the top of the component:

```ts
const [pagination, setPagination] = useState<PaginationState>({
  pageIndex: 0,
  pageSize: 25,   // change this
})
```

### Default column pin / sort / visibility

Same file — pre-populate the initial state:

```ts
const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
  left: ["select", "companyName"],   // pin company name to the left by default
  right: [],
})

const [sorting, setSorting] = useState<SortingState>([
  { id: "companyName", desc: false },   // sort by company name ascending by default
])
```

### Cell rendering (badges, formatting, etc.)

Open `columns.tsx`. The `cell` function for each column is JSX — render whatever you want. The State column is already a `<Badge>`; copy that pattern for any other column.

---

## Performance notes

- Rows are virtualized — only ~20 rows are in the DOM at any time, regardless of dataset size.
- Sorting / filtering recompute on every keystroke. For 10k+ rows on slower devices, wrap your `data` prop in a debounced source or memoize aggressively.
- Bundle weight added: TanStack Table + react-virtual + Radix UI total ~280kB gzipped (if you don't already have these).

---

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| `Cannot find module '@/...'` | Path alias not set up. Add `"paths": { "@/*": ["./src/*"] }` to `tsconfig.json` and the equivalent in your bundler (Vite: `resolve.alias`). |
| Columns look unstyled | Tailwind isn't scanning the data-table folder. With `@tailwindcss/vite` this should be automatic — check that your CSS imports `tailwindcss`. |
| Dropdowns appear behind other content | Stacking-context issue in your layout. Dropdowns use Radix portals, so this is rare — check for ancestor `transform` / `filter` / `overflow: hidden` on parents. |
| Pinned columns look wrong in dark mode | Adjust the `boxShadow` values in the `getPinningStyles` helper inside `data-table.tsx`. |
| `oklch(from ...)` not rendering on older browsers | The relative-color syntax used for pinned-cell hover is a 2024+ feature. Swap to a static color or Tailwind class if you need to support older Safari/Firefox. |

---

## Demo

This repo also has a demo at `src/App.tsx` showing the table inside a mock host shell (navbar, page header, theme toggle). Run `npm run dev` and visit http://localhost:5173/ to see it. The demo isn't part of what you copy — it just shows the integration shape.
