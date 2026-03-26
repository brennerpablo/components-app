import { ComponentDoc } from "@/components/ui/component-doc"

export function MonthPickerDocs() {
  return (
    <ComponentDoc
      title="MonthPicker"
      description="A year/month picker with popover. The user selects a year from a dropdown and a month from a button grid."
      usage={`import { MonthPicker } from "@/components/ui/month-picker"

<MonthPicker
  value={value}
  onChange={setValue}
/>

// With month navigation arrows
<MonthPicker
  value={value}
  onChange={setValue}
  enableMonthNavigation
/>

// Constrained range
<MonthPicker
  value={value}
  onChange={setValue}
  minDate={{ year: 2020, month: 0 }}
  maxDate={{ year: 2030, month: 11 }}
/>`}
      props={[
        {
          name: "value",
          type: "{ year: number; month: number } | undefined",
          description:
            "Selected value. month is 0-indexed (0 = January, 11 = December).",
        },
        {
          name: "onChange",
          type: "(value: { year: number; month: number } | undefined) => void",
          description: "Called when a month is selected.",
        },
        {
          name: "enableMonthNavigation",
          type: "boolean",
          default: "false",
          description:
            "Adds < > buttons beside the trigger to step one month forward or backward.",
        },
        {
          name: "placeholder",
          type: "string",
          description:
            "Custom placeholder text. Defaults to a localized string.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          description: "Disables the trigger button.",
        },
        {
          name: "language",
          type: '"en" | "pt"',
          default: '"en"',
          description:
            "Locale for labels and month names.",
        },
        {
          name: "size",
          type: '"default" | "sm"',
          default: '"default"',
          description: "Trigger size variant.",
        },
        {
          name: "shadow",
          type: '"none" | "xs" | "sm"',
          default: '"xs"',
          description: "Shadow on the trigger button.",
        },
        {
          name: "minDate",
          type: "{ year: number; month: number }",
          description:
            "Earliest selectable year/month. Defaults to 100 years before the current year.",
        },
        {
          name: "maxDate",
          type: "{ year: number; month: number }",
          description:
            "Latest selectable year/month. Defaults to 10 years after the current year.",
        },
        {
          name: "triggerClassName",
          type: "string",
          description: "Additional classes for the trigger button.",
        },
        {
          name: "className",
          type: "string",
          description: "Additional classes for the popover content.",
        },
      ]}
    />
  )
}
