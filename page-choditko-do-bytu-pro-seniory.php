<?php
/* ZP_RELEASE_0_8_37 */
/*
Template Name: Zápraží — Chodítko do bytu pro seniory
*/
get_header();
?>
<main id="main-content" tabindex="-1">
  <section class="zp-hero">
    <div class="zp-wrap">
      <p class="zp-kicker">Zápraží · Chůze doma</p>
      <h1>Chodítko do bytu pro seniory: čtyřbodové, nebo dvoukolové?</h1>
      <p class="zp-lead">Nejdůležitější rozdíl není značka, ale způsob používání. Čtyřbodové chodítko se při kroku lehce nadzvedává. Dvoukolové se posouvá po předních kolečkách a zadní nohy zůstávají opěrné.</p>
      <a class="zp-btn" href="#poradce-choditko-byt">Spustit poradce</a>
    </div>
  </section>

  <section id="poradce-choditko-byt" class="zp-wrap zp-advisor-section">
    <div class="zp-panel">
      <p class="zp-kicker">Domácí poradce · Chodítko do bytu</p>
      <h2>Zvládne člověk při každém kroku chodítko lehce nadzvednout?</h2>
      <p>Neptáme se na diagnózu. Rozhodujeme podle potřebné opory, manipulace, průchodů a délky používání.</p>

      <div id="zp-indoor-walker-advisor" class="zp-advisor-form" role="form">
        <fieldset class="zp-fieldset" data-zp-indoor-required="supportNeed">
          <legend>Jak velkou oporu při chůzi potřebuje?</legend>
          <label class="zp-choice"><input type="radio" name="supportNeed" value="steady" required><span><strong>Stabilní oporu při většině kroků</strong></span></label>
          <label class="zp-choice"><input type="radio" name="supportNeed" value="light"><span><strong>Spíš lehkou oporu</strong></span></label>
          <label class="zp-choice"><input type="radio" name="supportNeed" value="person_assist"><span><strong>Často fyzicky pomáhá další osoba</strong></span></label>
          <label class="zp-choice"><input type="radio" name="supportNeed" value="unknown"><span><strong>Nevím</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-indoor-required="canLiftWalker">
          <legend>Zvládne při každém kroku lehce nadzvednout a posunout celé chodítko?</legend>
          <label class="zp-choice"><input type="radio" name="canLiftWalker" value="yes" required><span><strong>Ano</strong><small>Čtyřbodové chodítko může být kandidát.</small></span></label>
          <label class="zp-choice"><input type="radio" name="canLiftWalker" value="no"><span><strong>Ne</strong><small>Dává větší smysl dvoukolové provedení.</small></span></label>
          <label class="zp-choice"><input type="radio" name="canLiftWalker" value="unknown"><span><strong>Nevím</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset">
          <legend>Jsou doma úzké průchody nebo málo místa?</legend>
          <label class="zp-choice"><input type="radio" name="homeSpace" value="tight"><span><strong>Ano</strong></span></label>
          <label class="zp-choice"><input type="radio" name="homeSpace" value="standard"><span><strong>Ne</strong></span></label>
          <label class="zp-choice"><input type="radio" name="homeSpace" value="unknown" checked><span><strong>Nevím</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset">
          <legend>Je důležité časté převážení autem?</legend>
          <label class="zp-choice"><input type="checkbox" name="transportNeed"><span><strong>Ano, skládání a hmotnost jsou důležité.</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset">
          <legend>Jak dlouho bude řešení pravděpodobně potřeba?</legend>
          <label class="zp-choice"><input type="radio" name="duration" value="short_term"><span><strong>Spíš dočasně</strong></span></label>
          <label class="zp-choice"><input type="radio" name="duration" value="long_term"><span><strong>Spíš dlouhodobě</strong></span></label>
          <label class="zp-choice"><input type="radio" name="duration" value="unknown" checked><span><strong>Nevím</strong></span></label>
        </fieldset>

        <div id="zp-indoor-walker-errors" class="zp-advisor-errors" role="alert" aria-live="assertive" hidden></div>
        <button class="zp-btn zp-submit" type="button" id="zp-indoor-walker-submit">Zjistit vhodný další krok</button>
        <p class="zp-privacy-note">Odpovědi zůstávají v prohlížeči a nejsou součástí adresy stránky.</p>
      </div>

      <section id="zp-indoor-walker-result" class="zp-result" aria-live="polite" tabindex="-1" hidden></section>
    </div>
  </section>

  <section class="zp-section zp-section-soft">
    <div class="zp-wrap">
      <h2 class="zp-section-title">WA17 vs. WA21: hlavní rozdíl.</h2>
      <div class="zp-decision-grid">
        <article class="zp-decision-card"><h3>BESCO WA17</h3><p>Čtyři pevné opěrné body. Hmotnost 2,3 kg, šířka 59 cm, výška 80–98 cm, nosnost 110 kg. Při kroku se celé chodítko mírně nadzvedává.</p></article>
        <article class="zp-decision-card"><h3>BESCO WA21</h3><p>Dvě přední kolečka a dvě zadní opěrné nohy. Hmotnost 2,8 kg, šířka 60 cm, výška 81–99 cm, nosnost 110 kg. Není potřeba zvedat celou konstrukci při každém kroku.</p></article>
      </div>
    </div>
  </section>

  <section class="zp-section">
    <div class="zp-wrap zp-faq">
      <h2 class="zp-section-title">Časté otázky</h2>
      <details><summary>Jaké chodítko je vhodnější do bytu?</summary><p>Záleží hlavně na tom, zda člověk potřebuje stabilní oporu a zvládne chodítko při kroku lehce nadzvednout. Pokud ne, může být praktičtější dvoukolové provedení.</p></details>
      <details><summary>Kolik místa chodítko potřebuje?</summary><p>WA17 má celkovou šířku 59 cm a WA21 60 cm. Před nákupem proto změřte nejužší dveře a průchody v místě, kde se bude chodítko používat.</p></details>
      <details><summary>Je lehčí chodítko automaticky lepší?</summary><p>Ne. Nižší hmotnost usnadňuje manipulaci, ale typ chodítka musí odpovídat způsobu chůze a potřebné opoře.</p></details>
      <details><summary>Kdy online poradce konkrétní chodítko nedoporučí?</summary><p>Pokud člověk při chůzi běžně potřebuje fyzickou pomoc druhé osoby nebo není jasné, jak velkou oporu skutečně potřebuje.</p></details>
    </div>
  </section>
</main>
<?php get_footer(); ?>
