export const CARBON_MYTHS = [
  {
    myth: "This is a live carbon-credit oracle",
    reality:
      "Pure untilNext(kg, kgPerCredit). No host, registry, or attestation is queried.",
  },
  {
    myth: "Need 0 means a credit was issued",
    reality:
      "Need 0 only means the kg total divides evenly. Issuance is out of scope.",
  },
  {
    myth: "Fractional credits are counted here",
    reality:
      "whole is floor division. Remainder drives how many kg are still needed.",
  },
] as const;
