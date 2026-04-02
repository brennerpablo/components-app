"use client"

import { useState } from "react"

import { EditableGrid } from "@/components/ui/editable-grid"
import type { EditableColumnDef } from "@/components/ui/editable-grid"

// --- Types ---

type Product = {
  sku: string
  name: string
  category: string
  brand: string
  supplier: string
  status: string
  warehouse: string
  unitCost: number
  unitPrice: number
  stockQty: number
  reorderLevel: number
  weight: number
  lastRestocked: string
  discontinued: boolean
  notes: string
}

// --- Options ---

const categories = [
  { value: "electronics", label: "Electronics" },
  { value: "furniture", label: "Furniture" },
  { value: "clothing", label: "Clothing" },
  { value: "food", label: "Food & Beverage" },
  { value: "tools", label: "Tools & Hardware" },
  { value: "sports", label: "Sports & Outdoors" },
  { value: "office", label: "Office Supplies" },
  { value: "automotive", label: "Automotive" },
  { value: "health", label: "Health & Beauty" },
  { value: "toys", label: "Toys & Games" },
]

const statuses = [
  { value: "in_stock", label: "In Stock" },
  { value: "low_stock", label: "Low Stock" },
  { value: "out_of_stock", label: "Out of Stock" },
  { value: "backordered", label: "Backordered" },
  { value: "pre_order", label: "Pre-order" },
]

const warehouses = [
  { value: "wh-east", label: "East Coast" },
  { value: "wh-west", label: "West Coast" },
  { value: "wh-central", label: "Central" },
  { value: "wh-south", label: "South" },
  { value: "wh-north", label: "North" },
]

const suppliers = [
  { value: "acme", label: "Acme Corp" },
  { value: "globex", label: "Globex Inc" },
  { value: "initech", label: "Initech" },
  { value: "umbrella", label: "Umbrella Ltd" },
  { value: "wayne", label: "Wayne Enterprises" },
  { value: "stark", label: "Stark Industries" },
  { value: "oscorp", label: "Oscorp" },
  { value: "lexcorp", label: "LexCorp" },
]

// --- Columns ---

const columns: EditableColumnDef<Product>[] = [
  { columnId: "sku", title: "SKU", type: "text", readonly: true, width: 110, sortable: true },
  { columnId: "name", title: "Product Name", type: "text", validation: { required: true, minLength: 2 }, width: 200, sortable: true },
  { columnId: "category", title: "Category", type: "select", options: categories, width: 150, sortable: true },
  { columnId: "brand", title: "Brand", type: "text", width: 130, sortable: true },
  { columnId: "supplier", title: "Supplier", type: "select", options: suppliers, width: 160 },
  { columnId: "status", title: "Status", type: "select", options: statuses, width: 130 },
  { columnId: "warehouse", title: "Warehouse", type: "select", options: warehouses, width: 130 },
  {
    columnId: "unitCost",
    title: "Unit Cost",
    type: "number",
    aligned: "right",
    validation: { min: 0 },
    width: 110,
    sortable: true,
    formatter: (v) => `$${(v as number).toFixed(2)}`,
  },
  {
    columnId: "unitPrice",
    title: "Unit Price",
    type: "number",
    aligned: "right",
    validation: { min: 0 },
    width: 110,
    formatter: (v) => `$${(v as number).toFixed(2)}`,
  },
  {
    columnId: "stockQty",
    title: "Stock Qty",
    type: "number",
    aligned: "right",
    validation: { min: 0 },
    width: 100,
    sortable: true,
    formatter: (v) => (v as number).toLocaleString(),
  },
  {
    columnId: "reorderLevel",
    title: "Reorder Level",
    type: "number",
    aligned: "right",
    validation: { min: 0 },
    width: 120,
  },
  {
    columnId: "weight",
    title: "Weight (kg)",
    type: "number",
    aligned: "right",
    validation: { min: 0 },
    width: 110,
    formatter: (v) => `${(v as number).toFixed(1)} kg`,
  },
  { columnId: "lastRestocked", title: "Last Restocked", type: "date", width: 150 },
  { columnId: "discontinued", title: "Discontinued", type: "checkbox", aligned: "center", width: 110 },
  { columnId: "notes", title: "Notes", type: "text", placeholder: "Add notes...", width: 200 },
]

