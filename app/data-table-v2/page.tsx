"use client";

import { toast } from "sonner";

import { DemoBreadcrumb } from "@/app/_components/DemoBreadcrumb";
import { DataTableV2, type DataTableV2Column } from "@/components/ui/data-table-v2";

import { CLASSES, type Fundo, FUNDOS, SITUACOES } from "./data";
import { DataTableV2Docs } from "./docs";

const DUAS_CASAS = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const UMA_CASA = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const INTEIRO = new Intl.NumberFormat("pt-BR");

const columns: DataTableV2Column<Fundo>[] = [
  {
    columnId: "nome",
    title: "Fundo",
    type: "text",
    sortable: true,
    hideable: false,
    filters: { text: true },
  },
  {
    columnId: "gestora",
    title: "Gestora",
    type: "text",
    sortable: true,
    inferOptions: true,
    filters: { checkbox: true },
  },
  {
    columnId: "classe",
    title: "Classe",
    type: "text",
    sortable: true,
    options: CLASSES,
    filters: { checkbox: true },
    formatter: (v) => CLASSES.find((o) => o.value === v)?.label ?? String(v),
  },
  {
    columnId: "situacao",
    title: "Situação",
    type: "text",
    options: SITUACOES,
    filters: { select: true },
    formatter: (v) => SITUACOES.find((o) => o.value === v)?.label ?? String(v),
  },
  {
    columnId: "pl",
    title: "PL",
    subtitle: "R$ mi",
    description: "Patrimônio líquido na última cota, em milhões de reais.",
    type: "number",
    sortable: true,
    filters: { number: true },
    filterScale: 1e-6,
    filterUnit: "R$ mi",
    total: "sum",
    formatter: (v) => UMA_CASA.format(Number(v) / 1e6),
  },
  {
    columnId: "rentab12m",
    title: "Rentab. 12m",
    subtitle: "%",
    type: "number",
    sortable: true,
    sortUndefined: "last",
    filters: { number: true },
    filterUnit: "%",
    formatter: (v) => (v == null ? "—" : `${DUAS_CASAS.format(Number(v))}%`),
  },
  {
    columnId: "cotistas",
    title: "Cotistas",
    type: "number",
    sortable: true,
    defaultVisible: false,
    filters: { number: true },
    total: "sum",
    formatter: (v) => INTEIRO.format(Number(v)),
  },
  {
    columnId: "inicio",
    title: "Início",
    type: "date",
    sortable: true,
    filters: { date: true },
  },
];

const nomes = (rows: Fundo[]) => (rows.length === 1 ? rows[0].nome : `${rows.length} fundos`);

export default function DataTableV2Page() {
  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <DemoBreadcrumb />
        <h1 className="mb-1 text-2xl font-semibold tracking-tight">DataTable v2</h1>
        <p className="mb-6 max-w-3xl text-sm text-muted-foreground">
          A metadata-driven table with one filter grammar: a funnel on each column header opens that column&apos;s
          card, the filters in use sit in a strip of chips, and «Filtrar» opens every column at once. Each filter
          button says how many rows it will show before it is applied. Search, multi-sort, column picker, totals,
          selection with bulk actions, pinned columns, sticky header, fullscreen and CSV/XLSX export come in the
          same single call. The chrome is in Portuguese.
        </p>

        <p className="mb-3 text-sm text-muted-foreground">
          Passe o mouse num cabeçalho e clique no funil para filtrar só aquela coluna. Os filtros em uso ficam na
          faixa de chips (clique num chip para editá-lo) e «Filtrar» abre o painel com todas as colunas.
        </p>

        <DataTableV2<Fundo>
          data={FUNDOS}
          columnsMetadata={columns}
          getRowId={(row) => row.id}
          title="Fundos"
          tableName="fundos"
          rowLabel={{ singular: "fundo", plural: "fundos" }}
          pageSize={10}
          pinFirstColumn
          stickyHeader
          enableFullscreen
          enableRowSelection
          initialSorting={[{ id: "pl", desc: true }]}
          initialColumnFilters={[
            { id: "classe", value: ["fidc", "fim", "rf"] },
            { id: "pl", value: { condition: "is-greater-than", value: [100, 100] } },
          ]}
          onBulkAction={{
            onEdit: (rows) => toast(`Editar ${nomes(rows)}`),
            onDelete: (rows) => toast(`Excluir ${nomes(rows)}`),
          }}
          onRowAction={{
            onEdit: (row) => toast(`Editar ${row.nome}`),
            onDelete: (row) => toast(`Excluir ${row.nome}`),
          }}
          footerNote="Dados fictícios, só para exemplo."
        />

        <DataTableV2Docs />
      </div>
    </main>
  );
}
