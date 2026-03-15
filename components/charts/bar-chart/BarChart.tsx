// BarChart — adapted from Tremor BarChart v1.0.0
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import React from "react"
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Label,
  Legend as RechartsLegend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import type { AxisDomain } from "recharts/types/util/types"

import { cn } from "@/lib/utils"

import {
  CHART_COLORS,
  type ChartColor,
  constructCategoryColors,
  getColorClass,
} from "../utils/chartColors"
import { getYAxisDomain, inferYAxisWidth, measureTextWidth } from "../utils/chartHelpers"
import { useOnWindowResize } from "../utils/useOnWindowResize"

type ChartTextSize = "xs" | "sm" | "md" | "lg" | number

function resolveTextSize(size: ChartTextSize): number {
  if (typeof size === "number") return size
  return { xs: 12, sm: 14, md: 16, lg: 18 }[size]
}

//#region Legend

interface LegendItemProps {
  name: string
  color: ChartColor
  onClick?: (name: string, color: ChartColor) => void
  activeLegend?: string
  textSize?: number
}

const LegendItem = ({
  name,
  color,
  onClick,
  activeLegend,
  textSize,
}: LegendItemProps) => {
  const hasOnValueChange = !!onClick
  return (
    <li
      className={cn(
        // base
        "group inline-flex flex-nowrap items-center gap-1.5 rounded-sm px-2 py-1 whitespace-nowrap transition",
        hasOnValueChange
          ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
          : "cursor-default",
      )}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.(name, color)
      }}
    >
      <span
        className={cn(
          "h-0.75 w-3.5 shrink-0 rounded-full",
          getColorClass(color, "bg"),
          activeLegend && activeLegend !== name ? "opacity-40" : "opacity-100",
        )}
        aria-hidden={true}
      />
      <p
        className={cn(
          // base
          "truncate whitespace-nowrap",
          // text color
          "text-gray-700 dark:text-gray-300",
          hasOnValueChange &&
            "group-hover:text-gray-900 dark:group-hover:text-gray-50",
          activeLegend && activeLegend !== name ? "opacity-40" : "opacity-100",
        )}
        style={{ fontSize: textSize }}
      >
        {name}
      </p>
    </li>
  )
}

interface ScrollButtonProps {
  icon: React.ElementType
  onClick?: () => void
  disabled?: boolean
}

const ScrollButton = ({ icon, onClick, disabled }: ScrollButtonProps) => {
  const Icon = icon
  const [isPressed, setIsPressed] = React.useState(false)
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null)

  React.useEffect(() => {
    if (isPressed) {
      intervalRef.current = setInterval(() => {
        onClick?.()
      }, 300)
    } else {
      clearInterval(intervalRef.current as NodeJS.Timeout)
    }
    return () => clearInterval(intervalRef.current as NodeJS.Timeout)
  }, [isPressed, onClick])

  React.useEffect(() => {
    if (disabled) {
      clearInterval(intervalRef.current as NodeJS.Timeout)
      setIsPressed(false)
    }
  }, [disabled])

  return (
    <button
      type="button"
      className={cn(
        // base
        "group inline-flex size-5 items-center truncate rounded-sm transition",
        disabled
          ? "cursor-not-allowed text-gray-400 dark:text-gray-600"
          : "cursor-pointer text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50",
      )}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
      onMouseDown={(e) => {
        e.stopPropagation()
        setIsPressed(true)
      }}
      onMouseUp={(e) => {
        e.stopPropagation()
        setIsPressed(false)
      }}
    >
      <Icon className="size-3.5" aria-hidden="true" />
    </button>
  )
}

interface LegendProps extends React.OlHTMLAttributes<HTMLOListElement> {
  categories: string[]
  colors?: ChartColor[]
  onClickLegendItem?: (category: string, color: string) => void
  activeLegend?: string
  enableLegendSlider?: boolean
  textSize?: number
}

type HasScrollProps = {
  left: boolean
  right: boolean
}

