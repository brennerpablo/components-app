"use client"

import * as React from "react"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, HistoryIcon, SearchIcon } from "lucide-react"
import { Select as SelectPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

// --- i18n ---

type SelectLanguage = "en" | "pt"

const translations = {
  en: { search: "Search...", lastSelected: "Last:" },
  pt: { search: "Buscar...", lastSelected: "Último:" },
} as const

const LanguageContext = React.createContext<SelectLanguage>("en")

const SearchContext = React.createContext<{
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
}>({ search: "", setSearch: () => {} })

// --- Last-selected cookie helpers ---

const COOKIE_PREFIX = "select-last:"

function getLastSelected(selectId: string): { value: string; label: string } | null {
  if (typeof document === "undefined") return null
  const name = `${COOKIE_PREFIX}${selectId}=`
  const match = document.cookie.split("; ").find((c) => c.startsWith(name))
  if (!match) return null
  try {
    return JSON.parse(decodeURIComponent(match.slice(name.length)))
  } catch {
    return null
  }
}

function setLastSelected(selectId: string, value: string, label: string) {
  const payload = encodeURIComponent(JSON.stringify({ value, label }))
  // 90-day expiry
  const expires = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toUTCString()
  document.cookie = `${COOKIE_PREFIX}${selectId}=${payload}; path=/; expires=${expires}; SameSite=Lax`
}

// --- Render-item context ---

type RenderItemFn = (entry: { value: string; label: string }) => React.ReactNode

const RenderItemContext = React.createContext<RenderItemFn | undefined>(undefined)

// --- Last-selected context ---

type LastSelectedEntry = { value: string; label: string }

type LastSelectedContextValue = {
  selectId: string | null
  enabled: boolean
  lastSelected: LastSelectedEntry | null
  renderLastSelected?: (entry: LastSelectedEntry) => React.ReactNode
  registerItem: (value: string, label: string) => void
  onSelect: (value: string) => void
}

const LastSelectedContext = React.createContext<LastSelectedContextValue>({
  selectId: null,
  enabled: false,
  lastSelected: null,
  renderLastSelected: undefined,
  registerItem: () => {},
  onSelect: () => {},
})

// --- Skeleton keyframes (self-contained, no external CSS needed) ---

const skeletonStyleId = "select-skeleton-pulse"

function InjectSkeletonStyle() {
  React.useEffect(() => {
    if (typeof document === "undefined") return
    if (document.getElementById(skeletonStyleId)) return
    const style = document.createElement("style")
    style.id = skeletonStyleId
    style.textContent = `@keyframes skeleton-pulse{0%,100%{opacity:.3}50%{opacity:.8}}`
    document.head.appendChild(style)
  }, [])
  return null
}

// --- Components ---

function Select({
  selectId,
  enableLastSelected = false,
  renderLastSelected,
  renderItem,
  language = "en",
  onValueChange,
  value: valueProp,
  defaultValue,
  open: openProp,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root> & {
  selectId?: string
  enableLastSelected?: boolean
  renderLastSelected?: (entry: LastSelectedEntry) => React.ReactNode
  renderItem?: RenderItemFn
  language?: SelectLanguage
}) {
  const enabled = enableLastSelected && !!selectId
  const [lastSelected, setLastSelectedState] = React.useState<{ value: string; label: string } | null>(null)
  const itemMapRef = React.useRef<Map<string, string>>(new Map())
  const [search, setSearch] = React.useState("")

  // When last-selected is enabled, we need internal control over value & open
  // so the footer button can programmatically set the value and close the dropdown
  const isControlled = valueProp !== undefined
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "")
  const [internalOpen, setInternalOpen] = React.useState(false)

  const currentValue = isControlled ? valueProp : internalValue
  const currentOpen = openProp ?? internalOpen

  React.useEffect(() => {
    if (enabled) {
      setLastSelectedState(getLastSelected(selectId!))
    }
  }, [enabled, selectId])

  const registerItem = React.useCallback((value: string, label: string) => {
    itemMapRef.current.set(value, label)
  }, [])

  const handleValueChange = React.useCallback(
    (value: string) => {
      if (!isControlled) setInternalValue(value)
      if (enabled) {
        const label = itemMapRef.current.get(value) ?? value
        setLastSelected(selectId!, value, label)
        setLastSelectedState({ value, label })
      }
      onValueChange?.(value)
    },
    [enabled, isControlled, selectId, onValueChange]
  )

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      if (!open) setSearch("")
      setInternalOpen(open)
      onOpenChange?.(open)
    },
    [onOpenChange]
  )

  const handleLastSelectedPick = React.useCallback(
    (value: string) => {
      handleValueChange(value)
      handleOpenChange(false)
    },
    [handleValueChange, handleOpenChange]
  )

  const ctx = React.useMemo<LastSelectedContextValue>(
    () => ({
      selectId: selectId ?? null,
      enabled,
      lastSelected,
      renderLastSelected,
      registerItem,
      onSelect: handleLastSelectedPick,
    }),
    [selectId, enabled, lastSelected, renderLastSelected, registerItem, handleLastSelectedPick]
  )

  // When last-selected is enabled, always use controlled mode so we can set value programmatically
  const rootProps = enabled
    ? { value: currentValue, onValueChange: handleValueChange, open: currentOpen, onOpenChange: handleOpenChange }
    : { value: valueProp, defaultValue, onValueChange: handleValueChange, open: openProp, onOpenChange: handleOpenChange }

  const searchCtx = React.useMemo(() => ({ search, setSearch }), [search])

  return (
    <LanguageContext.Provider value={language}>
      <SearchContext.Provider value={searchCtx}>
        <RenderItemContext.Provider value={renderItem}>
          <LastSelectedContext.Provider value={ctx}>
            <SelectPrimitive.Root data-slot="select" {...rootProps} {...props} />
          </LastSelectedContext.Provider>
        </RenderItemContext.Provider>
      </SearchContext.Provider>
    </LanguageContext.Provider>
  )
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
  className,
  size = "default",
  shadow = "xs",
  loading = false,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default"
  shadow?: "none" | "xs" | "sm"
  loading?: boolean
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      disabled={loading || props.disabled}
      className={cn(
        "flex w-fit items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm whitespace-nowrap transition-[color,box-shadow] outline-hidden focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
        shadow === "xs" && "shadow-xs",
        shadow === "sm" && "shadow-sm",
        className
      )}
      {...props}
    >
      {loading ? (
        <>
          <InjectSkeletonStyle />
          <span
            className="h-4 w-24 rounded bg-muted-foreground/30"
            style={{ animation: "skeleton-pulse 1.5s ease-in-out infinite" }}
          />
        </>
      ) : children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position: positionProp,
  align = "center",
  searchable = false,
  searchPlaceholder,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content> & {
  searchable?: boolean
  searchPlaceholder?: string
}) {
  const lang = React.useContext(LanguageContext)
  const resolvedSearchPlaceholder = searchPlaceholder ?? translations[lang].search
  const { search, setSearch } = React.useContext(SearchContext)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Force popper position when searchable (item-aligned doesn't work well with the search input)
  const position = searchable ? "popper" : (positionProp ?? "item-aligned")

  return (
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          data-slot="select-content"
          className={cn(
            "relative z-50 max-h-(--radix-select-content-available-height) min-w-32 origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border bg-popover text-popover-foreground shadow-md data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            position === "popper" &&
              "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
            className
          )}
          position={position}
          align={align}
          {...props}
        >
          {searchable && (
            <div className="sticky top-0 z-10 bg-popover p-1.5 border-b">
              <div className="flex items-center gap-2 px-2">
                <SearchIcon className="size-3.5 shrink-0 text-muted-foreground" />
                <input
                  ref={(node) => {
                    inputRef.current = node
                    if (node) {
                      requestAnimationFrame(() => node.focus())
                    }
                  }}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={resolvedSearchPlaceholder}
                  className="h-7 w-full bg-transparent text-sm outline-hidden placeholder:text-muted-foreground"
                  // Prevent Radix from capturing these keys so the input works normally
                  onKeyDown={(e) => {
                    e.stopPropagation()
                  }}
                />
              </div>
            </div>
          )}
          {!searchable && <SelectScrollUpButton />}
          <SelectPrimitive.Viewport
            className={cn(
              "p-1",
              position === "popper" &&
                "max-h-[min(var(--radix-select-content-available-height,300px),300px)] w-full min-w-(--radix-select-trigger-width) scroll-my-1"
            )}
          >
            {children}
          </SelectPrimitive.Viewport>
          {!searchable && <SelectScrollDownButton />}
          <LastSelectedFooter />
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
  )
}

function LastSelectedFooter() {
  const { enabled, lastSelected, renderLastSelected, onSelect } = React.useContext(LastSelectedContext)
  const lang = React.useContext(LanguageContext)

  if (!enabled || !lastSelected) return null

  const custom = renderLastSelected?.(lastSelected)

  return (
    <div className="sticky bottom-0 z-10 border-t bg-popover px-2 py-1.5">
      <button
        type="button"
        className="flex w-full items-center gap-2 rounded-sm px-1.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        onPointerDown={(e) => e.preventDefault()}
        onClick={() => onSelect(lastSelected.value)}
      >
        {custom ?? (
          <>
            <HistoryIcon className="size-3 shrink-0" />
            <span className="truncate">
              {translations[lang].lastSelected} <span className="font-medium text-foreground">{lastSelected.label}</span>
            </span>
          </>
        )}
      </button>
    </div>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("px-2 py-1.5 text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  searchValue,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item> & {
  searchValue?: string
}) {
  const { search } = React.useContext(SearchContext)
  const { registerItem } = React.useContext(LastSelectedContext)
  const renderItem = React.useContext(RenderItemContext)

  // Register this item's value → label mapping for the last-selected feature
  const label = typeof children === "string" ? children : props.value ?? ""
  React.useEffect(() => {
    registerItem(props.value, label)
  }, [props.value, label, registerItem])

  if (search) {
    const text = (searchValue ?? label).toLowerCase()
    if (!text.includes(search.toLowerCase())) {
      return null
    }
  }

  const customContent = renderItem?.({ value: props.value, label })

  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      {...props}
    >
      <span
        data-slot="select-item-indicator"
        className="absolute right-2 flex size-3.5 items-center justify-center"
      >
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      {customContent ? (
        <>
          <span aria-hidden="true">{customContent}</span>
          <SelectPrimitive.ItemText className="hidden">{children}</SelectPrimitive.ItemText>
        </>
      ) : (
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      )}
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("pointer-events-none -mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  )
}

export type { LastSelectedEntry, SelectLanguage }

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
