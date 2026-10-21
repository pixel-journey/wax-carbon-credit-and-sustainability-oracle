"use client";

import { untilNext } from "./need";

export function Demo() {
  const part = untilNext(2_500n, 1_000n);
  const exact = untilNext(2_000n, 1_000n);
  return (
    <main className="wrap">
      <p className="kicker">Educational reference</p>
      <h1>Kilograms left until a whole credit</h1>
      <p className="lede">2500 kg at 1000 per credit is 2 whole credits and 500 kg short. 2000 kg needs nothing more. This is not an oracle.</p>
      {part.ok && exact.ok ? (
        <p>
          2500 needs {part.need.toString()} more. 2000 needs {exact.need.toString()}.
        </p>
      ) : (
        <p>The sample failed.</p>
      )}
    </main>
  );
}
