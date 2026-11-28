<?php
/* ZP_RELEASE_0_8_256 */
/*
Template Name: Zápraží — Nástavec na WC pro seniory
*/
get_header();
?>
<main id="main-content" tabindex="-1">
  <section class="zp-hero">
    <div class="zp-wrap">
      <p class="zp-kicker">Zápraží · WC · Nástavec</p>
      <h1>Nástavec na WC pro seniory: jak vybrat správnou výšku a madla.</h1>
      <p class="zp-lead">Nástavec má smysl jen tehdy, když opravdu řeší nízký sed, bezpečně pasuje na konkrétní WC a po zvýšení zůstane stabilní poloha chodidel. Pokud je při přesunu potřeba fyzická pomoc druhé osoby, online výběr produktu zastavíme.</p>
      <div class="zp-hero-actions">
        <a class="zp-btn" href="#poradce-nastavec-wc">Spustit poradce</a>
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/pomucky-do-koupelny-na-pojistovnu/' ) ); ?>">Jak funguje pojišťovna</a>
        <a class="zp-text-link" href="#vyska-nastavce-5-10-15">Nástavec 5, 10 nebo 15 cm: jakou výšku?</a>
        <a class="zp-text-link" href="#srovnani-nastavcu-na-wc">Porovnat čtyři modely</a>
        <a class="zp-text-link" href="#kontrola-nastavce-na-wc">Co ověřit před výběrem</a>
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/co-zmerit-v-koupelne-pred-vyberem-pomucky/#mereni-wc' ) ); ?>">Změřit WC před nákupem nástavce</a>
      </div>
      <p class="zp-muted-copy">Pokud se potíže objevují hlavně při noční cestě z postele na WC, samotná pomůcka nemusí stačit. <a class="zp-text-link" href="<?php echo esc_url( home_url( '/nocni-cesta-z-postele-na-wc/' ) ); ?>">Projít celou noční trasu a kontrolní seznam</a>.</p>
    </div>
  </section>

  <section id="poradce-nastavec-wc" class="zp-wrap zp-advisor-section">
    <div class="zp-panel">
      <p class="zp-kicker">Domácí poradce · Nástavec na WC</p>
      <h2>Potřebujete jen vyšší sed, nebo i oporu rukama?</h2>
      <p>Neptáme se na diagnózu. Rozhodujeme podle přesunu, kompatibility WC, výsledné výšky, nosnosti a potřeby madel.</p>

      <div id="zp-toilet-riser-advisor" class="zp-advisor-form" role="form" aria-describedby="zp-toilet-riser-privacy">
        <fieldset class="zp-fieldset" data-zp-toilet-required="transferAbility">
          <legend>Jak člověk sedá na WC a vstává?</legend>
          <label class="zp-choice"><input type="radio" name="transferAbility" value="independent" required><span><strong>Samostatně</strong><small>Bez fyzické pomoci druhé osoby.</small></span></label>
          <label class="zp-choice"><input type="radio" name="transferAbility" value="steadying"><span><strong>Potřebuje stabilní oporu rukama</strong><small>Pomoc druhé osoby ke zvednutí není běžně potřeba.</small></span></label>
          <label class="zp-choice"><input type="radio" name="transferAbility" value="person_assist"><span><strong>Je potřeba fyzická pomoc druhé osoby</strong><small>Například zvedání, přidržování nebo výrazné jištění.</small></span></label>
          <label class="zp-choice"><input type="radio" name="transferAbility" value="unknown"><span><strong>Nevím</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-toilet-required="toiletFit">
          <legend>Je ověřeno, že nástavec bezpečně pasuje na konkrétní WC mísu a lze jej pevně uchytit?</legend>
          <label class="zp-choice"><input type="radio" name="toiletFit" value="yes" required><span><strong>Ano</strong></span></label>
          <label class="zp-choice"><input type="radio" name="toiletFit" value="no"><span><strong>Ne, nepasuje</strong></span></label>
          <label class="zp-choice"><input type="radio" name="toiletFit" value="unknown"><span><strong>Zatím nevím</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-toilet-required="feetFlatAtRaisedHeight">
          <legend>Po zvýšení WC dosáhne člověk chodidly bezpečně na podlahu?</legend>
          <label class="zp-choice"><input type="radio" name="feetFlatAtRaisedHeight" value="yes" required><span><strong>Ano</strong></span></label>
          <label class="zp-choice"><input type="radio" name="feetFlatAtRaisedHeight" value="no"><span><strong>Ne</strong></span></label>
          <label class="zp-choice"><input type="radio" name="feetFlatAtRaisedHeight" value="unknown"><span><strong>Nevím</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-toilet-required="loadFit">
          <legend>Je ověřeno, že nosnost konkrétního nástavce bezpečně vyhovuje?</legend>
          <label class="zp-choice"><input type="radio" name="loadFit" value="yes" required><span><strong>Ano</strong><small>Není potřeba zadávat hmotnost člověka.</small></span></label>
          <label class="zp-choice"><input type="radio" name="loadFit" value="no"><span><strong>Ne</strong></span></label>
          <label class="zp-choice"><input type="radio" name="loadFit" value="unknown"><span><strong>Nevím</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset">
          <legend>Jak dlouho bude řešení pravděpodobně potřeba?</legend>
          <label class="zp-choice"><input type="radio" name="duration" value="short_term"><span><strong>Spíš dočasně</strong></span></label>
          <label class="zp-choice"><input type="radio" name="duration" value="long_term"><span><strong>Spíš dlouhodobě</strong></span></label>
          <label class="zp-choice"><input type="radio" name="duration" value="unknown" checked><span><strong>Nevím</strong></span></label>
        </fieldset>

        <section id="zp-toilet-riser-preview" class="zp-result" tabindex="-1" aria-live="polite" hidden></section>
        <section id="zp-toilet-riser-fit-stage" class="zp-bathroom-fit-stage" aria-labelledby="zp-toilet-riser-fit-title" hidden>
          <h3 id="zp-toilet-riser-fit-title">2. Ověřte nosnost a rozměry konkrétní pomůcky</h3>
          <p class="zp-muted-copy zp-fit-measurement-help">Nevíte, jak změřit výšku sedu, tvar mísy a prostor u WC? <a class="zp-text-link" href="<?php echo esc_url( home_url( '/co-zmerit-v-koupelne-pred-vyberem-pomucky/#mereni-wc' ) ); ?>" target="_blank" rel="noopener noreferrer">Praktický kontrolní návod (nová karta)</a>. Rozměry samy o sobě nezaručují bezpečné použití.</p>
          <p>V předchozím kroku jste viděli model i technické údaje. Teď ověřte, zda vyhovují člověku a prostředí doma. Při nejistotě vyberte <strong>Nevím</strong>.</p>
        </section>
        <div id="zp-toilet-riser-errors" class="zp-advisor-errors" role="alert" aria-live="assertive" hidden></div>
        <button class="zp-btn zp-submit" type="button" id="zp-toilet-riser-submit">1. Ukázat možný výrobek</button>
        <p id="zp-toilet-riser-privacy" class="zp-privacy-note">Odpovědi zůstávají v prohlížeči. Do affiliate ani analytiky neposíláme kombinaci odpovědí.</p>
      </div>

      <noscript><p class="zp-disclaimer">Pro spuštění poradce je potřeba JavaScript. Bez něj se žádné odpovědi neodesílají.</p></noscript>
      <section id="zp-toilet-riser-result" class="zp-result" aria-live="polite" tabindex="-1" hidden></section>
    </div>
  </section>


  <section id="vyska-nastavce-5-10-15" class="zp-section" aria-labelledby="vyska-nastavce-title" data-zp-editorial-guide="toilet-riser-height">
    <div class="zp-wrap">
      <p class="zp-kicker">Praktický návod · Výška nástavce na WC</p>
      <h2 id="vyska-nastavce-title" class="zp-section-title">Nástavec na WC 5, 10 nebo 15 cm: jak poznat správnou výšku?</h2>
      <p>Neexistuje jedna výška vhodná pro všechny. Pět, deset a patnáct centimetrů jsou příklady vyráběných variant, <strong>nikoli doporučení podle věku nebo diagnózy</strong>. U konkrétního člověka rozhoduje výsledná výška sedu, pevná opora chodidel, možnost bezpečně si sednout a vstát, způsob připevnění i případná opora rukou.</p>

      <div class="zp-decision-grid">
        <article class="zp-decision-card">
          <h3>Zvýšení o 5 cm</h3>
          <p>Menší změna výšky může stačit, když je WC jen mírně nízké. Samotné číslo ale nedokazuje, že se člověku bude bezpečně vstávat. Ověřte dosah chodidel a stabilitu při usednutí.</p>
        </article>
        <article class="zp-decision-card">
          <h3>Zvýšení o 10 cm</h3>
          <p>Další běžně nabízená varianta, ne univerzální volba pro každého seniora. Porovnejte skutečnou výslednou výšku s možnostmi člověka; nepočítejte s tím, že vyšší WC vždy usnadní přesun.</p>
        </article>
        <article class="zp-decision-card">
          <h3>Zvýšení o 15 cm</h3>
          <p>Výraznější zvýšení může zároveň znamenat, že chodidla přestanou bezpečně dosahovat na podlahu. Pokud se to stane, danou variantu nepoužívejte. Jiný zdravotní stav nebo pooperační omezení vyžaduje individuální doporučení odborníka.</p>
        </article>
      </div>

      <h3>Jak si výšku a kompatibilitu ověřit doma — šest kroků</h3>
      <ol>
        <li><strong>Změřte okraj WC mísy od pevné podlahy.</strong> Poznamenejte si, zda současné prkénko zůstává při používání na míse. Některé nástavce se montují místo něj, ne na něj.</li>
        <li><strong>Najděte montážní výšku přesného modelu.</strong> Z technického listu zjistěte, o kolik bude sedací plocha po předepsané montáži skutečně výše. Nesčítejte automaticky výšku stávajícího prkénka a nového nástavce.</li>
        <li><strong>Zkontrolujte výslednou polohu sedu.</strong> Člověk musí mít při sezení stabilně podepřená chodidla o podlahu a zvládnout sednutí i vstávání bezpečným způsobem. Pokud to není jasné, nechte výšku posoudit fyzioterapeutem či ergoterapeutem.</li>
        <li><strong>Ověřte tvar mísy a způsob uchycení.</strong> Musí pasovat přesně použitý způsob fixace. U modelů s patkami se řiďte pořadím a dotažením v dodaném návodu; nástavec se před usednutím nesmí viklat ani posouvat.</li>
        <li><strong>Prověřte potřebu opory rukou a samotný přesun.</strong> Vyšší sed nenahrazuje vhodné madlo či rám. Pokud člověka běžně zvedá nebo výrazně jistí druhá osoba, online nákupní výběr přerušte a řešte bezpečný způsob přesunu s odborníkem.</li>
        <li><strong>Porovnejte nosnost a každodenní použití.</strong> Ověřte limit konkrétního modelu, jeho údržbu i stabilitu po čištění. Limity různých výrobců se liší; nelze je převzít z podobně vypadajícího výrobku.</li>
      </ol>

      <div class="zp-grid">
        <article class="zp-card">
          <h3>Co si před výběrem zapsat</h3>
          <p>Výška okraje mísy od podlahy: ______ cm</p>
          <p>Prkénko podle montážního návodu zůstává / nezůstává: ______</p>
          <p>Výška zvolené montované varianty: ______ cm</p>
          <p>Chodidla na podlaze a bezpečný přesun ověřeny: ano / ne / nevím</p>
        </article>
        <article class="zp-card">
          <h3>Kdy nepokračovat k nákupu</h3>
          <p>Pokud nástavec nesedí na mísu, pohybuje se, není ověřena jeho nosnost, chodidla po zvýšení nedosahují na podlahu nebo přesun vyžaduje fyzické zvedání, <strong>nejde o bezpečně vybranou pomůcku</strong>. Místo přidávání další výšky ověřte vhodnější variantu s odborníkem.</p>
        </article>
      </div>

      <p><a class="zp-link-btn" href="#poradce-nastavec-wc">Ověřit vhodnost v bezpečném poradci nástavce na WC</a> · <a class="zp-text-link" href="<?php echo esc_url( home_url( '/co-zmerit-v-koupelne-pred-vyberem-pomucky/#mereni-wc' ) ); ?>">Měřicí postup pro celé WC a okolí</a> · <a class="zp-text-link" href="<?php echo esc_url( home_url( '/madlo-k-wc-pro-seniory/#poradce-opora-wc' ) ); ?>">Kdy je potřeba spíše opora rukou</a></p>
      <p class="zp-muted-copy">Technický příklad a bezpečnost montáže: <a href="https://www.dmapraha.cz/data/files/manual/ROMA_Navod_496x%2C497x_NastavecWC_cs.pdf" target="_blank" rel="noopener noreferrer">Roma Medical / DMA Praha — návod k řadě nástavců 5, 10 a 15 cm (PDF)</a>. Uvedené výšky a technické parametry se týkají konkrétní výrobní řady, ne všech nástavců na trhu. Vždy platí návod přesného zakoupeného modelu. Text není nezávisle odborně revidován a není náhradou individuálního doporučení.</p>
    </div>
  </section>

  <section id="srovnani-nastavcu-na-wc" class="zp-section" aria-labelledby="zp-riser-comparison-title">
    <div class="zp-wrap">
      <p class="zp-kicker">Produktové srovnání · přesný model a uchycení</p>
      <h2 id="zp-riser-comparison-title" class="zp-section-title">Čtyři konkrétní nástavce na WC: 5, 10, 11,5 a 15 cm</h2>
      <p class="zp-guide-quick-answer"><strong>Porovnejte výšku, nosnost, způsob fixace a prostor kolem mísy, nikoli jen cenu.</strong> Pokud potřebujete madla, nesrovnávejte jednoduchý nástavec bez opor jako plnohodnotnou alternativu. Katalogové údaje neprokazují vhodnost pro konkrétního člověka.</p>
      <div class="zp-walker-compare-grid zp-walker-compare-grid-two">
        <article class="zp-walker-compare-card">
          <h3>Ashby Easyfit 63122</h3>
          <p><strong>5 cm · bez madel</strong></p>
          <dl><div><dt>Zvýšení</dt><dd>5 cm</dd></div><div><dt>Nosnost</dt><dd>190 kg</dd></div><div><dt>Vnější rozměry</dt><dd>38 × 39 cm</dd></div><div><dt>Otvor</dt><dd>21 × 25 cm</dd></div></dl>
          <p>Dva nastavitelné fixační šrouby (30–36 cm).</p>
          <p><a class="zp-text-link" href="https://www.dmapraha.cz/ashby-easyfit-63122_z36752/" target="_blank" rel="noopener noreferrer">Zdroj technických údajů</a></p>
        </article>
        <article class="zp-walker-compare-card">
          <h3>A&E 575 B/DELUXE</h3>
          <p><strong>10 cm · s poklopem</strong></p>
          <dl><div><dt>Zvýšení</dt><dd>10 cm</dd></div><div><dt>Nosnost</dt><dd>190 kg</dd></div><div><dt>Vnější rozměry</dt><dd>Vyžádat</dd></div><div><dt>Otvor</dt><dd>Vyžádat</dd></div></dl>
          <p>Dva fixační šrouby, bez madel.</p>
          <p><a class="zp-text-link" href="https://www.dmapraha.cz/575-b-deluxe_z36831/" target="_blank" rel="noopener noreferrer">Zdroj technických údajů</a></p>
        </article>
        <article class="zp-walker-compare-card">
          <h3>BESCO BES-BS15</h3>
          <p><strong>11,5 cm · odnímatelná madla</strong></p>
          <dl><div><dt>Zvýšení</dt><dd>11,5 cm</dd></div><div><dt>Nosnost</dt><dd>100 kg</dd></div><div><dt>Vnější rozměry</dt><dd>Vyžádat včetně madel</dd></div><div><dt>Otvor</dt><dd>Vyžádat</dd></div></dl>
          <p>Šnekový šroub a zajišťovací deska; EAN 6975196415218.</p>
          <p><a class="zp-text-link" href="https://www.rehabilitacnipomucky.cz/besco-nastavec-na-wc-s-odnimatelnymi-madly/" target="_blank" rel="noopener noreferrer">Zdroj technických údajů</a></p>
        </article>
        <article class="zp-walker-compare-card">
          <h3>UNIZDRAV P2868</h3>
          <p><strong>15 cm · s poklopem</strong></p>
          <dl><div><dt>Zvýšení</dt><dd>15 cm</dd></div><div><dt>Nosnost</dt><dd>100 kg</dd></div><div><dt>Vnější rozměry</dt><dd>36 × 40 cm</dd></div><div><dt>Otvor</dt><dd>21 × 26 cm</dd></div></dl>
          <p>Boční fixační šrouby, bez madel.</p>
          <p><a class="zp-text-link" href="https://unizdrav.cz/zbozi/2868/zvysovac-wc-s-priklopem-unizdrav-15-cm" target="_blank" rel="noopener noreferrer">Zdroj technických údajů</a></p>
        </article>
      </div>
      <p class="zp-muted-copy">Katalogové podklady načtené 28. 11. 2026. U chybějících rozměrů záměrně uvádíme „Vyžádat“. Cena, sklad a individuální úhrada nejsou tímto potvrzené. Ashby a A&amp;E jsou srovnávací příklady, nikoli noví kandidáti poradce. Odkazy vedou na zdroje údajů bez affiliate provize.</p>
      <h3>Proč se nástavec nemusí vejít na závěsné nebo hranaté WC?</h3>
      <p>Označení „univerzální“ není záruka shody. U konkrétní mísy záleží na tvaru horního okraje, skutečné šířce, místě pro fixační části a přístupu ke šroubům. U nástavce s madly navíc zkontrolujte volný prostor mezi WC, stěnou, skříňkou nebo topením. Vnější rozměry samotného nástavce nemusí popisovat šířku včetně opor. Neodhadujte je z fotografie.</p>
      <h3>Jak porovnat výslednou výšku bez dvojího započítání prkénka?</h3>
      <p>Ilustrační příklad: okraj keramické mísy je 40 cm nad podlahou, současný sed s prkénkem má 43 cm. Pokud se nástavec podle návodu montuje místo prkénka a skutečné zvýšení od okraje mísy činí 5 cm, výsledný sed je přibližně 45 cm, nikoli 48 cm. U varianty se zvýšením 10 cm od stejné základny vychází 50 cm. Skutečnou výšku vždy potvrďte podle montážního návodu a přeměřte po instalaci; nejde o doporučenou výšku.</p>
      <h3>Čtyři otázky pro prodejce před objednáním</h3>
      <ul class="zp-checklist">
        <li>Jaký je přesný objednací kód, návod a povolený tvar a rozsah rozměrů mísy?</li>
        <li>Musí se původní prkénko demontovat a od které plochy se měří výsledné zvýšení?</li>
        <li>Jaké jsou celkové rozměry s madly, prostor nutný k montáži a limit zatížení přesného modelu?</li>
        <li>Jaké jsou podmínky vrácení hygienického výrobku, pokud po kontrole bez použití zjistíte nekompatibilitu?</li>
      </ul>
      <p>Podmínky vrácení si vyjasněte před rozbalením a použitím. Pokud potřebujete úhradu, nejprve prověřte přesný kód prostředku a aktuální předpis; katalogové označení ani podobný výrobek úhradu nezaručují.</p>
      <div class="zp-hero-actions">
        <a class="zp-btn" href="#poradce-nastavec-wc">Ověřit vhodný typ v poradci</a>
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/co-zmerit-v-koupelne-pred-vyberem-pomucky/#mereni-wc' ) ); ?>">Změřit WC a okolí</a>
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/pomucky-do-koupelny-na-pojistovnu/' ) ); ?>">Prověřit úhradu před nákupem</a>
      </div>
      <p class="zp-disclaimer">Pokud není možné bezpečné sednutí a vstávání bez fyzické pomoci, správné upevnění nebo stabilní opora chodidel, nepokračujte k výběru konkrétního výrobku. Potřebný způsob přesunu musí posoudit odborník.</p>
    </div>
  </section>

  <section class="zp-section zp-section-soft">
    <div class="zp-wrap">
      <p class="zp-kicker">Dva různé problémy</p>
      <h2 class="zp-section-title">Vyšší sed a opora rukama nejsou totéž.</h2>
      <div class="zp-decision-grid">
        <article class="zp-decision-card">
          <h3>Jen vyšší sed</h3>
          <p>Pokud člověk přesedá samostatně a hlavní problém je nízké WC, kandidátní řešení je jednoduchý nástavec. V našem ověřeném shortlistu je UNIZDRAV P2868 se zvýšením 15 cm.</p>
        </article>
        <article class="zp-decision-card">
          <h3>Vyšší sed + opora rukama</h3>
          <p>Pokud člověk potřebuje stabilní oporu při sedání nebo vstávání, ale ne fyzické zvedání druhou osobou, dává smysl varianta s madly. Ověřený BESCO BS15 zvyšuje sed o 11,5 cm.</p>
        </article>
        <article class="zp-decision-card">
          <h3>Fyzická pomoc druhé osoby</h3>
          <p>To už není jednoduchý „výběr nástavce“. Nejdřív je potřeba ověřit bezpečný způsob přesunu a vhodný typ pomůcky.</p>
        </article>
      </div>
    </div>
  </section>

  <section class="zp-section">
    <div class="zp-wrap">
      <p class="zp-kicker">Co před nákupem změřit</p>
      <h2 class="zp-section-title">Nejdůležitější je výsledná výška a kompatibilita.</h2>
      <div class="zp-grid">
        <article class="zp-card"><h3>WC mísa a uchycení</h3><p>Nástavec musí sedět na konkrétní mísu a po dotažení se nesmí posouvat. Univerzální označení samo o sobě nestačí.</p></article>
        <article class="zp-card"><h3>Výsledná výška sedu</h3><p>Po zvýšení musí člověk bezpečně sedět a chodidly dosáhnout na podlahu. Vyšší není automaticky lepší.</p></article>
        <article class="zp-card"><h3>Nosnost</h3><p>Ověřte, že deklarovaná nosnost konkrétního výrobku s rezervou vyhovuje. Zápraží hmotnost člověka nepotřebuje znát ani ukládat.</p></article>
      </div>
    </div>
  </section>

  <section class="zp-section zp-section-soft">
    <div class="zp-wrap">
      <p class="zp-kicker">Pojišťovna</p>
      <h2 class="zp-section-title">Retail nástavec není automaticky nástavec „na pojišťovnu“.</h2>
      <p>Uhrazená cesta se ověřuje podle přesného zdravotnického prostředku a aktuálních podmínek. Zápraží proto vede P2868 a BESCO BS15 jako maloobchodní kandidáty, dokud nemáme pro konkrétní výrobek ověřený účinný úhradový záznam.</p>
      <p><a class="zp-link-btn" href="<?php echo esc_url( home_url( '/pomucky-do-koupelny-na-pojistovnu/' ) ); ?>">Jak funguje úhrada pomůcek do koupelny a na WC</a></p>
    </div>
  </section>

  <section class="zp-section zp-section-soft" data-zp-context-links="toilet-riser">
    <div class="zp-wrap">
      <p class="zp-kicker">Když toto řešení nestačí</p>
      <h2 class="zp-section-title">Když zvýšení WC nestačí</h2>
      <p>Pokud je hlavní obtíž bezpečný úchop při sedání a vstávání, samotný vyšší sed nemusí stačit. Nejdřív si ujasněte, zda je potřeba stabilní opora a zda lze bezpečně ověřit kotvení.</p>
      <nav aria-label="Související bezpečné kroky">
        <p><a class="zp-text-link" href="<?php echo esc_url( home_url( '/madlo-k-wc-pro-seniory/#poradce-opora-wc' ) ); ?>">Porovnat madlo a toaletní oporu</a></p>
        <p><a class="zp-text-link" href="<?php echo esc_url( home_url( '/koupelna-a-wc/#poradce-koupelna' ) ); ?>">Vybrat podle problému u WC</a></p>
      </nav>
    </div>
  </section>

  <section id="kontrola-nastavce-na-wc" class="zp-section" data-zp-editorial-guide="toilet-riser">
    <div class="zp-wrap">
      <p class="zp-kicker">Před pořízením a montáží</p>
      <h2 class="zp-section-title">Pět kontrol nástavce na WC: správná výška nestačí bez bezpečného uchycení.</h2>
      <p>Nástavec zvyšuje sed, ale nepomůže každému, kdo má potíže vstát. Pokud je potřeba fyzické zvedání druhou osobou nebo stabilní opora, kterou nástavec nezajišťuje, nejdřív prověřte bezpečný způsob přesunu a odlišný typ řešení. Nevybírejte výrobek jen podle počtu centimetrů.</p>
      <div class="zp-decision-grid">
        <article class="zp-decision-card">
          <h3>1. Vyšší sed, nebo také opora rukou?</h3>
          <p>Je-li obtížné především usednutí na nízké WC, může pomoci nástavec. Když člověk potřebuje při vstávání bezpečný úchop, samotný nástavec bez opěr není totéž co varianta s madly. Fyzická pomoc druhé osoby už vyžaduje individuální posouzení přesunu.</p>
        </article>
        <article class="zp-decision-card">
          <h3>2. Změřte mísu a přístup ke šroubům</h3>
          <p>UNIZDRAV P2868 má vnější rozměry 36 × 40 cm, otvor 21 × 26 cm a boční šrouby pro upevnění. Změřte skutečný tvar a okraj WC mísy, okolní prostor a možnost dotažení. Označení „univerzální“ není důkazem bezpečné kompatibility s konkrétní mísou.</p>
        </article>
        <article class="zp-decision-card">
          <h3>3. Výsledná výška a chodidla na podlaze</h3>
          <p>P2868 přidává 15 cm, zatímco BESCO BS15 s odnímatelnými madly 11,5 cm. Po přidání nástavce musí chodidla při sedu stabilně dosáhnout na podlahu; pokud nedosáhnou, nástavec nepoužívejte. Vyšší sed není automaticky bezpečnější.</p>
        </article>
        <article class="zp-decision-card">
          <h3>4. Uchycení bez pohybu</h3>
          <p>Řiďte se přesným návodem dodaného modelu. U nástavce s bočními úchyty je nutné správně dotáhnout upevnění a před usednutím ověřit, že se konstrukce neposouvá. Pokud tvar mísy pevné uchycení neumožní nebo se úchyty časem povolí, nástavec neberte jako bezpečně použitelný.</p>
        </article>
        <article class="zp-decision-card">
          <h3>5. Nosnost konkrétní varianty a údržba</h3>
          <p>U P2868 a BS15 je v ověřených produktových podkladech deklarovaná nosnost 100 kg. Nejde o univerzální limit všech nástavců; musí být zkontrolována konkrétní varianta i její správné připevnění. Po čištění znovu ověřte stabilitu uchycení podle výrobce.</p>
        </article>
      </div>
      <p><a class="zp-text-link" href="<?php echo esc_url( home_url( '/nastavec-na-wc-pro-seniory/#poradce-nastavec-wc' ) ); ?>">Projít bezpečný výběr nástavce</a> · <a class="zp-text-link" href="<?php echo esc_url( home_url( '/madlo-k-wc-pro-seniory/#poradce-opora-wc' ) ); ?>">Pokud je hlavní problém opora, porovnat madlo a rám</a></p>
      <p class="zp-disclaimer">Jde o obecný kontrolní postup, ne o individuální potvrzení vhodnosti. Když není ověřená kompatibilita, opora chodidel, přesun, nosnost nebo uchycení, online poradce konkrétní nákup neodemkne. Nástavec nepoužívejte, pokud nesplňuje podmínky bezpečného použití.</p>
      <p class="zp-muted-copy">Podklady zkontrolovány 12. 10. 2026: <a href="https://www.kingstonandrichmond.nhs.uk/patients-and-families/patient-leaflets/raised-toilet-seat" target="_blank" rel="noopener">Kingston and Richmond NHS — kdy nástavec nepoužívat a opora chodidel</a>; <a href="https://www.worcsacute.nhs.uk/leaflets/how-to-fit-your-raised-toilet-seat/" target="_blank" rel="noopener">Worcestershire NHS — principy bezpečného upevnění</a>; <a href="https://unizdrav.cz/zbozi/2868/zvysovac-wc-s-priklopem-unizdrav-15-cm" target="_blank" rel="noopener">UNIZDRAV — parametry P2868</a>; <a href="https://www.rehabilitacnipomucky.cz/besco-nastavec-na-wc-s-odnimatelnymi-madly/" target="_blank" rel="noopener">RehabilitačníPomůcky — parametry BES-BS15</a>. Zahraniční návody nenahrazují pokyny přesného modelu ani české podmínky úhrady; individuální odborné posouzení není doloženo.</p>
    </div>
  </section>

  <section class="zp-section">
    <div class="zp-wrap zp-faq">
      <p class="zp-kicker">Časté otázky</p>
      <h2 class="zp-section-title">Nástavec na WC: rychlá orientace.</h2>
      <details>
        <summary>Jak vysoký nástavec na WC vybrat?</summary>
        <p>Ne podle toho, který je nejvyšší. Výsledná výška musí umožnit bezpečné sednutí a vstávání a po zvýšení musí zůstat stabilní opora chodidel o podlahu.</p>
      </details>
      <details>
        <summary>Kdy má smysl nástavec s madly?</summary>
        <p>Když člověk přesedá bez fyzické pomoci druhé osoby, ale při sedání nebo vstávání potřebuje stabilní oporu rukama. Pokud je běžně potřeba zvedání nebo výrazné jištění druhou osobou, online poradce konkrétní nástavec nevybírá.</p>
      </details>
      <details>
        <summary>Pasuje nástavec na každý záchod?</summary>
        <p>Ne. Je potřeba ověřit tvar a rozměry konkrétní WC mísy i způsob upevnění. Nástavec musí po instalaci zůstat pevný a bez posunu.</p>
      </details>
      <details>
        <summary>Hradí nástavec na WC zdravotní pojišťovna?</summary>
        <p>Některé konkrétní zdravotnické prostředky hrazené být mohou, ale nelze to určit jen podle názvu kategorie. Před tvrzením o úhradě je potřeba ověřit přesný prostředek a aktuální záznam v seznamu SÚKL.</p>
      </details>
    </div>
  </section>
</main>
<?php get_footer(); ?>
