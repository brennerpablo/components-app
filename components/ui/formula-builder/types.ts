export interface FormulaBuilderProps {
  /** Variable dictionary: key is the programmatic name, value is the display label */
  variables: Record<string, string>
  /** Controlled formula string, e.g. "height * age / weight" */
  value?: string
  /** Callback when formula changes */
  onChange?: (formula: string) => void
  /** Operators available in the palette. Defaults to ["+", "-", "*", "/", "(", ")"] */
  operators?: string[]
  /** Placeholder text for empty canvas */
  placeholder?: string
  /** Disable all interaction */
  disabled?: boolean
  /** Show validation errors (consecutive operators, unbalanced parens) */
  showValidation?: boolean
  /** Additional className on the root container */
  className?: string
}

export type TokenType = "variable" | "operator"

export interface FormulaToken {
  id: string
  type: TokenType
  value: string
  label: string
}
