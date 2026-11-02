"use client";

import { useEffect, useMemo, useState } from "react";
import {
  downloadText,
  exportNeedCsv,
  exportNeedMarkdown,
} from "./exportReport";
import { POLICY_HALF_TONNE, POLICY_TONNE, SCENARIOS } from "./fixtures";
import { CARBON_MYTHS, GLOSSARY } from "./myths";
import {
  afterAccumulate,
  comparePolicies,
  fromBatches,
  meterBar,
  parseBatches,
  progressBps,
  untilNext,
} from "./need";
import { WORKED_EXAMPLES } from "./workedExamples";

const LS_KEY = "pxj-carbon-need-v1";

export function Demo() {
  const [kg, setKg] = useState("2500");
  const [per, setPer] = useState("1000");
  const [delta, setDelta] = useState("0");
  const [compare, setCompare] = useState(false);
  const [batchText, setBatchText] = useState("");
  const [useBatches, setUseBatches] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        kg?: string;
        per?: string;
        delta?: string;
        batchText?: string;
        useBatches?: boolean;
      };
      if (parsed.kg) setKg(parsed.kg);
      if (parsed.per) setPer(parsed.per);
      if (parsed.delta) setDelta(parsed.delta);
      if (parsed.batchText) setBatchText(parsed.batchText);
      if (typeof parsed.useBatches === "boolean") setUseBatches(parsed.useBatches);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        LS_KEY,
        JSON.stringify({ kg, per, delta, batchText, useBatches })
      );
    } catch {
      /* ignore */
    }
  }, [kg, per, delta, batchText, useBatches]);

  const result = useMemo(() => {
    try {
      const p = BigInt(per.trim() || "0");
      if (useBatches) {
        const parsed = parseBatches(batchText);
        if (!parsed.ok) return parsed;
        return fromBatches(parsed.batches, p);
      }
      const k = BigInt(kg.trim() || "0");
      const d = BigInt(delta.trim() || "0");
      if (d > 0n) return afterAccumulate(k, d, p);
      return untilNext(k, p);
    } catch {
      return { ok: false as const, reason: "Enter non-negative integers; kgPerCredit > 0" };
    }
  }, [kg, per, delta, useBatches, batchText]);

  const effectiveKg = useMemo(() => {
    try {
      if (useBatches) {
        const parsed = parseBatches(batchText);
        if (!parsed.ok) return null;
        return parsed.batches.reduce((a, b) => a + b, 0n);
      }
      return BigInt(kg.trim() || "0") + BigInt(delta.trim() || "0");
    } catch {
      return null;
    }
  }, [kg, delta, useBatches, batchText]);

  const progress = useMemo(() => {
    if (effectiveKg === null) return null;
    try {
      return progressBps(effectiveKg, BigInt(per.trim() || "0"));
    } catch {
      return null;
    }
  }, [effectiveKg, per]);

  const bar = useMemo(() => {
    if (effectiveKg === null) return "";
    try {
      return meterBar(effectiveKg, BigInt(per.trim() || "0"));
    } catch {
      return "";
    }
  }, [effectiveKg, per]);

  const sideBySide = useMemo(() => {
    if (!compare || effectiveKg === null) return null;
    try {
      return comparePolicies(effectiveKg, POLICY_TONNE, POLICY_HALF_TONNE);
    } catch {
      return null;
    }
  }, [compare, effectiveKg]);

  const applyScenario = (id: string) => {
    const s = SCENARIOS.find((x) => x.id === id);
    if (!s) return;
    setUseBatches(false);
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

      <label style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.75rem" }}>
        <input
          type="checkbox"
          checked={useBatches}
          onChange={(e) => setUseBatches(e.target.checked)}
        />
        Measure from batches (sum, then floor once)
      </label>

      {useBatches ? (
        <label style={{ display: "block", marginBottom: "1rem" }}>
          Batch sizes (comma or space separated)
          <input
            value={batchText}
            onChange={(e) => setBatchText(e.target.value)}
            placeholder="1000, 1000, 500"
            style={{ display: "block", width: "100%", marginTop: "0.25rem" }}
          />
        </label>
      ) : (
        <>
          <label style={{ display: "block", marginBottom: "0.75rem" }}>
            Kilograms accumulated
            <input
              value={kg}
              onChange={(e) => setKg(e.target.value)}
              style={{ display: "block", width: "100%", marginTop: "0.25rem" }}
            />
          </label>
          <label style={{ display: "block", marginBottom: "0.75rem" }}>
            Optional delta to accumulate (preview only)
            <input
              value={delta}
              onChange={(e) => setDelta(e.target.value)}
              style={{ display: "block", width: "100%", marginTop: "0.25rem" }}
            />
          </label>
        </>
      )}

      <label style={{ display: "block", marginBottom: "0.75rem" }}>
        kg per credit
        <input
          value={per}
          onChange={(e) => setPer(e.target.value)}
          style={{ display: "block", width: "100%", marginTop: "0.25rem" }}
        />
      </label>

      <label style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "1rem" }}>
        <input
          type="checkbox"
          checked={compare}
          onChange={(e) => setCompare(e.target.checked)}
        />
        Compare {POLICY_TONNE.label} vs {POLICY_HALF_TONNE.label}
      </label>

      {result.ok ? (
        <>
          <p>
            Whole <strong>{result.whole.toString()}</strong> · remainder{" "}
            <strong>{result.remainder.toString()}</strong> kg · need{" "}
            <strong>{result.need.toString()}</strong> kg
            {result.exact ? " · exact" : ""}
          </p>
          <p
            style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: "0.9rem",
              letterSpacing: "0.05em",
            }}
            aria-label="Progress meter"
          >
            {bar}
          </p>
          {progress && progress.ok && (
            <p style={{ fontSize: "0.9rem" }}>
              Partial progress: <strong>{progress.bps.toString()}</strong> bps
            </p>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            <button
              type="button"
              onClick={() =>
                downloadText(
                  "carbon-need.md",
                  exportNeedMarkdown(
                    effectiveKg?.toString() ?? kg,
                    per,
                    result
                  )
                )
              }
            >
              Download MD
            </button>
            <button
              type="button"
              onClick={() =>
                downloadText(
                  "carbon-need.csv",
                  exportNeedCsv([
                    {
                      kg: effectiveKg?.toString() ?? kg,
                      kgPerCredit: per,
                      whole: result.whole.toString(),
                      remainder: result.remainder.toString(),
                      need: result.need.toString(),
                      exact: String(result.exact),
                    },
                  ]),
                  "text/csv;charset=utf-8"
                )
              }
            >
              Download CSV
            </button>
          </div>
        </>
      ) : (
        <p>{result.reason}</p>
      )}

      {sideBySide && sideBySide.ok && (
        <section style={{ marginTop: "1.5rem" }}>
          <h2 style={{ fontSize: "1rem" }}>Policy compare</h2>
          <table>
            <thead>
              <tr>
                <th>Policy</th>
                <th>Whole</th>
                <th>Need kg</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{POLICY_TONNE.label}</td>
                <td>{sideBySide.left.whole.toString()}</td>
                <td>{sideBySide.left.need.toString()}</td>
              </tr>
              <tr>
                <td>{POLICY_HALF_TONNE.label}</td>
                <td>{sideBySide.right.whole.toString()}</td>
                <td>{sideBySide.right.need.toString()}</td>
              </tr>
            </tbody>
          </table>
          <p style={{ fontSize: "0.85rem" }}>
            wholeΔ {sideBySide.wholeDelta.toString()} · needΔ{" "}
            {sideBySide.needDelta.toString()}
          </p>
        </section>
      )}

      <section style={{ marginTop: "1.5rem" }}>
        <h2 style={{ fontSize: "1rem" }}>Worked examples</h2>
        <table>
          <thead>
            <tr>
              <th>kg</th>
              <th>per</th>
              <th>whole</th>
              <th>need</th>
              <th>progressBps</th>
            </tr>
          </thead>
          <tbody>
            {WORKED_EXAMPLES.map((row) => (
              <tr key={`${row.kg}-${row.per}`}>
                <td>{row.kg}</td>
                <td>{row.per}</td>
                <td>{row.whole}</td>
                <td>{row.need}</td>
                <td>{row.progressBps}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2 style={{ fontSize: "1rem" }}>Runbook</h2>
        <ol style={{ fontSize: "0.9rem" }}>
          <li>Pick a published kg-per-credit policy (or a sample scenario).</li>
          <li>Enter accumulated kg — or sum batches, then floor once.</li>
          <li>Read whole / remainder / need / meter.</li>
          <li>Optional: preview a delta; compare two policies; export MD/CSV.</li>
          <li>Never treat need=0 as an on-chain mint or environmental proof.</li>
        </ol>
      </section>

      <section style={{ marginTop: "1.5rem" }}>
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
        Inputs persist in localStorage ({LS_KEY}). See EDUCATION.md · POLICY.md
      </p>
    </main>
  );
}
