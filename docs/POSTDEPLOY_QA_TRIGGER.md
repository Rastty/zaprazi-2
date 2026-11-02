# Explicit postdeploy Chrome QA trigger — Zápraží 0.8.187

- **Owner report:** manual WordPress Pull + Deploy completed on 2026-11-02.
- **Expected source release:** `0.8.187` at `main` / `dev` commit `e613bcd857e08b30db67955f3ac0e2ab20348aa3`.
- **Status before QA:** owner deployment claim, **not yet independently verified**.
- **Purpose:** start read-only `Production Advisor Browser QA` on the `main` push which includes this file. Its live-release coherence check must reject any 0.8.186/0.8.187 split or incomplete runtime integrity; its 0.8.187 Chrome job exercises a safe walker candidate, blocked brakes and physical help, reset of stale results, and 25 affiliate slots.
- **Permissions:** GitHub workflow `contents: read`. No WordPress writes, no automatic deployment, no merchant clicks, no health-answer or user-data logging.
- **Use for later releases:** update only the expected release and the acknowledgment date after the owner confirms deployment; do not conflate GitHub CI with production confirmation. Keep the content factual if QA fails.
- **Fallback:** if GitHub Actions cannot run, do not mark release as production-verified; inspect the error and use an authorized workflow_dispatch or the next scheduled production run.

## 2026-11-02 — rerun after correcting old test expectation

The first exact-release production Chrome run https://github.com/Rastty/zaprazi-2/actions/runs/41449789755 verified release 0.8.187, integrity OK, all 25 slots, the new Mobility safe and blocked journeys, and all 14 existing Advisor forms. Its overall job failed at the **final** older Mobility acquisition test because it still asserted `// ZP_RELEASE_0_8_185` in the public print helper while the deployed, manifest-checked file correctly carries `// ZP_RELEASE_0_8_187`.

This documented change requests a **fresh complete read-only postdeploy QA** after updating the test to match the actual source release; it does not modify WordPress. The run must be inspected before declaring the complete suite PASS.

## 2026-11-02 — production acceptance request for 0.8.189

- **Owner acknowledgment:** WordPress Pull + Deploy completed, reported in project chat on 2026-11-02. This is a claim to verify, not acceptance evidence.
- **Expected exact release:** `0.8.189`, source commit `9f64f1893aa5de05fcaf786e47ef32ec03b5d16e` (the coordinated PR #615 release). At acknowledgment time `main` and `dev` matched this commit.
- **Trigger:** pushing this document to `main` starts read-only Production Advisor Browser QA for the checked-out release; the release-coherence preflight must fail on a partial deploy, mismatched source marker, incomplete 100-file manifest or unexpected affiliate readiness.
- **New acceptance:** the `sukl-monthly-source-189` job inspects the real November SÚKL evidence handoff on the insurance walker page, historical price disclosure and source links in Chrome. Its presence is mandatory in the final run.
- **No claim of success yet:** require completed green jobs, inspect failures if any, and avoid changing WordPress or collecting visitor health information.