// --- Data generator ---

const firstWords = ["Ultra", "Pro", "Max", "Eco", "Smart", "Premium", "Lite", "Turbo", "Flex", "Core"]
const secondWords = ["Widget", "Gadget", "Sensor", "Module", "Drive", "Panel", "Board", "Router", "Adapter", "Cable"]
const thirdWords = ["X1", "V2", "Z3", "A4", "S5", "R6", "T7", "M8", "K9", "P10"]
const brands = ["TechFlow", "NovaCo", "Pinnacle", "Zenith", "Apex", "Vertex", "Summit", "Quantum", "Helix", "Prism"]

function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

function generateProducts(count: number): Product[] {
  const rand = seededRandom(42)
  const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)]
  const catValues = categories.map((c) => c.value)
  const statusValues = statuses.map((s) => s.value)
  const whValues = warehouses.map((w) => w.value)
  const suppValues = suppliers.map((s) => s.value)

  return Array.from({ length: count }, (_, i) => {
    const unitCost = Math.round((rand() * 500 + 1) * 100) / 100
    const margin = 1.15 + rand() * 0.85
    const year = 2023 + Math.floor(rand() * 3)
    const month = String(Math.floor(rand() * 12) + 1).padStart(2, "0")
    const day = String(Math.floor(rand() * 28) + 1).padStart(2, "0")

    return {
      sku: `SKU-${String(i + 1).padStart(5, "0")}`,
      name: `${pick(firstWords)} ${pick(secondWords)} ${pick(thirdWords)}`,
      category: pick(catValues),
      brand: pick(brands),
      supplier: pick(suppValues),
      status: pick(statusValues),
      warehouse: pick(whValues),
      unitCost,
      unitPrice: Math.round(unitCost * margin * 100) / 100,
      stockQty: Math.floor(rand() * 5000),
      reorderLevel: Math.floor(rand() * 200) + 10,
      weight: Math.round((rand() * 50 + 0.1) * 10) / 10,
      lastRestocked: `${year}-${month}-${day}`,
      discontinued: rand() < 0.1,
      notes: rand() < 0.3 ? pick(["Fragile", "Oversized", "Flammable", "Best seller", "Seasonal", "Clearance", "New arrival"]) : "",
    }
  })
}

const initialProducts = generateProducts(200)

// --- Component ---

let nextSku = 201

export function ProductInventory() {
  const [data, setData] = useState<Product[]>(initialProducts)

  const handleCellChange = (
    rowId: string | number,
    columnId: string,
    value: unknown
  ) => {
    setData((prev) =>
      prev.map((row) =>
        row.sku === rowId ? { ...row, [columnId]: value } : row
      )
    )
  }

  const handleAddRow = () => {
    const sku = `SKU-${String(nextSku++).padStart(5, "0")}`
    setData((prev) => [
      ...prev,
      {
        sku,
        name: "",
        category: "electronics",
        brand: "",
        supplier: "acme",
        status: "in_stock",
        warehouse: "wh-east",
        unitCost: 0,
        unitPrice: 0,
        stockQty: 0,
        reorderLevel: 50,
        weight: 0,
        lastRestocked: new Date().toISOString().split("T")[0],
        discontinued: false,
        notes: "",
      },
    ])
  }

  const handleDeleteRows = (rowIds: (string | number)[]) => {
    setData((prev) => prev.filter((row) => !rowIds.includes(row.sku)))
  }

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-3">
        200 rows, 15 columns — the grid fills its container and scrolls both axes. Header stays pinned.
      </p>
      {/* Height-constrained container — the grid fills it and scrolls */}
      <div className="bg-card h-150">
        <EditableGrid<Product>
          columns={columns}
          data={data}
          rowIdKey="sku"
          onCellChange={handleCellChange}
          bordered
          compact
          alwaysShowScrollbars
          stickyColumns={1}
          accentColor="indigo-500"
        />
      </div>
    </div>
  )
}
