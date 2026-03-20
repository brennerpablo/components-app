"use client";

import { DemoBreadcrumb } from "@/app/_components/DemoBreadcrumb";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { CloudInfrastructure } from "./_examples/CloudInfrastructure";
import { ProductCatalog } from "./_examples/ProductCatalog";
import { ProjectTasks } from "./_examples/ProjectTasks";
import { SalesOrders } from "./_examples/SalesOrders";
import { StockTracker } from "./_examples/StockTracker";
import { TeamDirectory } from "./_examples/TeamDirectory";
import { DataTableDocs } from "./docs";

export default function DataTablePage() {
  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <DemoBreadcrumb />
        <h1 className="mb-6 text-2xl font-semibold tracking-tight">
          DataTable
        </h1>

        <Tabs defaultValue="tasks">
          <TabsList variant="line">
            <TabsTrigger value="tasks">Project Tasks</TabsTrigger>
            <TabsTrigger value="cloud">Cloud Infrastructure</TabsTrigger>
            <TabsTrigger value="team">Team Directory</TabsTrigger>
            <TabsTrigger value="sales">Sales Orders</TabsTrigger>
            <TabsTrigger value="catalog">Product Catalog</TabsTrigger>
            <TabsTrigger value="stocks">Stock Tracker</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks">
            <ProjectTasks />
          </TabsContent>
          <TabsContent value="cloud">
            <CloudInfrastructure />
          </TabsContent>
          <TabsContent value="team">
            <TeamDirectory />
          </TabsContent>
          <TabsContent value="sales">
            <SalesOrders />
          </TabsContent>
          <TabsContent value="catalog">
            <ProductCatalog />
          </TabsContent>
          <TabsContent value="stocks">
            <StockTracker />
          </TabsContent>
        </Tabs>

        <DataTableDocs />
      </div>
    </main>
  );
}
