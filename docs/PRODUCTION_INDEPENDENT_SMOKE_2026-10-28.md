# Zápraží — nezávislá produkční kontrola 0.8.182+

**Důvod:** WPVibe Free má denní limit, proto po nasazení nebylo možné ověřit všechny produkční důkazy. Zápraží musí umět ověřovat samo, bez požadavků na další ruční potvrzování.

Přidán read-only GitHub Actions běh 4x denně, na změnu workflow a skriptu i manuálním workflow_dispatch. Pouze bezpečné veřejné HTTPS GET na `zaprazi.cz`, žádná WordPress autorizace, zápisy, affiliate odkliky nebo individuální zdravotní parametry.

**Kontroluje:** veřejný endpoint `/wp-json/zaprazi/v1/affiliate-readiness`: verze, integrita a 25/25 nakonfigurovaných affiliate slotů. Porovná verzi aktivního webu s `style.css` v main. Pokud produkce stále čeká na deploy nového releasu, uvádí `pending_deploy` a nespouští zavádějící nové kontrolní scénáře. Při shodě verze ověřuje 3 důležité textové sekce a 3 konkrétní bezpečné interní vyhledávací cesty, navíc negativní kontrolu historického výrazu `fotovoltaika`.

Zapisuje kompaktní JSON `ZP_PRODUCTION_ACCEPTANCE` do veřejných logů GitHub Actions a při skutečném selhání integrity, chybějící sekci či nefungujícím vyhledávání označí běh červeně. Není to monitoring Google indexace, tržeb ani skutečných odchozích kliknutí.

Podklad pro další verzování: integrita 0.8.182 uživatelsky potvrzena částečně pouze verzí aktivního tématu; detailní postdeploy QA je tato nová automatizace, nikoli WPVibe.
