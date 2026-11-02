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

export function downloadText(filename: string, content: string): void {
  if (typeof document === "undefined") return;
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
