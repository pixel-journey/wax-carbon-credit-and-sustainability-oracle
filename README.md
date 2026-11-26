# wax-carbon-credit-and-sustainability-oracle

> **Trust label:** `educational-reference`  
> **Status:** Course-format upgrade (2026-11-26)  
> **Catalog:** `wax-ecosystem-blueprint-catalog` (private index; not this public course)

**One-sentence goal:** Teach **how many kilograms remain until the next whole credit** under a fixed `kgPerCredit` policy — pure math, unit-tested — without claiming to be a live sustainability oracle.

The repository name is historical. The code is a remainder lab.

## Locked scene

| kg | kgPerCredit | whole | need |
| --- | --- | --- | --- |
| 2500 | 1000 | 2 | 500 |
| 2000 | 1000 | 2 | 0 (exact) |

```ts
import { untilNext } from "./src/need";
untilNext(2500n, 1000n);
// { ok: true, whole: 2n, need: 500n, exact: false, ... }
```

## What is actually in the repo

| Piece | Role |
| --- | --- |
| `src/need.ts` | `untilNext`, progress, batches, policy compare, target kg |
| `src/need.test.ts` | Executed claims + invariants |
| `src/fixtures.ts` | Sample policies |
| `src/myths.ts` | Myths + glossary |
| `src/Demo.tsx` | Scenarios, delta preview, export |
| [EDUCATION.md](EDUCATION.md) | Beginner → Intermediate → Masterclass course |

## Quick start

```bash
npm install
npm test
npm run dev
```

## Boundaries

- Not a registry, oracle, or issuance system
- `exact` means remainder is zero — not a mint event
- Policy is an argument you pass; it is not fetched from chain

## Related

- [px-token-dust-truncation-visualizer](https://github.com/pixel-journey/px-token-dust-truncation-visualizer)
- [wax-rwa-fractional-floor-index](https://github.com/pixel-journey/wax-rwa-fractional-floor-index)
- [wax-market-cap-bubble](https://github.com/pixel-journey/wax-market-cap-bubble)

## License

MIT — Pixel Journey
