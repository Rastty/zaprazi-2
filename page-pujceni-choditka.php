<?php
/* ZP_RELEASE_0_8_50 */
/*
Template Name: Zápraží — Půjčení chodítka
*/
$zp_rental_checked_at = '2026-10-06';
$zp_rental_fresh_through = '2026-11-06';
$zp_rental_today = current_time( 'Y-m-d' );
$zp_rental_is_fresh = $zp_rental_today <= $zp_rental_fresh_through;

get_header();
?>
<main id="main-content" tabindex="-1">
  <section class="zp-hero">
    <div class="zp-wrap">
      <p class="zp-kicker">Zápraží · Půjčení pomůcky</p>
      <h1>Půjčení chodítka nebo rollátoru.</h1>
      <p class="zp-lead">Kdy dává pronájem smysl, kolik stojí konkrétní příklady v roce 2026 a co si ověřit dřív, než objednáte dopravu nebo složíte kauci.</p>
      <div class="zp-hero-actions">
        <a class="zp-btn" href="<?php echo esc_url( home_url( '/choditka-pro-seniory/' ) ); ?>">Nejdřív vybrat vhodný typ</a>
        <a class="zp-text-link" href="#ceny">Aktuální příklady cen</a>
      </div>
    </div>
  </section>

  <section class="zp-wrap">
    <div class="zp-grid zp-resource-summary">
      <article class="zp-card">
        <p class="zp-kicker">Krátkodobá potřeba</p>
        <h2>Půjčení může být praktičtější.</h2>
        <p>Po operaci, úrazu nebo při čekání na dlouhodobé řešení může pronájem omezit jednorázový výdaj a umožnit ověřit, jaký typ pomůcky člověku skutečně vyhovuje.</p>
      </article>
      <article class="zp-card">
        <p class="zp-kicker">Dlouhodobá potřeba</p>
        <h2>Porovnejte koupi a úhradu.</h2>
        <p>Pokud se očekává dlouhé používání, porovnejte cenu pronájmu s koupí a u zdravotnického prostředku také s možností úhrady na ePoukaz.</p>
      </article>
      <article class="zp-card">
        <p class="zp-kicker">Nejen cena</p>
        <h2>Kauce, doprava a dostupnost.</h2>
        <p>Půjčovny se liší kaucí, minimální cenou, dopravou a místem osobního odběru. Tyto náklady mohou být důležitější než samotná denní sazba.</p>
      </article>
    </div>
  </section>

  <section id="ceny" class="zp-section zp-section-soft">
    <div class="zp-wrap">
      <p class="zp-kicker">Ověřené příklady · 6. 10. 2026</p>
      <h2 class="zp-section-title">Kolik může půjčení chodítka stát.</h2>

      <?php if ( ! $zp_rental_is_fresh ) : ?>
        <p class="zp-stale-evidence"><strong>Pozor:</strong> tyto ceny byly ověřené 6. 10. 2026 a už jsou starší než 31 dní. Berte je jako historický orientační údaj a před objednáním otevřete aktuální ceník půjčovny.</p>
      <?php endif; ?>

      <div class="zp-rental-grid">
        <article class="zp-rental-card">
          <p class="zp-acquisition-label">RehaKomp</p>
          <h3>Čtyřkolové venkovní chodítko</h3>
          <dl>
            <div><dt>Pronájem</dt><dd><?php echo $zp_rental_is_fresh ? '12 Kč / den' : 'historicky 12 Kč / den'; ?></dd></div>
            <div><dt>Měsíc</dt><dd><?php echo $zp_rental_is_fresh ? '360 Kč' : 'historicky 360 Kč'; ?></dd></div>
            <div><dt>Vratná kauce</dt><dd>1 000 Kč</dd></div>
          </dl>
          <p>RehaKomp uvádí krátkodobé i dlouhodobé pronájmy a dopravu po ČR; dostupnost konkrétního modelu je potřeba ověřit.</p>
          <a class="zp-link-btn" href="https://www.rehakomp.cz/content/18-cenik-pronajmu-pomucek" target="_blank" rel="noopener">Aktuální ceník RehaKomp</a>
        </article>

        <article class="zp-rental-card">
          <p class="zp-acquisition-label">RehaKomp</p>
          <h3>Pevné čtyřbodové chodítko</h3>
          <dl>
            <div><dt>Pronájem</dt><dd><?php echo $zp_rental_is_fresh ? '10 Kč / den' : 'historicky 10 Kč / den'; ?></dd></div>
            <div><dt>Měsíc</dt><dd><?php echo $zp_rental_is_fresh ? '300 Kč' : 'historicky 300 Kč'; ?></dd></div>
            <div><dt>Vratná kauce</dt><dd>typicky 1 000 Kč u ověřených půjčovních položek</dd></div>
          </dl>
          <p>Nižší cena neznamená, že je tento typ vhodný pro každého. U pevného chodítka je důležité, zda ho člověk zvládá při kroku bezpečně posouvat.</p>
          <a class="zp-link-btn" href="https://www.rehakomp.cz/content/18-cenik-pronajmu-pomucek" target="_blank" rel="noopener">Aktuální ceník RehaKomp</a>
        </article>

        <article class="zp-rental-card">
          <p class="zp-acquisition-label">MEYRA ČR</p>
          <h3>Chodítko — kategorie půjčovny</h3>
          <dl>
            <div><dt>1 týden</dt><dd><?php echo $zp_rental_is_fresh ? '250 Kč' : 'historicky 250 Kč'; ?></dd></div>
            <div><dt>1 měsíc</dt><dd><?php echo $zp_rental_is_fresh ? '600 Kč' : 'historicky 600 Kč'; ?></dd></div>
            <div><dt>Vratná kauce</dt><dd>1 000 Kč</dd></div>
          </dl>
          <p>MEYRA uvádí, že chodítka nezaváží a půjčovné se při následném nákupu může za stanovených podmínek odečíst od prodejní ceny.</p>
          <a class="zp-link-btn" href="https://www.meyra.cz/cenik-meyra.html" target="_blank" rel="noopener">Aktuální ceník MEYRA</a>
        </article>
      </div>
    </div>
  </section>

  <section class="zp-section">
    <div class="zp-wrap">
      <p class="zp-kicker">Rozhodnutí</p>
      <h2 class="zp-section-title">Kdy půjčit a kdy spíš koupit.</h2>
      <div class="zp-decision-grid">
        <article class="zp-decision-card">
          <h3>Půjčit</h3>
          <p>Dává větší smysl, když je potřeba pravděpodobně krátkodobá, chcete nejdřív ověřit vhodný typ nebo čekáte na další rozhodnutí o dlouhodobém řešení.</p>
        </article>
        <article class="zp-decision-card">
          <h3>Koupit</h3>
          <p>Dává větší smysl, pokud očekáváte dlouhodobé používání a konkrétní typ i rozměry už jsou ověřené. Porovnejte pořizovací cenu s kumulovaným pronájmem.</p>
        </article>
        <article class="zp-decision-card">
          <h3>Nejdřív prověřit úhradu</h3>
          <p>U některých zdravotnických prostředků může být správná cesta přes ePoukaz. Nekupujte pomůcku předem s představou, že ji pojišťovna zpětně proplatí.</p>
          <p><a class="zp-text-link" href="<?php echo esc_url( home_url( '/choditko-na-pojistovnu/' ) ); ?>">Jak funguje chodítko na pojišťovnu</a></p>
        </article>
      </div>
    </div>
  </section>

  <section class="zp-section zp-section-dark">
    <div class="zp-wrap">
      <p class="zp-kicker zp-kicker-light">Před objednáním</p>
      <h2 class="zp-section-title">Pět věcí, které ověřte u půjčovny.</h2>
      <div class="zp-acquire-grid">
        <article><h3>Konkrétní typ</h3><p>Nestačí „nějaké chodítko“. Ověřte pevné, dvoukolové nebo čtyřkolové řešení a jeho parametry.</p></article>
        <article><h3>Kauce</h3><p>Zjistěte výši, způsob platby a podmínky vrácení.</p></article>
        <article><h3>Minimální cena</h3><p>Krátký pronájem může mít minimální účtovanou částku vyšší než prostý počet dní.</p></article>
        <article><h3>Doprava</h3><p>Zeptejte se na cenu dovozu, zpětného odvozu a případný osobní odběr.</p></article>
        <article><h3>Dostupnost</h3><p>Ceník neznamená, že konkrétní model je právě volný. Potvrďte termín předem.</p></article>
        <article><h3>Stav a nastavení</h3><p>Při převzetí ověřte technický stav, brzdy, výšku madel a způsob bezpečného použití.</p></article>
      </div>
    </div>
  </section>

  <section class="zp-section zp-section-soft">
    <div class="zp-wrap zp-faq">
      <p class="zp-kicker">Časté otázky</p>
      <h2 class="zp-section-title">Rychlá orientace před půjčením.</h2>

      <details>
        <summary>Kolik stojí půjčení rollátoru na měsíc?</summary>
        <p>V ověřeném ceníku RehaKomp bylo 6. 10. 2026 čtyřkolové venkovní chodítko za 360 Kč měsíčně. MEYRA uváděla kategorii chodítek za 600 Kč měsíčně. Ceny a dostupnost se mohou změnit.</p>
      </details>
      <details>
        <summary>Platí se při půjčení chodítka kauce?</summary>
        <p>U ověřených příkladů RehaKomp i MEYRA byla vratná kauce 1 000 Kč. Vždy ověřte podmínky konkrétní půjčovny a modelu.</p>
      </details>
      <details>
        <summary>Vyplatí se půjčení po operaci?</summary>
        <p>Často může být praktické, pokud je potřeba dočasná. Nejdřív ale musí sedět typ pomůcky; cena pronájmu sama o sobě není důvod používat nevhodné chodítko.</p>
      </details>
      <details>
        <summary>Mohu si půjčit chodítko, než vyřídím ePoukaz?</summary>
        <p>Ano, půjčení může sloužit jako dočasná cesta. Podmínky konkrétní půjčovny a případný vztah půjčovného k následnému nákupu nebo výdeji se ale liší.</p>
      </details>
    </div>
  </section>

  <section class="zp-section">
    <div class="zp-wrap">
      <p class="zp-kicker">Zdroje cen</p>
      <h2 class="zp-section-title">Ceníky ověřené 6. 10. 2026.</h2>
      <div class="zp-resource-sources">
        <article>
          <h3>RehaKomp — ceník pronájmu pomůcek</h3>
          <p>Čtyřkolové venkovní chodítko 12 Kč/den a 360 Kč/měsíc; pevné čtyřbodové 10 Kč/den a 300 Kč/měsíc.</p>
          <a href="https://www.rehakomp.cz/content/18-cenik-pronajmu-pomucek" target="_blank" rel="noopener">Otevřít ceník RehaKomp</a>
        </article>
        <article>
          <h3>MEYRA ČR — ceník půjčovny</h3>
          <p>Chodítko 250 Kč/týden, 600 Kč/měsíc a vratná kauce 1 000 Kč. Ceník uvádí platnost od 1. 1. 2026.</p>
          <a href="https://www.meyra.cz/cenik-meyra.html" target="_blank" rel="noopener">Otevřít ceník MEYRA</a>
        </article>
      </div>
      <p class="zp-disclaimer"><strong>Hranice Zápraží:</strong> ceny jsou příklady z konkrétních půjčoven a nejsou celostátním ceníkem. Dostupnost, dopravu a aktuální cenu ověřte přímo u poskytovatele.</p>
    </div>
  </section>
</main>
<?php get_footer(); ?>
