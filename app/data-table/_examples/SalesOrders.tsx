"use client";

import {
  ColumnMetadata,
  DataTable,
} from "@/components/ui/data-table";

import { salesOrdersData } from "../data";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

type Row = {
  orderId: string;
  customer: string;
  product: string;
  quantity: number;
  unitPrice: number;
  total: number;
  orderDate: string;
};

const columnsMetadata = [
  {
    columnId: "orderId",
    title: "Order ID",
    type: "text",
    sortable: true,
    hideable: false,
  },
  {
    columnId: "customer",
    title: "Customer",
    type: "text",
    sortable: true,
    filters: { text: true },
  },
  {
    columnId: "product",
    title: "Product",
    type: "text",
    sortable: true,
    inferOptions: true,
    filters: { checkboxSearch: true },
  },
  {
    columnId: "quantity",
    title: "Qty",
    type: "number",
    sortable: true,
    aligned: "right",
    filters: { number: true },
  },
  {
    columnId: "unitPrice",
    title: "Unit Price",
    type: "number",
    sortable: true,
    aligned: "right",
    filters: { number: true },
    formatter: (value: unknown) => (
      <span className="tabular-nums">{formatCurrency(value as number)}</span>
    ),
    filterValueFormatter: formatCurrency,
  },
  {
    columnId: "total",
    title: "Total",
    type: "number",
    sortable: true,
    aligned: "right",
    filters: { number: true },
    formatter: (value: unknown) => (
      <span className="font-medium tabular-nums">{formatCurrency(value as number)}</span>
    ),
    filterValueFormatter: formatCurrency,
  },
  {
    columnId: "orderDate",
    title: "Order Date",
    type: "date",
    sortable: true,
    aligned: "left",
    filters: { date: true },
  },
] as const satisfies ColumnMetadata<Row>[];

export function SalesOrders() {
  return (
    <DataTable<Row>
      columnsMetadata={columnsMetadata}
      data={salesOrdersData}
      bordered
      enablePagination
      pageSize={10}
      enablePageSizeSelect
      tableName="sales_orders"
    />
  );
}
