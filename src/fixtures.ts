import type { CreditPolicy } from "./need";

/** Sample policies for demos — not real registry rules. */
export const POLICY_TONNE: CreditPolicy = {
  kgPerCredit: 1_000n,
  label: "1 credit = 1000 kg",
};

export const POLICY_HALF_TONNE: CreditPolicy = {
  kgPerCredit: 500n,
  label: "1 credit = 500 kg",
};

export const SCENARIOS = [
  {
    id: "partial",
    label: "2500 kg @ 1000",
    kg: 2_500n,
    policy: POLICY_TONNE,
  },
  {
    id: "exact",
    label: "2000 kg @ 1000",
    kg: 2_000n,
    policy: POLICY_TONNE,
  },
  {
    id: "small",
    label: "100 kg @ 1000",
    kg: 100n,
    policy: POLICY_TONNE,
  },
  {
    id: "half",
    label: "750 kg @ 500",
    kg: 750n,
    policy: POLICY_HALF_TONNE,
  },
] as const;
