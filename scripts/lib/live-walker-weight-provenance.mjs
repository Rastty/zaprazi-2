/**
 * Read-only verification of the BESCO weight provenance rendered on the
 * public indoor-walker comparison. No merchant requests or user answers.
 */
import assert from 'node:assert/strict';

const manuals = Object.freeze({
  WA17: 'https://www.rehabilitacnipomucky.cz/user/related_files/besco_skladaci_choditko_ctyrbodove.pdf',
  WA21: 'https://www.rehabilitacnipomucky.cz/user/related_files/besco_skladaci_choditko_dvoukolove.pdf'
});
function attribute(tag, name) {
  return [...String(tag).matchAll(/\s([\w-]+)\s*=\s*(["'])(.*?)\2/gi)]
    .find(match => match[1].toLowerCase() === name)?.[3] ?? null;
}
function visibleText(html) {
  return html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;|&#160;/gi, ' ').replace(/\s+/g, ' ').trim();
}
export function assertLiveWalkerWeightProvenance(html) {
  const clean = String(html)
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style|template)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '');
  const paragraphs = [...clean.matchAll(/<p\b[^>]*>[\s\S]*?<\/p\s*>/gi)];
  const notes = paragraphs.filter(match =>
    attribute(match[0].slice(0,match[0].indexOf('>')+1),'data-zp-besco-weight-sources') === 'WA17,WA21');
  assert.equal(notes.length, 1, 'Expected exactly one visible WA17/WA21 source note');
  const note = notes[0][0];
  const text = visibleText(note);
  for (const phrase of [
    'Odkud pochází hmotnost chodítek',
    '2,3 kg', '2,8 kg', '2,2 a 2,7 kg',
    'ověřte si konkrétní provedení před pořízením',
    'Podklady porovnány 3. 11. 2026'
  ]) assert.ok(text.includes(phrase), 'Missing source fact or caveat: '+phrase);
  assert.match(text, /WA17[^.]{0,100}2,3 kg/u, 'WA17 manual weight lost');
  assert.match(text, /WA21[^.]{0,100}2,8 kg/u, 'WA21 manual weight lost');
  const links = [...note.matchAll(/<a\b[^>]*>/gi)].map(match => match[0]);
  assert.equal(links.length, 2, 'Weight source note must link to exactly two manufacturer manuals');
  for (const [sku, url] of Object.entries(manuals)) {
    const matching = links.filter(tag => attribute(tag, 'href') === url);
    assert.equal(matching.length, 1, 'Missing or duplicated exact '+sku+' manual');
    assert.equal(attribute(matching[0], 'target'), '_blank', 'Manual must open outside Advisor');
    const rel = (attribute(matching[0], 'rel') || '').split(/\s+/);
    assert.ok(rel.includes('noopener') && rel.includes('noreferrer'), 'External PDF requires noopener noreferrer');
  }
  assert.doesNotMatch(note, /data-zp-merchant-link|data-zp-affiliate-target|data-zp-offer|<form\b|\bon(?:click|load)\s*=|gtag\(|localStorage|sessionStorage/iu,
    'Source note must not contain purchase action, visitor data, or tracking');
  assert.ok(clean.includes('id="poradce-choditko-byt"'), 'Existing safe Advisor entry missing');
  assert.ok(clean.includes('href="#zp-pruchod-choditko-byt"'), 'Doorway fit warning is not linked');
  return { path: '/choditko-do-bytu-pro-seniory/', wa17_manual: true, wa21_manual: true,
    caveat: true, source_checked: '2026-11-03', merchant_clicks: 0 };
}