const Legend = React.forwardRef<HTMLOListElement, LegendProps>((props, ref) => {
  const {
    categories,
    colors = CHART_COLORS,
    className,
    onClickLegendItem,
    activeLegend,
    enableLegendSlider = false,
    textSize,
    ...other
  } = props
  const scrollableRef = React.useRef<HTMLInputElement>(null)
  const scrollButtonsRef = React.useRef<HTMLDivElement>(null)
  const [hasScroll, setHasScroll] = React.useState<HasScrollProps | null>(null)
  const [isKeyDowned, setIsKeyDowned] = React.useState<string | null>(null)
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null)

  const checkScroll = React.useCallback(() => {
    const scrollable = scrollableRef?.current
    if (!scrollable) return

    const hasLeftScroll = scrollable.scrollLeft > 0
    const hasRightScroll =
      scrollable.scrollWidth - scrollable.clientWidth > scrollable.scrollLeft

    setHasScroll({ left: hasLeftScroll, right: hasRightScroll })
  }, [setHasScroll])

  const scrollToTest = React.useCallback(
    (direction: "left" | "right") => {
      const element = scrollableRef?.current
      const scrollButtons = scrollButtonsRef?.current
      const scrollButtonsWith = scrollButtons?.clientWidth ?? 0
      const width = element?.clientWidth ?? 0

      if (element && enableLegendSlider) {
        element.scrollTo({
          left:
            direction === "left"
              ? element.scrollLeft - width + scrollButtonsWith
              : element.scrollLeft + width - scrollButtonsWith,
          behavior: "smooth",
        })
        setTimeout(() => {
          checkScroll()
        }, 400)
      }
    },
    [enableLegendSlider, checkScroll],
  )

  React.useEffect(() => {
    const keyDownHandler = (key: string) => {
      if (key === "ArrowLeft") {
        scrollToTest("left")
      } else if (key === "ArrowRight") {
        scrollToTest("right")
      }
    }
    if (isKeyDowned) {
      keyDownHandler(isKeyDowned)
      intervalRef.current = setInterval(() => {
        keyDownHandler(isKeyDowned)
      }, 300)
    } else {
      clearInterval(intervalRef.current as NodeJS.Timeout)
    }
    return () => clearInterval(intervalRef.current as NodeJS.Timeout)
  }, [isKeyDowned, scrollToTest])

  const keyDown = (e: KeyboardEvent) => {
    e.stopPropagation()
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault()
      setIsKeyDowned(e.key)
    }
  }
  const keyUp = (e: KeyboardEvent) => {
    e.stopPropagation()
    setIsKeyDowned(null)
  }

  React.useEffect(() => {
    const scrollable = scrollableRef?.current
    if (enableLegendSlider) {
      checkScroll()
      scrollable?.addEventListener("keydown", keyDown)
      scrollable?.addEventListener("keyup", keyUp)
    }

    return () => {
      scrollable?.removeEventListener("keydown", keyDown)
      scrollable?.removeEventListener("keyup", keyUp)
    }
  }, [checkScroll, enableLegendSlider])

  return (
    <ol
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      {...other}
    >
      <div
        ref={scrollableRef}
        tabIndex={0}
        className={cn(
          "flex h-full",
          enableLegendSlider
            ? hasScroll?.right || hasScroll?.left
              ? "snap-mandatory items-center overflow-auto pr-12 pl-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              : ""
            : "flex-wrap",
        )}
      >
        {categories.map((category, index) => (
          <LegendItem
            key={`item-${index}`}
            name={category}
            color={colors[index] as ChartColor}
            onClick={onClickLegendItem}
            activeLegend={activeLegend}
            textSize={textSize}
          />
        ))}
      </div>
      {enableLegendSlider && (hasScroll?.right || hasScroll?.left) ? (
        <>
          <div
            ref={scrollButtonsRef}
            className={cn(
              // base
              "absolute top-0 right-0 bottom-0 flex h-full items-center justify-center pr-1",
              // background color
              "bg-white dark:bg-gray-950",
            )}
          >
            <ScrollButton
              icon={ChevronLeft}
              onClick={() => {
                setIsKeyDowned(null)
                scrollToTest("left")
              }}
              disabled={!hasScroll?.left}
            />
            <ScrollButton
              icon={ChevronRight}
              onClick={() => {
                setIsKeyDowned(null)
                scrollToTest("right")
              }}
              disabled={!hasScroll?.right}
            />
          </div>
        </>
      ) : null}
    </ol>
  )
})

