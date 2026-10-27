# Zápraží SEO — Senior odmítá chodítko
27. 10. 2026 · navazuje na SOS release 0.8.172.

## Záměr
Primární problém: rodina chce pomoci člověku, který pomůcku nechce používat; nejde o katalog.
Pracovní intent: „senior nechce chodítko“, „senior odmítá chodítko“, „jak přesvědčit seniora používat chodítko“.
**Objem hledání ani slabá konkurence nejsou doloženy měřením**; ověřit v GSC po zaindexování a upravit.
Existuje částečně příbuzný článek iZDRAV.cz; odlišnost Zápraží: praktický rozhovor, čtyři důvody, 7 konkrétních kroků, bezpečný výběr bez manipulace.

## Editorial a bezpečnost
Nepředepisovat pomůcku ani chůzi; vždy odlišit akutní zhoršení / pády od běžné preference. Rodina nesmí nutit do nácviku, přesunů a schodů bez odborného vedení.
Vhodnost, správnou výšku, typ, brzdy a nácvik má individuálně ověřit fyzioterapeut/ergoterapeut. Studie o stigmatu jsou observační/kvalitativní a neprokazují konkrétní míru účinnosti doporučených vět.
Zdroje: https://pubmed.ncbi.nlm.nih.gov/17646215/ ; https://pmc.ncbi.nlm.nih.gov/articles/PMC2768139/ ; https://www.nhsinform.scot/healthy-living/preventing-falls/keeping-well/moving-around-safely-to-help-prevent-falls/ ; https://www.healthnz.govt.nz/health-topics/tests-and-treatments/home-equipment/walking-frames

## Integrace
- nový WP PHP template a idempotentní založení stránky, žádné přepisování existujícího obsahu
- redakční CTA bez affiliate a podmíněné pokračování na existující poradce
- nové interní odkazy: homepage + výběr chodítek + článek po pádu
- nové id anchor targety a 6 FAQ, textově přístupná ilustrace již použitá na homepage
- staged sitemap až do úspěšného production deployment acceptance
- testy: bezpečnost, struktura, SEO metadata, non-overwrite a cesty

## Vydání
Toto je editorial PR navazující na 0.8.172; teprve release PR zvýší integritu všech runtime souborů na další verzi.
Následně Deployer for Git → Pull → Deploy z dev a nezávislé live SEO acceptance.
