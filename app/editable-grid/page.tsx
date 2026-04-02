"use client"

import { useState } from "react"

import { DemoBreadcrumb } from "@/app/_components/DemoBreadcrumb"
import { ComponentDoc } from "@/components/ui/component-doc"
import { EditableGrid } from "@/components/ui/editable-grid"
import type { EditableColumnDef } from "@/components/ui/editable-grid"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import { ProductInventory } from "./_examples/ProductInventory"
import { type Employee, departments, initialEmployees } from "./data"

// --- Employee Directory (small example) ---

let nextId = 9

const employeeColumns: EditableColumnDef<Employee>[] = [
  {
    columnId: "id",
    title: "ID",
    type: "text",
    readonly: true,
    width: 100,
  },
  {
    columnId: "name",
    title: "Name",
    type: "text",
    placeholder: "Employee name",
    validation: { required: true, minLength: 2 },
  },
  {
    columnId: "department",
    title: "Department",
    type: "select",
    options: departments,
  },
  {
    columnId: "startDate",
    title: "Start Date",
    type: "date",
  },
  {
    columnId: "salary",
    title: "Salary",
    type: "number",
    aligned: "right",
    validation: { min: 0 },
    formatter: (value) =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(value as number),
  },
  {
    columnId: "active",
    title: "Active",
    type: "checkbox",
    aligned: "center",
  },
]

function EmployeeDirectory({ lang }: { lang: "en" | "pt" }) {
  const [data, setData] = useState<Employee[]>(initialEmployees)

  const handleCellChange = (
    rowId: string | number,
    columnId: string,
    value: unknown
  ) => {
    setData((prev) =>
      prev.map((row) =>
        row.id === rowId ? { ...row, [columnId]: value } : row
      )
    )
  }

  const handleAddRow = () => {
    const id = `EMP-${String(nextId++).padStart(3, "0")}`
    setData((prev) => [
      ...prev,
      {
        id,
        name: "",
        department: "engineering",
        startDate: new Date().toISOString().split("T")[0],
        salary: 0,
        active: true,
      },
    ])
  }

  const handleDeleteRows = (rowIds: (string | number)[]) => {
    setData((prev) => prev.filter((row) => !rowIds.includes(row.id)))
  }

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-3">
        8 rows, 6 columns — basic example with all cell types. ID column is readonly.
      </p>
      <div className="bg-card">
        <EditableGrid<Employee>
          columns={employeeColumns}
          data={data}
          rowIdKey="id"
          onCellChange={handleCellChange}
          onAddRow={handleAddRow}
          onDeleteRows={handleDeleteRows}
          enableAddRow
          enableDeleteRow
          enableRowSelection
          language={lang}
          bordered
        />
      </div>
    </div>
  )
}

// --- Page ---

