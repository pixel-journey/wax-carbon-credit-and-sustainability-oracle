/**
 * Kilograms until the next whole carbon *unit* under a fixed kg-per-credit policy.
 * Educational arithmetic only — not a registry oracle, not an issuance system,
 * not a claim about any live WAX environmental product.
 */

export type UntilOk = {
  ok: true;
  whole: bigint;
  remainder: bigint;
  need: bigint;
  /** true when kg is already an exact multiple of kgPerCredit */
  exact: boolean;
  /** whole * kgPerCredit (mass accounted into full credits) */
  accountedKg: bigint;
};

export type UntilErr = { ok: false; reason: string };
export type UntilResult = UntilOk | UntilErr;

export type CreditPolicy = {
  /** Positive kilograms required for one whole credit. */
  kgPerCredit: bigint;
  label?: string;
};

export function untilNext(kg: bigint, kgPerCredit: bigint): UntilResult {
  if (typeof kg !== "bigint" || typeof kgPerCredit !== "bigint") {
    return { ok: false, reason: "kg and kgPerCredit must be bigint" };
  }
  if (kg < 0n) return { ok: false, reason: "kg must be non-negative" };
  if (kgPerCredit <= 0n) return { ok: false, reason: "kgPerCredit must be positive" };

  const whole = kg / kgPerCredit;
  const remainder = kg % kgPerCredit;
  const exact = remainder === 0n;
  const need = exact ? 0n : kgPerCredit - remainder;
  const accountedKg = whole * kgPerCredit;

  return { ok: true, whole, remainder, need, exact, accountedKg };
}

export function untilNextWithPolicy(kg: bigint, policy: CreditPolicy): UntilResult {
  return untilNext(kg, policy.kgPerCredit);
}

/**
 * How many whole credits can be minted if the registry only issues on exact multiples
 * and discards remainder (educational floor — not a real mint).
 */
export function mintableWhole(kg: bigint, kgPerCredit: bigint): UntilResult {
  return untilNext(kg, kgPerCredit);
}

/**
 * Progress toward the next credit in basis points of the current incomplete unit.
 * 0 when exact (no partial unit in progress).
 */
export function progressBps(
  kg: bigint,
  kgPerCredit: bigint
): { ok: false; reason: string } | { ok: true; bps: bigint } {
  const r = untilNext(kg, kgPerCredit);
  if (!r.ok) return r;
  if (r.exact) return { ok: true, bps: 0n };
  return { ok: true, bps: (r.remainder * 10_000n) / kgPerCredit };
}

/**
 * After adding `deltaKg`, what does the meter look like?
 * Pure; does not mutate anything.
 */
export function afterAccumulate(
  kg: bigint,
  deltaKg: bigint,
  kgPerCredit: bigint
): UntilResult {
  if (deltaKg < 0n) return { ok: false, reason: "deltaKg must be non-negative" };
  return untilNext(kg + deltaKg, kgPerCredit);
}

/**
 * Sum independent batch masses, then measure once.
 * Educational: batching order does not change the floor total when only summing.
 */
export function fromBatches(
  batches: readonly bigint[],
  kgPerCredit: bigint
): UntilResult {
  if (batches.length < 1 || batches.length > 32) {
    return { ok: false, reason: "pass 1 to 32 batch sizes" };
  }
  let sum = 0n;
  for (const b of batches) {
    if (typeof b !== "bigint" || b < 0n) {
      return { ok: false, reason: "each batch must be a non-negative bigint" };
    }
    sum += b;
  }
  return untilNext(sum, kgPerCredit);
}

export type PolicyCompare = {
  ok: true;
  left: UntilOk;
  right: UntilOk;
  wholeDelta: bigint;
  needDelta: bigint;
};

/** Side-by-side remainder under two policies for the same kg. */
export function comparePolicies(
  kg: bigint,
  left: CreditPolicy,
  right: CreditPolicy
): { ok: false; reason: string } | PolicyCompare {
  const a = untilNext(kg, left.kgPerCredit);
  const b = untilNext(kg, right.kgPerCredit);
  if (!a.ok) return a;
  if (!b.ok) return b;
  return {
    ok: true,
    left: a,
    right: b,
    wholeDelta: a.whole - b.whole,
    needDelta: a.need - b.need,
  };
}

/** ASCII meter for remainder progress (0–10 blocks). Exact → full bar labeled done. */
export function meterBar(kg: bigint, kgPerCredit: bigint): string {
  const r = untilNext(kg, kgPerCredit);
  if (!r.ok) return r.reason;
  if (r.exact) return "[##########] exact";
  const p = progressBps(kg, kgPerCredit);
  if (!p.ok) return p.reason;
  const filled = Number(p.bps / 1_000n); // 0..10
  const clamped = Math.max(0, Math.min(10, filled));
  return `[${"#".repeat(clamped)}${".".repeat(10 - clamped)}] ${p.bps.toString()} bps`;
}
