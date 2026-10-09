# ZaPrazi 2.0 — Source of Truth

## Mission

ZaPrazi.cz helps people create a safer home in which they or their loved ones can remain independent for as long as possible.

ZaPrazi is not a classic senior magazine and not a health-aid catalog. It is a **decision engine for safe and independent living at home**.

Primary user need is not "find product X" but "What should we do?"

Core journey:

`problem → understand the situation → solution options → suitable aid/home modification type → acquisition path → concrete products/services`

## Brand

Positioning: **Bezpečně a samostatně doma.**

The brand should feel human, practical, calm, trustworthy and modern. It should visually feel like a website about home and life, not illness, hospital or pharmacy.

## Primary user

Often a daughter or son roughly 40–60 who is solving a parent's practical home situation under stress and without specialist vocabulary.

The experience must therefore use plain Czech and explain unfamiliar product categories and parameters.

## Main product — Domácí poradce

The Home Advisor is the center of the product, not the blog.

Questions are practical, not diagnostic. It asks about:
- who the solution is for at a non-identifying level,
- how the person moves in practical terms,
- where the main home problem is,
- bathroom/WC/getting up/stairs/outdoor movement/car transfer,
- short-term vs long-term need.

The output is not a diagnosis. It identifies areas worth addressing, explains why, gives selection parameters and only then offers concrete products/services.

## Critical differentiator — how to obtain the solution

For important aids, ZaPrazi must not assume "need aid = buy aid".

The decision layer must support:
- buy,
- rent,
- check health-insurance reimbursement,
- check social support/contribution where relevant.

Trust is more important than maximizing a single affiliate sale.

## Content architecture

Useful entry paths may be organized by:
- life situation,
- room/place at home,
- practical problem,
- product category,
- finance/acquisition.

Every page must still provide useful value without requiring questionnaire completion.

Every new URL must be at least one of:
- Decision page,
- Problem page,
- Reference page.

No mass production of generic AI SEO articles.

## Product and affiliate layer

Affiliate links are not hard-coded into editorial logic.

Separate:
- product facts,
- use cases / suitability evidence,
- category,
- merchant offers,
- price,
- availability,
- affiliate URL,
- checked date.

Product order comes from suitability and evidenced parameters, not commission.

Current approved merchant portfolio includes RehabilitačníPomůcky.cz, Lékárna.cz, Dr.Max, UNIZDRAV and Zdravá Obuv Štěpánková & C. Mobility v1 has active exact affiliate routes for BESCO WA17, BESCO WA21 and MEYRA Ideal. UNIZDRAV is the highest-priority expansion merchant because its current public catalog spans Bathroom/WC, beds, lifts and wheelchairs. Merchant availability and commission never change recommendation ranking; every new route still requires product-level evidence and exact deeplink verification.

## Trust

Trust is systemic:
- official sources,
- insurer/state references,
- transparent recommendation methodology,
- update dates,
- fact vs recommendation separation,
- affiliate disclosure,
- product-ranking explanation.

ZaPrazi does not diagnose or promise individual medical suitability.

If decisive data is missing or professional assessment is required, the Advisor says so instead of producing false certainty.

Reimbursement content explains how to verify eligibility; it does not confirm an individual's legal/medical entitlement.

## Privacy

The MVP Home Advisor does not create a persistent health profile.

No name, address, birth number or identifying account is required.

Advisor answers remain only in temporary browser memory. They are not written to URL, server logs, accounts or persistent storage.

Analytics/ad/affiliate systems must not receive answer combinations or derived health profiles.

Minimum funnel events:
- `builder_start`
- `builder_complete`
- `recommendation_view`
- `product_click`
- `merchant_click`

Event parameters, automatically sent URLs and identifiers must also be checked for leakage.

## Accessibility

Target WCAG 2.2 AA from the beginning: contrast, readable text, touch targets, keyboard control, visible focus, labels, understandable errors and simple Czech.

## Old ZaPrazi migration

Inventory every old URL and classify:
- KEEP,
- MERGE,
- REPURPOSE,
- REMOVE.

Redirect only to logically matching replacement content.
Do not redirect hundreds of unrelated pages to homepage.
Do not remove/redirect before replacement and evidence review are ready.

## Vertical slices

### Slice 1 — Mobility
`Homepage → Home Advisor → walking problem → solution type → walker/rollator path → buy/rent/check reimbursement → recommended products → merchant → measurable click`

This must work end-to-end before expansion.

