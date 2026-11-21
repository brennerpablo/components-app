import type { OptionItem } from "@/components/ui/data-table/types";

export type Classe = "fidc" | "fim" | "fia" | "fii" | "rf" | "fip";
export type Situacao = "ativo" | "captacao" | "liquidacao";

export type Fundo = {
  id: string;
  nome: string;
  gestora: string;
  classe: Classe;
  situacao: Situacao;
  pl: number;
  rentab12m: number | undefined;
  cotistas: number;
  inicio: string;
};

export const CLASSES: OptionItem[] = [
  { value: "fidc", label: "FIDC" },
  { value: "fim", label: "Multimercado" },
  { value: "fia", label: "Ações" },
  { value: "fii", label: "Imobiliário" },
  { value: "rf", label: "Renda fixa" },
  { value: "fip", label: "Participações" },
];

export const SITUACOES: OptionItem[] = [
  { value: "ativo", label: "Em funcionamento" },
  { value: "captacao", label: "Em captação" },
  { value: "liquidacao", label: "Em liquidação" },
];

const GESTORAS = [
  "Ipê Roxo Gestão",
  "Alvorada Sul Capital",
  "Maré Alta Investimentos",
  "Serra Azul Asset",
  "Cais Novo Gestão",
  "Pedra Lisa Capital",
];

const ESTRATEGIAS: [string, Classe][] = [
  ["Crédito Estruturado", "fidc"],
  ["Multiestratégia", "fim"],
  ["Ações Valor", "fia"],
  ["Lajes Corporativas", "fii"],
  ["Crédito Privado", "rf"],
  ["Infraestrutura", "fip"],
  ["Recebíveis Comerciais", "fidc"],
  ["Macro", "fim"],
  ["Dividendos", "fia"],
  ["Logística", "fii"],
  ["Referenciado DI", "rf"],
  ["Agronegócio", "fidc"],
];

const SUFIXO: Record<Classe, string> = {
  fidc: "FIDC",
  fim: "FIM",
  fia: "FIA",
  fii: "FII",
  rf: "FIRF",
  fip: "FIP",
};

const FAIXA: Record<Classe, { pl: [number, number]; rentab: [number, number]; cotistas: [number, number] }> = {
  fidc: { pl: [40, 900], rentab: [11, 17], cotistas: [1, 80] },
  fim: { pl: [20, 1500], rentab: [-4, 18], cotistas: [300, 18000] },
  fia: { pl: [10, 600], rentab: [-12, 28], cotistas: [500, 25000] },
  fii: { pl: [80, 1200], rentab: [-6, 14], cotistas: [2000, 60000] },
  rf: { pl: [50, 2500], rentab: [9, 13], cotistas: [800, 40000] },
  fip: { pl: [30, 400], rentab: [-8, 20], cotistas: [1, 40] },
};

function sorteio(semente: number) {
  let s = semente;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function montarFundos(): Fundo[] {
  const r = sorteio(175);
  const entre = ([min, max]: [number, number]) => min + r() * (max - min);
  return GESTORAS.flatMap((gestora, g) =>
    Array.from({ length: 6 }, (_, i) => {
      const [estrategia, classe] = ESTRATEGIAS[(g * 5 + i * 2) % ESTRATEGIAS.length];
      const faixa = FAIXA[classe];
      const ano = 2012 + Math.floor(r() * 14);
      const mes = 1 + Math.floor(r() * 12);
      const dia = 1 + Math.floor(r() * 28);
      const recente = ano >= 2025;
      const sorteada = r();
      const situacao: Situacao = recente ? "captacao" : sorteada < 0.08 ? "liquidacao" : "ativo";
      return {
        id: `f${g}${i}`,
        nome: `${gestora.split(" ").slice(0, 2).join(" ")} ${estrategia} ${SUFIXO[classe]}`,
        gestora,
        classe,
        situacao,
        pl: Math.round(entre(faixa.pl) * 1e6 * 100) / 100,
        rentab12m: recente ? undefined : Math.round(entre(faixa.rentab) * 100) / 100,
        cotistas: Math.round(entre(faixa.cotistas)),
        inicio: `${ano}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`,
      };
    }),
  );
}

export const FUNDOS: Fundo[] = montarFundos();
