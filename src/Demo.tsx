"use client";

import { useMemo, useState } from "react";
import { untilNext } from "./need";
import { CARBON_MYTHS } from "./myths";

export function Demo() {
  const [kg, setKg] = useState("2500");
  const [per, setPer] = useState("1000");
  const result = useMemo(() => {
    try {
      return untilNext(BigInt(kg.trim() || "0"), BigInt(per.trim() || "0"));
    } catch {
      return { ok: false as const, reason: "Enter non-negative integers; kgPerCredit > 0" };
    }
  }, [kg, per]);

  return (
    <main className="wrap">
      <p className="kicker">Educational reference · Pixel Journey</p>
      <h1>Kilograms left until a whole credit</h1>
      <p className="lede">
        floor(kg / kgPerCredit) whole credits; need is how many kg remain to the next
        whole. Not an oracle.
      </p>

      <section
        style={{
          marginBottom: "1.5rem",
          padding: "1rem",
          border: "1px solid #a855f744",
          borderRadius: "12px",
        }}
      >
        <h2 style={{ fontSize: "1rem", marginTop: 0 }}>Myths vs reality</h2>
        {CARBON_MYTHS.map((m) => (
          <div key={m.myth} style={{ marginBottom: "0.75rem", fontSize: "0.9rem" }}>
            <p style={{ margin: 0 }}>
              <strong>Myth:</strong> {m.myth}
            </p>
            <p style={{ margin: "0.25rem 0 0" }}>
              <strong>Reality:</strong> {m.reality}
            </p>
          </div>
        ))}
      </section>

      <label style={{ display: "block", marginBottom: "0.75rem" }}>
        Kilograms accumulated
        <input
          value={kg}
          onChange={(e) => setKg(e.target.value)}
          style={{ display: "block", width: "100%", marginTop: "0.25rem" }}
        />
      </label>
      <label style={{ display: "block", marginBottom: "1rem" }}>
        kg per credit
        <input
          value={per}
          onChange={(e) => setPer(e.target.value)}
          style={{ display: "block", width: "100%", marginTop: "0.25rem" }}
        />
      </label>

      {result.ok ? (
        <p>
          Whole credits <strong>{result.whole.toString()}</strong> · need{" "}
          <strong>{result.need.toString()}</strong> kg more
        </p>
      ) : (
        <p>{result.reason}</p>
      )}

      <p style={{ marginTop: "2rem", fontSize: "0.85rem", opacity: 0.75 }}>
        See POLICY.md
      </p>
    </main>
  );
}
