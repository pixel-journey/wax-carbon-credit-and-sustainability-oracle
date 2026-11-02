/** Encode/decode demo state for shareable URLs (no network). */

export type ShareState = {
  kg: string;
  per: string;
  delta: string;
  compare: boolean;
  useBatches: boolean;
  batchText: string;
};

export function encodeShareState(s: ShareState): string {
  const q = new URLSearchParams();
  q.set("kg", s.kg);
  q.set("per", s.per);
  if (s.delta && s.delta !== "0") q.set("delta", s.delta);
  if (s.compare) q.set("compare", "1");
  if (s.useBatches) {
    q.set("batches", "1");
    q.set("b", s.batchText);
  }
  return q.toString();
}

export function decodeShareState(search: string): Partial<ShareState> {
  const q = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const out: Partial<ShareState> = {};
  if (q.has("kg")) out.kg = q.get("kg") ?? undefined;
  if (q.has("per")) out.per = q.get("per") ?? undefined;
  if (q.has("delta")) out.delta = q.get("delta") ?? undefined;
  if (q.get("compare") === "1") out.compare = true;
  if (q.get("batches") === "1") {
    out.useBatches = true;
    out.batchText = q.get("b") ?? "";
  }
  return out;
}
