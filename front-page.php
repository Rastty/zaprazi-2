<?php
/* ZP_RELEASE_0_8_20 */ get_header(); ?>
<main id="main-content" tabindex="-1">
  <section class="zp-hero">
    <div class="zp-wrap">
      <p class="zp-kicker">ZaPrazi.cz · Mobilita</p>
      <h1>Bezpečně a samostatně doma.</h1>
      <p class="zp-lead">Praktický poradce pro výběr chodítka nebo rollátoru. Nezačínáme názvem produktu, ale tím, kde a jak člověk skutečně chodí, co zvládne ovládat a zda dává větší smysl koupě, půjčení nebo nejdřív prověření úhrady.</p>
      <div class="zp-hero-actions">
        <a class="zp-btn" href="#poradce">Spustit poradce pro chůzi</a>
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/koupelna-a-wc/' ) ); ?>">Řeším koupelnu nebo WC</a>
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/polohovaci-postel/' ) ); ?>">Řeším polohovací postel</a>
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/invalidni-vozik/' ) ); ?>">Řeším invalidní vozík</a>
        <a class="zp-text-link" href="#jak-vybrat">Nejdřív si přečíst, jak vybírat</a>
      </div>
    </div>
  </section>

  <section id="poradce" class="zp-wrap zp-advisor-section">
    <div class="zp-panel">
      <p class="zp-kicker">Domácí poradce · Mobilita</p>
      <h2>Co potřebujete vyřešit při chůzi?</h2>
      <p>Odpovězte na několik praktických otázek. Neptáme se na diagnózu a odpovědi se v této verzi nikam neukládají.</p>

      <div id="zp-mobility-advisor" class="zp-advisor-form" role="form" aria-describedby="zp-advisor-privacy">
        <fieldset class="zp-fieldset" data-zp-required-group="environment">
          <legend>Kde člověk potřebuje oporu při chůzi?</legend>
          <label class="zp-choice"><input type="radio" name="environment" value="indoor" required><span><strong>Hlavně doma</strong><small>Byt, dům, krátké přesuny mezi místnostmi.</small></span></label>
          <label class="zp-choice"><input type="radio" name="environment" value="outdoor"><span><strong>Hlavně venku</strong><small>Delší chůze, chodníky, nerovnosti.</small></span></label>
          <label class="zp-choice"><input type="radio" name="environment" value="both"><span><strong>Doma i venku</strong><small>Jedno řešení má pomoci v obou situacích.</small></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-required-group="supportNeed">
          <legend>Jak velkou oporu při chůzi potřebuje?</legend>
          <label class="zp-choice"><input type="radio" name="supportNeed" value="light" required><span><strong>Spíš lehkou oporu</strong><small>Člověk chodí sám, ale chce větší jistotu.</small></span></label>
          <label class="zp-choice"><input type="radio" name="supportNeed" value="steady"><span><strong>Stabilní oporu při většině kroků</strong><small>Bez opory je chůze nejistá.</small></span></label>
          <label class="zp-choice"><input type="radio" name="supportNeed" value="person_assist"><span><strong>Často pomáhá další osoba</strong><small>Při chůzi je běžně potřeba fyzická pomoc.</small></span></label>
          <label class="zp-choice"><input type="radio" name="supportNeed" value="unknown"><span><strong>Nevím</strong><small>Potřebuji se nejdřív zorientovat.</small></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-conditional="indoor" data-zp-required-group="canLiftWalker" hidden>
          <legend>Pokud řešíte chodítko domů: zvládne člověk při každém kroku lehce nadzvednout a posunout celé chodítko?</legend>
          <label class="zp-choice"><input type="radio" name="canLiftWalker" value="yes"><span><strong>Ano</strong><small>Mírné nadzvednutí celé pomůcky není problém.</small></span></label>
          <label class="zp-choice"><input type="radio" name="canLiftWalker" value="no"><span><strong>Ne</strong><small>Potřebuje řešení, které se posouvá po předních kolečkách.</small></span></label>
          <label class="zp-choice"><input type="radio" name="canLiftWalker" value="unknown"><span><strong>Nevím</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-conditional="outdoor" data-zp-required-group="handBrakes" hidden>
          <legend>Pokud řešíte pohyb venku: zvládne člověk bezpečně používat ruční brzdy?</legend>
          <label class="zp-choice"><input type="radio" name="handBrakes" value="yes"><span><strong>Ano</strong></span></label>
          <label class="zp-choice"><input type="radio" name="handBrakes" value="no"><span><strong>Ne</strong></span></label>
          <label class="zp-choice"><input type="radio" name="handBrakes" value="unknown"><span><strong>Nevím</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset">
          <legend>Co je pro vás prakticky důležité?</legend>
          <label class="zp-choice"><input type="checkbox" name="seatNeeded"><span><strong>Možnost si při chůzi odpočinout</strong></span></label>
          <label class="zp-choice"><input type="checkbox" name="transportNeed"><span><strong>Časté převážení autem</strong></span></label>
          <label class="zp-choice"><input type="checkbox" name="tightSpace"><span><strong>Úzké průchody nebo málo prostoru při používání</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset">
          <legend>Jak dlouho bude řešení pravděpodobně potřeba?</legend>
          <label class="zp-choice"><input type="radio" name="duration" value="short_term"><span><strong>Spíš dočasně</strong></span></label>
          <label class="zp-choice"><input type="radio" name="duration" value="long_term"><span><strong>Spíš dlouhodobě</strong></span></label>
          <label class="zp-choice"><input type="radio" name="duration" value="unknown" checked><span><strong>Nevím</strong></span></label>
        </fieldset>

        <div id="zp-advisor-errors" class="zp-advisor-errors" role="alert" aria-live="assertive" hidden></div>
        <button class="zp-btn zp-submit" type="button" id="zp-mobility-submit">Zjistit vhodný další krok</button>
        <p id="zp-advisor-privacy" class="zp-privacy-note">Odpovědi z poradce se neodesílají na server a nejsou součástí adresy stránky.</p>
      </div>
      <noscript><p class="zp-disclaimer">Pro spuštění Domácího poradce je potřeba JavaScript. Bez něj se žádné odpovědi neodesílají.</p></noscript>

      <section id="zp-mobility-result" class="zp-result" aria-live="polite" tabindex="-1" hidden></section>
    </div>

    <div class="zp-grid">
      <article class="zp-card"><h3>1. Situace</h3><p>Začínáme skutečným problémem člověka doma, ne názvem produktu.</p></article>
      <article class="zp-card"><h3>2. Typ řešení</h3><p>Vysvětlíme kandidátní typ chodítka nebo rollátoru a parametry, které je potřeba ověřit.</p></article>
      <article class="zp-card"><h3>3. Jak to získat</h3><p>Koupit, půjčit nebo nejdříve prověřit možnost úhrady.</p></article>
    </div>
  </section>

  <section id="jak-vybrat" class="zp-section zp-section-soft">
    <div class="zp-wrap">
      <p class="zp-kicker">Jak vybrat</p>
      <h2 class="zp-section-title">Chodítko domů není totéž co rollátor ven.</h2>
      <div class="zp-decision-grid">
        <article class="zp-decision-card">
          <h3>Čtyřbodové chodítko</h3>
          <p>Má čtyři pevné opěrné body. Při kroku se celé chodítko lehce nadzvedne a posune dopředu. Proto je důležité ověřit, zda člověk tento pohyb zvládne opakovaně a bezpečně.</p>
          <p><strong>Prakticky:</strong> řešte hlavně výšku, celkovou šířku, hmotnost a prostor mezi nábytkem a dveřmi.</p>
        </article>
        <article class="zp-decision-card">
          <h3>Dvoukolové chodítko</h3>
          <p>Přední kolečka dovolují chodítko posouvat bez zvedání celé konstrukce. Zadní nohy přitom zůstávají opěrné.</p>
          <p><strong>Prakticky:</strong> dává smysl zvažovat, když člověk potřebuje stabilní oporu doma, ale celé chodítko nechce nebo nezvládne při každém kroku zvedat.</p>
        </article>
        <article class="zp-decision-card">
          <h3>Čtyřkolový rollátor</h3>
          <p>Je určený pro plynulejší pohyb po kolečkách a typicky používá ruční brzdy. U venkovní větve proto poradce nejdřív ověřuje, zda člověk brzdy bezpečně zvládne.</p>
          <p><strong>Prakticky:</strong> vedle rozměrů řešte brzdy, skládání, převoz a případně sedátko pro odpočinek.</p>
        </article>
      </div>
    </div>
  </section>

  <section class="zp-section">
    <div class="zp-wrap">
      <p class="zp-kicker">Před koupí</p>
      <h2 class="zp-section-title">Pět parametrů, které má smysl znát dřív než cenu.</h2>
      <div class="zp-check-grid">
        <div><span>01</span><strong>Výška madel</strong><p>Pomůcka musí jít nastavit pro konkrétního člověka; nestačí vybírat podle fotografie.</p></div>
        <div><span>02</span><strong>Celková šířka</strong><p>Změřte nejužší dveře a průchody, pokud se má chodítko používat doma.</p></div>
        <div><span>03</span><strong>Nosnost</strong><p>Ověřujte konkrétní technický údaj výrobku, ne obecný údaj k celé kategorii.</p></div>
        <div><span>04</span><strong>Hmotnost a skládání</strong><p>Důležité hlavně tehdy, když bude rodina pomůcku často přenášet nebo vozit autem.</p></div>
        <div><span>05</span><strong>Způsob používání</strong><p>Pevné nohy, kolečka, brzdy a sedátko mění způsob bezpečného používání celé pomůcky.</p></div>
      </div>
    </div>
  </section>

  <section class="zp-section zp-section-dark">
    <div class="zp-wrap">
      <p class="zp-kicker zp-kicker-light">Jak to získat</p>
      <h2 class="zp-section-title">Někdy není nejlepší první krok „koupit“.</h2>
      <div class="zp-acquire-grid">
        <article><h3>Koupit</h3><p>Dává smysl porovnat ověřené parametry a konkrétní nabídky. Obchodní nabídka ale nikdy neurčuje, jaký typ pomůcky poradce doporučí.</p></article>
        <article>
          <h3>Půjčit</h3>
          <p>U krátkodobé potřeby může být pronájem praktičtější. Proto poradce umí ukázat ověřený příklad půjčovny, pokud ho pro konkrétní výrobek máme.</p>
          <p><a class="zp-text-link zp-text-link-light" href="<?php echo esc_url( home_url( '/pujceni-choditka/' ) ); ?>">Půjčení chodítka: ceny, kauce a kdy se vyplatí</a></p>
        </article>
        <article>
          <h3>Prověřit úhradu</h3>
          <p>U zdravotnických prostředků ověřujeme kód a zdroje, ale nepotvrzujeme individuální nárok. Před nákupem je potřeba zkontrolovat aktuální pravidla a správný preskripční postup.</p>
          <p><a class="zp-text-link zp-text-link-light" href="<?php echo esc_url( home_url( '/choditko-na-pojistovnu/' ) ); ?>">Jak funguje chodítko na pojišťovnu v roce 2026</a></p>
        </article>
      </div>
    </div>
  </section>

  <section id="metodika" class="zp-section">
    <div class="zp-wrap zp-method-grid">
      <div>
        <p class="zp-kicker">Jak pracujeme</p>
        <h2 class="zp-section-title">Doporučení oddělujeme od prodeje.</h2>
        <p>ZaPrazi nejdřív rozhoduje podle praktické situace a ověřitelných parametrů. Teprve potom ukazuje konkrétní výrobky a obchodní nabídky.</p>
        <p>Pokud se zdroje rozcházejí nebo chybí kritický údaj, produkt raději nezobrazíme jako ověřený. To je důvod, proč může být shortlist krátký.</p>
      </div>
      <div class="zp-trust-list">
        <div><strong>Zdroj u produktu</strong><span>Návod výrobce, stránka výrobce nebo jasně označený jiný zdroj.</span></div>
        <div><strong>Datum ověření</strong><span>U proměnlivých informací zobrazujeme, kdy jsme je naposledy kontrolovali.</span></div>
        <div><strong>Úhrada zvlášť</strong><span>Tvrzení výrobce není automaticky stejné jako aktuální oficiální záznam ani individuální nárok.</span></div>
        <div><strong>Affiliate zvlášť</strong><span>Provize nesmí měnit výsledek poradce ani pořadí podle vhodnosti.</span></div>
      </div>
    </div>
  </section>

  <section class="zp-section zp-section-soft">
    <div class="zp-wrap zp-faq">
      <p class="zp-kicker">Časté otázky</p>
      <h2 class="zp-section-title">Rychlá orientace před spuštěním poradce.</h2>

      <details>
        <summary>Jaké chodítko pro seniora do bytu?</summary>
        <p>Nejdřív je potřeba řešit, kolik opory člověk potřebuje, zda zvládne chodítko lehce nadzvednout a jak široké jsou průchody doma. ZaPrazi proto nerozhoduje jen podle věku nebo označení „pro seniora“.</p>
      </details>
      <details>
        <summary>Jaké chodítko nebo rollátor na ven?</summary>
        <p>U venkovní větve je zásadní ovládání brzd a praktické parametry konkrétního rollátoru. Pokud člověk ruční brzdy bezpečně nezvládá, poradce brzděný rollátor automaticky nedoporučí.</p>
      </details>
      <details>
        <summary>Je lepší chodítko půjčit, nebo koupit?</summary>
        <p>Záleží hlavně na očekávané délce používání, ceně, dostupnosti půjčovny a servisu. U dočasné potřeby proto ZaPrazi porovnává půjčení s koupí místo automatického nákupu.</p>
      </details>
      <details>
        <summary>Hradí chodítko zdravotní pojišťovna?</summary>
        <p>Některé zdravotnické prostředky mohou mít úhradu při splnění podmínek a správném postupu. ZaPrazi ukazuje ověřovací cestu a zdroje, ale nepotvrzuje individuální nárok konkrétního člověka.</p>
      </details>
    </div>
  </section>
</main>
<?php get_footer(); ?>
