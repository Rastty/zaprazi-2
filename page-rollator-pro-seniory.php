<?php
/* ZP_RELEASE_0_8_147 */
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
      <p class="zp-muted-copy"><a class="zp-text-link" href="<?php echo esc_url( home_url( '/co-zmerit-pred-vyberem-choditka/' ) ); ?>">Co změřit a ověřit před výběrem rollátoru</a> · <a class="zp-text-link" href="#bezpecne-pouziti-rollatoru">Co ověřit před výběrem</a> · <a class="zp-text-link" href="<?php echo esc_url( home_url( '/choditka-pro-seniory/#vyber-typu' ) ); ?>">Zpět na srovnání typů chodítek</a></p>
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

        <fieldset class="zp-fieldset" data-zp-roll-required="handBrakes" data-zp-roll-condition="steady" hidden>
          <legend>Zvládne bezpečně stisknout a používat ruční brzdy?</legend>
          <label class="zp-choice"><input type="radio" name="handBrakes" value="yes" required><span><strong>Ano</strong></span></label>
          <label class="zp-choice"><input type="radio" name="handBrakes" value="no"><span><strong>Ne</strong></span></label>
          <label class="zp-choice"><input type="radio" name="handBrakes" value="unknown"><span><strong>Nevím</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-roll-condition="steady" hidden>
          <legend>Co je prakticky důležité?</legend>
          <label class="zp-choice"><input type="checkbox" name="seatNeeded"><span><strong>Sedátko pro odpočinek</strong></span></label>
          <label class="zp-choice"><input type="checkbox" name="transportNeed"><span><strong>Časté převážení autem</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-roll-condition="steady" hidden>
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
        <article class="zp-card"><h3>Úhrada</h3><p>Pro konkrétní model MEYRA Ideal Rollator 3061982 výrobce uvádí kód ZP 07-5005963. Úhradu a případný doplatek je nutné posoudit podle účinného měsíčního seznamu SÚKL a správné cesty výdeje. Údaj o doplatku na stránce výrobce není automatickým potvrzením nároku konkrétní osoby.</p><p><a class="zp-text-link" href="<?php echo esc_url( home_url( '/choditko-na-pojistovnu/' ) ); ?>">Jak ověřit úhradu chodítka</a></p></article>
      </div>
    </div>
  </section>

  <section id="bezpecne-pouziti-rollatoru" class="zp-section" data-zp-editorial-guide="rollator">
    <div class="zp-wrap">
      <p class="zp-kicker">Brzdy, sedátko a cesta ven</p>
      <h2 class="zp-section-title">Před prvním použitím rollátoru ověřte tyto čtyři situace.</h2>
      <p>Brzděný rollátor není totéž co běžné dvoukolové chodítko. U konkrétního modelu musí člověk zvládnout nejen zpomalování za chůze, ale také zajistit parkovací brzdu před odpočinkem. Samotné označení „má brzdy“ nestačí.</p>
      <div class="zp-decision-grid">
        <article class="zp-decision-card">
          <h3>1. Rozdíl mezi zpomalením a parkovací brzdou</h3>
          <p>U modelu MEYRA Ideal Rollator 3061982 výrobce popisuje brzdové páčky před madly: přitažením se brzdí při pohybu a stlačením dolů se brzda zajistí pro stání. Ovládání jiného modelu se může lišit. Pokud člověk oba úkony nezvládá spolehlivě, nejde o ověřeného kandidáta.</p>
        </article>
        <article class="zp-decision-card">
          <h3>2. Usedání na sedátko</h3>
          <p>Před odpočinkem musí být rollátor plně rozložený, stabilní a podle návodu zabrzděný v parkovací poloze. Nepoužívejte sedátko jako invalidní vozík pro převážení druhou osobou. Když je bezpečný přesun nejistý, přizvěte odborníka; nejde to vyřešit pouhou volbou sedátka.</p>
        </article>
        <article class="zp-decision-card">
          <h3>3. Skutečná venkovní trasa</h3>
          <p>Zvažte nerovný povrch, prudký sklon, vysoké obrubníky, mokré dlaždice a překážky. Návod k modelu MEYRA 3061982 omezuje používání na rovný povrch a upozorňuje na nebezpečí prudkých svahů a schodů. To, že má pomůcka čtyři kola, neznamená, že zvládne jakýkoli chodník.</p>
        </article>
        <article class="zp-decision-card">
          <h3>4. Kontrola před použitím</h3>
          <p>Ověřte účinek obou brzd, zajištění konstrukce proti složení, stabilitu madel a stav kol podle návodu výrobce. Pokud některá brzda nefunguje správně, rollátor se nemá používat před odborným seřízením nebo opravou.</p>
        </article>
      </div>
      <p><a class="zp-text-link" href="<?php echo esc_url( home_url( '/co-zmerit-pred-vyberem-choditka/#co-zmerit' ) ); ?>">Změřit šířku trasy, výšku madel a prostor pro bezpečné otočení</a></p>
      <p class="zp-disclaimer">Nejde o individuální posouzení bezpečnosti. Doporučení modelu se smí zobrazit teprve po ověření zvládání brzd, použití a dalších parametrů; pokud odpovědi nejsou jisté, konkrétní nákup nemá být výchozím řešením.</p>
      <p class="zp-muted-copy">Zdroje ověřeny 11. 10. 2026: <a href="https://www.meyra.cz/ctyrkolove-choditko-rollator.html" target="_blank" rel="noopener">MEYRA — Ideal Rollator 3061982, parametry</a> a <a href="https://www.meyra.cz/upload/files/produkty/Hole-berle-choditka/Navod-k-pouziti-rollator-3061982.pdf" target="_blank" rel="noopener">návod výrobce k modelu 3061982 (verze 02/2018)</a>; <a href="https://www.mayoclinic.org/healthy-lifestyle/healthy-aging/in-depth/walker/art-20546805" target="_blank" rel="noopener">Mayo Clinic — typy chodítek a ovládání</a>. Před použitím platí aktuální návod k dodané variantě; nejde o odbornou individuální revizi.</p>
    </div>
  </section>

  <section class="zp-section zp-section-soft" data-zp-context-links="rollator-acquisition">
    <div class="zp-wrap">
      <p class="zp-kicker">Jak pomůcku získat</p>
      <h2 class="zp-section-title">Rollátor: půjčit, koupit, nebo ověřit úhradu?</h2>
      <p>Při krátkodobém používání lze nejdřív prověřit půjčení brzděného rollátoru v odpovídající velikosti. Pro dlouhodobé použití má smysl porovnat vlastní nákup a postup u zdravotní pojišťovny. Všechny tři cesty předpokládají, že člověk bezpečně zvládne brzdy, přesuny a skutečnou trasu.</p>
      <nav aria-label="Možnosti získání rollátor" class="zp-hero-actions">
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/pujceni-choditka/' ) ); ?>">Kdy dává smysl půjčení a co stojí</a>
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/choditko-na-pojistovnu/' ) ); ?>">Jak ověřit možnost úhrady od pojišťovny</a>
      </nav>
      <p class="zp-disclaimer">Informace o půjčení a úhradě nenahrazují ověření bezpečného typu, rozměrů a způsobu používání. Samotný odkaz není doporučením konkrétního výrobku ani potvrzením nároku na úhradu.</p>
    </div>
  </section>

  <section class="zp-section">
    <div class="zp-wrap zp-faq">
      <h2 class="zp-section-title">Časté otázky</h2>
      <details><summary>Jak poznat, že je rollátor vhodnější než chodítko bez brzd?</summary><p>Rollátor je určený pro plynulejší pohyb po kolečkách a typicky pro použití venku nebo doma i venku. Podmínkou je bezpečné ovládání ručních brzd.</p></details>
      <details><summary>Musí mít rollátor sedátko?</summary><p>Nemusí, ale sedátko je praktické pro člověka, který při delší chůzi potřebuje odpočívat. Při usedání musí být brzdy podle návodu bezpečně zajištěné.</p></details>
      <details><summary>Hradí rollátor zdravotní pojišťovna?</summary><p>U některých konkrétních modelů může existovat úhrada podle podmínek pojištění a platného seznamu SÚKL. U modelu MEYRA Ideal Rollator výrobce uvádí kód ZP 07-5005963, ale údaj výrobce sám o sobě nedokládá aktuální úhradu ani výsledný doplatek. <a class="zp-text-link" href="<?php echo esc_url( home_url( '/choditko-na-pojistovnu/' ) ); ?>">Projděte správný postup před nákupem.</a></p></details>
      <details><summary>Kdy online poradce rollátor nedoporučí?</summary><p>Pokud člověk nezvládá ruční brzdy nebo při chůzi běžně potřebuje fyzickou pomoc druhé osoby.</p></details>
    </div>
  </section>
</main>
<?php get_footer(); ?>
