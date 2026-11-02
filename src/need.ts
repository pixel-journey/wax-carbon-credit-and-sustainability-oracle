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
  exact: boolean;
  accountedKg: bigint;
};

export type UntilErr = { ok: false; reason: string };
export type UntilResult = UntilOk | UntilErr;

export type CreditPolicy = {
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

export function mintableWhole(kg: bigint, kgPerCredit: bigint): UntilResult {
  return untilNext(kg, kgPerCredit);
}

export function progressBps(
  kg: bigint,
  kgPerCredit: bigint
): { ok: false; reason: string } | { ok: true; bps: bigint } {
  const r = untilNext(kg, kgPerCredit);
  if (!r.ok) return r;
  if (r.exact) return { ok: true, bps: 0n };
  return { ok: true, bps: (r.remainder * 10_000n) / kgPerCredit };
}

export function afterAccumulate(
  kg: bigint,
  deltaKg: bigint,
  kgPerCredit: bigint
): UntilResult {
  if (deltaKg < 0n) return { ok: false, reason: "deltaKg must be non-negative" };
  return untilNext(kg + deltaKg, kgPerCredit);
}

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

export function meterBar(kg: bigint, kgPerCredit: bigint): string {
  const r = untilNext(kg, kgPerCredit);
  if (!r.ok) return r.reason;
  if (r.exact) return "[##########] exact";
  const p = progressBps(kg, kgPerCredit);
  if (!p.ok) return p.reason;
  const filled = Number(p.bps / 1_000n);
  const clamped = Math.max(0, Math.min(10, filled));
  return `[${"#".repeat(clamped)}${".".repeat(10 - clamped)}] ${p.bps.toString()} bps`;
}

export function assertUntilInvariants(
  kg: bigint,
  kgPerCredit: bigint,
  r: UntilOk
): void {
  if (r.accountedKg !== r.whole * kgPerCredit) {
    throw new Error("accountedKg must equal whole * kgPerCredit");
  }
  if (r.accountedKg + r.remainder !== kg) {
    throw new Error("accountedKg + remainder must equal kg");
  }
  if (r.exact) {
    if (r.remainder !== 0n || r.need !== 0n) {
      throw new Error("exact implies remainder and need are 0");
    }
  } else {
    if (r.need + r.remainder !== kgPerCredit) {
      throw new Error("need + remainder must equal kgPerCredit when not exact");
    }
    if (r.remainder <= 0n || r.remainder >= kgPerCredit) {
      throw new Error("remainder must be in (0, kgPerCredit)");
    }
  }
}

export function parseBatches(
  text: string
): { ok: false; reason: string } | { ok: true; batches: bigint[] } {
  const parts = text
    .split(/[,\s]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length < 1 || parts.length > 32) {
    return { ok: false, reason: "enter 1 to 32 batch sizes" };
  }
  const batches: bigint[] = [];
  for (const p of parts) {
    try {
      const n = BigInt(p);
      if (n < 0n) return { ok: false, reason: "batches must be non-negative" };
      batches.push(n);
    } catch {
      return { ok: false, reason: `invalid batch: ${p}` };
    }
  }
  return { ok: true, batches };
}

/**
 * Kilograms required to reach at least `targetWhole` complete units from current kg.
 * If already at or above target, returns 0.
 */
export function kgToReachWhole(
  kg: bigint,
  kgPerCredit: bigint,
  targetWhole: bigint
): { ok: false; reason: string } | { ok: true; addKg: bigint; current: UntilOk } {
  if (targetWhole < 0n) return { ok: false, reason: "targetWhole must be non-negative" };
  const current = untilNext(kg, kgPerCredit);
  if (!current.ok) return current;
  const targetKg = targetWhole * kgPerCredit;
  const addKg = targetKg > kg ? targetKg - kg : 0n;
  return { ok: true, addKg, current };
}

/** Alias: delta that fills the current partial unit (same as need). */
export function fillNeedDelta(kg: bigint, kgPerCredit: bigint): UntilResult {
  return untilNext(kg, kgPerCredit);
}
