<?php
/* ZP_RELEASE_0_8_87 */
/*
Template Name: Zápraží — Obuv pro seniory
*/
get_header();
?>
<main id="main-content" tabindex="-1">
  <section class="zp-hero">
    <div class="zp-wrap">
      <p class="zp-kicker">Zápraží · Snadné obouvání</p>
      <h1>Obuv pro seniory: široké boty na suchý zip podle otevření, šířky a špičky.</h1>
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
      <h2 class="zp-section-title">Jak vybrat obuv pro seniora: šířka sama nestačí.</h2>
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

  <section class="zp-section zp-section-soft">
    <div class="zp-wrap zp-faq">
      <p class="zp-kicker">Časté otázky</p>
      <h2 class="zp-section-title">Co ověřit před nákupem obuvi pro seniora.</h2>

      <details>
        <summary>Jak vybrat obuv pro seniora?</summary>
        <p>Začněte tím, jak snadno se musí bota otevřít a nazout. Potom řešte potřebnou šířku, otevřenou nebo uzavřenou špičku, ovladatelnost suchého zipu a velikost podle aktuálního změření obou chodidel.</p>
      </details>
      <details>
        <summary>Jsou boty na suchý zip pro seniory vždy nejlepší?</summary>
        <p>Ne vždy, ale často usnadní obouvání a dovolí upravit objem boty. Smysl dávají jen tehdy, když člověk zvládne pásek bezpečně otevřít a zapnout a konkrétní model odpovídá šířkou i velikostí.</p>
      </details>
      <details>
        <summary>Jak vybrat boty pro širokou nebo objemnější nohu?</summary>
        <p>Nespoléhejte jen na běžnou konfekční velikost. Sledujte šířku konkrétního modelu, velikost vstupního otvoru a možnost regulace přes nárt. Obě chodidla změřte a porovnejte s tabulkou výrobce.</p>
      </details>
      <details>
        <summary>Je lepší otevřená, nebo uzavřená špička?</summary>
        <p>Otevřená špička může usnadnit nazutí a nabídnout více prostoru. Uzavřená špička dává větší ochranu prstům. Volba proto závisí na praktickém používání, ne jen na vzhledu.</p>
      </details>
      <details>
        <summary>Kdy nestačí jen koupit širší botu?</summary>
        <p>Pokud se tvar nebo velikost chodidla rychle změnil, je přítomná rána, výrazná bolest nebo rychle vzniklý otok, Zápraží situaci nepovažuje jen za problém výběru obuvi a nedoporučuje řešit ji pouze nákupem širšího modelu.</p>
      </details>

      <div class="zp-hero-actions">
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/bezpecny-byt-pro-seniora/' ) ); ?>">Bezpečný byt pro seniora</a>
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/kompenzacni-pomucky-pro-seniory/' ) ); ?>">Přehled pomůcek pro seniory</a>
      </div>
    </div>
  </section>
</main>
<?php get_footer(); ?>
