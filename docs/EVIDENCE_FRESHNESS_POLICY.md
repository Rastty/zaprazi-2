# Evidence freshness policy

ZaPrazi separates stable product facts from time-sensitive commerce and reimbursement claims.

## Current freshness windows

| Evidence | Maximum age before stale |
| --- | ---: |
| Manufacturer/manual technical evidence | 365 days |
| Merchant offer/public retail conditions | 30 days |
| Rental price/availability | 30 days |
| Manufacturer reimbursement claim | 31 days |

These are conservative product rules, not legal validity periods.

## Runtime behavior

### Technical evidence
When stale:
- product identity/facts are not silently deleted,
- source remains visible,
- UI marks the source as needing re-verification.

### Merchant offers
When stale:
- canonical merchant destination remains available,
- UI warns that price/availability were not recently verified,
- affiliate commission never changes the freshness rule.

### Rental evidence
When stale:
- exact stored day/month price is hidden,
- provider/source link remains available for fresh verification.

### Reimbursement evidence
When stale:
- manufacturer wording such as "full reimbursement" is not presented as current,
- official SÚKL verification path remains visible,
- exact official amount is still forbidden without an `official_sukl_monthly` record and validity period.

## Fail-closed handling

Malformed, missing or future `checkedAt` dates return `unknown`, which is treated like stale for user-facing currentness claims.

## Testing

Freshness functions accept an injected reference time so tests remain deterministic and do not depend on CI timezone or execution date.
