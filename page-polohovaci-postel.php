<?php
/* ZP_RELEASE_0_8_58 */
/*
Template Name: Zápraží — Polohovací postel
*/
get_header();
?>
<main id="main-content" tabindex="-1">
  <section class="zp-hero">
    <div class="zp-wrap">
      <p class="zp-kicker">Zápraží · Polohovací postel</p>
      <h1>Polohovací postel pro seniory: jak vybrat elektrickou postel a jak ji získat?</h1>
      <p class="zp-lead">Začínáme tím, co má postel doma prakticky vyřešit. Neptáme se na diagnózu ani přesnou hmotnost člověka. Poradce oddělí standardní domácí postel, robustnější variantu a náročnější péči na lůžku — a až potom způsob pořízení.</p>
      <div class="zp-hero-actions">
        <a class="zp-btn" href="#poradce-postel">Spustit poradce</a>
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/' ) ); ?>">Zpět na hlavní stránku</a>
      </div>
    </div>
  </section>

  <section id="poradce-postel" class="zp-wrap zp-advisor-section">
    <div class="zp-panel">
      <p class="zp-kicker">Domácí poradce · Polohovací postel</p>
      <h2>Co má nová postel hlavně vyřešit?</h2>
      <p>Odpovědi zůstávají jen v prohlížeči. Nepotřebujeme jméno, diagnózu ani přesnou hmotnost.</p>

      <div id="zp-bed-advisor" class="zp-advisor-form" role="form" aria-describedby="zp-bed-privacy">
        <fieldset class="zp-fieldset" data-zp-bed-required="primaryNeed">
          <legend>Jaká je hlavní praktická potřeba?</legend>
          <label class="zp-choice"><input type="radio" name="primaryNeed" value="home_positioning" required><span><strong>Běžné elektrické polohování doma</strong><small>Potřebujeme nastavit výšku, záda a nohy a zachovat co největší samostatnost.</small></span></label>
          <label class="zp-choice"><input type="radio" name="primaryNeed" value="caregiver_access"><span><strong>Usnadnit každodenní péči u lůžka</strong><small>Důležitá je hlavně nastavitelná výška a lepší přístup pečující osoby.</small></span></label>
          <label class="zp-choice"><input type="radio" name="primaryNeed" value="robust_high_load"><span><strong>Potřebujeme robustnější postel s vyšší nosností</strong><small>Standardní domácí nosnost nestačí.</small></span></label>
          <label class="zp-choice"><input type="radio" name="primaryNeed" value="advanced_in_bed_care"><span><strong>Náročnější péče přímo na lůžku</strong><small>Potřebujeme specializované funkce, například boční otáčení nebo hygienu na lůžku.</small></span></label>
          <label class="zp-choice"><input type="radio" name="primaryNeed" value="unknown"><span><strong>Nevím</strong><small>Nejdřív se potřebuji zorientovat.</small></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-bed-required="transferAbility">
          <legend>Jak člověk běžně používá postel a přesouvá se z ní?</legend>
          <label class="zp-choice"><input type="radio" name="transferAbility" value="independent" required><span><strong>Vstává a přesedá převážně samostatně</strong></span></label>
          <label class="zp-choice"><input type="radio" name="transferAbility" value="steadying"><span><strong>Potřebuje oporu nebo dohled, ale ne fyzické zvedání</strong></span></label>
          <label class="zp-choice"><input type="radio" name="transferAbility" value="person_assist"><span><strong>Při přesunu běžně fyzicky pomáhá druhá osoba</strong></span></label>
          <label class="zp-choice"><input type="radio" name="transferAbility" value="mostly_in_bed"><span><strong>Většinu času zůstává na lůžku</strong></span></label>
          <label class="zp-choice"><input type="radio" name="transferAbility" value="unknown"><span><strong>Nevím</strong></span></label>
        </fieldset>

        <div id="zp-bed-candidate-note" class="zp-resource-callout" aria-live="polite">
          <strong>Po výběru hlavní potřeby ukážeme nosnost a půdorys kandidátní postele, které je potřeba ověřit.</strong>
        </div>

        <fieldset class="zp-fieldset" data-zp-bed-required="loadFit">
          <legend>Ověřili jste, že nosnost kandidátní postele bezpečně stačí?</legend>
          <label class="zp-choice"><input type="radio" name="loadFit" value="yes" required><span><strong>Ano</strong><small>Přesnou hmotnost člověka do poradce nezadávejte.</small></span></label>
          <label class="zp-choice"><input type="radio" name="loadFit" value="no"><span><strong>Ne</strong></span></label>
          <label class="zp-choice"><input type="radio" name="loadFit" value="unknown"><span><strong>Nevím</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-bed-required="spaceFit">
          <legend>Vejde se kandidátní postel do pokoje a je reálná i cesta pro dopravu/montáž?</legend>
          <label class="zp-choice"><input type="radio" name="spaceFit" value="yes" required><span><strong>Ano, změřeno</strong></span></label>
          <label class="zp-choice"><input type="radio" name="spaceFit" value="no"><span><strong>Ne</strong></span></label>
          <label class="zp-choice"><input type="radio" name="spaceFit" value="unknown"><span><strong>Nevím</strong><small>Nejdřív změřte pokoj, dveře a průchody.</small></span></label>
        </fieldset>

        <fieldset class="zp-fieldset">
          <legend>Jak dlouho bude postel pravděpodobně potřeba?</legend>
          <label class="zp-choice"><input type="radio" name="duration" value="short_term"><span><strong>Spíš dočasně</strong><small>Například zotavení nebo nejistá délka domácí péče.</small></span></label>
          <label class="zp-choice"><input type="radio" name="duration" value="long_term"><span><strong>Spíš dlouhodobě</strong></span></label>
          <label class="zp-choice"><input type="radio" name="duration" value="unknown" checked><span><strong>Nevím</strong></span></label>
        </fieldset>

        <div id="zp-bed-errors" class="zp-advisor-errors" role="alert" aria-live="assertive" hidden></div>
        <button class="zp-btn zp-submit" type="button" id="zp-bed-submit">Zjistit vhodný další krok</button>
        <p id="zp-bed-privacy" class="zp-privacy-note">Odpovědi se neodesílají na server, neukládají se do URL a affiliate systém nedostává kombinaci odpovědí.</p>
      </div>

      <noscript><p class="zp-disclaimer">Pro spuštění poradce je potřeba JavaScript. Bez něj se žádné odpovědi neodesílají.</p></noscript>
      <section id="zp-bed-result" class="zp-result" aria-live="polite" tabindex="-1" hidden></section>
    </div>
  </section>

  <section class="zp-section zp-section-soft">
    <div class="zp-wrap">
      <p class="zp-kicker">Jak rozhodujeme</p>
      <h2 class="zp-section-title">Jak vybrat polohovací postel pro seniora: nejdřív účel, prostor a bezpečné používání.</h2>
      <div class="zp-decision-grid">
        <article class="zp-decision-card"><h3>Standardní domácí postel</h3><p>Pro běžné elektrické nastavení výšky, zad a nohou a jednodušší domácí péči.</p></article>
        <article class="zp-decision-card"><h3>Robustnější varianta</h3><p>Když standardní nosnost nestačí, potřebujeme jinou konstrukci — ne jen „stejnou postel ve větší velikosti“.</p></article>
        <article class="zp-decision-card"><h3>Náročnější péče na lůžku</h3><p>Boční otáčení, hygiena nebo toaleta přímo na lůžku jsou samostatný scénář a nemají být automaticky doporučeny každému.</p></article>
      </div>
    </div>
  </section>

  <section class="zp-section">
    <div class="zp-wrap">
      <p class="zp-kicker">Jak ji získat</p>
      <h2 class="zp-section-title">U polohovací postele často není nejlepší první krok nákup.</h2>
      <div class="zp-hero-actions">
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/polohovaci-postel-na-pojistovnu/' ) ); ?>">Podrobně: pojišťovna, půjčení a kdy koupit</a>
      </div>
      <div class="zp-acquire-grid">
        <article><h3>Půjčit</h3><p>U dočasné potřeby mohou lokální půjčovny elektrickou postel nabídnout za stovky korun měsíčně. Dostupnost, doprava a montáž se liší podle místa.</p></article>
        <article><h3>Prověřit pojišťovnu</h3><p>VZP popisuje předpis, schválení pojišťovnou a také režim cirkulace, kdy může být lůžko pojištěnci zapůjčeno.</p></article>
        <article><h3>Koupit</h3><p>Dává smysl hlavně tam, kde je potřeba dlouhodobá a konkrétní model odpovídá prostoru, nosnosti i praktické péči.</p></article>
      </div>
    </div>
  </section>

  <section class="zp-section zp-section-soft">
    <div class="zp-wrap zp-faq">
      <p class="zp-kicker">Časté otázky</p>
      <h2 class="zp-section-title">Co ověřit před výběrem polohovací postele.</h2>

      <details>
        <summary>Jak vybrat polohovací postel pro seniora?</summary>
        <p>Začněte tím, co má postel doma prakticky vyřešit: běžné elektrické polohování, snazší přístup pečující osoby, vyšší nosnost nebo náročnější péči na lůžku. Potom ověřte způsob přesunu, nosnost, prostor a teprve nakonec způsob pořízení.</p>
      </details>
      <details>
        <summary>Je vždy potřeba elektrická polohovací postel?</summary>
        <p>Ne. Pokud jde jen o pohodlnější vstávání, nemusí být specializované elektrické lůžko automaticky nejlepší řešení. Elektrická polohovací postel dává smysl tehdy, když je potřeba měnit výšku lůžka, polohu zad nebo nohou či usnadnit každodenní péči.</p>
      </details>
      <details>
        <summary>Jaké rozměry změřit před koupí polohovací postele?</summary>
        <p>Změřte místo v pokoji, nejužší dveře a chodby na trase dopravy i prostor kolem postele pro bezpečný přístup. Nestačí znát jen rozměr matrace; rozhoduje celkový půdorys konkrétního lůžka a reálná cesta pro montáž.</p>
      </details>
      <details>
        <summary>Jak ověřit nosnost polohovací postele?</summary>
        <p>Porovnejte technickou nosnost konkrétního modelu s reálnou potřebou a ponechte bezpečnou rezervu podle údajů výrobce. Přesnou hmotnost člověka do poradce Zápraží zadávat nemusíte.</p>
      </details>
      <details>
        <summary>Je lepší polohovací postel půjčit, koupit, nebo řešit přes pojišťovnu?</summary>
        <p>U dočasné nebo nejisté potřeby bývá rozumné nejdřív prověřit půjčení. U dlouhodobé potřeby má smysl před nákupem prověřit také pojišťovnu. Přímý nákup, půjčovna a hrazená cesta jsou tři odlišné způsoby pořízení.</p>
      </details>

      <div class="zp-hero-actions">
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/polohovaci-postel-na-pojistovnu/' ) ); ?>">Pojišťovna, půjčení a nákup</a>
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/bezpecny-byt-pro-seniora/' ) ); ?>">Zkontrolovat prostor a bezpečný byt</a>
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/navrat-z-nemocnice/' ) ); ?>">Připravit návrat domů</a>
      </div>
    </div>
  </section>
</main>
<?php get_footer(); ?>
