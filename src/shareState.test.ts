import { describe, expect, it } from "vitest";
import { decodeShareState, encodeShareState } from "./shareState";

describe("shareState", () => {
  it("round-trips core fields", () => {
    const raw = encodeShareState({
      kg: "2500",
      per: "1000",
      delta: "0",
      compare: true,
      useBatches: false,
      batchText: "",
    });
    const decoded = decodeShareState(raw);
    expect(decoded.kg).toBe("2500");
    expect(decoded.per).toBe("1000");
    expect(decoded.compare).toBe(true);
  });
});
