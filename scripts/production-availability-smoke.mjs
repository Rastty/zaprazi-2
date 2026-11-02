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

export function anchors(html) {
  return [...activeMarkup(html).matchAll(/<a\b[^>]*>/gi)].map(match => {
    const attrs = {};
    for (const item of match[0].matchAll(/\s([\w:-]+)\s*=\s*(["'])(.*?)\2/g))
      attrs[item[1].toLowerCase()] = item[3];
    return attrs;
  });
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
  if (!/\bid=["']poradce["']/i.test(markup) || !/\bid=["']zp-mobility-advisor["']/i.test(markup))
    throw new Error("Homepage Mobility Advisor anchor/form missing");
  if (!anchors(markup).some(a => safeInternalLink(a.href, "/", MOBILITY)))
    throw new Error("Homepage Mobility article link missing");
}

export function assertMobility(html) {
  const markup = activeMarkup(html);
  if (!/<h1\b[^>]*>\s*Chodítka pro seniory/i.test(markup))
    throw new Error("Mobility article heading missing");
  const ctas = anchors(markup).filter(a => a["data-zp-journey"] === "advisor");
  if (ctas.length !== 1)
    throw new Error("Expected one explicit editorial-to-Advisor CTA");
  const cta = ctas[0];
  if (!safeInternalLink(cta.href, MOBILITY, "/", "#poradce"))
    throw new Error("Editorial CTA does not point to the safe Mobility Advisor anchor");
  if (cta["data-zp-merchant-link"] !== undefined || /\bsponsored\b/i.test(cta.rel || ""))
    throw new Error("Editorial Advisor CTA must not be a merchant link");
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
