"use client"

import { addDays } from "date-fns"
import { useState } from "react"
import type { DateRange } from "react-day-picker"

import { DemoBreadcrumb } from "@/app/_components/DemoBreadcrumb"
import { DatePicker } from "@/components/ui/date-picker"

import { DatePickerDocs } from "./docs"

export default function DatePickerPage() {
  const [singleDate, setSingleDate] = useState<Date | undefined>()
  const [rangeValue, setRangeValue] = useState<DateRange | undefined>()
  const [dateTime, setDateTime] = useState<Date | undefined>()
  const [lang, setLang] = useState<"en" | "pt">("en")

  // Constrained picker
  const today = new Date()
  const [constrainedDate, setConstrainedDate] = useState<Date | undefined>()

  return (
    <main className="p-4 sm:p-6 lg:p-8 max-w-4xl">
      <DemoBreadcrumb />

      <h1 className="text-2xl font-bold mb-1">DatePicker</h1>
      <p className="text-muted-foreground mb-8">
        A date picker input with popover calendar supporting single date, date
        range, and date + time modes.
      </p>

      {/* Language toggle */}
      <div className="flex items-center gap-2 mb-8">
        <span className="text-sm font-medium text-muted-foreground">
          Language:
        </span>
        <button
          onClick={() => setLang("en")}
          className={`rounded-md px-2.5 py-1 text-sm font-medium transition-colors ${
            lang === "en"
              ? "bg-foreground text-background"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          EN
        </button>
        <button
          onClick={() => setLang("pt")}
          className={`rounded-md px-2.5 py-1 text-sm font-medium transition-colors ${
            lang === "pt"
              ? "bg-foreground text-background"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          PT
        </button>
      </div>

      {/* Single date */}
      <section className="mb-10">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Single Date
        </h2>
        <DatePicker
          value={singleDate}
          onChange={setSingleDate}
          language={lang}
        />
        {singleDate && (
          <p className="mt-2 text-sm text-muted-foreground">
            Selected: {singleDate.toLocaleDateString()}
          </p>
        )}
      </section>

      {/* Short format */}
      <section className="mb-10">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Short Display Format (dd/mm/yyyy)
        </h2>
        <DatePicker
          value={singleDate}
          onChange={setSingleDate}
          language={lang}
          displayFormat="short"
        />
      </section>

      {/* Single with day navigation */}
      <section className="mb-10">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Single Date with Day Navigation
        </h2>
        <DatePicker
          value={singleDate}
          onChange={setSingleDate}
          language={lang}
          enableDayNavigation
        />
      </section>

      {/* Date range */}
      <section className="mb-10">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Date Range
        </h2>
        <DatePicker
          mode="range"
          value={rangeValue}
          onChange={setRangeValue}
          language={lang}
        />
        {rangeValue?.from && (
          <p className="mt-2 text-sm text-muted-foreground">
            From: {rangeValue.from.toLocaleDateString()}
            {rangeValue.to && ` — To: ${rangeValue.to.toLocaleDateString()}`}
          </p>
        )}
      </section>

      {/* Date + time */}
      <section className="mb-10">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Date + Time
        </h2>
        <DatePicker
          mode="datetime"
          value={dateTime}
          onChange={setDateTime}
          language={lang}
        />
        {dateTime && (
          <p className="mt-2 text-sm text-muted-foreground">
            Selected: {dateTime.toLocaleString()}
          </p>
        )}
      </section>

      {/* Constrained */}
      <section className="mb-10">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          With Min/Max Dates
        </h2>
        <p className="text-sm text-muted-foreground mb-2">
          Only dates within the next 30 days are selectable.
        </p>
        <DatePicker
          value={constrainedDate}
          onChange={setConstrainedDate}
          minDate={today}
          maxDate={addDays(today, 30)}
          language={lang}
        />
      </section>

      {/* Disabled */}
      <section className="mb-10">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Disabled
        </h2>
        <DatePicker disabled language={lang} />
      </section>

      <DatePickerDocs />
    </main>
  )
}
