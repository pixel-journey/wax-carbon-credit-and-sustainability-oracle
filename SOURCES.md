# Sources

| Source | Use |
| --- | --- |
| [docs.wax.io](https://docs.wax.io/) | Contract storage context only |
| [SECURITY.md](SECURITY.md) | Not a registry |
| [dust visualizer](https://github.com/pixel-journey/px-token-dust-truncation-visualizer) | Related floor dust |

## Product facts

```text
whole = floor(kg / kgPerCredit)
need  = kgPerCredit - remainder   # 0 when exact
```

- 2500 kg at 1000 kg/credit → whole **2**, need **500**, progressBps **5000**.
- Exact multiples → need **0** (arithmetic only, not a mint).
- Not a carbon registry, MRV system, or oracle feed.
