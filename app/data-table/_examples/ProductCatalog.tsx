"use client";

import {
  ColumnMetadata,
  DataTable,
} from "@/components/ui/data-table";

import { productCatalogData } from "../data";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

type Row = {
  name: string;
  category: string;
  price: number;
  inStock: string;
};

const columnsMetadata = [
  {
    columnId: "name",
    title: "Product",
    type: "text",
    sortable: true,
  },
  {
    columnId: "category",
    title: "Category",
    type: "text",
    sortable: true,
  },
  {
    columnId: "price",
    title: "Price",
    type: "number",
    sortable: true,
    aligned: "right",
    formatter: (value: unknown) => (
      <span className="tabular-nums">{formatCurrency(value as number)}</span>
    ),
  },
  {
    columnId: "inStock",
    title: "In Stock",
    type: "text",
    sortable: true,
  },
] as const satisfies ColumnMetadata<Row>[];

export function ProductCatalog() {
  return (
    <DataTable<Row>
      columnsMetadata={columnsMetadata}
      data={productCatalogData}
      tableStyle="ghost"
      enablePagination={false}
      compact
      toolbarIconsOnly
      enableDownload={false}
      enableColumnOptions={false}
    />
  );
}
