# Education — kilograms until the next whole unit

> **Rung:** `npm test` passes. Policy is `kgPerCredit` as an argument. This is **not** a registry, an oracle, or a claim about any live environmental product.  
> **The test is the rule.** Integer floor dust on tokens: [px-token-dust-truncation-visualizer](https://github.com/pixel-journey/px-token-dust-truncation-visualizer).

## Learning outcomes

| Level | After this file |
| --- | --- |
| Beginner | Compute `whole`, `need`, and exact on a fixed policy |
| Intermediate | Progress bps, batch sum, policy compare, target planning |
| Masterclass | Refuse to call this a sustainability oracle or issuance system |

---

## Beginner — one scene

Policy: **1000 kg per credit**. Floor once; remainder is discarded from `whole`.

| kg | whole | need | exact | progressBps |
| --- | --- | --- | --- | --- |
| 2500 | 2 | 500 | false | 5000 |
| 2000 | 2 | 0 | true | 0 |
| 100 | 0 | 900 | false | 1000 |
| 0 | 0 | 0 | true | 0 |

```ts
import { untilNext } from "./src/need";
untilNext(2500n, 1000n);
// whole: 2n, need: 500n, exact: false
```

```bash
npm test
```

---

## Intermediate

| Rule | Detail |
| --- | --- |
| `need` when not exact | `kgPerCredit - remainder` |
| `need` when exact | `0` — arithmetic completeness, not a mint |
| `progressBps` | `(remainder * 10000) / kgPerCredit`; exact → 0 |
| `fromBatches` | sum 1..32 non-negative batches, then floor once |
| `comparePolicies` | same kg under two policies → different whole/need |
| `kgToReachWhole` | kg to add to hit target whole units; 0 if already there |

### Attack → test

| Attack | Lab behavior |
| --- | --- |
| Negative kg | refused |
| kgPerCredit ≤ 0 | refused |
| Claim exact means on-chain mint | exact is remainder === 0 only |
| Floor each batch then sum | sum first, floor once |
| Cite as live registry | arguments only |

### Exercises

1. 2500 kg at 1000 kg/credit — need? (**500**.)  
2. 2000 at same — need? (**0**.)  
3. Is this an oracle? (**No**.)

---

## Masterclass

Real registries define methodology, baselines, and issuance. This lab only accepts `kgPerCredit`. If a contract stores accumulated mass and a threshold, re-read **that** table — do not import these sample numbers and claim they match mainnet.

Antelope portability: the pure arithmetic works on any chain that stores integer mass and a positive threshold. Issuance actions, retirement, and attestation are out of scope.

### Related

- [px-token-dust-truncation-visualizer](https://github.com/pixel-journey/px-token-dust-truncation-visualizer) — floor dust  
- [wax-rwa-fractional-floor-index](https://github.com/pixel-journey/wax-rwa-fractional-floor-index) — share of a whole price  
- [wax-market-cap-bubble](https://github.com/pixel-journey/wax-market-cap-bubble) — supply × price with remainder kept

---

## What this course will not teach

- Live carbon registries or oracles
- Issuance / retirement transactions
- That `exact` is an on-chain mint event
- Environmental claims about any project or chain
