<?php
/* ZP_RELEASE_0_8_37 */
/*
Template Name: Zápraží — Obuv pro seniory
*/
get_header();
?>
<main id="main-content" tabindex="-1">
  <section class="zp-hero">
    <div class="zp-wrap">
      <p class="zp-kicker">Zápraží · Snadné obouvání</p>
      <h1>Boty pro seniory na suchý zip: vybírejte podle otevření, šířky a špičky.</h1>
      <p class="zp-lead">Neřešíme diagnózu. Poradce se ptá jen na to, jak velký otvor pro nazutí je potřeba, zda musí být špička uzavřená, jestli je suchý zip prakticky ovladatelný a zda jsou obě chodidla změřená.</p>
      <div class="zp-hero-actions">
        <a class="zp-btn" href="#poradce-obuv">Spustit poradce</a>
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/bezpecny-byt-pro-seniora/' ) ); ?>">Řeším bezpečnost doma</a>
      </div>
    </div>
  </section>

  <section id="poradce-obuv" class="zp-wrap zp-advisor-section">
    <div class="zp-panel">
      <p class="zp-kicker">Domácí poradce · Obuv</p>
      <h2>Jaký způsob obouvání potřebujete?</h2>
      <p>Odpovědi zůstávají jen v prohlížeči. Nezadávejte diagnózu, příčinu otoku, léky ani jiné zdravotní údaje.</p>

      <div id="zp-footwear-advisor" class="zp-advisor-form" role="form" aria-describedby="zp-footwear-privacy">
        <fieldset class="zp-fieldset" data-zp-footwear-required="openingNeed">
          <legend>Jak velké otevření boty je prakticky potřeba?</legend>
          <label class="zp-choice"><input type="radio" name="openingNeed" value="wide_opening" required><span><strong>Širší otevření a snadné zapnutí</strong><small>Stačí široký střih a pásky na suchý zip.</small></span></label>
          <label class="zp-choice"><input type="radio" name="openingNeed" value="extra_wide_low"><span><strong>Extra široká nízká obuv</strong><small>Je potřeba větší objem a velký otvor, ale nízké provedení.</small></span></label>
          <label class="zp-choice"><input type="radio" name="openingNeed" value="full_opening"><span><strong>Obuv se musí otevřít téměř celá</strong><small>Potřeba je hlavně maximálně usnadnit nazutí a přizpůsobit objem.</small></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-footwear-required="toe">
          <legend>Musí být špička uzavřená?</legend>
          <label class="zp-choice"><input type="radio" name="toe" value="closed_needed" required><span><strong>Ano, potřebuji plnou špičku</strong></span></label>
          <label class="zp-choice"><input type="radio" name="toe" value="open_ok"><span><strong>Otevřená špička nevadí</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-footwear-required="velcroUse">
          <legend>Lze bezpečně otevřít a zapnout suchý zip?</legend>
          <label class="zp-choice"><input type="radio" name="velcroUse" value="yes" required><span><strong>Ano</strong></span></label>
          <label class="zp-choice"><input type="radio" name="velcroUse" value="no"><span><strong>Ne</strong><small>Pak tento shortlist není vhodný.</small></span></label>
          <label class="zp-choice"><input type="radio" name="velcroUse" value="unknown"><span><strong>Nevím</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-footwear-required="measuredFeet">
          <legend>Jsou obě chodidla změřená podle aktuální velikosti?</legend>
          <label class="zp-choice"><input type="radio" name="measuredFeet" value="yes" required><span><strong>Ano</strong></span></label>
          <label class="zp-choice"><input type="radio" name="measuredFeet" value="no"><span><strong>Ne</strong></span></label>
          <label class="zp-choice"><input type="radio" name="measuredFeet" value="unknown"><span><strong>Nevím</strong></span></label>
        </fieldset>

        <div id="zp-footwear-errors" class="zp-advisor-errors" role="alert" aria-live="assertive" hidden></div>
        <button class="zp-btn zp-submit" type="button" id="zp-footwear-submit">Zjistit vhodný další krok</button>
        <p id="zp-footwear-privacy" class="zp-privacy-note">Odpovědi se neodesílají na server ani nejsou součástí URL. Do analytiky posíláme jen obecné události bez odpovědí.</p>
      </div>

      <noscript><p class="zp-disclaimer">Pro spuštění poradce je potřeba JavaScript. Bez něj se žádné odpovědi neodesílají.</p></noscript>
      <section id="zp-footwear-result" class="zp-result" aria-live="polite" tabindex="-1" hidden></section>
    </div>
  </section>

  <section class="zp-section zp-section-soft">
    <div class="zp-wrap">
      <p class="zp-kicker">Jak vybírat</p>
      <h2 class="zp-section-title">Šířka boty sama nestačí.</h2>
      <div class="zp-decision-grid">
        <article class="zp-decision-card"><h3>Otevření boty</h3><p>Někomu stačí širší vstup a dva pásky na suchý zip. Jindy je potřeba bota, která se otevře téměř celá.</p></article>
        <article class="zp-decision-card"><h3>Otevřená nebo plná špička</h3><p>Otevřená špička může usnadnit nazutí, ale není vhodná pro každou situaci. Pokud je požadována ochrana prstů, držíme se uzavřených modelů.</p></article>
        <article class="zp-decision-card"><h3>Velikost a objem</h3><p>Šířka J, K nebo K+ je jen část informace. Před objednáním musí být změřená obě chodidla a porovnaná s tabulkou konkrétního modelu.</p></article>
      </div>
    </div>
  </section>

  <section class="zp-section">
    <div class="zp-wrap">
      <p class="zp-kicker">Ověřené kandidáty</p>
      <h2 class="zp-section-title">Tři modely, tři různé způsoby obouvání.</h2>
      <p>Shortlist používá PodoWell ARSENE, XAVIER a ALTITUDE od Zdravá Obuv Štěpánková & C. Produkty zobrazíme jen pro kombinaci, která odpovídá jejich konstrukci. Aktuální dostupnost konkrétní velikosti se může změnit.</p>
      <p class="zp-muted-copy">Produktové parametry a dostupnost byly kontrolovány 7. 10. 2026.</p>
    </div>
  </section>

  <section class="zp-section zp-section-soft">
    <div class="zp-wrap">
      <p class="zp-kicker">Kdy výběr bot nestačí</p>
      <h2 class="zp-section-title">Náhlá změna chodidla nepatří jen do nákupního filtru.</h2>
      <p>Pokud se velikost nebo tvar chodidla rychle změnil, je přítomná rána, výrazná bolest nebo rychle vzniklý otok, neřešte situaci jen výběrem širší boty. Zápraží nevyhodnocuje příčinu těchto změn.</p>
    </div>
  </section>
</main>
<?php get_footer(); ?>
