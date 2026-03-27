"use client"

import { useState } from "react"

import { DemoBreadcrumb } from "@/app/_components/DemoBreadcrumb"
import { MonthPicker } from "@/components/ui/month-picker"

import { MonthPickerDocs } from "./docs"

export default function MonthPickerPage() {
  const [value, setValue] = useState<
    { year: number; month: number } | undefined
  >()
  const [lang, setLang] = useState<"en" | "pt">("en")

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <DemoBreadcrumb />
        <h1 className="mb-6 text-2xl font-semibold tracking-tight">
          MonthPicker
        </h1>

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

      {/* Default */}
      <section className="mb-10">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Default
        </h2>
        <MonthPicker value={value} onChange={setValue} language={lang} />
        {value && (
          <p className="mt-2 text-sm text-muted-foreground">
            Selected: {value.year}-{String(value.month + 1).padStart(2, "0")}
          </p>
        )}
      </section>

      {/* With month navigation */}
      <section className="mb-10">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          With Month Navigation
        </h2>
        <MonthPicker
          value={value}
          onChange={setValue}
          enableMonthNavigation
          language={lang}
        />
      </section>

      {/* Constrained range */}
      <section className="mb-10">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Constrained Range (2024-01 to 2027-06)
        </h2>
        <p className="text-sm text-muted-foreground mb-2">
          Only months between January 2024 and June 2027 are selectable.
        </p>
        <MonthPicker
          value={value}
          onChange={setValue}
          minDate={{ year: 2024, month: 0 }}
          maxDate={{ year: 2027, month: 5 }}
          language={lang}
        />
      </section>

      {/* Small size */}
      <section className="mb-10">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Small Size
        </h2>
        <MonthPicker
          value={value}
          onChange={setValue}
          size="sm"
          language={lang}
        />
      </section>

      {/* Disabled */}
      <section className="mb-10">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Disabled
        </h2>
        <MonthPicker disabled language={lang} />
      </section>

      <MonthPickerDocs />
      </div>
    </main>
  )
}
