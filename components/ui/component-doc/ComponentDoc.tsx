"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { highlight } from "sugar-high";

import { cn } from "@/lib/utils";

export interface PropDef {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description?: string;
}

export interface PropSection {
  title: string;
  props: PropDef[];
}

export interface ComponentDocProps {
  title: string;
  description?: string;
  usage: string;
  /** Single flat props list — renders under a single "Props" heading. */
  props?: PropDef[];
  /** Multiple named prop sections — renders each with its own sub-heading. */
  propSections?: PropSection[];
  className?: string;
}

export function ComponentDoc({
  title,
  description,
  usage,
  props = [],
  propSections = [],
  className,
}: ComponentDocProps) {
  return (
    <section
      className={cn("mt-16 border-t border-border pt-10 space-y-8", className)}
    >
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      {/* Usage */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-foreground/80 uppercase tracking-wider">
          Usage
        </h3>
        <CodeBlock code={usage} />
      </div>

      {/* Single props list */}
      {props.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-foreground/80 uppercase tracking-wider">
            Props
          </h3>
          <PropsTable props={props} />
        </div>
      )}

      {/* Multiple named prop sections */}
      {propSections.map((section) => (
        <div key={section.title} className="space-y-2">
          <h3 className="text-sm font-medium text-foreground/80 uppercase tracking-wider">
            {section.title}
          </h3>
          <PropsTable props={section.props} />
        </div>
      ))}
    </section>
  );
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div
      className="relative rounded-lg border border-neutral-700/60 overflow-hidden"
      style={
        {
          backgroundColor: "#272822",
          "--sh-keyword": "#f92672",
          "--sh-string": "#e6db74",
          "--sh-comment": "#75715e",
          "--sh-class": "#a6e22e",
          "--sh-identifier": "#f8f8f2",
          "--sh-sign": "#f8f8f2",
          "--sh-property": "#66d9e8",
          "--sh-entity": "#fd971f",
          "--sh-jsxliterals": "#66d9e8",
        } as React.CSSProperties
      }
    >
      <button
        onClick={handleCopy}
        aria-label="Copy code"
        className="absolute right-3 top-3 flex items-center gap-1.5 rounded-md border border-neutral-600/60 bg-black/20 px-2 py-1 text-xs text-neutral-400 hover:text-neutral-100 hover:bg-black/40 transition-colors"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-emerald-500" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
        {copied ? "Copied" : "Copy"}
      </button>
      <pre className="overflow-x-auto p-6 pr-20 text-sm font-mono text-[#f8f8f2] leading-relaxed">
        <code dangerouslySetInnerHTML={{ __html: highlight(code) }} />
      </pre>
    </div>
  );
}

function PropsTable({ props }: { props: PropDef[] }) {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th className="text-left px-4 py-2.5 font-medium text-foreground/70 w-40">
              Prop
            </th>
            <th className="text-left px-4 py-2.5 font-medium text-foreground/70 w-50">
              Type
            </th>
            <th className="text-left px-4 py-2.5 font-medium text-foreground/70 w-25">
              Default
            </th>
            <th className="text-left px-4 py-2.5 font-medium text-foreground/70">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop, i) => (
            <tr
              key={prop.name}
              className={cn(
                "border-b border-border last:border-0",
                i % 2 === 1 && "bg-muted/20",
              )}
            >
              <td className="px-4 py-2.5 align-top">
                <span className="font-mono text-xs font-medium text-foreground">
                  {prop.name}
                </span>
                {prop.required && (
                  <span className="ml-1.5 text-[10px] font-semibold text-destructive">
                    *
                  </span>
                )}
              </td>
              <td className="px-4 py-2.5 align-top">
                <span className="font-mono text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                  {prop.type}
                </span>
              </td>
              <td className="px-4 py-2.5 align-top">
                {prop.default ? (
                  <span className="font-mono text-xs text-muted-foreground">
                    {prop.default}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground/40">—</span>
                )}
              </td>
              <td className="px-4 py-2.5 align-top text-sm text-muted-foreground">
                {prop.description ?? (
                  <span className="text-muted-foreground/40">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
