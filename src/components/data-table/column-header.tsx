import type { Column } from "@tanstack/react-table"
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  PinOff,
  PinIcon,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>
  title: string
  className?: string
}

export function ColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: ColumnHeaderProps<TData, TValue>) {
  const canSort = column.getCanSort()
  const canPin = column.getCanPin()
  const sorted = column.getIsSorted()
  const pinned = column.getIsPinned()

  if (!canSort && !canPin) {
    return <div className={cn("text-xs font-semibold uppercase tracking-wider text-muted-foreground", className)}>{title}</div>
  }

  return (
    <div className={cn("flex items-center", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 gap-1.5 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:bg-accent hover:text-foreground data-[state=open]:bg-accent data-[state=open]:text-foreground"
          >
            <span>{title}</span>
            {sorted === "desc" ? (
              <ArrowDown className="size-3.5" />
            ) : sorted === "asc" ? (
              <ArrowUp className="size-3.5" />
            ) : (
              <ArrowUpDown className="size-3.5 opacity-50" />
            )}
            {pinned ? (
              <PinIcon className="size-3 ml-0.5 text-primary fill-primary/20" />
            ) : null}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-44">
          {canSort && (
            <>
              <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                <ArrowUp className="mr-2 size-3.5 text-muted-foreground" />
                Sort ascending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                <ArrowDown className="mr-2 size-3.5 text-muted-foreground" />
                Sort descending
              </DropdownMenuItem>
              {sorted && (
                <DropdownMenuItem onClick={() => column.clearSorting()}>
                  <ArrowUpDown className="mr-2 size-3.5 text-muted-foreground" />
                  Clear sort
                </DropdownMenuItem>
              )}
            </>
          )}
          {canSort && canPin && <DropdownMenuSeparator />}
          {canPin && (
            <>
              <DropdownMenuItem
                onClick={() => column.pin("left")}
                disabled={pinned === "left"}
              >
                <ChevronsLeft className="mr-2 size-3.5 text-muted-foreground" />
                Pin to left
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => column.pin("right")}
                disabled={pinned === "right"}
              >
                <ChevronsRight className="mr-2 size-3.5 text-muted-foreground" />
                Pin to right
              </DropdownMenuItem>
              {pinned && (
                <DropdownMenuItem onClick={() => column.pin(false)}>
                  <PinOff className="mr-2 size-3.5 text-muted-foreground" />
                  Unpin
                </DropdownMenuItem>
              )}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
