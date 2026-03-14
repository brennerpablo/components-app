"use client";

import { BarChart2, Settings, User } from "lucide-react";

import { ComponentDoc } from "@/components/ui/component-doc";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TabsPage() {
  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
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

        <ComponentDoc
          title="Tabs"
          description="Accessible tabbed navigation built on Radix UI Tabs. Supports line and solid variants with icon support, disabled states, and keyboard navigation."
          usage={`import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

<Tabs defaultValue="overview">
  <TabsList variant="line">
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="settings" disabled>Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Overview content</TabsContent>
  <TabsContent value="settings">Settings content</TabsContent>
</Tabs>`}
          propSections={[
            {
              title: "Tabs props",
              props: [
                {
                  name: "defaultValue",
                  type: "string",
                  description:
                    "The value of the tab that should be active by default.",
                },
                {
                  name: "value",
                  type: "string",
                  description: "Controlled active tab value.",
                },
                {
                  name: "onValueChange",
                  type: "(value: string) => void",
                  description: "Callback fired when the active tab changes.",
                },
                {
                  name: "className",
                  type: "string",
                  description: "Additional CSS classes for the root element.",
                },
              ],
            },
            {
              title: "TabsList props",
              props: [
                {
                  name: "variant",
                  type: '"line" | "solid"',
                  default: '"line"',
                  description:
                    'Visual style. "line" shows an underline indicator; "solid" shows a pill with background.',
                },
                {
                  name: "className",
                  type: "string",
                  description: "Additional CSS classes.",
                },
              ],
            },
            {
              title: "TabsTrigger props",
              props: [
                {
                  name: "value",
                  type: "string",
                  required: true,
                  description: "The value that identifies this tab.",
                },
                {
                  name: "disabled",
                  type: "boolean",
                  default: "false",
                  description: "Disables interaction with the trigger.",
                },
                {
                  name: "className",
                  type: "string",
                  description: "Additional CSS classes.",
                },
              ],
            },
            {
              title: "TabsContent props",
              props: [
                {
                  name: "value",
                  type: "string",
                  required: true,
                  description:
                    "Must match the corresponding TabsTrigger value.",
                },
                {
                  name: "className",
                  type: "string",
                  description: "Additional CSS classes.",
                },
              ],
            },
          ]}
        />
      </div>
    </main>
  );
}
