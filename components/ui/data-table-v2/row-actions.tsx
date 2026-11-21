"use client";

import type { Row } from "@tanstack/react-table";
import { Pencil, Plus, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DataTableV2RowMenuTrigger } from "./row-menu-trigger";

export function RowActions<TData>({
  row,
  onAdd,
  onEdit,
  onDelete,
}: {
  row: Row<TData>;
  onAdd?: (row: TData) => void;
  onEdit?: (row: TData) => void;
  onDelete?: (row: TData) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <DataTableV2RowMenuTrigger label="Abrir menu" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        {onAdd ? (
          <DropdownMenuItem onClick={() => onAdd(row.original)}>
            <Plus />
            Adicionar
          </DropdownMenuItem>
        ) : null}
        {onEdit ? (
          <DropdownMenuItem onClick={() => onEdit(row.original)}>
            <Pencil />
            Editar
          </DropdownMenuItem>
        ) : null}
        {onDelete ? (
          <DropdownMenuItem variant="destructive" onClick={() => onDelete(row.original)}>
            <Trash2 />
            Excluir
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
