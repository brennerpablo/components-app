"use client";

import { RotateCcw } from "lucide-react";
import { useState } from "react";

import { DemoBreadcrumb } from "@/app/_components/DemoBreadcrumb";
import type { LastSelectedEntry } from "@/components/ui/select";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { SelectDocs } from "./docs";

const CARS = [
  // SUVs
  { value: "rav4", label: "Toyota RAV4", drivetrain: "AWD", hp: 203, category: "suv" },
  { value: "cr-v", label: "Honda CR-V", drivetrain: "AWD", hp: 190, category: "suv" },
  { value: "wrangler", label: "Jeep Wrangler", drivetrain: "4WD", hp: 285, category: "suv" },
  { value: "4runner", label: "Toyota 4Runner", drivetrain: "4WD", hp: 270, category: "suv" },
  { value: "x5", label: "BMW X5", drivetrain: "AWD", hp: 375, category: "suv" },
  // Sedans
  { value: "camry", label: "Toyota Camry", drivetrain: "FWD", hp: 203, category: "sedan" },
  { value: "accord", label: "Honda Accord", drivetrain: "FWD", hp: 192, category: "sedan" },
  { value: "m3", label: "BMW M3", drivetrain: "RWD", hp: 473, category: "sedan" },
  { value: "model3", label: "Tesla Model 3", drivetrain: "AWD", hp: 346, category: "sedan" },
  // Sports
  { value: "supra", label: "Toyota Supra", drivetrain: "RWD", hp: 382, category: "sports" },
  { value: "911", label: "Porsche 911", drivetrain: "AWD", hp: 443, category: "sports" },
  { value: "corvette", label: "Chevrolet Corvette", drivetrain: "RWD", hp: 495, category: "sports" },
] as const;

