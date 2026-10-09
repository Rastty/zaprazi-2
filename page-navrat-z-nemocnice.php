<?php
/* ZP_RELEASE_0_8_58 */
/*
Template Name: Zápraží — Návrat z nemocnice
*/
get_header();
?>
<main id="main-content" tabindex="-1">
  <section class="zp-hero">
    <div class="zp-wrap">
      <p class="zp-kicker">Zápraží · Návrat z nemocnice</p>
      <h1>Návrat z nemocnice domů: co zařídit před propuštěním a pro první noc?</h1>
      <p class="zp-lead">Neřešte všechno najednou. Během několika praktických otázek projdeme vstup domů, přesuny, chůzi, WC, koupelnu, postel a případnou návaznou domácí péči. Výsledkem je pořadí kroků, ne diagnóza.</p>
      <div class="zp-hero-actions">
        <a class="zp-btn" href="#plan-navratu">Připravit plán návratu</a>
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/' ) ); ?>">Zpět na hlavní stránku</a>
      </div>
    </div>
  </section>

  <section id="plan-navratu" class="zp-wrap zp-advisor-section">
    <div class="zp-panel">
      <p class="zp-kicker">Domácí poradce · První noc doma</p>
      <h2>Co je potřeba vyřešit před odjezdem z nemocnice?</h2>
      <p>Ptáme se jen na praktickou připravenost domácnosti. Nepotřebujeme jméno, diagnózu, typ operace, seznam léků ani přesnou hmotnost.</p>

      <div id="zp-return-home-advisor" class="zp-advisor-form" role="form" aria-describedby="zp-return-home-privacy">
        <fieldset class="zp-fieldset" data-zp-return-required="timing">
          <legend>Kdy se má člověk vrátit domů?</legend>
          <label class="zp-choice"><input type="radio" name="timing" value="today_or_tomorrow" required><span><strong>Dnes nebo zítra</strong><small>Řešíme hlavně první noc.</small></span></label>
          <label class="zp-choice"><input type="radio" name="timing" value="within_week"><span><strong>Během týdne</strong></span></label>
          <label class="zp-choice"><input type="radio" name="timing" value="later"><span><strong>Později</strong></span></label>
          <label class="zp-choice"><input type="radio" name="timing" value="unknown"><span><strong>Nevím</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-return-required="entranceReady">
          <legend>Zvládne člověk bezpečně cestu od auta / sanitky až dovnitř domu nebo bytu?</legend>
          <label class="zp-choice"><input type="radio" name="entranceReady" value="yes" required><span><strong>Ano</strong><small>Schody, dveře a prahy jsou prakticky vyřešené.</small></span></label>
          <label class="zp-choice"><input type="radio" name="entranceReady" value="no"><span><strong>Ne</strong><small>Je tam bariéra, kterou zatím neumíme bezpečně překonat.</small></span></label>
          <label class="zp-choice"><input type="radio" name="entranceReady" value="unknown"><span><strong>Nevím</strong><small>Ještě jsme trasu neověřili.</small></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-return-required="transferAbility">
          <legend>Jak bude probíhat přesun mezi postelí, židlí a WC?</legend>
          <label class="zp-choice"><input type="radio" name="transferAbility" value="independent" required><span><strong>Samostatně</strong></span></label>
          <label class="zp-choice"><input type="radio" name="transferAbility" value="steadying"><span><strong>S oporou nebo dohledem, bez fyzického zvedání</strong></span></label>
          <label class="zp-choice"><input type="radio" name="transferAbility" value="person_assist"><span><strong>Běžně bude fyzicky pomáhat druhá osoba</strong></span></label>
          <label class="zp-choice"><input type="radio" name="transferAbility" value="unknown"><span><strong>Nevíme</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-return-required="walking">
          <legend>Jak budou fungovat krátké domácí přesuny?</legend>
          <label class="zp-choice"><input type="radio" name="walking" value="independent" required><span><strong>Chůze samostatně</strong></span></label>
          <label class="zp-choice"><input type="radio" name="walking" value="needs_support"><span><strong>Chůze s oporou</strong><small>Potřebuje chodítko, rollátor nebo jinou oporu.</small></span></label>
          <label class="zp-choice"><input type="radio" name="walking" value="wheelchair_or_no_walk"><span><strong>Na potřebné přesuny nelze spoléhat na chůzi</strong><small>Je potřeba vozík nebo jiný plán mobility.</small></span></label>
          <label class="zp-choice"><input type="radio" name="walking" value="unknown"><span><strong>Nevíme</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-return-conditional="wheelchair" data-zp-return-required="wheelchairReady" hidden>
          <legend>Je vhodný vozík už reálně připravený a ověřený?</legend>
          <label class="zp-choice"><input type="radio" name="wheelchairReady" value="yes"><span><strong>Ano</strong><small>Sed, průchody, brzdy a použití jsou ověřené.</small></span></label>
          <label class="zp-choice"><input type="radio" name="wheelchairReady" value="no"><span><strong>Ne</strong></span></label>
          <label class="zp-choice"><input type="radio" name="wheelchairReady" value="unknown"><span><strong>Nevíme</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-return-required="toiletReady">
          <legend>Je WC pro první dny bezpečně použitelné?</legend>
          <label class="zp-choice"><input type="radio" name="toiletReady" value="yes" required><span><strong>Ano</strong></span></label>
          <label class="zp-choice"><input type="radio" name="toiletReady" value="no"><span><strong>Ne</strong><small>Výška, opora, vzdálenost nebo přesun nejsou vyřešené.</small></span></label>
          <label class="zp-choice"><input type="radio" name="toiletReady" value="unknown"><span><strong>Nevíme</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-return-required="bedReady">
          <legend>Je postel použitelná pro bezpečné uléhání, vstávání a případnou péči?</legend>
          <label class="zp-choice"><input type="radio" name="bedReady" value="yes" required><span><strong>Ano</strong></span></label>
          <label class="zp-choice"><input type="radio" name="bedReady" value="no"><span><strong>Ne</strong></span></label>
          <label class="zp-choice"><input type="radio" name="bedReady" value="unknown"><span><strong>Nevíme</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-return-required="bathroomReady">
          <legend>Je bezpečně vyřešená sprcha nebo vana?</legend>
          <label class="zp-choice"><input type="radio" name="bathroomReady" value="yes" required><span><strong>Ano</strong></span></label>
          <label class="zp-choice"><input type="radio" name="bathroomReady" value="no"><span><strong>Ne</strong></span></label>
          <label class="zp-choice"><input type="radio" name="bathroomReady" value="unknown"><span><strong>Nevíme</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-return-required="homeCare">
          <legend>Je vyřešená případná domácí zdravotní / ošetřovatelská péče?</legend>
          <label class="zp-choice"><input type="radio" name="homeCare" value="arranged" required><span><strong>Ano, je domluvená</strong></span></label>
          <label class="zp-choice"><input type="radio" name="homeCare" value="not_needed"><span><strong>Bylo potvrzeno, že ji nepotřebujeme</strong></span></label>
          <label class="zp-choice"><input type="radio" name="homeCare" value="needed_not_arranged"><span><strong>Je potřeba, ale zatím není domluvená</strong></span></label>
          <label class="zp-choice"><input type="radio" name="homeCare" value="unknown"><span><strong>Nevíme</strong><small>Ještě jsme se nemocničního týmu nezeptali.</small></span></label>
        </fieldset>

        <div id="zp-return-home-errors" class="zp-advisor-errors" role="alert" aria-live="assertive" hidden></div>
        <button class="zp-btn zp-submit" type="button" id="zp-return-home-submit">Sestavit plán pro první noc doma</button>
        <p id="zp-return-home-privacy" class="zp-privacy-note">Odpovědi zůstávají jen v prohlížeči. Neodesíláme jejich kombinaci do analytiky ani affiliate systémů.</p>
      </div>

      <noscript><p class="zp-disclaimer">Pro spuštění poradce je potřeba JavaScript. Bez něj se žádné odpovědi neodesílají.</p></noscript>
      <section id="zp-return-home-result" class="zp-result" aria-live="polite" tabindex="-1" hidden></section>
    </div>
  </section>

  <section class="zp-section zp-section-soft">
    <div class="zp-wrap">
      <p class="zp-kicker">První noc doma</p>
      <h2 class="zp-section-title">Co má přednost před „dokonalým vybavením“.</h2>
      <div class="zp-decision-grid">
        <article class="zp-decision-card"><h3>1. Vstup a přesun</h3><p>Člověk se musí bezpečně dostat domů a mezi postelí, židlí a WC. Pokud je k tomu potřeba fyzické zvedání druhou osobou, nejdřív řešíme transfer.</p></article>
        <article class="zp-decision-card"><h3>2. WC a postel</h3><p>Tyto dvě věci musí fungovat hned první den. Koupelnu lze v některých situacích bezpečně dořešit následně.</p></article>
        <article class="zp-decision-card"><h3>3. Návazná péče</h3><p>NZIP doporučuje řešit domácí zdravotní péči už při plánování propuštění. Nemocniční lékař ji může po hospitalizaci indikovat na 14 dní.</p></article>
      </div>
      <p class="zp-muted-copy">Zdroj: Národní zdravotnický informační portál (Ministerstvo zdravotnictví), „Domácí péče“.</p>
      <a class="zp-text-link" href="https://www.nzip.cz/clanek/209-domaci-pece" target="_blank" rel="noopener">Ověřit informace o domácí péči</a>
    </div>
  </section>

  <section class="zp-section">
    <div class="zp-wrap">
      <p class="zp-kicker">Až jsou kritické věci vyřešené</p>
      <h2 class="zp-section-title">Další krok může být každodenní soběstačnost.</h2>
      <p>Po vstupu domů, přesunech, WC, posteli a potřebné péči často přijde na řadu obyčejný den: napít se, udržet nádobu nebo připravit jednoduché jídlo jednou rukou. Tyto situace řeší samostatný poradce a nejsou podmínkou bezpečného propuštění.</p>
      <div class="zp-hero-actions">
        <a class="zp-link-btn" href="<?php echo esc_url( home_url( '/sobestacnost/' ) ); ?>">Poradce pro každodenní soběstačnost</a>
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/bezpecny-byt-pro-seniora/' ) ); ?>">Projít bezpečnost bytu</a>
      </div>
    </div>
  </section>

  <section class="zp-section zp-section-dark">
    <div class="zp-wrap">
      <p class="zp-kicker zp-kicker-light">Pomůcky po propuštění</p>
      <h2 class="zp-section-title">Půjčovna, ePoukaz a běžný nákup jsou tři odlišné cesty.</h2>
      <p>Od 1. ledna 2026 je standardem elektronický ePoukaz na zdravotnické prostředky. To ale neznamená, že každý retail produkt lze automaticky vydat nebo proplatit přes pojišťovnu.</p>
      <p>Zápraží proto nejdřív řeší praktickou potřebu a až následně vede do samostatného poradce pro konkrétní kategorii.</p>
      <a class="zp-link-btn" href="https://sukl.gov.cz/media/tiskove-zpravy/poukaz-na-zdravotnicke-prostredky-od-1-ledna-2026-uz-jen-elektronicky/" target="_blank" rel="noopener">Ověřit pravidla ePoukazu u SÚKL</a>
    </div>
  </section>

  <section class="zp-section zp-section-soft">
    <div class="zp-wrap zp-faq">
      <p class="zp-kicker">Časté otázky</p>
      <h2 class="zp-section-title">Co zařídit před propuštěním z nemocnice domů.</h2>

      <details>
        <summary>Co je potřeba zařídit před návratem z nemocnice domů?</summary>
        <p>Nejdřív ověřte bezpečný vstup do bytu nebo domu, přesun mezi postelí, židlí a WC, krátké domácí přesuny, použitelné WC a postel. Teprve potom řešte méně akutní vybavení a pohodlí.</p>
      </details>
      <details>
        <summary>Jaké pomůcky mohou být potřeba po propuštění z nemocnice?</summary>
        <p>Záleží na skutečné situaci doma. Může jít například o chodítko nebo rollátor, pomůcku k WC, sprchovací židli, polohovací postel nebo invalidní vozík. Každá z těchto kategorií má vlastní bezpečnostní a rozměrové podmínky.</p>
      </details>
      <details>
        <summary>Co musí fungovat první noc doma?</summary>
        <p>Člověk se musí bezpečně dostat dovnitř, zvládnout potřebné přesuny, použít WC a uložit se do postele. Pokud je některý z těchto kroků nevyřešený, má přednost před méně urgentními nákupy.</p>
      </details>
      <details>
        <summary>Kdy řešit domácí zdravotní péči?</summary>
        <p>Potřebu domácí zdravotní péče je vhodné projednat už během plánování propuštění. Národní zdravotnický informační portál uvádí, že nemocniční lékař ji může po hospitalizaci indikovat na 14 dní.</p>
      </details>
      <details>
        <summary>Je lepší pomůcku půjčit, koupit, nebo řešit přes pojišťovnu?</summary>
        <p>Záleží na délce používání, dostupnosti a konkrétním prostředku. Půjčovna, přímý nákup a cesta přes pojišťovnu jsou tři odlišné možnosti a Zápraží je neoznačuje automaticky za zaměnitelné.</p>
      </details>

      <div class="zp-hero-actions">
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/choditka-pro-seniory/' ) ); ?>">Chodítka a rollátory</a>
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/koupelna-a-wc/' ) ); ?>">Koupelna a WC</a>
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/polohovaci-postel/' ) ); ?>">Polohovací postel</a>
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/invalidni-vozik/' ) ); ?>">Invalidní vozík</a>
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/kompenzacni-pomucky-pro-seniory/' ) ); ?>">Přehled pomůcek</a>
      </div>
    </div>
  </section>
</main>
<?php get_footer(); ?>
