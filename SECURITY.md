# Security notes

**Trust label:** `educational-reference`

## What this package does not do

- No private keys, wallets, or signing
- No network calls from the pure engine or the educational demo’s measure path
- No claim verification against a carbon registry or MRV system
- No environmental or legal certification

## What to watch in a host product

- **Do not** treat `need === 0` or `exact` as authorization to mint, list, or retire credits on-chain without a separate, audited issuance path.
- **Do not** feed untrusted string input into `BigInt` without the same validation the UI uses; the helpers expect `bigint` already.
- Share URLs only encode demo numbers (kg, policy, flags). They are not authentication tokens.
- localStorage holds last demo inputs on the same origin — clear it if the device is shared.

## Supply-chain

Pin dependencies in the usual way for any public deploy. This lab’s correctness is in pure arithmetic unit tests, not in third-party carbon data feeds.
