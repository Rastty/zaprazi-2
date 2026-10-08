<?php
/* ZP_RELEASE_0_8_52 */
/*
Template Name: Zápraží — Soběstačnost
*/
get_header();
?>
<main id="main-content" tabindex="-1">
  <section class="zp-hero">
    <div class="zp-wrap">
      <p class="zp-kicker">Zápraží · Každodenní soběstačnost</p>
      <h1>Pomůcky pro sebeobsluhu a soběstačnost seniorů: co pomůže s pitím, jídlem a otevíráním?</h1>
      <p class="zp-lead">Začínáme konkrétní činností: napít se, udržet nádobu, připravit jednoduché jídlo jednou rukou nebo otevřít běžný obal. Neptáme se na diagnózu a nedoporučujeme produkt jen proto, že je v nabídce partnera.</p>
      <div class="zp-hero-actions">
        <a class="zp-btn" href="#poradce-sobestacnost">Spustit poradce</a>
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/navrat-z-nemocnice/' ) ); ?>">Řeším celý návrat domů</a>
      </div>
    </div>
  </section>

  <section id="poradce-sobestacnost" class="zp-wrap zp-advisor-section">
    <div class="zp-panel">
      <p class="zp-kicker">Domácí poradce · Soběstačnost</p>
      <h2>Která běžná činnost je teď problém?</h2>
      <p>Odpovědi zůstávají jen v prohlížeči. Nezadávejte jméno, diagnózu, typ operace ani jiné zdravotní údaje.</p>

      <div id="zp-adl-advisor" class="zp-advisor-form" role="form" aria-describedby="zp-adl-privacy">
        <fieldset class="zp-fieldset" data-zp-adl-required="task">
          <legend>Co chcete hlavně usnadnit?</legend>
          <label class="zp-choice"><input type="radio" name="task" value="drink" required><span><strong>Samostatné pití</strong><small>Problém je hlavně uchopit, naklonit nebo nerozlít nápoj.</small></span></label>
          <label class="zp-choice"><input type="radio" name="task" value="stabilize_container"><span><strong>Udržet nádobu na místě</strong><small>Sklenice, miska nebo jiný předmět při práci ujíždí.</small></span></label>
          <label class="zp-choice"><input type="radio" name="task" value="one_hand_meal"><span><strong>Připravit jednoduché jídlo jednou rukou</strong><small>Například namazat pečivo bez přidržování druhou rukou.</small></span></label>
          <label class="zp-choice"><input type="radio" name="task" value="open_packaging"><span><strong>Otevřít běžný obal nebo uzávěr</strong><small>Láhev, plechovka, zip nebo obal je problém kvůli úchopu, otočení nebo zatažení.</small></span></label>
          <label class="zp-choice"><input type="radio" name="task" value="other"><span><strong>Něco jiného</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-adl-required="mainProblem">
          <legend>Co je hlavní překážka?</legend>
          <label class="zp-choice"><input type="radio" name="mainProblem" value="grip_or_spill" required><span><strong>Držení, naklánění nebo rozlévání při pití</strong></span></label>
          <label class="zp-choice"><input type="radio" name="mainProblem" value="container_moves"><span><strong>Nádoba nebo předmět se při práci posouvá</strong></span></label>
          <label class="zp-choice"><input type="radio" name="mainProblem" value="one_hand_setup"><span><strong>Činnost potřebuji zvládnout jednou rukou</strong></span></label>
          <label class="zp-choice"><input type="radio" name="mainProblem" value="grip_or_twist"><span><strong>Chybí jistý úchop, otočení nebo zatažení při otevírání</strong><small>Řešíme běžné obaly, uzávěry, jazýčky plechovek a zipy — ne rozhodování o lécích.</small></span></label>
          <label class="zp-choice"><input type="radio" name="mainProblem" value="swallowing_or_medical"><span><strong>Problém je samotné polykání, zakuckávání nebo jiná zdravotní obtíž</strong><small>Tady poradce konkrétní produkt nedoporučí.</small></span></label>
          <label class="zp-choice"><input type="radio" name="mainProblem" value="other"><span><strong>Jiný problém</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-adl-conditional="stabilize_container" data-zp-adl-required="stableSurface" hidden>
          <legend>Je k dispozici stabilní stůl nebo pracovní plocha?</legend>
          <label class="zp-choice"><input type="radio" name="stableSurface" value="yes"><span><strong>Ano</strong></span></label>
          <label class="zp-choice"><input type="radio" name="stableSurface" value="no"><span><strong>Ne</strong></span></label>
          <label class="zp-choice"><input type="radio" name="stableSurface" value="unknown"><span><strong>Nevím</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-adl-conditional="one_hand_meal" data-zp-adl-required="oneHandUse" hidden>
          <legend>Je hlavní potřeba opravdu obsluha jídla jednou rukou?</legend>
          <label class="zp-choice"><input type="radio" name="oneHandUse" value="yes"><span><strong>Ano</strong></span></label>
          <label class="zp-choice"><input type="radio" name="oneHandUse" value="no"><span><strong>Ne</strong></span></label>
          <label class="zp-choice"><input type="radio" name="oneHandUse" value="unknown"><span><strong>Nevím</strong></span></label>
        </fieldset>

        <div id="zp-adl-errors" class="zp-advisor-errors" role="alert" aria-live="assertive" hidden></div>
        <button class="zp-btn zp-submit" type="button" id="zp-adl-submit">Zjistit vhodný další krok</button>
        <p id="zp-adl-privacy" class="zp-privacy-note">Odpovědi se neodesílají na server ani nejsou součástí URL. Do analytiky posíláme jen obecné události bez odpovědí.</p>
      </div>

      <noscript><p class="zp-disclaimer">Pro spuštění poradce je potřeba JavaScript. Bez něj se žádné odpovědi neodesílají.</p></noscript>
      <section id="zp-adl-result" class="zp-result" aria-live="polite" tabindex="-1" hidden></section>
    </div>
  </section>

  <section class="zp-section zp-section-soft">
    <div class="zp-wrap">
      <p class="zp-kicker">Pomůcky pro soběstačnost seniorů</p>
      <h2 class="zp-section-title">Jak vybrat pomůcky pro sebeobsluhu seniora: podle konkrétní činnosti, ne podle věku.</h2>
      <p>Nejprve pojmenujte úkon, který člověka doma skutečně omezuje. U pití může být problém v úchopu nebo rozlévání, u jídla ve stabilizaci nebo obsluze jednou rukou a u běžných obalů v nedostatečném úchopu, otočení či zatažení. Každá z těchto situací potřebuje jiný typ pomůcky.</p>
      <p>Proto Zápraží neukazuje obecný seznam „pomůcek pro seniory“. Nejprve projde praktické podmínky použití a až potom nabídne přesný kandidát. Pokud je problém zdravotní — například samotné polykání — výběr retail produktu zastaví.</p>
      <h3>Čtyři úzké problémy místo katalogu stovek pomůcek.</h3>
      <div class="zp-decision-grid">
        <article class="zp-decision-card"><h3>Pití</h3><p>Řešíme držení, naklánění a rozlévání. Pokud je problém v polykání nebo zakuckávání, výběr produktu zastavíme.</p></article>
        <article class="zp-decision-card"><h3>Stabilizace nádoby</h3><p>Držák doporučujeme jen tehdy, když je potvrzená stabilní pracovní plocha a lze bezpečně ověřit rozměr předmětu.</p></article>
        <article class="zp-decision-card"><h3>Jídlo jednou rukou</h3><p>Podnos dává smysl jen pro konkrétní činnost jednou rukou a po ověření, že se vejde na pracovní plochu.</p></article>
        <article class="zp-decision-card"><h3>Otevírání obalů</h3><p>Pomůcku ukážeme jen tehdy, když jde o praktický problém s úchopem, otočením nebo zatažením u běžného obalu. Léky a dávkování touto větví neřešíme.</p></article>
      </div>
    </div>
  </section>

  <section class="zp-section">
    <div class="zp-wrap">
      <p class="zp-kicker">Když problém není jen u jídla a pití</p>
      <h2 class="zp-section-title">Přejděte rovnou na situaci, kterou opravdu řešíte.</h2>
      <div class="zp-decision-grid">
        <article class="zp-decision-card"><h3>Chůze a opora</h3><p>Chodítko nebo rollátor vybíráme podle prostředí, opory a bezpečného ovládání.</p><p><a class="zp-text-link" href="<?php echo esc_url( home_url( '/#poradce' ) ); ?>">Poradce pro mobilitu</a></p></article>
        <article class="zp-decision-card"><h3>Koupelna a WC</h3><p>Zvýšení WC, opory, sprchovací nebo toaletní řešení mají vlastní fit a bezpečnostní pravidla.</p><p><a class="zp-text-link" href="<?php echo esc_url( home_url( '/koupelna-a-wc/' ) ); ?>">Poradce pro koupelnu a WC</a></p></article>
        <article class="zp-decision-card"><h3>Postel nebo vozík</h3><p>Pro polohovací postel a invalidní vozík používáme samostatné poradce s technickými fit kontrolami.</p><p><a class="zp-text-link" href="<?php echo esc_url( home_url( '/polohovaci-postel/' ) ); ?>">Polohovací postel</a> · <a class="zp-text-link" href="<?php echo esc_url( home_url( '/invalidni-vozik/' ) ); ?>">Invalidní vozík</a></p></article>
      </div>
      <p><a class="zp-text-link" href="<?php echo esc_url( home_url( '/navrat-z-nemocnice/' ) ); ?>">Pokud řešíte návrat z nemocnice, začněte plánem první noci doma.</a></p>
      <p><a class="zp-text-link" href="<?php echo esc_url( home_url( '/kompenzacni-pomucky-pro-seniory/' ) ); ?>">Přehled dalších kompenzačních pomůcek pro seniory</a> · <a class="zp-text-link" href="<?php echo esc_url( home_url( '/obuv-pro-seniory/' ) ); ?>">Snadno obouvatelná obuv pro seniory</a></p>
    </div>
  </section>


  <section class="zp-section zp-section-soft">
    <div class="zp-wrap">
      <p class="zp-kicker">Časté otázky</p>
      <h2 class="zp-section-title">Pomůcky pro soběstačnost: co má smysl řešit jako první?</h2>
      <div class="zp-faq">
        <details>
          <summary>Jak vybrat pomůcku pro soběstačnost seniora?</summary>
          <p>Začněte konkrétní činností, která je obtížná: pití, stabilizace nádoby, jídlo jednou rukou nebo otevírání běžného obalu. Zápraží nevybírá podle věku nebo diagnózy, ale podle praktického úkonu a podmínek použití.</p>
        </details>
        <details>
          <summary>Co může pomoci při jídle jednou rukou?</summary>
          <p>Pokud je hlavní problém opravdu obsluha jídla jednou rukou, může dávat smysl stabilní multifunkční podnos. Před nákupem je potřeba ověřit pracovní plochu a zda pomůcka řeší právě činnost, která doma omezuje samostatnost.</p>
        </details>
        <details>
          <summary>Co dělat, když se člověk při pití zakuckává nebo má problém polykat?</summary>
          <p>To už není běžný problém s úchopem nádoby. Zápraží v této větvi konkrétní produkt nedoporučí. Poruchu polykání je potřeba odborně posoudit; NZIP uvádí, že příčiny dysfagie má objasnit lékař.</p>
          <p><a class="zp-text-link" href="https://www.nzip.cz/rejstrikovy-pojem/1949" target="_blank" rel="noopener">Ověřit informace o poruše polykání na NZIP</a></p>
        </details>
        <details>
          <summary>Existuje pomůcka na otevírání lahví a obalů při slabším úchopu?</summary>
          <p>Ano, existují multifunkční pomůcky pro běžné uzávěry, jazýčky plechovek, zipy a obaly. Tuto větev používáme pouze pro praktický úkon otevírání a neposkytujeme rady k výběru, dávkování ani bezpečnosti léků.</p>
        </details>
        <details>
          <summary>Jaké pomůcky pro sebeobsluhu seniorů existují?</summary>
          <p>Patří sem například pomůcky pro pití, stabilizaci nádob, přípravu jídla jednou rukou, otevírání běžných obalů, oblékání, obouvání nebo podávání předmětů. Zápraží v této stránce řeší jen úzkou část kolem pití, jídla a otevírání a ostatní potřeby směruje do samostatných cest.</p>
        </details>
      </div>
    </div>
  </section>

  <section class="zp-section">
    <div class="zp-wrap">
      <p class="zp-kicker">Ověřené zdroje</p>
      <h2 class="zp-section-title">Produkt zobrazíme až po ověření konkrétní identity.</h2>
      <p>Shortlist používá čtyři přesně identifikované produkty RehaVita.cz: UpCup 15-050101, Beat It 15-050102, Theomatik 15-050103 a MVS Open-It 15-050105. U Theomatiku jsme ověřili rozměry 36,5 × 18,8 × 3 cm; Open-It váží 60 g a je určen pro běžné otevírání uzávěrů, jazýčků, zipů a obalů.</p>
      <p class="zp-muted-copy">Stav a parametry byly ověřeny 7. 10. 2026. Dostupnost obchodu se může změnit.</p>
    </div>
  </section>
</main>
<?php get_footer(); ?>