export default function SelectPage() {
  const [fruit, setFruit] = useState("");
  const [timezone, setTimezone] = useState("");

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-10">
        <DemoBreadcrumb />
        <h1 className="text-2xl font-semibold tracking-tight">Select</h1>

        {/* Basic */}
        <section className="space-y-3">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Basic
          </h2>
          <Select value={fruit} onValueChange={setFruit}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="orange">Orange</SelectItem>
              <SelectItem value="grape">Grape</SelectItem>
              <SelectItem value="pineapple">Pineapple</SelectItem>
            </SelectContent>
          </Select>
          {fruit && (
            <p className="text-sm text-muted-foreground">
              Selected: <span className="text-foreground font-medium">{fruit}</span>
            </p>
          )}
        </section>

        {/* With groups */}
        <section className="space-y-3">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Grouped
          </h2>
          <Select value={timezone} onValueChange={setTimezone}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select a timezone" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>North America</SelectLabel>
                <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
                <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
                <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Europe</SelectLabel>
                <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
                <SelectItem value="cet">Central European Time (CET)</SelectItem>
                <SelectItem value="eet">Eastern European Time (EET)</SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>South America</SelectLabel>
                <SelectItem value="brt">Brasilia Time (BRT)</SelectItem>
                <SelectItem value="art">Argentina Time (ART)</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </section>

        {/* Small size */}
        <section className="space-y-3">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Small
          </h2>
          <Select>
            <SelectTrigger className="w-[200px]" size="sm">
              <SelectValue placeholder="Small trigger" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sm1">Option A</SelectItem>
              <SelectItem value="sm2">Option B</SelectItem>
              <SelectItem value="sm3">Option C</SelectItem>
            </SelectContent>
          </Select>
        </section>

        {/* Long list with search */}
        <section className="space-y-3">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Searchable
          </h2>
          <Select>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent searchable searchPlaceholder="Search countries...">
              <SelectGroup>
                <SelectLabel>Americas</SelectLabel>
                <SelectItem value="ar">Argentina</SelectItem>
                <SelectItem value="bo">Bolivia</SelectItem>
                <SelectItem value="br">Brazil</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                <SelectItem value="cl">Chile</SelectItem>
                <SelectItem value="co">Colombia</SelectItem>
                <SelectItem value="cr">Costa Rica</SelectItem>
                <SelectItem value="cu">Cuba</SelectItem>
                <SelectItem value="ec">Ecuador</SelectItem>
                <SelectItem value="mx">Mexico</SelectItem>
                <SelectItem value="pa">Panama</SelectItem>
                <SelectItem value="pe">Peru</SelectItem>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="uy">Uruguay</SelectItem>
                <SelectItem value="ve">Venezuela</SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Europe</SelectLabel>
                <SelectItem value="at">Austria</SelectItem>
                <SelectItem value="be">Belgium</SelectItem>
                <SelectItem value="cz">Czech Republic</SelectItem>
                <SelectItem value="dk">Denmark</SelectItem>
                <SelectItem value="fi">Finland</SelectItem>
                <SelectItem value="fr">France</SelectItem>
                <SelectItem value="de">Germany</SelectItem>
                <SelectItem value="gr">Greece</SelectItem>
                <SelectItem value="hu">Hungary</SelectItem>
                <SelectItem value="ie">Ireland</SelectItem>
                <SelectItem value="it">Italy</SelectItem>
                <SelectItem value="nl">Netherlands</SelectItem>
                <SelectItem value="no">Norway</SelectItem>
                <SelectItem value="pl">Poland</SelectItem>
                <SelectItem value="pt">Portugal</SelectItem>
                <SelectItem value="ro">Romania</SelectItem>
                <SelectItem value="es">Spain</SelectItem>
                <SelectItem value="se">Sweden</SelectItem>
                <SelectItem value="ch">Switzerland</SelectItem>
                <SelectItem value="gb">United Kingdom</SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Asia & Oceania</SelectLabel>
                <SelectItem value="au">Australia</SelectItem>
                <SelectItem value="cn">China</SelectItem>
                <SelectItem value="in">India</SelectItem>
                <SelectItem value="id">Indonesia</SelectItem>
                <SelectItem value="jp">Japan</SelectItem>
                <SelectItem value="my">Malaysia</SelectItem>
                <SelectItem value="nz">New Zealand</SelectItem>
                <SelectItem value="ph">Philippines</SelectItem>
                <SelectItem value="sg">Singapore</SelectItem>
                <SelectItem value="kr">South Korea</SelectItem>
                <SelectItem value="th">Thailand</SelectItem>
                <SelectItem value="vn">Vietnam</SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Africa & Middle East</SelectLabel>
                <SelectItem value="eg">Egypt</SelectItem>
                <SelectItem value="il">Israel</SelectItem>
                <SelectItem value="ke">Kenya</SelectItem>
                <SelectItem value="ma">Morocco</SelectItem>
                <SelectItem value="ng">Nigeria</SelectItem>
                <SelectItem value="za">South Africa</SelectItem>
                <SelectItem value="ae">United Arab Emirates</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </section>

        {/* Custom item render */}
        <section className="space-y-3">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Custom Items
          </h2>
          <p className="text-sm text-muted-foreground">
            Uses <code className="text-xs bg-muted px-1 py-0.5 rounded">renderItem</code> to add colored dots.
          </p>
          <Select
            renderItem={({ value, label }) => {
              const colors: Record<string, string> = {
                red: "bg-red-500",
                blue: "bg-blue-500",
                green: "bg-green-500",
                purple: "bg-purple-500",
                amber: "bg-amber-500",
                pink: "bg-pink-500",
              };
              return (
                <span className="flex items-center gap-2">
                  <span className={`size-2.5 rounded-full ${colors[value] ?? "bg-muted-foreground"}`} />
                  {label}
                </span>
              );
            }}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Pick a color" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="red">Red</SelectItem>
              <SelectItem value="blue">Blue</SelectItem>
              <SelectItem value="green">Green</SelectItem>
              <SelectItem value="purple">Purple</SelectItem>
              <SelectItem value="amber">Amber</SelectItem>
              <SelectItem value="pink">Pink</SelectItem>
            </SelectContent>
          </Select>
        </section>

        {/* Custom item render — car list */}
        <section className="space-y-3">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Rich Items (Cars)
          </h2>
          <p className="text-sm text-muted-foreground">
            Each row shows drivetrain and horsepower. The trigger displays only the car name.
          </p>
          <Select
            renderItem={({ value }) => {
              const car = CARS.find((c) => c.value === value);
              if (!car) return value;
              return (
                <span className="flex flex-col gap-0.5">
                  <span className="font-medium">{car.label}</span>
                  <span className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium">
                      {car.drivetrain}
                    </span>
                    <span>{car.hp} HP</span>
                  </span>
                </span>
              );
            }}
          >
            <SelectTrigger className="w-[260px]">
              <SelectValue placeholder="Select a car" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>SUVs</SelectLabel>
                {CARS.filter((c) => c.category === "suv").map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Sedans</SelectLabel>
                {CARS.filter((c) => c.category === "sedan").map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Sports</SelectLabel>
                {CARS.filter((c) => c.category === "sports").map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </section>

        {/* Last selected */}
        <section className="space-y-3">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Last Selected
          </h2>
          <p className="text-sm text-muted-foreground">
            Select a value, close, then reopen — the last pick is shown at the bottom.
          </p>
          <Select selectId="demo-color" enableLastSelected>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Pick a color" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="red">Red</SelectItem>
              <SelectItem value="blue">Blue</SelectItem>
              <SelectItem value="green">Green</SelectItem>
              <SelectItem value="purple">Purple</SelectItem>
              <SelectItem value="orange">Orange</SelectItem>
              <SelectItem value="pink">Pink</SelectItem>
              <SelectItem value="teal">Teal</SelectItem>
              <SelectItem value="yellow">Yellow</SelectItem>
            </SelectContent>
          </Select>
        </section>

        {/* Last selected with custom render */}
        <section className="space-y-3">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Last Selected (Custom)
          </h2>
          <p className="text-sm text-muted-foreground">
            Same feature with a custom footer via <code className="text-xs bg-muted px-1 py-0.5 rounded">renderLastSelected</code>.
          </p>
          <Select
            selectId="demo-fruit-custom"
            enableLastSelected
            renderLastSelected={(entry: LastSelectedEntry) => (
              <>
                <RotateCcw className="size-3 shrink-0" />
                <span className="truncate">
                  Reuse <span className="font-semibold text-foreground">&quot;{entry.label}&quot;</span>
                </span>
              </>
            )}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Pick a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="mango">Mango</SelectItem>
              <SelectItem value="strawberry">Strawberry</SelectItem>
              <SelectItem value="watermelon">Watermelon</SelectItem>
            </SelectContent>
          </Select>
        </section>

        {/* Disabled */}
        <section className="space-y-3">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Disabled
          </h2>
          <Select disabled>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Disabled" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="x">Option</SelectItem>
            </SelectContent>
          </Select>
        </section>

        <SelectDocs />
      </div>
    </main>
  );
}
