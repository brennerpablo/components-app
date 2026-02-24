import { DataTable } from "@/components/ui/data-table"
import { columns, formatCurrency } from "./columns"
import { usage, statuses, regions, conditions } from "./data"

export default function DataTablePage() {
  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-2xl font-semibold tracking-tight">
          Usage Overview
        </h1>
        <DataTable
          columns={columns}
          data={usage}
          statuses={statuses}
          regions={regions}
          conditions={conditions}
          currencyFormatter={formatCurrency}
        />
      </div>
    </main>
  )
}
