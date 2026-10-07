<?php
/* ZP_RELEASE_0_8_31 */
get_header();
?>
<main id="main-content" tabindex="-1">
  <section class="zp-hero">
    <div class="zp-wrap">
      <p class="zp-kicker">Zápraží · Koupelna a WC</p>
      <h1>Bezpečnější koupelna a WC podle skutečné situace.</h1>
      <p class="zp-lead">Poradce pomůže rozlišit, zda dává smysl zvýšit WC, přidat oporu, použít toaletní židli nebo sedět při sprchování. Neptá se na diagnózu a při nejasném přesunu raději konkrétní výrobek nevybere.</p>
      <div class="zp-hero-actions">
        <a class="zp-btn" href="#poradce-koupelna">Spustit poradce</a>
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/' ) ); ?>">Zpět na hlavní poradce</a>
      </div>
    </div>
  </section>

  <section id="poradce-koupelna" class="zp-wrap zp-advisor-section">
    <div class="zp-panel">
      <p class="zp-kicker">Domácí poradce · Koupelna a WC</p>
      <h2>Co je teď hlavní problém?</h2>
      <p>Odpovědi zůstávají pouze v prohlížeči. Nepotřebujeme jméno, diagnózu ani přesnou hmotnost člověka.</p>

      <div id="zp-bathroom-advisor" class="zp-advisor-form" role="form" aria-describedby="zp-bathroom-privacy">
        <fieldset class="zp-fieldset" data-zp-bath-required="primaryNeed">
          <legend>Co potřebujete hlavně vyřešit?</legend>
          <label class="zp-choice"><input type="radio" name="primaryNeed" value="raise_toilet" required><span><strong>WC je příliš nízké</strong><small>Člověk se na běžné WC dostane, ale nízký sed ztěžuje sedání nebo vstávání.</small></span></label>
          <label class="zp-choice"><input type="radio" name="primaryNeed" value="toilet_support"><span><strong>Chybí opora u WC</strong><small>Při sedání nebo vstávání pomáhá stabilní úchop.</small></span></label>
          <label class="zp-choice"><input type="radio" name="primaryNeed" value="toilet_nearby"><span><strong>Je těžké dojít až na WC</strong><small>Dává smysl prověřit samostatnou toaletní židli blíž místu pobytu.</small></span></label>
          <label class="zp-choice"><input type="radio" name="primaryNeed" value="shower_seated"><span><strong>Je těžké stát při sprchování</strong><small>Člověk se do sprchy dostane, ale potřebuje při hygieně sedět.</small></span></label>
          <label class="zp-choice"><input type="radio" name="primaryNeed" value="bath_transfer"><span><strong>Je problém dostat se přes okraj vany</strong><small>Tato větev vyžaduje opatrnější posouzení přesunu.</small></span></label>
          <label class="zp-choice"><input type="radio" name="primaryNeed" value="multifunction_toilet_shower"><span><strong>Jedna stabilní židle pro WC i sprchu</strong><small>Jedna pomůcka má sloužit jako toaletní židle, sprchovací sedačka nebo nástavec nad WC.</small></span></label>
          <label class="zp-choice"><input type="radio" name="primaryNeed" value="combined_shower_toilet"><span><strong>Je potřeba sprchovací/toaletní vozík</strong><small>Vyšší míra podpory a složitější přesun.</small></span></label>
          <label class="zp-choice"><input type="radio" name="primaryNeed" value="unknown"><span><strong>Nevím</strong><small>Nejdřív se potřebuji zorientovat.</small></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-bath-required="transferAbility">
          <legend>Jak probíhá přesednutí na WC nebo sedadlo?</legend>
          <label class="zp-choice"><input type="radio" name="transferAbility" value="independent" required><span><strong>Samostatně</strong><small>Člověk si přesedne bez fyzické pomoci další osoby.</small></span></label>
          <label class="zp-choice"><input type="radio" name="transferAbility" value="steadying"><span><strong>S oporou, ale bez zvedání druhou osobou</strong><small>Pomůže pevná opora nebo madlo.</small></span></label>
          <label class="zp-choice"><input type="radio" name="transferAbility" value="person_assist"><span><strong>Běžně pomáhá druhá osoba</strong><small>Při přesunu je potřeba fyzická pomoc.</small></span></label>
          <label class="zp-choice"><input type="radio" name="transferAbility" value="unknown"><span><strong>Nevím</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-bath-conditional="simple" data-zp-bath-required="loadFit" hidden>
          <legend>Ověřili jste, že nosnost vybraného typu pomůcky bezpečně pokrývá člověka?</legend>
          <label class="zp-choice"><input type="radio" name="loadFit" value="yes"><span><strong>Ano</strong></span></label>
          <label class="zp-choice"><input type="radio" name="loadFit" value="no"><span><strong>Ne</strong></span></label>
          <label class="zp-choice"><input type="radio" name="loadFit" value="unknown"><span><strong>Nevím</strong><small>Poradce nebude chtít přesnou hmotnost ukládat.</small></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-bath-conditional="raise_toilet" data-zp-bath-required="toiletFit" hidden>
          <legend>Pasuje zvolený nástavec rozměry a upevněním na konkrétní WC?</legend>
          <label class="zp-choice"><input type="radio" name="toiletFit" value="yes"><span><strong>Ano, ověřeno</strong></span></label>
          <label class="zp-choice"><input type="radio" name="toiletFit" value="no"><span><strong>Ne</strong></span></label>
          <label class="zp-choice"><input type="radio" name="toiletFit" value="unknown"><span><strong>Nevím</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-bath-conditional="raise_toilet" data-zp-bath-required="feetFlatAtRaisedHeight" hidden>
          <legend>Po zvýšení sedu dosáhne člověk chodidly bezpečně na podlahu?</legend>
          <label class="zp-choice"><input type="radio" name="feetFlatAtRaisedHeight" value="yes"><span><strong>Ano</strong></span></label>
          <label class="zp-choice"><input type="radio" name="feetFlatAtRaisedHeight" value="no"><span><strong>Ne</strong></span></label>
          <label class="zp-choice"><input type="radio" name="feetFlatAtRaisedHeight" value="unknown"><span><strong>Nevím</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-bath-conditional="toilet_support" hidden>
          <legend>Je uvažované nástěnné madlo možné bezpečně ukotvit do vhodného podkladu?</legend>
          <label class="zp-choice"><input type="radio" name="wallFixing" value="verified"><span><strong>Ano, bezpečné kotvení je ověřené</strong></span></label>
          <label class="zp-choice"><input type="radio" name="wallFixing" value="unverified"><span><strong>Zatím neověřeno</strong></span></label>
          <label class="zp-choice"><input type="radio" name="wallFixing" value="not_possible"><span><strong>Není možné</strong></span></label>
          <label class="zp-choice"><input type="radio" name="wallFixing" value="unknown"><span><strong>Nevím</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-bath-conditional="floor_space" data-zp-bath-required="floorStable" hidden>
          <legend>Bude pomůcka stát na rovném a stabilním podkladu?</legend>
          <label class="zp-choice"><input type="radio" name="floorStable" value="yes"><span><strong>Ano</strong></span></label>
          <label class="zp-choice"><input type="radio" name="floorStable" value="no"><span><strong>Ne</strong></span></label>
          <label class="zp-choice"><input type="radio" name="floorStable" value="unknown"><span><strong>Nevím</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-bath-conditional="floor_space" data-zp-bath-required="spaceFit" hidden>
          <legend>Ověřili jste, že se kandidátní pomůcka bezpečně vejde do prostoru i pro přesednutí?</legend>
          <label class="zp-choice"><input type="radio" name="spaceFit" value="yes"><span><strong>Ano</strong></span></label>
          <label class="zp-choice"><input type="radio" name="spaceFit" value="no"><span><strong>Ne</strong></span></label>
          <label class="zp-choice"><input type="radio" name="spaceFit" value="unknown"><span><strong>Nevím</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-bath-conditional="bath_transfer" data-zp-bath-required="bathTransferIndependent" hidden>
          <legend>Zvládne člověk bezpečně usednout na stabilní sedačku přes vanu a přenést obě nohy přes okraj bez fyzické pomoci druhé osoby?</legend>
          <label class="zp-choice"><input type="radio" name="bathTransferIndependent" value="yes"><span><strong>Ano</strong><small>Přesun zvládne samostatně, bez zvedání nebo fyzického jištění druhou osobou.</small></span></label>
          <label class="zp-choice"><input type="radio" name="bathTransferIndependent" value="no"><span><strong>Ne</strong><small>Je potřeba fyzická pomoc, zvedání nebo je přesun nejistý.</small></span></label>
          <label class="zp-choice"><input type="radio" name="bathTransferIndependent" value="unknown"><span><strong>Nevím</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-bath-conditional="bath_transfer" data-zp-bath-required="bathFit" hidden>
          <legend>Má vana vnitřní šířku okrajů 41–65 cm a lze na ní sedačku pevně zajistit bez posunu?</legend>
          <label class="zp-choice"><input type="radio" name="bathFit" value="yes"><span><strong>Ano, změřeno a ověřeno</strong></span></label>
          <label class="zp-choice"><input type="radio" name="bathFit" value="no"><span><strong>Ne</strong></span></label>
          <label class="zp-choice"><input type="radio" name="bathFit" value="unknown"><span><strong>Nevím</strong><small>Nejdřív změřte vnitřní šířku okrajů vany.</small></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-bath-conditional="bath_bench" data-zp-bath-required="bathBenchFit" hidden>
          <legend>Když sedačka na okraj vany nepasuje: vejde se bezpečně transferová židle 81 × 61 cm tak, aby jedna část stála ve vaně a druhá na rovné stabilní podlaze mimo vanu?</legend>
          <label class="zp-choice"><input type="radio" name="bathBenchFit" value="yes"><span><strong>Ano, prostor a stabilní opření jsou ověřené</strong></span></label>
          <label class="zp-choice"><input type="radio" name="bathBenchFit" value="no"><span><strong>Ne</strong><small>Prostor nebo stabilní umístění nevychází.</small></span></label>
          <label class="zp-choice"><input type="radio" name="bathBenchFit" value="unknown"><span><strong>Nevím</strong><small>Nejdřív změřte prostor a zkontrolujte rovný stabilní podklad mimo vanu.</small></span></label>
        </fieldset>

        <fieldset class="zp-fieldset">
          <legend>Jak dlouho bude řešení pravděpodobně potřeba?</legend>
          <label class="zp-choice"><input type="radio" name="duration" value="short_term"><span><strong>Spíš dočasně</strong></span></label>
          <label class="zp-choice"><input type="radio" name="duration" value="long_term"><span><strong>Spíš dlouhodobě</strong></span></label>
          <label class="zp-choice"><input type="radio" name="duration" value="unknown" checked><span><strong>Nevím</strong></span></label>
        </fieldset>

        <div id="zp-bathroom-errors" class="zp-advisor-errors" role="alert" aria-live="assertive" hidden></div>
        <button class="zp-btn zp-submit" type="button" id="zp-bathroom-submit">Zjistit vhodný další krok</button>
        <p id="zp-bathroom-privacy" class="zp-privacy-note">Odpovědi se neodesílají na server, neukládají se do adresy stránky a affiliate systém nedostává kombinaci odpovědí.</p>
      </div>

      <noscript><p class="zp-disclaimer">Pro spuštění poradce je potřeba JavaScript. Bez něj se žádné odpovědi neodesílají.</p></noscript>
      <section id="zp-bathroom-result" class="zp-result" aria-live="polite" tabindex="-1" hidden></section>
    </div>
  </section>

  <section class="zp-section zp-section-soft">
    <div class="zp-wrap">
      <p class="zp-kicker">Jak rozhodujeme</p>
      <h2 class="zp-section-title">Nejdřív bezpečnost a rozměry, až potom produkt.</h2>
      <div class="zp-decision-grid">
        <article class="zp-decision-card"><h3>Bezpečný přesun</h3><p>Pokud je běžně potřeba fyzická pomoc druhé osoby, poradce nepředstírá jistotu a nepřeskočí rovnou k produktu.</p></article>
        <article class="zp-decision-card"><h3>Fit a montáž</h3><p>U nástavce řešíme kompatibilitu s WC a oporu chodidel. U madla zase bezpečné kotvení do skutečné konstrukce stěny.</p><a class="zp-text-link" href="<?php echo esc_url( home_url( '/nastavec-na-wc-pro-seniory/' ) ); ?>">Samostatný poradce pro nástavec na WC</a></article>
        <article class="zp-decision-card"><h3>Způsob pořízení</h3><p>Koupě, místní půjčovna a hrazená alternativa jsou tři různé cesty. Konkrétní maloobchodní produkt automaticky neoznačujeme za hrazený.</p><a class="zp-text-link" href="<?php echo esc_url( home_url( '/pomucky-do-koupelny-na-pojistovnu/' ) ); ?>">Jak funguje úhrada pomůcek do koupelny</a></article>
      </div>
    </div>
  </section>

  <section class="zp-section">
    <div class="zp-wrap">
      <p class="zp-kicker">Důležitá hranice</p>
      <h2 class="zp-section-title">Jednoduchý samostatný přesun přes vanu už umíme odlišit od složitější situace.</h2>
      <p>Pokud člověk zvládne přesun bez fyzické pomoci a vana přesně odpovídá rozměrům bezpečně upevnitelné sedačky, poradce může ukázat kandidátní řešení. Jakmile je potřeba zvedání, jištění druhou osobou nebo je fit vany nejasný, Zápraží zůstane u odborného ověření. Kombinované sprchovací/toaletní vozíky zůstávají mimo automatický produktový výběr.</p>
    </div>
  </section>
</main>
<?php get_footer(); ?>
