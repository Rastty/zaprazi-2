<?php
/* ZP_RELEASE_0_8_256 */
/*
Template Name: Zápraží — Toaletní židle pro seniory
*/
get_header();
?>
<main id="main-content" tabindex="-1">
  <section class="zp-hero">
    <div class="zp-wrap">
      <p class="zp-kicker">Zápraží · WC · Toaletní židle</p>
      <h1>Toaletní židle pro seniory: statická u lůžka, nebo 4v1 i do sprchy?</h1>
      <p class="zp-lead">Nejdřív rozlište, zda má židle hlavně zkrátit cestu na toaletu, nebo má jedna pomůcka sloužit i ve sprše a nad WC. Pak teprve řešte rozměry, výšku sedu, stabilitu podkladu, nosnost a bezpečný přesun.</p>
      <p class="zp-muted-copy">Člověk toaletu často nestihne? <a class="zp-text-link" href="<?php echo esc_url( home_url( '/senior-nestihne-dojit-na-wc/#prvni-bezpecnost-wc' ) ); ?>">Nejdřív zjistit příčinu a varovné příznaky</a>. Přenosná židle sama neřeší náhlé nucení ani nebezpečný přesun.</p>
      <div class="zp-hero-actions">
        <a class="zp-btn" href="#poradce-toaletni-zidle">Spustit poradce</a>
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/pomucky-do-koupelny-na-pojistovnu/' ) ); ?>">Jak funguje pojišťovna</a>
        <a class="zp-text-link" href="#kontrola-toaletni-zidle">Co ověřit před výběrem</a>
        <a class="zp-text-link" href="#srovnani-toaletnich-zidli">Srovnat 4 modely toaletních židlí</a>
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/toaletni-zidle-vedle-postele/#sedm-kontrol-zidle-postel' ) ); ?>">Toaletní židle vedle postele: 7 měření</a>
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/co-zmerit-v-koupelne-pred-vyberem-pomucky/#kontrolni-list-koupelna' ) ); ?>">Kontrolní list měření</a>
      </div>
    </div>
  </section>

  <section id="poradce-toaletni-zidle" class="zp-wrap zp-advisor-section">
    <div class="zp-panel">
      <p class="zp-kicker">Domácí poradce · Toaletní židle</p>
      <h2>Co má židle prakticky řešit?</h2>
      <p>Neptáme se na diagnózu. Rozhodujeme podle způsobu použití, přesunu, prostoru, stabilního podkladu a nosnosti.</p>

      <div id="zp-toilet-chair-advisor" class="zp-advisor-form" role="form" aria-describedby="zp-toilet-chair-privacy">
        <details id="zp-toilet-chair-needs-stage" class="zp-bath-needs-stage" open>
          <summary>1. Vaše potřeby a způsob přesunu</summary>
          <div class="zp-bath-needs-fields">
            <p class="zp-advisor-stage-intro">Vyberte skutečnou situaci. Pokud si nejste jistí, odpovězte „Nevím“.</p>
        <fieldset class="zp-fieldset" data-zp-chair-required="chairMode">
          <legend>Jaký je hlavní účel?</legend>
          <label class="zp-choice"><input type="radio" name="chairMode" value="nearby" required><span><strong>Samostatná toaletní židle poblíž lůžka nebo místnosti</strong><small>Hlavně zkrátit obtížnou cestu na běžné WC.</small></span></label>
          <label class="zp-choice"><input type="radio" name="chairMode" value="toilet_shower"><span><strong>Jedna židle pro WC i sprchu</strong><small>Má fungovat jako toaletní i sprchovací židle a případně nad WC.</small></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-chair-required="transferAbility">
          <legend>Jak člověk přesedá na židli?</legend>
          <label class="zp-choice"><input type="radio" name="transferAbility" value="independent" required><span><strong>Samostatně</strong><small>Bez fyzického zvedání druhou osobou.</small></span></label>
          <label class="zp-choice"><input type="radio" name="transferAbility" value="steadying"><span><strong>Potřebuje stabilní oporu rukama</strong><small>Pomoc druhé osoby ke zvednutí není běžně potřeba.</small></span></label>
          <label class="zp-choice"><input type="radio" name="transferAbility" value="person_assist"><span><strong>Je potřeba fyzická pomoc druhé osoby</strong><small>Například zvedání, přidržování nebo výrazné jištění.</small></span></label>
          <label class="zp-choice"><input type="radio" name="transferAbility" value="unknown"><span><strong>Nevím</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-chair-required="floorStable">
          <legend>Bude židle stát na rovném a stabilním podkladu?</legend>
          <label class="zp-choice"><input type="radio" name="floorStable" value="yes" required><span><strong>Ano</strong></span></label>
          <label class="zp-choice"><input type="radio" name="floorStable" value="no"><span><strong>Ne</strong></span></label>
          <label class="zp-choice"><input type="radio" name="floorStable" value="unknown"><span><strong>Nevím</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-chair-required="spaceFit">
          <legend>Je ověřeno, že se židle bezpečně vejde do prostoru i pro přesednutí?</legend>
          <label class="zp-choice"><input type="radio" name="spaceFit" value="yes" required><span><strong>Ano</strong></span></label>
          <label class="zp-choice"><input type="radio" name="spaceFit" value="no"><span><strong>Ne</strong></span></label>
          <label class="zp-choice"><input type="radio" name="spaceFit" value="unknown"><span><strong>Nevím</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-chair-required="loadFit">
          <legend>Je ověřeno, že nosnost konkrétní židle bezpečně vyhovuje?</legend>
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

          </div>
        </details>
        <section id="zp-toilet-chair-preview" class="zp-result" tabindex="-1" aria-live="polite" hidden></section>
        <section id="zp-toilet-chair-fit-stage" class="zp-bathroom-fit-stage" aria-labelledby="zp-toilet-chair-fit-title" hidden>
          <h3 id="zp-toilet-chair-fit-title">2. Ověřte nosnost a rozměry konkrétní pomůcky</h3>
          <p class="zp-muted-copy zp-fit-measurement-help">Nevíte, jak prověřit prostor, stabilní podlahu a přesun? <a class="zp-text-link" href="<?php echo esc_url( home_url( '/co-zmerit-v-koupelne-pred-vyberem-pomucky/#kontrolni-list-koupelna' ) ); ?>" target="_blank" rel="noopener noreferrer">Praktický kontrolní návod (nová karta)</a>. Rozměry samy o sobě nezaručují bezpečné použití.</p>
          <p>V předchozím kroku jste viděli model i technické údaje. Teď ověřte, zda vyhovují člověku a prostředí doma. Při nejistotě vyberte <strong>Nevím</strong>.</p>
        </section>
        <div id="zp-toilet-chair-errors" class="zp-advisor-errors" role="alert" aria-live="assertive" hidden></div>
        <div class="zp-advisor-action">
          <button class="zp-btn zp-submit" type="button" id="zp-toilet-chair-submit">1. Ukázat možný výrobek</button>
        </div>
        <p id="zp-toilet-chair-privacy" class="zp-privacy-note">Odpovědi zůstávají v prohlížeči. Do affiliate ani analytiky neposíláme kombinaci odpovědí.</p>
      </div>

      <noscript><p class="zp-disclaimer">Pro spuštění poradce je potřeba JavaScript. Bez něj se žádné odpovědi neodesílají.</p></noscript>
      <section id="zp-toilet-chair-result" class="zp-result" aria-live="polite" tabindex="-1" hidden></section>
    </div>
  </section>

  <section class="zp-section zp-section-soft">
    <div class="zp-wrap">
      <p class="zp-kicker">Dva různé scénáře</p>
      <h2 class="zp-section-title">Statická židle a 4v1 nejsou totéž.</h2>
      <div class="zp-decision-grid">
        <article class="zp-decision-card">
          <h3>Samostatná toaletní židle</h3>
          <p>Hodí se, když je hlavní problém cesta na běžné WC. Ověřený UNIZDRAV P2807 má šířku 60 cm, sedák 44 cm, výšku sedu 36–60 cm a nosnost 100 kg.</p>
        </article>
        <article class="zp-decision-card">
          <h3>Toaletní / sprchovací židle 4v1</h3>
          <p>Jedna konstrukce může sloužit jako toaletní židle, sprchovací sedačka nebo nástavec nad WC. Ověřený DMA EH-CMDA má šířku 51 cm, výšku sedu 39–54 cm a nosnost 150 kg.</p>
        </article>
        <article class="zp-decision-card">
          <h3>Asistovaný přesun</h3>
          <p>Pokud člověk běžně potřebuje fyzické zvedání nebo výrazné jištění druhou osobou, jednoduchý online shortlist není bezpečný základ pro výběr konkrétní židle.</p>
        </article>
      </div>
    </div>
  </section>

  <section id="srovnani-toaletnich-zidli" class="zp-section" aria-labelledby="zp-commode-comparison-title">
    <div class="zp-wrap">
      <p class="zp-kicker">Čtyři konkrétní modely · rozměry a obsluha</p>
      <h2 id="zp-commode-comparison-title" class="zp-section-title">Toaletní židle vedle postele, skládací nebo 4v1: srovnání rozměrů</h2>
      <p class="zp-guide-quick-answer"><strong>Vedle postele rozhoduje také způsob vyjmutí nádoby a prostor kolem područek.</strong> Židle se může do ložnice geometricky vejít, ale nesmí zablokovat bezpečný přístup ani obsluhu toalety. Porovnejte přesný typ, nikoli pouze šířku sedu.</p>
      <div class="zp-walker-compare-grid zp-walker-compare-grid-two">
        <article class="zp-walker-compare-card">
          <h3>UNIZDRAV P2807</h3>
          <p class="zp-walker-compare-model">Statická, nastavitelná</p>
          <dl><div><dt>Půdorys (š × h)</dt><dd>60 × 60 cm</dd></div><div><dt>Sedák (š × h)</dt><dd>44 × 44 cm</dd></div><div><dt>Výška sedu</dt><dd>36–60 cm</dd></div><div><dt>Nosnost</dt><dd>100 kg</dd></div><div><dt>Hmotnost</dt><dd>8,5 kg</dd></div></dl>
          <p>Nádoba se vyjímá shora; ověřte, zda lze sedátko pohodlně obsloužit, aniž je židle obsazená.</p>
          <p><a class="zp-text-link" href="https://unizdrav.cz/zbozi/2807/toaletni-zidle-vyskove-nastavitelna-unizdrav" target="_blank" rel="noopener noreferrer">Zdroj technických údajů</a></p>
        </article>
        <article class="zp-walker-compare-card">
          <h3>DMA EH-CMDA</h3>
          <p class="zp-walker-compare-model">4v1, bez opěradla</p>
          <dl><div><dt>Půdorys (š × h)</dt><dd>51 × 40 cm</dd></div><div><dt>Sedák (š × h)</dt><dd>50 × 40 cm</dd></div><div><dt>Výška sedu</dt><dd>39–54 cm</dd></div><div><dt>Nosnost</dt><dd>150 kg</dd></div><div><dt>Hmotnost</dt><dd>3 kg</dd></div></dl>
          <p>Odnímatelná madla, použití také ve sprše a nad WC podle návodu. Nezaměňujte s variantou s opěradlem.</p>
          <p><a class="zp-text-link" href="https://www.dmapraha.cz/eh-cmda_z35658/" target="_blank" rel="noopener noreferrer">Zdroj technických údajů</a></p>
        </article>
        <article class="zp-walker-compare-card">
          <h3>DMA 3515</h3>
          <p class="zp-walker-compare-model">Skládací, sklopné područky</p>
          <dl><div><dt>Půdorys (š × h)</dt><dd>55 × 56 cm</dd></div><div><dt>Sedák (š × h)</dt><dd>46 × 45 cm</dd></div><div><dt>Výška sedu</dt><dd>47 cm</dd></div><div><dt>Nosnost</dt><dd>110 kg</dd></div><div><dt>Hmotnost</dt><dd>9,5 kg</dd></div></dl>
          <p>Pevná výška sedu; nádoba se vysouvá dozadu. Potřebuje volné místo za rámem.</p>
          <p><a class="zp-text-link" href="https://www.dmapraha.cz/3515_z124/" target="_blank" rel="noopener noreferrer">Zdroj technických údajů</a></p>
        </article>
        <article class="zp-walker-compare-card">
          <h3>DMA 3514</h3>
          <p class="zp-walker-compare-model">Užší sed, pevné područky</p>
          <dl><div><dt>Půdorys (š × h)</dt><dd>56 × 46–48 cm</dd></div><div><dt>Sedák (š × h)</dt><dd>40 × 42 cm</dd></div><div><dt>Výška sedu</dt><dd>46–51 cm</dd></div><div><dt>Nosnost</dt><dd>120 kg</dd></div><div><dt>Hmotnost</dt><dd>8,5 kg</dd></div></dl>
          <p>Nádoba přístupná zezadu nebo shora. Užší sed neznamená nejužší celou židli.</p>
          <p><a class="zp-text-link" href="https://www.dmapraha.cz/3514_z638/" target="_blank" rel="noopener noreferrer">Zdroj technických údajů</a></p>
        </article>
      </div>
      <p class="zp-muted-copy">Veřejné katalogové údaje načtené 28. 11. 2026; některé kopie jsou starší. Nejde o aktuální cenové nabídky, potvrzení skladu, úhrady ani pořadí podle kvality. P2807 a EH-CMDA jsou stávající kandidáti poradce, 3515 a 3514 pouze srovnávací příklady. Odkazy jsou zdroje údajů bez affiliate provize.</p>
      <h3>Proč užší křeslo nemusí zabrat méně místa?</h3>
      <p>DMA 3514 má sed široký 40 cm, ale celá konstrukce je široká 56 cm. Skládací 3515 má sed 46 cm, celkovou šířku 55 cm. Pokud máte mezi postelí a skříní volných 60 cm, geometricky zbývají u 3514 jen 4 cm a u 3515 jen 5 cm celkem. Nejde o dostatečný prostor pro přesun; tento příklad pouze ukazuje, proč je nutné měřit celý rám i skutečný prostor pro člověka. Za židlí 3515 navíc musí zbýt místo k vysunutí nádoby podle návodu.</p>
      <h3 id="nahradni-nadoba-toaletni-zidle">Náhradní nádoba do toaletní židle: pozor na rozdílné kódy</h3>
      <p>Potřebujete vyměnit prasklou nádobu nebo pořídit druhou? Nestačí porovnat průměr. Rozhoduje také tvar okraje, uložení a způsob vyjmutí. U dvou podobných křesel z katalogu DMA jsou uvedeny různé náhradní díly:</p>
      <div class="zp-walker-compare-grid zp-walker-compare-grid-two">
        <article class="zp-walker-compare-card">
          <h4>ACC/5R — pro DMA 3515</h4>
          <dl><div><dt>Vnější průměr</dt><dd>29 cm</dd></div><div><dt>Vnitřní průměr</dt><dd>25 cm</dd></div><div><dt>Výška</dt><dd>16 cm</dd></div></dl>
          <p>Ve výčtu kompatibilních křesel je 3515. Nádoba se u tohoto křesla vysouvá dozadu.</p>
          <p><a class="zp-text-link" href="https://www.dmapraha.cz/acc-5r_z657/" target="_blank" rel="noopener noreferrer">Katalog náhradní nádoby ACC/5R</a></p>
        </article>
        <article class="zp-walker-compare-card">
          <h4>ACC/5A — pro DMA 3514</h4>
          <dl><div><dt>Vnější průměr</dt><dd>30 cm</dd></div><div><dt>Vnitřní průměr</dt><dd>25,5 cm</dd></div><div><dt>Výška</dt><dd>16,5 cm</dd></div></dl>
          <p>Mezi podporovanými modely je 3514. Jeho nádobu lze vyjmout dozadu nebo nahoru.</p>
          <p><a class="zp-text-link" href="https://www.dmapraha.cz/acc-5a_z655/" target="_blank" rel="noopener noreferrer">Katalog náhradní nádoby ACC/5A</a></p>
        </article>
      </div>
      <p>Rozdíl v průměru je pouhý centimetr. Přesto bez potvrzení dodavatele nepovažujte nádoby za vzájemně zaměnitelné. U jiných modelů (včetně P2807 a EH-CMDA) si vyžádejte jejich vlastní objednací kód.</p>
      <h3>Kolik může stát nákup a pozdější výměna?</h3>
      <p>V katalogu UNIZDRAV byla 28. 11. 2026 u P2807 zobrazena cena 1 915 Kč. DMA ve stejný den u obou výše uvedených náhradních nádob uvádělo 500 Kč za kus. Jde o časově označené příklady různých výrobků, nikoli nabídku kompletu ani tvrzení, že náhradní nádoby DMA pasují k P2807. U nového i použitého křesla se ptejte, zda je nádoba s víkem součástí balení, kolik stojí správný náhradní díl a jaká je aktuální dostupnost včetně dopravy.</p>
      <p class="zp-muted-copy">Ceny načtené z veřejných katalogů 28. 11. 2026, pouze historický orientační příklad. Ověřte aktuální nabídku u dodavatele. Nákupní odkazy v poradci se nadále zobrazují až po kontrole vhodnosti konkrétního výrobku.</p>
      <h3>Čtyři otázky, které rozhodují o každodenní obsluze</h3>
      <ul class="zp-checklist">
        <li><strong>Nádoba:</strong> vytahuje se shora, zezadu nebo jiným směrem? Ověřte prostor a bezpečný způsob obsluhy neobsazené židle.</li>
        <li><strong>Opěrky:</strong> jsou pevné, sklopné, odnímatelné, nebo chybějí? Nezaměňujte konstrukci určenou pro jiný způsob přesunu.</li>
        <li><strong>Skladování:</strong> pokud se rám skládá, zjistěte jeho rozměr ve složeném stavu a jak se podle návodu zajistí před použitím. Skládací židle se nerozkládá při přesunu člověka.</li>
        <li><strong>Příslušenství:</strong> potvrďte, která nádoba, víko a sedák jsou v balení, jaké náhradní díly jsou dostupné a jak se čistí jednotlivé části podle výrobce.</li>
      </ul>
      <p>Pokud je jedna židle určená také do sprchy a nad WC, prověřte samostatně každé prostředí. Menší půdorys ani vyšší katalogová nosnost neřeší nejistý přesun. Při zvažování úhrady nejdřív ověřte přesný prostředek a podmínky výdeje, neplaťte předem s očekáváním zpětného proplacení.</p>
      <div class="zp-hero-actions">
        <a class="zp-btn" href="#poradce-toaletni-zidle">Ověřit vhodný typ v poradci</a>
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/toaletni-zidle-vedle-postele/#sedm-kontrol-zidle-postel' ) ); ?>">Změřit prostor vedle postele</a>
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/pomucky-do-koupelny-na-pojistovnu/' ) ); ?>">Prověřit možnosti úhrady</a>
      </div>
      <p class="zp-disclaimer">Pokud člověk potřebuje fyzické zvedání či jištění, nemá ověřený stabilní sed nebo bezpečný přesun, musí vhodný postup posoudit odborník. Srovnání není povolení k přesunu ani automatické doporučení výrobku.</p>
    </div>
  </section>

  <section class="zp-section">
    <div class="zp-wrap">
      <p class="zp-kicker">Co před nákupem ověřit</p>
      <h2 class="zp-section-title">Nejdřív půdorys, výška sedu a přesun.</h2>
      <div class="zp-grid">
        <article class="zp-card"><h3>Prostor kolem židle</h3><p>Počítejte s celkovou šířkou a hloubkou, ne jen se sedákem. Musí zbýt místo pro bezpečné přesednutí a obsluhu nádoby.</p></article>
        <article class="zp-card"><h3>Výška sedu</h3><p>Výškově nastavitelný sed může pomoci se vstáváním, ale příliš vysoký sed může zhoršit stabilitu. Chodidla mají mít bezpečnou oporu.</p></article>
        <article class="zp-card"><h3>Údržba a prostředí</h3><p>U toaletní nádoby řešte snadné vyjmutí a hygienu. Pokud má být židle i ve sprše, musí být konkrétní model pro takové použití určený.</p></article>
      </div>
    </div>
  </section>

  <section class="zp-section zp-section-soft">
    <div class="zp-wrap">
      <p class="zp-kicker">Situace v noci</p>
      <h2 class="zp-section-title">Je hlavní problém cesta z postele na WC?</h2>
      <p>Toaletní židle u lůžka může zkrátit cestu na toaletu, ale sama nevyřeší nejisté vstávání nebo přesun. Nejdřív projděte světlo, průchody, oporu, možnost bezpečného dosednutí a přivolání pomoci. Pokud je třeba fyzické zvedání nebo není znám bezpečný postup, nevybírejte konkrétní židli bez odborného posouzení.</p>
      <p><a class="zp-text-link" href="<?php echo esc_url( home_url( '/nocni-cesta-z-postele-na-wc/' ) ); ?>">Sedmibodová kontrola noční cesty z postele na WC</a></p>
    </div>
  </section>

  <section class="zp-section zp-section-soft">
    <div class="zp-wrap">
      <p class="zp-kicker">Pojišťovna</p>
      <h2 class="zp-section-title">Toaletní židle může mít hrazenou cestu, ale retail nabídka není automaticky úhrada.</h2>
      <p>VZP aktuálně popisuje některé toaletní a sprchovací kompenzační prostředky jako potenciálně hrazené při splnění konkrétních podmínek. Zápraží proto drží přímý nákup a cestu přes předpis/schválení odděleně.</p>
      <p><a class="zp-link-btn" href="<?php echo esc_url( home_url( '/pomucky-do-koupelny-na-pojistovnu/' ) ); ?>">Jak funguje úhrada koupelnových a toaletních pomůcek</a></p>
    </div>
  </section>

  <section class="zp-section zp-section-soft" data-zp-context-links="toilet-chair">
    <div class="zp-wrap">
      <p class="zp-kicker">Když toto řešení nestačí</p>
      <h2 class="zp-section-title">Nejdřív bezpečná cesta k toaletě</h2>
      <p>Při obtížném přesunu a cestě z lůžka na WC může být důležitější uspořádání bytu a plán pomoci než samotný nákup židle. Pokud řešíte návrat domů z nemocnice, začněte plánem pro první noc.</p>
      <nav aria-label="Související bezpečné kroky">
        <p><a class="zp-text-link" href="<?php echo esc_url( home_url( '/navrat-z-nemocnice/#plan-navratu' ) ); ?>">Sestavit plán návratu domů</a></p>
        <p><a class="zp-text-link" href="<?php echo esc_url( home_url( '/koupelna-a-wc/#poradce-koupelna' ) ); ?>">Porovnat další řešení u WC</a></p>
      </nav>
    </div>
  </section>

  <section id="kontrola-toaletni-zidle" class="zp-section" data-zp-editorial-guide="toilet-chair">
    <div class="zp-wrap">
      <p class="zp-kicker">Před výběrem toaletní židle</p>
      <h2 class="zp-section-title">Pět kontrol toaletní židle u lůžka: důležitější než blízkost postele je bezpečný přesun.</h2>
      <p>Samostatná židle s nádobou může zkrátit cestu na toaletu, ale nevylučuje riziko pádu při vstávání. Při nutnosti fyzického zvedání druhou osobou nebo nejistém způsobu přesunu nejprve zajistěte odborné posouzení, ne automatický výběr výrobku.</p>
      <div class="zp-decision-grid">
        <article class="zp-decision-card">
          <h3>1. Samostatná židle, nebo provedení 4v1?</h3>
          <p>Statická židle řeší toaletu poblíž lůžka. Konstrukce 4v1 může být určená i do sprchy nebo nad WC, ale každá poloha použití musí být výslovně povolená návodem přesného modelu. Není správné předpokládat, že každá toaletní židle je sprchovací.</p>
        </article>
        <article class="zp-decision-card">
          <h3>2. Umístění bez nové překážky</h3>
          <p>Vyberte prostor s rovnou pevnou podlahou, dostatkem místa pro nohy a bezpečný přístup. Zkontrolujte noční osvětlení a zda židle nepřekáží v cestě z postele. U statického provedení ověřte podle návodu i možnost pevné opory za židlí proti převržení.</p>
        </article>
        <article class="zp-decision-card">
          <h3>3. Stejně nastavené nohy a jistý sed</h3>
          <p>Všechny nastavitelné nohy musí být ve stejné výšce a pojistky správně zajištěné, gumové koncovky nepoškozené. Výška sedu má umožnit stabilní dosednutí i oporu chodidel. Pokud člověk potřebuje aktivní fyzickou pomoc při přesunu, židli nevybírejte pouze přes online formulář.</p>
        </article>
        <article class="zp-decision-card">
          <h3>4. Rozměry a nosnost konkrétního P2807</h3>
          <p>UNIZDRAV P2807 má celkovou šířku i délku 60 cm, výšku sedu 36–60 cm a deklarovanou nosnost 100 kg. Tyto údaje patří tomuto statickému modelu a nesmějí být automaticky přeneseny na variantu 4v1. Počítejte i s místem potřebným pro přístup k odnímatelné nádobě.</p>
        </article>
        <article class="zp-decision-card">
          <h3>5. Hygiena a plán pomoci</h3>
          <p>U P2807 výrobce popisuje vyjímatelnou nádobu a čištění po použití. Předem promyslete, kdo a jak nádobu bezpečně vyjme, vyčistí a vrátí, aniž by zablokoval cestu kolem lůžka. Je-li přesun nejistý nebo člověk doma nemůže bezpečně přivolat pomoc, samotná židle situaci neřeší.</p>
        </article>
      </div>
      <p><a class="zp-text-link" href="<?php echo esc_url( home_url( '/toaletni-zidle-pro-seniory/#poradce-toaletni-zidle' ) ); ?>">Porovnat konkrétní provedení v poradci</a> · <a class="zp-text-link" href="<?php echo esc_url( home_url( '/nocni-cesta-z-postele-na-wc/' ) ); ?>">Prověřit celou noční cestu na WC</a></p>
      <p class="zp-disclaimer">Tento návod negarantuje bezpečný přesun a nenahrazuje individuální posouzení. Při nestabilním podkladu, chybějícím prostoru, neověřené nosnosti nebo nutnosti fyzického zvedání druhou osobou nesmí být nabídka považována za ověřenou.</p>
      <p class="zp-muted-copy">Podklady zkontrolovány 12. 10. 2026: <a href="https://www.kingstonandrichmond.nhs.uk/patients-and-families/patient-leaflets/commode" target="_blank" rel="noopener">Kingston and Richmond NHS — stabilita a seřízení statické toaletní židle</a>; <a href="https://www.nhs.uk/social-care-and-support/practical-tips-if-you-care-for-someone/how-to-move-lift-and-handle-someone-else/" target="_blank" rel="noopener">NHS — bezpečná manipulace a hranice asistovaného přesunu</a>; <a href="https://unizdrav.cz/zbozi/2807/toaletni-zidle-vyskove-nastavitelna-unizdrav" target="_blank" rel="noopener">UNIZDRAV — rozměry, nosnost a údržba statického P2807</a>. Údaje cizí NHS pomůcky, včetně její vyšší nosnosti, neplatí pro P2807. Individuální externí odborné posouzení Zápraží není doloženo.</p>
    </div>
  </section>

  <section class="zp-section">
    <div class="zp-wrap zp-faq">
      <p class="zp-kicker">Časté otázky</p>
      <h2 class="zp-section-title">Toaletní židle: rychlá orientace.</h2>
      <details>
        <summary>Kdy má smysl samostatná toaletní židle?</summary>
        <p>Když je hlavní problém obtížná cesta na běžné WC a člověk zvládne bezpečný přesun na stabilní židli bez fyzického zvedání druhou osobou.</p>
      </details>
      <details>
        <summary>Jaký je rozdíl mezi toaletní židlí a 4v1?</summary>
        <p>Statická toaletní židle řeší hlavně toaletu poblíž lůžka nebo místnosti. Židle 4v1 je navržená i pro další použití, například sprchování nebo umístění nad WC, takže je potřeba ověřit oba prostory.</p>
      </details>
      <details>
        <summary>Jak vysoká má být toaletní židle?</summary>
        <p>Tak, aby bylo sedání a vstávání stabilní a chodidla měla jistou oporu. U nastavitelných modelů vybírejte výšku podle konkrétního člověka a prostoru, ne podle maxima výrobku.</p>
      </details>
      <details>
        <summary>Hradí toaletní židli zdravotní pojišťovna?</summary>
        <p>Některé konkrétní zdravotnické prostředky tohoto typu hrazené být mohou, ale záleží na přesném prostředku, indikačních podmínkách, předpisu a případném schválení. Retail nákup není automaticky hrazená cesta.</p>
      </details>
    </div>
  </section>
</main>
<?php get_footer(); ?>
