<?php
/* ZP_RELEASE_0_8_218 */
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
      <a class="zp-btn" data-zp-journey="advisor" href="#poradce-rollator">Spustit poradce</a>
      <p class="zp-muted-copy"><a class="zp-text-link" href="<?php echo esc_url( home_url( '/co-zmerit-pred-vyberem-choditka/' ) ); ?>">Co změřit a ověřit před výběrem rollátoru</a> · <a class="zp-text-link" href="#rollator-uzke-dvere">Projde rollátor dveřmi 60 cm?</a> · <a class="zp-text-link" href="#bezpecne-pouziti-rollatoru">Co ověřit před výběrem</a> · <a class="zp-text-link" href="<?php echo esc_url( home_url( '/choditka-pro-seniory/#vyber-typu' ) ); ?>">Zpět na srovnání typů chodítek</a></p>
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

  <section id="rollator-uzke-dvere" class="zp-section zp-section-soft" aria-labelledby="rollator-uzke-dvere-nadpis">
    <div class="zp-wrap">
      <p class="zp-kicker">Úzké dveře · Kontrola před nákupem</p>
      <h2 id="rollator-uzke-dvere-nadpis" class="zp-section-title">Projde rollátor dveřmi širokými 60 cm?</h2>
      <p><strong>Nerozhoduje název modelu, ale skutečná volná šířka průchodu a přesně dodaná varianta.</strong> Aktuální produktový detail výrobce MEYRA a novější návod pro Ideal Rollator 3061982 uvádějí celkovou šířku <strong>61,5 cm</strong>. Pokud naměříte mezi otevřenými dveřmi a zárubní opravdu jen <strong>60 cm</strong>, podle tohoto údaje se takto široký model nevejde. Nezkoušejte průchod vynutit ani automaticky nevybírejte jinou pomůcku pouze podle centimetru.</p>
      <p><strong>Pozor, veřejné podklady se liší:</strong> starší návod MEYRA označený jako verze 02/2018 pro model 3061982 uvádí <strong>59 cm</strong>, zatímco novější návod uvádí <strong>615 mm</strong>. Rozdíl není doklad, že konkrétní objednávaný kus projde; může jít o odlišnou revizi nebo dokumentaci. Pokud není přesná varianta jistá, používejte do potvrzení širší publikovaný rozměr. Před závazným výběrem požádejte výrobce či výdejce o rozměr <strong>přesné dodávané varianty</strong>, ideálně potvrzený pro nejširší místo rozloženého rollátoru včetně vystupujících částí.</p>
      <p><strong>Pozor na podobné názvy:</strong> výrobce samostatně nabízí <strong>ROLLATOR 2, kód 3061982-R, se šířkou 59 cm</strong>. Není to totožná produktová položka jako IDEAL ROLLATOR 3061982 (61,5 cm). Ani katalogových 59 cm u jiné varianty nepotvrzuje, že člověk s pomůckou bezpečně projde 60cm dveřmi; stále je nutné ověřit skutečný kus, volný prostor pro ruce a bezpečnou manipulaci. Nezaměňujte kódy variant při porovnávání obchodních nabídek.</p>
      <div class="zp-decision-grid">
        <article class="zp-decision-card">
          <h3>1. Změřte skutečný průchod</h3>
          <p>Otevřete dveře do běžné polohy a změřte nejužší volný prostor mezi křídlem, klikou a zárubní. Nezapomeňte na místo k otočení u WC, postele nebo v předsíni.</p>
        </article>
        <article class="zp-decision-card">
          <h3>2. Ověřte přesný kus, ne podobný katalog</h3>
          <p>Požádejte o kód přesné varianty, aktuální návod a celkovou provozní šířku. Rozporných 59 a 61,5 cm neberte jako toleranci ani příslib průjezdu.</p>
        </article>
        <article class="zp-decision-card">
          <h3>3. Před koupí řešte i bezpečnost chůze</h3>
          <p>Volný průchod sám nestačí. Ověřte ovládání ruční i parkovací brzdy, stabilitu a skutečnou trasu. Je-li použití nejisté, vhodný typ opory nejprve posuďte s odborníkem.</p>
        </article>
      </div>
      <p><a class="zp-text-link" href="<?php echo esc_url( home_url( '/co-zmerit-pred-vyberem-choditka/#co-zmerit' ) ); ?>">Otevřít sedm měření pro chodítko a rollátor</a> · <a class="zp-text-link" href="<?php echo esc_url( home_url( '/choditko-do-bytu-pro-seniory/#poradce-choditko-byt' ) ); ?>">Prověřit jiné typy opory pro byt</a> · <a class="zp-text-link" href="#poradce-rollator">Vrátit se k poradci pro rollátor</a></p>
      <p class="zp-muted-copy">Kontrola veřejných podkladů 10. 11. 2026: <a class="zp-text-link" href="https://eshop.meyra.cz/product/choditka_-berle_-hole/ctyrkolove-choditko-ideal-rollator-/191" target="_blank" rel="noopener">MEYRA, produktový detail 3061982 (61,5 cm)</a>, <a class="zp-text-link" href="https://www.meyra.cz/upload/files/produkty/Hole-berle-choditka/navod-k-pouziti-ideal-rollator.pdf" target="_blank" rel="noopener">MEYRA, novější návod pro 3061982 (615 mm)</a> a <a class="zp-text-link" href="https://www.meyra.cz/upload/files/produkty/Hole-berle-choditka/Navod-k-pouziti-rollator-3061982.pdf" target="_blank" rel="noopener">MEYRA, starší návod 02/2018 (590 mm)</a> a <a class="zp-text-link" href="https://eshop.meyra.cz/product/choditka_-berle_-hole/ctyrkolove-choditko-rollator-2/428" target="_blank" rel="noopener">MEYRA, samostatná varianta ROLLATOR 2 3061982-R (59 cm)</a>. Bez potvrzení konkrétní dodávky neprohlašujeme individuální průchodnost ani vhodnost.</p>
    </div>
  </section>

  <section id="rollator-se-sedatkem" class="zp-section" data-zp-search-intent="rollator-seat">
    <div class="zp-wrap">
      <p class="zp-kicker">Chodítko se sedátkem · Rychlé rozhodnutí</p>
      <h2 class="zp-section-title">Rollátor se sedátkem pro seniory: kdy pomůže při odpočinku a kdy není vhodný?</h2>
      <p>Pokud hledáte <strong>čtyřkolové chodítko se sedátkem</strong>, nezačínejte cenou. Sedátko usnadňuje plánování přestávek při chůzi, ale z rollátoru nedělá přepravní vozík. Rozhodují bezpečné ruční a parkovací brzdy, konkrétní trasa a schopnost bezpečně usednout a zase vstát.</p>
      <div class="zp-decision-grid">
        <article class="zp-decision-card">
          <h3>Potřebujete si během procházky odpočinout</h3>
          <p>Sedátko může být užitečné, pokud je člověk schopný rollátor bezpečně zastavit, zajistit parkovací brzdy, usednout a znovu vstát. Před použitím zkontrolujte stabilní rovný podklad, pokyny výrobce a zda lze sed používat bez pomoci další osoby.</p>
          <p><a class="zp-text-link" href="#poradce-rollator">Prověřit bezpečné ovládání brzd</a></p>
        </article>
        <article class="zp-decision-card">
          <h3>Chcete na sedátku někoho vozit</h3>
          <p>Rollátor se sedátkem <strong>není automaticky transportní invalidní vozík</strong>. Nepoužívejte jej k převozu sedící osoby, pokud to výslovně neumožňuje návod přesného modelu. Potřebu přepravy řešte samostatně, ne výběrem většího sedátka.</p>
          <p><a class="zp-text-link" href="<?php echo esc_url( home_url( '/invalidni-vozik/#poradce-vozik' ) ); ?>">Kdy místo rollátoru řešit vozík</a></p>
        </article>
        <article class="zp-decision-card">
          <h3>Brzdy nebo vstávání nejsou jisté</h3>
          <p>Při nespolehlivém ovládání brzd, riziku pádu při usedání nebo běžné fyzické asistenci při chůzi nepovažujte sedátko za bezpečnou náhradu odpočinkového místa. Nejprve s odborníkem ověřte vhodný typ opory a bezpečný způsob přesunu.</p>
          <p><a class="zp-text-link" href="<?php echo esc_url( home_url( '/choditka-pro-seniory/#vyber-typu' ) ); ?>">Porovnat jiné typy opory</a></p>
        </article>
      </div>
      <p><strong>Než se rozhodnete:</strong> změřte nejmenší průchod, ověřte rozsah výšky madel, povolené zatížení a prostor, kde lze rollátor bezpečně zaparkovat. U ověřeného modelu MEYRA Ideal 3061982 výrobce uvádí celkovou šířku 61,5 cm, šířku sedu 42 cm a výšku sedátka 61 cm. To jsou technické rozměry, nikoli potvrzení, že člověk bezpečně dosáhne chodidly na zem, usedne a vstane.</p>
      <div class="zp-hero-actions" aria-label="Další kroky po kontrole bezpečnosti rollátoru">
        <a class="zp-btn" href="#poradce-rollator">Zjistit vhodný další krok</a>
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/co-zmerit-pred-vyberem-choditka/#co-zmerit' ) ); ?>">Sedm měření před výběrem</a>
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/pujceni-choditka/#rozpocet-pujceni-choditka' ) ); ?>">Spočítat půjčovné</a>
      </div>
      <p class="zp-disclaimer">Tento přehled je obecný; není potvrzením vhodnosti konkrétní pomůcky ani povolením použít sedátko bez posouzení rizika. Produkt a obchodní nabídka se zobrazují pouze ve stávajícím poradci po splnění jeho bezpečnostních podmínek.</p>
    </div>
  </section>

  <section class="zp-section zp-section-soft">
    <div class="zp-wrap">
      <h2 class="zp-section-title">Ověřený kandidát: MEYRA Ideal Rollator 3061982.</h2>
      <div class="zp-grid">
        <article class="zp-card"><h3>Rozměry</h3><p>Výška madel 79–97 cm, celková šířka 61,5 cm, nosnost 130 kg. Sedátko má podle výrobce šířku 42 cm a výšku 61 cm; jeho vhodnost a bezpečné používání nejsou dané samotným rozměrem.</p></article>
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
