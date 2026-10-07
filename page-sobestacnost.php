<?php
/* ZP_RELEASE_0_8_25 */
/*
Template Name: ZaPrazi — Soběstačnost
*/
get_header();
?>
<main id="main-content" tabindex="-1">
  <section class="zp-hero">
    <div class="zp-wrap">
      <p class="zp-kicker">ZaPrazi.cz · Každodenní soběstačnost</p>
      <h1>Malé pomůcky, které mohou vrátit kus samostatnosti.</h1>
      <p class="zp-lead">Začínáme konkrétní činností: napít se, udržet nádobu nebo připravit jednoduché jídlo jednou rukou. Neptáme se na diagnózu a nedoporučujeme produkt jen proto, že je v nabídce partnera.</p>
      <div class="zp-hero-actions">
        <a class="zp-btn" href="#poradce-sobestacnost">Spustit poradce</a>
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/navrat-z-nemocnice/' ) ); ?>">Řeším celý návrat domů</a>
      </div>
    </div>
  </section>

  <section id="poradce-sobestacnost" class="zp-wrap zp-advisor-section">
    <div class="zp-panel">
      <p class="zp-kicker">Domácí poradce · Soběstačnost</p>
      <h2>Která běžná činnost je teď problém?</h2>
      <p>Odpovědi zůstávají jen v prohlížeči. Nezadávejte jméno, diagnózu, typ operace ani jiné zdravotní údaje.</p>

      <div id="zp-adl-advisor" class="zp-advisor-form" role="form" aria-describedby="zp-adl-privacy">
        <fieldset class="zp-fieldset" data-zp-adl-required="task">
          <legend>Co chcete hlavně usnadnit?</legend>
          <label class="zp-choice"><input type="radio" name="task" value="drink" required><span><strong>Samostatné pití</strong><small>Problém je hlavně uchopit, naklonit nebo nerozlít nápoj.</small></span></label>
          <label class="zp-choice"><input type="radio" name="task" value="stabilize_container"><span><strong>Udržet nádobu na místě</strong><small>Sklenice, miska nebo jiný předmět při práci ujíždí.</small></span></label>
          <label class="zp-choice"><input type="radio" name="task" value="one_hand_meal"><span><strong>Připravit jednoduché jídlo jednou rukou</strong><small>Například namazat pečivo bez přidržování druhou rukou.</small></span></label>
          <label class="zp-choice"><input type="radio" name="task" value="other"><span><strong>Něco jiného</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-adl-required="mainProblem">
          <legend>Co je hlavní překážka?</legend>
          <label class="zp-choice"><input type="radio" name="mainProblem" value="grip_or_spill" required><span><strong>Držení, naklánění nebo rozlévání při pití</strong></span></label>
          <label class="zp-choice"><input type="radio" name="mainProblem" value="container_moves"><span><strong>Nádoba nebo předmět se při práci posouvá</strong></span></label>
          <label class="zp-choice"><input type="radio" name="mainProblem" value="one_hand_setup"><span><strong>Činnost potřebuji zvládnout jednou rukou</strong></span></label>
          <label class="zp-choice"><input type="radio" name="mainProblem" value="swallowing_or_medical"><span><strong>Problém je samotné polykání, zakuckávání nebo jiná zdravotní obtíž</strong><small>Tady poradce konkrétní produkt nedoporučí.</small></span></label>
          <label class="zp-choice"><input type="radio" name="mainProblem" value="other"><span><strong>Jiný problém</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-adl-conditional="stabilize_container" data-zp-adl-required="stableSurface" hidden>
          <legend>Je k dispozici stabilní stůl nebo pracovní plocha?</legend>
          <label class="zp-choice"><input type="radio" name="stableSurface" value="yes"><span><strong>Ano</strong></span></label>
          <label class="zp-choice"><input type="radio" name="stableSurface" value="no"><span><strong>Ne</strong></span></label>
          <label class="zp-choice"><input type="radio" name="stableSurface" value="unknown"><span><strong>Nevím</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-adl-conditional="one_hand_meal" data-zp-adl-required="oneHandUse" hidden>
          <legend>Je hlavní potřeba opravdu obsluha jídla jednou rukou?</legend>
          <label class="zp-choice"><input type="radio" name="oneHandUse" value="yes"><span><strong>Ano</strong></span></label>
          <label class="zp-choice"><input type="radio" name="oneHandUse" value="no"><span><strong>Ne</strong></span></label>
          <label class="zp-choice"><input type="radio" name="oneHandUse" value="unknown"><span><strong>Nevím</strong></span></label>
        </fieldset>

        <div id="zp-adl-errors" class="zp-advisor-errors" role="alert" aria-live="assertive" hidden></div>
        <button class="zp-btn zp-submit" type="button" id="zp-adl-submit">Zjistit vhodný další krok</button>
        <p id="zp-adl-privacy" class="zp-privacy-note">Odpovědi se neodesílají na server ani nejsou součástí URL. Do analytiky posíláme jen obecné události bez odpovědí.</p>
      </div>

      <noscript><p class="zp-disclaimer">Pro spuštění poradce je potřeba JavaScript. Bez něj se žádné odpovědi neodesílají.</p></noscript>
      <section id="zp-adl-result" class="zp-result" aria-live="polite" tabindex="-1" hidden></section>
    </div>
  </section>

  <section class="zp-section zp-section-soft">
    <div class="zp-wrap">
      <p class="zp-kicker">Jak vybíráme</p>
      <h2 class="zp-section-title">Tři úzké problémy místo katalogu stovek pomůcek.</h2>
      <div class="zp-decision-grid">
        <article class="zp-decision-card"><h3>Pití</h3><p>Řešíme držení, naklánění a rozlévání. Pokud je problém v polykání nebo zakuckávání, výběr produktu zastavíme.</p></article>
        <article class="zp-decision-card"><h3>Stabilizace nádoby</h3><p>Držák doporučujeme jen tehdy, když je potvrzená stabilní pracovní plocha a lze bezpečně ověřit rozměr předmětu.</p></article>
        <article class="zp-decision-card"><h3>Jídlo jednou rukou</h3><p>Podnos dává smysl jen pro konkrétní činnost jednou rukou a po ověření, že se vejde na pracovní plochu.</p></article>
      </div>
    </div>
  </section>

  <section class="zp-section">
    <div class="zp-wrap">
      <p class="zp-kicker">Když problém není jen u jídla a pití</p>
      <h2 class="zp-section-title">Přejděte rovnou na situaci, kterou opravdu řešíte.</h2>
      <div class="zp-decision-grid">
        <article class="zp-decision-card"><h3>Chůze a opora</h3><p>Chodítko nebo rollátor vybíráme podle prostředí, opory a bezpečného ovládání.</p><p><a class="zp-text-link" href="<?php echo esc_url( home_url( '/#poradce' ) ); ?>">Poradce pro mobilitu</a></p></article>
        <article class="zp-decision-card"><h3>Koupelna a WC</h3><p>Zvýšení WC, opory, sprchovací nebo toaletní řešení mají vlastní fit a bezpečnostní pravidla.</p><p><a class="zp-text-link" href="<?php echo esc_url( home_url( '/koupelna-a-wc/' ) ); ?>">Poradce pro koupelnu a WC</a></p></article>
        <article class="zp-decision-card"><h3>Postel nebo vozík</h3><p>Pro polohovací postel a invalidní vozík používáme samostatné poradce s technickými fit kontrolami.</p><p><a class="zp-text-link" href="<?php echo esc_url( home_url( '/polohovaci-postel/' ) ); ?>">Polohovací postel</a> · <a class="zp-text-link" href="<?php echo esc_url( home_url( '/invalidni-vozik/' ) ); ?>">Invalidní vozík</a></p></article>
      </div>
      <p><a class="zp-text-link" href="<?php echo esc_url( home_url( '/navrat-z-nemocnice/' ) ); ?>">Pokud řešíte návrat z nemocnice, začněte plánem první noci doma.</a></p>
    </div>
  </section>

  <section class="zp-section">
    <div class="zp-wrap">
      <p class="zp-kicker">Ověřené zdroje</p>
      <h2 class="zp-section-title">Produkt zobrazíme až po ověření konkrétní identity.</h2>
      <p>První shortlist používá tři přesně identifikované produkty RehaVita.cz: UpCup 15-050101, Beat It 15-050102 a Theomatik 15-050103. U Theomatiku jsme ověřili i rozměry 36,5 × 18,8 × 3 cm.</p>
      <p class="zp-muted-copy">Stav a parametry byly ověřeny 7. 10. 2026. Dostupnost obchodu se může změnit.</p>
    </div>
  </section>
</main>
<?php get_footer(); ?>
