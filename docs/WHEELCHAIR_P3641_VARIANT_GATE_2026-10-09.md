# ZaPrazi — varianty nosnosti vozíku P3641 (2026-10-09)

## Důvod změny

Výrobce/prodejce [UNIZDRAV P3641](https://unizdrav.cz/zbozi/3641/invalidni-vozik-odlehceny-s-brzdami-pro-doprovod) rozlišuje nosnost **125 kg s pneumatickými koly** a **136 kg s bezdušovými koly**. K dispozici jsou také šířky sedu 48 a 51 cm (celková šířka 68 a 70 cm). Údaj „125 nebo 136 kg“ sám o sobě není limit konkrétního provedení.

Původní model umožňoval `loadFit=yes` bez explicitního označení zadních kol. Návštěvník mohl nesprávně použít 136 kg na 125kg variantu.

## Opravené rozhodování

- Pouze pro `self_manual` a `mixed_manual` (produkt P3641) zobrazit po předběžném výběru otázku `wheelType` — pneumatická / bezdušová / nevím.
- `wheelType=unknown` nebo nevyplněné: bezpečné `needs_more_info`, **žádný výrobek ani affiliate odkaz**, dokud není ověřena konstrukce.
- Přechod mezi typy kol ruší dosavadní `loadFit` a čistí staré nákupní odkazy. U obou variant je třeba znovu ověřit potřebnou nosnost pro konkrétní kus.
- Výsledný popis uvádí právě zvolenou větev (125/136 kg), nikoli neurčité „125 nebo 136 kg“. Při přechodu k obchodníkovi musí uživatel zvolit totožné provedení a ověřit další montážní/rozměrové parametry.
- První krok pouze ukazuje produktová fakta bez komerčních odkazů. Přesnou hmotnost člověka nezadáváme, nepřechováváme ani neposíláme do analytiky.
- Pro doprovodný Basic P4384 a elektrický P2961 je `wheelType` nerelevantní a zůstává skrytý.
- Stávající bezpečnostní blokace při asistovaném přesunu, neověřeném ručním řízení, sedu, průchodu či nosnosti musí zůstat zachované.

## Přijetí

Engine regresní testy, kontrakty formuláře, DOM reset variant a produktové pokrytí + po nasazení 0.8.71 produkční browser smoke se scénáři unknown → pneumatic → tubeless → jiné řešení. Žádné klikání na externí affiliate nabídky při testu.

**Omezení:** Web neručí za totožnost provedení skutečně vloženého do košíku ani individuální vhodnost. Uživatel musí výběr varianty ve skutečné nabídce zkontrolovat.
