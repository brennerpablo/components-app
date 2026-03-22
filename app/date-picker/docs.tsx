import { ComponentDoc } from "@/components/ui/component-doc"

export function DatePickerDocs() {
  return (
    <ComponentDoc
      title="DatePicker"
      description="A date picker input with popover calendar. Supports single date, date range, and date + time selection modes."
      usage={`import { DatePicker } from "@/components/ui/date-picker"

// Single date
<DatePicker
  value={date}
  onChange={setDate}
/>

// Date range
<DatePicker
  mode="range"
  value={range}
  onChange={setRange}
/>

// Date + time
<DatePicker
  mode="datetime"
  value={dateTime}
  onChange={setDateTime}
/>`}
      props={[
        {
          name: "mode",
          type: '"single" | "range" | "datetime"',
          default: '"single"',
          description:
            "Selection mode. Single picks one date, range picks from/to, datetime adds time inputs.",
        },
        {
          name: "value",
          type: "Date | DateRange | undefined",
          description:
            "Selected value. Date for single/datetime, { from?: Date; to?: Date } for range.",
        },
        {
          name: "onChange",
          type: "(value) => void",
          description:
            "Called when selection changes. Argument type matches the mode.",
        },
        {
          name: "displayFormat",
          type: '"long" | "short"',
          default: '"long"',
          description:
            'Date display format. "long" shows full date (e.g. March 21, 2026), "short" shows dd/MM/yyyy.',
        },
        {
          name: "enableDayNavigation",
          type: "boolean",
          default: "false",
          description:
            "Single mode only. Adds < > buttons beside the trigger to move one day forward or backward.",
        },
        {
          name: "placeholder",
          type: "string",
          description:
            "Custom placeholder text. Defaults to a localized string per mode.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          description: "Disables the trigger button.",
        },
        {
          name: "disableWeekends",
          type: "boolean",
          default: "false",
          description:
            "Prevents selection of Saturdays and Sundays.",
        },
        {
          name: "disabledDates",
          type: "string[]",
          description:
            'Array of dates in "yyyy-MM-dd" format to disable. Can be combined with disableWeekends.',
        },
        {
          name: "language",
          type: '"en" | "pt"',
          default: '"en"',
          description:
            "Locale for labels, month/weekday names, and date formatting.",
        },
        {
          name: "format",
          type: "string",
          description:
            'Custom date-fns format string. Defaults: "PPP" (single), "PP" (range), "PPP HH:mm" (datetime).',
        },
        {
          name: "minDate",
          type: "Date",
          description: "Earliest selectable date.",
        },
        {
          name: "maxDate",
          type: "Date",
          description: "Latest selectable date.",
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
