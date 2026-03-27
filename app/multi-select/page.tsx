"use client"

import { useState } from "react"

import { DemoBreadcrumb } from "@/app/_components/DemoBreadcrumb"
import { ComponentDoc } from "@/components/ui/component-doc"
import { PALETTE_COLORS, paletteDotBg } from "@/lib/palette"
import { MultiSelect, MultiSelectItem } from "@/components/ui/multi-select"
import type { MultiSelectColor } from "@/components/ui/multi-select"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const FRUITS = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "date", label: "Date" },
  { value: "elderberry", label: "Elderberry" },
  { value: "fig", label: "Fig" },
  { value: "grape", label: "Grape" },
]

const ROLES = [
  { value: "admin", label: "Admin" },
  { value: "editor", label: "Editor" },
  { value: "viewer", label: "Viewer" },
  { value: "commenter", label: "Commenter" },
]

const COUNTRIES = [
  { value: "ar", label: "Argentina" },
  { value: "au", label: "Australia" },
  { value: "at", label: "Austria" },
  { value: "be", label: "Belgium" },
  { value: "br", label: "Brazil" },
  { value: "ca", label: "Canada" },
  { value: "cl", label: "Chile" },
  { value: "cn", label: "China" },
  { value: "co", label: "Colombia" },
  { value: "hr", label: "Croatia" },
  { value: "cz", label: "Czech Republic" },
  { value: "dk", label: "Denmark" },
  { value: "eg", label: "Egypt" },
  { value: "fi", label: "Finland" },
  { value: "fr", label: "France" },
  { value: "de", label: "Germany" },
  { value: "gr", label: "Greece" },
  { value: "hk", label: "Hong Kong" },
  { value: "hu", label: "Hungary" },
  { value: "in", label: "India" },
  { value: "id", label: "Indonesia" },
  { value: "ie", label: "Ireland" },
  { value: "il", label: "Israel" },
  { value: "it", label: "Italy" },
  { value: "jp", label: "Japan" },
  { value: "mx", label: "Mexico" },
  { value: "nl", label: "Netherlands" },
  { value: "nz", label: "New Zealand" },
  { value: "ng", label: "Nigeria" },
  { value: "no", label: "Norway" },
  { value: "pk", label: "Pakistan" },
  { value: "pe", label: "Peru" },
  { value: "ph", label: "Philippines" },
  { value: "pl", label: "Poland" },
  { value: "pt", label: "Portugal" },
  { value: "ro", label: "Romania" },
  { value: "ru", label: "Russia" },
  { value: "sa", label: "Saudi Arabia" },
  { value: "sg", label: "Singapore" },
  { value: "za", label: "South Africa" },
  { value: "kr", label: "South Korea" },
  { value: "es", label: "Spain" },
  { value: "se", label: "Sweden" },
  { value: "ch", label: "Switzerland" },
  { value: "tw", label: "Taiwan" },
  { value: "th", label: "Thailand" },
  { value: "tr", label: "Turkey" },
  { value: "ua", label: "Ukraine" },
  { value: "ae", label: "United Arab Emirates" },
  { value: "gb", label: "United Kingdom" },
  { value: "us", label: "United States" },
  { value: "uy", label: "Uruguay" },
  { value: "vn", label: "Vietnam" },
]

const TEAM = [
  { value: "ana",     name: "Ana Souza",      dept: "Engineering",  initials: "AS", color: "bg-violet-500" },
  { value: "ben",     name: "Ben Carter",     dept: "Design",       initials: "BC", color: "bg-sky-500" },
  { value: "carla",   name: "Carla Mendes",   dept: "Product",      initials: "CM", color: "bg-emerald-500" },
  { value: "diego",   name: "Diego Ferreira", dept: "Engineering",  initials: "DF", color: "bg-orange-500" },
  { value: "eva",     name: "Eva Richter",    dept: "Data",         initials: "ER", color: "bg-pink-500" },
  { value: "felix",   name: "Felix Huang",    dept: "Engineering",  initials: "FH", color: "bg-indigo-500" },
  { value: "grace",   name: "Grace Kim",      dept: "Design",       initials: "GK", color: "bg-rose-500" },
  { value: "henry",   name: "Henry Osei",     dept: "Product",      initials: "HO", color: "bg-teal-500" },
]

const DEPT_COLORS: Record<string, string> = {
  Engineering: "bg-violet-100 text-violet-700",
  Design:      "bg-sky-100 text-sky-700",
  Product:     "bg-emerald-100 text-emerald-700",
  Data:        "bg-pink-100 text-pink-700",
}

