# Zápraží 0.8.141 — samostatný průvodce šířkou dveří pro invalidní vozík

**Záměr:** otázka „Projde invalidní vozík dveřmi?“ není zaměnitelná s celkovým výběrem vozíku ani úhradou. Nová stránka se šesti praktickými kroky řeší fyzické měření, chyby v katalogových údajích, kliky, prahy, zatáčení a nutnost individuální kontroly. Zpět vede k poradci vozíku, bezpečnému bytu a výběru způsobu pořízení.

**Metodický zdroj:** U.S. Access Board, https://www.access-board.gov/ada/guides/chapter-4-entrances-doors-and-gates/ (ověřeno 16. 10. 2026). Zdrojem je metoda měření volného průchodu a manévrování, nikoliv česká právní norma nebo univerzální práh.

**Rozhodovací bezpečnost:** pouze aritmetika volný otvor mínus celková šířka přesného vozíku. Při rozdílu 0 či menším je geometrický průchod nemožný; při kladném rozdílu výsledek nepovoluje ani neslibuje bezpečný průjezd. Boční rezerva, roh, dveře, brzdy, schopnosti, práh a bezpečný přesun stále vyžadují ověření. Formulář je dobrovolný a lokální, bez ukládání údajů, osobních profilů, odesílání, obchodníka a měření health-related odpovědí.

**SEO:** vlastní unikátní URL, H1, title, description, bezpečné Yoast fallback, přímé interní odkazy z vozíku a bezpečného bytu, konzistentní aktualizace sitemapy. Novou stránku vytvoří WordPress nedestruktivním init záznamem, ale NIKDY nepřepíše existující kolizní URL. Žádný obsah starého archivu se nemění.

**Data:** skutečná GSC indexace a query volume zatím neznámá. Volba tématu vychází z konkrétního uživatelského problému; nepředstíráme garantovaný search traffic. Soukromý GA4 export uživatele zůstává pouze v chatu a není nahrán do veřejného GitHubu.

**QA:** 6 kontrol, žádné falešné doporučení při kladném rozdílu, fail-closed při nevalidním vstupu, starý výsledek zneplatněný při editaci, integrita 73 souborů, browser-SEO kontrola nyní 28 kritických URL včetně nové stránky, všech 14 poradců po nasazení, 25 affiliate pozic beze změny.
