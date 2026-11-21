import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const handoff = readFileSync(new URL('../PROJECT_STATE.md', import.meta.url), 'utf8');
const graph = JSON.parse(readFileSync(new URL('../config/growth-state.json', import.meta.url), 'utf8'));

test('PROJECT_STATE stays a short, actionable handoff rather than an append-only release history', () => {
  assert.ok(Buffer.byteLength(handoff, 'utf8') <= 7600,
    'PROJECT_STATE exceeds 7.6 kB; replace historical paragraphs with links to verified PRs/Actions');
  for (const heading of ['CÍL', 'HOTOVO', 'OVĚŘENO', 'BLOKACE', 'DALŠÍ PRIORITA']) {
    assert.match(handoff, new RegExp('^## ' + heading, 'm'));
  }
});

test('production acceptance in handoff matches the evidence-backed Growth Graph', () => {
  const verifiedRelease = graph.nodes.safety_qa?.verifiedRelease;
  assert.match(verifiedRelease ?? '', /^\d+\.\d+\.\d+$/);
  assert.match(handoff, new RegExp('Poslední přijaté produkční vydání \\*\\*' +
    verifiedRelease.replaceAll('.', '\\.') + '\\*\\*'));
  assert.match(handoff, /Git merge \/ synchronizace .*není WordPress deploy/);
});

test('handoff does not confuse configured affiliate slots with approved revenue', () => {
  assert.match(handoff, /25\/25 affiliate pozic/);
  assert.match(handoff, /UNKNOWN/);
  assert.match(handoff, /není důkaz nákupu ani provize/);
});
