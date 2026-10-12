# Sample Data and Test Cases

## Sample fixture

[`sample-data/sample-batches.json`](../sample-data/sample-batches.json) is a small synthetic `BatchRecord[]` fixture. Its dates are aligned to the inventory screen's fixed demo date (`2026-10-05`) so its FEFO boundary examples are reproducible. It is illustrative only and is not connected to a data loader.

The complete simulated seed set used by the UI is in `lib/data/batches.ts`.

## Test cases

The executable unit tests are in `lib/fefo.test.ts` and use Node's built-in test runner:

| Case | Expected behavior |
| --- | --- |
| Equal expiry dates | Earlier manufacture date sorts first; if manufacture dates are also equal, the smaller dose quantity sorts first. |
| Expired and usable batches | Expired batch sorts first and receives no issue-order number; the usable batch gets issue order `1`. |
| Expiry today | Days remaining is `0` and FEFO status is `critical`. |
| Manufacture date not before expiry | Record is classified as `invalid` and sorting does not throw. |
| Month and leap-year boundaries | Day counts remain correct across February 29 and the transition to March 1. |

Run the tests and the related project checks with:

```bash
npm test
npm run lint
npm run build
```

These tests validate FEFO helper behavior only. They do not validate sensor readings, storage-temperature compliance, authentication, network services, or real operational decisions.
