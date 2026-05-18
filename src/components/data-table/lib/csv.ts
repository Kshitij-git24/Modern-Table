import type { Company } from "../types"

const CSV_HEADERS: { key: keyof Company; label: string }[] = [
  { key: "companyName", label: "Company Name" },
  { key: "accountNumber", label: "Account Number" },
  { key: "streetAddress", label: "Street Address" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "zip", label: "Zip" },
  { key: "email", label: "Email" },
]

function escapeCell(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export function companiesToCsv(rows: Company[]): string {
  const header = CSV_HEADERS.map((h) => escapeCell(h.label)).join(",")
  const body = rows
    .map((row) =>
      CSV_HEADERS.map((h) => escapeCell(String(row[h.key] ?? ""))).join(",")
    )
    .join("\n")
  return `${header}\n${body}`
}

export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
