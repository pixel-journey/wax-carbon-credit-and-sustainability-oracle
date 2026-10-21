/**
 * Kilograms left until the next whole credit.
 * Not an oracle. A zero remainder means nothing is left.
 */

export function untilNext(kg: bigint, kgPerCredit: bigint): { ok: false; reason: string } | { ok: true; whole: bigint; need: bigint } {
  if (kg < 0n) return { ok: false, reason: "kg must be non-negative" };
  if (kgPerCredit <= 0n) return { ok: false, reason: "kgPerCredit must be positive" };
  const whole = kg / kgPerCredit;
  const remainder = kg % kgPerCredit;
  return { ok: true, whole, need: remainder === 0n ? 0n : kgPerCredit - remainder };
}
