import type { LucideIcon } from "lucide-react";
import { AreaChart as AreaChartIcon, BarChart2, BarChart3, GaugeCircle, PanelTop, PieChart, TableProperties, Tag } from "lucide-react";

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
    title: "Rich Components",
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
      {
        title: "Area Chart",
        href: "/charts/area-chart",
        description:
          "A responsive area chart with single and multi-series support, gradient/solid fill, stacked and percentage modes, and interactive legend.",
        shortDescription: "Multi-series area chart",
        icon: AreaChartIcon,
        tags: ["Recharts", "Tremor", "Interactive"],
      },
      {
        title: "Bar Chart",
        href: "/charts/bar-chart",
        description:
          "A responsive bar chart with vertical and horizontal layouts, stacked and percentage modes, interactive legend, and click events.",
        shortDescription: "Vertical & horizontal bar chart",
        icon: BarChart3,
        tags: ["Recharts", "Tremor", "Interactive"],
      },
      {
        title: "Donut Chart",
        href: "/charts/donut-chart",
        description:
          "A donut and pie chart for visualizing part-to-whole relationships. Supports center labels, click interactions, and custom tooltips.",
        shortDescription: "Donut & pie chart",
        icon: PieChart,
        tags: ["Recharts", "Tremor", "Interactive"],
      },
      {
        title: "Progress Bar",
        href: "/charts/progress-bar",
        description:
          "A Tremor-style horizontal progress bar with semantic color variants (default, neutral, success, warning, error), optional animation, and an optional label.",
        shortDescription: "Semantic progress indicator",
        icon: GaugeCircle,
        tags: ["Tremor", "Semantic", "Animation"],
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
