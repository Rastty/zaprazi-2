<?php
/* ZP_RELEASE_0_8_256 */
/*
Template Name: Zápraží — Sedátko do vany pro seniory
*/
$zp_bath_seat_price_date = current_time( 'Y-m-d' );
$zp_bath_seat_prices_fresh = $zp_bath_seat_price_date >= '2026-11-28' && $zp_bath_seat_price_date <= '2026-12-28';
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
        <a class="zp-text-link" href="#kontrola-presunu-do-vany">Co ověřit před výběrem</a>
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/co-zmerit-v-koupelne-pred-vyberem-pomucky/#mereni-vana' ) ); ?>">Změřit vanu a okolí</a>
        <a class="zp-text-link" href="#srovnani-sedatek-do-vany">Srovnat 2 konstrukce a rozměry</a>
      </div>
    </div>
  </section>

  <section id="poradce-sedatko-vana" class="zp-wrap zp-advisor-section">
    <div class="zp-panel">
      <p class="zp-kicker">Domácí poradce · Vana</p>
      <h2>Zvládne člověk bezpečný přesun přes okraj vany bez fyzického zvedání?</h2>
      <p>Neptáme se na diagnózu. Rozhodujeme podle samostatnosti přesunu, nosnosti a přesných rozměrů vany a prostoru kolem ní.</p>

      <div id="zp-bath-transfer-advisor" class="zp-advisor-form" role="form">
        <details id="zp-bath-transfer-needs-stage" class="zp-bath-needs-stage" open>
          <summary>1. Vaše potřeby a způsob přesunu</summary>
          <div class="zp-bath-needs-fields">
            <p class="zp-advisor-stage-intro">Vyberte skutečnou situaci. Pokud si nejste jistí, odpovězte „Nevím“.</p>
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
          <legend>Jen pokud sedačka přes okraj nepasuje: vejde se transferová konstrukce 81 × 61 cm?</legend>
          <label class="zp-choice"><input type="radio" name="bathBenchFit" value="yes"><span><strong>Ano</strong><small>Jedna strana může stát ve vaně a druhá na stabilní podlaze mimo vanu.</small></span></label>
          <label class="zp-choice"><input type="radio" name="bathBenchFit" value="no"><span><strong>Ne</strong></span></label>
          <label class="zp-choice"><input type="radio" name="bathBenchFit" value="unknown" checked><span><strong>Nevím</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-bath-required="loadFit">
          <legend>Ověřili jste nosnost právě vybrané varianty? Sedačka na okraj BESCO BS008 má limit 100 kg, transferová židle UNIZDRAV P2203 110 kg. Při změně varianty potvrďte nosnost znovu.</legend>
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

          </div>
        </details>
        <section id="zp-bath-transfer-preview" class="zp-result" tabindex="-1" aria-live="polite" hidden></section>
        <section id="zp-bath-transfer-fit-stage" class="zp-bathroom-fit-stage" aria-labelledby="zp-bath-transfer-fit-title" hidden>
          <h3 id="zp-bath-transfer-fit-title">2. Ověřte nosnost a rozměry konkrétní pomůcky</h3>
          <p class="zp-muted-copy zp-fit-measurement-help">Nevíte, jak změřit vanu, její okraj a prostor vedle ní? <a class="zp-text-link" href="<?php echo esc_url( home_url( '/co-zmerit-v-koupelne-pred-vyberem-pomucky/#mereni-vana' ) ); ?>" target="_blank" rel="noopener noreferrer">Praktický kontrolní návod (nová karta)</a>. Rozměry samy o sobě nezaručují bezpečný přesun.</p>
          <p>V předchozím kroku jste viděli model i technické údaje. Teď ověřte, zda vyhovují člověku a prostředí doma. Při nejistotě vyberte <strong>Nevím</strong>.</p>
        </section>
        <div id="zp-bath-transfer-errors" class="zp-advisor-errors" role="alert" aria-live="assertive" hidden></div>
        <div class="zp-advisor-action">
          <button class="zp-btn zp-submit" type="button" id="zp-bath-transfer-submit">1. Ukázat možný výrobek</button>
        </div>
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

  <section id="srovnani-sedatek-do-vany" class="zp-section" aria-labelledby="srovnani-vana-nadpis">
    <div class="zp-wrap">
      <p class="zp-kicker">Srovnání konkrétních konstrukcí</p>
      <h2 id="srovnani-vana-nadpis" class="zp-section-title">Sedátko na okraj vany vs. transferová lavice: dva modely, rozměry a cena</h2>
      <p>Oba příklady jsou součástí výběru Zápraží, ale nejsou vzájemně zaměnitelné. U první konstrukce se ověřuje tvar a vnitřní šířka vany a pevné uchycení. U druhé se navíc ověřuje místo pro rám, stabilní uložení nohou uvnitř i mimo vanu a bezpečný přesun.</p>
      <div class="zp-walker-compare-grid zp-walker-compare-grid-two">
        <article class="zp-walker-compare-card">
          <h3>BESCO BES-BS008</h3><p class="zp-walker-compare-model">Sedačka na okraj vany s madlem</p>
          <p>Cenu ověřte u prodejce. Dostupný katalogový snímek je starší.</p>
          <dl><div><dt>Vnitřní šířka vany</dt><dd>41–65 cm</dd></div><div><dt>Rozměr sedátka</dt><dd>69 × 31 cm</dd></div><div><dt>Nosnost</dt><dd>100 kg</dd></div><div><dt>Hmotnost</dt><dd>1,69 kg</dd></div><div><dt>Materiál</dt><dd>PP</dd></div><div><dt>Upevnění</dt><dd>4 nastavitelné rozpěrné nožičky</dd></div></dl>
          <p>Rozměr 69 cm je šířka sedačky, ne požadovaná vnitřní šířka vany. U van s atypickým okrajem nebo tvarováním vyžádejte potvrzení kompatibility. Nepoužívejte nepevné uchycení.</p>
          <p><a class="zp-text-link" href="https://www.rehabilitacnipomucky.cz/besco-sedacka-na-vanu-s-madlem/" target="_blank" rel="noopener noreferrer">Katalog BES-BS008 a návod</a></p>
        </article>
        <article class="zp-walker-compare-card">
          <h3>UNIZDRAV P2203</h3><p class="zp-walker-compare-model">Transferová židle přes vanu</p>
          <?php if ( $zp_bath_seat_prices_fresh ) : ?><p><strong>2 118 Kč</strong> · katalogová cena 28. 11. 2026, bez dopravy a dalších služeb.</p><?php else : ?><p>Cenu ověřte v aktuálním katalogu.</p><?php endif; ?>
          <dl><div><dt>Celkový půdorys</dt><dd>81 × 61 cm</dd></div><div><dt>Celková výška</dt><dd>81,5–91,5 cm</dd></div><div><dt>Výška sedu</dt><dd>45,5–56 cm</dd></div><div><dt>Rozměr sedáku</dt><dd>68 × 41 cm</dd></div><div><dt>Nosnost</dt><dd>110 kg</dd></div><div><dt>Hmotnost</dt><dd>4,4 kg</dd></div></dl>
          <p>Část konstrukce stojí ve vaně a část na podlaze. Samotné celkové rozměry neukazují, kolik centimetrů bude konstrukce vyčnívat mimo vaši vanu. Rozložení nohou a stabilitu ověřte podle návodu a skutečného místa.</p>
          <p><a class="zp-text-link" href="https://unizdrav.cz/zbozi/2203/sprchovaci-zidle-do-vany" target="_blank" rel="noopener noreferrer">Katalog P2203 a technické podklady</a></p>
        </article>
      </div>
      <p class="zp-muted-copy">Technické podklady načtené 28. 11. 2026, BS008 ze staršího snímku. U P2203 se datovaná cena po uplynutí kontrolního intervalu skryje. Nejde o potvrzenou dostupnost, hrazenou cenu ani individuální doporučení.</p>
      <h3>Jak interpretovat vnitřní šířku vany 40, 55 nebo 66 cm?</h3>
      <div class="zp-decision-grid">
        <article class="zp-decision-card"><h4>40 cm</h4><p>O 1 cm méně než spodní hranice deklarovaného rozsahu BS008. Nepovažujte výrobek za kompatibilní. Zeptejte se na vhodnou jinou konstrukci.</p></article>
        <article class="zp-decision-card"><h4>55 cm</h4><p>Číslo je uvnitř rozsahu 41–65 cm, ale samo nepotvrzuje uchycení. Ověřte tvar a stabilitu okrajů, výšku sedu, nosnost a způsob přesunu.</p></article>
        <article class="zp-decision-card"><h4>66 cm</h4><p>O 1 cm více než horní hranice. Nepokoušejte se rozsah obejít jiným dotažením. P2203 může být další konstrukce k odbornému ověření, nikoli automatická náhrada.</p></article>
      </div>
      <h3>Co se ptát při půjčení nebo koupi sedátka do vany</h3>
      <p>U dočasného řešení si vyžádejte nabídku půjčovny na přesný typ, dobu výpůjčky, kauci, způsob hygienické přípravy a případnou dopravu. U hypotetické sazby 200 Kč za měsíc, jednorázového nevratného poplatku 150 Kč a vratné kauce 500 Kč by tři měsíce znamenaly 750 Kč konečný náklad při plném vrácení kauce a 1 250 Kč dočasný výdaj. Nejde o skutečný ceník ani srovnání s konkrétním modelem. Pokud se potřeba prodlužuje, znovu posuďte vhodnost i celkové náklady.</p>
      <p>Před objednáním si potvrďte, zda konstrukce pasuje ke konkrétní vaně, jak se kontroluje její správné uchycení a zda je možné ji vrátit při nekompatibilitě. U nejistého či asistovaného přesunu se nejdřív poraďte s odborníkem; jiná velikost sedátka tento problém sama neřeší.</p>
      <p><a class="zp-btn" href="#poradce-sedatko-vana">Ověřit vhodný typ v poradci</a> · <a class="zp-text-link" href="<?php echo esc_url( home_url( '/co-zmerit-v-koupelne-pred-vyberem-pomucky/#mereni-vana' ) ); ?>">Připravit rozměry vany</a> · <a class="zp-text-link" href="<?php echo esc_url( home_url( '/pomucky-do-koupelny-na-pojistovnu/' ) ); ?>">Prověřit úhradu</a></p>
    </div>
  </section>

  <section class="zp-section zp-section-soft" data-zp-context-links="bath-transfer">
    <div class="zp-wrap">
      <p class="zp-kicker">Když toto řešení nestačí</p>
      <h2 class="zp-section-title">Nejste si jistí, zda je problém ve vaně, nebo při přesunu?</h2>
      <p>Sedátko přes okraj vany a sprchovací židle řeší jiné situace. Nejdřív určete, kde člověk potřebuje oporu a zda přesun zvládá bez fyzického zvedání druhou osobou.</p>
      <nav aria-label="Související bezpečné kroky">
        <p><a class="zp-text-link" href="<?php echo esc_url( home_url( '/koupelna-a-wc/#poradce-koupelna' ) ); ?>">Vybrat vhodnou cestu v koupelně</a></p>
      </nav>
    </div>
  </section>

  <section id="kontrola-presunu-do-vany" class="zp-section" data-zp-editorial-guide="bath-transfer">
    <div class="zp-wrap">
      <p class="zp-kicker">Před volbou sedačky nebo lavice</p>
      <h2 class="zp-section-title">Čtyři kontroly přesunu do vany, které nelze nahradit rozměrem sedátka.</h2>
      <p>Rozhodujte podle způsobu usednutí a přenesení nohou, rozměrů vany i podlahy. Sedačka přes okraj vany a transferová lavice stojící částečně vně vany jsou odlišné konstrukce. Pokud člověk není schopen přesun bezpečně provést, samotná sedačka nemusí být vhodným řešením.</p>
      <div class="zp-decision-grid">
        <article class="zp-decision-card">
          <h3>1. Usednout a přenést nohy bez nebezpečného vstávání</h3>
          <p>U pomůcek pro mytí nad vanou obvykle sed předchází přesunu nohou přes okraj. Nepokoušejte se o první složitý přesun bez bezpečného způsobu asistence. Pokud je potřeba fyzické zvedání druhou osobou, online poradce konkrétní výrobek nevybírá; je na místě odborné posouzení.</p>
        </article>
        <article class="zp-decision-card">
          <h3>2. Změřit vanu a volnou podlahu</h3>
          <p>U sedátka uchyceného na okraj ověřte skutečnou vnitřní šířku vany, způsob zajištění a tvar okrajů. Transferová lavice vyžaduje navíc volnou stabilní plochu mimo vanu, bez kolize s WC, dveřmi nebo nábytkem. Rozměry jedné konstrukce nelze zaměnit za jinou.</p>
        </article>
        <article class="zp-decision-card">
          <h3>3. Protiskluz a stabilita před použitím</h3>
          <p>Zkontrolujte, zda sedačka nebo lavice po správné instalaci nemůže nechtěně sklouznout. Podlaha musí být suchá, neklouzavá a stabilní; u provedení s nohami ověřte jejich správné usazení podle návodu. Jakékoli viklání nebo nedostatečné zajištění je důvod pomůcku nepoužít do odstranění závady.</p>
        </article>
        <article class="zp-decision-card">
          <h3>4. Když se při přesunu ukáže nový problém</h3>
          <p>Užitečné může být jiné uspořádání koupelny, bezpečnější způsob hygieny nebo odborné doporučení. Nepředpokládejte, že větší sedačka automaticky vyřeší omezený prostor či nejistý přesun. A neporovnávejte nosnost 100 kg u jedné varianty s 110 kg u druhé bez nového ověření.</p>
        </article>
      </div>
      <p><a class="zp-text-link" href="<?php echo esc_url( home_url( '/koupelna-a-wc/#poradce-koupelna' ) ); ?>">Nejste si jistí typem řešení? Projděte celý poradce koupelnou</a></p>
      <p class="zp-disclaimer">Není to návod k samostatnému nácviku rizikového přesunu. Když je potřeba fyzická pomoc, chybí prostor pro bezpečné použití nebo je nejistá stabilita pomůcky, výběr zastavte a domluvte odborné posouzení.</p>
      <p class="zp-muted-copy">Podklady ověřeny 11. 10. 2026: <a href="https://www.guysandstthomas.nhs.uk/health-information/daily-tasks-using-1-hand" target="_blank" rel="noopener">Guy's and St Thomas' NHS — bezpečnější mytí, protiskluz a sedátka</a>; <a href="https://www.nhs.uk/social-care-and-support/practical-tips-if-you-care-for-someone/how-to-move-lift-and-handle-someone-else/" target="_blank" rel="noopener">NHS — odborné posouzení pomůcek pro přesun</a>; <a href="https://www.nzip.cz/clanek/1285-demence-pecujici-osobni-hygiena" target="_blank" rel="noopener">NZIP — odstranění koupelnových bariér</a>. Jde o praktická bezpečnostní vodítka, nikoli individuální klinicky ověřené doporučení; externí odborná revize není doložená.</p>
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
