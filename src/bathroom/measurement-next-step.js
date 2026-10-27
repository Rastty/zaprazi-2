// ZP_RELEASE_0_8_176
// A blocked fit answer must lead to useful measurement guidance, never to
// a merchant. All links are fixed public Zápraží destinations. No user
// answers, product identity, health information or analytics are transmitted.
const ANCHOR_BY_TOPIC=Object.freeze({
  toilet:"mereni-wc",
  shower:"mereni-sprcha",
  bath:"mereni-vana"
});
const MEASUREMENT_BLOCKERS=new Set([
  "loadFit", "toiletFit", "feetFlatAtRaisedHeight", "spaceFit",
  "supportFrameFit", "bathFit", "bathBenchFit"
]);

export function renderBathroomMeasurementNextStep(outcome,topic){
  if(outcome?.status!=="needs_more_info")return "";
  const anchor=ANCHOR_BY_TOPIC[topic];
  if(!anchor||!Array.isArray(outcome.missing)||
    !outcome.missing.some(field=>MEASUREMENT_BLOCKERS.has(field)))return "";

  return `<section class="zp-acquisition-summary zp-next-measurement" aria-label="Bezpečný další krok">
    <h3>Jak pokračovat, když chybí rozměr nebo ověření?</h3>
    <p>Připravte si podklady pro konkrétní výrobek. Pokud už víte, že pomůcka nepasuje nebo není bezpečná, nepotvrzujte její vhodnost. Samotné měření nenahrazuje posouzení přesunu.</p>
    <p><a class="zp-text-link" href="/co-zmerit-v-koupelne-pred-vyberem-pomucky/#${anchor}" target="_blank" rel="noopener noreferrer">Jak rozměry bezpečně ověřit (otevře se v nové kartě)</a></p>
    <p class="zp-muted-copy">Rozpracované odpovědi zůstanou v této kartě. Při návratu můžete pokračovat bez vyplňování od začátku.</p>
  </section>`;
}
