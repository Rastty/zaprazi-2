<?php
/* ZP_RELEASE_0_8_47 */
/*
Template Name: Zápraží — Sedátko do vany pro seniory
*/
get_header();
?>
<main id="main-content" tabindex="-1">
  <section class="zp-hero">
    <div class="zp-wrap">
      <p class="zp-kicker">Zápraží · Vana · Přesun</p>
      <h1>Sedátko do vany pro seniory: přes okraj vany, nebo transferová lavice?</h1>
      <p class="zp-lead">Nejdřív ověřte, jestli člověk zvládne samostatně usednout a přenést nohy přes okraj vany. Pak rozhodují rozměry vany a prostor kolem ní. Pokud klasická sedačka přes vanu nepasuje, může dávat smysl transferová židle s částí konstrukce mimo vanu.</p>
      <div class="zp-hero-actions">
        <a class="zp-btn" href="#poradce-sedatko-vana">Spustit poradce</a>
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/sprchovaci-zidle-pro-seniory/' ) ); ?>">Řeším sprchový kout</a>
      </div>
    </div>
  </section>

  <section id="poradce-sedatko-vana" class="zp-wrap zp-advisor-section">
    <div class="zp-panel">
      <p class="zp-kicker">Domácí poradce · Vana</p>
      <h2>Zvládne člověk bezpečný přesun přes okraj vany bez fyzického zvedání?</h2>
      <p>Neptáme se na diagnózu. Rozhodujeme podle samostatnosti přesunu, nosnosti a přesných rozměrů vany a prostoru kolem ní.</p>

      <div id="zp-bath-transfer-advisor" class="zp-advisor-form" role="form">
        <fieldset class="zp-fieldset" data-zp-bath-required="transferAbility">
          <legend>Jak člověk přesedá?</legend>
          <label class="zp-choice"><input type="radio" name="transferAbility" value="independent" required><span><strong>Samostatně</strong></span></label>
          <label class="zp-choice"><input type="radio" name="transferAbility" value="steadying"><span><strong>Potřebuje stabilní oporu rukama</strong></span></label>
          <label class="zp-choice"><input type="radio" name="transferAbility" value="person_assist"><span><strong>Je potřeba fyzická pomoc druhé osoby</strong></span></label>
          <label class="zp-choice"><input type="radio" name="transferAbility" value="unknown"><span><strong>Nevím</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-bath-required="bathTransferIndependent">
          <legend>Dokáže bezpečně usednout a přenést obě nohy přes okraj vany bez fyzické pomoci?</legend>
          <label class="zp-choice"><input type="radio" name="bathTransferIndependent" value="yes" required><span><strong>Ano</strong></span></label>
          <label class="zp-choice"><input type="radio" name="bathTransferIndependent" value="no"><span><strong>Ne</strong></span></label>
          <label class="zp-choice"><input type="radio" name="bathTransferIndependent" value="unknown"><span><strong>Nevím</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-bath-required="bathFit">
          <legend>Pasuje klasická sedačka přes okraj vany?</legend>
          <label class="zp-choice"><input type="radio" name="bathFit" value="yes" required><span><strong>Ano</strong><small>Vnitřní šířka okrajů vany je 41–65 cm a sedačku lze pevně zajistit.</small></span></label>
          <label class="zp-choice"><input type="radio" name="bathFit" value="no"><span><strong>Ne</strong></span></label>
          <label class="zp-choice"><input type="radio" name="bathFit" value="unknown"><span><strong>Nevím</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset">
          <legend>Pokud sedačka přes okraj nepasuje: vejde se transferová konstrukce 81 × 61 cm?</legend>
          <label class="zp-choice"><input type="radio" name="bathBenchFit" value="yes"><span><strong>Ano</strong><small>Jedna strana může stát ve vaně a druhá na stabilní podlaze mimo vanu.</small></span></label>
          <label class="zp-choice"><input type="radio" name="bathBenchFit" value="no"><span><strong>Ne</strong></span></label>
          <label class="zp-choice"><input type="radio" name="bathBenchFit" value="unknown" checked><span><strong>Nevím</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-bath-required="loadFit">
          <legend>Je ověřeno, že nosnost konkrétního řešení bezpečně vyhovuje?</legend>
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

        <div id="zp-bath-transfer-errors" class="zp-advisor-errors" role="alert" aria-live="assertive" hidden></div>
        <button class="zp-btn zp-submit" type="button" id="zp-bath-transfer-submit">Zjistit vhodný další krok</button>
        <p class="zp-privacy-note">Odpovědi zůstávají v prohlížeči. Do affiliate ani analytiky neposíláme kombinaci odpovědí.</p>
      </div>

      <section id="zp-bath-transfer-result" class="zp-result" aria-live="polite" tabindex="-1" hidden></section>
    </div>
  </section>

  <section class="zp-section zp-section-soft">
    <div class="zp-wrap">
      <p class="zp-kicker">Dvě různé konstrukce</p>
      <h2 class="zp-section-title">Sedačka na okraj vany a transferová židle přes vanu nejsou totéž.</h2>
      <div class="zp-decision-grid">
        <article class="zp-decision-card"><h3>Sedačka přes okraj vany</h3><p>BESCO BS008 má sedací plochu 69 × 31 cm a je určená pro vnitřní šířku vany 41–65 cm. Musí jít pevně zajistit bez posunu.</p></article>
        <article class="zp-decision-card"><h3>Transferová židle přes vanu</h3><p>UNIZDRAV P2203 má celkový půdorys 81 × 61 cm; jedna strana konstrukce stojí ve vaně a druhá na podlaze mimo vanu. Potřebuje tedy výrazně víc místa.</p></article>
      </div>
    </div>
  </section>

  <section class="zp-section">
    <div class="zp-wrap zp-faq">
      <p class="zp-kicker">Časté otázky</p>
      <h2 class="zp-section-title">Sedátko do vany: rychlá orientace.</h2>
      <details><summary>Jak změřit vanu pro sedátko?</summary><p>U sedačky přes okraj vany změřte vnitřní vzdálenost mezi okraji vany a ověřte rozsah výrobku. U BESCO BS008 je ověřený rozsah 41–65 cm.</p></details>
      <details><summary>Kdy dává smysl transferová lavice přes vanu?</summary><p>Když klasická sedačka na okraj vany rozměrově nepasuje, ale je dostatek prostoru pro konstrukci, která stojí částečně ve vaně a částečně na podlaze mimo vanu.</p></details>
      <details><summary>Kdy online poradce konkrétní sedátko nedoporučí?</summary><p>Pokud člověk nezvládne bezpečně samostatný přesun přes okraj vany nebo je běžně potřeba fyzické zvedání druhou osobou. V takové situaci je nejdřív potřeba bezpečný postup přesunu.</p></details>
      <details><summary>Hradí sedátko do vany zdravotní pojišťovna?</summary><p>Některé konkrétní koupelnové zdravotnické prostředky hrazené být mohou, ale retail produkt není automaticky hrazený. Úhrada se musí ověřit podle přesného prostředku a aktuálních podmínek.</p></details>
    </div>
  </section>
</main>
<?php get_footer(); ?>
