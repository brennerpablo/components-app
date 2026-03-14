import { BarChart2, PanelTop, TableProperties, Tag } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ComponentEntry = {
  title: string;
  href: string;
  description: string;
  shortDescription: string;
  icon: LucideIcon;
  tags: string[];
};

export type ComponentSection = {
  title: string;
  compact?: boolean;
  components: ComponentEntry[];
};

export const COMPONENT_SECTIONS: ComponentSection[] = [
  {
    title: "Data Navigation",
    components: [
      {
        title: "Data Table",
        href: "/data-table",
        description:
          "A powerful, feature-rich table with sorting, filtering, pagination, bulk editing, and drag-and-drop column reordering.",
        shortDescription: "Sortable, filterable data grid",
        icon: TableProperties,
        tags: ["TanStack Table", "Drag & Drop", "Filters"],
      },
    ],
  },
  {
    title: "Data Visualization",
    components: [
      {
        title: "StatusMap",
        href: "/status-map",
        description:
          "A grid-based status map that renders rows × dates cells, each colored by a status key. Useful for operational dashboards.",
        shortDescription: "Matrix of coloured status cells",
        icon: BarChart2,
        tags: ["StatusMap", "date-fns", "Dark Mode"],
      },
    ],
  },
  {
    title: "UI",
    compact: true,
    components: [
      {
        title: "Tabs",
        href: "/ui/tabs",
        description:
          "Accessible tabbed navigation with line and solid variants. Supports icons, disabled states, and keyboard navigation.",
        shortDescription: "Accessible tabbed navigation",
        icon: PanelTop,
        tags: ["Radix UI", "Line", "Solid"],
      },
      {
        title: "Badge",
        href: "/ui/badge",
        description:
          "A small label component for displaying status, categories, or counts. Five semantic variants with light and dark mode support.",
        shortDescription: "Semantic status label",
        icon: Tag,
        tags: ["Status", "Semantic", "Dark Mode"],
      },
    ],
  },
];