export default function EditableGridPage() {
  const [lang, setLang] = useState<"en" | "pt">("en")

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <DemoBreadcrumb />
        <h1 className="mb-6 text-2xl font-semibold tracking-tight">
          EditableGrid
        </h1>

        {/* Language toggle */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm font-medium text-muted-foreground">
            Language:
          </span>
          <button
            className={`px-2 py-0.5 rounded text-sm ${lang === "en" ? "bg-foreground text-background" : "bg-muted"}`}
            onClick={() => setLang("en")}
          >
            EN
          </button>
          <button
            className={`px-2 py-0.5 rounded text-sm ${lang === "pt" ? "bg-foreground text-background" : "bg-muted"}`}
            onClick={() => setLang("pt")}
          >
            PT
          </button>
        </div>

        <Tabs defaultValue="employees">
          <TabsList variant="line">
            <TabsTrigger value="employees">Employee Directory</TabsTrigger>
            <TabsTrigger value="inventory">Product Inventory (200 rows)</TabsTrigger>
          </TabsList>

          <TabsContent value="employees">
            <EmployeeDirectory lang={lang} />
          </TabsContent>

          <TabsContent value="inventory">
            <ProductInventory />
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-xs text-muted-foreground">
          <p>
            Click any cell to edit. Readonly columns (ID, SKU) cannot be edited.
            Use <strong>Tab</strong> to move between cells,{" "}
            <strong>Enter</strong> to move down, <strong>Escape</strong> to
            cancel.
          </p>
        </div>

        <div className="mt-12">
          <ComponentDoc
            title="EditableGrid"
            description="An Excel-like spreadsheet component for editing structured datasets. Supports typed cells (text, number, date, select, checkbox, textarea), readonly columns for fixed identifiers, keyboard navigation, per-cell validation, and row add/delete."
            usage={`import { EditableGrid } from "@/components/ui/editable-grid"
import type { EditableColumnDef } from "@/components/ui/editable-grid"

const columns: EditableColumnDef<Row>[] = [
  { columnId: "id", title: "ID", type: "text", readonly: true },
  { columnId: "name", title: "Name", type: "text", validation: { required: true } },
  { columnId: "department", title: "Dept", type: "select", options: [...] },
  { columnId: "startDate", title: "Start", type: "date" },
  { columnId: "salary", title: "Salary", type: "number", aligned: "right" },
  { columnId: "active", title: "Active", type: "checkbox", aligned: "center" },
]

<EditableGrid<Row>
  columns={columns}
  data={data}
  rowIdKey="id"
  onCellChange={(rowId, columnId, value) => updateData(rowId, columnId, value)}
  onAddRow={() => addEmptyRow()}
  onDeleteRows={(ids) => removeRows(ids)}
  enableAddRow
  enableDeleteRow
  enableRowSelection
  bordered
/>`}
            propSections={[
              {
                title: "EditableGrid Props",
                props: [
                  { name: "columns", type: "EditableColumnDef<TData>[]", required: true, description: "Column definitions array." },
                  { name: "data", type: "TData[]", required: true, description: "The data array. Component is controlled — parent owns the data." },
                  { name: "rowIdKey", type: "keyof TData & string", required: true, description: "Property name used as unique row identifier (e.g. 'id', 'ssn')." },
                  { name: "onCellChange", type: "(rowId, columnId, newValue) => void", description: "Fired when a cell value is committed." },
                  { name: "onRowChange", type: "(rowId, updatedRow) => void", description: "Fired with the full updated row after a cell commit." },
                  { name: "onAddRow", type: "() => void", description: "Fired when the add-row button is clicked." },
                  { name: "onDeleteRows", type: "(rowIds) => void", description: "Fired when rows are deleted (single or bulk)." },
                  { name: "enableAddRow", type: "boolean", default: "false", description: "Show the add-row button at the bottom." },
                  { name: "enableDeleteRow", type: "boolean", default: "false", description: "Show per-row delete buttons and bulk delete." },
                  { name: "enableRowSelection", type: "boolean", default: "false", description: "Show row selection checkboxes." },
                  { name: "language", type: '"en" | "pt"', default: '"en"', description: "UI language for labels and validation messages." },
                  { name: "bordered", type: "boolean", default: "false", description: "Add borders to all cells." },
                  { name: "compact", type: "boolean", default: "false", description: "Reduce cell padding and font size." },
                  { name: "accentColor", type: "string", description: "Accent color for checkboxes. Supports color names, #hex, or rgb()." },
                  { name: "className", type: "string", description: "Additional class name for the outer wrapper." },
                ],
              },
              {
                title: "EditableColumnDef Fields",
                props: [
                  { name: "columnId", type: "keyof TData & string", required: true, description: "Data property key for this column." },
                  { name: "title", type: "string", required: true, description: "Column header label." },
                  { name: "type", type: "CellType", required: true, description: '"text" | "number" | "date" | "select" | "checkbox" | "textarea"' },
                  { name: "width", type: "number | string", description: "Fixed column width (px or CSS string)." },
                  { name: "readonly", type: "boolean", default: "false", description: "Visible but not editable (for ID columns)." },
                  { name: "options", type: "OptionItem[]", description: "Dropdown options. Required when type is 'select'." },
                  { name: "validation", type: "ValidationRule", description: "Per-cell validation: required, min, max, minLength, maxLength, pattern, custom." },
                  { name: "placeholder", type: "string", description: "Placeholder text shown in empty cells and inputs." },
                  { name: "formatter", type: "(value, row) => ReactNode", description: "Custom display formatter for when the cell is not being edited." },
                  { name: "aligned", type: '"left" | "center" | "right"', default: '"left"', description: "Text alignment within the cell." },
                ],
              },
              {
                title: "ValidationRule Fields",
                props: [
                  { name: "required", type: "boolean", description: "Value must not be empty." },
                  { name: "min", type: "number", description: "Minimum number value." },
                  { name: "max", type: "number", description: "Maximum number value." },
                  { name: "minLength", type: "number", description: "Minimum string length." },
                  { name: "maxLength", type: "number", description: "Maximum string length." },
                  { name: "pattern", type: "RegExp", description: "Regex pattern for text validation." },
                  { name: "custom", type: "(value, row) => string | null", description: "Custom validation function. Return error message or null." },
                ],
              },
            ]}
          />
        </div>
      </div>
    </main>
  )
}
