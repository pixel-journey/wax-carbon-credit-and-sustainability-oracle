# Policy — carbon credit remainder

**Trust label:** `educational-reference`  
**Updated:** 2026-11-02

## In scope

- Pure `untilNext`, `progressBps`, `afterAccumulate`
- Offline fixtures and unit tests
- Education surfaces (myths, glossary, MD export)

## Out of scope

- Live sustainability oracle / carbon registry product
- On-chain credit issuance or retirement
- Environmental impact claims
- Network calls from the demo page

## Rules

1. `npm test` never requires network.
2. Docs must not call this an oracle in the product sense.
3. Prefer WharfKit if a future host adds intentional chain actions.
