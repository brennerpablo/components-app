export function ColumnLabel({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <span className="truncate">
      {title}
      {subtitle ? <span className="ml-1 font-normal text-muted-foreground">{subtitle}</span> : null}
    </span>
  );
}
