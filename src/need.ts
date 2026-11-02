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
 * 0 when exact (no partial unit in progress). 10_000 would mean complete — but exact
 * returns 0 progress-on-partial by design.
 */
export function progressBps(kg: bigint, kgPerCredit: bigint): { ok: false; reason: string } | { ok: true; bps: bigint } {
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
