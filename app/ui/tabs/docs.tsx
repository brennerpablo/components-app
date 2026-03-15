import { ComponentDoc } from "@/components/ui/component-doc";

export function TabsDocs() {
  return (
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
              name: "color",
              type: '"default" | "blue" | "red" | "green" | "orange" | "purple" | "indigo" | "pink" | "yellow" | "emerald"',
              default: '"default"',
              description:
                "Color of the active tab indicator. Affects the underline (line) or background (solid) of the selected trigger.",
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
  );
}