### Slice 2 — Bathroom + WC
Seats, grab bars, raised toilet solutions, anti-slip, transfer.

### Slice 3 — Adjustable bed
First strong high-ticket intent test: buy/rent/check reimbursement.

### Slice 4 — Wheelchairs
Transport/manual and later possibly powered mobility.

### Slice 5 — Return from hospital
Combines completed earlier modules into a life-situation flow.

## Reusable engine

Build only what Slice 1 needs, behind clean boundaries:
- Questionnaire,
- Recommendation Engine,
- Product Card,
- Comparison,
- Merchant Router,
- Buy/Rent/Reimbursement,
- Trust Block,
- Source Block,
- Affiliate Tracking.

Do not delay launch with speculative generalization.

## Data moat

Long-term sequence:
1. normalized product database,
2. recommendation rules,
3. multi-merchant price/availability,
4. reimbursement/prescription/official rules,
5. rental options and alternative acquisition paths.

## SEO

Focus on high-intent long-tail tied to decision support, not article count.

Examples:
- jaké chodítko pro seniora,
- chodítko do bytu,
- chodítko na ven,
- chodítko se sedátkem,
- polohovací postel půjčit nebo koupit,
- co připravit po návratu z nemocnice,
- jak upravit koupelnu pro seniora,
- jak zvýšit wc pro seniora,
- co hradí pojišťovna.

Every SERP entry should connect to a useful tool or decision path.

## Measurement

Leading:
- Advisor start rate,
- completion rate,
- recommendation engagement,
- merchant CTR,
- organic impressions,
- non-brand clicks.

Business:
- approved affiliate revenue,
- revenue per attributable organic session,
- EPC = approved commission / comparable-period outbound affiliate clicks,
- revenue by segment.

Keep pending/rejected/approved commissions separate.

## Stage gates

Review after 14, 30 and 60 days with a defined sample and decision:
continue / adjust / pause.

Evaluate:
1. product journey works,
2. people use it,
3. search responds,
4. monetization produces orders/approved revenue,
5. only then scale.

## Explicit non-goals

Do not:
- generate hundreds of generic AI articles,
- diagnose,
- persist unnecessary health/personal data,
- architect around a single affiliate partner,
- rank by commission,
- hire an expert as a launch dependency,
- run manual phone advice,
- build many large systems at once,
- clone a competitor 1:1,
- wait for perfection before testing monetization.

## Milestones

First product milestone:
A real user describes a practical problem, receives a useful recommendation, chooses a sensible acquisition path and reaches a concrete solution/product.

First business milestone:
**first approved affiliate order from that journey.**

## Long-term vision

ZaPrazi becomes a Czech decision platform for home independence:

`what to change → what is needed → how to choose → buy/rent/check reimbursement → where to get it`

Potential monetization:
`affiliate → marketplace routing → high-ticket CPL → direct partnerships`.

Any new idea must pass one question:

**Does it help the user get faster from a real problem to a safe practical solution while increasing the long-term value of the asset?**


---

## Schválené rozšíření vize — světová UX inspirace a Home Scan (2026-10-09)

**Status: rozšíření stávajícího Master Vision & Execution Brief, nikoli nový projekt či změna strategie.** Veškeré dosud schválené závazky týkající se mise, značky, bezpečnosti, soukromí, architektury, produktové evidence, monetizace a postupného nasazování zůstávají platné. Toto rozšíření nerozhoduje o okamžité implementaci žádné nové funkce.

### 1. Používat konkrétní prvky nejlepších zahraničních projektů

Využít cílený benchmarking těchto referencí. Uvedené prvky jsou **hypotézy k ověření**, nikoli automatické závěry o jejich aktuální funkcionalitě:

| Inspirace | Prvek k ověření | Co porovnat se současným ZaPraží |
|---|---|---|
| AskSARA / Living Made Easy | adaptivní výběrové otázky a přechod od situace ke konkrétnímu řešení | počet nezbytných otázek, relevance větví, srozumitelnost výsledku 14 poradců |
| AARP HomeFit | průchod místnostmi a praktické úpravy bez nutnosti nákupu | dnešní problémové vstupy, bezpečný byt a plán návratu z nemocnice |
| LiveUp Australia | lidský, pozitivní jazyk a lehkost navigace | srozumitelnost češtiny, kognitivní zátěž, přístupnost pro rodinu a seniory |
| Carewell | přehledné srovnání výrobků a jasná nákupní cesta | současné produktové karty, fakta vs. ověřená vhodnost, koupit/půjčit/úhrada |
| Aging in Place Index | transparentní kritéria a vysvětlení doporučení | metodika rozhodování, zdroje, důvody doporučení a důvody blokace |

