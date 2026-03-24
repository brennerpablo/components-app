import { ComponentDoc } from "@/components/ui/component-doc"

export function FormulaBuilderDocs() {
  return (
    <ComponentDoc
      title="FormulaBuilder"
      description="A drag-and-drop formula builder that lets users compose expressions from variable blocks and math operators."
      usage={`import { FormulaBuilder } from "@/components/ui/formula-builder"

const variables = {
  height: "Person height",
  weight: "Person weight",
  age: "Person age",
}

<FormulaBuilder
  variables={variables}
  value={formula}
  onChange={setFormula}
/>`}
      props={[
        {
          name: "variables",
          type: "Record<string, string>",
          required: true,
          description:
            "Dictionary of variable keys to display labels (e.g. { height: \"Person height\" }).",
        },
        {
          name: "value",
          type: "string",
          description:
            'Controlled formula string, space-separated (e.g. "height * age / weight").',
        },
        {
          name: "onChange",
          type: "(formula: string) => void",
          description: "Callback fired when the formula changes.",
        },
        {
          name: "operators",
          type: "string[]",
          default: '["+", "-", "*", "/", "(", ")"]',
          description: "Operators available in the palette.",
        },
        {
          name: "placeholder",
          type: "string",
          default: '"Drag variables and operators here…"',
          description: "Placeholder text shown when the formula canvas is empty.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          description: "Disables all interaction (drag, click, remove).",
        },
        {
          name: "showValidation",
          type: "boolean",
          default: "false",
          description:
            "Show validation errors for consecutive operators, unbalanced parentheses, etc.",
        },
        {
          name: "className",
          type: "string",
          description: "Additional className applied to the root container.",
        },
      ]}
    />
  )
}
