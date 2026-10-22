# Zápraží — vyhledávání madla do sprchy či vany

22. října 2026 · release 0.8.148

## Produkční zjištění

Na webu 0.8.147 vedlo vyhledávání `madlo do vany` na specializovaný výběr **sedátka do vany**, a analogicky `madlo do sprchy` na **sprchovací židli**. Tyto pomůcky nejsou funkčně zaměnitelné. Představuje to zavádějící interní navigaci, nikoli potvrzené medicínské doporučení.

## Oprava

Pokud dotaz obsahuje oporu/madlo/držadlo a konkrétní místo (vana či sprcha), ale nikoli přímou žádost o židli/sedátko, nabízí se pouze obecný poradce pro koupelnu a související měřicí a instalační kontrola daného místa. Ověření skutečné nosnosti podkladu, montáže a bezpečného přesunu nelze nahradit rozměry ani online doporučením. Není zde přímé obchodní CTA.

Dotazy `sprchovací židle s madly`, `sedátko do vany s madly`, `madlo k WC` či `toaletní židle` si ponechávají zamýšlené cesty do existujících odborně omezených poradců. Neznámé pojmy nedostávají vymyšlený produkt.

## Akceptace

PHP testy zajišťují pořadí odkazů, rozlišení místa a absenci nesouvisejícího specializovaného produktu. CI lint + archivní fidelity. Po deployi vizuálně ověřit obě cesty, 14 poradců, release integrity a 25/25 affiliate konfigurací. Změna nevytváří nový obsah, nemaže historické články, nemění produktová fakta či monetizační pravidla.
