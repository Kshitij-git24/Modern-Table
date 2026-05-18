import type { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ColumnHeader } from "./column-header"
import type { Company } from "./types"

export const companyColumns: ColumnDef<Company>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all rows on this page"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div
        className="flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={`Select row ${row.index + 1}`}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    enablePinning: false,
    size: 40,
  },
  {
    accessorKey: "companyName",
    header: ({ column }) => <ColumnHeader column={column} title="Company Name" />,
    cell: ({ row }) => (
      <div className="font-medium text-foreground">
        {row.getValue("companyName")}
      </div>
    ),
    size: 240,
  },
  {
    accessorKey: "accountNumber",
    header: ({ column }) => <ColumnHeader column={column} title="Account #" />,
    cell: ({ row }) => (
      <div className="font-mono text-sm text-muted-foreground">
        {row.getValue("accountNumber")}
      </div>
    ),
    size: 130,
  },
  {
    accessorKey: "streetAddress",
    header: ({ column }) => <ColumnHeader column={column} title="Street Address" />,
    cell: ({ row }) => (
      <div className="truncate text-sm text-foreground/90" title={row.getValue("streetAddress")}>
        {row.getValue("streetAddress")}
      </div>
    ),
    size: 240,
  },
  {
    accessorKey: "city",
    header: ({ column }) => <ColumnHeader column={column} title="City" />,
    cell: ({ row }) => (
      <div className="text-sm text-foreground/90">{row.getValue("city")}</div>
    ),
    size: 150,
  },
  {
    accessorKey: "state",
    header: ({ column }) => <ColumnHeader column={column} title="State" />,
    cell: ({ row }) => (
      <Badge variant="secondary" className="font-mono text-[11px] tracking-wider">
        {row.getValue("state")}
      </Badge>
    ),
    size: 90,
  },
  {
    accessorKey: "zip",
    header: ({ column }) => <ColumnHeader column={column} title="Zip" />,
    cell: ({ row }) => (
      <div className="font-mono text-sm text-muted-foreground">
        {row.getValue("zip")}
      </div>
    ),
    size: 100,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <ColumnHeader column={column} title="Email" />,
    cell: ({ row }) => (
      <div className="truncate text-sm text-foreground/90" title={row.getValue("email")}>
        {row.getValue("email")}
      </div>
    ),
    size: 240,
  },
]
