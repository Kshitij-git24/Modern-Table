import { useMemo } from "react"
import { Building2 } from "lucide-react"
import { CompanyTable, type Company } from "@/components/data-table"
import { generateMockCompanies } from "@/lib/mock-data"

function App() {
  const companies = useMemo(() => generateMockCompanies(5000), [])

  const handleRowClick = (company: Company) => {
    console.log("Row clicked — would navigate to detail page:", company)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-foreground text-background">
              <Building2 className="size-4" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold">CompanyHub</span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Demo host shell
              </span>
            </div>
          </div>
          <nav className="hidden items-center gap-1 text-sm text-muted-foreground md:flex">
            <span className="rounded-md px-3 py-1.5 font-medium text-foreground">
              Companies
            </span>
            <span className="rounded-md px-3 py-1.5 transition-colors hover:text-foreground">
              Reports
            </span>
            <span className="rounded-md px-3 py-1.5 transition-colors hover:text-foreground">
              Settings
            </span>
          </nav>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Theme lives in the table →
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-6 py-10">
        <div className="mb-8 flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Companies</h1>
          <p className="text-sm text-muted-foreground">
            Browse and search across{" "}
            <span className="font-medium text-foreground">
              {companies.length.toLocaleString()}
            </span>{" "}
            company records. Click any row to open its detail page.
          </p>
        </div>

        <CompanyTable
          data={companies}
          onRowClick={handleRowClick}
          csvFilename="companies"
          showThemeToggle
        />
      </main>
    </div>
  )
}

export default App
