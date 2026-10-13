import test from "node:test";
import assert from "node:assert/strict";
import { inspectLegacyPost, summarizeLegacyContent } from "../scripts/lib/legacy-content-quality.mjs";
const post = (id, rendered) => ({
  id, link:"https://zaprazi.cz/post-" + id + "/", modified:"2024-03-14T09:16:17",
  content:{rendered}
});
test("detects embedded document wrappers, legacy CTA and thin text in REST HTML", () => {
  const p = inspectLegacyPost(post(8106,
    '<p>Úvodní popis</p><p><!DOCTYPE html><br><html><head></head><body>Text</body></html></p>' +
    '<p><!DOCTYPE html></p><a class="su-button" href="https://zaprazi.cz/fotovoltaika">Akce</a>'));
  assert.equal(p.id,8106);
  assert.equal(p.embedded_document,true);
  assert.equal(p.doc_markers.doctype,2);
  assert.equal(p.repeated_doctype,true);
  assert.equal(p.legacy_cta,true);
  assert.equal(p.thin,true);
});
test("text extraction ignores scripts/styles and supports Czech diacritics", () => {
  const r = inspectLegacyPost(post(5,'<script>tajné řetězce</script><style>x{}</style><p>Ověření pohodlné chůze.</p>'));
  assert.equal(r.words,3);
  assert.equal(r.embedded_document,false);
  assert.equal(r.legacy_cta,false);
});
test("truly empty post is distinguished from thin and unknown metadata", () => {
  const empty = inspectLegacyPost(post(7,' <p> &nbsp; </p> '));
  assert.equal(empty.words,0);
  assert.equal(empty.empty,true);
  assert.equal(empty.thin,false);
  assert.throws(() => inspectLegacyPost({id:1,link:"https://evil.example/a/",content:{rendered:"hi"}}));
});
test("only complete, duplicate-free runs produce corpus-wide numbers", () => {
  const a = inspectLegacyPost(post(1, "<p>Nějaký text</p>"));
  const b = inspectLegacyPost(post(2, "<p></p>"));
  assert.throws(() => summarizeLegacyContent([a],2,1),/Incomplete/);
  assert.throws(() => summarizeLegacyContent([a,a],2,1),/Duplicate/);
  const s=summarizeLegacyContent([a,b],2,1);
  assert.equal(s.zero_text,1);
  assert.equal(s.thin_under_120_words,1);
  assert.equal(s.inspected,2);
});
