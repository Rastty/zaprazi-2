# Zápraží — SEO problémový průvodce: ponožky a kalhoty bez předklonu

Datum: 26. října 2026. Cílový slug: /oblekani-ponozek-a-kalhot-bez-ohybani/.
Stav: staged PR; nepovažovat za produkčně publikovaný bez kompletního release.

## Záměr, ne duplicitní katalog

Řešíme jinou otázku než /obuv-pro-seniory/ (výběr vhodné boty) a /sobestacnost/ (pití, otevírání, jídlo).
Základ: praktická situace -> rozhodnutí o bezpečnosti -> typ pomůcky či služby -> checklist/nácvik -> odkaz na existující příbuzný poradce.
Bez odhadování medicínské indikace a bez prodejních odkazů na konkrétní neověřený výrobek.

## Reálná SERP konkurence, kvalitativně

- Nartis.cz má komerční stránku navlékače i vlastní návod (s detailními fotkami): https://www.nartis.cz/pomucka-pro-snadne-navlekani-ponozek/ a https://www.nartis.cz/blog/navlekac-ponozek-oblekani-bez-ohybani/.
- Rehabilitaceplus.cz má přehled pomůcek sebeobsluhy: https://www.rehabilitaceplus.cz/pomucky-pro-sebeobsluhu/.
- CZ e-shopy nabízejí samostatné navlékače i podavače, často řeší jen parametry produktu.
- Český nemocniční zdroj AGEL Prostějov obsahuje osobně relevantní pomůcky na ponožky a kalhoty, ale je určen pacientům po TEP kyčle; staré ceny a údaje o úhradě nepřebírat.

Diferenciace Zápraží: řešíme *ponožky vs. kalhoty vs. boty vs. kompresi*, rozlišujeme neschopnost dosáhnout vs. slabý úchop vs. nestabilní postoj a hlavně nebezpečné pooperační možnosti. Bez falešných univerzálních pravidel 90 stupňů.

**Kvantitativní hledanost, keyword difficulty, GSC impressions/clicks, návštěvnost ani prodejní konverze nejsou ověřené.** Nejde o garanci nízké konkurence, rychlé indexace ani příjmů. Nartis je konkrétní konkurent pro primární slova, takže se odlišujeme složitějším problémovým intentem a rozhodovacím postupem.

## Klíčová témata/dotazy

- jak si obléct ponožky bez ohýbání, navlékač ponožek jak použít
- jak natáhnout kalhoty po operaci kyčle, oblékání kalhot bez předklonu
- pomůcky na oblékání po operaci kyčle, podavač předmětů kalhoty
- navlékač ponožek pro seniory; navlékač kompresních punčoch rozdíl
- co dělat když senior neobuje ponožky

## Zdroje a bezpečnost (ověřeno 2026-10-26)

- Český nemocniční edukativní materiál: https://nemocniceprostejov.agel.cz/pracoviste/oddeleni/lecebne-rehabilitace/informace-pro-pacienty/edukacni-materialy/totalni-endoproteza/kompenzacni-pomucky-do-domaciho-prostredi-po-total.endoproteze-kyc.a-kol.kloubu.pdf
- Cambridge University Hospitals: https://www.cuh.nhs.uk/patient-information/total-hip-replacement/
- Guy's and St Thomas' (individual care plans): https://www.guysandstthomas.nhs.uk/health-information/precautions-after-hip-surgery
- North Bristol NHS Trust: https://www.nbt.nhs.uk/our-services/a-z-services/orthopaedic-planned-elective/orthopaedic-planned-patient-information-leaflets/preparation-your-short-stay-hip-replacement

Zdravotní a pooperační omezení jsou osobní, žádné obecné 90° pravidlo jako univerzální „musíte“. Při nestabilitě zastavit a vyžádat pomoc. Žádné zdravotní údaje v URL nebo analytice. Žádný „univerzálně vhodný“ běžný navlékač na lékařskou kompresi; výběr a postup podléhají výrobkovému návodu a odbornému doporučení.

## Technické dodání a ochrany

- Nová PHP šablona se stávajícími kartami, kroky, FAQ a dostupnými kotvami.
- Auto-create pouze pro neexistující slug, bez přepsání stávajících WP pages/posts.
- Unikátní SEO title / Yoast description, single fallback bez Yoast, canonical přes stávající WP SEO.
- 4 kontextové vstupy: soběstačnost, obuv, návrat z nemocnice a předpropouštěcí otázky.
- URL pouze v staged sitemap před deployem; po ověření živé 200 do required inventory.
- Chráněná šablona s markerem stávající 0.8.168; nová produkční verze musí synchronizovat všech 90 runtime markerů, PHP a CSS version.
- Tests: decisions, safer stop points, 4/5 kroků, 7 kontrol, FAQ, externí zdroje, příbuzné CTA, souhlasný protected inventory/test + exact page template inventory.

## Součást PR: produkční ověření starší vydané 0.8.168

První samostatný `.github/workflows/hair-washing-168-postdeploy.yml` spustí **read-only** `scripts/audit-live-bed-hair-washing-168.mjs` proti veřejnému WordPressu. Tento gate musí ověřit především skutečné `release=0.8.168`, `integrity=ok`, 25/25 affiliate slotů (ne objednávky), novou stránku a 3 inbound odkazy s Yoast sitemap.

## Další krok po tomto PR

Nejdříve vyhodnotit live 0.8.168 a Node CI. Poté release 0.8.169; synchronizace `main=dev`; správce WordPressu provede Pull + Deploy. Po vydání zkontrolovat /oblekani-ponozek-a-kalhot-bez-ohybani/ a GSC 28/56 dní. Nekanonizovat/značkovat novou URL jako required před reálným nasazením.
