const INTEIRO_SEM_MILHAR = 10_000;
const NUMERO_EM_TEXTO = /^-?\d+(\.\d+)?$/;
const DATA_ISO = /^(\d{4})-(\d{2})-(\d{2})([T ]|$)/;

const NUMERO_BR = new Intl.NumberFormat("pt-BR");

export function textoPadraoDaCelula(tipo: unknown, valor: unknown): string {
  const vazio = valor === null || valor === undefined || valor === "";
  if (tipo === "number") {
    if (vazio) return "—";
    if (typeof valor !== "number" && !(typeof valor === "string" && NUMERO_EM_TEXTO.test(valor))) return String(valor);
    const n = Number(valor);
    if (!Number.isFinite(n)) return "—";
    return Number.isInteger(n) && Math.abs(n) < INTEIRO_SEM_MILHAR ? String(n) : NUMERO_BR.format(n);
  }
  if (tipo === "date") {
    if (vazio) return "—";
    if (valor instanceof Date) {
      if (Number.isNaN(valor.getTime())) return "—";
      return `${String(valor.getDate()).padStart(2, "0")}/${String(valor.getMonth() + 1).padStart(2, "0")}/${valor.getFullYear()}`;
    }
    const iso = typeof valor === "string" ? DATA_ISO.exec(valor) : null;
    return iso ? `${iso[3]}/${iso[2]}/${iso[1]}` : String(valor);
  }
  return String(valor ?? "");
}

export function codigoDoAtivo(valor: unknown): string {
  const texto = String(valor ?? "");
  return /^\d{14}$/.test(texto) ? texto.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5") : texto;
}
