# SEO: Senior málo pije — 27. 10. 2026

## Intent
Rodinné dotazy: senior málo pije, nechce pít, jak poznat dehydrataci, pitný režim seniora. V ČR existují kvalitní články NZIP; nízká konkurence a objem hledání zatím nejsou ověřeny. Diferenciace je praktická: red flags, 4 příčiny, 7 kroků, 8 kontrol a návaznosti na ADL a noční WC.

## Zdroje
- https://www.nzip.cz/clanek/2488-pitny-rezim-u-senioru
- https://www.nzip.cz/clanek/1281-demence-pecujici-prevence-dehydratace
- https://www.nzip.cz/clanek/344-vyziva-v-prubehu-zivota
- https://www.nhs.uk/conditions/dehydration/

## Safety
Žádná univerzální norma 2 l (lékařské omezení tekutin). Při poruše vědomí nepodávat pití ústy; při zakuckávání neimprovizovat s brčky a zahušťováním. Akutní příznaky 155. Žádná diagnóza, nevkládat zdravotní odpovědi do analytiky. Nejde o externě klinicky revidovaný obsah.

## Vydání
Nová template page-senior-malo-pije.php a WordPress slug /senior-malo-pije/, idempotentní založení pouze při absenci. Tři inbound odkazy: homepage, soběstačnost, noční WC; zpět vede na odpovídající poradce. Novou route uvádíme pouze jako staged do nezávislého live QA. Po zelené CI následný integrity release, produkční deploy z dev a skutečná kontrola sitemap/HTML/canonical.
