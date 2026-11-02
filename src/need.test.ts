import { describe, expect, it } from "vitest";
import { POLICY_HALF_TONNE, POLICY_TONNE } from "./fixtures";
import {
  afterAccumulate,
  assertUntilInvariants,
  comparePolicies,
  fromBatches,
  kgToReachWhole,
  meterBar,
  parseBatches,
  progressBps,
  untilNext,
  untilNextWithPolicy,
} from "./need";

describe("untilNext", () => {
  it("partial unit needs the inverted remainder", () => {
    const r = untilNext(2_500n, 1_000n);
    expect(r).toEqual({
      ok: true,
      whole: 2n,
      remainder: 500n,
      need: 500n,
      exact: false,
      accountedKg: 2_000n,
    });
    if (r.ok) assertUntilInvariants(2_500n, 1_000n, r);
  });

  it("exact multiple needs zero", () => {
    const r = untilNext(2_000n, 1_000n);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.need).toBe(0n);
    assertUntilInvariants(2_000n, 1_000n, r);
  });

  it("zero kg is exact with zero whole", () => {
    const r = untilNext(0n, 1_000n);
    expect(r.ok).toBe(true);
    if (r.ok) assertUntilInvariants(0n, 1_000n, r);
  });

  it("refuses bad inputs", () => {
    expect(untilNext(1n, 0n).ok).toBe(false);
    expect(untilNext(-1n, 1000n).ok).toBe(false);
  });

  it("holds invariants across a range", () => {
    for (const kg of [0n, 1n, 999n, 1000n, 1001n, 2500n, 9999n]) {
      const r = untilNext(kg, 1000n);
      expect(r.ok).toBe(true);
      if (r.ok) assertUntilInvariants(kg, 1000n, r);
    }
  });
});

describe("untilNextWithPolicy", () => {
  it("uses policy kgPerCredit", () => {
    const r = untilNextWithPolicy(2_500n, POLICY_TONNE);
    expect(r.ok && r.need).toBe(500n);
  });
});

describe("progressBps", () => {
  it("is 5000 at half a unit", () => {
    expect(progressBps(2_500n, 1_000n)).toEqual({ ok: true, bps: 5_000n });
  });
  it("is 0 when exact", () => {
    expect(progressBps(2_000n, 1_000n)).toEqual({ ok: true, bps: 0n });
  });
});

describe("afterAccumulate", () => {
  it("adds delta then remeasures", () => {
    const r = afterAccumulate(2_000n, 500n, 1_000n);
    expect(r.ok && r.need).toBe(500n);
  });
});

describe("fromBatches", () => {
  it("sums then floors once", () => {
    const r = fromBatches([1_000n, 1_000n, 500n], 1_000n);
    expect(r.ok && r.whole).toBe(2n);
    expect(r.ok && r.need).toBe(500n);
  });
  it("rejects empty", () => {
    expect(fromBatches([], 1000n).ok).toBe(false);
  });
});

describe("parseBatches", () => {
  it("parses comma and space separated", () => {
    const r = parseBatches("100, 200 50");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.batches).toEqual([100n, 200n, 50n]);
  });
});

describe("comparePolicies", () => {
  it("shows whole delta between tonne and half-tonne", () => {
    const c = comparePolicies(2_500n, POLICY_TONNE, POLICY_HALF_TONNE);
    expect(c.ok).toBe(true);
    if (!c.ok) return;
    expect(c.left.whole).toBe(2n);
    expect(c.right.whole).toBe(5n);
    expect(c.wholeDelta).toBe(-3n);
  });
});

describe("meterBar", () => {
  it("marks exact", () => {
    expect(meterBar(2000n, 1000n)).toContain("exact");
  });
  it("shows partial hashes", () => {
    expect(meterBar(2500n, 1000n)).toMatch(/#/);
  });
});

describe("kgToReachWhole", () => {
  it("from 2500 to 4 wholes needs 1500", () => {
    const r = kgToReachWhole(2_500n, 1_000n, 4n);
    expect(r.ok && r.addKg).toBe(1_500n);
  });
  it("already at target needs 0", () => {
    const r = kgToReachWhole(2_000n, 1_000n, 2n);
    expect(r.ok && r.addKg).toBe(0n);
  });
});