Legend.displayName = "Legend"

const ChartLegend = (
  { payload }: any,
  categoryColors: Map<string, ChartColor | string>,
  setLegendHeight: React.Dispatch<React.SetStateAction<number>>,
  activeLegend: string | undefined,
  onClick?: (category: string, color: string) => void,
  enableLegendSlider?: boolean,
  legendPosition?: "left" | "center" | "right",
  yAxisWidth?: number,
  textSize?: number,
) => {
  const legendRef = React.useRef<HTMLDivElement>(null)

  useOnWindowResize(() => {
    const calculateHeight = (height: number | undefined) =>
      height ? Number(height) + 15 : 60
    setLegendHeight(calculateHeight(legendRef.current?.clientHeight))
  })

  const legendPayload = payload.filter((item: any) => item.type !== "none")

  const paddingLeft =
    legendPosition === "left" && yAxisWidth ? yAxisWidth - 8 : 0

  return (
    <div
      ref={legendRef}
      style={{ paddingLeft: paddingLeft }}
      className={cn(
        "flex items-center",
        { "justify-center": legendPosition === "center" },
        { "justify-start": legendPosition === "left" },
        { "justify-end": legendPosition === "right" },
      )}
    >
      <Legend
        categories={legendPayload.map((entry: any) => entry.value)}
        colors={legendPayload.map((entry: any) =>
          categoryColors.get(entry.value),
        )}
        onClickLegendItem={onClick}
        activeLegend={activeLegend}
        enableLegendSlider={enableLegendSlider}
        textSize={textSize}
      />
    </div>
  )
}

//#region Tooltip

type TooltipProps = Pick<ChartTooltipProps, "active" | "payload" | "label">

type PayloadItem = {
  category: string
  value: number
  index: string
  color: ChartColor
  type?: string
  payload: any
}

interface ChartTooltipProps {
  active: boolean | undefined
  payload: PayloadItem[]
  label: string
  valueFormatter: (value: number) => string
}

const ChartTooltip = ({
  active,
  payload,
  label,
  valueFormatter,
}: ChartTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div
        className={cn(
          // base
          "rounded-md border text-sm shadow-md",
          // border color
          "border-gray-200 dark:border-gray-800",
          // background color
          "bg-white dark:bg-gray-950",
        )}
      >
        <div className={cn("border-b border-inherit px-4 py-2")}>
          <p
            className={cn(
              // base
              "font-medium",
              // text color
              "text-gray-900 dark:text-gray-50",
            )}
          >
            {label}
          </p>
        </div>
        <div className={cn("space-y-1 px-4 py-2")}>
          {payload.map(({ value, category, color }, index) => (
            <div
              key={`id-${index}`}
              className="flex items-center justify-between space-x-8"
            >
              <div className="flex items-center space-x-2">
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-0.75 w-3.5 shrink-0 rounded-full",
                    getColorClass(color, "bg"),
                  )}
                />
                <p
                  className={cn(
                    // base
                    "text-right whitespace-nowrap",
                    // text color
                    "text-gray-700 dark:text-gray-300",
                  )}
                >
                  {category}
                </p>
              </div>
              <p
                className={cn(
                  // base
                  "text-right font-medium whitespace-nowrap tabular-nums",
                  // text color
                  "text-gray-900 dark:text-gray-50",
                )}
              >
                {valueFormatter(value)}
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return null
}

//#region BarChart

interface ActiveBar {
  index?: number
  dataKey?: string
}

type BaseEventProps = {
  eventType: "bar" | "category"
  categoryClicked: string
  [key: string]: number | string
}

type BarChartEventProps = BaseEventProps | null | undefined

interface BarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: Record<string, any>[]
  index: string
  categories: string[]
  colors?: ChartColor[]
  valueFormatter?: (value: number) => string
  layout?: "vertical" | "horizontal"
  type?: "default" | "stacked" | "percent"
  barCategoryGap?: string | number
  startEndOnly?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
  showGridLines?: boolean
  yAxisWidth?: number
  intervalType?: "preserveStartEnd" | "equidistantPreserveStart"
  showTooltip?: boolean
  showLegend?: boolean
  autoMinValue?: boolean
  minValue?: number
  maxValue?: number
  allowDecimals?: boolean
  onValueChange?: (value: BarChartEventProps) => void
  enableLegendSlider?: boolean
  tickGap?: number
  xAxisLabel?: string
  yAxisLabel?: string
  legendPosition?: "left" | "center" | "right"
  axisTextSize?: ChartTextSize
  legendTextSize?: ChartTextSize
  rounded?: boolean
  labelTruncateAt?: number
  tooltipFullLabel?: boolean
  tooltipCallback?: (tooltipCallbackContent: TooltipProps) => void
  customTooltip?: React.ComponentType<TooltipProps>
}

