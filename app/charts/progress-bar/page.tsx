"use client"

import { useState } from "react"
import { ProgressBar } from "@/components/charts/progress-bar"
import { ComponentDoc } from "@/components/ui/component-doc"

export default function ProgressBarPage() {
  const [value, setValue] = useState(60)

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-10">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Progress Bar</h1>
        <p className="text-muted-foreground text-sm">
          Tremor-style progress bar with semantic variants.
        </p>
      </div>

      {/* Variants */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Variants
        </h2>
        <div className="space-y-3">
          <ProgressBar value={70} variant="default" label="Default" />
          <ProgressBar value={55} variant="neutral" label="Neutral" />
          <ProgressBar value={40} variant="success" label="Success" />
          <ProgressBar value={65} variant="warning" label="Warning" />
          <ProgressBar value={80} variant="error" label="Error" />
        </div>
      </section>

      {/* Animation */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Interactive — with animation
        </h2>
        <ProgressBar value={value} showAnimation label={`${value}%`} />
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="w-full"
        />
      </section>

      {/* No label */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Without label
        </h2>
        <ProgressBar value={45} variant="success" />
      </section>

      {/* Custom max */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Custom max (value=3, max=5)
        </h2>
        <ProgressBar value={3} max={5} label="3/5" />
      </section>

      <ComponentDoc
        title="ProgressBar"
        description="A Tremor-style horizontal progress bar with semantic color variants, optional animation, and an optional label. Accepts values from 0 to max (default 100)."
        usage={`import { ProgressBar } from "@/components/charts/progress-bar"

<ProgressBar value={60} variant="default" label="60%" />
<ProgressBar value={3} max={5} showAnimation label="3/5" />`}
        props={[
          {
            name: "value",
            type: "number",
            default: "0",
            description: "Current progress value.",
          },
          {
            name: "max",
            type: "number",
            default: "100",
            description: "Upper boundary value.",
          },
          {
            name: "variant",
            type: '"default" | "neutral" | "success" | "warning" | "error"',
            default: '"default"',
            description: "Color scheme of the bar.",
          },
          {
            name: "showAnimation",
            type: "boolean",
            default: "false",
            description: "Enables a CSS transition when the value changes.",
          },
          {
            name: "label",
            type: "string",
            description: "Optional text displayed to the right of the bar.",
          },
          {
            name: "className",
            type: "string",
            description: "Extra classes applied to the outer wrapper.",
          },
        ]}
      />
    </div>
  )
}