Každé kandidátní zlepšení musí mít: (a) skutečně ověřený funkční vzor, (b) konkrétní odchylku proti současnému ZaPraží, (c) očekávaný přínos a metriku, (d) kontrolu bezpečnosti, přístupnosti a soukromí, (e) jednoduchý experiment a rozhodnutí **přijmout / upravit / odmítnout**. Neprovádět obecné rešerše bez návaznosti na reálnou uživatelskou či obchodní potřebu. Nekopírovat konkurenční web 1:1.

### 2. Vylepšovat existujících 14 poradců, nevytvářet náhradní engine

- **Adaptivní otázky:** pouze rozhodovací a bezpečnostní vstupy relevantní ke konkrétní větvi; nepokládat otázku, která nemůže změnit výsledek.
- **Jednoduchá čeština:** začít reálným problémem, ne názvem odborné pomůcky; vysvětlit neznámé pojmy.
- **„Proč právě toto“:** výsledek uvádí srozumitelný důvod, kritéria, nejistotu a další krok.
- **Neproduktová řešení:** připustit bezplatnou změnu zvyku či uspořádání a jednoduchou úpravu domácnosti, je-li bezpečnější nebo přiměřenější než nákup.
- **Oddělené stavy:** typ řešení ≠ předběžný kandidát výrobku ≠ potvrzená praktická/rozměrová kontrola ≠ odborné posouzení. Nezaměňovat je v UI ani v obchodních CTA.
- **Úplná cesta:** problém → nezbytné odpovědi → vysvětlený výsledek → praktické kontroly → konkrétní ověřený produkt či neproduktový krok → koupit / půjčit / prověřit úhradu.
- **Neobcházet fail-closed:** nový UX ani jiné odkazy (včetně zdrojů či doporučení navazujícího modulu) nesmějí odemknout nabídku bez splnění příslušného fit-gate.

Doporučovací pravidla, katalog, affiliate routing a zdrojová evidence mají zůstat jediné sdílené; žádný druhý rozhodovací systém ani jednorázově vymyšlené produktové doporučování v prezentační vrstvě.

### 3. ZaPraží Home Scan — „Projděte svůj domov“ (podmíněné malé MVP)

Dlouhodobý koncept dvou rovnocenných vstupů do **stávajícího Domácího poradce**:
1. **Začínám problémem** (dosavadní cesta).
2. **Začínám místností** — koupelna/WC, ložnice, pohyb po bytě, schody, vstup do domu.

Uživatel řeší praktické překážky, systém orchestruje stávající poradce, jejich rozhodovací pravidla, ověřený katalog a stejné akviziční cesty. Výstupem je **akční plán** podle konkrétnosti a naléhavosti: co zlepšit hned bez nákupu; jednoduchá domácí úprava; kde dává smysl pomůcka; co je nutné změřit či odborně ověřit; které nabídky smí být zobrazeny až po řádně dokončeném fit-gate. Nedávat univerzální checklist jako individuální zdravotní doporučení.

**Home Scan není P0.** Nejprve uzavřít kritické bezpečnostní nálezy a praktické QA existujících prodejních cest. Teprve pak navrhnout malý, měřitelný proof-of-value nad existujícími moduly (například pouze koupelna/WC + pohyb po bytě, bez nového enginu). Rozšíření do dalších místností pouze po ověření užitečnosti, nákladů a obchodního dopadu. Nevytvářet trvalý osobní ani zdravotní profil; odpovědi jen dočasně v prohlížeči, bez kombinací odpovědí v URL/analytics/affiliate datech.

### 4. GitHub Website Cloner — rámec benchmarkingu, nikoli povolení ke klonování

Zadaná část 4 byla předána pouze s názvem „Využití GitHub Website Cloner nástrojů“ a úvodem „Pro rychlejší vývoj a benchmarking“; konkrétní pokračování zatím nebylo dodáno. Do jeho doplnění lze nástroje **posoudit** jako technickou pomoc pro porovnání veřejně viditelných UX vzorů a informační architektury, nikoli použít k převzetí cizího kódu, textů, grafik, brandingu, dat či chráněných částí webu. Respektovat licence, autorská práva, podmínky přístupu, robots pravidla a soukromí. Všechny finální komponenty musí být vlastní, přístupné a zapojené do existující architektury ZaPraží.

