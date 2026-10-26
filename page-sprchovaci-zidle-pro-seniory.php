<?php
/* ZP_RELEASE_0_8_163 */
/*
Template Name: Zápraží — Sprchovací židle pro seniory
*/
get_header();
?>
<main id="main-content" tabindex="-1">
  <section class="zp-hero">
    <div class="zp-wrap">
      <p class="zp-kicker">Zápraží · Koupelna · Sprchovací židle</p>
      <h1>Sprchovací židle pro seniory: jak vybrat rozměr, výšku a opory.</h1>
      <p class="zp-lead">Sprchovací židle dává smysl, když je hlavní problém dlouhé stání při sprchování, ale přesun na sedadlo nevyžaduje fyzické zvedání druhou osobou. Nejdřív ověřte stabilní podklad, prostor, výšku sedu a nosnost — až potom konkrétní produkt.</p>
      <div class="zp-hero-actions">
        <a class="zp-btn" href="#poradce-sprchovaci-zidle">Spustit poradce</a>
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/pomucky-do-koupelny-na-pojistovnu/' ) ); ?>">Jak funguje pojišťovna</a>
        <a class="zp-text-link" href="#bezpecne-sprchovani-v-sede">Co ověřit před výběrem</a>
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/co-zmerit-v-koupelne-pred-vyberem-pomucky/#mereni-sprcha' ) ); ?>">Změřit sprchový kout pro židli</a>
      </div>
    </div>
  </section>

  <section id="poradce-sprchovaci-zidle" class="zp-wrap zp-advisor-section">
    <div class="zp-panel">
      <p class="zp-kicker">Domácí poradce · Sprchovací židle</p>
      <h2>Je problém hlavně dlouhé stání při sprchování?</h2>
      <p>Neptáme se na diagnózu. Rozhodujeme podle přesunu, stability podkladu, prostoru, nosnosti a délky používání.</p>

      <div id="zp-shower-chair-advisor" class="zp-advisor-form" role="form" aria-describedby="zp-shower-chair-privacy">
        <fieldset class="zp-fieldset" data-zp-shower-required="transferAbility">
          <legend>Jak člověk přesedá na židli?</legend>
          <label class="zp-choice"><input type="radio" name="transferAbility" value="independent" required><span><strong>Samostatně</strong><small>Bez fyzické pomoci druhé osoby.</small></span></label>
          <label class="zp-choice"><input type="radio" name="transferAbility" value="steadying"><span><strong>Potřebuje stabilní oporu rukama</strong><small>Pomoc druhé osoby ke zvednutí není běžně potřeba.</small></span></label>
          <label class="zp-choice"><input type="radio" name="transferAbility" value="person_assist"><span><strong>Je potřeba fyzická pomoc druhé osoby</strong><small>Například zvedání, přidržování nebo výrazné jištění.</small></span></label>
          <label class="zp-choice"><input type="radio" name="transferAbility" value="unknown"><span><strong>Nevím</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-shower-required="floorStable">
          <legend>Bude židle stát na rovném a stabilním podkladu?</legend>
          <label class="zp-choice"><input type="radio" name="floorStable" value="yes" required><span><strong>Ano</strong></span></label>
          <label class="zp-choice"><input type="radio" name="floorStable" value="no"><span><strong>Ne</strong></span></label>
          <label class="zp-choice"><input type="radio" name="floorStable" value="unknown"><span><strong>Nevím</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-shower-required="spaceFit">
          <legend>Je ověřeno, že se židle bezpečně vejde do sprchového prostoru i pro přesednutí?</legend>
          <label class="zp-choice"><input type="radio" name="spaceFit" value="yes" required><span><strong>Ano</strong></span></label>
          <label class="zp-choice"><input type="radio" name="spaceFit" value="no"><span><strong>Ne</strong></span></label>
          <label class="zp-choice"><input type="radio" name="spaceFit" value="unknown"><span><strong>Nevím</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-shower-required="loadFit">
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

        <section id="zp-shower-chair-preview" class="zp-result" tabindex="-1" aria-live="polite" hidden></section>
        <section id="zp-shower-chair-fit-stage" class="zp-bathroom-fit-stage" aria-labelledby="zp-shower-chair-fit-title" hidden>
          <h3 id="zp-shower-chair-fit-title">2. Ověřte nosnost a rozměry konkrétní pomůcky</h3>
          <p class="zp-muted-copy zp-fit-measurement-help">Nevíte, jak změřit rovnou plochu sprchy a průchod? <a class="zp-text-link" href="<?php echo esc_url( home_url( '/co-zmerit-v-koupelne-pred-vyberem-pomucky/#mereni-sprcha' ) ); ?>" target="_blank" rel="noopener noreferrer">Praktický kontrolní návod (nová karta)</a>. Rozměry samy o sobě nezaručují bezpečné použití.</p>
          <p>V předchozím kroku jste viděli model i technické údaje. Teď ověřte, zda vyhovují člověku a prostředí doma. Při nejistotě vyberte <strong>Nevím</strong>.</p>
        </section>
        <div id="zp-shower-chair-errors" class="zp-advisor-errors" role="alert" aria-live="assertive" hidden></div>
        <button class="zp-btn zp-submit" type="button" id="zp-shower-chair-submit">1. Ukázat možný výrobek</button>
        <p id="zp-shower-chair-privacy" class="zp-privacy-note">Odpovědi zůstávají v prohlížeči. Do affiliate ani analytiky neposíláme kombinaci odpovědí.</p>
      </div>

      <noscript><p class="zp-disclaimer">Pro spuštění poradce je potřeba JavaScript. Bez něj se žádné odpovědi neodesílají.</p></noscript>
      <section id="zp-shower-chair-result" class="zp-result" aria-live="polite" tabindex="-1" hidden></section>
    </div>
  </section>

  <section class="zp-section zp-section-soft">
    <div class="zp-wrap">
      <p class="zp-kicker">Co před nákupem změřit</p>
      <h2 class="zp-section-title">Rozměr sprchy je stejně důležitý jako rozměr sedáku.</h2>
      <div class="zp-grid">
        <article class="zp-card"><h3>Celkový půdorys</h3><p>Ověřený P2062 má celkovou šířku 55 cm a hloubku 48 cm. Židle musí mít kolem sebe prostor i pro bezpečné přesednutí.</p></article>
        <article class="zp-card"><h3>Výška sedu</h3><p>P2062 má nastavitelnou výšku sedu 38–50,5 cm. Zvolte takovou výšku, aby bylo sedání a vstávání stabilní a chodidla měla jistou oporu.</p></article>
        <article class="zp-card"><h3>Nosnost</h3><p>P2062 má deklarovanou nosnost 136 kg. Zápraží nepotřebuje znát ani ukládat hmotnost člověka — stačí ověřit, že konkrétní produkt bezpečně vyhovuje.</p></article>
      </div>
    </div>
  </section>

  <section class="zp-section">
    <div class="zp-wrap">
      <p class="zp-kicker">Ověřený kandidát</p>
      <h2 class="zp-section-title">UNIZDRAV P2062 — sprchovací židle s ručkami.</h2>
      <p>Ověřený model má výškově nastavitelné sedadlo, boční opory, celkovou šířku 55 cm, hloubku 48 cm, sedák 40 × 33 cm a nosnost 136 kg. Konkrétní produkt se zobrazí až po splnění podmínek v poradci.</p>
      <p class="zp-muted-copy">Produktová stránka byla znovu kontrolována 7. 10. 2026. Dostupnost konkrétní nabídky se může změnit.</p>
    </div>
  </section>

  <section class="zp-section zp-section-soft">
    <div class="zp-wrap">
      <p class="zp-kicker">Pojišťovna</p>
      <h2 class="zp-section-title">Sprchovací židle může mít hrazenou alternativu, ale retail produkt není automaticky hrazený.</h2>
      <p>VZP aktuálně popisuje některé sprchovací a koupelnové kompenzační prostředky jako potenciálně hrazené při splnění konkrétních podmínek. Zápraží proto vede maloobchodní P2062 jako přímý nákup a pojišťovací cestu ověřuje zvlášť.</p>
      <p><a class="zp-link-btn" href="<?php echo esc_url( home_url( '/pomucky-do-koupelny-na-pojistovnu/' ) ); ?>">Jak funguje úhrada pomůcek do koupelny</a></p>
    </div>
  </section>

  <section class="zp-section zp-section-soft" data-zp-context-links="shower-chair">
    <div class="zp-wrap">
      <p class="zp-kicker">Když toto řešení nestačí</p>
      <h2 class="zp-section-title">Co když nejde o sprchový kout?</h2>
      <p>Židle do sprchy není automaticky vhodná pro přesun přes okraj vany. Pro vanu je nutné zvlášť prověřit způsob přesunu a rozměry; při nejistotě o bezpečnosti přesunu je dalším krokem odborné posouzení.</p>
      <nav aria-label="Související bezpečné kroky">
        <p><a class="zp-text-link" href="<?php echo esc_url( home_url( '/sedatko-do-vany-pro-seniory/#poradce-sedatko-vana' ) ); ?>">Řešit bezpečný přesun u vany</a></p>
        <p><a class="zp-text-link" href="<?php echo esc_url( home_url( '/koupelna-a-wc/#poradce-koupelna' ) ); ?>">Vrátit se k výběru podle situace</a></p>
      </nav>
    </div>
  </section>

  <section id="bezpecne-sprchovani-v-sede" class="zp-section" data-zp-editorial-guide="shower-chair">
    <div class="zp-wrap">
      <p class="zp-kicker">Praktická kontrola před použitím</p>
      <h2 class="zp-section-title">Pět kontrol sprchovací židle: ne každé sedátko je bezpečné do každé sprchy.</h2>
      <p>Sprchovací židle pomáhá omezit dobu stání, ale sama nevyřeší obtížné nastupování přes vysoký okraj ani nejistý přesun. Nejdřív ověřte, zda je vhodná právě do sprchového prostoru a zda člověk zvládne bezpečně usednout a vstát. Pokud se bez fyzické pomoci druhé osoby nepřesune, online výběr konkrétní židle končí.</p>
      <div class="zp-decision-grid">
        <article class="zp-decision-card">
          <h3>1. Sprchový kout, nebo vana?</h3>
          <p>Volně stojící sprchovací židle patří jen na podlahu sprchy, kde může stát podle návodu výrobce. Ve vaně nebo při překračování vysokého okraje může být potřebné úplně jiné řešení, například sedátko přes vanu a individuálně ověřený postup přesunu. Nezaměňujte obě konstrukce.</p>
        </article>
        <article class="zp-decision-card">
          <h3>2. Stabilní podlaha a všechny nohy</h3>
          <p>Ověřte rovný pevný povrch, kontakt všech opěrných nohou s podlahou a zajištění výškového nastavení podle návodu konkrétního modelu. Na šikmém podkladu, hraně vaničky nebo tam, kde se židle viklá, nevybírejte výrobek jako bezpečně ověřený. Myslete i na uklouznutí při příchodu a odchodu.</p>
        </article>
        <article class="zp-decision-card">
          <h3>3. Změřit skutečný prostor pro přesun</h3>
          <p>U ověřené UNIZDRAV P2062 je celková šířka 55 cm a hloubka 48 cm. Změřte nejen vnitřní rozměry koutu, ale i volné místo před židlí, směr otevírání dveří a dosah na sprchu. Samotná skutečnost, že se podstavec vejde, nestačí, pokud nezbývá prostor pro bezpečné usednutí.</p>
        </article>
        <article class="zp-decision-card">
          <h3>4. Výška sedu a nosnost přesného modelu</h3>
          <p>U P2062 výrobce uvádí výšku sedadla 38–50,5 cm a nosnost 136 kg. Po nastavení musí mít člověk bezpečnou oporu chodidel a zvládnout vstávání bez nebezpečného přenášení váhy. Tyto údaje nepřenášejte na jiné sprchovací židle; hmotnost člověka Zápraží nepotřebuje znát ani ukládat.</p>
        </article>
        <article class="zp-decision-card">
          <h3>5. Připravit pomůcky a bezpečný další krok</h3>
          <p>Uložte mycí potřeby tak, aby nebylo potřeba se na mokré podlaze natahovat; prokluzující povrch a volné předměty představují riziko. Po sestavení a při údržbě respektujte návod výrobce. Pokud nelze bezpečný přesun nebo podmínky sprchy ověřit, může být dočasně vhodnější hygienu řešit mimo sprchový kout a postup probrat s ergoterapeutem.</p>
        </article>
      </div>
      <p><a class="zp-text-link" href="<?php echo esc_url( home_url( '/sprchovaci-zidle-pro-seniory/#poradce-sprchovaci-zidle' ) ); ?>">Ověřit konkrétní sprchovací židli v poradci</a> · <a class="zp-text-link" href="<?php echo esc_url( home_url( '/sedatko-do-vany-pro-seniory/#poradce-sedatko-vana' ) ); ?>">Při sprše nad vanou řešit bezpečný přesun zvlášť</a></p>
      <p class="zp-disclaimer">Toto je obecná domácí kontrola, nikoli povolení ke konkrétnímu způsobu přesunu ani individuální zdravotní posouzení. Dokud není ověřený stabilní podklad, prostor, přesun a nosnost přesného modelu, poradce nesmí otevřít obchodní nabídku.</p>
      <p class="zp-muted-copy">Podklady ověřeny 12. 10. 2026: <a href="https://unizdrav.cz/zbozi/2062/sprchovaci-zidle-s-ruckami" target="_blank" rel="noopener">UNIZDRAV — rozměry, nosnost a použití přesného modelu P2062</a>; <a href="https://www.guysandstthomas.nhs.uk/health-information/daily-tasks-using-1-hand" target="_blank" rel="noopener">Guy's and St Thomas' NHS — protiskluz a dostupnost pomůcek při hygieně</a>; <a href="https://www.cuh.nhs.uk/patient-information/one-handed-living-tips/" target="_blank" rel="noopener">Cambridge University Hospitals NHS — sprchovací sedátko a prevence uklouznutí</a>. Zahraniční rady jsou obecné principy, ne česká pravidla úhrady; individuální externí odborná revize Zápraží není doložená.</p>
    </div>
  </section>

  <section class="zp-section">
    <div class="zp-wrap zp-faq">
      <p class="zp-kicker">Časté otázky</p>
      <h2 class="zp-section-title">Sprchovací židle: rychlá orientace.</h2>
      <details>
        <summary>Jak vysoká má být sprchovací židle?</summary>
        <p>Výška má umožnit bezpečné sednutí a vstávání a zároveň stabilní oporu chodidel. Prakticky je důležitější správně nastavená výška než maximálně vysoký sed.</p>
      </details>
      <details>
        <summary>Jak změřit, zda se sprchovací židle vejde?</summary>
        <p>Měřte celkovou šířku a hloubku sprchového prostoru a ponechte místo pro bezpečné přesednutí. U ověřeného P2062 je celková šířka 55 cm a hloubka 48 cm.</p>
      </details>
      <details>
        <summary>Kdy online poradce konkrétní židli nedoporučí?</summary>
        <p>Když je potřeba fyzické zvedání nebo výrazné jištění druhou osobou, není potvrzen stabilní podklad, prostor nebo nosnost. V takovém případě je nejdřív potřeba bezpečný způsob přesunu a vhodný typ pomůcky.</p>
      </details>
      <details>
        <summary>Hradí sprchovací židli zdravotní pojišťovna?</summary>
        <p>Některé konkrétní zdravotnické prostředky tohoto typu mohou být hrazené, ale záleží na přesném prostředku, podmínkách a schválení. Běžný produkt z e-shopu není automaticky hrazený jen podle názvu kategorie.</p>
      </details>
    </div>
  </section>
</main>
<?php get_footer(); ?>
