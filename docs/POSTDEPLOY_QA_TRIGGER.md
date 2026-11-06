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

## 2026-11-03 — nezávislé potvrzení 0.8.190, vyžádání finální Chrome QA

- **Důkaz skutečně nasazené verze:** read-only scheduled [Independent Zápraží Production Acceptance #41540159693](https://github.com/Rastty/zaprazi-2/actions/runs/41540159693) z 2026-11-02 22:47 UTC vrátil `expected=0.8.190`, `deployed=0.8.190`, `release_matches=true`, `status=verified`; job skončil zeleně. Zahrnul kontrolu veřejného readiness/integrity a vybraných obsahových a vyhledávacích cest.
- **Co důkaz nepokrývá:** tento HTTP smoke **není** úplná Chrome akceptace všech 14 poradců. Poslední dostupné zelené `Production Advisor Browser QA` pro 0.8.190 pochází z release PR **před** finálním potvrzením nasazení; nesmí být zaměněno za postdeploy akceptaci.
- **Účel tohoto commitu:** po zeleném PR CI a bezpečném merge do `main` spustit existující read-only workflow `Production Advisor Browser QA` přes jeho přesně omezený `push.paths` trigger. Workflow má ověřit zdrojovou verzi 0.8.190, 14 poradců, safety/fit-gates, 25/25 affiliate readiness a release-specific úzké dveře v reálném Chrome.
- **WordPress deploy gate:** zde se **nic nenasazuje** ani neupravuje na WordPressu; `main=dev` je před změnou identické. GitHub dokumentace není sama o sobě potvrzením úspěchu Chrome QA.
- **Akceptace:** teprve po dokončení všech relevantních zelených jobů lze 0.8.190 označit za nezávisle postdeploy ověřenou. Při FAIL zastavit další WordPress release, prověřit konkrétní job a bezpečnostní příčinu. GSC a schválené provize zůstávají UNKNOWN.

## 2026-11-04 — potvrzená veřejná 0.8.192: žádost o kompletní Chrome postdeploy QA

- **Nezávislý živý důkaz, ne domněnka o deployi:** [Independent Production Acceptance #41798248610](https://github.com/Rastty/zaprazi-2/actions/runs/41798248610) dne 2026-11-04 v 08:17 UTC dokončila `status=verified`, `expected=0.8.192`, `deployed=0.8.192`, `release_matches=true`. Prověřila veřejný readiness, redakční SEO, vyhledávací navázání i přesné zdroje hmotností WA17/WA21 na živé stránce. Jde o HTTP acceptance, nikoli celý interaktivní Chrome test.
- **Zdrojový release:** `0.8.192`; po QA PR #646 jsou `main` a `dev` synchronizovány na `e829e2db407f09e7d1b0f3bb45cefb9aa63a43bb`, bez nové změny WordPress runtime.
- **Účel této čistě dokumentační změny:** po CI PASS a merge do `main` aktivovat existující `push.paths` trigger `Production Advisor Browser QA`. Prověřit plnou bezpečnostní cestu všech 14 poradců, dynamické fail-closed nabídky, privacy, live release coherence a 25/25 affiliate konfiguraci, včetně relevantních Mobility regresí.
- **Důkaz dokončení:** přijmout pouze zelený celý workflow se skutečným `0.8.192`; při FAIL řešit konkrétní krok. Dokud neběží a neprojde, `config/growth-state.json` musí dál považovat starší `safety_qa.verifiedRelease=0.8.191` za neaktuální. Nepřisuzovat tím žádné organické kliky, objednávky nebo provize.
- **Bez zásahu na web:** tento PR nemění WordPress, nabídky, osobní data ani publikační mechanismus; cílem je skutečná produkční kontrola již nasazeného vydání.

## 2026-11-04 — owner confirms 0.8.193 Pull + Deploy; request independent production acceptance

- **Owner report:** in the project conversation on 2026-11-04, the owner said `deployed` after coordinating release PR #651. This is an explicit deployment acknowledgment, **not** independent evidence of a successful WordPress theme installation.
- **Exact source release:** `0.8.193`, merged PR [#651](https://github.com/Rastty/zaprazi-2/pull/651), checked-in `main=dev` commit `b86606fa4ecfdc197923d907c02f74be9b46d3bb`. The merge/push CI and read-only preflight passed. No new WordPress theme/runtime changes are introduced by this QA request.
- **Trigger:** a green documentation-only PR changing this file, merged into `main`, activates existing read-only `Production Advisor Browser QA` via its tightly scoped `push.paths`. This is **post-deployment** verification: no PR-only `ZP_RELEASE` override may permit the earlier live 0.8.192 release.
- **Required results:** exact public `release=0.8.193` and `integrity=ok`, stable 25/25 configured merchant slots, full Chromium testing of all 14 existing Advisors, no unsafe product offers or sensitive answer transport, mobility acquisition and editorial SEO checks. The new `scripts/audit-live-mobility-direct-entry-193.mjs` must also pass **on the deployed release**: both `/pujceni-choditka/` and `/choditko-na-pojistovnu/` have their primary mobile CTA directly to `/#poradce`, secondary compare-first links, and no merchant shortcuts.
- **Acceptance is not assumed:** Do **not** record `safety_qa.verifiedRelease=0.8.193` until all relevant exact-release public QA jobs are green. If live WordPress is stale or partially deployed, investigate, stop release-dependent work, and do not pretend the change is live. No actual sales, approved commissions, GSC or GA4 uplifts are inferred.
- **Privacy and deploy boundary:** no WordPress write, analytics changes, affiliate clicks, identifying queries, or persistent Home Advisor answers in this PR. Evidence only.

## 2026-11-04 — 0.8.193: final independent postdeploy acceptance after browser-test correction

- The first exact-source [Production Advisor Browser QA #41820650980](https://github.com/Rastty/zaprazi-2/actions/runs/41820650980) independently confirmed the public `0.8.193` marker and integrity `ok`, 25/25 affiliate readiness, all 14 Home Advisors and all other independent safety, return-home, SÚKL, Mobility and editorial SEO jobs. **The workflow overall FAILED** only in the newly added direct-entry CTA browser step: its test waited for document navigation while the consent banner covered the mobile CTA.
- An isolated read-only [Chrome evidence #41822378524](https://github.com/Rastty/zaprazi-2/actions/runs/41822378524) then **PASSED** the exact `0.8.193` public entry journeys from both `/pujceni-choditka/` and `/choditko-na-pojistovnu/` after choosing **Bez měření** and waiting for the genuinely rendered `/#poradce` form. QA-only fix was reviewed and merged in [PR #653](https://github.com/Rastty/zaprazi-2/pull/653). There were no WordPress runtime, theme release, safety rule, affiliate, health-data or SEO content changes after deployment.
- **Purpose:** documentation-only `push.paths` trigger for one full **postdeploy** Production Advisor Browser QA on the current `main`, now containing the corrected read-only CTA acceptance test. Source `0.8.193` and live `0.8.193` must match with no PR-only release override.
- **Accept only if:** all relevant complete workflow jobs are green, including the 14-Advisor main Chromium job and the real click on both Mobility acquisition hero CTAs; no merchant clicks, POSTs, health-answer storage or hidden-product safety bypass. If any job fails, do not mark `safety_qa` verified and diagnose the specific failure.
- **Next graph step only after acceptance:** write verified `safety_qa.verifiedRelease=0.8.193` with a link to the **fully green production run**; do not confuse HTTP readiness with approved affiliate commissions, clicks, attributed sales, or GSC growth.

## 2026-11-04 — owner confirms 0.8.194 WordPress Pull + Deploy: real postdeploy Chrome acceptance

- **Owner deployment acknowledgment** in project conversation on 2026-11-04: `deployed` following merged [PR #658](https://github.com/Rastty/zaprazi-2/pull/658). This is not itself evidence of the live WordPress source release or integrity.
- **Source expected:** exact release `0.8.194`, `main=dev` commit `028d0460f03ab23cf1e9824cca4122587b4dd702`. Source CI and release ref preflight passed. This PR is a documentation-only read-only postdeploy QA trigger via the pre-existing production workflow `push.paths`; no runtime or WordPress changes.
- **Acceptance:** verify real live `0.8.194` (not 0.8.193) with `integrity=ok`, 25/25 configured merchant slots, safe outputs on all 14 real Advisor forms, safe merchant fit gates and privacy, SÚKL and editorial SEO, and exact 0.8.194 mobile Chromium `/choditka-pro-seniory/` hero CTA → `/#poradce` with the genuinely visible Mobility Advisor form, first declining optional analytics via `Bez měření`. Secondary compare-first `#vyber-typu` must remain accessible. All checks must pass on the **same complete postdeploy run**.
- **Important distinction:** `scripts/audit-live-mobility-direct-entry-193.mjs` is intentionally not applicable on `0.8.194`; the historical `0.8.193` campaign is not a live release claim. The new `scripts/audit-live-mobility-hub-194.mjs` is exact-release guarded and postdeploy only.
- **No acceptance before results:** retain `safety_qa.verifiedRelease=0.8.193` until all relevant live workflow jobs are green. If a mismatch, partial deploy, broken CTA or safety regression is found, fail closed and diagnose rather than claiming a verified release. No GSC traffic uplift, real purchases or approved commissions follow from this browser test.
- **Privacy boundary:** public read-only verification, no WordPress write, merchant click, external tracking request or submission of health answers.

## 2026-11-04 — owner confirms WordPress 0.8.195 deployed; independent exact-release acceptance

- **Owner acknowledgment:** on 2026-11-04, after [PR #661](https://github.com/Rastty/zaprazi-2/pull/661) merged and `main=dev=cf48bc40fe24c288975b5a9096ded38f042eedcd`, owner reported `deploeyd`. This is deployment acknowledgment **only**, not independent proof of actual PHP/theme release or browser integrity.
- **Trigger purpose:** a documentation-only change to this exact file triggers the pre-existing read-only `Production Advisor Browser QA` on `main` via its `push.paths`. No theme, WP database, affiliate or tracking writes; no runtime deploy and no newly created Actions credentials.
- **Required acceptance:** public WP readiness `release=0.8.195`, `integrity=ok`, 25/25 configured affiliate slots; all 14 Advisors pass browser safety, privacy and fit-gates; independent SEO/SÚKL and acquisition jobs pass; **new exact-release 0.8.195 browser test** `scripts/audit-live-consent-footer-195.mjs` asserts only one consent script in `body`, adjacent inline config before script, rendered consent controls before `wp_footer`, refusal and re-opening of analytics preference, **no GA4 requests with denied consent**, then real mobile transition from `/choditka-pro-seniory/` to visible `/#poradce`. Zero merchant clicks, POST or answer payloads.
- **All-job gate:** accept only after the *complete postdeploy workflow* has status `completed` and conclusion `success`, including the specific 0.8.195 privacy/browser step; any failure must be investigated before asserting this release safe. Predeploy PR PASS against previous live release 0.8.194 is not a substitute.
- **Graph status:** do **not** upgrade `config/growth-state.json.nodes.safety_qa.verifiedRelease` from `0.8.194` to `0.8.195` without live evidence. Preserve GSC, GA4 and approved affiliate metrics UNKNOWN (not zero), as this acceptance cannot prove improvements in traffic, performance or sales.

## 2026-11-05 — 0.8.196: request full scheduled-equivalent postdeploy Chrome recheck

- **Independent live evidence:** [Production Acceptance #42109508071](https://github.com/Rastty/zaprazi-2/actions/runs/42109508071) completed successfully on 2026-11-05 against `main` commit `98f778cbbecf6a77802423850ab6d4f181df7bf2`. This is limited HTTP/readiness acceptance, **not** full 14-Advisor Chrome acceptance.
- **Reason:** earlier full [Production Advisor Browser QA #42019404090](https://github.com/Rastty/zaprazi-2/actions/runs/42019404090) failed the exact 0.8.196 model/SÚKL visitor warning check. Merged [PR #671](https://github.com/Rastty/zaprazi-2/pull/671) adds public-note diagnostics without relaxing assertions. PR-triggered Chrome QA skips release-specific jobs by design and cannot close this gap.
- **Execution:** after green CI and merge, this document's `main` push activates the existing read-only Production Advisor Browser QA with **non-PR** conditions, including the exact 0.8.196 model-identity/SÚKL test and all 14 Advisors. Do not set `ZP_RELEASE` to an older live release or skip failing checks. No WordPress writes, merchant clicks, POSTs or health-answer logging.
- **Acceptance gate:** require one complete successful postdeploy workflow, exact source/live `0.8.196`, integrity OK and all relevant jobs green. If the reimbursement warning still fails, use the newly exposed **public** note to correct the real issue in a separate tested PR; do not update `growth-state.json` safety verification or claim deployment/SEO gains until the evidence supports it.

## 2026-11-06 — complete 0.8.196 Chrome recheck after PR #673 test fix

- **Reason:** the full postdeploy Chrome run [#42128726318](https://github.com/Rastty/zaprazi-2/actions/runs/42128726318) failed one reimbursement-warning assertion due solely to case-sensitive comparison of the live Czech sentence beginning with `Aktuální úhradu`; eight other jobs passed. [PR #673](https://github.com/Rastty/zaprazi-2/pull/673) changed only the test to compare case-insensitively and was merged with green PR CI and partial PR browser QA.
- **Scope:** this documentation-only push-path trigger requests a new **complete** read-only Production Advisor Browser QA on `main` at source release `0.8.196`, including all scheduled-equivalent specialized jobs, 14 Advisors, fit-gates, privacy, SÚKL and 25/25 affiliate readiness. PR-only skipped jobs are not acceptance evidence.
- **Acceptance:** require one completed successful full workflow, exact public `0.8.196`, integrity `ok` and no failed or unexpectedly skipped required job. Until then `config/growth-state.json` retains safety evidence for `0.8.195`; do not infer SEO or revenue uplift.
- **Deploy boundary:** no WordPress deployment, product ranking, merchant click, analytics transmission, health-answer logging or theme/runtime change is authorized by this trigger.
