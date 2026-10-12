import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");

test("reported 0.8.114 deploy cannot pass on earlier production release",()=>{
 const smoke=read("tests/production-advisor-smoke.mjs");
 const css=read("style.css");
 assert.match(css,/^Version:\s*0\.8\.\d+\s*$/m);
 assert.match(smoke,/if \(sourceRelease === "0\.8\.114"\) \{/);
 assert.match(smoke,/0\.8\.114 reported deployed but the live WordPress release differs/);
 assert.match(smoke,/assert\.equal\(readiness\.release, sourceRelease,/);
 assert.match(smoke,/assert\.equal\(readiness\.integrity, "ok"/);
 assert.match(smoke,/assert\.equal\(readiness\.configured_total, readiness\.slot_total/);
 assert.match(smoke,/releaseAtLeast\("0\.8\.114"\)/);
});

