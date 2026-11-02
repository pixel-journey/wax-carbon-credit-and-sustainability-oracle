import { describe, expect, it } from "vitest";
import { POLICY_TONNE } from "./fixtures";
import {
  afterAccumulate,
  progressBps,
  untilNext,
  untilNextWithPolicy,
} from "./need";

describe("untilNext", () => {
  it("partial unit needs the inverted remainder", () => {
    expect(untilNext(2_500n, 1_000n)).toEqual({
      ok: true,
      whole: 2n,
      remainder: 500n,
      need: 500n,
      exact: false,
      accountedKg: 2_000n,
    });
  });

  it("exact multiple needs zero", () => {
    const r = untilNext(2_000n, 1_000n);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.need).toBe(0n);
    expect(r.exact).toBe(true);
    expect(r.remainder).toBe(0n);
  });

  it("refuses non-positive kgPerCredit", () => {
    expect(untilNext(1n, 0n).ok).toBe(false);
    expect(untilNext(1n, -1n).ok).toBe(false);
  });

  it("refuses negative kg", () => {
    expect(untilNext(-1n, 1000n).ok).toBe(false);
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
    expect(r.ok && r.whole).toBe(2n);
    expect(r.ok && r.need).toBe(500n);
  });
});
