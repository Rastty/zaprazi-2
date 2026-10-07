<?php
/* ZP_RELEASE_0_8_37 */
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

        <div id="zp-toilet-riser-errors" class="zp-advisor-errors" role="alert" aria-live="assertive" hidden></div>
        <button class="zp-btn zp-submit" type="button" id="zp-toilet-riser-submit">Zjistit vhodný další krok</button>
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
