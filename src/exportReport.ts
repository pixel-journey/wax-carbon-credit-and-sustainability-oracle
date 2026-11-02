import type { UntilOk } from "./need";

export function exportNeedMarkdown(
  kg: string,
  kgPerCredit: string,
  result: UntilOk
): string {
  return [
    "# Carbon credit remainder (educational)",
    "",
    "> Not an oracle. Not an issuance. Integer floor only.",
    "",
    `kg: ${kg}`,
    `kg per credit: ${kgPerCredit}`,
    "",
    `whole credits: ${result.whole.toString()}`,
    `remainder kg: ${result.remainder.toString()}`,
    `need kg to next: ${result.need.toString()}`,
    `exact: ${result.exact}`,
    `accounted kg: ${result.accountedKg.toString()}`,
    "",
  ].join("\n");
}

export function exportNeedCsv(
  rows: { kg: string; kgPerCredit: string; whole: string; remainder: string; need: string; exact: string }[]
): string {
  const header = "kg,kg_per_credit,whole,remainder,need,exact";
  const body = rows
    .map(
      (r) =>
        `${r.kg},${r.kgPerCredit},${r.whole},${r.remainder},${r.need},${r.exact}`
    )
    .join("\n");
  return `${header}\n${body}\n`;
}

export function downloadText(filename: string, content: string, mime = "text/plain;charset=utf-8"): void {
  if (typeof document === "undefined") return;
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
