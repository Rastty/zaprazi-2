import test from 'node:test';
import assert from 'node:assert/strict';
import { assertLiveWalkerWeightProvenance } from '../scripts/lib/live-walker-weight-provenance.mjs';

const prefix='<main><section id="poradce-choditko-byt"></section><a href="#zp-pruchod-choditko-byt">Průchod</a>';
const note='<p data-zp-besco-weight-sources="WA17,WA21"><strong>Odkud pochází hmotnost chodítek:</strong> U WA17 uvádí návod BESCO 2,3 kg, u WA21 2,8 kg. Obchod má v obecném poli hodnoty 2,2 a 2,7 kg; ověřte si konkrétní provedení před pořízením. <a href="https://www.rehabilitacnipomucky.cz/user/related_files/besco_skladaci_choditko_ctyrbodove.pdf" target="_blank" rel="noopener noreferrer">Návod WA17</a> a <a href="https://www.rehabilitacnipomucky.cz/user/related_files/besco_skladaci_choditko_dvoukolove.pdf" target="_blank" rel="noopener noreferrer">Návod WA21</a>. Podklady porovnány 3. 11. 2026.</p>';
const page=prefix+note+'</main>';

test('exact visible public source note keeps both weights, independent manuals and safe exits',()=>{
 assert.equal(assertLiveWalkerWeightProvenance(page).wa17_manual,true);
});
test('cannot satisfy acceptance via commented-out or templated text',()=>{
 for(const candidate of ['<!--'+note+'-->','<template>'+note+'</template>','<script>'+note+'</script>'])
   assert.throws(()=>assertLiveWalkerWeightProvenance(prefix+candidate+'</main>'),/exactly one/);
});
test('missing or changed manual URLs, duplicate links, unsafe target and merchant routes fail closed',()=>{
 for(const replacement of [
   note.replace('ctyrbodove.pdf','ctyrbodove-v2.pdf'),
   note.replace('target="_blank"','target="_self"'),
   note.replace('noopener noreferrer','noopener'),
   note.replace('</p>','<a href="https://shop.example">Nákup</a></p>'),
   note.replace('</p>','<a data-zp-merchant-link href="#">Koupit</a></p>')
 ]) assert.throws(()=>assertLiveWalkerWeightProvenance(prefix+replacement+'</main>'));
});
test('false weights, missing verification caveat and removed fit path fail closed',()=>{
 for(const replacement of [
   note.replace('WA17 uvádí návod BESCO 2,3 kg','WA17 uvádí návod BESCO 3,3 kg'),
   note.replace('ověřte si konkrétní provedení před pořízením',''),
   note.replace('3. 11. 2026','5. 11. 2026')
 ]) assert.throws(()=>assertLiveWalkerWeightProvenance(prefix+replacement+'</main>'));
 assert.throws(()=>assertLiveWalkerWeightProvenance(prefix.replace('href="#zp-pruchod-choditko-byt"','href="#wrong"')+note+'</main>'));
});
