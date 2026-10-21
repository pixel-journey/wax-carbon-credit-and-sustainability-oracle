import { describe, expect, it } from "vitest";
import { untilNext } from "./need";

describe("until the next credit", () => {
  it("is the remainder inverted, or zero on a whole credit", () => {
    expect(untilNext(2_500n, 1_000n)).toEqual({ ok: true, whole: 2n, need: 500n });
    expect(untilNext(2_000n, 1_000n)).toEqual({ ok: true, whole: 2n, need: 0n });
    expect(untilNext(1n, 0n).ok).toBe(false);
  });
});
