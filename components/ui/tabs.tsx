"use client";

import { Tabs } from "radix-ui";
import * as React from "react";

import { cn } from "@/lib/utils";

type TabsVariant = "line" | "solid";

const TabsVariantContext = React.createContext<TabsVariant>("line");

function TabsRoot({
  className,
  ...props
}: React.ComponentProps<typeof Tabs.Root>) {
  return (
    <Tabs.Root
      className={cn("w-full", className)}
      {...props}
    />
  );
}

function TabsList({
  variant = "line",
  className,
  children,
  ...props
}: React.ComponentProps<typeof Tabs.List> & { variant?: TabsVariant }) {
  return (
    <TabsVariantContext.Provider value={variant}>
      <Tabs.List
        className={cn(
          variant === "line" &&
            "flex items-end gap-1 border-b border-border",
          variant === "solid" &&
            "inline-flex items-center rounded-lg bg-muted p-1 gap-1",
          className,
        )}
        {...props}
      >
        {children}
      </Tabs.List>
    </TabsVariantContext.Provider>
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof Tabs.Trigger>) {
  const variant = React.useContext(TabsVariantContext);
  return (
    <Tabs.Trigger
      className={cn(
        "inline-flex items-center gap-1.5 font-medium text-sm transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50",
        variant === "line" &&
          "px-3 pb-2 text-muted-foreground hover:text-foreground border-b-2 border-transparent -mb-px data-[state=active]:text-foreground data-[state=active]:border-foreground",
        variant === "solid" &&
          "px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof Tabs.Content>) {
  return (
    <Tabs.Content
      className={cn("mt-4 outline-none", className)}
      {...props}
    />
  );
}

export { TabsRoot as Tabs, TabsContent,TabsList, TabsTrigger };
