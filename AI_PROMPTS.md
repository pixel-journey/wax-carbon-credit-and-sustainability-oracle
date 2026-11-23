# AI handoff — credit-sized floor of kilograms

## Non-negotiables

1. `whole = floor(kg / kgPerCredit)`. `need = kgPerCredit - remainder`, and need is 0 when exact.
2. 2500 kg at 1000 kg/credit → whole **2**, need **500**, progressBps **5000**.
3. Exact multiples → need **0**. That is arithmetic, **not a mint**.
4. Not a carbon registry, MRV system, or oracle feed.
5. Do not give environmental, legal, or financial advice from these integers.

## Prompt seeds

- "2500 kg, 1000 kg per credit — whole, need, progressBps."
- "Exact multiple — need is 0. Is a credit minted?"
- "Refuse calling this an oracle feed."

## Do not

- Fetch a registry or sign a credit in unit tests.
- Market the floor as a sustainability claim.
