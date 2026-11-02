#!/usr/bin/env node
// Read-only production availability probe. No form submission, cookies, analytics,
// product outbound clicks, sensitive answers or destructive actions.
const base = new URL(process.env.ZAPRAZI_SMOKE_ORIGIN || "https://zaprazi.cz/");
if (base.protocol !== "https:" || base.username || base.password || base.search || base.hash ||
    base.pathname !== "/" || !["zaprazi.cz", "www.zaprazi.cz"].includes(base.hostname)) {
  throw new Error("Only the public Zápraží HTTPS homepage is allowed");
}
async function fetchPublic(path) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(new URL(path, base), {
      redirect: "manual", cache: "no-store", signal: controller.signal,
      headers: { "User-Agent": "ZaPrazi-readonly-smoke/1.0" }
    });
    // Never follow redirects to unknown hosts, signed merchant destinations or private resources.
    if (response.status >= 300 && response.status < 400)
      throw new Error(path + ": unexpected redirect " + response.status);
    if (!response.ok) throw new Error(path + ": HTTP " + response.status);
    return { response, body: await response.text() };
  } finally { clearTimeout(timeout); }
}
const {response,body} = await fetchPublic("/");
if (!/text\/html/i.test(response.headers.get("content-type") || ""))
  throw new Error("Homepage did not return HTML");
for (const expected of ["Bezpečně a samostatně doma", "Domácí poradce"]) {
  if (!body.includes(expected)) throw new Error("Missing core homepage section: " + expected);
}
const hrefs = [...body.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["']/gi)].map(m => m[1]);
const local = hrefs.filter(h => h.startsWith("/") && !h.startsWith("//"));
if (local.length < 3) throw new Error("Unexpectedly few internal navigation links");
// Do not request URLs that might represent questionnaire answers or personal identifiers.
for (const href of local) {
  const u = new URL(href, base);
  if (u.origin !== base.origin) throw new Error("Unexpected navigation origin");
}
// Critical Mobility entry must remain reachable and lead toward a safe Advisor.
// This only checks static HTML: it never submits the questionnaire.
const mobilityPath = "/choditka-pro-seniory/";
if (!hrefs.some(h => {
  try { const u = new URL(h,base); return u.origin === base.origin && u.pathname === mobilityPath; }
  catch { return false; }
})) throw new Error("Homepage lacks Mobility landing link");
const mobility = await fetchPublic(mobilityPath);
if (!/text\\/html/i.test(mobility.response.headers.get("content-type") || ""))
  throw new Error("Mobility landing did not return HTML");
if (!mobility.body.includes("Chodítka pro seniory"))
  throw new Error("Mobility landing content missing");
if (!/Spustit celý poradce|Začít poradcem|Poradce pro chůzi/i.test(mobility.body) || !/href=["\x27][^"\x27]*#/i.test(mobility.body))
  throw new Error("Mobility landing lacks Advisor anchor link");
console.log("PASS homepage HTTP 200, core content, internal navigation (" + local.length + " links); Mobility landing and Advisor handoff.");
console.log("Read-only availability probe only; NOT a Chrome functional, accessibility or safety-gate certification.");
