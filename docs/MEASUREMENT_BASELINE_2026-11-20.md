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

### Nový anonymní průřez funnel událostí podle kanálu (20. 11. 2026)

Samostatný čtecí dotaz do stejné vlastnosti, stejného období **23. 10. – 19. 11.**, s dimenzemi `event_name` a `session_default_channel_group` a metrikou `event_count`, omezený na `builder_start`, `builder_complete`, `recommendation_view`, `product_click`, `merchant_click`, `affiliate_click` a `guide_advisor_click`, vrátil **12 agregovaných řádků**. Proti tomu nezávislý dotaz na **všechny Organic Search události** potvrdil `session_start=17`, `page_view=22`, `first_visit=15`, `user_engagement=23`, ale žádnou zaznamenanou funnel událost.

| GA4 session channel | `builder_start` | `builder_complete` | `recommendation_view` | `product_click` | `merchant_click` | `affiliate_click` |
|---|---:|---:|---:|---:|---:|---:|
| Direct | 2 | 2 | 1 | 1 | 1 | 1 |
| Referral | 1 | 1 | 1 | 0 | 0 | 0 |
| AI Assistant | 2 | 2 | 1 | 0 | 0 | 0 |
| Organic Search | 0 | 0 | 0 | 0 | 0 | 0 |
| **Zaznamenaný součet** | **5** | **5** | **3** | **1** | **1** | **1** |

`guide_advisor_click` nevrátil žádný řádek v uvedeném intervalu; nejde o důkaz nefunkčnosti novějšího kódu ani o počet unikátních lidí. **Jediný pozorovaný affiliate klik je přiřazen kanálu Direct, nikoli Organic Search.** Toto přiřazení **neprokazuje** skutečného zákazníka, stejnou relaci pro více různých událostí, nákup ani schválenou provizi. GA4 event counts nelze dělit počtem sessions jako přesný uživatelský konverzní poměr; opt-in souhlas, možné testy a GA4 reporting mohou některá pozorování vynechat či omezit. Veřejné shrnutí nezahrnuje žádná ID, odpovědi ani cesty uživatelů.

**Důsledek pro Growth Graph:** Z organiky už máme malé množství vstupů, nikoli **pozorovaný organický poradce → obchodník**. Priorita je relevanci a indexovatelnost současných rozhodovacích URL měřit, teprve potom ladit konverzní hypotézy. Není podložené připisovat jediný affiliate klik SEO ani posledním vydáním.

Kanály: **AI Assistant 30 sessions / 1 active user**, Direct 17 / 5, Organic Search 17 / 15, Referral 13 / 1. Unikátní uživatele nelze sčítat napříč kanály. Jediný uživatel s 30 AI Assistant relacemi je silné upozornění na možný testovací/automatizovaný provoz, **nikoli potvrzení bot provozu**.

Vstupní URL `/` zaznamenala **44/77 sessions**. `/koupelna-a-wc` 3, `/choditko-do-bytu-pro-seniory` 2, `/pomucky-do-koupelny-na-pojistovnu` 2; zbytek rozptýlen mezi 25 dalšími položkami včetně starých článků o vodě, kanceláři a spotřebičích. Jde o **všechny GA4 kanály**, ne pouze organický segment. Vzorek je malý, nelze z něj určit účinnost SEO zásahů.

### Samostatný Organic Search landing audit (20. 11. 2026)

Dodatečný read-only dotaz `landing_page`, `session_default_channel_group`, `sessions` s filtrem **Organic Search** za stejných 28 dnů rozlišil **11/17 sessions na historických URL přesunutých do koše 27. 10., 4/17 na adresách mimo archiv** (`/prevoz-seniora-k-lekari`, `/pomucky-do-koupelny-na-pojistovnu`, `/senior-odmita-koupani`, `/vstavani-z-kresla-pro-seniora`) a **2/17 `(not set)`**. Součet 17 přesně odpovídá reportu po kanálech. Historický archiv tedy tvoří **64,71 % naměřených organických sessions**; to nejsou z povahy tématu vstupy do aktuální Mobility poradenské cesty. GA4 nemá přímý důkaz o vyhledávacím dotazu ani o příčině návštěvy.

