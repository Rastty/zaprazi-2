import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");

// Every context link leads to an existing Advisor or Hub. These are normal
// HTML links (also crawlable without JS), not bypasses around merchant gates.
const paths = [
  { file: "page-nastavec-na-wc-pro-seniory.php", id: "toilet-riser", links: [
    "/madlo-k-wc-pro-seniory/#poradce-opora-wc", "/koupelna-a-wc/#poradce-koupelna"
  ] },
  { file: "page-madlo-k-wc-pro-seniory.php", id: "toilet-support", links: [
    "/koupelna-a-wc/#poradce-koupelna"
  ] },
  { file: "page-sprchovaci-zidle-pro-seniory.php", id: "shower-chair", links: [
    "/sedatko-do-vany-pro-seniory/#poradce-sedatko-vana", "/koupelna-a-wc/#poradce-koupelna"
  ] },
  { file: "page-sedatko-do-vany-pro-seniory.php", id: "bath-transfer", links: [
    "/koupelna-a-wc/#poradce-koupelna"
  ] },
  { file: "page-toaletni-zidle-pro-seniory.php", id: "toilet-chair", links: [
    "/navrat-z-nemocnice/#plan-navratu", "/koupelna-a-wc/#poradce-koupelna"
  ] },
  { file: "page-pujceni-choditka.php", id: "walker-rental", links: [
    "/#poradce", "/choditko-do-bytu-pro-seniory/#poradce-choditko-byt",
    "/rollator-pro-seniory/#poradce-rollator"
  ] }
];

const fileBySlug = (slug) =>
  slug === "" ? "front-page.php" : "page-" + slug + ".php";

test("six useful research pages have distinct contextual routes into existing Advisors", () => {
  const unique = new Set();
  for (const { file, id, links } of paths) {
    assert.ok(!unique.has(file), "Duplicate source: " + file);
    unique.add(file);
    const content = read(file);
    const section = content.match(new RegExp('<section[^>]*data-zp-context-links="' + id + '"[^>]*>([\\s\\S]*?)<\\/section>'));
    assert.ok(section, "Missing contextual next-step section: " + file);
    assert.match(section[1], /<h2\b[^>]*>[^<]+<\/h2>/, "No section heading");
    assert.match(section[1], /<nav aria-label="[^"]+">/, "Missing named nav");
    assert.doesNotMatch(section[1], /data-zp-merchant-link|affiliateKey|data-zp-\w+-merchant-link|target="_blank"/,
      "Context navigation must never become an unverified merchant shortcut");
    assert.equal((section[1].match(/home_url\(/g) || []).length, links.length,
      "Avoid footer-like mass linking on " + file);
    for (const link of links) {
      assert.ok(section[1].includes("home_url( '" + link + "' )"),
        "Missing exact contextual destination " + link + " on " + file);
      const url = new URL(link, "https://zaprazi.cz");
      const targetFile = fileBySlug(url.pathname.replace(/^\/|\/$/g, ""));
      const target = read(targetFile);
      if (url.hash) {
        assert.ok(target.includes('id="' + decodeURIComponent(url.hash.slice(1)) + '"'),
          "Link has missing target anchor " + link);
      }
    }
    if (id !== "walker-rental") {
      const advisorIdx = content.indexOf('id="zp-');
      const contextualIdx = content.indexOf('data-zp-context-links="' + id + '"');
      assert.ok(advisorIdx >= 0 && advisorIdx < contextualIdx,
        "Context navigation must not be mistaken for the decision engine");
    }
  }
});

test("top-level Bathroom and Mobility hubs still link to their product-specific paths", () => {
  const bathroom = read("page-koupelna-a-wc.php");
  for (const route of [
    "/nastavec-na-wc-pro-seniory/", "/madlo-k-wc-pro-seniory/",
    "/sprchovaci-zidle-pro-seniory/", "/sedatko-do-vany-pro-seniory/",
    "/toaletni-zidle-pro-seniory/"
  ]) assert.ok(bathroom.includes(route), "Bathroom hub missing " + route);
  const walkers = read("page-choditka-pro-seniory.php");
  assert.ok(walkers.includes("/pujceni-choditka/"), "Walker hub missing rental");
  assert.ok(walkers.includes("/rollator-pro-seniory/"), "Walker hub missing rollator");
  assert.ok(walkers.includes("/choditko-do-bytu-pro-seniory/"), "Walker hub missing indoor walker");
});
