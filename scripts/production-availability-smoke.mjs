#!/usr/bin/env node
/**
 * Minimal read-only production health check for the Mobility entry journey.
 * Never submits the Advisor, follows merchant links, sends personal answers or
 * treats source availability as a functional/safety certification.
 */
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

export const ORIGIN = "https://zaprazi.cz";
const MOBILITY = "/choditka-pro-seniory/";

// A source-only smoke must not accept dead links or headings preserved in
// HTML comments, scripts or inert templates as working visitor navigation.
// This is deliberately NOT a full browser visibility or accessibility check.
export function activeMarkup(html) {
  return String(html)
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style|template|noscript)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "");
}

// HTML-source smoke must not count a link inside an inert/hidden ancestor as
// a usable journey. This is a conservative source check, not computed CSS or
// a replacement for the independent production Chrome accessibility QA.
const VOID_TAGS = new Set(["area","base","br","col","embed","hr","img",
  "input","link","meta","param","source","track","wbr"]);
function inspectSourceMarkup(markup) {
  const hidden = new Set(), hero = new Set(), targets = [], stack = [];
  for (const match of markup.matchAll(/<\/?([a-z][\w:-]*)\b[^>]*>/gi)) {
    const tag = match[1].toLowerCase(), token = match[0];
    if (token.startsWith("</")) {
      const index = stack.findLastIndex(entry => entry.tag === tag);
      if (index !== -1) stack.length = index;
      continue;
    }
    if (tag === "a" && stack.some(entry => entry.hidden)) hidden.add(match.index);
    if (tag === "a" && stack.some(entry => entry.classes.includes("zp-hero")) &&
        stack.some(entry => entry.classes.includes("zp-hero-actions")))
      hero.add(match.index);
    const style = token.match(/\sstyle\s*=\s*(["'])(.*?)\1/i)?.[2] ?? "";
    const ariaHidden = token.match(/\saria-hidden\s*=\s*(["'])(.*?)\1/i)?.[2] ?? "";
    const isHidden = /\s(?:hidden|inert)(?=[\s=>/])/i.test(token) ||
      ariaHidden.trim().toLowerCase() === "true" ||
      /(?:display\s*:\s*none|visibility\s*:\s*hidden)/i.test(style);
    const id = token.match(/\sid\s*=\s*(["'])(.*?)\1/i)?.[2] ?? "";
    const classes = (token.match(/\sclass\s*=\s*(["'])(.*?)\1/i)?.[2] ?? "").split(/\s+/);
    if (id === "poradce" || id === "zp-mobility-advisor") {
      targets.push({id, visible: !isHidden && !stack.some(entry => entry.hidden),
        insideAdvisorSection: stack.some(entry => entry.id === "poradce" && !entry.hidden)});
    }
    if (!VOID_TAGS.has(tag) && !/\/\s*>$/.test(token))
      stack.push({tag, hidden: isHidden, id, classes});
  }
  return {hidden, hero, targets};
}

export function anchors(html) {
  // A tag with a valid href but no accessible name is not a usable CTA.
  // Inspect the actual paired anchor, not just an opening tag in source HTML.
  const markup = activeMarkup(html);
  const {hidden: hiddenPositions, hero: heroPositions} = inspectSourceMarkup(markup);
  return [...markup.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a\s*>/gi)].map(match => {
    const opening = match[0].slice(0, match[0].indexOf(">") + 1);
    const attrs = {};
    for (const item of opening.matchAll(/\s([\w:-]+)\s*=\s*(["'])(.*?)\2/g))
      attrs[item[1].toLowerCase()] = item[3];
    for (const key of ["hidden", "inert"]) {
      if (new RegExp("\\s" + key + "(?=[\\s=>/])", "i").test(opening)) attrs[key] = "";
    }
    attrs.__hiddenAncestor = hiddenPositions.has(match.index);
    attrs.__insideHero = heroPositions.has(match.index);
    attrs.__text = match[1].replace(/<[^>]*>/g, "")
      .replace(/&(?:nbsp|#160|#x0*a0);/gi, " ").trim();
    return attrs;
  });
}

// Narrow source-only guard, not a substitute for browser accessibility QA.
// An empty, hidden or keyboard-excluded primary link must not pass as a
// usable journey even when its destination URL is correct.
export function usableNavigationAnchor(a) {
  const named = Boolean(a.__text || (a["aria-label"] || "").trim());
  return named && !a.__hiddenAncestor && !Object.hasOwn(a, "hidden") && !Object.hasOwn(a, "inert") &&
    a["aria-hidden"] !== "true" && a.tabindex !== "-1" &&
    !/(?:display\s*:\s*none|visibility\s*:\s*hidden)/i.test(a.style || "");
}

function safeInternalLink(href, currentPath, path, hash = "") {
  if (typeof href !== "string" || !href) return false;
  try {
    const url = new URL(href, ORIGIN + currentPath);
    return url.origin === ORIGIN && url.username === "" && url.password === "" &&
      url.pathname === path && url.search === "" && url.hash === hash;
  } catch { return false; }
}

export function assertHomepage(html) {
  const markup = activeMarkup(html);
  if (!/<h1\b[^>]*>\s*Bezpečně a samostatně doma\./i.test(markup))
    throw new Error("Homepage mission heading missing");
  // The #poradce link must lead to the actual visible Mobility form, not
  // to unrelated, duplicate or hidden IDs that merely exist in HTML source.
  const targets = inspectSourceMarkup(markup).targets;
  const sections = targets.filter(target => target.id === "poradce");
  const forms = targets.filter(target => target.id === "zp-mobility-advisor");
  if (sections.length !== 1 || forms.length !== 1 || !sections[0].visible ||
      !forms[0].visible || !forms[0].insideAdvisorSection)
    throw new Error("Homepage Mobility Advisor anchor/form missing or unusable");
  if (!anchors(markup).some(a => safeInternalLink(a.href, "/", MOBILITY) && usableNavigationAnchor(a)))
    throw new Error("Homepage Mobility article link missing");
}

export function assertMobility(html) {
  const markup = activeMarkup(html);
  if (!/<h1\b[^>]*>\s*Chodítka pro seniory/i.test(markup))
    throw new Error("Mobility article heading missing");
  const ctas = anchors(markup).filter(a => a["data-zp-journey"] === "advisor");
  // Release 0.8.195 uses the same safe Advisor handoff twice: first above the
  // fold and later as a natural next step after explaining selection criteria.
  // Require exactly one *hero* CTA and verify every subsequent marked CTA.
  // A second valid CTA must not look like production downtime.
  const primary = ctas.filter(a => a.__insideHero);
  if (primary.length !== 1)
    throw new Error("Expected exactly one primary hero editorial-to-Advisor CTA");
  for (const cta of ctas) {
    if (!usableNavigationAnchor(cta))
      throw new Error("Editorial Advisor CTA has no usable accessible name or is hidden");
    if (!safeInternalLink(cta.href, MOBILITY, "/", "#poradce"))
      throw new Error("Editorial CTA does not point to the safe Mobility Advisor anchor");
    if (cta["data-zp-merchant-link"] !== undefined || /\bsponsored\b/i.test(cta.rel || ""))
      throw new Error("Editorial Advisor CTA must not be a merchant link");
  }
}

async function readHtml(fetchImpl, path) {
  // All paths are source-defined constants; never request URLs derived from
  // visitor answers, page links, query strings or merchant destinations.
  const response = await fetchImpl(ORIGIN + path, {
    method: "GET", redirect: "manual", cache: "no-store",
    headers: { Accept: "text/html", "User-Agent": "ZaPrazi-readonly-smoke/1.1" },
    signal: AbortSignal.timeout(15000)
  });
  if (response.status !== 200) throw new Error(path + " returned HTTP " + response.status);
  if (!/text\/html/i.test(response.headers.get("content-type") || ""))
    throw new Error(path + " did not return HTML");
  const html = await response.text();
  if (html.length < 100 || html.length > 2500000)
    throw new Error(path + " returned an unexpected HTML size");
  return html;
}

export async function runSmoke(fetchImpl = fetch) {
  const homepage = await readHtml(fetchImpl, "/");
  assertHomepage(homepage);
  const mobility = await readHtml(fetchImpl, MOBILITY);
  assertMobility(mobility);
  return "PASS: homepage, Mobility article, exact Advisor CTA and destination anchor";
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  runSmoke().then(message => {
    console.log(message);
    console.log("Read-only HTML smoke only; NOT a Chrome, safety-gate, consent or merchant-conversion test.");
  }).catch(error => {
    console.error("PRODUCTION_AVAILABILITY_SMOKE_FAILED:", error.message);
    process.exitCode = 1;
  });
}
