<?php
/* ZP_RELEASE_0_8_179 */
/*
Template Name: Zápraží — Sedátko do vany pro seniory
*/
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
      </div>
    </div>
  </section>

  <section id="poradce-sedatko-vana" class="zp-wrap zp-advisor-section">
    <div class="zp-panel">
      <p class="zp-kicker">Domácí poradce · Vana</p>
      <h2>Zvládne člověk bezpečný přesun přes okraj vany bez fyzického zvedání?</h2>
      <p>Neptáme se na diagnózu. Rozhodujeme podle samostatnosti přesunu, nosnosti a přesných rozměrů vany a prostoru kolem ní.</p>

      <div id="zp-bath-transfer-advisor" class="zp-advisor-form" role="form">
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

        <section id="zp-bath-transfer-preview" class="zp-result" tabindex="-1" aria-live="polite" hidden></section>
        <section id="zp-bath-transfer-fit-stage" class="zp-bathroom-fit-stage" aria-labelledby="zp-bath-transfer-fit-title" hidden>
          <h3 id="zp-bath-transfer-fit-title">2. Ověřte nosnost a rozměry konkrétní pomůcky</h3>
          <p class="zp-muted-copy zp-fit-measurement-help">Nevíte, jak změřit vanu, její okraj a prostor vedle ní? <a class="zp-text-link" href="<?php echo esc_url( home_url( '/co-zmerit-v-koupelne-pred-vyberem-pomucky/#mereni-vana' ) ); ?>" target="_blank" rel="noopener noreferrer">Praktický kontrolní návod (nová karta)</a>. Rozměry samy o sobě nezaručují bezpečný přesun.</p>
          <p>V předchozím kroku jste viděli model i technické údaje. Teď ověřte, zda vyhovují člověku a prostředí doma. Při nejistotě vyberte <strong>Nevím</strong>.</p>
        </section>
        <div id="zp-bath-transfer-errors" class="zp-advisor-errors" role="alert" aria-live="assertive" hidden></div>
        <button class="zp-btn zp-submit" type="button" id="zp-bath-transfer-submit">1. Ukázat možný výrobek</button>
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
