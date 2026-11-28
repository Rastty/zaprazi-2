<?php
/* ZP_RELEASE_0_8_256 */
/*
Template Name: Zápraží — Antidekubitní matrace na polohovací postel
*/
$zp_mattress_today = current_time( 'Y-m-d' );
// Cached retail snapshot retrieved on 28 Nov; allow a conservative 29-day window from 27 Nov.
$zp_mattress_retail_fresh = $zp_mattress_today >= '2026-11-28' && $zp_mattress_today <= '2026-12-27';
$zp_mattress_rental_fresh = $zp_mattress_today >= '2026-11-28' && $zp_mattress_today <= '2026-12-28';
get_header();
?>
<main id="main-content" tabindex="-1">
  <section class="zp-hero"><div class="zp-wrap">
    <p class="zp-kicker">Zápraží · Péče u lůžka · Matrace</p>
    <h1>Antidekubitní matrace na polohovací postel: pěnová, nebo s kompresorem?</h1>
    <p class="zp-lead">Potřebujete vybrat matraci pro člověka s omezeným pohybem? <strong>Nejdřív ověřte potřeby člověka a kompatibilitu celé postele</strong>, teprve potom typ a cenu. Rozlišujeme speciální pěnovou matraci, vzduchovou podložku a aktivní systém se střídavým tlakem — nejsou automaticky zaměnitelné.</p>
    <p class="zp-muted-copy">Při prevenci poškození kůže záleží také na hygieně a suché pokožce, nikoliv jen na typu matrace. <a class="zp-text-link" href="<?php echo esc_url( home_url( '/hygiena-leziciho-seniora-doma/#vyber-hygieny-na-luzku' ) ); ?>">Co bezpečně zvládnout při hygieně na lůžku</a>.</p>
      <div class="zp-hero-actions">
      <a class="zp-btn" href="#rozhodnuti-antidekubitni-matrace">Jaký další krok je bezpečný?</a>
      <a class="zp-text-link" href="#typy-antidekubitnich-matraci">Srovnat druhy matrací</a>
      <a class="zp-text-link" href="#srovnani-matraci">3 modely a pronájem</a>
      <a class="zp-text-link" href="#rozmery-kompatibilita-matrace">Osm kontrol před koupí</a>
      <a class="zp-text-link" href="#pracovni-list-matrace">Pracovní list</a>
    </div>
    <p class="zp-muted-copy">Praktický průvodce · katalogové podklady doplněny 28. 11. 2026 · Nejde o diagnózu, klinické posouzení rizika dekubitů ani individuální léčebný plán.</p>
  </div></section>

  <section id="rozhodnuti-antidekubitni-matrace" class="zp-section zp-section-soft" aria-labelledby="rozhodnuti-antidekubitni-nadpis"><div class="zp-wrap">
    <p class="zp-kicker">Nejdřív bezpečnost a potřeby člověka</p>
    <h2 id="rozhodnuti-antidekubitni-nadpis" class="zp-section-title">Čtyři situace, ve kterých se výběr matrace zásadně liší.</h2>
    <div class="zp-decision-grid">
      <article class="zp-decision-card">
        <h3>Člověk má poškozenou kůži nebo už existující proleženinu</h3>
        <p><strong>Nezačínejte nákupním filtrem.</strong> Je potřeba odborné vyšetření kůže a individuální plán od zdravotníka. Výběr odlehčovacího povrchu závisí na stavu tkání, mobilitě a dalších okolnostech; žádný typ matrace není automatickou léčbou.</p>
        <p><strong>Další krok:</strong> kontaktovat ošetřující tým nebo domácí zdravotní péči a domluvit odborné posouzení. Pokud je kůže nově poraněná, bolestivá či se stav zhoršuje, neodkládejte zdravotnickou konzultaci.</p>
      </article>
      <article class="zp-decision-card">
        <h3>Člověk je dlouho na lůžku a sám mění polohu jen omezeně</h3>
        <p><strong>Nechte zhodnotit riziko vzniku dekubitů.</strong> Odborník pomůže zvolit vhodný tlak redistribuující povrch a plán polohování. Pěnový a aktivní vzduchový systém mají různá použití; ani kompresor nenahrazuje plán péče.</p>
        <p><strong>Další krok:</strong> popsat dobu pobytu na lůžku, možnosti samostatného pohybu, péči o kůži a existující doporučení — bez zadávání zdravotních údajů do webu.</p>
      </article>
      <article class="zp-decision-card">
        <h3>Potřebujete nahradit matraci na elektrické polohovací posteli</h3>
        <p><strong>Nejprve ověřte schválenou kombinaci.</strong> Zkontrolujte rozměry, tloušťku, typ roštu a mezeru u bočních zábran. Nevhodně vysoká matrace může změnit účinnou výšku zábrany a zvýšit riziko pádu nebo zaklínění.</p>
        <p><a class="zp-text-link" href="<?php echo esc_url( home_url( '/polohovaci-postel/#poradce-postel' ) ); ?>">Ověřit bezpečnost lůžka a příslušenství</a></p>
      </article>
      <article class="zp-decision-card">
        <h3>Matrace je určená odborníkem a potřebujete vybrat konkrétní výrobek</h3>
        <p><strong>Teprve nyní porovnejte přesnou variantu.</strong> Musí odpovídat individuálnímu doporučení, návodu lůžka, hmotnostnímu rozsahu, správné vrstvě pod vzduchovou podložkou, provozu kompresoru a bezpečnému přesunu člověka z lůžka.</p>
        <p><a class="zp-text-link" href="#rozmery-kompatibilita-matrace">Projít technický kontrolní seznam</a></p>
      </article>
    </div>
    <p class="zp-disclaimer">Antidekubitní povrch sám nezaručí prevenci proleženin a nenahrazuje kontrolu kůže, individualizované polohování ani potřebnou zdravotní péči. Pokud chybí odborné posouzení rizika či bezpečnost kombinace lůžka a matrace, konkrétní produkt nedoporučujeme.</p>
  </div></section>

  <section id="typy-antidekubitnich-matraci" class="zp-section" aria-labelledby="typy-matraci-nadpis"><div class="zp-wrap">
    <p class="zp-kicker">Jak se liší provedení</p>
    <h2 id="typy-matraci-nadpis" class="zp-section-title">Pěnová, aktivní vzduchová a podložka s kompresorem: co skutečně porovnávat?</h2>
    <div class="zp-decision-grid">
      <article class="zp-decision-card">
        <h3>Speciální pěnová tlak redistribuující matrace</h3>
        <p>Pracuje bez kompresoru a má vlastnosti určené pro rozložení tlaku. Důležité jsou kvalitativní parametry a klinická vhodnost; označení „paměťová pěna“ samo nepotvrzuje, že jde o odborně vhodný antidekubitní povrch.</p>
        <p><strong>Ověřit:</strong> celkové rozměry, výšku, nosnost, kompatibilitu lůžka a krytu, možnost čištění a pokyny výrobce.</p>
      </article>
      <article class="zp-decision-card">
        <h3>Aktivní vzduchová matrace se střídavým tlakem</h3>
        <p>Elektrický systém střídá zatížení vzduchových komor. Může být vhodný v konkrétních klinických situacích, ale <strong>o potřebě aktivního systému rozhoduje posouzení rizika a stavu kůže</strong>, nikoli vyšší cena nebo počet komor.</p>
        <p><strong>Ověřit:</strong> intervaly a funkce podle návodu, rozsah zatížení, alarmy, výpadek proudu, bezpečný přesun, hluk, způsob údržby a servis.</p>
      </article>
      <article class="zp-decision-card">
        <h3>Vzduchová podložka položená na jiné matraci</h3>
        <p>Některé nízké systémy fungují pouze v kombinaci se základní matrací. Jiné mohou být úplnou náhradou matrace. <strong>Nepokládejte podložku přímo na rošt</strong>, pokud výrobce určuje jiný způsob vrstvení.</p>
        <p><strong>Ověřit:</strong> požadovanou spodní vrstvu, výslednou výšku celé sestavy a bezpečné použití bočních zábran.</p>
      </article>
    </div>
    <p><strong>Co říkají odborné podklady:</strong> klinické doporučení NICE počítá u rizikových lidí s kvalitním tlak redistribuujícím pěnovým povrchem a v některých situacích zvažuje dynamický systém. Novější mezinárodní doporučení řeší také mobilitu, stav kůže, mikroklima a kompatibilitu celé sestavy. Tyto zásady nejsou návod k určení diagnózy na dálku.</p>
  </div></section>

  <section id="srovnani-matraci" class="zp-section zp-section-soft" aria-labelledby="srovnani-matraci-nadpis"><div class="zp-wrap">
    <p class="zp-kicker">Konkrétní modely · technické srovnání po odborném výběru typu</p>
    <h2 id="srovnani-matraci-nadpis" class="zp-section-title">Antidekubitní matrace 90 × 200 cm: tři odlišné konstrukce a možnost pronájmu</h2>
    <p>Nejde o žebříček ani o návod k určení rizika dekubitů. Příklady ukazují, proč je potřeba znát skutečnou výšku, rozsah zatížení a konstrukci, i když se všechny výrobky nabízejí pro podobně velké lůžko. Nejprve musí odborník určit vhodný druh povrchu; poté se s dodavatelem ověřuje konkrétní sestava.</p>
    <p>Katalogové podklady načteny 28. 11. 2026. U pěnového modelu a nízké vzduchové podložky jsou dostupné starší snímky stránek, proto jejich cenu a dostupnost neuvádíme jako aktuální. Technické hodnoty před objednáním potvrďte podle dokumentace konkrétního výrobku.</p>
    <div class="zp-walker-compare-grid">
      <article class="zp-walker-compare-card">
        <h3>SYST'AM STANDARD P111M</h3>
        <p class="zp-walker-compare-model">Pěnová matrace bez elektrického kompresoru</p>
        <dl>
          <div><dt>Určený rozměr roštu</dt><dd>90 × 200 cm</dd></div>
          <div><dt>Skutečný rozměr matrace</dt><dd>86 × 198 × 14 cm</dd></div>
          <div><dt>Efektivní rozsah zatížení</dt><dd>35–130 kg</dd></div>
          <div><dt>Hmotnost matrace</dt><dd>11 kg</dd></div>
          <div><dt>Materiál</dt><dd>Prořezávaná PUR pěna, 40 kg/m³</dd></div>
          <div><dt>Polohovací rošt</dt><dd>Dodavatel uvádí vhodnost k polohování</dd></div>
        </dl>
        <p>Rozměr roštu není totožný s fyzickým rozměrem matrace. U konkrétní postele proto ověřte bezpečnost mezer, výšku zábran a kompatibilitu. Cenu potvrďte u dodavatele.</p>
        <p><a class="zp-text-link" href="https://www.dmapraha.cz/standard-p111m_z274/" target="_blank" rel="noopener noreferrer">Katalog P111M a návod výrobce</a></p>
      </article>
      <article class="zp-walker-compare-card">
        <h3>UNIZDRAV P4840</h3>
        <p class="zp-walker-compare-model">Nízká vzduchová podložka se základní matrací</p>
        <dl>
          <div><dt>Rozměr po nafouknutí</dt><dd>90 × 200 × 7 cm</dd></div>
          <div><dt>Provozní rozsah zatížení</dt><dd>35–135 kg</dd></div>
          <div><dt>Konstrukce</dt><dd>130 vzduchových buněk</dd></div>
          <div><dt>Materiál</dt><dd>PVC</dd></div>
          <div><dt>Obsah balení</dt><dd>Podložka, kompresor, sada na opravu</dd></div>
          <div><dt>Spodní vrstva</dt><dd>Podle dodavatele základní matrace</dd></div>
        </dl>
        <p>Nejde o automatickou náhradu původní matrace. Dodavatel ji popisuje pro použití při nízkém riziku; vhodnost určuje zdravotník. Zkontrolujte také omezení hygienického použití jedním člověkem. Cenu ověřte v aktuální nabídce.</p>
        <p><a class="zp-text-link" href="https://unizdrav.cz/zbozi/4840/antidekubitni-matrace-s-kompresorem-unizdrav" target="_blank" rel="noopener noreferrer">Katalog P4840 a požadavky na spodní vrstvu</a></p>
      </article>
      <article class="zp-walker-compare-card">
        <h3>FOFO HF 6008</h3>
        <p class="zp-walker-compare-model">Vysoký aktivní vzduchový systém s alarmem</p>
        <?php if ( $zp_mattress_retail_fresh ) : ?><p><strong>11 680 Kč</strong> · katalogový snímek načtený 28. 11. 2026</p><?php else : ?><p>Cenu ověřte v aktuálním katalogu.</p><?php endif; ?>
        <dl>
          <div><dt>Rozměr matrace</dt><dd>90 × 200 × 20,3 cm</dd></div>
          <div><dt>Efektivní rozsah zatížení</dt><dd>40–140 kg</dd></div>
          <div><dt>Komory</dt><dd>19, z toho 3 statické pod hlavou</dd></div>
          <div><dt>Upozornění</dt><dd>Alarm při kritickém poklesu tlaku</dd></div>
          <div><dt>Příkon kompresoru</dt><dd>7 W</dd></div>
          <div><dt>Potah</dt><dd>Snímatelný, omyvatelný</dd></div>
        </dl>
        <p>Dodavatel uvádí použití při vysokém až velmi vysokém riziku. Neodvozujte vhodnost z tohoto popisu bez zdravotníka. U vysoké matrace nechte posoudit zejména bezpečnost zábran, přesuny a postup při poruše.</p>
        <p><a class="zp-text-link" href="https://www.dmapraha.cz/hf-6008_z35653/" target="_blank" rel="noopener noreferrer">Katalog HF 6008 a dokumentace</a></p>
      </article>
    </div>
    <p class="zp-disclaimer">Katalogové údaje neznamenají potvrzenou klinickou vhodnost ani individuální úhradu. Cena je datované pozorování, nikoli nabídka Zápraží; po uplynutí intervalu se skryje. Nezaručujeme dostupnost. Odkazy jsou zdrojové, nikoli individuální nákupní doporučení.</p>
    <h3>Proč stejný rozměr 90 × 200 cm neznamená zaměnitelnost?</h3>
    <p>P111M je vysoká 14 cm. Kdyby měla být na takovou matraci přidána podložka P4840 s nominální výškou 7 cm, jednoduchý součet je 21 cm. Nejde ale o doporučenou kombinaci. Chybí potvrzení vrstvení a zábran; skutečná výška se mění se zatížením. HF 6008 má samostatně nominálních 20,3 cm. Čísla ilustrují nutnost posoudit celou sestavu, nikoli určit přípustnou výšku zábrany.</p>
    <p>Podobně není limit 140 kg automaticky důkazem vhodnosti pro každého s nižší hmotností. U aktivních systémů je významná i spodní mez zatížení, nastavení podle návodu a individuální klinické doporučení. Zeptejte se rovněž, zda konkrétní rošt, rám, bočnice a způsob vstávání vyhovují kombinaci. <a class="zp-text-link" href="#rozmery-kompatibilita-matrace">Projít osm technických kontrol</a>.</p>
    <h3>Vyměnit pouze poškozenou podložku, nebo celý systém?</h3>
    <p>Pokud máte kompresor z dřívějška, nestačí objednat libovolnou vzduchovou podložku podobné velikosti. Například starší katalog UNIZDRAV P1421 popisuje samostatný náhradní díl bez kompresoru s rozsahem 30–110 kg a rozměrem 200 × 88 cm. To není stejný rozsah jako P4840. Kompatibilita P1421 s P4840 není doložena; oba kódy jsou zde pouze příklady rozdílných výrobků.</p>
    <p>Uveďte dodavateli přesný model a výrobní označení kompresoru, požadujte písemné potvrzení vhodné náhrady a postupu při poruše. Nepřipojujte neověřenou podložku a nepoužívejte opravu jako náhradu odborného posouzení. <a class="zp-text-link" href="https://unizdrav.cz/zbozi/1421/nahradni-antidekubitni-matrace-ke-kompresoru" target="_blank" rel="noopener noreferrer">Starší katalog P1421 – příklad samostatného dílu</a>.</p>
    <div class="zp-resource-callout" id="pujceni-antidekubitni-matrace">
      <h3>Půjčení antidekubitní matrace s kompresorem: konkrétní příklad</h3>
      <p>DMA Praha zveřejňuje pronájem modelu PA 1500 (90 × 200 × 15 cm, katalogová nosnost 140 kg). Nejde o stejný model jako HF 6008 ani P4840. Odbornou vhodnost, potřebnou spodní vrstvu a kompatibilitu lůžka ověřte před rezervací.</p>
      <?php if ( $zp_mattress_rental_fresh ) : ?>
        <p>Ve veřejném ceníku načteném 28. 11. 2026 je uvedeno <strong>450 Kč za dva týdny, 600 Kč za měsíc a vratná kauce 1 500 Kč</strong>. Minimální doba zápůjčky jsou dva týdny.</p>
        <div class="zp-decision-grid">
          <article class="zp-decision-card"><h4>1 měsíc</h4><p>600 Kč nájem; 2 100 Kč včetně kauce, bez dalších služeb.</p></article>
          <article class="zp-decision-card"><h4>3 měsíce</h4><p>1 800 Kč nájem; 3 300 Kč celkové výdaje před vrácením kauce, bez dalších služeb.</p></article>
          <article class="zp-decision-card"><h4>6 měsíců</h4><p>3 600 Kč nájem; 5 100 Kč celkové výdaje před vrácením kauce, bez dalších služeb.</p></article>
        </div>
        <p>Jde o prostý model součtu měsíčních sazeb, ne potvrzenou nabídku. Dopravu, hygienickou přípravu, servis a platné podmínky vrácení potvrďte s půjčovnou. Pokud je kauce vrácena v plné výši, není konečným nákladem.</p>
      <?php else : ?><p>Starší cenový snímek již nezobrazujeme. Ověřte aktuální sazbu, kauci, minimální délku pronájmu a související poplatky.</p><?php endif; ?>
      <p><a class="zp-text-link" href="https://www.dmapraha.cz/pa-1500_z930/" target="_blank" rel="noopener noreferrer">Ceník půjčovny PA 1500 a kontakt</a> · <a href="tel:+420800700955">800 700 955</a>. Zeptejte se na podmínky hygieny, dostupnost, potřebnou spodní matraci, dopravu a postup při závadě.</p>
    </div>
    <p><a class="zp-text-link" href="<?php echo esc_url( home_url( '/polohovaci-postel/#srovnani-polohovacich-posteli' ) ); ?>">Srovnání polohovacích postelí</a> · <a class="zp-text-link" href="<?php echo esc_url( home_url( '/polohovaci-postel-na-pojistovnu/#porovnani-pujceni-postele' ) ); ?>">Spočítat náklady celého lůžka</a></p>
  </div></section>

  <section id="rozmery-kompatibilita-matrace" class="zp-section zp-section-soft" aria-labelledby="rozmery-matrace-nadpis"><div class="zp-wrap">
    <p class="zp-kicker">Kontrolní seznam před objednáním</p>
    <h2 id="rozmery-matrace-nadpis" class="zp-section-title">Osm údajů, bez kterých nelze bezpečně potvrdit kompatibilitu.</h2>
    <div class="zp-decision-grid">
      <article class="zp-decision-card"><h3>01 · Vnitřní rozměr ložné plochy</h3><p>Vezměte délku a šířku určené výrobcem postele. Nominální označení matrace 90 × 200 cm samo nezaručuje vhodnost v konkrétním rámu.</p></article>
      <article class="zp-decision-card"><h3>02 · Výška a výsledná tloušťka sestavy</h3><p>Pokud přidáváte podložku na základní matraci, sčítá se výsledná výška. Ta může změnit bezpečnost bočních zábran i polohu člověka při přesunu.</p></article>
      <article class="zp-decision-card"><h3>03 · Kompatibilita s polohováním</h3><p>Zkontrolujte, že výrobce připouští konkrétní typ pro dělený rošt, zvedání zad a nohou. Při pohybu postele se nesmějí nebezpečně zalamovat hadice či pohybovat matrace.</p></article>
      <article class="zp-decision-card"><h3>04 · Nosnost a skutečný rozsah nastavení</h3><p>Nejde pouze o maximální hmotnost: aktivní systém může mít také spodní mez použitelnosti nebo doporučený provozní rozsah. Parametry musí sedět na konkrétního uživatele a model.</p></article>
      <article class="zp-decision-card"><h3>05 · Boční zábrany a riziko zaklínění</h3><p>Ověřte mezery mezi matrací, zábranou, čelem a rámem i bezpečnou účinnou výšku zábran. Nevhodná sestava může být nebezpečná i při správné nosnosti.</p></article>
      <article class="zp-decision-card"><h3>06 · Kryt, tekutiny a hygiena</h3><p>Pro domácí péči bývá důležité, zda je potah určen pro daný režim čištění a případnou inkontinenci. Nepřidávejte neověřené vrstvy, které mohou změnit účinek povrchu.</p></article>
      <article class="zp-decision-card"><h3>07 · Kompresor, napájení a alarmy</h3><p>Prověřte bezpečné umístění, přívod proudu, hluk, cestu kabelu, správné hadice a chování při výpadku. Kompresor nesmí vytvářet novou překážku na noční trase kolem postele.</p></article>
      <article class="zp-decision-card"><h3>08 · Přesun a domácí plán péče</h3><p>Výška matrace může ovlivnit usednutí, vstávání či přesun na vozík. Ptejte se odborníka na bezpečné přesuny, péči o kůži a plán polohování — nelze jej nahradit nákupem dražšího modelu.</p></article>
    </div>
  </div></section>

  <section id="priklady-matrace-postel" class="zp-section" aria-labelledby="priklady-matrace-nadpis"><div class="zp-wrap">
    <p class="zp-kicker">Dvě běžné chyby</p>
    <h2 id="priklady-matrace-nadpis" class="zp-section-title">Proč nestačí koupit „antidekubitní matraci 90 × 200“?</h2>
    <div class="zp-decision-grid">
      <article class="zp-decision-card">
        <h3>Na posteli už je 12cm matrace, přidává se 7cm aktivní podložka</h3>
        <p>Výsledná nominální výška vrstev je <strong>19 cm</strong>. To ještě nic neříká o skutečné účinné výšce zábrany, stlačení pod zátěží ani o povoleném vrstvení podle návodu. Pokud výrobce kombinaci nepotvrzuje nebo bezpečnost zábran není posouzena, sestavu nepoužívejte jako „automaticky bezpečnou“.</p>
      </article>
      <article class="zp-decision-card">
        <h3>Na elektrickou postel se kupuje samostatná komorová matrace</h3>
        <p>Potřebujete vědět, zda je model určen jako úplná náhrada původní matrace, či jako podložka na ni. Liší se požadavky na rošt, rozměry, hadice, kompresor a bezpečný přesun. Stejný rozměr na obalu neznamená stejné použití.</p>
      </article>
    </div>
    <p class="zp-disclaimer">Příklady jsou ilustrační aritmetika a ukázka technických dotazů — ne doporučení konkrétního produktu ani přípustné výšky matrace či bočních zábran.</p>
  </div></section>

  <section id="pracovni-list-matrace" class="zp-section zp-section-soft" aria-labelledby="pracovni-list-matrace-nadpis"><div class="zp-wrap">
    <p class="zp-kicker">Pracovní list pro rodinu a pečující tým</p>
    <h2 id="pracovni-list-matrace-nadpis" class="zp-section-title">Sedm údajů před rozhovorem s odborníkem nebo dodavatelem.</h2>
    <ol>
      <li><strong>Postel:</strong> výrobce a model ____; rozměr určený pro matraci ____; typ roštu ____.</li>
      <li><strong>Aktuální matrace:</strong> rozměr a výška ____; zda se má vyměnit, nebo zůstat pod podložkou ____.</li>
      <li><strong>Klinické doporučení:</strong> doporučený typ povrchu a kdo jej určil ____; chybí-li, nezačínat výběr podle ceny.</li>
      <li><strong>Technické zatížení:</strong> povolený rozsah výrobce matrace a kompatibilní lůžko ____.</li>
      <li><strong>Boční zábrany:</strong> schválená kombinace matrace, rámu a zábran; riziko mezer a výšky ____.</li>
      <li><strong>Praktický provoz:</strong> hadice, kabel, čištění, výpadek proudu, potřeba servisního zaškolení ____.</li>
      <li><strong>Bezpečný přesun a péče:</strong> ověřený plán přesunu, polohování a sledování kůže ____.</li>
    </ol>
    <p><strong>Co rozhodnout:</strong> při chybějícím doporučení klinické vhodnosti nebo neověřené kompatibilitě postele a matrace je stav <em>neověřeno</em>. Nevybírejte konkrétní variantu pouze podle rozměru, ceny nebo počtu vzduchových komor.</p>
    <p><a class="zp-text-link" href="<?php echo esc_url( home_url( '/polohovaci-postel/#poradce-postel' ) ); ?>">Ověřit také správný typ polohovací postele</a> · <a class="zp-text-link" href="<?php echo esc_url( home_url( '/polohovaci-postel-na-pojistovnu/' ) ); ?>">Prověřit způsob pořízení lůžka a příslušenství</a></p>
  </div></section>

  <section id="faq-antidekubitni-matrace" class="zp-section"><div class="zp-wrap zp-faq">
    <p class="zp-kicker">Často hledané otázky</p>
    <h2 class="zp-section-title">Antidekubitní matrace na polohovací postel: odpovědi bez nákupních zkratek.</h2>
    <details><summary>Musí mít antidekubitní matrace kompresor?</summary><p>Ne. Existují pěnové tlak redistribuující povrchy i různé vzduchové systémy. Zda je potřeba aktivní střídavý tlak, musí vyplynout z odborného posouzení rizika, stavu kůže a potřeb člověka. Kompresor není automaticky „lepší“ pro každého.</p></details>
    <details><summary>Lze položit vzduchovou antidekubitní podložku na běžnou matraci?</summary><p>Pouze pokud přesný model takové vrstvení dovoluje. Některé systémy jsou určeny na základní matraci, jiné ji nahrazují. Musí také vyhovovat výsledná výška, zábrany a způsob polohování lůžka.</p></details>
    <details><summary>Je rozměr 90 × 200 cm vhodný na každou polohovací postel?</summary><p>Ne. Ověřte vnitřní rozměr lůžka, toleranci a především výrobcem schválenou sestavu. Chybná výška nebo mezery u zábran mohou představovat riziko.</p></details>
    <details><summary>Pomůže antidekubitní matrace sama předejít proleženinám?</summary><p>Žádná matrace nenahrazuje odborné hodnocení, sledování kůže, péči o vlhkost či individuální plán změn polohy. Povrch je pouze jedna část celkového preventivního nebo léčebného postupu.</p></details>
    <details><summary>Co když člověk už má proleženinu?</summary><p>Kontaktujte ošetřující zdravotnický tým. Nákupní článek není dostatečný podklad pro rozhodnutí, jaký tlak redistribuující povrch nebo další léčbu potřebuje.</p></details>
    <details><summary>Kolik stojí antidekubitní matrace s kompresorem a její pronájem?</summary><p>Cenu srovnávejte pouze u odborně vhodných systémů včetně potřebné podkladové vrstvy, potahu, servisu a dopravy. <a class="zp-text-link" href="#srovnani-matraci">Srovnání konkrétních konstrukcí</a> a <a class="zp-text-link" href="#pujceni-antidekubitni-matrace">datovaný příklad pronájmu</a> pomohou připravit dotazy na dodavatele.</p></details>
    <details><summary>Má smysl pronájem antidekubitní matrace před nákupem?</summary><p>U dočasné potřeby může být vhodné ověřit dostupnost vhodné varianty v půjčovně. Nejprve však zajistěte odborné doporučení, hygienu, servis, kompatibilitu se zapůjčenou postelí a podmínky vrácení. <a class="zp-text-link" href="<?php echo esc_url( home_url( '/polohovaci-postel-na-pojistovnu/' ) ); ?>">Půjčení lůžka a úhrada jsou odlišné cesty</a>.</p></details>
    <details><summary>Zaplatí antidekubitní matraci pojišťovna?</summary><p>Úhrada závisí na aktuální úhradové kategorii, konkrétním zdravotnickém prostředku, indikaci, předpisu a případném schválení. Nepředpokládejte proplacení již zakoupeného výrobku. Ověřte platná pravidla u předepisujícího a pojišťovny, včetně ePoukazu od roku 2026.</p></details>
  </div></section>

  <section id="zdroje-antidekubitni-matrace" class="zp-section zp-section-soft"><div class="zp-wrap">
    <p class="zp-kicker">Prameny a jejich omezení</p>
    <h2 class="zp-section-title">Proč rozlišujeme odborný plán péče a technický výběr matrace.</h2>
    <p>Obsah vysvětluje bezpečnostní výběr zařízení, ale nemá doloženou individuální klinickou revizi. Konkrétní matraci nemůžeme doporučit bez příslušného odborného posouzení, instrukcí výrobce a ověřené bezpečnosti celé sestavy.</p>
    <ul>
      <li><a href="https://www.nice.org.uk/guidance/cg179/chapter/Recommendations" target="_blank" rel="noopener noreferrer">NICE — Pressure ulcers: prevention and management</a>: speciální pěnové povrchy, kdy zvážit dynamické systémy a nutnost individuálního plánu.</li>
      <li><a href="https://www.internationalguideline.com/surfaces" target="_blank" rel="noopener noreferrer">International Guideline 2025/2026 — Full Body Support Surfaces</a>: odborné posuzování typu povrchu, rizika, mobility, stavu kůže a kompatibility.</li>
      <li><a href="https://www.apta.org/patient-care/evidence-based-practice-resources/cpgs/prevention-treatment-pressure-ulcers-injuries" target="_blank" rel="noopener noreferrer">APTA — klinická doporučení EPUAP/NPIAP/PPPIA</a>: mezinárodní rámec prevence a léčby poškození tlakem.</li>
      <li><a href="https://sukl.gov.cz/zdravotnicke-prostredky/otazky-a-odpovedi-zp/pravidla-pro-predepisovani-a-vydej-zdravotnickych-prostredku-od-1-1-2026/" target="_blank" rel="noopener noreferrer">SÚKL — ePoukaz a pravidla od 1. ledna 2026</a>: pravidla předepisování, nikoli příslib úhrady konkrétní matrace.</li>
      <li><a href="<?php echo esc_url( home_url( '/jak-vznika-doporuceni/' ) ); ?>">Metodika Zápraží</a>: proč při neznámé bezpečnosti doporučujeme nejdřív odborné ověření.</li>
    </ul>
    <p class="zp-disclaimer">Citované zahraniční klinické postupy nenahrazují individuální české zdravotnické doporučení. Pokud se stav kůže zhoršuje, obraťte se na zdravotnického pracovníka, nikoli na obecné nákupní doporučení.</p>
  </div></section>
</main>
<?php get_footer(); ?>
