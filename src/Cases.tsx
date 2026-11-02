"use client";

const CASES = [
  {
    title: "Partial tonne",
    body: "2500 kg at 1000 kg/credit → 2 whole, need 500. Not an issuance.",
  },
  {
    title: "Exact multiple",
    body: "2000 kg at 1000 → need 0. Arithmetic completeness only.",
  },
  {
    title: "Batch sum",
    body: "1000 + 1000 + 500 then floor once — same as 2500 single total.",
  },
  {
    title: "Policy compare",
    body: "Same kg under 1000 vs 500 kg/credit yields different whole counts.",
  },
  {
    title: "Target whole",
    body: "kgToReachWhole(2500, 1000, 4) → add 1500 kg to reach 4 units.",
  },
] as const;

export function Cases() {
  return (
    <section aria-label="Teaching cases" style={{ marginTop: "2rem" }}>
      <h2 style={{ fontSize: "1rem" }}>Cases</h2>
      <ul style={{ paddingLeft: "1.2rem", fontSize: "0.9rem" }}>
        {CASES.map((c) => (
          <li key={c.title} style={{ marginBottom: "0.5rem" }}>
            <strong>{c.title}.</strong> {c.body}
          </li>
        ))}
      </ul>
    </section>
  );
}
