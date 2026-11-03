import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const workflow=readFileSync(new URL("../.github/workflows/live-internal-link-health.yml",import.meta.url),"utf8");

test("live internal link QA runs unattended once daily with read-only permission",()=>{
 assert.match(workflow,/^  schedule:\\s*$/m);
 assert.match(workflow,/- cron: ["']41 3 \\* \\* \\*["']/);
 assert.match(workflow,/permissions:\\s*\\n  contents: read/);
 assert.match(workflow,/persist-credentials: false/);
 assert.match(workflow,/node scripts\\/audit-live-internal-links\\.mjs/);
 assert.match(workflow,/workflow_dispatch:/);
 assert.doesNotMatch(workflow,/secrets\\.|wp-admin|\\bgit push\\b/);
});