Pro opakování vznikl offline auditor [`scripts/organic-landing-cohorts.mjs`](../scripts/organic-landing-cohorts.mjs). Přijímá pouze agregované řádky `{landing_page, session_default_channel_group, sessions}` z výpisu GA4, porovnává je se **4 359 přesnými ID/slugy archivu** v již uložených návratových manifestech a vypíše jen součty, ne jednotlivé URL. Použití: `node scripts/organic-landing-cohorts.mjs /cesta/k/soukromemu-ga4-aggregate.json` (vstup mimo veřejný GitHub). Skript nevolá WordPress ani affiliate a nikdy sám neprohlašuje archivní manifest za důkaz živého HTTP 404. Tři namátkově kontrolované archivní vstupy 20. 11. živě vracely HTTP 404; nelze z toho odvodit HTTP stav všech historických adres. Čtyři adresy mimo archiv jsou obsahově relevantní, ale klasifikátor obecně **nepotvrzuje indexaci ani provozní dostupnost** žádné URL.

Rozhodnutí: **17/28d organických sessions není 17 relevantních příležitostí k affiliate objednávce**. Nejprve zvyšovat dosah a indexaci existujících tematických rozhodovacích stránek, ne vyvozovat nízkou konverzi z historického archivu; porovnávat až další finalizovaná GSC okna po vydání 0.8.238.

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


## Doplňkový průřez engagement (22. 11. 2026, oddělené období)

Nové **pouze čtecí** dotazování stejné `__ZAPRAZI - GA4` přes Windsor.ai, pole `landing_page`, `session_default_channel_group`, `sessions`, `engaged_sessions`. Interval **25. 10. – 20. 11. 2026 (27 dní)**; NENÍ totožný s předchozím 28denním intervalem a nelze jej přímo sčítat či interpretovat jako „po nasazení 0.8.248“. Výstup 33 agregovaných řádků (všechny kanály), následující čísla filtrují jen `Organic Search` a stejný přesný manifest 4 359 vyřazených slugů. Hodnoty jsou agregáty, nikoli osoby nebo identifikovatelné relace.

| Skupina organického vstupu | Relace | GA4 engaged sessions |
|---|---:|---:|
| Existující tematické cesty odpovídající šablonám | **6** | **5** |
| Historické slugy dle archivního manifestu | **11** | **2** |
| `(not set)` | **2** | **0** |
| **Celkem Organic Search** | **19** | **7** |

Definice GA4 engaged session: déle než 10 sekund, alespoň dvě zobrazení nebo key event; **není důkaz dokončeného poradce, obchodního kliku, nákupu ani schválené provize**. Výsledek je **malý, nenáhodný a consentem omezený vzorek**; neodvozovat statistickou významnost ani „zvýšení konverze“. Možné interní/testovací relace nelze na úrovni agregátů oddělit. Klasifikace tematické cesty podle `page-*.php` je pouze zdrojový kandidát; nezaručuje živou HTTP dostupnost nebo indexaci dané návštěvy. Nevyvozovat stav HTTP starého slugu z jeho členství v manifestu.

Ve stejném 27denním čtení bylo pro kanál `AI Assistant` vykázáno 23 sessions / 17 engaged na `/`, ale toto **nejsou organické návštěvy a mohou zahrnovat testování agenty**. Nemíchat je s organickou akvizicí. Konkrétní příležitost: udržet a zvýšit tematické organické vstupy na 53 existujících stránkách; prioritou není optimalizace zisku dle 25/25 konfigurovaných slotů bez publisher identity. `scripts/organic-landing-cohorts.mjs` nyní při úplném výpisu s `engaged_sessions` vypíše i samostatnou anonymní engagement kohortu; dřívější soubory pouze se `sessions` zůstávají podporované s `engagement=null`. Žádná další sběrná automatizace ani WordPress změna.
