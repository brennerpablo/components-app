import type { ReactNode } from "react";

import { CountBadge } from "./count-badge";
import { formatNumberBr } from "./model";

export function DataTableV2Detail({
  title,
  count,
  actions,
  children,
}: {
  title: string;
  count?: number;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex min-h-6 items-center gap-2">
        <h4 className="text-xs font-semibold text-foreground">{title}</h4>
        {count != null ? (
          <CountBadge>{formatNumberBr(count)}</CountBadge>
        ) : null}
        {actions ? <div className="ml-auto flex items-center gap-2 text-xs">{actions}</div> : null}
      </div>
      {children}
    </div>
  );
}
