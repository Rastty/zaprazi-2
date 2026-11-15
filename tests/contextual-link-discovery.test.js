import test from "node:test";
import assert from "node:assert/strict";
import {contextualLinkDiscovery} from "../scripts/lib/contextual-link-discovery.mjs";
import {prepareInternalLinks} from "../scripts/lib/internal-link-health.mjs";

const decide = ["/choditka-pro-seniory/", "/rollator-pro-seniory/", "/sprchovaci-zidle-pro-seniory/"];
const scan = pages => contextualLinkDiscovery(prepareInternalLinks(pages).targets,
  pages.map(x => x.path), decide);

test("counts distinct main-content sources, homepage depth and disconnected pages", () => {
  const report = scan([
    {path: "/", links: ["/choditka-pro-seniory/", "/choditka-pro-seniory/#types"]},
    {path: "/choditka-pro-seniory/", links: ["/rollator-pro-seniory/", "/rollator-pro-seniory/"]},
    {path: "/rollator-pro-seniory/", links: ["/choditka-pro-seniory/"]},
    {path: "/sprchovaci-zidle-pro-seniory/", links: ["/sprchovaci-zidle-pro-seniory/"]}
  ]);
  assert.equal(report.status, "complete");
  assert.equal(report.decision_pages, 3);
  assert.equal(report.with_homepage_main_link, 1);
  assert.equal(report.unreachable_from_homepage_main, 1);
  assert.equal(report.with_no_other_editorial_inbound, 1);
  assert.deepEqual(report.weak_contextual_discovery, [{
    path: "/sprchovaci-zidle-pro-seniory/", inbound_contextual_sources: 0,
    inbound_from_other_decision_pages: 0, linked_from_homepage_main: false,
    homepage_main_depth: null
  }]);
});

test("counts editorial inbound separately from homepage and ignores commerce and unsafe links", () => {
  const report = scan([
    {path: "/", links: ["/sprchovaci-zidle-pro-seniory/", "/go/private/", "/rollator-pro-seniory/?answer=private"]},
    {path: "/choditka-pro-seniory/", links: []},
    {path: "/rollator-pro-seniory/", links: ["https://external.example/", "/rollator-pro-seniory/"]},
    {path: "/sprchovaci-zidle-pro-seniory/", links: []}
  ]);
  const shower=report.weak_contextual_discovery.find(x=>x.path==="/sprchovaci-zidle-pro-seniory/");
  assert.equal(shower.inbound_contextual_sources, 1);
  assert.equal(shower.inbound_from_other_decision_pages, 0);
  assert.equal(shower.homepage_main_depth, 1);
  assert.equal(report.unreachable_from_homepage_main, 2);
});

test("incomplete scan returns UNKNOWN rather than false orphan warnings", () => {
  const report = scan([
    {path: "/", links: ["/choditka-pro-seniory/"]},
    {path: "/choditka-pro-seniory/", links: []}
  ]);
  assert.equal(report.status, "incomplete");
  assert.equal(report.weak_contextual_discovery, undefined);
  assert.equal(report.unreachable_from_homepage_main, undefined);
});

test("rejects duplicate source labels, uncurated pages and unsafe decision paths", () => {
  assert.throws(() => contextualLinkDiscovery([], ["/", "/"], decide), /Unexpected contextual/);
  assert.throws(() => contextualLinkDiscovery([], ["/", "/private/?user=1"], decide), /Unexpected contextual/);
  assert.throws(() => contextualLinkDiscovery([], ["/"], ["/", ...decide]), /Invalid curated/);
});
