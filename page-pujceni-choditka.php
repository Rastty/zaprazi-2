<?php
/* ZP_RELEASE_0_8_184 */
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
      <p class="zp-lead">Kdy dává pronájem smysl, <?php echo $zp_rental_is_fresh ? 'kolik stojí konkrétní příklady v roce 2026' : 'jak ověřit cenu místo zastaralých příkladů z roku 2026'; ?> a co si ověřit dřív, než objednáte dopravu nebo složíte kauci.</p>
      <p class="zp-muted-copy">Chcete si půjčit <strong>rollátor se sedátkem</strong>? Než porovnáte sazby, ověřte, jestli zvládá člověk obě brzdy, bezpečné usedání a vstávání. <a class="zp-text-link" href="<?php echo esc_url( home_url( '/rollator-pro-seniory/#rollator-se-sedatkem' ) ); ?>">Podle čeho vybrat bezpečné sedátko a rollátor</a>.</p>
      <div class="zp-hero-actions">
        <a class="zp-btn" href="<?php echo esc_url( home_url( '/choditka-pro-seniory/' ) ); ?>">Nejdřív vybrat vhodný typ</a>
        <a class="zp-text-link" href="#ceny">Příklady cen (ověřeno 6. 10. 2026)</a>
        <a class="zp-text-link" href="#rozpocet-pujceni-choditka"><?php echo $zp_rental_is_fresh ? 'Spočítat orientační půjčovné' : 'Proč nyní nelze přepočítat starší ceny'; ?></a>
        <a class="zp-text-link" href="#zp-otazky-pujcovna">Připravit telefonát do půjčovny</a>
      </div>
    </div>
  </section>

  <section class="zp-wrap">
    <div class="zp-grid zp-resource-summary">
      <article class="zp-card">
        <p class="zp-kicker">Krátkodobá potřeba</p>
        <h2>Půjčení může být praktičtější.</h2>
        <p>Po operaci, úrazu nebo při čekání na dlouhodobé řešení může pronájem omezit jednorázový výdaj, ale až po bezpečném výběru typu a ověření potřebných parametrů. Samotné zapůjčení neprokazuje, že je pomůcka pro konkrétního člověka vhodná.</p>
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
        <p class="zp-stale-evidence"><strong>Pozor:</strong> tyto ceny byly ověřené 6. 10. 2026 a už jsou starší než 31 dní. Berte je jako historický orientační údaj a před objednáním ověřte platnou cenu a dostupnost přímo u půjčovny.</p>
      <?php endif; ?>

      <div class="zp-rental-grid">
        <article class="zp-rental-card">
          <p class="zp-acquisition-label">RehaKomp</p>
          <h3>Čtyřkolové venkovní chodítko</h3>
          <dl>
            <div><dt>Pronájem</dt><dd><?php echo $zp_rental_is_fresh ? '12 Kč / den' : 'historicky 12 Kč / den'; ?></dd></div>
            <div><dt>Měsíc</dt><dd><?php echo $zp_rental_is_fresh ? '360 Kč' : 'historicky 360 Kč'; ?></dd></div>
            <div><dt>Vratná kauce</dt><dd><?php echo $zp_rental_is_fresh ? '1 000 Kč' : 'historicky 1 000 Kč'; ?></dd></div>
          </dl>
          <p>RehaKomp uvádí krátkodobé i dlouhodobé pronájmy a dopravu po ČR; dostupnost konkrétního modelu je potřeba ověřit.</p>
          <a class="zp-link-btn" href="https://www.rehakomp.cz/content/18-cenik-pronajmu-pomucek" target="_blank" rel="noopener">Ověřit cenu u RehaKomp</a>
        </article>

        <article class="zp-rental-card">
          <p class="zp-acquisition-label">RehaKomp</p>
          <h3>Pevné čtyřbodové chodítko</h3>
          <dl>
            <div><dt>Pronájem</dt><dd><?php echo $zp_rental_is_fresh ? '10 Kč / den' : 'historicky 10 Kč / den'; ?></dd></div>
            <div><dt>Měsíc</dt><dd><?php echo $zp_rental_is_fresh ? '300 Kč' : 'historicky 300 Kč'; ?></dd></div>
            <div><dt>Vratná kauce</dt><dd><?php echo $zp_rental_is_fresh ? 'typicky 1 000 Kč u ověřených půjčovních položek' : 'ověřit u půjčovny (starší příklad: 1 000 Kč)'; ?></dd></div>
          </dl>
          <p>Nižší cena neznamená, že je tento typ vhodný pro každého. U pevného chodítka je důležité, zda ho člověk zvládá při kroku bezpečně posouvat.</p>
          <a class="zp-link-btn" href="https://www.rehakomp.cz/content/18-cenik-pronajmu-pomucek" target="_blank" rel="noopener">Ověřit cenu u RehaKomp</a>
        </article>

        <article class="zp-rental-card">
          <p class="zp-acquisition-label">MEYRA ČR</p>
          <h3>Chodítko — kategorie půjčovny</h3>
          <dl>
            <div><dt>1 týden</dt><dd><?php echo $zp_rental_is_fresh ? '250 Kč' : 'historicky 250 Kč'; ?></dd></div>
            <div><dt>1 měsíc</dt><dd><?php echo $zp_rental_is_fresh ? '600 Kč' : 'historicky 600 Kč'; ?></dd></div>
            <div><dt>Vratná kauce</dt><dd><?php echo $zp_rental_is_fresh ? '1 000 Kč' : 'historicky 1 000 Kč'; ?></dd></div>
          </dl>
          <p>MEYRA uvádí, že chodítka nezaváží a půjčovné se při následném nákupu může za stanovených podmínek odečíst od prodejní ceny.</p>
          <a class="zp-link-btn" href="https://www.meyra.cz/cenik-meyra.html" target="_blank" rel="noopener">Ověřit cenu u MEYRA</a>
        </article>
      </div>
      <p class="zp-muted-copy">Před rozhodnutím si ověřte celkové náklady, přesný model a termín vrácení. <a class="zp-text-link" href="#zp-otazky-pujcovna">Připravit pět otázek pro půjčovnu</a>.</p>
    </div>
  </section>

  <section id="rozpocet-pujceni-choditka" class="zp-section" data-zp-rental-budget>
    <div class="zp-wrap">
      <p class="zp-kicker">Rozpočet bez zadávání osobních údajů</p>
      <h2 class="zp-section-title"><?php echo $zp_rental_is_fresh ? 'Kolik může stát půjčení na jeden, tři nebo šest měsíců?' : 'Proč nyní nepřepočítáváme starší ceny půjčoven?'; ?></h2>
      <p><?php if ( $zp_rental_is_fresh ) : ?>Porovnejte násobek ověřené měsíční sazby pro konkrétní kategorii pomůcky.<?php else : ?>Starší měsíční sazby již nepřepočítáváme. Nejdřív ověřte aktuální cenu a dostupnost bezpečně vybraného typu přímo u půjčovny.<?php endif; ?> Nejde o cenovou nabídku ani automatické doporučení typu chodítka: ten musí nejprve projít <a class="zp-text-link" href="<?php echo esc_url( home_url( '/choditka-pro-seniory/' ) ); ?>">bezpečným výběrem</a>. Výsledek neobsahuje vratnou kauci, dopravu ani případné individuální slevy.</p>
      <?php if ( $zp_rental_is_fresh ) : ?>
        <form id="zp-walker-rental-budget" class="zp-rental-budget" hidden>
          <div class="zp-rental-budget-fields">
            <label for="zp-rental-budget-model"><strong>Příklad sazby půjčovny</strong>
              <select id="zp-rental-budget-model" name="model">
                <option value="rehakomp-rollator" data-monthly-price="360" data-provider="RehaKomp" data-model="Čtyřkolové venkovní chodítko">RehaKomp · čtyřkolové venkovní · 360 Kč/měsíc</option>
                <option value="rehakomp-fixed" data-monthly-price="300" data-provider="RehaKomp" data-model="Pevné čtyřbodové chodítko">RehaKomp · pevné čtyřbodové · 300 Kč/měsíc</option>
                <option value="meyra-walker" data-monthly-price="600" data-provider="MEYRA" data-model="Chodítko — kategorie půjčovny">MEYRA · chodítko v půjčovně · 600 Kč/měsíc</option>
              </select>
            </label>
            <label for="zp-rental-budget-months"><strong>Jak dlouho přibližně?</strong>
              <select id="zp-rental-budget-months" name="months">
                <option value="1">1 měsíc</option>
                <option value="3">3 měsíce</option>
                <option value="6">6 měsíců</option>
              </select>
            </label>
          </div>
          <button type="submit" class="zp-btn">Spočítat orientační půjčovné</button>
          <output id="zp-rental-budget-result" class="zp-rental-budget-result" role="status" aria-live="polite"></output>
        </form>
        <noscript><p class="zp-disclaimer">Pro orientační přepočet je potřeba JavaScript. Ověřené měsíční sazby jsou uvedené výše, takže ceníky a odkazy zůstávají dostupné i bez něj.</p></noscript>
      <?php else : ?>
        <p class="zp-stale-evidence"><strong>Přepočet není k dispozici:</strong> podkladové sazby jsme naposledy ověřili 6. 10. 2026. Po uplynutí ověřovacího období je nejprve potřeba znovu prověřit skutečné ceny přímo u půjčoven; zastaralé částky nechceme násobit.</p>
      <?php endif; ?>
      <p class="zp-muted-copy">Sazby ověřené 6. 10. 2026: <a href="https://www.rehakomp.cz/content/18-cenik-pronajmu-pomucek" target="_blank" rel="noopener">RehaKomp</a> a <a href="https://www.meyra.cz/cenik-meyra.html" target="_blank" rel="noopener">MEYRA</a>. Násobek měsíční sazby je pouze orientační; půjčovna může uplatnit minimální účtování, individuální dlouhodobé podmínky či dopravu. Kauce je samostatný dočasný výdaj, nikoliv automaticky cena pronájmu. Před objednáním ověřte aktuální termín, model a konečnou částku u poskytovatele.</p>
    </div>
  </section>

  <section class="zp-section">
    <div class="zp-wrap">
      <p class="zp-kicker">Rozhodnutí</p>
      <h2 class="zp-section-title">Kdy půjčit a kdy spíš koupit.</h2>
      <div class="zp-decision-grid">
        <article class="zp-decision-card">
          <h3>Půjčit</h3>
          <p>Dává větší smysl, když je potřeba pravděpodobně krátkodobá nebo čekáte na dlouhodobé řešení a bezpečně vybraný typ i jeho parametry už máte ověřené. Půjčovna ani nižší cena nenahrazují posouzení vhodnosti.</p>
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

  <section class="zp-section zp-section-soft" data-zp-context-links="walker-rental">
    <div class="zp-wrap">
      <p class="zp-kicker">Než oslovíte půjčovnu</p>
      <h2 class="zp-section-title">Nevíte, které chodítko vůbec hledat?</h2>
      <p>Nejdřív vyberte typ opory podle skutečného prostředí a schopnosti pomůcku bezpečně používat. Až potom porovnávejte nabídky půjčoven. Cena pronájmu neověřuje vhodnost konkrétního modelu.</p>
      <nav aria-label="Výběr typu chodítka před půjčením">
        <p><a class="zp-text-link" href="<?php echo esc_url( home_url( '/#poradce' ) ); ?>">Nevím, co vybrat — začít domácím poradcem</a></p>
        <p><a class="zp-text-link" href="<?php echo esc_url( home_url( '/choditko-do-bytu-pro-seniory/#poradce-choditko-byt' ) ); ?>">Potřebuji chodítko do bytu</a></p>
        <p><a class="zp-text-link" href="<?php echo esc_url( home_url( '/rollator-pro-seniory/#poradce-rollator' ) ); ?>">Potřebuji rollátor pro chůzi venku</a></p>
      </nav>
    </div>
  </section>

  <section class="zp-section zp-section-dark">
    <div class="zp-wrap">
      <p class="zp-kicker zp-kicker-light">Před objednáním</p>
      <h2 class="zp-section-title">Šest věcí, které ověřte u půjčovny.</h2>
      <div class="zp-acquire-grid">
        <article><h3>Konkrétní typ</h3><p>Nestačí „nějaké chodítko“. Ověřte pevné, dvoukolové nebo čtyřkolové řešení a jeho parametry.</p></article>
        <article><h3>Kauce</h3><p>Zjistěte výši, způsob platby a podmínky vrácení.</p></article>
        <article><h3>Minimální cena</h3><p>Krátký pronájem může mít minimální účtovanou částku vyšší než prostý počet dní.</p></article>
        <article><h3>Doprava</h3><p>Zeptejte se na cenu dovozu, zpětného odvozu a případný osobní odběr.</p></article>
        <article><h3>Dostupnost</h3><p>Ceník neznamená, že konkrétní model je právě volný. Potvrďte termín předem.</p></article>
        <article><h3>Stav a nastavení</h3><p>Při převzetí ověřte technický stav, brzdy, výšku madel a způsob bezpečného použití.</p></article>
      </div>
      <div id="zp-otazky-pujcovna" class="zp-system-empty zp-acquire-checklist" role="region" tabindex="-1" aria-labelledby="otazky-pujcovna-nadpis">
        <h3 id="otazky-pujcovna-nadpis">Co říct při telefonátu do půjčovny</h3>
        <p>Otázky si můžete při hovoru přečíst jednu po druhé. Nic nevyplňujete ani neodesíláte.</p>
        <ol class="zp-checklist">
          <li><strong>Typ a dostupnost:</strong> „Hledám dočasné zapůjčení konkrétního, bezpečně vybraného typu chodítka. Máte jej dostupné?“</li>
          <li><strong>Technická kontrola:</strong> „Lze před převzetím ověřit rozměry, nosnost, nastavení a stav brzd či koncovek?“</li>
          <li><strong>Celkové náklady:</strong> „Jaká je celková cena na požadovanou dobu včetně minimálního účtování, kauce, dopravy a vrácení?“</li>
          <li><strong>Předání a zaučení:</strong> „Kdo pomůcku při předání nastaví, předá návod ke konkrétnímu modelu a vysvětlí její bezpečné použití?“</li>
          <li><strong>Vrácení a závady:</strong> „Kdy a jak vrátím pomůcku, za jakých podmínek dostanu zpět kauci a co mám dělat při závadě nebo poškození?“</li>
        </ol>
        <p><strong>Než zavoláte:</strong> připravte <a class="zp-text-link" href="<?php echo esc_url( home_url( '/co-zmerit-pred-vyberem-choditka/#co-zmerit' ) ); ?>">měření a kontrolu průchodů</a>. Pokud není jasné, jaký typ opory člověk bezpečně zvládá, nejdřív využijte <a class="zp-text-link" href="<?php echo esc_url( home_url( '/#poradce' ) ); ?>">Domácího poradce</a> a při nejistotě odborné posouzení. Telefonát ani dostupnost modelu nepotvrzují jeho individuální vhodnost. <strong>Pokud při převzetí nefungují brzdy, koncovky nebo je pomůcka nestabilní, nepoužívejte ji a požádejte půjčovnu o nápravu.</strong></p>
        <p><strong>Pozor na sedátko rollátoru:</strong> sedátko samo o sobě neznamená, že na pomůcce smíte převážet sedící osobu. Převoz člověka připadá v úvahu jen tehdy, pokud jej výslovně dovoluje návod výrobce pro přesný model a jsou splněny jeho podmínky. Pokud návod chybí nebo si nejste jistí, pomůcku k převozu nepoužívejte.</p>
        <h4 id="pujcovna-nema-typ">Co když půjčovna nemá bezpečně vybraný typ?</h4>
        <p>Neberte automaticky jiný typ jen proto, že je právě skladem nebo levnější. Pevné, dvoukolové a čtyřkolové chodítko se liší způsobem použití; u náhradního modelu je potřeba znovu ověřit rozměry, nosnost, brzdy a praktické bezpečné ovládání.</p>
        <p>Požádejte půjčovnu o termín dostupnosti správného typu nebo se obraťte na jinou půjčovnu. Pokud má být typ jiný, vraťte se k <a class="zp-text-link" href="<?php echo esc_url( home_url( '/choditka-pro-seniory/' ) ); ?>">bezpečnému výběru chodítka</a> a při nejistotě řešte vhodnost s odborníkem. Při čekání na ePoukaz si můžete projít <a class="zp-text-link" href="<?php echo esc_url( home_url( '/choditko-na-pojistovnu/' ) ); ?>">možnosti dočasného řešení</a>; samotné zapůjčení nepotvrzuje nárok na úhradu.</p>
      </div>
    </div>
  </section>

  <section class="zp-section zp-section-soft">
    <div class="zp-wrap zp-faq">
      <p class="zp-kicker">Časté otázky</p>
      <h2 class="zp-section-title">Rychlá orientace před půjčením.</h2>

      <details>
        <summary>Kolik stojí půjčení rollátoru na měsíc?</summary>
        <p><?php if ( ! $zp_rental_is_fresh ) : ?><strong>Historické příklady, nikoli aktuální nabídka.</strong> <?php endif; ?>V ověřeném ceníku RehaKomp bylo 6. 10. 2026 čtyřkolové venkovní chodítko za 360 Kč měsíčně. MEYRA uváděla kategorii chodítek za 600 Kč měsíčně. Ceny a dostupnost ověřte před objednáním.</p>
      </details>
      <details>
        <summary>Platí se při půjčení chodítka kauce?</summary>
        <p><?php if ( ! $zp_rental_is_fresh ) : ?><strong>Historické příklady, nikoli aktuální nabídka.</strong> <?php endif; ?>U příkladů RehaKomp i MEYRA ověřených 6. 10. 2026 byla vratná kauce 1 000 Kč. Vždy ověřte podmínky konkrétní půjčovny a modelu.</p>
      </details>
      <details>
        <summary>Vyplatí se půjčení po operaci?</summary>
        <p>Při dočasné potřebě může být půjčení praktické, ale po operaci je nejdřív potřeba ověřit s ošetřujícím odborníkem, jakou oporu a způsob použití člověk bezpečně zvládá. Cena ani dostupnost půjčovny nejsou potvrzením vhodnosti.</p>
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
          <p><?php if ( ! $zp_rental_is_fresh ) : ?><strong>Historické příklady, nikoli aktuální nabídka.</strong> <?php endif; ?>Čtyřkolové venkovní chodítko 12 Kč/den a 360 Kč/měsíc; pevné čtyřbodové 10 Kč/den a 300 Kč/měsíc.</p>
          <a href="https://www.rehakomp.cz/content/18-cenik-pronajmu-pomucek" target="_blank" rel="noopener">Otevřít ceník RehaKomp</a>
        </article>
        <article>
          <h3>MEYRA ČR — ceník půjčovny</h3>
          <p><?php if ( ! $zp_rental_is_fresh ) : ?><strong>Historické příklady, nikoli aktuální nabídka.</strong> <?php endif; ?>Chodítko 250 Kč/týden, 600 Kč/měsíc a vratná kauce 1 000 Kč. Ceník uvádí platnost od 1. 1. 2026.</p>
          <a href="https://www.meyra.cz/cenik-meyra.html" target="_blank" rel="noopener">Otevřít ceník MEYRA</a>
        </article>
      </div>
      <p class="zp-disclaimer"><strong>Hranice Zápraží:</strong> ceny jsou příklady z konkrétních půjčoven a nejsou celostátním ceníkem. Dostupnost, dopravu a aktuální cenu ověřte přímo u poskytovatele.</p>
    </div>
  </section>
</main>
<?php get_footer(); ?>
