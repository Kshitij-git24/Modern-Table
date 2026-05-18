import type { Table } from "@tanstack/react-table"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Company } from "./types"

interface PaginationProps {
  table: Table<Company>
  totalRows: number
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100]

export function Pagination({ table, totalRows }: PaginationProps) {
  const { pageIndex, pageSize } = table.getState().pagination
  const filteredCount = table.getFilteredRowModel().rows.length
  const pageCount = Math.max(1, table.getPageCount())
  const selectedCount = table.getFilteredSelectedRowModel().rows.length
  const isFiltered = filteredCount !== totalRows

  const start = filteredCount === 0 ? 0 : pageIndex * pageSize + 1
  const end = Math.min((pageIndex + 1) * pageSize, filteredCount)

  return (
    <div className="flex flex-col gap-3 px-6 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-muted-foreground">
        {selectedCount > 0 && (
          <span className="text-foreground">
            <span className="font-semibold tabular-nums">
              {selectedCount.toLocaleString()}
            </span>{" "}
            selected{" · "}
          </span>
        )}
        Showing{" "}
        <span className="font-medium text-foreground tabular-nums">
          {start.toLocaleString()}
        </span>
        {"–"}
        <span className="font-medium text-foreground tabular-nums">
          {end.toLocaleString()}
        </span>{" "}
        of{" "}
        <span className="font-medium text-foreground tabular-nums">
          {filteredCount.toLocaleString()}
        </span>{" "}
        records
        {isFiltered && (
          <span className="text-muted-foreground/70">
            {" "}
            (filtered from {totalRows.toLocaleString()})
          </span>
        )}
      </div>
      <div className="flex items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden sm:inline">
            Rows per page
          </span>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger size="sm" className="h-8 w-[72px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={String(size)} className="text-xs">
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm font-medium tabular-nums">
          Page{" "}
          <span className="text-foreground">
            {(pageIndex + 1).toLocaleString()}
          </span>{" "}
          of{" "}
          <span className="text-muted-foreground">
            {pageCount.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            aria-label="First page"
          >
            <ChevronsLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Previous page"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Next page"
          >
            <ChevronRight className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.setPageIndex(pageCount - 1)}
            disabled={!table.getCanNextPage()}
            aria-label="Last page"
          >
            <ChevronsRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
