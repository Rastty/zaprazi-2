# Explicit postdeploy Chrome QA trigger — Zápraží 0.8.187

- **Owner report:** manual WordPress Pull + Deploy completed on 2026-11-02.
- **Expected source release:** `0.8.187` at `main` / `dev` commit `e613bcd857e08b30db67955f3ac0e2ab20348aa3`.
- **Status before QA:** owner deployment claim, **not yet independently verified**.
- **Purpose:** start read-only `Production Advisor Browser QA` on the `main` push which includes this file. Its live-release coherence check must reject any 0.8.186/0.8.187 split or incomplete runtime integrity; its 0.8.187 Chrome job exercises a safe walker candidate, blocked brakes and physical help, reset of stale results, and 25 affiliate slots.
- **Permissions:** GitHub workflow `contents: read`. No WordPress writes, no automatic deployment, no merchant clicks, no health-answer or user-data logging.
- **Use for later releases:** update only the expected release and the acknowledgment date after the owner confirms deployment; do not conflate GitHub CI with production confirmation. Keep the content factual if QA fails.
- **Fallback:** if GitHub Actions cannot run, do not mark release as production-verified; inspect the error and use an authorized workflow_dispatch or the next scheduled production run.
