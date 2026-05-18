import { useMemo, useRef, useState, type CSSProperties } from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Column,
  type ColumnPinningState,
  type PaginationState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import { useVirtualizer } from "@tanstack/react-virtual"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { companyColumns } from "./columns"
import { Toolbar } from "./toolbar"
import { Pagination } from "./pagination"
import { companiesToCsv, downloadCsv } from "./lib/csv"
import { type Company, type SearchScope } from "./types"

interface CompanyTableProps {
  data: Company[]
  onRowClick?: (company: Company) => void
  csvFilename?: string
}

const SEARCHABLE_KEYS: Exclude<SearchScope, "all">[] = [
  "companyName",
  "accountNumber",
  "streetAddress",
  "city",
  "state",
  "zip",
  "email",
]

function getPinningStyles(column: Column<Company>): CSSProperties {
  const pinned = column.getIsPinned()
  if (!pinned) return {}
  const isLastLeft = pinned === "left" && column.getIsLastColumn("left")
  const isFirstRight = pinned === "right" && column.getIsFirstColumn("right")
  return {
    position: "sticky",
    left: pinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: pinned === "right" ? `${column.getAfter("right")}px` : undefined,
    zIndex: 2,
    boxShadow: isLastLeft
      ? "8px 0 12px -8px rgb(0 0 0 / 0.18)"
      : isFirstRight
        ? "-8px 0 12px -8px rgb(0 0 0 / 0.18)"
        : undefined,
  }
}

export function CompanyTable({
  data,
  onRowClick,
  csvFilename = "companies",
}: CompanyTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: [],
    right: [],
  })
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  })
  const [search, setSearch] = useState("")
  const [scope, setScope] = useState<SearchScope>("all")

  const globalFilterValue = useMemo(() => ({ search, scope }), [search, scope])

  const table = useReactTable({
    data,
    columns: companyColumns,
    state: {
      sorting,
      columnPinning,
      columnVisibility,
      rowSelection,
      pagination,
      globalFilter: globalFilterValue,
    },
    enableRowSelection: true,
    enableColumnPinning: true,
    getRowId: (row) => row.id,
    onSortingChange: setSorting,
    onColumnPinningChange: setColumnPinning,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    onGlobalFilterChange: () => {},
    globalFilterFn: (row, _columnId, filterValue) => {
      const { search: q, scope: s } = filterValue as {
        search: string
        scope: SearchScope
      }
      if (!q) return true
      const needle = q.toLowerCase()
      if (s === "all") {
        return SEARCHABLE_KEYS.some((k) =>
          String(row.getValue(k) ?? "")
            .toLowerCase()
            .includes(needle)
        )
      }
      return String(row.getValue(s) ?? "")
        .toLowerCase()
        .includes(needle)
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const handleSearchChange = (value: string) => {
    setSearch(value)
    table.setPageIndex(0)
  }

  const handleScopeChange = (value: SearchScope) => {
    setScope(value)
    table.setPageIndex(0)
  }

  const handleExportAll = () => {
    const rows = table.getFilteredRowModel().rows.map((r) => r.original)
    downloadCsv(`${csvFilename}-all.csv`, companiesToCsv(rows))
  }

  const handleExportSelected = () => {
    const rows = table
      .getFilteredSelectedRowModel()
      .rows.map((r) => r.original)
    if (rows.length === 0) return
    downloadCsv(`${csvFilename}-selected.csv`, companiesToCsv(rows))
  }

  const containerRef = useRef<HTMLDivElement>(null)
  const pageRows = table.getRowModel().rows
  const rowVirtualizer = useVirtualizer({
    count: pageRows.length,
    estimateSize: () => 48,
    getScrollElement: () => containerRef.current,
    overscan: 8,
  })

  const virtualRows = rowVirtualizer.getVirtualItems()
  const totalSize = rowVirtualizer.getTotalSize()
  const paddingTop = virtualRows.length > 0 ? virtualRows[0].start : 0
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - virtualRows[virtualRows.length - 1].end
      : 0

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <Toolbar
        table={table}
        search={search}
        onSearchChange={handleSearchChange}
        scope={scope}
        onScopeChange={handleScopeChange}
        onExportAll={handleExportAll}
        onExportSelected={handleExportSelected}
      />
      <Separator />
      <div
        ref={containerRef}
        className="relative max-h-[min(640px,calc(100svh-260px))] min-h-[320px] overflow-auto"
      >
        <Table style={{ width: table.getTotalSize() }}>
          <TableHeader className="sticky top-0 z-20 bg-muted/80 backdrop-blur-md">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-border/60 hover:bg-transparent"
              >
                {headerGroup.headers.map((header) => {
                  const pinned = header.column.getIsPinned()
                  return (
                    <TableHead
                      key={header.id}
                      style={{
                        width: header.getSize(),
                        ...getPinningStyles(header.column),
                        ...(pinned ? { background: "hsl(from var(--muted) h s l / 0.95)" } : {}),
                      }}
                      className={cn(
                        "h-11 px-3 align-middle text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                        pinned && "bg-muted/95 backdrop-blur-md"
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {pageRows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={table.getAllLeafColumns().length}
                  className="h-48 text-center text-sm text-muted-foreground"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
            {paddingTop > 0 && (
              <tr aria-hidden>
                <td colSpan={table.getAllLeafColumns().length} style={{ height: paddingTop }} />
              </tr>
            )}
            {virtualRows.map((virtualRow) => {
              const row = pageRows[virtualRow.index]
              const isSelected = row.getIsSelected()
              return (
                <TableRow
                  key={row.id}
                  data-state={isSelected ? "selected" : undefined}
                  onClick={() => onRowClick?.(row.original)}
                  className={cn(
                    "group cursor-pointer transition-colors border-b border-border/40 last:border-b-0",
                    "hover:bg-accent/40 focus-visible:bg-accent/40",
                    "data-[state=selected]:bg-primary/5 data-[state=selected]:hover:bg-primary/10"
                  )}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onRowClick?.(row.original)
                  }}
                  style={{ height: `${virtualRow.size}px` }}
                >
                  {row.getVisibleCells().map((cell) => {
                    const pinned = cell.column.getIsPinned()
                    return (
                      <TableCell
                        key={cell.id}
                        style={{
                          width: cell.column.getSize(),
                          ...getPinningStyles(cell.column),
                        }}
                        className={cn(
                          "px-3 py-0",
                          pinned &&
                            "bg-card group-hover:bg-[oklch(from_var(--accent)_l_c_h_/_0.4)] group-data-[state=selected]:bg-[oklch(from_var(--primary)_l_c_h_/_0.05)]"
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
            {paddingBottom > 0 && (
              <tr aria-hidden>
                <td colSpan={table.getAllLeafColumns().length} style={{ height: paddingBottom }} />
              </tr>
            )}
          </TableBody>
        </Table>
      </div>
      <Separator />
      <Pagination table={table} totalRows={data.length} />
    </div>
  )
}
