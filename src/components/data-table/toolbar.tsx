import type { Table } from "@tanstack/react-table"
import {
  Search,
  X,
  Settings2,
  Download,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { SEARCH_SCOPES, type Company, type SearchScope } from "./types"

interface ToolbarProps {
  table: Table<Company>
  search: string
  onSearchChange: (value: string) => void
  scope: SearchScope
  onScopeChange: (value: SearchScope) => void
  onExportAll: () => void
  onExportSelected: () => void
  className?: string
}

const COLUMN_LABELS: Record<string, string> = {
  companyName: "Company Name",
  accountNumber: "Account #",
  streetAddress: "Street Address",
  city: "City",
  state: "State",
  zip: "Zip",
  email: "Email",
}

export function Toolbar({
  table,
  search,
  onSearchChange,
  scope,
  onScopeChange,
  onExportAll,
  onExportSelected,
  className,
}: ToolbarProps) {
  const selectedCount = table.getFilteredSelectedRowModel().rows.length
  const filteredCount = table.getFilteredRowModel().rows.length
  const hideableColumns = table
    .getAllColumns()
    .filter((c) => c.getCanHide() && c.id !== "select")

  return (
    <div
      className={cn(
        "flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="flex w-full items-center rounded-lg border bg-background shadow-sm ring-1 ring-transparent transition focus-within:ring-ring/40 focus-within:border-ring/60 sm:w-auto sm:min-w-[420px] sm:max-w-[560px] sm:flex-1">
        <Select value={scope} onValueChange={(v) => onScopeChange(v as SearchScope)}>
          <SelectTrigger
            size="sm"
            className="border-0 shadow-none rounded-r-none bg-transparent focus-visible:ring-0 focus-visible:border-0 w-[120px] sm:w-[150px] text-xs font-medium text-muted-foreground"
          >
            <SelectValue placeholder="All columns" />
          </SelectTrigger>
          <SelectContent>
            {SEARCH_SCOPES.map((s) => (
              <SelectItem key={s.value} value={s.value} className="text-xs">
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Separator orientation="vertical" className="!h-5" />
        <div className="relative flex min-w-0 flex-1 items-center">
          <Search className="absolute left-2.5 size-3.5 text-muted-foreground pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search..."
            className="border-0 shadow-none rounded-l-none bg-transparent pl-8 pr-8 h-9 text-sm focus-visible:ring-0 focus-visible:border-0"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2 rounded-sm p-0.5 text-muted-foreground hover:bg-accent hover:text-foreground transition"
              aria-label="Clear search"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-1.5">
              <Settings2 className="size-3.5" />
              <span className="hidden sm:inline">Columns</span>
              <ChevronDown className="size-3.5 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-xs">Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {hideableColumns.map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                className="text-sm capitalize"
              >
                {COLUMN_LABELS[column.id] ?? column.id}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="h-9 gap-1.5">
              <Download className="size-3.5" />
              Export
              <ChevronDown className="size-3.5 opacity-80" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={onExportAll} className="text-sm">
              <Download className="mr-2 size-3.5 text-muted-foreground" />
              Export all filtered
              <span className="ml-auto text-xs text-muted-foreground">
                {filteredCount.toLocaleString()}
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onExportSelected}
              disabled={selectedCount === 0}
              className="text-sm"
            >
              <Download className="mr-2 size-3.5 text-muted-foreground" />
              Export selected
              <span className="ml-auto text-xs text-muted-foreground">
                {selectedCount.toLocaleString()}
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
