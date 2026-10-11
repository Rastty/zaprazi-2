import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const command = "scripts/audit-legacy-seo.mjs";

test("legacy audit reads original 4,367 URL snapshot without changing it", () => {
  const data = JSON.parse(execFileSync(process.execPath, [command], {
    cwd: new URL("..", import.meta.url).pathname, encoding: "utf8"
  }));
  assert.equal(data.published_posts, 4360);
  assert.equal(data.published_pages_in_snapshot, 7);
  assert.equal(data.unique_urls, 4367);
  assert.equal(data.keyword_counts_may_overlap.direct_walking_aids, 0);
  assert.equal(data.keyword_counts_may_overlap.adjustable_beds, 0);
  assert.equal(data.keyword_counts_may_overlap.senior_direct, 1);
  assert.equal(data.keyword_counts_may_overlap.solar_term, 1055);
  assert.equal(data.keyword_counts_may_overlap.pump_term, 772);
  assert.equal(data.keyword_counts_may_overlap.office_term, 315);
  assert.match(data.guardrail, /Do not redirect, noindex, merge or delete/);
  assert.match(data.scope, /no article body, rankings, traffic or backlinks/);
  // Title/slug candidates are REVIEW labels only; no action URL or directive.
  assert.equal(data.review_candidates_only.senior_direct[0].id, 3638);
});

test("legacy audit refuses malformed or duplicate records; handles escaped CSV titles", () => {
  const dir = mkdtempSync(join(tmpdir(), "zp-legacy-"));
  const file = join(dir, "sample.csv");
  const head = '"type","id","status","url","slug","title","modified","category_ids"\n';
  const a = '"post","1","publish","https://zaprazi.cz/test/","test","Zápraží: ""slovo"", nový řádek\nPokračování","2023-05-01","9"\n';
  try {
    writeFileSync(file, head + a);
    let result = JSON.parse(execFileSync(process.execPath, [command, file], {
      cwd: new URL("..", import.meta.url).pathname, encoding: "utf8"
    }));
    assert.equal(result.published_posts, 1);
    assert.equal(result.unique_urls, 1);
    writeFileSync(file, head + a + a);
    result = spawnSync(process.execPath, [command, file], {
      cwd: new URL("..", import.meta.url).pathname, encoding: "utf8"
    });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /duplicate canonical URL/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
