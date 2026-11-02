# Education — carbon credit remainder lab

## What this repo teaches

1. **Floor division creates remainders.** `whole = kg / kgPerCredit` discards the partial unit; `need` is how many kg close the gap.
2. **Exact multiples are special.** When `remainder === 0`, `need` is 0. That is arithmetic completeness, not an on-chain mint event.
3. **Progress is not a second credit.** `progressBps` measures how far into the *current incomplete* unit you are.
4. **Policy is an argument.** Real registries define methodology, baselines, and issuance rules. This lab only accepts `kgPerCredit`.

## Worked examples

| kg | kgPerCredit | whole | need |
|----|-------------|-------|------|
| 2500 | 1000 | 2 | 500 |
| 2000 | 1000 | 2 | 0 |
| 100 | 1000 | 0 | 900 |
| 750 | 500 | 1 | 250 |

## Antelope / WAX notes

If a contract stores accumulated mass and a threshold, re-read **that** table and action — do not import these numbers and claim they match mainnet. WAX has no universal carbon oracle in this package.

## Best practice

**Do** publish the kg-per-credit policy next to any UI meter.  
**Do** separate “meter math” from “issuance.”  
**Do not** label this page an oracle.  
**Do not** treat `need === 0` as proof of environmental impact.

## Related

Integer dust and truncation patterns: `px-token-dust-truncation-visualizer`.  
Fractional share of a whole price: `wax-rwa-fractional-floor-index`.
