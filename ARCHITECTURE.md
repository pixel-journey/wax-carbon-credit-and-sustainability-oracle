# Architecture

```
kg, kgPerCredit (or CreditPolicy)
        │
        ▼
   untilNext → whole, remainder, need, exact, accountedKg
        │
        ├── progressBps / meterBar
        ├── afterAccumulate (kg + delta)
        ├── fromBatches (sum then floor)
        ├── comparePolicies (two policies, one kg)
        └── exportNeedMarkdown
```

| Layer | Role |
|-------|------|
| `need.ts` | Pure rules |
| `fixtures.ts` | Sample policies / scenarios |
| `Demo.tsx` | Teaching UI + localStorage |
| `api.ts` / `usecases.ts` | Unsent HTTP shapes |

**Honesty boundary:** no registry, no MRV, no wallet, no broadcast.
