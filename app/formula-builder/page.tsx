"use client"

import { useState } from "react"

import { DemoBreadcrumb } from "@/app/_components/DemoBreadcrumb"
import { FormulaBuilder } from "@/components/ui/formula-builder"

import { FormulaBuilderDocs } from "./docs"

const variables = {
  height: "Person height",
  weight: "Person weight",
  age: "Person age",
}

export default function FormulaBuilderPage() {
  const [formula, setFormula] = useState("")
  const [validatedFormula, setValidatedFormula] = useState("")
  const [prefilledFormula, setPrefilledFormula] = useState(
    "height * weight / age",
  )

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <DemoBreadcrumb />
        <h1 className="mb-6 text-2xl font-semibold tracking-tight">
          FormulaBuilder
        </h1>

      {/* Basic usage */}
      <section className="mb-10">
        <h2 className="mb-1 text-lg font-semibold">Basic Usage</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Drag variables and operators into the canvas, or click them to append.
          Reorder tokens by dragging within the canvas. Remove tokens with the X
          button.
        </p>
        <FormulaBuilder
          variables={variables}
          value={formula}
          onChange={setFormula}
        />
      </section>

      {/* With validation */}
      <section className="mb-10">
        <h2 className="mb-1 text-lg font-semibold">With Validation</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Enable <code className="text-xs">showValidation</code> to display
          errors for malformed expressions.
        </p>
        <FormulaBuilder
          variables={variables}
          value={validatedFormula}
          onChange={setValidatedFormula}
          showValidation
        />
      </section>

      {/* Pre-filled */}
      <section className="mb-10">
        <h2 className="mb-1 text-lg font-semibold">Pre-filled Formula</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Pass an initial <code className="text-xs">value</code> to pre-populate
          the canvas.
        </p>
        <FormulaBuilder
          variables={variables}
          value={prefilledFormula}
          onChange={setPrefilledFormula}
        />
      </section>

      {/* Disabled */}
      <section className="mb-10">
        <h2 className="mb-1 text-lg font-semibold">Disabled</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          All interaction is blocked when{" "}
          <code className="text-xs">disabled</code> is set.
        </p>
        <FormulaBuilder
          variables={variables}
          value="height + weight"
          disabled
        />
      </section>

      {/* Docs */}
      <FormulaBuilderDocs />
      </div>
    </main>
  )
}