### 5. Měření, prioritizace a definice dokončení

U každého UX experimentu vymezit výchozí stav a očekávané zlepšení alespoň v některých metrikách: zahájení/dokončení poradce, odpadnutí na otázkách, počet zbytečných odpovědí, úspěšné pochopení doporučení, navazující bezpečný krok, relevantní merchant CTR, případně schválený affiliate výsledek. **Nulová tolerance** k obcházení bezpečnostních gate a úniku zdravotně citlivých kombinací; výsledek s takovým problémem nelze vyhodnotit jako úspěch ani při lepší konverzi. Hodnocení po přiměřeném vzorku, ne podle estetického dojmu.

**Pořadí práce:** 0.8.62 deploy a praktické QA → odstranit skutečné překážky v již existujících poradenských cestách → cílené benchmarky a malé UX úpravy → rozhodnout o Home Scan MVP podle doloženého přínosu. Žádný tento bod neopravňuje obejít release/production smoke pravidla.


### Aktualizace priorit 9. 10. 2026 — kvalita průvodců před značkou a expanzí

Před SEO/rozšiřováním, novými nástroji nebo Home Scan má absolutní prioritu **praktická správnost, bezpečnost, přesné produktové mapování a výborné mobilní UX všech 14 existujících poradců**. Pracovat po konkrétních nalezených závadách a měřit dokončení až jako doplněk, nikoli náhradu bezpečnostních testů. Po uzavření kritických a významných zjištění následuje jednotná finální aktualizace loga Zápraží a faviconu, včetně mobilního zobrazení. Teprve pak další body schválené vize. Windsor.ai není závislost a nepřipojovat. Podrobná matice přijetí a bezpečnostní regresní scénáře: `docs/ADVISOR_QUALITY_GATE_2026-10-09.md`.


---

## Schválené upřesnění vize — životní situace, akční plány a checklisty (9. 10. 2026)

**Toto je doplnění, nikoli změna Master Vision & Execution Brief.** Původní strategie, architektura, bezpečnostní a privacy pravidla, obchodní model i pořadí priorit zůstávají v platnosti. Cílem ZaPraží je být postupně nejdůvěryhodnějším praktickým průvodcem bezpečným, samostatným a kvalitním životem ve vyšším věku pro lidi samotné i jejich rodiny, nejprve v ČR a následně s lokálně ověřeným obsahem také na Slovensku. Nejde primárně o reklamní web ani o katalog pomůcek.

### Primární uživatelský slib: z nejistoty ke konkrétnímu plánu

Člověk často přichází s životní situací, ne s názvem pomůcky: „maminka se vrací z nemocnice“, „tatínek začíná padat“, „nevím, jak se postarat o blízkého“, „chceme, aby mohl dál bezpečně bydlet doma“. ZaPraží mu má pomoci pochopit problém a odejít s **jasným použitelným akčním plánem**. Doporučení produktu je možný následující krok, nikoli povinný výsledek nebo účel celé stránky.

**Preferovaná cesta:** životní situace nebo konkrétní problém → vysvětlení možností a limitů → praktický checklist / akční plán → odpovídající odborné, veřejné, bezplatné, službové či produktové řešení → bezpečně proveditelný další krok.

### Standard kvalitního průvodce životní situací

Průvodce má podle povahy tématu srozumitelně nabídnout:

1. **Co řešit hned:** časově kritické praktické kroky a případné situace, kdy nejprve kontaktovat zdravotníka, sociální službu nebo jiného odborníka.
2. **Co zařídit:** instituce, dokumenty, návazná domácí péče, doprava a dostupné služby, pokud jsou pro situaci relevantní; uvést, kdo a za jakých podmínek je řeší.
3. **Co zkontrolovat doma:** vstup, bezpečný pohyb, koupelnu, WC, lůžko a další skutečně relevantní oblasti; nevyvozovat individuální zdravotní bezpečnost bez odborného posouzení.
4. **Co zvážit později:** prevence, dlouhodobá soběstačnost, úpravy domácnosti, pomoc rodině, pohyb a kvalita života.
5. **Kde hledat pomoc a jak ji získat:** ověřitelné oficiální zdroje, služby, půjčovny, možnost prověřit úhradu, případně vhodné produkty až po splnění bezpečnostních podmínek.

