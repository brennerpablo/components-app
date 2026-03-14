"use client";

import { BarChart2, Settings, User } from "lucide-react";

import { DemoBreadcrumb } from "@/app/_components/DemoBreadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { TabsDocs } from "./docs";

export default function TabsPage() {
  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <DemoBreadcrumb />
        <h1 className="mb-6 text-2xl font-semibold tracking-tight">Tabs</h1>

        {/* Line variant */}
        <section className="space-y-3">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Line
          </h2>
          <Tabs defaultValue="overview">
            <TabsList variant="line">
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
            <TabsContent value="overview">
              <div className="rounded-lg border border-border bg-muted/30 p-6 text-sm text-muted-foreground">
                Overview content — charts, summaries, and key metrics go here.
              </div>
            </TabsContent>
            <TabsContent value="account">
              <div className="rounded-lg border border-border bg-muted/30 p-6 text-sm text-muted-foreground">
                Account content — user profile, avatar, and preferences.
              </div>
            </TabsContent>
            <TabsContent value="settings">
              <div className="rounded-lg border border-border bg-muted/30 p-6 text-sm text-muted-foreground">
                Settings content — notifications, integrations, and advanced
                options.
              </div>
            </TabsContent>
            <TabsContent value="billing">
              <div className="rounded-lg border border-border bg-muted/30 p-6 text-sm text-muted-foreground">
                Billing content.
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Solid variant */}
        <section className="space-y-3">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Solid
          </h2>
          <Tabs defaultValue="overview">
            <TabsList variant="solid">
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
            <TabsContent value="overview">
              <div className="rounded-lg border border-border bg-muted/30 p-6 text-sm text-muted-foreground">
                Overview content — charts, summaries, and key metrics go here.
              </div>
            </TabsContent>
            <TabsContent value="account">
              <div className="rounded-lg border border-border bg-muted/30 p-6 text-sm text-muted-foreground">
                Account content — user profile, avatar, and preferences.
              </div>
            </TabsContent>
            <TabsContent value="settings">
              <div className="rounded-lg border border-border bg-muted/30 p-6 text-sm text-muted-foreground">
                Settings content — notifications, integrations, and advanced
                options.
              </div>
            </TabsContent>
            <TabsContent value="billing">
              <div className="rounded-lg border border-border bg-muted/30 p-6 text-sm text-muted-foreground">
                Billing content.
              </div>
            </TabsContent>
          </Tabs>
        </section>

        <TabsDocs />
      </div>
    </main>
  );
}
