<?php
/* ZP_RELEASE_0_8_135 */
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
        <a class="zp-text-link" href="#kontrola-nastavce-na-wc">Co ověřit před výběrem</a>
      </div>
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
