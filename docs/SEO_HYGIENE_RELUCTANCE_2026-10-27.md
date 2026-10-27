# SEO Zápraží — Senior odmítá koupání nebo sprchování

27. 10. 2026. Navazuje na živě ověřené vydání 0.8.173. Redakční přístup: pomoc člověku a jeho rodině před produktem.

## Problémový vyhledávací záměr
„senior nechce do sprchy“, „senior odmítá koupání“, „jak umýt seniora který nechce“, „starší člověk se bojí sprchovat“. Nemáme dosud doložená data hledanosti, nízké konkurence ani návštěvnosti z GSC — nevydávat kvalifikaci low-competition za ověřený fakt.

## Obsahové odlišení
Oproti obecnému textu o demenci rozlišuje stud, teplotní a senzorické nepohodlí, obavu z pádu a nejasnou zdravotní příčinu. Dává konkrétní, ale nemanipulativní věty pro rozhovor, sedm kroků, osm kontrol, bezpečné alternativy plné sprchy, šest FAQ. Zobrazuje bez diagnózy a bez sběru osobních údajů. Nákup až po bezpečném posouzení přesunu.

## Ověřené prameny
- NZIP https://www.nzip.cz/clanek/1285-demence-pecujici-osobni-hygiena
- NHS https://www.nhs.uk/conditions/dementia/living-with-dementia/looking-after-someone/
- Alzheimer's Society https://www.alzheimers.org.uk/get-support/living-with-dementia/washing-bathing-showering-tips
- NIA https://www.nia.nih.gov/health/alzheimers-caregiving/bathing-dressing-and-grooming-alzheimers-caregiving-tips

Rady nelze zaměnit za diagnózu ani odborné posouzení přesunu. Individuální četnost hygieny nepreskriptivně; kůže a inkontinence vyžadují odbornou péči při obtížích.

## Integrace
Nová page šablona, idempotentní vytvoření slug bez přepisu existujících WP stránek, Yoast SEO meta title/description + fallback, staged sitemap, tři příchozí redakční odkazy (homepage, koupelna, hygiena na lůžku), konverze pouze do příslušných poradců. Nový originální obrázek není potřeba; využití stávající vlastní domácí ilustrace.
Testy: struktura, bezpečnost, odkazy, WordPress registrace, stávající integrita a počítadla.

## Další gate
Po zelených CI teprve plný release se sjednocením chráněného souborového manifestu a verze. Po WordPress deploy nezávislé read-only ověření live URL, sitemap, HTML/meta, 3 inbound a bezpečného obsahu.
