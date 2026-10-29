import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { liveVerifiedProblemPaths } from "../scripts/lib/live-verified-problem-paths.mjs";
import { requiredDecisionPaths } from "../scripts/audit-public-sitemap.mjs";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const hubPaths=["page-kompenzacni-pomucky-pro-seniory.php","page-navrat-z-nemocnice.php","page-bezpecny-byt-pro-seniora.php"];
test("three topical hubs lead to published practical problem guides",()=>{
  for(const p of hubPaths){
    const html=read(p);
    assert.match(html,/zp-section-soft/);
    assert.ok(html.includes("/senior-odmita-choditko/#"),p);
    assert.ok(html.includes("/senior-odmita-koupani/#"),p);
    assert.ok(html.includes("/senior-malo-pije/#"),p);
    const start=html.indexOf('id="'+(p.includes("kompenzacni")?"kdy-pomucka-neni-prvni-krok":p.includes("navrat")?"navrat-domu-dalsi-problemy":"bezpecny-byt-kdyz-pomoc-nefunguje")+'"');
    assert.ok(start>=0,p+" section missing");
    const end=html.indexOf("</section>",start),region=html.slice(start,end);
    assert.ok(region.includes("zp-decision-card"),p);
    assert.doesNotMatch(region,/data-zp-merchant-link|data-zp-affiliate-target|awin1\.com|click\.php/);
  }
});
test("verified guides are required after deploy and live audits de-duplicate them",()=>{
 assert.equal(new Set(liveVerifiedProblemPaths).size,liveVerifiedProblemPaths.length);
 assert.ok(liveVerifiedProblemPaths.length >= 4);
 for(const path of liveVerifiedProblemPaths)assert.ok(requiredDecisionPaths.includes(path),"missing deployed guide "+path);
 const seo=read("scripts/audit-live-editorial-seo.mjs");
 const links=read("scripts/audit-live-internal-links.mjs");
 assert.ok(seo.includes("...liveVerifiedProblemPaths"));
 assert.ok(seo.includes("new Set("), "SEO audit must de-duplicate overlapping required routes");
 assert.ok(links.includes("...liveVerifiedProblemPaths"));
 assert.ok(links.includes("new Set("), "Link audit must de-duplicate overlapping required routes");
});
