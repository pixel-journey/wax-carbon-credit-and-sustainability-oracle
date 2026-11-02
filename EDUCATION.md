# Education — carbon credit remainder lab

## What this repo teaches

1. **Floor division creates remainders.** `whole = kg / kgPerCredit` discards the partial unit; `need` is how many kg close the gap.
2. **Exact multiples are special.** When `remainder === 0`, `need` is 0. That is arithmetic completeness, not an on-chain mint event.
3. **Progress is not a second credit.** `progressBps` / `meterBar` measure how far into the *current incomplete* unit you are.
4. **Policy is an argument.** Real registries define methodology, baselines, and issuance rules. This lab only accepts `kgPerCredit`.
5. **Batching does not invent mass.** `fromBatches` sums non-negative batches then floors once — order of summands does not change the total under pure addition.
6. **Two policies disagree on purpose.** `comparePolicies` shows how the same kg yields different whole/need under 1000 vs 500 kg per credit.

## Worked examples

| kg | kgPerCredit | whole | need | progressBps |
|----|-------------|-------|------|-------------|
| 2500 | 1000 | 2 | 500 | 5000 |
| 2000 | 1000 | 2 | 0 | 0 |
| 100 | 1000 | 0 | 900 | 1000 |
| 750 | 500 | 1 | 250 | 5000 |
| 0 | 1000 | 0 | 0 | 0 |

## Runbook (product)

1. Publish kg-per-credit next to any meter UI.
2. Measure with the same integers the backend will store.
3. Separate meter math from issuance / retirement actions.
4. Prefer WharfKit if those actions are ever signed on Antelope/WAX.

## Antelope / WAX notes

If a contract stores accumulated mass and a threshold, re-read **that** table and action — do not import these sample numbers and claim they match mainnet. This package has no carbon oracle.

## Best practice

**Do** publish the policy. **Do** show need and remainder.  
**Do not** label this page an oracle. **Do not** treat `need === 0` as environmental proof.

## Related

- `px-token-dust-truncation-visualizer` — integer floor dust
- `wax-rwa-fractional-floor-index` — share of a whole price
