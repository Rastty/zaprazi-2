# Seznam / IndexNow — Zápraží 0.8.248: evidence-first release gate

**Stav 22. 11. 2026: 0.8.248 ŽIVĚ OVĚŘENO, INDEXNOW STÁLE HOLD — chybí potvrzený domain-root TXT klíč, nic neodesláno.** Změna je pouze zdrojový Node.js nástroj a offline testy; žádná nová verze WordPress tématu, přepisy URL, affiliate kliky ani reklamní kampaň.

## Obchodní důvod a mez důkazů

Ze skutečného anonymního `__ZAPRAZI - GA4` read-only okna **25. 10.–20. 11. (27 dní)** pochází 18 Organic Search sessions, z toho Seznam 12 sessions / 5 engaged, Google 3 / 2, Bing 3 / 0 ([zdrojové agregáty](../data/organic-engagement-windows-20261122.json)). Toto je malý consentem omezený vzorek, nikoli relativní podíl hledání, výsledky Seznam Webmasteru nebo potvrzené schválené provize. Vhodné pro podmíněný experiment zlepšení **discovery**, nikoli pro tvrzení o růstu.

Seznam oficiálně podporuje [IndexNow](https://o-seznam.cz/napoveda/vyhledavani/seznambot/protokol-indexnow/), ale příjem HTTP 200 **nezaručuje procházení ani indexaci**. Oznámit smíme jen přesné nové či skutečně změněné kanonické stránky. Využíváme již existující vzor [Core / ITSpace IndexNow](https://github.com/Rastty/prometheus-growth-os/blob/HEAD/sites/oux/web/scripts/indexnow.mjs), nikoli nový obecný publikovací systém.

## Rozsah přesně jednoho vydání

Release `0.8.248` nově upravuje pouze dvě obsahové cesty:
- `https://zaprazi.cz/prevoz-seniora-k-lekari/` — z bezpečného převozu na typ opory při chůzi, ne při nemožnosti přesunu do auta
- `https://zaprazi.cz/schody-pro-seniora-doma/` — ze schodů k plánování bezpečného převozu, bez automatického nároku na hrazenou sanitku

`scripts/seznam-indexnow-248.mjs` má **přesný allowlist právě těchto dvou** veřejných `requiredDecisionPaths`. Neoznamuje archiv 4 359 slugů, homepage, katalog ani všech 52 stránek. Po jakémkoli novějším release vyžaduje aktualizovanou věcnou revizi, ne opakování téhož POST.

## Tvrdé brány před jediným POST

1. Zdrojová verze musí být **přesně 0.8.248**; `config/growth-state.json.nodes.safety_qa` musí mít nezávisle ověřenou **stejnou** verzi a důkaz GitHub Actions. [Nezávislá Chrome QA 9/9 PASS (22. 11. 17:26 UTC)](https://github.com/Rastty/zaprazi-2/actions/runs/45048858868) nyní opravňuje `verifiedRelease=0.8.248` v [Growth Graph](../config/growth-state.json). Tento gate je splněn, nenahrazuje root TXT proof.
2. Veřejný WordPress readiness z `/wp-json/zaprazi/v1/affiliate-readiness` musí potvrdit `release=0.8.248`, `integrity=ok`, `25/25` nakonfigurovaných pozic. Neznamená to nákup ani partner atribuční úspěch.
3. Vlastnický IndexNow klíč **musí být přímo v root webu** jako `https://zaprazi.cz/{key}.txt`, veřejný HTTP 200 bez redirectu, s přesným textovým obsahem. Nestačí `/wp-content/themes/.../{key}.txt`: [Seznam výslovně omezuje rozsah ověření](https://o-seznam.cz/napoveda/vyhledavani/seznambot/protokol-indexnow/) na adresář souboru a jeho podadresáře; tamní klíč neprokáže oprávnění pro kořenové stránky. **Root klíč zatím NENÍ zdokumentovaně nasazen**; neobcházet přes query, theme asset ani jinou doménu. Není to neveřejné heslo, ale ověřovací text vlastníka webu.
4. Nově načtené HTML obou přesných kanonických stránek musí projít **stejnou** [bezpečnostní kontrolou](../scripts/audit-live-transport-mobility-248.mjs) jako postdeploy QA; absence obou handoffů, chybné release značky nebo obchodní bypass znemožní POST.
5. I po všech kontrolách je `--submit` **výslovný manuální režim**: žádný cron, automatický GitHub Actions dispatch, odesílání affiliate linků nebo proces bez schváleného root proof. Jedno odeslání dvou URL do `https://search.seznam.cz/indexnow`; 200 = přijetí upozornění, ne zaindexování.

## Ovládání a současná blokace

```sh
node scripts/seznam-indexnow-248.mjs --dry-run
# Po přijetí QA v Growth Graph: eligible_for_live_preflight; 0 HTTP requestů, 0 POST.
# Není to potvrzení root TXT klíče ani povolení k submitu.

# Až poté, co se nezávisle potvrdí produkční 0.8.248,
# bude v root skutečně publikovaný exact TXT klíč a nástroj
# bude spuštěn ve schváleném prostředí:
ZP_INDEXNOW_KEY="<public-domain-root-key>" node scripts/seznam-indexnow-248.mjs --probe
# Jen po PASS: explicitně --submit se stejným env pro 2 přesné URL.
```

Skript **nikdy nevypisuje hodnotu klíče, obsah API odpovědi ani případné nebezpečné URL**. Neodesílá žádný zdravotní profil, odpovědi poradce, merchant/CJ/eHUB redirect a nečte WordPress admin. `--dry-run` je plně offline; `--probe` provede maximálně čtyři bezpečné GET na vlastní doméně; `--submit` teprve při všech PASS přidá jeden POST vyhledávači. Dva odlišné důkazy budou `IndexNow notice accepted` a teprve pozdější skutečný index/click, pokud se objeví; neslučovat.

**Současná jediná root-proof blokace:** vydání 0.8.248 již na WordPressu funguje a nezávisle prošlo QA. Pro podmíněný IndexNow experiment je nadále třeba do domain root umístit a ověřit veřejný TXT klíč `https://zaprazi.cz/{key}.txt` (ne do adresáře tématu), poté nejdříve `--probe` a teprve po PASS explicitní jednorázové `--submit`. Tento PR klíč nevytváří, na Seznam nic neposílá.
