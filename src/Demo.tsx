"use client";

import { useMemo, useState } from "react";
import { downloadText, exportNeedMarkdown } from "./exportReport";
import { POLICY_TONNE, SCENARIOS } from "./fixtures";
import { CARBON_MYTHS, GLOSSARY } from "./myths";
import { afterAccumulate, progressBps, untilNext } from "./need";

export function Demo() {
  const [kg, setKg] = useState("2500");
  const [per, setPer] = useState("1000");
  const [delta, setDelta] = useState("0");

  const result = useMemo(() => {
    try {
      const k = BigInt(kg.trim() || "0");
      const p = BigInt(per.trim() || "0");
      const d = BigInt(delta.trim() || "0");
      if (d > 0n) return afterAccumulate(k, d, p);
      return untilNext(k, p);
    } catch {
      return { ok: false as const, reason: "Enter non-negative integers; kgPerCredit > 0" };
    }
  }, [kg, per, delta]);

  const progress = useMemo(() => {
    try {
      return progressBps(BigInt(kg.trim() || "0"), BigInt(per.trim() || "0"));
    } catch {
      return null;
    }
  }, [kg, per]);

  const applyScenario = (id: string) => {
    const s = SCENARIOS.find((x) => x.id === id);
    if (!s) return;
    setKg(s.kg.toString());
    setPer(s.policy.kgPerCredit.toString());
    setDelta("0");
  };

  return (
    <main className="wrap">
      <p className="kicker">Educational reference · Pixel Journey</p>
      <h1>Kilograms left until a whole credit</h1>
      <p className="lede">
        Integer floor under a fixed kg-per-credit policy. Not a registry oracle and not an
        issuance system.
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

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
        {SCENARIOS.map((s) => (
          <button key={s.id} type="button" onClick={() => applyScenario(s.id)}>
            {s.label}
          </button>
        ))}
      </div>

      <label style={{ display: "block", marginBottom: "0.75rem" }}>
        Kilograms accumulated
        <input
          value={kg}
          onChange={(e) => setKg(e.target.value)}
          style={{ display: "block", width: "100%", marginTop: "0.25rem" }}
        />
      </label>
      <label style={{ display: "block", marginBottom: "0.75rem" }}>
        kg per credit ({POLICY_TONNE.label} is the sample default)
        <input
          value={per}
          onChange={(e) => setPer(e.target.value)}
          style={{ display: "block", width: "100%", marginTop: "0.25rem" }}
        />
      </label>
      <label style={{ display: "block", marginBottom: "1rem" }}>
        Optional delta to accumulate (preview only)
        <input
          value={delta}
          onChange={(e) => setDelta(e.target.value)}
          style={{ display: "block", width: "100%", marginTop: "0.25rem" }}
        />
      </label>

      {result.ok ? (
        <>
          <p>
            Whole <strong>{result.whole.toString()}</strong> · remainder{" "}
            <strong>{result.remainder.toString()}</strong> kg · need{" "}
            <strong>{result.need.toString()}</strong> kg
            {result.exact ? " · exact" : ""}
          </p>
          {progress && progress.ok && (
            <p style={{ fontSize: "0.9rem" }}>
              Partial progress: <strong>{progress.bps.toString()}</strong> bps of current unit
            </p>
          )}
          <button
            type="button"
            onClick={() =>
              downloadText("carbon-need.md", exportNeedMarkdown(kg, per, result))
            }
          >
            Download MD report
          </button>
        </>
      ) : (
        <p>{result.reason}</p>
      )}

      <section style={{ marginTop: "2rem" }}>
        <h2 style={{ fontSize: "1rem" }}>Glossary</h2>
        <dl>
          {GLOSSARY.map((g) => (
            <div key={g.term} style={{ marginBottom: "0.5rem" }}>
              <dt>
                <strong>{g.term}</strong>
              </dt>
              <dd style={{ margin: 0 }}>{g.meaning}</dd>
            </div>
          ))}
        </dl>
      </section>

      <p style={{ marginTop: "2rem", fontSize: "0.85rem", opacity: 0.75 }}>
        See EDUCATION.md · POLICY.md · ARCHITECTURE.md
      </p>
    </main>
  );
}
