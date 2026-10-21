<?php
/* ZP_RELEASE_0_8_142 */
/*
Template Name: Zápraží — Invalidní vozík
*/
get_header();
?>
<main id="main-content" tabindex="-1">
  <section class="zp-hero">
    <div class="zp-wrap">
      <p class="zp-kicker">Zápraží · Invalidní vozík</p>
      <h1>Invalidní vozík pro seniory: mechanický, elektrický, nebo s doprovodem?</h1>
      <p class="zp-lead">Nezačínáme diagnózou ani značkou. Nejdřív rozlišíme doprovod, samostatný ruční pohon nebo elektrický pohon. Teprve potom ověřujeme bezpečné ovládání, sed, průchody, nosnost a způsob pořízení.</p>
      <div class="zp-hero-actions">
        <a class="zp-btn" href="#poradce-vozik">Spustit poradce</a>
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/' ) ); ?>">Zpět na hlavní stránku</a>
        <a class="zp-text-link" href="#bezpecne-pouzivani-voziku">Co ověřit před výběrem</a>
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/projede-invalidni-vozik-dvermi/#mereni-pruchodu' ) ); ?>">Změřit dveře pro invalidní vozík</a>
      </div>
    </div>
  </section>

  <section id="poradce-vozik" class="zp-wrap zp-advisor-section">
    <div class="zp-panel">
      <p class="zp-kicker">Domácí poradce · Invalidní vozík</p>
      <h2>Kdo bude vozík běžně pohánět?</h2>
      <p>Ptáme se jen na praktické používání. Nepotřebujeme jméno, diagnózu ani přesnou hmotnost člověka.</p>

      <div id="zp-wheelchair-advisor" class="zp-advisor-form" role="form" aria-describedby="zp-wheelchair-privacy">
        <fieldset class="zp-fieldset" data-zp-wheelchair-required="propulsion">
          <legend>Kdo bude vozík běžně pohánět?</legend>
          <label class="zp-choice"><input type="radio" name="propulsion" value="companion" required><span><strong>Hlavně doprovodná osoba</strong><small>Uživatel bude většinou převážen.</small></span></label>
          <label class="zp-choice"><input type="radio" name="propulsion" value="self_manual"><span><strong>Hlavně uživatel rukama</strong><small>Potřebuje mechanický vozík s hnacími obručemi.</small></span></label>
          <label class="zp-choice"><input type="radio" name="propulsion" value="mixed_manual"><span><strong>Střídavě uživatel i doprovod</strong></span></label>
          <label class="zp-choice"><input type="radio" name="propulsion" value="powered"><span><strong>Elektrický pohon</strong><small>Ovládání joystickem.</small></span></label>
          <label class="zp-choice"><input type="radio" name="propulsion" value="unknown"><span><strong>Nevím</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-wheelchair-required="transferAbility">
          <legend>Jak probíhá přesun na vozík a z vozíku?</legend>
          <label class="zp-choice"><input type="radio" name="transferAbility" value="independent" required><span><strong>Samostatně</strong></span></label>
          <label class="zp-choice"><input type="radio" name="transferAbility" value="steadying"><span><strong>S oporou nebo dohledem, bez fyzického zvedání</strong></span></label>
          <label class="zp-choice"><input type="radio" name="transferAbility" value="person_assist"><span><strong>Běžně fyzicky pomáhá druhá osoba</strong></span></label>
          <label class="zp-choice"><input type="radio" name="transferAbility" value="unknown"><span><strong>Nevím</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-wheelchair-conditional="manual" data-zp-wheelchair-required="manualControlSafe" hidden>
          <legend>Pokud má člověk vozík pohánět rukama: zvládne ho na běžné trase spolehlivě rozjet, řídit, zpomalit a zastavit a použít parkovací brzdu?</legend>
          <label class="zp-choice"><input type="radio" name="manualControlSafe" value="yes"><span><strong>Ano</strong><small>Prakticky vyzkoušeno nebo spolehlivě zvládá.</small></span></label>
          <label class="zp-choice"><input type="radio" name="manualControlSafe" value="no"><span><strong>Ne</strong></span></label>
          <label class="zp-choice"><input type="radio" name="manualControlSafe" value="unknown"><span><strong>Nevím</strong><small>Nejdřív ověřte na bezpečné trase.</small></span></label>
        </fieldset>

        <div id="zp-wheelchair-candidate-note" class="zp-resource-callout" aria-live="polite">
          <strong>Po výběru způsobu pohonu ukážeme rozměry kandidáta, které je potřeba ověřit.</strong>
        </div>


        <fieldset class="zp-fieldset" data-zp-product-fit="1" data-zp-wheelchair-required="seatWidthVariant" hidden>
          <legend>Jakou přesnou šířku sedu má nabízené provedení vozíku UNIZDRAV P3641?</legend>
          <p>Každá šířka sedu má jiný celkový rozměr vozíku. Pokud přepnete variantu, ověříte sed i průchody znovu. Rozměry podle výrobce.</p>
          <label class="zp-choice"><input type="radio" name="seatWidthVariant" value="48"><span><strong>Sed 48 cm</strong><small>Celková šířka vozíku 68 cm, hmotnost 17 kg.</small></span></label>
          <label class="zp-choice"><input type="radio" name="seatWidthVariant" value="51"><span><strong>Sed 51 cm</strong><small>Celková šířka vozíku 70 cm, hmotnost 17,5 kg.</small></span></label>
          <label class="zp-choice"><input type="radio" name="seatWidthVariant" value="unknown"><span><strong>Nevím, kterou šířku nabízí obchodník</strong><small>Bez potvrzení varianty nezobrazíme nákupní nabídku.</small></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-product-fit="1" data-zp-wheelchair-required="seatFit">
          <legend>Ověřili jste šířku sedu přesné nabízené varianty vozíku? U odlehčeného modelu existují různé šířky.</legend>
          <label class="zp-choice"><input type="radio" name="seatFit" value="yes" required><span><strong>Ano</strong></span></label>
          <label class="zp-choice"><input type="radio" name="seatFit" value="no"><span><strong>Ne</strong></span></label>
          <label class="zp-choice"><input type="radio" name="seatFit" value="unknown"><span><strong>Nevím</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-product-fit="1" data-zp-wheelchair-required="widthFit">
          <legend>Projde právě zvolená rozměrová varianta vozíku nejužšími dveřmi a je pro ni prostor k otáčení?</legend>
          <label class="zp-choice"><input type="radio" name="widthFit" value="yes" required><span><strong>Ano, změřeno</strong></span></label>
          <label class="zp-choice"><input type="radio" name="widthFit" value="no"><span><strong>Ne</strong></span></label>
          <label class="zp-choice"><input type="radio" name="widthFit" value="unknown"><span><strong>Nevím</strong><small>Nejdřív změřte nejužší průchod a místo pro manévrování.</small></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-product-fit="1" data-zp-wheelchair-required="wheelType" hidden>
          <legend>Jaká zadní kola má přesná nabízená varianta vozíku UNIZDRAV P3641?</legend>
          <p>Pro tento odlehčený model uvádí výrobce dva různé limity. Ověřte u obchodníka nebo v dokumentaci provedení konkrétního kusu. Při změně varianty potvrdíte nosnost znovu.</p>
          <label class="zp-choice"><input type="radio" name="wheelType" value="pneumatic"><span><strong>Pneumatická (nafukovací) kola</strong><small>Výrobce uvádí nosnost 125 kg.</small></span></label>
          <label class="zp-choice"><input type="radio" name="wheelType" value="tubeless"><span><strong>Bezdušová kola</strong><small>Výrobce uvádí nosnost 136 kg.</small></span></label>
          <label class="zp-choice"><input type="radio" name="wheelType" value="unknown"><span><strong>Nevím, jaká kola má vybraná varianta</strong><small>Bez tohoto ověření nelze nabídku odemknout.</small></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-product-fit="1" data-zp-wheelchair-required="loadFit">
          <legend>Ověřili jste nosnost přesné varianty? U některých vozíků se limit liší podle provedení kol.</legend>
          <label class="zp-choice"><input type="radio" name="loadFit" value="yes" required><span><strong>Ano</strong><small>Přesnou hmotnost člověka do poradce nezadávejte.</small></span></label>
          <label class="zp-choice"><input type="radio" name="loadFit" value="no"><span><strong>Ne</strong></span></label>
          <label class="zp-choice"><input type="radio" name="loadFit" value="unknown"><span><strong>Nevím</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-product-fit="1" data-zp-wheelchair-required="brakeFit" hidden>
          <legend>Mají parkovací brzdy právě zvoleného mechanického vozíku ověřenou funkčnost a lze je bezpečně zajistit před přesedáním?</legend>
          <p>Ověřte brzdy konkrétního kusu, nikoli jen údaj v popisu podobného modelu. Při změně rozměrové varianty nebo kol je nutné kontrolu zopakovat.</p>
          <label class="zp-choice"><input type="radio" name="brakeFit" value="yes"><span><strong>Ano, ověřeno na tomto modelu</strong><small>Brzdy fungují a lze je zajistit před usednutím i při vstávání.</small></span></label>
          <label class="zp-choice"><input type="radio" name="brakeFit" value="no"><span><strong>Ne</strong><small>Tento vozík zatím nevybírejte.</small></span></label>
          <label class="zp-choice"><input type="radio" name="brakeFit" value="unknown"><span><strong>Nevím</strong><small>Nejdřív ověřte funkčnost a zajištění brzd.</small></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-product-fit="1" data-zp-wheelchair-required="routeFit" hidden>
          <legend>Ověřili jste sklony, prahy a povrch skutečné trasy podle parametrů elektrického vozíku P2961?</legend>
          <p>Výrobce uvádí bezpečný sklon 6° a překážku do 5 cm. Tyto hodnoty nejsou příslibem bezpečného průjezdu v každé situaci. Pokud si nejste jistí, nabídku zatím neotvírejte.</p>
          <label class="zp-choice"><input type="radio" name="routeFit" value="yes"><span><strong>Ano, ověřeno pro P2961</strong><small>Trasa byla porovnána s návodem konkrétního výrobku.</small></span></label>
          <label class="zp-choice"><input type="radio" name="routeFit" value="no"><span><strong>Ne, trasa nevyhovuje</strong><small>Nejdřív vyřešte trasu nebo zvažte jiný model.</small></span></label>
          <label class="zp-choice"><input type="radio" name="routeFit" value="unknown"><span><strong>Nevím</strong><small>Prohlédněte prahy, sklony a povrch; nákupní nabídka zůstane uzamčena.</small></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-wheelchair-conditional="powered" data-zp-wheelchair-required="joystickSafe" hidden>
          <legend>Zvládne člověk joystickem spolehlivě rozjet, zatočit, zpomalit a zastavit?</legend>
          <label class="zp-choice"><input type="radio" name="joystickSafe" value="yes"><span><strong>Ano</strong></span></label>
          <label class="zp-choice"><input type="radio" name="joystickSafe" value="no"><span><strong>Ne</strong></span></label>
          <label class="zp-choice"><input type="radio" name="joystickSafe" value="unknown"><span><strong>Nevím</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-wheelchair-conditional="powered" data-zp-wheelchair-required="chargingReady" hidden>
          <legend>Máte bezpečné místo pro parkování a pravidelné nabíjení elektrického vozíku?</legend>
          <label class="zp-choice"><input type="radio" name="chargingReady" value="yes"><span><strong>Ano</strong></span></label>
          <label class="zp-choice"><input type="radio" name="chargingReady" value="no"><span><strong>Ne</strong></span></label>
          <label class="zp-choice"><input type="radio" name="chargingReady" value="unknown"><span><strong>Nevím</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset">
          <legend>Jak dlouho bude vozík pravděpodobně potřeba?</legend>
          <label class="zp-choice"><input type="radio" name="duration" value="short_term"><span><strong>Spíš dočasně</strong></span></label>
          <label class="zp-choice"><input type="radio" name="duration" value="long_term"><span><strong>Spíš dlouhodobě</strong></span></label>
          <label class="zp-choice"><input type="radio" name="duration" value="unknown" checked><span><strong>Nevím</strong></span></label>
        </fieldset>

        <section id="zp-wheelchair-preview" class="zp-result" tabindex="-1" aria-live="polite" hidden></section>
        <section id="zp-wheelchair-fit-stage" class="zp-bathroom-fit-stage" aria-labelledby="zp-wheelchair-fit-title" hidden>
          <h3 id="zp-wheelchair-fit-title">2. Ověřte parametry konkrétního výrobku</h3>
          <p>Teď už znáte přesný model a jeho technické údaje. Porovnejte je s potřebami člověka a podmínkami doma. Pokud si nejste jistí, odpovězte <strong>Nevím</strong> – nákupní doporučení se nezobrazí.</p>
        </section>
        <div id="zp-wheelchair-errors" class="zp-advisor-errors" role="alert" aria-live="assertive" hidden></div>
        <button class="zp-btn zp-submit" type="button" id="zp-wheelchair-submit">1. Ukázat možný výrobek</button>
        <p id="zp-wheelchair-privacy" class="zp-privacy-note">Odpovědi se neodesílají na server, neukládají se do URL a affiliate systém nedostává kombinaci odpovědí.</p>
      </div>

      <noscript><p class="zp-disclaimer">Pro spuštění poradce je potřeba JavaScript. Bez něj se žádné odpovědi neodesílají.</p></noscript>
      <section id="zp-wheelchair-result" class="zp-result" aria-live="polite" tabindex="-1" hidden></section>
    </div>
  </section>

  <section class="zp-section zp-section-soft">
    <div class="zp-wrap">
      <p class="zp-kicker">Jak rozhodujeme</p>
      <h2 class="zp-section-title">Jak vybrat invalidní vozík pro seniora: nejdřív pohon a prostor.</h2>
      <div class="zp-decision-grid">
        <article class="zp-decision-card"><h3>Doprovod</h3><p>Jednoduchý skládací mechanický vozík může stačit pro krátké přesuny, pokud sedí šířka, nosnost a průchody.</p></article>
        <article class="zp-decision-card"><h3>Samostatný ruční pohon</h3><p>Hnací obruče, správná šířka sedu a nastavení jsou zásadní pro dlouhodobé používání.</p></article>
        <article class="zp-decision-card"><h3>Elektrický vozík</h3><p>Kromě rozměrů řešíme joystick, poloměr otáčení, nabíjení, hmotnost vozíku a reálnou trasu.</p></article>
      </div>
    </div>
  </section>

  <section class="zp-section zp-section-dark">
    <div class="zp-wrap">
      <p class="zp-kicker zp-kicker-light">Jak ho získat</p>
      <h2 class="zp-section-title">U vozíku nezačínejte automaticky nákupem.</h2>
      <div class="zp-hero-actions">
        <a class="zp-text-link zp-text-link-light" href="<?php echo esc_url( home_url( '/invalidni-vozik-na-pojistovnu/' ) ); ?>">Podrobně: pojišťovna, půjčení a kdy koupit</a>
      </div>
      <div class="zp-acquire-grid">
        <article><h3>Půjčit</h3><p>U krátkodobé potřeby má smysl nejdřív porovnat místní půjčovny a ověřit přesný rozměr dostupného vozíku.</p></article>
        <article><h3>Prověřit pojišťovnu</h3><p>VZP popisuje mechanické vozíky jako hrazenou kategorii při splnění podmínek a uvádí, že většina vozíků zůstává majetkem pojišťovny a pacientovi se půjčuje.</p></article>
        <article><h3>Koupit</h3><p>Přímý nákup dává smysl až po potvrzení sedu, průchodů, nosnosti a způsobu používání.</p></article>
      </div>
    </div>
  </section>

  <section id="bezpecne-pouzivani-voziku" class="zp-section" data-zp-editorial-guide="wheelchair">
    <div class="zp-wrap">
      <p class="zp-kicker">Praktická kontrola před výběrem</p>
      <h2 class="zp-section-title">Pět kontrol invalidního vozíku: šířka, přesun, brzdy a konkrétní varianta.</h2>
      <p>Rozměr sedadla není rozměr celého vozíku a parkovací brzda není provozní brzda pro zpomalování jízdy. Než porovnáte cenu, ověřte způsob pohonu, skutečné průchody doma a bezpečný přesun. Pokud člověk potřebuje fyzické zvedání druhou osobou, výběr konkrétního vozíku nesmí nahrazovat odborné posouzení.</p>
      <div class="zp-decision-grid">
        <article class="zp-decision-card">
          <h3>1. Kdo bude vozík skutečně pohánět?</h3>
          <p>Jinou konstrukci potřebuje člověk s doprovodem, jinou ten, kdo vozík sám pohání hnacími obručemi, a jinou uživatel elektrického joysticku. UNIZDRAV P3641 má obruče pro samostatný pohon i brzdy pro doprovod. Tato výbava neprokazuje individuální schopnost samostatně bezpečně řídit a zastavit.</p>
        </article>
        <article class="zp-decision-card">
          <h3>2. Sedadlo a celková šířka nejsou totéž</h3>
          <p>U P3641 lze podle výrobce vybrat sed 48 nebo 51 cm; tomu odpovídá celková šířka 68 nebo 70 cm. Je třeba samostatně ověřit vhodnost sedu pro člověka a průchod skutečnými dveřmi, včetně zatáčení a místa pro přesun. Neměřte jen nejširší část dveří; prakticky rozhoduje nejužší průjezd.</p>
        </article>
        <article class="zp-decision-card">
          <h3>3. Při přesunu nejdřív zablokovat pohyb vozíku</h3>
          <p>NHS doporučuje před usednutím a vstáváním aktivovat parkovací brzdy a odsunout stupačky z cesty; na stupačky se při vstávání nestoupá, protože se vozík může překlopit. Parkovací zámky neslouží k brzdění za jízdy. Pokud se člověk nepřesune bezpečně bez fyzického zvedání druhou osobou, postup musí určit odborník.</p>
        </article>
        <article class="zp-decision-card">
          <h3>4. Nosnost vždy podle konkrétních kol a varianty</h3>
          <p>UNIZDRAV uvádí u P3641 nosnost 125 kg s pneumatickými koly, ale 136 kg s bezdušovými. Tyto hodnoty není správné zaměňovat; platí jen pro odpovídající konfiguraci. Stejně ověřte správné nastavení stupaček, zajištění opěrek a stav brzd a pneumatik podle návodu dodaného vozíku.</p>
        </article>
        <article class="zp-decision-card">
          <h3>5. Ověřit reálnou trasu a způsob pořízení</h3>
          <p>Zvažte prahy, sklon chodníku, bezpečné otáčení a možnost složení pro převoz. U elektrického vozíku se navíc musí ověřit bezpečné ovládání, dostatečný manévrovací prostor a nabíjení. U dočasné potřeby stojí za zvážení půjčení; před dlouhodobým nákupem také cesta přes zdravotní pojišťovnu. Žádný rozměr ani údaj výrobce sám o sobě nepotvrzuje bezpečné použití.</p>
        </article>
      </div>
      <p><a class="zp-text-link" href="<?php echo esc_url( home_url( '/invalidni-vozik/#poradce-vozik' ) ); ?>">Vybrat vhodný typ v poradci</a> · <a class="zp-text-link" href="<?php echo esc_url( home_url( '/projede-invalidni-vozik-dvermi/#mereni-pruchodu' ) ); ?>">Změřit dveře a prostor pro otočení</a> · <a class="zp-text-link" href="<?php echo esc_url( home_url( '/invalidni-vozik-na-pojistovnu/' ) ); ?>">Jak ověřit půjčení a úhradu</a></p>
      <p class="zp-disclaimer">Vozík je nutné posoudit jako celek včetně přesunu, nastavení sedu, pohonu, brzd a konkrétní nosnosti. Při nejistotě nebo fyzicky asistovaném přesunu online poradce nezaručuje individuální vhodnost a nesmí odemknout nákup bez potřebných kontrol.</p>
      <p class="zp-muted-copy">Podklady ověřeny 12. 10. 2026: <a href="https://unizdrav.cz/zbozi/3641/invalidni-vozik-odlehceny-s-brzdami-pro-doprovod" target="_blank" rel="noopener">UNIZDRAV — varianty P3641 a jejich skutečné rozměry a nosnost</a>; <a href="https://www.fhft.nhs.uk/patients-and-visitors/patient-information-library/wheelchair-safety-information-standard-wheelchairs" target="_blank" rel="noopener">Frimley Health NHS — bezpečný přesun a stupačky</a>; <a href="https://www.merseycare.nhs.uk/our-services/knowsley/wheelchair-service" target="_blank" rel="noopener">Mersey Care NHS — parkovací brzdy a bezpečnostní hranice</a>; <a href="https://www.merseycare.nhs.uk/wheelchair-measurement-guide" target="_blank" rel="noopener">Mersey Care NHS — měření a nastavení sedu</a>. Návody mají obecný charakter a nejsou českým úhradovým předpisem; individuální odborná revize Zápraží není doložena.</p>
    </div>
  </section>

  <section class="zp-section">
    <div class="zp-wrap zp-faq">
      <p class="zp-kicker">Časté otázky</p>
      <h2 class="zp-section-title">Co ověřit před výběrem invalidního vozíku.</h2>

      <details>
        <summary>Jak vybrat invalidní vozík pro seniora?</summary>
        <p>Začněte tím, kdo bude vozík běžně pohánět. Potom ověřte šířku sedu, celkovou šířku v nejužších průchodech a technickou nosnost; u elektrického vozíku navíc bezpečné ovládání joysticku a místo pro nabíjení.</p>
      </details>
      <details>
        <summary>Je lepší mechanický, nebo elektrický invalidní vozík?</summary>
        <p>Mechanický vozík dává smysl, když ho uživatel rukama dokáže bezpečně rozjet, řídit a zastavit, nebo když ho bezpečně obsluhuje doprovod. Elektrický vozík je kandidát až po potvrzení bezpečného ovládání joysticku, prostoru pro manévrování a pravidelného nabíjení.</p>
      </details>
      <details>
        <summary>Jak poznat správnou šířku sedu a vozíku?</summary>
        <p>Šířka sedu musí vyhovovat konkrétnímu člověku a celková šířka vozíku musí projít nejužšími dveřmi a umožnit otočení v běžné trase doma. Rozměry proto změřte před objednávkou.</p>
      </details>
      <details>
        <summary>Je lepší invalidní vozík půjčit, koupit, nebo řešit přes pojišťovnu?</summary>
        <p>U krátkodobé potřeby často dává smysl nejdřív půjčovna. U dlouhodobé potřeby je vhodné prověřit pojišťovnu před přímým nákupem. Retail nákup a hrazená cesta jsou oddělené procesy.</p>
      </details>
      <details>
        <summary>Kdy Zápraží nedoporučí konkrétní vozík?</summary>
        <p>Konkrétní produkt neukazujeme, pokud není potvrzená šířka sedu, průchod nebo nosnost, při běžně fyzicky asistovaném přesunu, u ručního pohonu bez potvrzeného bezpečného řízení a zastavení a u elektrického vozíku bez bezpečného ovládání nebo nabíjení.</p>
      </details>

      <div class="zp-hero-actions">
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/invalidni-vozik-na-pojistovnu/' ) ); ?>">Pojišťovna, půjčení a nákup</a>
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/bezpecny-byt-pro-seniora/' ) ); ?>">Zkontrolovat průchody a bezpečný byt</a>
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/kompenzacni-pomucky-pro-seniory/' ) ); ?>">Přehled kompenzačních pomůcek</a>
      </div>
    </div>
  </section>
</main>
<?php get_footer(); ?>
