<?php
/* ZP_RELEASE_0_8_96 */
/*
Template Name: Zápraží — Madlo k WC pro seniory
*/
get_header();
?>
<main id="main-content" tabindex="-1">
  <section class="zp-hero">
    <div class="zp-wrap">
      <p class="zp-kicker">Zápraží · WC · Opora</p>
      <h1>Madlo k WC pro seniory: pevné do zdi, nebo toaletní opora?</h1>
      <p class="zp-lead">Nejdřív rozhodněte, jestli máte bezpečně ověřené kotvení do stěny. Pokud ano, může dávat smysl pevné madlo. Pokud ne, porovnejte toaletní oporu, která není závislá na nosnosti konkrétní stěny.</p>
      <div class="zp-hero-actions">
        <a class="zp-btn" href="#poradce-opora-wc">Spustit poradce</a>
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/nastavec-na-wc-pro-seniory/' ) ); ?>">Řeším spíš nízké WC</a>
      </div>
    </div>
  </section>

  <section id="poradce-opora-wc" class="zp-wrap zp-advisor-section">
    <div class="zp-panel">
      <p class="zp-kicker">Domácí poradce · Opora u WC</p>
      <h2>Je bezpečné kotvení madla do stěny opravdu ověřené?</h2>
      <p>Neptáme se na diagnózu. Rozhodujeme podle přesunu, místa úchopu, prostoru, nosnosti a ověřeného kotvení.</p>

      <div id="zp-toilet-support-advisor" class="zp-advisor-form" role="form">
        <fieldset class="zp-fieldset" data-zp-support-required="transferAbility">
          <legend>Jak člověk sedá na WC a vstává?</legend>
          <label class="zp-choice"><input type="radio" name="transferAbility" value="independent" required><span><strong>Samostatně</strong></span></label>
          <label class="zp-choice"><input type="radio" name="transferAbility" value="steadying"><span><strong>Potřebuje stabilní oporu rukama</strong></span></label>
          <label class="zp-choice"><input type="radio" name="transferAbility" value="person_assist"><span><strong>Je potřeba fyzická pomoc druhé osoby</strong></span></label>
          <label class="zp-choice"><input type="radio" name="transferAbility" value="unknown"><span><strong>Nevím</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-support-required="wallFixing">
          <legend>Je ověřeno bezpečné kotvení do skutečně nosného podkladu?</legend>
          <label class="zp-choice"><input type="radio" name="wallFixing" value="verified" required><span><strong>Ano</strong><small>Materiál zdi a způsob kotvení jsou ověřené.</small></span></label>
          <label class="zp-choice"><input type="radio" name="wallFixing" value="unverified"><span><strong>Ne, zatím neověřeno</strong></span></label>
          <label class="zp-choice"><input type="radio" name="wallFixing" value="not_possible"><span><strong>Kotvení do stěny není možné</strong></span></label>
          <label class="zp-choice"><input type="radio" name="wallFixing" value="unknown"><span><strong>Nevím</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset">
          <legend>Pouze u samostatné toaletní opory P2015: pasuje kolem WC rozměry i způsobem upevnění?</legend>
          <label class="zp-choice"><input type="radio" name="supportFrameFit" value="yes"><span><strong>Ano, ověřeno</strong><small>Šířka 53–63 cm, hloubka 47 cm a upevnění včetně rozteče otvorů 14,4 cm vyhovují.</small></span></label>
          <label class="zp-choice"><input type="radio" name="supportFrameFit" value="no"><span><strong>Ne</strong></span></label>
          <label class="zp-choice"><input type="radio" name="supportFrameFit" value="unknown"><span><strong>Nevím</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-support-required="loadFit">
          <legend>Je ověřeno, že nosnost konkrétní pomůcky bezpečně vyhovuje?</legend>
          <label class="zp-choice"><input type="radio" name="loadFit" value="yes" required><span><strong>Ano</strong></span></label>
          <label class="zp-choice"><input type="radio" name="loadFit" value="no"><span><strong>Ne</strong></span></label>
          <label class="zp-choice"><input type="radio" name="loadFit" value="unknown"><span><strong>Nevím</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset">
          <legend>Jak dlouho bude řešení pravděpodobně potřeba?</legend>
          <label class="zp-choice"><input type="radio" name="duration" value="short_term"><span><strong>Spíš dočasně</strong></span></label>
          <label class="zp-choice"><input type="radio" name="duration" value="long_term"><span><strong>Spíš dlouhodobě</strong></span></label>
          <label class="zp-choice"><input type="radio" name="duration" value="unknown" checked><span><strong>Nevím</strong></span></label>
        </fieldset>

        <section id="zp-toilet-support-preview" class="zp-result" tabindex="-1" aria-live="polite" hidden></section>
        <section id="zp-toilet-support-fit-stage" class="zp-bathroom-fit-stage" aria-labelledby="zp-toilet-support-fit-title" hidden>
          <h3 id="zp-toilet-support-fit-title">2. Ověřte nosnost a rozměry konkrétní pomůcky</h3>
          <p>V předchozím kroku jste viděli model i technické údaje. Teď ověřte, zda vyhovují člověku a prostředí doma. Při nejistotě vyberte <strong>Nevím</strong>.</p>
        </section>
        <div id="zp-toilet-support-errors" class="zp-advisor-errors" role="alert" aria-live="assertive" hidden></div>
        <button class="zp-btn zp-submit" type="button" id="zp-toilet-support-submit">1. Ukázat možný výrobek</button>
        <p class="zp-privacy-note">Odpovědi zůstávají v prohlížeči. Do affiliate ani analytiky neposíláme kombinaci odpovědí.</p>
      </div>

      <section id="zp-toilet-support-result" class="zp-result" aria-live="polite" tabindex="-1" hidden></section>
    </div>
  </section>

  <section class="zp-section zp-section-soft">
    <div class="zp-wrap">
      <p class="zp-kicker">Dvě různé cesty</p>
      <h2 class="zp-section-title">Nástěnné madlo a toaletní opora řeší jiný instalační problém.</h2>
      <div class="zp-decision-grid">
        <article class="zp-decision-card"><h3>Pevné madlo do zdi</h3><p>UNIZDRAV P2131 je pevné protiskluzové madlo v délkách 30, 40 a 45 cm. Samotná deklarovaná nosnost výrobku ale neříká nic o nosnosti konkrétní montáže.</p></article>
        <article class="zp-decision-card"><h3>Toaletní opora</h3><p>UNIZDRAV P2015 je výškově i šířkově nastavitelný rám. Hodí se tam, kde potřebujete oporu na obou stranách a nechcete být závislí na neověřeném kotvení do stěny.</p></article>
      </div>
    </div>
  </section>

  <section class="zp-section">
    <div class="zp-wrap zp-faq">
      <p class="zp-kicker">Časté otázky</p>
      <h2 class="zp-section-title">Opora u WC: rychlá orientace.</h2>
      <details><summary>Je lepší madlo do zdi, nebo toaletní opora?</summary><p>Záleží hlavně na prostoru a bezpečném kotvení. Pokud je nosný podklad spolehlivě ověřený, může být pevné madlo jednoduché řešení. Pokud kotvení jisté není, dává větší smysl porovnat samostatnou toaletní oporu.</p></details>
      <details><summary>Jak vysoko umístit madlo k WC?</summary><p>Výška a poloha musí odpovídat konkrétnímu úchopu při sedání a vstávání. Univerzální výška neexistuje; důležitější je bezpečný dosah a správné kotvení.</p></details>
      <details><summary>Stačí znát nosnost madla?</summary><p>Ne. Deklarovaná nosnost výrobku neznamená automaticky stejnou nosnost montáže ve zdi. Je potřeba ověřit materiál podkladu, spojovací materiál a způsob instalace.</p></details>
      <details><summary>Kdy online poradce konkrétní oporu nedoporučí?</summary><p>Pokud je při přesunu běžně potřeba fyzické zvedání druhou osobou nebo není ověřená potřebná nosnost. V takové situaci je nejdřív potřeba bezpečný postup přesunu a vhodný typ pomůcky.</p></details>
    </div>
  </section>
</main>
<?php get_footer(); ?>
