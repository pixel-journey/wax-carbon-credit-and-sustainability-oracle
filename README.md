# wax-carbon-credit-and-sustainability-oracle

> **Trust label:** `educational-reference`  
> **Status:** Full-thrust education pass (2026-11-02)  
> **Catalog:** `wax-ecosystem-blueprint-catalog` (private index; not this public course)

**One-sentence goal:** Teach **how many kilograms remain until the next whole credit** under a fixed policy — with pure, unit-tested math — without claiming to be a live sustainability oracle.

The repository name is historical. The code is a remainder lab.

## What is actually in the repo

| Piece | Role |
|-------|------|
| `src/need.ts` | `untilNext`, `progressBps`, `afterAccumulate` |
| `src/need.test.ts` | Executed claims |
| `src/fixtures.ts` | Sample policies and scenarios |
| `src/myths.ts` | Myths + glossary |
| `src/exportReport.ts` | Markdown report |
| `src/Demo.tsx` | Scenarios, delta preview, export |
| `EDUCATION.md` / `ARCHITECTURE.md` / `POLICY.md` | Teaching + boundaries |

## Quick start

```bash
npm install
npm test
npm run dev
```

```ts
import { untilNext } from "./src/need";

untilNext(2500n, 1000n);
// whole: 2, need: 500, exact: false
```

## Related

- `px-token-dust-truncation-visualizer` — integer floor dust
- `wax-rwa-fractional-floor-index` — share of a whole price

## License

MIT — Pixel Journey
