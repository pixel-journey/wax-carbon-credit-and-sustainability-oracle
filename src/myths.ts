export const CARBON_MYTHS = [
  {
    myth: "This is a live carbon-credit or sustainability oracle",
    reality:
      "Pure integer math on caller-supplied kg and kg-per-credit. No registry, MRV feed, or chain call.",
  },
  {
    myth: "need === 0 means a credit was issued on-chain",
    reality:
      "It only means the mass divides evenly under the policy. Issuance is out of scope.",
  },
  {
    myth: "Fractional credits are counted as whole",
    reality:
      "whole is floor division. Partial progress is remainder / progressBps only.",
  },
  {
    myth: "This verifies real-world carbon impact",
    reality:
      "No environmental claim is verified. The name is historical; the code is a remainder lab.",
  },
  {
    myth: "Splitting mass into batches changes how many whole credits exist",
    reality:
      "fromBatches only sums, then floors once. Sum order does not change the total under pure addition.",
  },
] as const;

export const GLOSSARY = [
  {
    term: "whole",
    meaning: "floor(kg / kgPerCredit) — complete units under the policy.",
  },
  {
    term: "remainder",
    meaning: "kg % kgPerCredit — mass not yet filling another whole unit.",
  },
  {
    term: "need",
    meaning: "Kilograms still required to reach the next whole unit (0 if exact).",
  },
  {
    term: "accountedKg",
    meaning: "whole * kgPerCredit — mass already sitting in complete units.",
  },
  {
    term: "progressBps",
    meaning: "How far into the current incomplete unit, in basis points of kgPerCredit.",
  },
  {
    term: "fromBatches",
    meaning: "Sum 1–32 non-negative batch sizes, then run untilNext once.",
  },
] as const;
