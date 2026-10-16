# Zápraží 0.8.136 — vratná oprava historického článku 5448

**Důkaz:** Kompletní QA PR #361 (16. 10. 2026) prošel 4 360 publikovaných postů a 546 způsobilých pro první etapu. Článek 5448 vykresluje jen přibližně 43 % původních slov, chybí další odkazy a dvě média. WP databáze uchovává pokračování a nezakončenou poznámku v HTML komentáři začínajícím „The above HTML code represents a blog post in Czech about the influence of pump performance on the efficiency of garden irrigation.“. Zbytek HTML tak prohlížeč skryje.

**Změna:** Výhradně pro ID 5448 před existujícím bezpečným normalizátorem vynechat tuto zjevně nečtenářskou poznámku. Přísná kontrola vyžaduje jediný neuzavřený komentář, přesnou frázi, krátký blok bez skutečných obsahových tagů či atributů a navazující původní obrázek Screenshot_878.png. Neznámý formát nechá beze změny. Ostatních 4 359 historických článků, WordPress post_content, URL, canonical, affiliate cíle a indexace zůstávají beze změny.

**Ověření:** PHP jednotkové testy chrání obě části textu, původní obrázek a odkaz; neznámé případy se odmítnou. Verze 0.8.136 a všech 70 chráněných markerů souhlasí. Před nasazením musí projít CI. Po ručním Pull + Deploy ověřit release a integritu, REST vs živé HTML článku 5448 (nečtenářskou poznámku nepočítat jako viditelný text) a regresi 14 poradců. Neslibovat produkční opravu jen na základě offline testu. Při neúspěchu rollback 0.8.135.

**Zbývá:** Poškozené historické HTML obrázků v článku 3128; řešit cíleně až po ověření zdroje. Rozšíření opravy nad první osminu archivu nyní neschváleno.
