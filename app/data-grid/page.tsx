"use client";

import { DemoBreadcrumb } from "@/app/_components/DemoBreadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Employees } from "./_examples/Employees";
import { Servers } from "./_examples/Servers";
import { Transactions } from "./_examples/Transactions";
import { DataGridDocs } from "./docs";

export default function DataGridPage() {
  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <DemoBreadcrumb />
        <h1 className="mb-1 text-2xl font-semibold tracking-tight">DataGrid</h1>
        <p className="mb-6 max-w-3xl text-sm text-muted-foreground">
          A virtualized, spreadsheet-style grid: server-ready windowed data,
          Excel-style per-column filters, cell/row/column selection with
          clipboard copy, drag-to-reorder &amp; resize columns, frozen columns,
          saved views, CSV/XLSX export, and English/Portuguese chrome. These
          demos run fully client-side via <code>useClientGridSource</code>.
        </p>
        <Tabs defaultValue="transactions">
          <TabsList variant="line">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="servers">Servers</TabsTrigger>
          </TabsList>
          <TabsContent value="transactions">
            <Transactions />
          </TabsContent>
          <TabsContent value="employees">
            <Employees />
          </TabsContent>
          <TabsContent value="servers">
            <Servers />
          </TabsContent>
        </Tabs>
        <DataGridDocs />
      </div>
    </main>
  );
}
