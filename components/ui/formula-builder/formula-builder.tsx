"use client"

import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine"
import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import { pointerOutsideOfPreview } from "@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview"
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview"
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder"
import { triggerPostMoveFlash } from "@atlaskit/pragmatic-drag-and-drop-flourish/trigger-post-move-flash"
import {
  attachClosestEdge,
  type Edge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge"
import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index"
import { DropIndicator } from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box"
import { AlertCircle, GripVertical, X } from "lucide-react"
import React from "react"
import ReactDOM from "react-dom"
import invariant from "tiny-invariant"

import { cn } from "@/lib/utils"

import type { FormulaBuilderProps, FormulaToken, TokenType } from "./types"

// ── DnD data helpers ──────────────────────────────────────────────

const tokenKey = Symbol("formula-token")

type TokenDragData = {
  [tokenKey]: true
  token: FormulaToken
  source: "palette" | "canvas"
  index: number
  instanceId: symbol
}

function getTokenDragData(args: {
  token: FormulaToken
  source: "palette" | "canvas"
  index: number
  instanceId: symbol
}): TokenDragData {
  return { [tokenKey]: true, ...args }
}

function isTokenDragData(
  data: Record<string | symbol, unknown>,
): data is TokenDragData {
  return data[tokenKey] === true
}

// ── Formula utilities ─────────────────────────────────────────────

const DEFAULT_OPERATORS = ["+", "-", "*", "/", "(", ")"]
const BINARY_OPERATORS = new Set(["+", "-", "*", "/"])

function createToken(
  value: string,
  type: TokenType,
  label: string,
): FormulaToken {
  return { id: crypto.randomUUID(), type, value, label }
}

function parseFormula(
  formula: string,
  variables: Record<string, string>,
  operators: string[],
): FormulaToken[] {
  if (!formula.trim()) return []
  const parts = formula.trim().split(/\s+/)
  const operatorSet = new Set(operators)

  return parts.map((part) => {
    if (part in variables) {
      return createToken(part, "variable", variables[part])
    }
    if (operatorSet.has(part)) {
      return createToken(part, "operator", part)
    }
    // Unknown token — treat as variable with raw value as label
    return createToken(part, "variable", part)
  })
}

function serializeTokens(tokens: FormulaToken[]): string {
  return tokens.map((t) => t.value).join(" ")
}

function validateFormula(
  tokens: FormulaToken[],
): string[] {
  const errors: string[] = []
  if (tokens.length === 0) return errors

  // Check operator at start (excluding open paren)
  const first = tokens[0]
  if (first.type === "operator" && BINARY_OPERATORS.has(first.value)) {
    errors.push("Formula cannot start with an operator")
  }

  // Check operator at end (excluding close paren)
  const last = tokens[tokens.length - 1]
  if (last.type === "operator" && BINARY_OPERATORS.has(last.value)) {
    errors.push("Formula cannot end with an operator")
  }

  // Check consecutive binary operators
  for (let i = 1; i < tokens.length; i++) {
    const prev = tokens[i - 1]
    const curr = tokens[i]
    if (
      prev.type === "operator" &&
      curr.type === "operator" &&
      BINARY_OPERATORS.has(prev.value) &&
      BINARY_OPERATORS.has(curr.value)
    ) {
      errors.push("Consecutive operators are not allowed")
      break
    }
  }

  // Check balanced parentheses
  let depth = 0
  for (const token of tokens) {
    if (token.value === "(") depth++
    if (token.value === ")") depth--
    if (depth < 0) {
      errors.push("Unbalanced parentheses: extra closing parenthesis")
      break
    }
  }
  if (depth > 0) {
    errors.push("Unbalanced parentheses: missing closing parenthesis")
  }

  return errors
}

// ── Draggable state ───────────────────────────────────────────────

type DraggableState =
  | { type: "idle" }
  | { type: "preview"; container: HTMLElement }
  | { type: "dragging" }

const idleState: DraggableState = { type: "idle" }
const draggingState: DraggableState = { type: "dragging" }

// ── PaletteItem ───────────────────────────────────────────────────

function PaletteItem({
  token,
  instanceId,
  disabled,
  onAdd,
}: {
  token: FormulaToken
  instanceId: symbol
  disabled?: boolean
  onAdd: (token: FormulaToken) => void
}) {
  const ref = React.useRef<HTMLButtonElement>(null)
  const [draggableState, setDraggableState] =
    React.useState<DraggableState>(idleState)

  React.useEffect(() => {
    const element = ref.current
    if (!element || disabled) return

    return draggable({
      element,
      getInitialData: () =>
        getTokenDragData({ token, source: "palette", index: -1, instanceId }),
      onGenerateDragPreview({ nativeSetDragImage }) {
        setCustomNativeDragPreview({
          nativeSetDragImage,
          getOffset: pointerOutsideOfPreview({ x: "8px", y: "8px" }),
          render({ container }) {
            setDraggableState({ type: "preview", container })
            return () => setDraggableState(draggingState)
          },
        })
      },
      onDragStart() {
        setDraggableState(draggingState)
      },
      onDrop() {
        setDraggableState(idleState)
      },
    })
  }, [token, instanceId, disabled])

  const isVariable = token.type === "variable"

  return (
    <React.Fragment>
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && onAdd(token)}
        className={cn(
          "inline-flex cursor-grab items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium transition-colors select-none active:cursor-grabbing",
          isVariable
            ? "border-primary/20 bg-primary/10 text-primary hover:bg-primary/15"
            : "border-border bg-muted text-muted-foreground hover:bg-accent",
          disabled && "cursor-not-allowed opacity-50",
          draggableState.type === "dragging" && "opacity-50",
        )}
      >
        <GripVertical className="size-3 shrink-0 opacity-50" />
        {token.label}
      </button>
      {draggableState.type === "preview" &&
        ReactDOM.createPortal(
          <div
            className={cn(
              "rounded-md border px-2 py-1 text-xs font-medium shadow-md",
              isVariable
                ? "border-primary/20 bg-primary/10 text-primary"
                : "border-border bg-muted text-muted-foreground",
            )}
          >
            {token.label}
          </div>,
          draggableState.container,
        )}
    </React.Fragment>
  )
}