export default function MultiSelectPage() {
  const [fruits, setFruits] = useState<string[]>([])
  const [roles, setRoles] = useState<string[]>([])
  const [countries, setCountries] = useState<string[]>([])
  const [color, setColor] = useState<MultiSelectColor>("slate")

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <DemoBreadcrumb />
        <h1 className="mb-6 text-2xl font-semibold tracking-tight">
          MultiSelect
        </h1>

        <div className="flex flex-col gap-10 max-w-xs">
          {/* Basic */}
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Basic
            </h2>
            <MultiSelect
              placeholder="Select fruits..."
              placeholderSearch="Search fruits..."
              onValueChange={setFruits}
            >
              {FRUITS.map((f) => (
                <MultiSelectItem key={f.value} value={f.value}>
                  {f.label}
                </MultiSelectItem>
              ))}
            </MultiSelect>
            {fruits.length > 0 && (
              <p className="mt-2 text-sm text-muted-foreground">
                Selected: {fruits.join(", ")}
              </p>
            )}
          </section>

          {/* Color palette */}
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Color Palette
            </h2>
            <div className="flex items-center gap-2">
              <Select
                value={color}
                onValueChange={(v) => setColor(v as MultiSelectColor)}
                renderItem={({ value }) => (
                  <span className="flex items-center gap-2 capitalize">
                    <span className={`size-2.5 rounded-full ${paletteDotBg[value as MultiSelectColor]}`} />
                    {value}
                  </span>
                )}
              >
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Pick a color" />
                </SelectTrigger>
                <SelectContent>
                  {PALETTE_COLORS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <MultiSelect key={color} color={color} placeholder="Select roles...">
                {ROLES.map((r) => (
                  <MultiSelectItem key={r.value} value={r.value}>
                    {r.label}
                  </MultiSelectItem>
                ))}
              </MultiSelect>
            </div>
          </section>

          {/* Large list */}
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Large List (54 countries)
            </h2>
            <MultiSelect
              color="blue"
              placeholder="Select countries..."
              placeholderSearch="Search countries..."
              onValueChange={setCountries}
            >
              {COUNTRIES.map((c) => (
                <MultiSelectItem key={c.value} value={c.value}>
                  {c.label}
                </MultiSelectItem>
              ))}
            </MultiSelect>
            {countries.length > 0 && (
              <p className="mt-2 text-sm text-muted-foreground">
                {countries.length} selected
              </p>
            )}
          </section>

          {/* Rich items */}
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Rich Items
            </h2>
            <MultiSelect
              color="violet"
              placeholder="Add team members..."
              placeholderSearch="Search members..."
              renderItem={({ value }) => {
                const member = TEAM.find((m) => m.value === value)
                if (!member) return value
                return (
                  <span className="flex items-center gap-2.5">
                    <span className={cn("inline-flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white", member.color)}>
                      {member.initials}
                    </span>
                    <span className="flex flex-col leading-tight">
                      <span className="text-sm font-medium">{member.name}</span>
                      <span className={cn("w-fit rounded px-1 py-px text-[10px] font-medium", DEPT_COLORS[member.dept])}>
                        {member.dept}
                      </span>
                    </span>
                  </span>
                )
              }}
            >
              {TEAM.map((m) => (
                <MultiSelectItem key={m.value} value={m.value}>
                  {m.name}
                </MultiSelectItem>
              ))}
            </MultiSelect>
          </section>

          {/* Disabled */}
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Disabled
            </h2>
            <MultiSelect placeholder="Select fruits..." disabled>
              {FRUITS.map((f) => (
                <MultiSelectItem key={f.value} value={f.value}>
                  {f.label}
                </MultiSelectItem>
              ))}
            </MultiSelect>
          </section>
        </div>

        <ComponentDoc
          title="MultiSelect"
          description="A multi-item select with checkboxes, search input, and chip display for selected values. Consumers render MultiSelectItem children; the component manages selection state internally."
          usage={`import { MultiSelect, MultiSelectItem } from "@/components/ui/multi-select"

const options = [
  { value: "a", label: "Option A" },
  { value: "b", label: "Option B" },
]

<MultiSelect
  color="emerald"
  placeholder="Select..."
  placeholderSearch="Search..."
  onValueChange={(values) => console.log(values)}
>
  {options.map((o) => (
    <MultiSelectItem key={o.value} value={o.value}>
      {o.label}
    </MultiSelectItem>
  ))}
</MultiSelect>`}
          propSections={[
            {
              title: "MultiSelect",
              props: [
                {
                  name: "color",
                  type: '"slate" | "blue" | "cyan" | "teal" | "emerald" | "green" | "indigo" | "violet" | "purple" | "pink" | "rose" | "red" | "orange" | "amber"',
                  default: '"slate"',
                  description: "Color palette applied to the checkbox fill and selected chips.",
                },
                {
                  name: "onValueChange",
                  type: "(value: string[]) => void",
                  required: false,
                  description: "Called with the updated array of selected values whenever selection changes.",
                },
                {
                  name: "placeholder",
                  type: "string",
                  default: '"Select..."',
                  description: "Placeholder shown in the trigger button when nothing is selected.",
                },
                {
                  name: "placeholderSearch",
                  type: "string",
                  default: '"Search..."',
                  description: "Placeholder shown in the search input inside the popover.",
                },
                {
                  name: "renderItem",
                  type: "(entry: { value: string; label: string }) => React.ReactNode",
                  required: false,
                  description: "Custom renderer for each dropdown option. The chip label still uses the children text.",
                },
                {
                  name: "disabled",
                  type: "boolean",
                  default: "false",
                  description: "Disables the trigger button and prevents the popover from opening.",
                },
                {
                  name: "className",
                  type: "string",
                  required: false,
                  description: "Extra classes applied to the trigger button.",
                },
                {
                  name: "children",
                  type: "React.ReactNode",
                  required: true,
                  description: "MultiSelectItem elements to render as options.",
                },
              ],
            },
            {
              title: "MultiSelectItem",
              props: [
                {
                  name: "value",
                  type: "string",
                  required: true,
                  description: "Unique identifier for this option. Returned in the onValueChange array.",
                },
                {
                  name: "children",
                  type: "React.ReactNode",
                  required: true,
                  description: "Label displayed in the list and in the selected chip.",
                },
                {
                  name: "className",
                  type: "string",
                  required: false,
                  description: "Extra classes applied to the command item.",
                },
              ],
            },
          ]}
        />
      </div>
    </main>
  )
}
