# Zápraží 2.0 — audit obsahu historického WordPress archivu

**Datum a zdroj:** 13. 10. 2026, 11:04:47 UTC · GitHub Actions [Legacy Article Quality Audit #38387597061](https://github.com/Rastty/zaprazi-2/actions/runs/38387597061). Čteno výhradně z veřejného WP REST API, `status=publish`, 44 stránek po 100 záznamech. Počet 4 360 / 4 360 potvrzen metadaty `X-WP-Total` a kontrolou duplicitních ID. Bez WordPress zápisů.

## Skutečný rozsah

| Signál v post_content.rendered | Počet | Podíl |
|---|---:|---:|
| Projité publikované příspěvky | 4 360 | 100 % |
| Vložené `DOCTYPE` nebo `html/head/body` značky | 4 037 | 92,6 % |
| `DOCTYPE` opakovaný vícekrát | 3 276 | 75,1 % |
| Starý `su-button` nebo fotovoltaický CTA odkaz | 4 266 | 97,8 % |
| Přepočítaný obsah bez textu | 0 | 0 % |
| Přepočítaný obsah kratší než 120 slov | 0 | 0 % |

Počty se překrývají. Všech 4 360 postů má alespoň 120 slov v automaticky očištěném HTML; **to není důkaz užitečnosti nebo správnosti textu**. Stejně tak samotný výskyt CTA nedokazuje nefunkční odkaz a detekce HTML značky nedokazuje přímou ztrátu indexace.

### Ověřené příklady
- Post **8106** `/solarni-panely-a-jejich-prinos-pro-ekologickou-dopravu/`: REST obsahuje více vložených kompletních HTML dokumentů, hlaviček a staré tlačítko `Fotovoltaika v AKCI`.
- Post **8105** `/solarni-panely-v-praxi-inspirace-pro-zemedelce/`: obdobné vložené dokumenty a reklamní prvky.
- Post **6801** `/efektivni-solarni-system-minimalizace-ztrat-prenosu/`: heuristika naměřila **4 doctype**; vhodný kandidát k vizuální a redakční kontrole.

## Doporučené provedení v pořadí

**P0 — uchovat SEO hodnotu a ověřit realitu.** Získat GSC za 28/90 dnů po URL/dotazu a případně znalost externích odkazů před destruktivními změnami. Žádný plošný noindex, mazání nebo redirect na homepage bez dokladů; historické články jsou obsahově hlavně o solárech a čerpadlech, tedy jiné téma než nový ADL/mobility projekt.

**P1 — hromadná *pouze zobrazovací* náprava nekorektní dokumentové struktury.** Připravit čistě reverzibilní transformaci až po simulaci (dry run) na reálných HTML tělech: porovnat počet a cíle `href`, `src`, viditelný text, id kotvy. Zpracovat canary a browser screenshot / HTML QA. Nepřepisovat `post_content` v databázi, na začátku neměnit komerční cíle. Chybějící důkazy → ponechat původní výstup.

**P2 — obsahová revize podle dat.** Obsolete reklamní bloky vyhodnocovat odděleně podle aktuálních cílových HTTP statusů a affiliate evidence. První zásahy na URL se skutečným GSC dopadem; nekopírovat staré solární texty do nové domácí poradenské niche.

## Reprodukovatelnost

```bash
node --test tests/legacy-content-quality.test.js
node scripts/audit-live-legacy-content.mjs
```

Tento audit pouze klasifikuje, **nepublikuje** žádné změny. `scripts/audit-live-legacy-content.mjs --pages=2` je částečná diagnostika a nezobrazuje neúplné počty jako finální. Skutečné výsledky jsou z plného scan workflow #38387597061.

Pozn.: Nemáme doloženou výkonnost v Google Search Console, skutečnou návštěvnost ani kontrolu všech externích odkazů. **Nelze přisuzovat historickému HTML naměřenou SEO penalizaci.**
