# Zápraží 2.0 — první GA4/CJ baseline, 20. listopadu 2026

Tento dokument je **anonymní agregovaný pracovní snímek**, ne důkaz tržby ani přírůstku díky poslednímu releasu. Žádné odpovědi Domácího poradce, osobní údaje, parametry zdravotního stavu, autentizační tokeny ani transakční identifikátory nejsou uloženy.

## Zdroj a rozsah

- Zdroj: připojená vlastnost `__ZAPRAZI - GA4`, čtená přes Windsor.ai konektor `googleanalytics4`, přístup pouze ke čtení.
- Interval pro níže uvedené GA4 metriky: **23. 10. – 19. 11. 2026 včetně (28 kalendářních dnů)**; dotaz uskutečněn **20. 11. 2026**.
- Dotaz na funnel: `event_name` a `event_count`, zvlášť ověřeno také pomocí `date` + `event_name` + `event_count`.
- Dotaz na kanály: `session_default_channel_group`, `sessions`, `active_users`; na vstupní URL: `landing_page`, `sessions`, `active_users`.
- Vlastní měřicí adapter Zápraží podmiňuje události opt-in souhlasem `granted`; **GA4 konektor ale nevrací na úrovni záznamu `analytics_storage` Yes/No/Unset**, takže z tohoto agregátu nelze nezávisle ověřit consent profil ani kompletnost dat. Čísla představují **pozorované události a relace** ve vlastnosti, nikoli unikátní osoby, dokončené objednávky nebo schválené provize. Nelze z nich počítat míru dokončení po uživatelích ani vyvozovat kauzalitu.
- GSC záznamy 10 kliků a 1 163 impresí mají **jiné datum pozorování: 15. 11. 2026**, původní [Prometheus evidence](https://github.com/Rastty/prometheus-growth-os/actions/runs/44341902238). Nemíchat s oknem GA4, nepoužívat jako tentýž počet návštěvníků.

## Agregované výsledky GA4

| Metrika | Počet | Co to znamená |
|---|---:|---|
| Relace / sessions | 77 | Součet po kanálech; včetně interních nebo testovacích relací, pokud nebyly odfiltrovány |
| Organic Search sessions | 17 | GA4 zdrojová atribuce, ne počet GSC kliknutí |
| `page_view` | 164 | Události zobrazení stránky |
| `builder_start` | 5 | Události zahájení poradce |
| `builder_complete` | 5 | Události dokončení poradce; nelze párovat se starty po lidech |
| `recommendation_view` | 3 | Události zobrazení doporučení |
| `product_click` | 1 | Událost kliknutí na produkt |
| `merchant_click` | 1 | Událost kliknutí na obchodníka |
| `affiliate_click` | 1 | Událost affiliate kliku, **ne** objednávka |
| `next_step_click` | 1 | Událost navazujícího kroku |

Všechny `builder_start`/`builder_complete` události připadly na **27. 10.** (2/2), **29. 10.** (1/1) a **15. 11.** (2/2). Jediný `affiliate_click` připadl na **27. 10. 2026**. Není ověřeno, zda šlo o běžné návštěvníky, interní QA nebo opakované testy.

Kanály: **AI Assistant 30 sessions / 1 active user**, Direct 17 / 5, Organic Search 17 / 15, Referral 13 / 1. Unikátní uživatele nelze sčítat napříč kanály. Jediný uživatel s 30 AI Assistant relacemi je silné upozornění na možný testovací/automatizovaný provoz, **nikoli potvrzení bot provozu**.

Vstupní URL `/` zaznamenala **44/77 sessions**. `/koupelna-a-wc` 3, `/choditko-do-bytu-pro-seniory` 2, `/pomucky-do-koupelny-na-pojistovnu` 2; zbytek rozptýlen mezi 25 dalšími položkami včetně starých článků o vodě, kanceláři a spotřebičích. Jde o **všechny GA4 kanály**, ne pouze organický segment. Vzorek je malý, nelze z něj určit účinnost SEO zásahů.

## CJ — připojeno, ale nikoli čitelné provize

- Windsor.ai eviduje připojený CJ účet; autentizační token se zde neukládá ani nevypisuje.
- Čtení dat `cj` v rozsahu **23. 10. – 19. 11. 2026** přes pole `date`, `advertiser_name`, `validation_status`, `pub_commission_amount_pub_currency` selhalo s chybou **`Only registered advertiser users may run advertiserCommissions query`**.
- Dokumentace CJ pro publisher účty používá **`publisherCommissions(forPublishers: ...)`**. [CJ Publisher Commission Detail API](https://docs.cj.com/docs/pub-commissiondetail-api). Chyba ukazuje, že použitá cesta konektoru pravděpodobně spouští advertiser-dotaz pro publisher účet; bez opravy konektoru či alternativního výpisu **není možné bezpečně vyčíst schválené provize**.
- **Schválená provize zůstává UNKNOWN, nikoli 0 Kč**. `merchant_click` ani `affiliate_click` se nesmí interpretovat jako nákup.
- Další krok: vyžádat opravu `publisherCommissions` od Windsor.ai; alternativně exportovat pouze agregované publisher komise z [CJ Publisher](https://members.cj.com/member/publisher/home.do) bez individuálních objednávek a citlivých identifikátorů.

## MEYRA 3061982 — doložené technické údaje, ne potvrzená retailová varianta

- Nově dodaný český [oficiální návod MEYRA 3061982](https://www.meyra.cz/upload/files/produkty/Hole-berle-choditka/navod-k-pouziti-rollator-ideal-3061982.pdf), strana 14, uvádí šířku **615 mm**, výšku madel **790–970 mm** a maximální hmotnost uživatele **130 kg**. PDF je datováno 2021.
- Již citovaný [oficiální návod](https://www.meyra.cz/upload/files/produkty/Hole-berle-choditka/navod-k-pouziti-ideal-rollator.pdf), strana 14, uvádí stejné rozhodující parametry, dokument 2022. Současná produktová fakta `src/mobility/catalog.js` (**61,5 cm**, **79–97 cm**, **130 kg**) se tedy **nemění**.
- Starší podklady uvádějí odlišné parametry a retailová stránka sama bezpečně nedokazuje přesný dodávaný výrobní model. Zachovat stávající viditelné upozornění, ověření štítku a fit-gate; **nabídka Lékárna.cz nebyla návodem nově ověřena**, proto neměnit datum platnosti nabídky.
- Žádný nový WordPress runtime release zde není nutný. Příští běžná aktualizace katalogu může doplnit přímý odkaz na tento modelový návod společně s konkrétním potvrzením varianty u prodejce.

## Rozhodnutí pro následující cyklus

1. **Vyřešit reporting CJ** cestou pro publisher účet; do té doby neměřit schválené výnosy jako nulu.
2. **Ověřit testovací vs reálný traffic** pomocí pravidel analytiky bez ukládání uživatelských odpovědí a sledovat odděleně Organic Search → poradce → merchant klik.
3. **Zlepšit existující Mobility vstupní URL**, až GSC query/page evidence ukáže konkrétní vstupní záměr; zatím se nenechat svést starými obsahovými URL do plošné produkce článků.
4. U MEYRA potvrdit konkrétní variantu/EAN u obchodníka a aktuálnost nabídky, nikoli pouze parametry obecného modelu.
