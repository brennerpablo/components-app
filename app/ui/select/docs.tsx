import { ComponentDoc } from "@/components/ui/component-doc";

export function SelectDocs() {
  return (
    <ComponentDoc
      title="Select"
      description="A select dropdown built on Radix UI Select. Supports groups, labels, separators, disabled states, and two trigger sizes."
      usage={`import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

<Select value={value} onValueChange={setValue}>
  <SelectTrigger className="w-50">
    <SelectValue placeholder="Pick one" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="apple">Apple</SelectItem>
    <SelectItem value="banana">Banana</SelectItem>
  </SelectContent>
</Select>`}
      propSections={[
        {
          title: "Select (root) props",
          props: [
            {
              name: "value",
              type: "string",
              description: "Controlled selected value.",
            },
            {
              name: "defaultValue",
              type: "string",
              description: "Uncontrolled default value.",
            },
            {
              name: "onValueChange",
              type: "(value: string) => void",
              description: "Callback when the selected value changes.",
            },
            {
              name: "renderItem",
              type: "(entry: { value: string; label: string }) => ReactNode",
              description:
                "Custom render function for each SelectItem's content. Receives the item's value and label. The return replaces the default text inside the item row — selection indicator and focus styles are preserved.",
            },
            {
              name: "disabled",
              type: "boolean",
              default: "false",
              description: "Disables the entire select.",
            },
            {
              name: "open",
              type: "boolean",
              description: "Controlled open state of the dropdown.",
            },
            {
              name: "onOpenChange",
              type: "(open: boolean) => void",
              description: "Callback when the open state changes.",
            },
            {
              name: "selectId",
              type: "string",
              description:
                "Unique identifier for the select instance. Used as the cookie key for persisting the last selected value.",
            },
            {
              name: "enableLastSelected",
              type: "boolean",
              default: "false",
              description:
                "When true (and selectId is set), persists the last selected value in a cookie and shows a suggestion footer in the dropdown.",
            },
            {
              name: "renderLastSelected",
              type: "(entry: { value: string; label: string }) => ReactNode",
              description:
                "Custom render function for the last-selected footer content. Receives the saved entry. The return value is placed inside the footer button — you provide the inner content, the component handles the click behavior.",
            },
          ],
        },
        {
          title: "SelectTrigger props",
          props: [
            {
              name: "size",
              type: '"sm" | "default"',
              default: '"default"',
              description: "Trigger height. sm = 32px, default = 36px.",
            },
            {
              name: "loading",
              type: "boolean",
              default: "false",
              description:
                "Shows a skeleton shimmer overlay and disables the trigger. Useful while data is being fetched.",
            },
            {
              name: "className",
              type: "string",
              description: "Additional CSS classes.",
            },
          ],
        },
        {
          title: "SelectValue props",
          props: [
            {
              name: "placeholder",
              type: "string",
              description:
                "Text shown when no value is selected.",
            },
          ],
        },
        {
          title: "SelectItem props",
          props: [
            {
              name: "value",
              type: "string",
              required: true,
              description: "The value for this option.",
            },
            {
              name: "searchValue",
              type: "string",
              description:
                "Custom string to match against when filtering. Defaults to children text or value.",
            },
            {
              name: "disabled",
              type: "boolean",
              default: "false",
              description: "Disables this individual item.",
            },
            {
              name: "className",
              type: "string",
              description: "Additional CSS classes.",
            },
          ],
        },
        {
          title: "SelectContent props",
          props: [
            {
              name: "searchable",
              type: "boolean",
              default: "false",
              description:
                "Renders a search input at the top of the dropdown to filter items. Forces popper positioning.",
            },
            {
              name: "searchPlaceholder",
              type: "string",
              default: '"Search..."',
              description:
                "Placeholder text for the search input. Only used when searchable is true.",
            },
            {
              name: "position",
              type: '"item-aligned" | "popper"',
              default: '"item-aligned"',
              description:
                "Positioning strategy for the dropdown. Forced to popper when searchable.",
            },
            {
              name: "align",
              type: '"start" | "center" | "end"',
              default: '"center"',
              description: "Alignment of the content relative to the trigger.",
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
