import { ComponentDoc } from "@/components/ui/component-doc";

export function DataTableV2Docs() {
  return (
    <ComponentDoc
      title="DataTableV2"
      description="A metadata-driven table built on TanStack Table. Columns are plain objects (the DataTable ColumnMetadata plus v2 fields); the table derives search, filters, sorting, totals and export from them. Filtering has one grammar: the funnel on a header opens that column's card, applied filters show as chips under the toolbar, and «Filtrar» opens every filterable column in one panel. Each Apply button counts the rows it will show. The same component also does trees, expandable details, sections, card grids and server pagination."
      usage={`import { DataTableV2, type DataTableV2Column } from "@/components/ui/data-table-v2"

type Fundo = { id: string; nome: string; classe: string; pl: number; inicio: string }

const columns: DataTableV2Column<Fundo>[] = [
  { columnId: "nome", title: "Fundo", type: "text", sortable: true, filters: { text: true } },
  {
    columnId: "classe", title: "Classe", type: "text", sortable: true,
    options: [{ value: "fidc", label: "FIDC" }, { value: "fim", label: "Multimercado" }],
    filters: { checkbox: true },
  },
  {
    columnId: "pl", title: "PL", subtitle: "R$ mi", type: "number", sortable: true,
    filters: { number: true }, filterScale: 1e-6, filterUnit: "R$ mi", total: "sum",
    formatter: (v) => (Number(v) / 1e6).toLocaleString("pt-BR", { maximumFractionDigits: 1 }),
  },
  { columnId: "inicio", title: "Início", type: "date", sortable: true, filters: { date: true } },
]

<DataTableV2<Fundo>
  data={fundos}
  columnsMetadata={columns}
  getRowId={(row) => row.id}
  title="Fundos"
  rowLabel={{ singular: "fundo", plural: "fundos" }}
  pinFirstColumn
  enableRowSelection
  onBulkAction={{ onEdit: (rows) => edit(rows) }}
  initialColumnFilters={[{ id: "classe", value: ["fidc"] }]}
/>`}
      propSections={[
        {
          title: "Data and identity",
          props: [
            { name: "data", type: "TData[]", required: true, description: "Rows. In tree mode, the roots." },
            {
              name: "columnsMetadata",
              type: "DataTableV2Column<TData>[]",
              required: true,
              description: "Column definitions; see the column fields below.",
            },
            {
              name: "getRowId",
              type: "(row: TData) => string",
              description: "Stable row id. Needed for selection that survives data changes and for pinnedTopRowIds.",
            },
            {
              name: "tableId",
              type: "string",
              description:
                "Persists the view (sort, filters, column order and visibility, density, card view, tree levels) in localStorage under data-table-v2.<tableId>. Without it nothing is saved.",
            },
            { name: "tableName", type: "string", default: '"export"', description: "File name of the CSV/XLSX export." },
            {
              name: "rowLabel",
              type: "{ singular: string; plural: string }",
              default: '{ singular: "linha", plural: "linhas" }',
              description: "Noun used in counts, the search placeholder and the Apply buttons.",
            },
            { name: "emptyMessage", type: "string", default: '"Sem resultados."', description: "Shown when no row matches." },
            { name: "footerNote", type: "ReactNode", description: "Note under the table (or in the bottom bar)." },
            { name: "fetching", type: "boolean", default: "false", description: "Dims the table and blocks input." },
          ],
        },
        {
          title: "Look",
          props: [
            { name: "title", type: "string", description: "Toolbar title, followed by the row count." },
            { name: "frame", type: '"card" | "table" | "none"', default: '"card"', description: "card: toolbar and table in one bordered card. table: only the table is bordered. none: no border." },
            { name: "rowStyle", type: '"lines" | "striped" | "grid" | "cards"', default: '"lines"', description: "Row separators, zebra, full grid or separated row cards." },
            { name: "headerStyle", type: '"soft" | "plain"', default: '"soft"', description: "Tinted or transparent header." },
            { name: "density", type: '"default" | "compact"', default: '"default"', description: "Initial row height; the toolbar toggle changes it." },
            { name: "groupDividers", type: "boolean", default: "false", description: "Vertical rule between column groups (column.group)." },
            { name: "controls", type: '"full" | "icons"', default: '"full"', description: "Toolbar buttons with labels or icon-only (search in a popover)." },
            { name: "pinFirstColumn", type: "boolean", default: "false", description: "Freezes the first data column. On phones the first column is always frozen." },
            { name: "pinColumns", type: "number", description: "Freezes this many leading data columns (overrides pinFirstColumn)." },
            { name: "stickyHeader", type: "boolean", default: "false", description: "Floats a copy of the header at the top of the scroll viewport." },
            { name: "stickyHeaderOffset", type: "number", description: "Gap above the floating header, in px." },
            { name: "className", type: "string", description: "Classes on the root." },
          ],
        },
        {
          title: "Toolbar",
          props: [
            { name: "enableToolbar", type: "boolean", default: "true", description: "Hides the whole toolbar, the chip strip and the header funnels." },
            { name: "enableSearch", type: "boolean", default: "true", description: "Accent-insensitive search over every column, labels and formatted values included." },
            { name: "enableExport", type: "boolean", default: "true", description: "CSV/XLSX of the filtered rows and visible columns." },
            { name: "enableColumnOptions", type: "boolean", default: "true", description: "Column picker: show, hide and drag to reorder." },
            { name: "enableDensityToggle", type: "boolean", default: "true", description: "Comfortable/compact toggle." },
            { name: "enableFullscreen", type: "boolean", default: "false", description: "Fullscreen toggle (Esc leaves)." },
            { name: "toolbarControls", type: "ReactNode", description: "Screen controls placed at the right of the toolbar." },
          ],
        },
        {
          title: "Sorting, filters and search",
          props: [
            { name: "initialSorting", type: "SortingState", description: "Initial sort; multi-sort is allowed (shift-click or the Ordenar panel)." },
            { name: "initialColumnFilters", type: "ColumnFiltersState", description: "Initial filters. Values by kind: options string[]; number { condition, value: [a, b] } in filter units; date { from, to }; text string." },
            { name: "columnFiltersState", type: "{ value; onChange }", description: "Controlled filters." },
            { name: "searchState", type: "{ value; onChange; placeholder? }", description: "Controlled search (client mode)." },
            { name: "serverSearch", type: "{ value; onChange; placeholder? }", description: "Search box for server mode; the server does the matching." },
            { name: "summaryRow", type: '{ label: ReactNode; position?: "top" | "bottom" }', description: "Row with the page totals of the columns that declare total." },
          ],
        },
        {
          title: "Pagination and server mode",
          props: [
            { name: "enablePagination", type: "boolean", default: "true", description: "Paginates the rows." },
            { name: "paginationPosition", type: '"toolbar" | "top" | "bottom" | "both"', default: '"toolbar"', description: "Where the pager sits." },
            { name: "pageSize", type: "number", default: "25", description: "Initial page size." },
            {
              name: "serverPagination",
              type: "DataTableV2ServerPagination",
              description:
                "{ totalRows, pagination, onPaginationChange, sorting, onSortingChange, columnFilters?, onColumnFiltersChange?, onDownload?, isFetching? }. Sorting and filtering become manual; the filter cards stop counting rows.",
            },
          ],
        },
        {
          title: "Selection and actions",
          props: [
            { name: "enableRowSelection", type: "boolean", default: "false", description: "Checkbox column; clicking a row toggles it." },
            {
              name: "onBulkAction",
              type: "{ onEdit?; onDelete?; actions?; controls? }",
              description: "Bar shown while rows are selected. Shortcuts: E edits, D deletes, custom actions take their own shortcut key.",
            },
            { name: "serverSelectAll", type: "{ selected; onChange }", description: "Server mode: offers «Selecionar o filtro inteiro» when the whole page is selected." },
            { name: "onRowAction", type: "{ onAdd?; onEdit?; onDelete? }", description: "Row menu (⋯) with the given actions." },
            { name: "renderRowActions", type: "(row: TData) => ReactNode", description: "Custom content of the row actions cell." },
            { name: "pinnedTopRowIds", type: "string[]", description: "Rows kept at the top of every page, outside sorting and selection." },
          ],
        },
        {
          title: "Trees, details, sections and cards",
          props: [
            { name: "getSubRows", type: "(row: TData) => TData[] | undefined", description: "Tree mode: the first data column carries the hierarchy." },
            { name: "defaultExpandedDepth", type: "number", default: "1", description: "Levels open on load; the toolbar picks the depth." },
            { name: "maxChildrenPerNode", type: "number", description: "Shows this many children and a «Mostrar mais» row." },
            { name: "treeLevels", type: "{ levels; getLevel }", description: "Named levels the user can hide; hidden levels fold their children into the parent." },
            { name: "renderDetail", type: "(row: TData) => ReactNode", description: "Expandable detail under each row." },
            { name: "hasDetail", type: "(row: TData) => boolean", description: "Which rows have a detail." },
            { name: "initialOpenDetailIds", type: "string[]", description: "Details open on load." },
            { name: "sections", type: "{ items; getSectionId; fallbackSectionId? }", description: "Collapsible section rows with counts and totals." },
            { name: "renderCard", type: "(row, view) => ReactNode", description: "Card grid instead of a table." },
            { name: "cardMinWidth", type: "number", default: "320", description: "Minimum card width in the grid." },
            { name: "cardView", type: '"grid" | "list"', default: '"grid"', description: "Initial card layout." },
            { name: "enableCardViewToggle", type: "boolean", default: "false", description: "Grid/list switch in the toolbar." },
          ],
        },
        {
          title: "DataTableV2Column fields (on top of DataTable's ColumnMetadata)",
          props: [
            {
              name: "filters",
              type: "FilterConfig & { checkboxArray? }",
              description:
                "Filter kind. checkbox, checkboxSearch, checkboxArray (array cells) and select (single choice) → list of values; number and percentage → condition + value; date and dateSingle → date range; text → contains. Lists with more than 8 values get a search box.",
            },
            { name: "subtitle", type: "string", description: "Unit shown after the title (e.g. R$ mi, %)." },
            { name: "description", type: "string", description: "Info tooltip next to the title." },
            { name: "filterScale", type: "number", default: "1", description: "Multiplies the cell value before the number filter compares it (1e-6 to filter reais in millions)." },
            { name: "filterUnit", type: "string", description: "Unit printed by the number filter and its summary." },
            { name: "total", type: '"sum" | "average" | (rows) => ReactNode', description: "Footer total over the filtered rows (and section/summary totals)." },
            { name: "group", type: "string", description: "Column group label; adjacent columns with the same group share a header." },
            { name: "defaultVisible", type: "boolean", default: "true", description: "Starts hidden but stays in the column picker." },
            { name: "sortingFn", type: "SortingFnOption<TData>", description: "Custom TanStack sorting function." },
            { name: "sortUndefined", type: '"first" | "last"', description: "Where undefined values sort." },
            { name: "link", type: "DataTableV2Link<TData>", description: "Renders the cell as a next/link: { href, label?, subtitle?, title?, variant?, onClick? }." },
            { name: "cellTone", type: '(row) => "muted" | null', description: "Tints a cell." },
            { name: "exportValue", type: "(row) => unknown", description: "Value written to the export instead of the raw value." },
            { name: "grow", type: "boolean", description: "This column takes the spare width (a name-like text column is picked by default)." },
            { name: "textCap", type: "boolean", description: "false lets a left-aligned text column grow past 280px." },
            { name: "headerWrap", type: "boolean", description: "Lets the header wrap." },
            { name: "heatmap", type: "{ baseColor; maxAlpha?; scale?; domain?; getValue? }", description: "Background intensity by value; baseColor is a chartColors name or hex." },
          ],
        },
      ]}
    />
  );
}