const BarChart = React.forwardRef<HTMLDivElement, BarChartProps>(
  (props, ref) => {
    const {
      data = [],
      categories = [],
      index,
      colors = CHART_COLORS,
      valueFormatter = (value: number) => value.toString(),
      layout = "horizontal",
      type = "default",
      barCategoryGap,
      startEndOnly = false,
      showXAxis = true,
      showYAxis = true,
      showGridLines = true,
      yAxisWidth,
      intervalType = "equidistantPreserveStart",
      showTooltip = true,
      showLegend = true,
      autoMinValue = false,
      minValue,
      maxValue,
      allowDecimals = true,
      className,
      onValueChange,
      enableLegendSlider = false,
      tickGap = 5,
      xAxisLabel,
      yAxisLabel,
      legendPosition = "right",
      axisTextSize = "xs",
      legendTextSize = "sm",
      rounded = false,
      labelTruncateAt,
      tooltipFullLabel = true,
      tooltipCallback,
      customTooltip,
      ...other
    } = props

    const CustomTooltip = customTooltip
    const [legendHeight, setLegendHeight] = React.useState(60)
    const [activeBar, setActiveBar] = React.useState<ActiveBar | undefined>(undefined)
    const [activeLegend, setActiveLegend] = React.useState<string | undefined>(undefined)

    const categoryColors = constructCategoryColors(categories, colors as ChartColor[])
    const yAxisDomain = getYAxisDomain(autoMinValue, minValue, maxValue)
    const resolvedAxisTextSize = resolveTextSize(axisTextSize)
    const resolvedLegendTextSize = resolveTextSize(legendTextSize)
    const hasOnValueChange = !!onValueChange
    const stacked = type === "stacked" || type === "percent"
    const isVertical = layout === "vertical"

    const prevActiveRef = React.useRef<boolean | undefined>(undefined)
    const prevLabelRef = React.useRef<string | undefined>(undefined)

    const truncateLabel = React.useCallback(
      (label: string) => {
        if (!labelTruncateAt || label.length <= labelTruncateAt) return label
        return label.slice(0, labelTruncateAt) + "..."
      },
      [labelTruncateAt],
    )

    function valueToPercent(value: number) {
      return `${(value * 100).toFixed(0)}%`
    }

    const resolvedYAxisWidth = React.useMemo(() => {
      if (yAxisWidth !== undefined) return yAxisWidth
      if (isVertical) {
        // In vertical layout YAxis holds category labels — measure longest (possibly truncated) label
        const longestLabel = data.reduce((longest, row) => {
          const val = String(row[index] ?? "")
          const display = labelTruncateAt && val.length > labelTruncateAt ? val.slice(0, labelTruncateAt) + "..." : val
          return display.length > longest.length ? display : longest
        }, "")
        return Math.min(Math.ceil(measureTextWidth(longestLabel) * 1.15) + 8, 200)
      }
      if (type === "percent") {
        return inferYAxisWidth([{ v: 0 }, { v: 0.5 }, { v: 1 }], ["v"], (v) => `${(v * 100).toFixed(0)}%`)
      }
      return inferYAxisWidth(data, categories, valueFormatter)
    }, [yAxisWidth, data, categories, type, valueFormatter, isVertical, index, labelTruncateAt])

    function onBarClick(barData: any, barIndex: number, category: string) {
      if (!hasOnValueChange) return
      if (activeBar?.index === barIndex && activeBar?.dataKey === category) {
        setActiveBar(undefined)
        setActiveLegend(undefined)
        onValueChange?.(null)
      } else {
        setActiveBar({ index: barIndex, dataKey: category })
        setActiveLegend(category)
        onValueChange?.({
          eventType: "bar",
          categoryClicked: category,
          ...barData.payload,
        })
      }
    }

    function onCategoryClick(dataKey: string) {
      if (!hasOnValueChange) return
      if (dataKey === activeLegend && !activeBar) {
        setActiveLegend(undefined)
        onValueChange?.(null)
      } else {
        setActiveLegend(dataKey)
        onValueChange?.({
          eventType: "category",
          categoryClicked: dataKey,
        })
      }
      setActiveBar(undefined)
    }

    // Axis components switch based on layout
    const categoryAxis = (
      <XAxis
        hide={!showXAxis}
        dataKey={index}
        type="category"
        interval={startEndOnly ? "preserveStartEnd" : intervalType}
        tick={{ transform: "translate(0, 6)", fontSize: resolvedAxisTextSize }}
        ticks={
          startEndOnly
            ? [data[0]?.[index], data[data.length - 1]?.[index]]
            : undefined
        }
        fill=""
        stroke=""
        className={cn("text-xs", "fill-gray-500 dark:fill-gray-500")}
        tickLine={false}
        axisLine={false}
        minTickGap={tickGap}
        tickFormatter={truncateLabel}
      >
        {xAxisLabel && (
          <Label
            position="insideBottom"
            offset={-20}
            className="fill-gray-800 text-sm font-medium dark:fill-gray-200"
          >
            {xAxisLabel}
          </Label>
        )}
      </XAxis>
    )

    const valueAxis = (
      <YAxis
        width={resolvedYAxisWidth}
        hide={!showYAxis}
        axisLine={false}
        tickLine={false}
        type="number"
        domain={yAxisDomain as AxisDomain}
        tick={{ transform: "translate(-3, 0)", fontSize: resolvedAxisTextSize }}
        fill=""
        stroke=""
        className={cn("text-xs", "fill-gray-500 dark:fill-gray-500")}
        tickFormatter={type === "percent" ? valueToPercent : valueFormatter}
        allowDecimals={allowDecimals}
      >
        {yAxisLabel && (
          <Label
            position="insideLeft"
            style={{ textAnchor: "middle" }}
            angle={-90}
            offset={-15}
            className="fill-gray-800 text-sm font-medium dark:fill-gray-200"
          >
            {yAxisLabel}
          </Label>
        )}
      </YAxis>
    )

    // In vertical layout: X = values, Y = categories
    const xAxisEl = isVertical ? (
      <XAxis
        hide={!showXAxis}
        type="number"
        domain={yAxisDomain as AxisDomain}
        tick={{ transform: "translate(0, 6)", fontSize: resolvedAxisTextSize }}
        fill=""
        stroke=""
        className={cn("text-xs", "fill-gray-500 dark:fill-gray-500")}
        tickLine={false}
        axisLine={false}
        minTickGap={tickGap}
        tickFormatter={type === "percent" ? valueToPercent : valueFormatter}
        allowDecimals={allowDecimals}
      >
        {xAxisLabel && (
          <Label
            position="insideBottom"
            offset={-20}
            className="fill-gray-800 text-sm font-medium dark:fill-gray-200"
          >
            {xAxisLabel}
          </Label>
        )}
      </XAxis>
    ) : categoryAxis

    const yAxisEl = isVertical ? (
      <YAxis
        width={resolvedYAxisWidth}
        hide={!showYAxis}
        dataKey={index}
        type="category"
        tick={{ fontSize: resolvedAxisTextSize }}
        fill=""
        stroke=""
        className={cn("text-xs", "fill-gray-500 dark:fill-gray-500")}
        tickLine={false}
        axisLine={false}
        tickFormatter={truncateLabel}
      >
        {yAxisLabel && (
          <Label
            position="insideLeft"
            style={{ textAnchor: "middle" }}
            angle={-90}
            offset={-15}
            className="fill-gray-800 text-sm font-medium dark:fill-gray-200"
          >
            {yAxisLabel}
          </Label>
        )}
      </YAxis>
    ) : valueAxis

    return (
      <div
        ref={ref}
        className={cn("h-80 w-full **:outline-none", className)}
        {...other}
      >
        <ResponsiveContainer>
          <RechartsBarChart
            data={data}
            layout={layout}
            barCategoryGap={barCategoryGap}
            stackOffset={type === "percent" ? "expand" : undefined}
            onClick={
              hasOnValueChange && (activeLegend || activeBar)
                ? () => {
                    setActiveBar(undefined)
                    setActiveLegend(undefined)
                    onValueChange?.(null)
                  }
                : undefined
            }
            margin={{
              bottom: xAxisLabel ? 30 : undefined,
              left: yAxisLabel ? 20 : undefined,
              right: yAxisLabel ? 5 : undefined,
              top: 5,
            }}
          >
            {showGridLines ? (
              <CartesianGrid
                className={cn("stroke-gray-200 stroke-1 dark:stroke-gray-800")}
                horizontal={!isVertical}
                vertical={isVertical}
              />
            ) : null}

            {xAxisEl}
            {yAxisEl}

            <Tooltip
              wrapperStyle={{ outline: "none", zIndex: 10 }}
              isAnimationActive={true}
              animationDuration={100}
              cursor={{ fill: "rgba(128,128,128,0.08)" }}
              offset={20}
              position={{ y: 0 }}
              content={({ active, payload, label }) => {
                const cleanPayload: TooltipProps["payload"] = payload
                  ? payload
                      .filter((item: any) => categories.includes(item.dataKey))
                      .map((item: any) => ({
                        category: item.dataKey,
                        value: item.value,
                        index: item.payload[index],
                        color: categoryColors.get(item.dataKey) as ChartColor,
                        type: item.type,
                        payload: item.payload,
                      }))
                  : []

                const labelStr = String(label ?? "")
                const tooltipLabel = tooltipFullLabel ? labelStr : truncateLabel(labelStr)

                if (
                  tooltipCallback &&
                  (active !== prevActiveRef.current ||
                    labelStr !== prevLabelRef.current)
                ) {
                  tooltipCallback({ active, payload: cleanPayload, label: tooltipLabel })
                  prevActiveRef.current = active
                  prevLabelRef.current = labelStr
                }

                return showTooltip && active ? (
                  CustomTooltip ? (
                    <CustomTooltip
                      active={active}
                      payload={cleanPayload}
                      label={tooltipLabel}
                    />
                  ) : (
                    <ChartTooltip
                      active={active}
                      payload={cleanPayload}
                      label={tooltipLabel}
                      valueFormatter={valueFormatter}
                    />
                  )
                ) : null
              }}
            />

            {showLegend ? (
              <RechartsLegend
                verticalAlign="top"
                height={legendHeight}
                content={({ payload }) =>
                  ChartLegend(
                    { payload },
                    categoryColors,
                    setLegendHeight,
                    activeLegend,
                    hasOnValueChange
                      ? (clickedLegendItem: string) =>
                          onCategoryClick(clickedLegendItem)
                      : undefined,
                    enableLegendSlider,
                    legendPosition,
                    resolvedYAxisWidth,
                    resolvedLegendTextSize,
                  )
                }
              />
            ) : null}

            {categories.map((category) => (
              <Bar
                key={`bar-${category}`}
                name={category}
                dataKey={category}
                stackId={stacked ? "stack" : undefined}
                isAnimationActive={false}
                onClick={(barData: any, barIndex: number, event: React.MouseEvent) => {
                  event.stopPropagation()
                  onBarClick(barData, barIndex, category)
                }}
                className={onValueChange ? "cursor-pointer" : ""}
                shape={(shapeProps: any) => {
                  const { x, y, width, height, index: barIndex } = shapeProps
                  const isActive =
                    (!activeBar && !activeLegend) ||
                    (activeBar?.index === barIndex && activeBar?.dataKey === category) ||
                    (!activeBar && activeLegend === category)

                  return (
                    <rect
                      x={x}
                      y={y}
                      width={Math.max(0, width)}
                      height={Math.max(0, height)}
                      rx={rounded ? 8 : 0}
                      className={getColorClass(categoryColors.get(category) as ChartColor, "fill")}
                      opacity={isActive ? 1 : 0.3}
                    />
                  )
                }}
              />
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    )
  },
)

BarChart.displayName = "BarChart"

export { BarChart, type BarChartEventProps, type ChartTextSize, type TooltipProps }