// ── CanvasToken ───────────────────────────────────────────────────

function CanvasToken({
  token,
  index,
  instanceId,
  disabled,
  onRemove,
}: {
  token: FormulaToken
  index: number
  instanceId: symbol
  disabled?: boolean
  onRemove: (id: string) => void
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [closestEdge, setClosestEdge] = React.useState<Edge | null>(null)
  const [draggableState, setDraggableState] =
    React.useState<DraggableState>(idleState)

  React.useEffect(() => {
    const element = ref.current
    if (!element || disabled) return

    const data = getTokenDragData({
      token,
      source: "canvas",
      index,
      instanceId,
    })

    return combine(
      draggable({
        element,
        getInitialData: () => data,
        onGenerateDragPreview({ nativeSetDragImage }) {
          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: pointerOutsideOfPreview({ x: "8px", y: "8px" }),
            render({ container }) {
              setDraggableState({ type: "preview", container })
              return () => setDraggableState(draggingState)
            },
          })
        },
        onDragStart() {
          setDraggableState(draggingState)
        },
        onDrop() {
          setDraggableState(idleState)
        },
      }),
      dropTargetForElements({
        element,
        canDrop({ source }) {
          return (
            isTokenDragData(source.data) &&
            source.data.instanceId === instanceId
          )
        },
        getData({ input }) {
          return attachClosestEdge(data, {
            element,
            input,
            allowedEdges: ["left", "right"],
          })
        },
        onDrag({ self, source }) {
          if (source.element === element) {
            setClosestEdge(null)
            return
          }

          const closestEdge = extractClosestEdge(self.data)
          const sourceData = source.data
          if (!isTokenDragData(sourceData) || sourceData.source !== "canvas") {
            setClosestEdge(closestEdge)
            return
          }

          const sourceIndex = sourceData.index
          const isItemBeforeSource = index === sourceIndex - 1
          const isItemAfterSource = index === sourceIndex + 1

          const isDropIndicatorHidden =
            (isItemBeforeSource && closestEdge === "right") ||
            (isItemAfterSource && closestEdge === "left")

          if (isDropIndicatorHidden) {
            setClosestEdge(null)
            return
          }

          setClosestEdge(closestEdge)
        },
        onDragLeave() {
          setClosestEdge(null)
        },
        onDrop() {
          setClosestEdge(null)
        },
      }),
    )
  }, [token, index, instanceId, disabled])

  const isVariable = token.type === "variable"

  return (
    <React.Fragment>
      <div ref={ref} className="group relative">
        <div
          className={cn(
            "inline-flex cursor-grab items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium transition-colors select-none active:cursor-grabbing",
            isVariable
              ? "border-primary/20 bg-primary/10 text-primary"
              : "border-border bg-muted text-muted-foreground",
            disabled && "cursor-not-allowed",
            draggableState.type === "dragging" && "opacity-50",
          )}
        >
          {token.label}
          {!disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onRemove(token.id)
              }}
              className="ml-0.5 rounded-sm opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
              aria-label={`Remove ${token.label}`}
            >
              <X className="size-3" />
            </button>
          )}
        </div>
        {closestEdge && <DropIndicator edge={closestEdge} gap="4px" />}
      </div>
      {draggableState.type === "preview" &&
        ReactDOM.createPortal(
          <div
            className={cn(
              "rounded-md border px-2 py-1 text-xs font-medium shadow-md",
              isVariable
                ? "border-primary/20 bg-primary/10 text-primary"
                : "border-border bg-muted text-muted-foreground",
            )}
          >
            {token.label}
          </div>,
          draggableState.container,
        )}
    </React.Fragment>
  )
}

