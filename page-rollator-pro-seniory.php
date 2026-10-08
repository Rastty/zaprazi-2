<?php
/* ZP_RELEASE_0_8_50 */
/*
Template Name: Zápraží — Rollátor pro seniory
*/
get_header();
?>
<main id="main-content" tabindex="-1">
  <section class="zp-hero">
    <div class="zp-wrap">
      <p class="zp-kicker">Zápraží · Chůze venku</p>
      <h1>Rollátor pro seniory: kdy dává smysl čtyřkolové chodítko s brzdami?</h1>
      <p class="zp-lead">Rollátor dává smysl jen tehdy, když člověk bezpečně zvládá ruční brzdy. Vedle šířky a výšky řešte také sedátko, skládání, nosnost a prostor pro bezpečné otáčení.</p>
      <a class="zp-btn" href="#poradce-rollator">Spustit poradce</a>
    </div>
  </section>

  <section id="poradce-rollator" class="zp-wrap zp-advisor-section">
    <div class="zp-panel">
      <p class="zp-kicker">Domácí poradce · Rollátor</p>
      <h2>Zvládne člověk bezpečně používat ruční brzdy?</h2>
      <p>Neptáme se na diagnózu. Pokud brzdy bezpečně nezvládá, brzděný rollátor automaticky nedoporučíme.</p>

      <div id="zp-rollator-advisor" class="zp-advisor-form" role="form">
        <fieldset class="zp-fieldset" data-zp-roll-required="supportNeed">
          <legend>Jak velkou oporu při chůzi potřebuje?</legend>
          <label class="zp-choice"><input type="radio" name="supportNeed" value="steady" required><span><strong>Stabilní oporu při většině kroků</strong></span></label>
          <label class="zp-choice"><input type="radio" name="supportNeed" value="light"><span><strong>Spíš lehkou oporu</strong></span></label>
          <label class="zp-choice"><input type="radio" name="supportNeed" value="person_assist"><span><strong>Často fyzicky pomáhá další osoba</strong></span></label>
          <label class="zp-choice"><input type="radio" name="supportNeed" value="unknown"><span><strong>Nevím</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-roll-required="handBrakes">
          <legend>Zvládne bezpečně stisknout a používat ruční brzdy?</legend>
          <label class="zp-choice"><input type="radio" name="handBrakes" value="yes" required><span><strong>Ano</strong></span></label>
          <label class="zp-choice"><input type="radio" name="handBrakes" value="no"><span><strong>Ne</strong></span></label>
          <label class="zp-choice"><input type="radio" name="handBrakes" value="unknown"><span><strong>Nevím</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset">
          <legend>Co je prakticky důležité?</legend>
          <label class="zp-choice"><input type="checkbox" name="seatNeeded"><span><strong>Sedátko pro odpočinek</strong></span></label>
          <label class="zp-choice"><input type="checkbox" name="transportNeed"><span><strong>Časté převážení autem</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset">
          <legend>Jak dlouho bude řešení pravděpodobně potřeba?</legend>
          <label class="zp-choice"><input type="radio" name="duration" value="short_term"><span><strong>Spíš dočasně</strong></span></label>
          <label class="zp-choice"><input type="radio" name="duration" value="long_term"><span><strong>Spíš dlouhodobě</strong></span></label>
          <label class="zp-choice"><input type="radio" name="duration" value="unknown" checked><span><strong>Nevím</strong></span></label>
        </fieldset>

        <div id="zp-rollator-errors" class="zp-advisor-errors" role="alert" aria-live="assertive" hidden></div>
        <button class="zp-btn zp-submit" type="button" id="zp-rollator-submit">Zjistit vhodný další krok</button>
        <p class="zp-privacy-note">Odpovědi zůstávají v prohlížeči.</p>
      </div>

      <section id="zp-rollator-result" class="zp-result" aria-live="polite" tabindex="-1" hidden></section>
    </div>
  </section>

  <section class="zp-section zp-section-soft">
    <div class="zp-wrap">
      <h2 class="zp-section-title">Ověřený kandidát: MEYRA Ideal Rollator 3061982.</h2>
      <div class="zp-grid">
        <article class="zp-card"><h3>Rozměry</h3><p>Výška madel 79–97 cm, šířka 61,5 cm, nosnost 130 kg.</p></article>
        <article class="zp-card"><h3>Brzdy a sedátko</h3><p>Výrobce uvádí přítlačné brzdy s možností aretace, sedátko, podnos a košík.</p></article>
        <article class="zp-card"><h3>Úhrada</h3><p>Výrobce aktuálně uvádí kód ZP 07-5005963, cenu i úhradu 3 408 Kč a doplatek 0 Kč. Individuální nárok ale Zápraží nepotvrzuje.</p></article>
      </div>
    </div>
  </section>

  <section class="zp-section">
    <div class="zp-wrap zp-faq">
      <h2 class="zp-section-title">Časté otázky</h2>
      <details><summary>Jak poznat, že je rollátor vhodnější než chodítko bez brzd?</summary><p>Rollátor je určený pro plynulejší pohyb po kolečkách a typicky pro použití venku nebo doma i venku. Podmínkou je bezpečné ovládání ručních brzd.</p></details>
      <details><summary>Musí mít rollátor sedátko?</summary><p>Nemusí, ale sedátko je praktické pro člověka, který při delší chůzi potřebuje odpočívat. Při usedání musí být brzdy podle návodu bezpečně zajištěné.</p></details>
      <details><summary>Hradí rollátor zdravotní pojišťovna?</summary><p>Některé konkrétní modely ano. MEYRA aktuálně uvádí u modelu Ideal Rollator kód ZP 07-5005963 a plnou úhradu. Individuální nárok a správný postup je ale potřeba ověřit před nákupem.</p></details>
      <details><summary>Kdy online poradce rollátor nedoporučí?</summary><p>Pokud člověk nezvládá ruční brzdy nebo při chůzi běžně potřebuje fyzickou pomoc druhé osoby.</p></details>
    </div>
  </section>
</main>
<?php get_footer(); ?>
