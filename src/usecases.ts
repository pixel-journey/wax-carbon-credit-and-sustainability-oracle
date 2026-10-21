import { ATOMIC_ORIGIN } from "./api";
import { untilNext } from "./need";
import type { ChainAction, HttpRequest } from "./api";

export type UseCase = {
  title: string;
  detail: string;
  request: HttpRequest;
  transaction: { note: string; actions: ChainAction[] } | null;
};

const part = untilNext(2_500n, 1_000n);
if (!part.ok) throw new Error(part.reason);
const gap = part;

export const USE_CASES: UseCase[] = [
  {
    title: "A template is not a carbon reading",
    detail: `2500 kg at 1000 per credit needs ${gap.need.toString()} more kg. The template request is not sent. This is not an oracle.`,
    request: { method: "GET", url: `${ATOMIC_ORIGIN}/atomicassets/v1/templates/pixeljourney/1`, executed: false },
    transaction: null,
  },
  {
    title: "A whole credit needs nothing",
    detail: "2000 kg needs 0 more. No mint is built.",
    request: { method: "GET", url: `${ATOMIC_ORIGIN}/atomicassets/v1/assets/1`, executed: false },
    transaction: null,
  },
];

export function assertUseCases(): void {
  if (gap.need !== 500n || gap.whole !== 2n) throw new Error("need");
  const exact = untilNext(2_000n, 1_000n);
  if (!exact.ok || exact.need !== 0n) throw new Error("exact");
}
