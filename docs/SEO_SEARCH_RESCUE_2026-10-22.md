# Search rescue: relevant Advisors before legacy search results
**Release 0.8.146 — 22 Oct 2026.** Evidence: a live WordPress search for \`sprcha\` placed unrelated historical heat-pump articles above the actual bathing decision page. A query for \`vozik\` mixed the wheelchair Advisor with historic solar-energy content. WP Search searches the preserved mixed-topic archive; we do not change that index or any old URLs.

**What changed:** the existing \`search.php\` now renders 2–3 curated, safe, same-origin Advisor/resources for 11 broad practical query intents. The dictionary has fixed links independent of the query string, with explicit safety qualifications and no merchant link. The old WP search results remain intact and paginated below the guidance block. Unrelated terms such as \`fotovoltaika\` receive no invented Advisor suggestion.

**Why:** visitors searching our own site should not have to interpret unrelated legacy results before finding current decision support. This optimizes the post-search user journey, **not proven Google rankings or organic traffic**.

**Risk controls:** only matching broad topic terms, not diagnoses; search terms are not stored, sent to analytics, or added to Advisor/merchant URLs. No automatic product selection or buying shortcut. PHP unit tests cover all routes and negative controls. Theme release/version + 74 protected asset tokens remain aligned.

**Acceptance:** after Pull + Deploy verify \`/?s=sprcha\`, \`/?s=vozik\`, \`/?s=postel\` and \`/?s=fotovoltaika\`; first three must show contextual help before historical results, fourth must not. All original search results and pagination remain available. Run 14-advisor browser smoke, 25/25 affiliate readiness and site integrity as usual. GSC performance still unknown until actual property data is available.
