"use client";

import { BarChart2, Settings, User } from "lucide-react";

import { DemoBreadcrumb } from "@/app/_components/DemoBreadcrumb";
import type { TabsColor } from "@/components/ui/tabs";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { TabsDocs } from "./docs";

const colors: TabsColor[] = ["default", "blue", "emerald"];

function DemoTabs({ variant }: { variant: "line" | "solid" }) {
  return (
    <div className="space-y-4">
      {colors.map((color) => (
        <div key={color} className="flex items-start gap-4">
          <span className="w-16 shrink-0 pt-2 text-xs text-muted-foreground">
            {color}
          </span>
          <Tabs defaultValue="overview">
            <TabsList variant={variant} color={color}>
              <TabsTrigger value="overview">
                <BarChart2 className="size-3.5" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="account">
                <User className="size-3.5" />
                Account
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="size-3.5" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="billing" disabled>
                Billing
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      ))}
    </div>
  );
}

export default function TabsPage() {
  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-10">
        <DemoBreadcrumb />
        <h1 className="text-2xl font-semibold tracking-tight">Tabs</h1>

        {/* Line variant */}
        <section className="space-y-3">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Line
          </h2>
          <DemoTabs variant="line" />
        </section>

        {/* Solid variant */}
        <section className="space-y-3">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Solid
          </h2>
          <DemoTabs variant="solid" />
        </section>

        <TabsDocs />
      </div>
    </main>
  );
}
