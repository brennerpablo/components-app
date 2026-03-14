import { ComponentDoc } from "@/components/ui/component-doc";

export function BadgeDocs() {
  return (
    <ComponentDoc
      title="Badge"
      description="A small label component for displaying status, categories, or counts. Supports five semantic variants with light and dark mode."
      usage={`import { Badge } from "@/components/ui/badge"

<Badge variant="default">Default</Badge>
<Badge variant="neutral">Neutral</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>`}
      props={[
        {
          name: "variant",
          type: '"default" | "neutral" | "success" | "error" | "warning"',
          default: '"default"',
          description: "Controls the color scheme of the badge.",
        },
        {
          name: "size",
          type: '"sm" | "md" | "lg"',
          default: '"md"',
          description: "Controls the size of the badge.",
        },
        {
          name: "tooltip",
          type: "boolean",
          default: "false",
          description:
            "When true, wraps the badge in a tooltip showing its content on hover.",
        },
        {
          name: "className",
          type: "string",
          description: "Additional CSS classes.",
        },
        {
          name: "children",
          type: "React.ReactNode",
          description: "Badge content. Can include text and/or icons.",
        },
      ]}
    />
  );
}
