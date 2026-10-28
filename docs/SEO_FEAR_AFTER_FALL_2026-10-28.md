# Zápraží — Strach z chůze po pádu seniora (2026-10-28)

Rozšíření existujícího URL `/senior-spadl-doma/` o rozhodovací část `#strach-z-chuze-po-padu`. Žádný druhý engine, nová page nebo publikační závislost. Intent je konkrétní otázka rodiny, nikoliv kvantitativně doložená hledanost. GSC impressions/clicks zatím UNKNOWN. Nevytvářet duplicitní thin URL.

## Obsah / bezpečnost
Akutní zdravotní stav předchází všemu. Rozlišujeme novou bolest či poruchu mobility (ne cvičit), oprávněnou obavu po vyřešeném pádu (odborné individuální posouzení) a konkrétní riziko prostředí (neproduktová domácí opatření). Nepředepisujeme počet kroků ani univerzální cvičení; nenutíme seniora k pohybu a nezaměňujeme chodítko za léčbu. Žádné další vstupy, uchovávání údajů či provize. Interní kontext z homepage, bezpečného bytu a odmítání chodítka; zpět do mobility a dalších vhodných zdrojů.

## Odborný podklad
NICE NG249, 29. 4. 2025: https://www.nice.org.uk/guidance/ng249/chapter/recommendations — posouzení a prevence pádů, odborně vedený individualizovaný program, sdílené rozhodování a případná psychologická intervence při přetrvávající obavě. NHS Falls: https://www.nhs.uk/conditions/falls/ a Opora Diakonie: https://oporadiakonie.cz/rada/jak-predchazet-padum-u-senioru-prevence-a-privolani-pomoci-po-padu/. Kontrola 28. 10. 2026, bez doložené externí odborné revize. Žádná garantovaná SEO pozice ani provize.

## QA
`node --test tests/fear-of-falling-after-fall.test.js` a kompletní CI. Nasazení přes main=dev / Deployer for Git, poté kontrola anchoru, čitelných kroků, každého interního odkazu a existujících poradců.
