<?php get_header(); ?>
<main>
  <section class="zp-hero">
    <div class="zp-wrap">
      <p class="zp-kicker">ZaPrazi 2.0</p>
      <h1>Bezpečně a samostatně doma.</h1>
      <p class="zp-lead">Pomůžeme vám zorientovat se v praktických možnostech, když doma řešíte chůzi, koupelnu, vstávání, schody nebo návrat blízkého z nemocnice.</p>
      <a class="zp-btn" href="#poradce">Zjistit vhodný další krok</a>
    </div>
  </section>

  <section id="poradce" class="zp-wrap zp-advisor-section">
    <div class="zp-panel">
      <p class="zp-kicker">Domácí poradce · Mobilita</p>
      <h2>Co potřebujete vyřešit při chůzi?</h2>
      <p>Odpovězte na několik praktických otázek. Neptáme se na diagnózu a odpovědi se v této verzi nikam neukládají.</p>

      <form id="zp-mobility-advisor" class="zp-advisor-form">
        <fieldset class="zp-fieldset">
          <legend>Kde člověk potřebuje oporu při chůzi?</legend>
          <label class="zp-choice"><input type="radio" name="environment" value="indoor" required><span><strong>Hlavně doma</strong><small>Byt, dům, krátké přesuny mezi místnostmi.</small></span></label>
          <label class="zp-choice"><input type="radio" name="environment" value="outdoor"><span><strong>Hlavně venku</strong><small>Delší chůze, chodníky, nerovnosti.</small></span></label>
          <label class="zp-choice"><input type="radio" name="environment" value="both"><span><strong>Doma i venku</strong><small>Jedno řešení má pomoci v obou situacích.</small></span></label>
        </fieldset>

        <fieldset class="zp-fieldset">
          <legend>Jak velkou oporu při chůzi potřebuje?</legend>
          <label class="zp-choice"><input type="radio" name="supportNeed" value="light" required><span><strong>Spíš lehkou oporu</strong><small>Člověk chodí sám, ale chce větší jistotu.</small></span></label>
          <label class="zp-choice"><input type="radio" name="supportNeed" value="steady"><span><strong>Stabilní oporu při většině kroků</strong><small>Bez opory je chůze nejistá.</small></span></label>
          <label class="zp-choice"><input type="radio" name="supportNeed" value="person_assist"><span><strong>Často pomáhá další osoba</strong><small>Při chůzi je běžně potřeba fyzická pomoc.</small></span></label>
          <label class="zp-choice"><input type="radio" name="supportNeed" value="unknown"><span><strong>Nevím</strong><small>Potřebuji se nejdřív zorientovat.</small></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-conditional="indoor" hidden>
          <legend>Pokud řešíte chodítko domů: zvládne člověk při každém kroku lehce nadzvednout a posunout celé chodítko?</legend>
          <label class="zp-choice"><input type="radio" name="canLiftWalker" value="yes"><span><strong>Ano</strong><small>Mírné nadzvednutí celé pomůcky není problém.</small></span></label>
          <label class="zp-choice"><input type="radio" name="canLiftWalker" value="no"><span><strong>Ne</strong><small>Potřebuje řešení, které se posouvá po předních kolečkách.</small></span></label>
          <label class="zp-choice"><input type="radio" name="canLiftWalker" value="unknown" checked><span><strong>Nevím / netýká se</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-conditional="outdoor" hidden>
          <legend>Pokud řešíte pohyb venku: zvládne člověk bezpečně používat ruční brzdy?</legend>
          <label class="zp-choice"><input type="radio" name="handBrakes" value="yes"><span><strong>Ano</strong></span></label>
          <label class="zp-choice"><input type="radio" name="handBrakes" value="no"><span><strong>Ne</strong></span></label>
          <label class="zp-choice"><input type="radio" name="handBrakes" value="unknown" checked><span><strong>Nevím / netýká se</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset">
          <legend>Co je pro vás prakticky důležité?</legend>
          <label class="zp-choice"><input type="checkbox" name="seatNeeded"><span><strong>Možnost si při chůzi odpočinout</strong></span></label>
          <label class="zp-choice"><input type="checkbox" name="transportNeed"><span><strong>Časté převážení autem</strong></span></label>
          <label class="zp-choice"><input type="checkbox" name="tightSpace"><span><strong>Úzké průchody nebo málo prostoru doma</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset">
          <legend>Jak dlouho bude řešení pravděpodobně potřeba?</legend>
          <label class="zp-choice"><input type="radio" name="duration" value="short_term"><span><strong>Spíš dočasně</strong></span></label>
          <label class="zp-choice"><input type="radio" name="duration" value="long_term"><span><strong>Spíš dlouhodobě</strong></span></label>
          <label class="zp-choice"><input type="radio" name="duration" value="unknown" checked><span><strong>Nevím</strong></span></label>
        </fieldset>

        <button class="zp-btn zp-submit" type="submit">Zjistit vhodný další krok</button>
      </form>

      <section id="zp-mobility-result" class="zp-result" aria-live="polite" tabindex="-1" hidden></section>
    </div>

    <div class="zp-grid">
      <article class="zp-card"><h3>Co řešíte?</h3><p>Začínáme skutečným problémem člověka doma, ne názvem produktu.</p></article>
      <article class="zp-card"><h3>Co může pomoci?</h3><p>Vysvětlíme kandidátní typ řešení a parametry, které má smysl ověřit.</p></article>
      <article class="zp-card"><h3>Jak to získat?</h3><p>Koupit, půjčit nebo nejdříve prověřit možnost úhrady.</p></article>
    </div>
  </section>
</main>
<?php get_footer(); ?>