// ── FormulaBuilder (main component) ───────────────────────────────

function FormulaBuilder({
  variables,
  value,
  onChange,
  operators = DEFAULT_OPERATORS,
  placeholder = "Drag variables and operators here to build a formula",
  disabled = false,
  showValidation = false,
  className,
}: FormulaBuilderProps) {
  const [tokens, setTokens] = React.useState<FormulaToken[]>([])
  const [isDragOver, setIsDragOver] = React.useState(false)
  const [instanceId] = React.useState(() => Symbol("formula-builder"))
  const canvasRef = React.useRef<HTMLDivElement>(null)

  // Track the last value we emitted to avoid re-parse loops
  const lastEmittedRef = React.useRef<string | undefined>(undefined)

  // Sync inbound value → tokens
  React.useEffect(() => {
    if (value === undefined) return
    if (value === lastEmittedRef.current) return
    const parsed = parseFormula(value, variables, operators)
    setTokens(parsed)
  }, [value, variables, operators])

  // Emit changes
  const emitChange = React.useCallback(
    (newTokens: FormulaToken[]) => {
      setTokens(newTokens)
      const serialized = serializeTokens(newTokens)
      lastEmittedRef.current = serialized
      onChange?.(serialized)
    },
    [onChange],
  )

  // Build palette tokens
  const variableTokens = React.useMemo(
    () =>
      Object.entries(variables).map(([key, label]) =>
        createToken(key, "variable", label),
      ),
    [variables],
  )

  const operatorTokens = React.useMemo(
    () => operators.map((op) => createToken(op, "operator", op)),
    [operators],
  )

  // Token mutation helpers
  const appendToken = React.useCallback(
    (token: FormulaToken) => {
      const newToken = createToken(token.value, token.type, token.label)
      emitChange([...tokens, newToken])
    },
    [tokens, emitChange],
  )

  const insertToken = React.useCallback(
    (token: FormulaToken, atIndex: number) => {
      const newToken = createToken(token.value, token.type, token.label)
      const newTokens = [...tokens]
      newTokens.splice(atIndex, 0, newToken)
      emitChange(newTokens)
    },
    [tokens, emitChange],
  )

  const removeToken = React.useCallback(
    (id: string) => {
      emitChange(tokens.filter((t) => t.id !== id))
    },
    [tokens, emitChange],
  )

  const reorderToken = React.useCallback(
    (startIndex: number, finishIndex: number) => {
      if (startIndex === finishIndex) return
      const reordered = reorder({ list: tokens, startIndex, finishIndex })
      emitChange(reordered)
    },
    [tokens, emitChange],
  )

  // Use a ref so the monitor always reads fresh tokens
  const tokensRef = React.useRef(tokens)
  tokensRef.current = tokens

  // Canvas drop target (for appending to empty area)
  React.useEffect(() => {
    const element = canvasRef.current
    if (!element || disabled) return

    return dropTargetForElements({
      element,
      canDrop({ source }) {
        return (
          isTokenDragData(source.data) &&
          source.data.instanceId === instanceId
        )
      },
      onDragEnter() {
        setIsDragOver(true)
      },
      onDragLeave() {
        setIsDragOver(false)
      },
      onDrop() {
        setIsDragOver(false)
      },
    })
  }, [instanceId, disabled])

  // Monitor: handles all drop events
  React.useEffect(() => {
    if (disabled) return

    return monitorForElements({
      canMonitor({ source }) {
        return (
          isTokenDragData(source.data) &&
          source.data.instanceId === instanceId
        )
      },
      onDrop({ location, source }) {
        const sourceData = source.data
        if (!isTokenDragData(sourceData)) return

        const currentTokens = tokensRef.current
        const target = location.current.dropTargets[0]

        if (sourceData.source === "palette") {
          // Palette → canvas
          if (!target) return

          const targetData = target.data
          if (isTokenDragData(targetData) && targetData.source === "canvas") {
            // Dropped on a canvas token — insert before/after
            const edge = extractClosestEdge(targetData)
            const targetIndex = currentTokens.findIndex(
              (t) => t.id === targetData.token.id,
            )
            if (targetIndex < 0) return
            const insertIndex =
              edge === "right" ? targetIndex + 1 : targetIndex
            insertToken(sourceData.token, insertIndex)
          } else {
            // Dropped on canvas background — append
            appendToken(sourceData.token)
          }

          return
        }

        if (sourceData.source === "canvas") {
          // Canvas reorder
          if (!target) return

          const targetData = target.data
          if (!isTokenDragData(targetData) || targetData.source !== "canvas")
            return

          const startIndex = currentTokens.findIndex(
            (t) => t.id === sourceData.token.id,
          )
          const indexOfTarget = currentTokens.findIndex(
            (t) => t.id === targetData.token.id,
          )
          if (startIndex < 0 || indexOfTarget < 0) return

          const closestEdge = extractClosestEdge(targetData)
          const finishIndex = getReorderDestinationIndex({
            startIndex,
            closestEdgeOfTarget: closestEdge,
            indexOfTarget,
            axis: "horizontal",
          })

          reorderToken(startIndex, finishIndex)

          // Flash the moved element
          requestAnimationFrame(() => {
            const movedToken = tokensRef.current[finishIndex]
            if (!movedToken) return
            const el = canvasRef.current?.querySelector(
              `[data-token-id="${movedToken.id}"]`,
            )
            if (el instanceof HTMLElement) {
              triggerPostMoveFlash(el)
            }
          })
        }
      },
    })
  }, [instanceId, disabled, appendToken, insertToken, reorderToken])

  const validationErrors = showValidation ? validateFormula(tokens) : []

  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row", className)}>
      {/* Palette */}
      <div className="flex shrink-0 flex-col gap-3 sm:w-48">
        {/* Variables section */}
        <div>
          <div className="mb-1.5 text-xs font-medium text-muted-foreground">
            Variables
          </div>
          <div className="flex flex-wrap gap-1.5">
            {variableTokens.map((token) => (
              <PaletteItem
                key={token.id}
                token={token}
                instanceId={instanceId}
                disabled={disabled}
                onAdd={appendToken}
              />
            ))}
          </div>
        </div>

        {/* Operators section */}
        <div>
          <div className="mb-1.5 text-xs font-medium text-muted-foreground">
            Operators
          </div>
          <div className="flex flex-wrap gap-1.5">
            {operatorTokens.map((token) => (
              <PaletteItem
                key={token.id}
                token={token}
                instanceId={instanceId}
                disabled={disabled}
                onAdd={appendToken}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="text-xs font-medium text-muted-foreground">
          Formula
        </div>
        <div
          ref={canvasRef}
          className={cn(
            "min-h-[3rem] rounded-lg border p-2 transition-colors",
            tokens.length === 0 ? "border-dashed" : "border-solid",
            isDragOver && "ring-2 ring-primary/30",
            disabled && "opacity-50",
          )}
        >
          {tokens.length === 0 ? (
            <div className="flex h-full min-h-[2rem] items-center justify-center text-xs text-muted-foreground">
              {placeholder}
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-1.5">
              {tokens.map((token, index) => (
                <CanvasToken
                  key={token.id}
                  token={token}
                  index={index}
                  instanceId={instanceId}
                  disabled={disabled}
                  onRemove={removeToken}
                />
              ))}
            </div>
          )}
        </div>

        {/* Serialized formula preview */}
        {tokens.length > 0 && (
          <div className="rounded-md bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">
            {serializeTokens(tokens)}
          </div>
        )}

        {/* Validation errors */}
        {validationErrors.length > 0 && (
          <div className="flex flex-col gap-1">
            {validationErrors.map((error) => (
              <div
                key={error}
                className="flex items-center gap-1 text-xs text-destructive"
              >
                <AlertCircle className="size-3 shrink-0" />
                {error}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export { FormulaBuilder }
