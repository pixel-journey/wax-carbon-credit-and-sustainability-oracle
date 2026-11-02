# Architecture

```
kg, kgPerCredit (or CreditPolicy)
        │
        ▼
   untilNext → whole, remainder, need, exact, accountedKg
        │
        ├── progressBps (partial unit only)
        ├── afterAccumulate (preview kg + delta)
        └── exportNeedMarkdown
```

| Layer | Role |
|-------|------|
| `need.ts` | Pure rules |
| `fixtures.ts` | Sample policies / scenarios |
| `Demo.tsx` | Teaching UI |
| `api.ts` / `usecases.ts` | Unsent HTTP shapes |

**Honesty boundary:** no registry, no MRV, no wallet, no broadcast.
