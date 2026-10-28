<?php
/* ZP_RELEASE_0_8_178 */
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
      <p class="zp-muted-copy"><a class="zp-text-link" href="<?php echo esc_url( home_url( '/co-zmerit-pred-vyberem-choditka/' ) ); ?>">Nejdřív změřit dveře, madla a prostor doma</a> · <a class="zp-text-link" href="#rozhodnuti-choditko-byt">Co udělat před nákupem</a> · <a class="zp-text-link" href="#bezpecne-pouziti-choditka">Co ověřit před výběrem</a> · <a class="zp-text-link" href="<?php echo esc_url( home_url( '/choditka-pro-seniory/#vyber-typu' ) ); ?>">Zpět na srovnání typů chodítek</a></p>
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

        <fieldset class="zp-fieldset" data-zp-indoor-required="canLiftWalker" data-zp-indoor-condition="steady" hidden>
          <legend>Zvládne při každém kroku lehce nadzvednout a posunout celé chodítko?</legend>
          <label class="zp-choice"><input type="radio" name="canLiftWalker" value="yes" required><span><strong>Ano</strong><small>Čtyřbodové chodítko může být kandidát.</small></span></label>
          <label class="zp-choice"><input type="radio" name="canLiftWalker" value="no"><span><strong>Ne</strong><small>Dává větší smysl dvoukolové provedení.</small></span></label>
          <label class="zp-choice"><input type="radio" name="canLiftWalker" value="unknown"><span><strong>Nevím</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-indoor-condition="steady" hidden>
          <legend>Jsou doma úzké průchody nebo málo místa?</legend>
          <label class="zp-choice"><input type="radio" name="homeSpace" value="tight"><span><strong>Ano</strong></span></label>
          <label class="zp-choice"><input type="radio" name="homeSpace" value="standard"><span><strong>Ne</strong></span></label>
          <label class="zp-choice"><input type="radio" name="homeSpace" value="unknown" checked><span><strong>Nevím</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-indoor-condition="steady" hidden>
          <legend>Je důležité časté převážení autem?</legend>
          <label class="zp-choice"><input type="checkbox" name="transportNeed"><span><strong>Ano, skládání a hmotnost jsou důležité.</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-indoor-condition="steady" hidden>
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

  <section id="bezpecne-pouziti-choditka" class="zp-section" data-zp-editorial-guide="indoor-walker">
    <div class="zp-wrap">
      <p class="zp-kicker">Praktické použití doma</p>
      <h2 class="zp-section-title">Tři situace, které si u chodítka do bytu ověřit ještě před nákupem.</h2>
      <p>Nejde jen o to, zda rám projde dveřmi. Rozhoduje také způsob vstávání, bezpečná chůze mezi místnostmi a stav opěrných částí. Pokud si člověk není jistý postupem nebo potřebuje fyzickou pomoc, nezkoušejte náročný přesun o samotě; požádejte o posouzení fyzioterapeuta.</p>
      <div class="zp-decision-grid">
        <article class="zp-decision-card">
          <h3>1. Vstávání a usedání u křesla</h3>
          <p>Chodítko nemá sloužit jako madlo, za které se člověk vytahuje z křesla. Nejdřív je nutné mít bezpečný způsob vstávání a stabilní sedací plochu. Pokud je třeba fyzická pomoc při přesunu, nepovažujte samotný nákup chodítka za řešení.</p>
        </article>
        <article class="zp-decision-card">
          <h3>2. Roh chodby, práh a cesta na WC</h3>
          <p>Změřte průchozí šířku s otevřenými dveřmi, místo pro otočení a překážky v hlavní trase. Čtyřbodový rám se při posunu nadzvedává; dvoukolový se posouvá předními koly. Ani jeden není určený k improvizovanému překonávání schodů. Volné koberečky a mokré podlahy zvyšují riziko.</p>
          <p><a class="zp-text-link" href="<?php echo esc_url( home_url( '/co-zmerit-pred-vyberem-choditka/#co-zmerit' ) ); ?>">Sedm rozměrů a kontrol před výběrem</a></p>
        </article>
        <article class="zp-decision-card">
          <h3>3. Gumové koncovky a upevnění</h3>
          <p>Před používáním ověřte podle návodu, že jsou všechny části řádně zajištěné, gumové koncovky nejsou opotřebené a dvoukolové provedení má pevně upevněná kola. Při poškození nebo viklání se pomůcka nemá používat, dokud závadu nevyřeší kvalifikovaný dodavatel.</p>
        </article>
      </div>
      <p class="zp-disclaimer">Praktický seznam nenahrazuje posouzení bezpečné chůze. Konkrétní pomůcka musí vyhovovat rozměry, správnému použití a návodu výrobce; při nejistotě musí doporučení zůstat otevřené.</p>
      <p class="zp-muted-copy">Zdroje ověřeny 11. 10. 2026: <a href="https://www.southtees.nhs.uk/resources/how-to-use-a-walking-frame-or-wheeled-walking-frame/" target="_blank" rel="noopener">South Tees Hospitals NHS — použití chodítka a bezpečnostní kontroly</a>; <a href="https://www.mayoclinic.org/healthy-lifestyle/healthy-aging/in-depth/walker/art-20546805" target="_blank" rel="noopener">Mayo Clinic — rozdíly mezi typy chodítek</a>. Jde o redakční návod, bez doložené individuální odborné revize.</p>
    </div>
  </section>

  <section id="rozhodnuti-choditko-byt" class="zp-section zp-section-soft" aria-labelledby="rozhodnuti-choditko-byt-nadpis">
    <div class="zp-wrap">
      <p class="zp-kicker">Praktický akční plán pro rodinu</p>
      <h2 id="rozhodnuti-choditko-byt-nadpis" class="zp-section-title">Co udělat před koupí chodítka do bytu?</h2>
      <p>Výběr není jen mezi čtyřmi nohami a dvěma kolečky. Potřebujete vědět, zda je chůze s pomůckou bezpečná, zda člověk zvládá konkrétní způsob manipulace a zda se chodítko vejde do skutečné trasy.</p>
      <div class="zp-decision-grid">
        <article class="zp-decision-card">
          <h3>Člověk potřebuje fyzickou pomoc nebo není chůze bezpečná</h3>
          <p><strong>Další krok:</strong> nekupovat podle internetového srovnání. Bezpečný způsob chůze a případnou pomoc při přesunu nechte posoudit fyzioterapeutem nebo ergoterapeutem. Chodítko není náhrada doprovodu při nebezpečném přesunu.</p>
        </article>
        <article class="zp-decision-card">
          <h3>Manipulace je nejistá: dokáže chodítko při kroku zvednout?</h3>
          <p><strong>Další krok:</strong> neodhadujte schopnost z fotografie pomůcky. Čtyřbodový rám vyžaduje jiné zacházení než dvoukolový. Výběr a zaučení si nechte ověřit odborníkem; bez jistoty o manipulaci konkrétní výrobek neobjednávejte.</p>
        </article>
        <article class="zp-decision-card">
          <h3>Typ chůze je ověřený, ale neznáte rozměry bytu</h3>
          <p><strong>Další krok:</strong> změřte nejužší skutečný průchod při otevřených dveřích, místo pro otočení a překážky na cestě k WC. Porovnejte s celkovou šířkou přesného modelu včetně potřebného prostoru pro ruce a pohyb.</p>
          <p><a class="zp-text-link" href="<?php echo esc_url( home_url( '/co-zmerit-pred-vyberem-choditka/#co-zmerit' ) ); ?>">Otevřít kontrolní seznam měření</a></p>
        </article>
        <article class="zp-decision-card">
          <h3>Chůze, typ i trasa jsou ověřené</h3>
          <p><strong>Další krok:</strong> pokračujte v hlavním poradci pro chodítko. Teprve tam ověřte přesný model, nastavení výšky, stav koncovek a způsob pořízení. Krátkodobé používání může být důvodem prověřit půjčení.</p>
          <p><a class="zp-text-link" href="#poradce-choditko-byt">Přejít k bezpečnostnímu poradci</a></p>
        </article>
      </div>
      <h3>Pracovní list: šest údajů, které se hodí připravit</h3>
      <ul class="zp-checklist">
        <li>Je bezpečná chůze a způsob používání pomůcky odborně ověřen? ______.</li>
        <li>Potřebuje člověk při chůzi přímou fyzickou pomoc? ______.</li>
        <li>Umí podle bezpečně ověřeného postupu manipulovat s vybraným typem rámu? ______.</li>
        <li>Nejužší průchod a prostor pro otočení na běžné trase: ______ cm.</li>
        <li>Prahy, koberce, mokrá podlaha a další překážky: ______.</li>
        <li>Očekávaná délka potřeby a možnost půjčení / prověření úhrady: ______.</li>
      </ul>
      <p class="zp-disclaimer">Tento pracovní list nepotvrzuje vhodnost žádné pomůcky. Pokud odpovědi o bezpečné chůzi nebo potřebné asistenci chybí, nevybírejte konkrétní produkt bez odborného posouzení.</p>
    </div>
  </section>

  <section class="zp-section zp-section-soft" data-zp-context-links="indoor-walker-acquisition">
    <div class="zp-wrap">
      <p class="zp-kicker">Jak pomůcku získat</p>
      <h2 class="zp-section-title">Chodítko do bytu: půjčit, koupit, nebo ověřit úhradu?</h2>
      <p>Při dočasné potřebě ověřte, zda půjčovna nabízí správnou konstrukci a potřebné rozměry. Pro dlouhodobé používání porovnejte cenu nákupu s podmínkami a možnostmi úhrady. Nejdřív ale dokončete kontrolu typu a bezpečného používání v poradci; půjčení nevhodného modelu problém nevyřeší.</p>
      <nav aria-label="Možnosti získání chodítko do bytu" class="zp-hero-actions">
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/pujceni-choditka/' ) ); ?>">Kdy dává smysl půjčení a co stojí</a>
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/choditko-na-pojistovnu/' ) ); ?>">Jak ověřit možnost úhrady od pojišťovny</a>
      </nav>
      <p class="zp-disclaimer">Informace o půjčení a úhradě nenahrazují ověření bezpečného typu, rozměrů a způsobu používání. Samotný odkaz není doporučením konkrétního výrobku ani potvrzením nároku na úhradu.</p>
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
