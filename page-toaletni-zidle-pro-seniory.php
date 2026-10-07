<?php
/* ZP_RELEASE_0_8_40 */
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

        <div id="zp-toilet-chair-errors" class="zp-advisor-errors" role="alert" aria-live="assertive" hidden></div>
        <button class="zp-btn zp-submit" type="button" id="zp-toilet-chair-submit">Zjistit vhodný další krok</button>
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
      <p class="zp-kicker">Pojišťovna</p>
      <h2 class="zp-section-title">Toaletní židle může mít hrazenou cestu, ale retail nabídka není automaticky úhrada.</h2>
      <p>VZP aktuálně popisuje některé toaletní a sprchovací kompenzační prostředky jako potenciálně hrazené při splnění konkrétních podmínek. Zápraží proto drží přímý nákup a cestu přes předpis/schválení odděleně.</p>
      <p><a class="zp-link-btn" href="<?php echo esc_url( home_url( '/pomucky-do-koupelny-na-pojistovnu/' ) ); ?>">Jak funguje úhrada koupelnových a toaletních pomůcek</a></p>
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