Checklist má rozlišovat **ověřit / zařídit / zvážit / odborně posoudit**, uvádět časovou důležitost a nezaměňovat obecnou informaci za individuální doporučení. Jeho kroky musí mít srozumitelný důvod a nejbližší proveditelný úkon. Uživatel může získat užitek i tehdy, když **nic nekoupí**. Tisk nebo lokální uložení checklistu lze přidat pouze způsobem slučitelným s již platným privacy-by-design přístupem; nevyžadovat účet ani trvalé ukládání citlivých odpovědí.

### Obsahová autorita budovaná kolem potřeb, ne počtu článků

Budovat tematické clustery kolem reálných životních situací a každodenních činností: návrat z nemocnice, pohyb a pády, bezpečné bydlení, hygiena, péče o blízkého, dostupná pomoc, financování a další kvalitně zdrojované oblasti samostatného života. Propojit **vysvětlující obsah → checklist → existující specializovaný poradce → ověřený praktický krok**, bez duplicitní rozhodovací logiky a bez generického masového AI obsahu. Každá důležitá situace má mít jasnou vstupní stránku s možností rychlé orientace pro seniora i pro jeho děti či vnoučata.

### Monetizace jako důsledek užitečné pomoci

Přednost mají vhodná bezplatná řešení, veřejné služby a bezpečné kroky. Affiliate nabídky, půjčení, produkty či budoucí placené partnerské služby smějí navazovat jen tam, kde řeší skutečnou potřebu a jsou transparentně označené. Nepřipustit pořadí podle provize, nátlakové CTA, zpoplatnění základního bezpečnostního checklistu ani prodej individuálních odpovědí či odvozených zdravotních profilů. Další modely monetizace posoudit samostatně podle užitku, důvěry, compliance a proveditelnosti; toto doplnění žádný nový model automaticky neschvaluje.

### Realizace bez změny priority P0

Toto **není pokyn okamžitě vytvořit nový univerzální engine nebo rozšířit Home Scan**. Nejprve dokončit kvalitu a QA všech 14 stávajících poradců, bezpečnost produktových doporučení a mobilní UX; následně finální aktualizaci loga a faviconu podle již schváleného pořadí. Poté ověřit **jeden malý pilot existujícího „Návratu z nemocnice“**: užitečný obecný checklist a srozumitelný akční plán odkazující na stávající moduly, bez duplikace enginu. Hodnotit reálné porozumění, schopnost provést další krok, bezpečnost, přístupnost a ochranu soukromí; obchodní proklik je až sekundární signál.


### Upřesnění obchodního postupu — nejprve užitečnost a návštěvnost (9. 10. 2026)

- **Teď neoslovovat nové půjčovny, poskytovatele služeb ani výrobce s nabídkou placeného partnerství.** Není to aktuální úkol; nezakládat seznamy pro oslovování a nevyžadovat od majitele projektu domlouvání spoluprací.
- Nejprve vytvořit skutečně užitečný, důvěryhodný obsah, checklisty a výběrové cesty. Růst stavět na dohledatelnosti ve vyhledávání, kvalitních odpovědích a dobrovolných doporučeních mezi lidmi; nespoléhat na to, že samotná kvalita automaticky zajistí návštěvnost.
- Zatím používat již schválené affiliate programy a ověřené produktové cesty; u relevantních bezplatných, veřejných či nekomerčních služeb lze poskytovat užitečné odkazy i bez provize. Nevkládat umělé reklamní bloky či nevhodné produkty jen kvůli monetizaci.
- **K budoucím individuálním dohodám přistoupit až po doložení stabilní relevantní návštěvnosti a skutečných odchozích prokliků na konkrétní segment nebo partnera.** Návštěvy webu nejsou totéž co obchodní příležitosti; měřit pouze agregované privacy-safe počty bez předávání odpovědí z poradců či zdravotních profilů.
- Až budou doložitelná data, lze **teprve vyhodnotit** dobrovolné modely spolupráce: transparentně označené fixní umístění, měsíční paušál, platbu za doložené předání zájemce nebo rozumný hybrid. Částky jsou předmětem budoucího ověření, nikoli nynější příslib výnosů.
- Žádná placená dohoda nesmí ovlivňovat odborné doporučení, pořadí řešení ani bezpečnostní kontrolu; uživatel vždy dostává smysluplnou pomoc i bez obchodního prokliku. Stávající P0 a pořadí vývoje se nemění.
