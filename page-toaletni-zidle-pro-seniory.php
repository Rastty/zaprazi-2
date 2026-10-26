<?php
/* ZP_RELEASE_0_8_165 */
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
      <div class="zp-hero-actions">
        <a class="zp-btn" href="#poradce-toaletni-zidle">Spustit poradce</a>
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/pomucky-do-koupelny-na-pojistovnu/' ) ); ?>">Jak funguje pojišťovna</a>
        <a class="zp-text-link" href="#kontrola-toaletni-zidle">Co ověřit před výběrem</a>
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

        <section id="zp-toilet-chair-preview" class="zp-result" tabindex="-1" aria-live="polite" hidden></section>
        <section id="zp-toilet-chair-fit-stage" class="zp-bathroom-fit-stage" aria-labelledby="zp-toilet-chair-fit-title" hidden>
          <h3 id="zp-toilet-chair-fit-title">2. Ověřte nosnost a rozměry konkrétní pomůcky</h3>
          <p class="zp-muted-copy zp-fit-measurement-help">Nevíte, jak prověřit prostor, stabilní podlahu a přesun? <a class="zp-text-link" href="<?php echo esc_url( home_url( '/co-zmerit-v-koupelne-pred-vyberem-pomucky/#kontrolni-list-koupelna' ) ); ?>" target="_blank" rel="noopener noreferrer">Praktický kontrolní návod (nová karta)</a>. Rozměry samy o sobě nezaručují bezpečné použití.</p>
          <p>V předchozím kroku jste viděli model i technické údaje. Teď ověřte, zda vyhovují člověku a prostředí doma. Při nejistotě vyberte <strong>Nevím</strong>.</p>
        </section>
        <div id="zp-toilet-chair-errors" class="zp-advisor-errors" role="alert" aria-live="assertive" hidden></div>
        <button class="zp-btn zp-submit" type="button" id="zp-toilet-chair-submit">1. Ukázat možný výrobek</button>
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
