# Zápraží 0.8.193 — přímý vstup z půjčení a úhrady do poradce

**4. listopadu 2026.** Zdrojový release kandidát; neprohlašovat produkční nasazení před skutečným WordPress Pull + Deploy a postdeploy Chrome QA.

## Proč tato změna (Effort / Effect)

Dvě existující vstupní stránky `/pujceni-choditka/` a `/choditko-na-pojistovnu/` ukazovaly jako hlavní CTA obecný přehled `/choditka-pro-seniory/`. Návštěvník odtud musel udělat další přechod do stávajícího rozhodovacího enginu.

Hlavní CTA nově vede přímo na `/#poradce`, kde už se ověřují nutné potřeby a bezpečnostní podmínky. Vedlejší odkaz zachovává možnost nejprve porovnat typy `/choditka-pro-seniory/#vyber-typu`. Zkracuje se navigace, **nikoliv bezpečnostní posouzení**. Zachované ceny půjčoven a oficiální informace o ePoukazu se nijak nemění.

## Minimální měření

Hlavní CTA používá již existující `data-zp-journey="advisor"`. Consented GA4 adapter vyšle nejvýše jednu generickou `guide_advisor_click` událost za stránku, bez produktového ID, URL cíle, parametrů, diagnózy nebo odpovědí. Není to unikátní uživatel, skutečný start poradce, Google klik ani provize. Při odmítnutém/neznámém analytickém souhlasu se nic neodešle.

## QA a brány

- `tests/mobility-acquisition-direct-advisor-193.test.js`: kontrakt obou hero CTA, existující kotva poradce, možnost srovnání, žádná nákupní zkratka, zachování rental/ePoukaz obsahu.
- Úplné atomické release-markery všech 100 povinných runtime souborů + ZAPRAZI_RELEASE/style.css = 0.8.193; beze změny připnutých kritických blob hashů.
- Po CI a bezpečném merge synchronizovat main=dev; vlastník musí provést **ruční Pull + Deploy**. Teprve poté plný Chrome smoke všech 14 poradců a konkrétní kontrolu dvou změněných URL.
- `config/growth-state.json` se před novou akceptací **nesmí** přepsat na `safety_qa.verifiedRelease=0.8.193`: starší 0.8.192 není důkaz nové verze.

Dopad na návštěvnost, CTA kliknutí či schválené provize se musí doložit skutečnými daty za srovnatelné období. Nikdy netvrdit uplift z pouhé změny odkazů.
