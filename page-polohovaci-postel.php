<?php
/* ZP_RELEASE_0_8_254 */
/*
Template Name: Zápraží — Polohovací postel
*/
// Retail snapshot follows the existing 30-day offer freshness policy.
$zp_bed_catalog_date = current_time( 'Y-m-d' );
$zp_bed_catalog_prices_fresh = $zp_bed_catalog_date >= '2026-11-28' && $zp_bed_catalog_date <= '2026-12-28';
get_header();
?>
<main id="main-content" tabindex="-1">
  <section class="zp-hero">
    <div class="zp-wrap">
      <p class="zp-kicker">Zápraží · Polohovací postel</p>
      <h1>Polohovací postel pro seniory: jak vybrat elektrickou postel a jak ji získat?</h1>
      <p class="zp-lead">Začínáme tím, co má postel doma prakticky vyřešit. Neptáme se na diagnózu ani přesnou hmotnost člověka. Poradce oddělí standardní domácí postel, robustnější variantu a náročnější péči na lůžku — a až potom způsob pořízení.</p>
      <p class="zp-muted-copy">Řešíte také hygienu a mytí vlasů člověka na lůžku? <a class="zp-text-link" href="<?php echo esc_url( home_url( '/myti-vlasu-na-luzku/#vyber-myti-vlasu' ) ); ?>">Jak bezpečně umýt vlasy na lůžku</a>. Nejprve ověřte bezpečnou polohu a potřebu pomoci.</p>
      <p class="zp-muted-copy">Potřebujete lůžko hlavně kvůli bezpečnější hygieně a každodenní péči? <a class="zp-text-link" href="<?php echo esc_url( home_url( '/hygiena-leziciho-seniora-doma/#vyber-hygieny-na-luzku' ) ); ?>">Jaký postup a pomůcky dávají smysl při hygieně ležícího</a>.</p>
      <div class="zp-hero-actions">
        <a class="zp-btn" data-zp-journey="advisor" href="#poradce-postel">Spustit poradce</a>
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/' ) ); ?>">Zpět na hlavní stránku</a>
        <a class="zp-text-link" href="#srovnani-polohovacich-posteli">Srovnat 3 modely a ceny</a>
        <a class="zp-text-link" href="#kontrola-polohovaci-postele">Co ověřit před výběrem</a>
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/senior-nemuze-vstat-z-postele/#pomucky-k-posteli' ) ); ?>">Člověk nemůže vstát z postele – typy pomůcek</a>
      </div>
    </div>
  </section>

  <section id="poradce-postel" class="zp-wrap zp-advisor-section">
    <div class="zp-panel">
      <p class="zp-kicker">Domácí poradce · Polohovací postel</p>
      <h2>Co má nová postel hlavně vyřešit?</h2>
      <p>Odpovědi zůstávají jen v prohlížeči. Nepotřebujeme jméno, diagnózu ani přesnou hmotnost.</p>

      <div id="zp-bed-advisor" class="zp-advisor-form" role="form" aria-describedby="zp-bed-privacy">
        <fieldset class="zp-fieldset" data-zp-bed-required="primaryNeed">
          <legend>Jaká je hlavní praktická potřeba?</legend>
          <label class="zp-choice"><input type="radio" name="primaryNeed" value="home_positioning" required><span><strong>Běžné elektrické polohování doma</strong><small>Potřebujeme nastavit výšku, záda a nohy a zachovat co největší samostatnost.</small></span></label>
          <label class="zp-choice"><input type="radio" name="primaryNeed" value="caregiver_access"><span><strong>Usnadnit každodenní péči u lůžka</strong><small>Důležitá je hlavně nastavitelná výška a lepší přístup pečující osoby.</small></span></label>
          <label class="zp-choice"><input type="radio" name="primaryNeed" value="robust_high_load"><span><strong>Potřebujeme robustnější postel s vyšší nosností</strong><small>Standardní domácí nosnost nestačí.</small></span></label>
          <label class="zp-choice"><input type="radio" name="primaryNeed" value="advanced_in_bed_care"><span><strong>Náročnější péče přímo na lůžku</strong><small>Potřebujeme specializované funkce, například boční otáčení nebo hygienu na lůžku.</small></span></label>
          <label class="zp-choice"><input type="radio" name="primaryNeed" value="unknown"><span><strong>Nevím</strong><small>Nejdřív se potřebuji zorientovat.</small></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-bed-required="transferAbility">
          <legend>Jak člověk běžně používá postel a přesouvá se z ní?</legend>
          <label class="zp-choice"><input type="radio" name="transferAbility" value="independent" required><span><strong>Vstává a přesedá převážně samostatně</strong></span></label>
          <label class="zp-choice"><input type="radio" name="transferAbility" value="steadying"><span><strong>Potřebuje oporu nebo dohled, ale ne fyzické zvedání</strong></span></label>
          <label class="zp-choice"><input type="radio" name="transferAbility" value="person_assist"><span><strong>Při přesunu běžně fyzicky pomáhá druhá osoba</strong></span></label>
          <label class="zp-choice"><input type="radio" name="transferAbility" value="mostly_in_bed"><span><strong>Většinu času zůstává na lůžku</strong></span></label>
          <label class="zp-choice"><input type="radio" name="transferAbility" value="unknown"><span><strong>Nevím</strong></span></label>
        </fieldset>

        <div id="zp-bed-candidate-note" class="zp-resource-callout" aria-live="polite">
          <strong>Po výběru hlavní potřeby ukážeme nosnost a půdorys kandidátní postele, které je potřeba ověřit.</strong>
        </div>

        <fieldset class="zp-fieldset" data-zp-product-fit="1" data-zp-bed-required="loadFit">
          <legend>Ověřili jste maximální povolenou hmotnost uživatele konkrétní zobrazené postele? Nezaměňujte ji s nosností celé konstrukce.</legend>
          <label class="zp-choice"><input type="radio" name="loadFit" value="yes" required><span><strong>Ano</strong><small>Přesnou hmotnost člověka do poradce nezadávejte.</small></span></label>
          <label class="zp-choice"><input type="radio" name="loadFit" value="no"><span><strong>Ne</strong></span></label>
          <label class="zp-choice"><input type="radio" name="loadFit" value="unknown"><span><strong>Nevím</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-product-fit="1" data-zp-bed-required="spaceFit">
          <legend>Vejde se kandidátní postel do pokoje a je reálná i cesta pro dopravu/montáž?</legend>
          <label class="zp-choice"><input type="radio" name="spaceFit" value="yes" required><span><strong>Ano, změřeno</strong></span></label>
          <label class="zp-choice"><input type="radio" name="spaceFit" value="no"><span><strong>Ne</strong></span></label>
          <label class="zp-choice"><input type="radio" name="spaceFit" value="unknown"><span><strong>Nevím</strong><small>Nejdřív změřte pokoj, dveře a průchody.</small></span></label>
        </fieldset>

        <fieldset class="zp-fieldset" data-zp-product-fit="1" data-zp-bed-required="userCapacityVerified" hidden>
          <legend>Máte od výrobce nebo odborné výdejny zvlášť potvrzenou maximální povolenou hmotnost samotného uživatele pro tuto konkrétní postel?</legend>
          <p>U Hospital a Multibed obchod uvádí jen obecnou „nosnost“ 250/260 kg. Tento údaj sám o sobě nedokládá maximální hmotnost člověka. Ověřte i použitou matraci a příslušenství.</p>
          <label class="zp-choice"><input type="radio" name="userCapacityVerified" value="yes"><span><strong>Ano, ověřil/a jsem to pro konkrétní model</strong><small>Nespoléhám jen na číslo označené jako nosnost postele.</small></span></label>
          <label class="zp-choice"><input type="radio" name="userCapacityVerified" value="no"><span><strong>Ne, potvrzený limit nemám</strong></span></label>
          <label class="zp-choice"><input type="radio" name="userCapacityVerified" value="unknown"><span><strong>Nevím</strong></span></label>
        </fieldset>

        <fieldset class="zp-fieldset">
          <legend>Jak dlouho bude postel pravděpodobně potřeba?</legend>
          <label class="zp-choice"><input type="radio" name="duration" value="short_term"><span><strong>Spíš dočasně</strong><small>Například zotavení nebo nejistá délka domácí péče.</small></span></label>
          <label class="zp-choice"><input type="radio" name="duration" value="long_term"><span><strong>Spíš dlouhodobě</strong></span></label>
          <label class="zp-choice"><input type="radio" name="duration" value="unknown" checked><span><strong>Nevím</strong></span></label>
        </fieldset>

        <section id="zp-bed-preview" class="zp-result" tabindex="-1" aria-live="polite" hidden></section>
        <section id="zp-bed-fit-stage" class="zp-bathroom-fit-stage" aria-labelledby="zp-bed-fit-title" hidden>
          <h3 id="zp-bed-fit-title">2. Ověřte parametry konkrétního výrobku</h3>
          <p>Teď už znáte přesný model a jeho technické údaje. Porovnejte je s potřebami člověka a podmínkami doma. Pokud si nejste jistí, odpovězte <strong>Nevím</strong> – nákupní doporučení se nezobrazí.</p>
        </section>
        <div id="zp-bed-errors" class="zp-advisor-errors" role="alert" aria-live="assertive" hidden></div>
        <button class="zp-btn zp-submit" type="button" id="zp-bed-submit">1. Ukázat možný výrobek</button>
        <p id="zp-bed-privacy" class="zp-privacy-note">Odpovědi se neodesílají na server, neukládají se do URL a affiliate systém nedostává kombinaci odpovědí.</p>
      </div>

      <noscript><p class="zp-disclaimer">Pro spuštění poradce je potřeba JavaScript. Bez něj se žádné odpovědi neodesílají.</p></noscript>
      <section id="zp-bed-result" class="zp-result" aria-live="polite" tabindex="-1" hidden></section>
    </div>
  </section>

  <section class="zp-section zp-section-soft">
    <div class="zp-wrap">
      <p class="zp-kicker">Jak rozhodujeme</p>
      <h2 class="zp-section-title">Jak vybrat polohovací postel pro seniora: nejdřív účel, prostor a bezpečné používání.</h2>
      <div class="zp-decision-grid">
        <article class="zp-decision-card"><h3>Standardní domácí postel</h3><p>Pro běžné elektrické nastavení výšky, zad a nohou a jednodušší domácí péči.</p></article>
        <article class="zp-decision-card"><h3>Robustnější varianta</h3><p>Když standardní nosnost nestačí, potřebujeme jinou konstrukci — ne jen „stejnou postel ve větší velikosti“.</p></article>
        <article class="zp-decision-card"><h3>Náročnější péče na lůžku</h3><p>Boční otáčení, hygiena nebo toaleta přímo na lůžku jsou samostatný scénář a nemají být automaticky doporučeny každému.</p></article>
      </div>
    </div>
  </section>

  <section class="zp-section">
    <div class="zp-wrap">
      <p class="zp-kicker">Jak ji získat</p>
      <h2 class="zp-section-title">U polohovací postele často není nejlepší první krok nákup.</h2>
      <div class="zp-hero-actions">
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/polohovaci-postel-na-pojistovnu/' ) ); ?>">Podrobně: pojišťovna, půjčení a kdy koupit</a>
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/polohovaci-postel-na-pojistovnu/#porovnani-pujceni-postele' ) ); ?>">Porovnat náklady půjčení a nákupu ve vlastní nabídce</a>
      </div>
      <div class="zp-acquire-grid">
        <article><h3>Půjčit</h3><p>U dočasné potřeby mohou lokální půjčovny elektrickou postel nabídnout za stovky korun měsíčně. Dostupnost, doprava a montáž se liší podle místa.</p></article>
        <article><h3>Prověřit pojišťovnu</h3><p>VZP popisuje předpis, schválení pojišťovnou a také režim cirkulace, kdy může být lůžko pojištěnci zapůjčeno.</p></article>
        <article><h3>Koupit</h3><p>Dává smysl hlavně tam, kde je potřeba dlouhodobá a konkrétní model odpovídá prostoru, nosnosti i praktické péči.</p></article>
      </div>
    </div>
  </section>

  <section id="srovnani-polohovacich-posteli" class="zp-section zp-section-soft" aria-labelledby="zp-bed-comparison-title">
    <div class="zp-wrap">
      <p class="zp-kicker">Tři konkrétní modely · domácí péče</p>
      <h2 id="zp-bed-comparison-title" class="zp-section-title">Elektrická polohovací postel: srovnání CLASSIC, Hospital a Multibed</h2>
      <p class="zp-guide-quick-answer"><strong>Nejlevnější ani nejužší postel nemusí být ta vhodná.</strong> Porovnejte rozměr celého rámu, výšku lehací plochy, dovolenou hmotnost uživatele a to, zda je v ceně matrace. U člověka, který potřebuje pomoc při přesunu nebo složitější péči, začněte odborným posouzením.</p>
      <p>Jde o tři přesně identifikované modely jednoho dodavatele, nikoli žebříček celého trhu. Katalogové údaje a ceny byly načteny 28. 11. 2026; cena ani dostupnost nejsou garantované a celkové náklady se mohou lišit.</p>
      <div class="zp-walker-compare-grid">
        <article class="zp-walker-compare-card">
          <h3>CLASSIC P2777</h3>
          <p class="zp-walker-compare-model">Standardní domácí elektrické polohování</p>
          <?php if ( $zp_bed_catalog_prices_fresh ) : ?>
          <p><strong>20 441 Kč</strong> · katalogová cena samotného lůžka</p>
          <?php else : ?>
          <p><strong>Cenu a dostupnost ověřte v katalogu.</strong> Cenový snímek již není aktuální.</p>
          <?php endif; ?>
          <dl>
            <div><dt>Vnější půdorys</dt><dd>102,5 × 212 cm</dd></div>
            <div><dt>Lehací plocha</dt><dd>90 × 200 cm</dd></div>
            <div><dt>Výška lehací plochy</dt><dd>38,6–80,6 cm</dd></div>
            <div><dt>Max. hmotnost uživatele</dt><dd>178 kg</dd></div>
            <div><dt>Pracovní zatížení</dt><dd>215 kg</dd></div>
            <div><dt>Hmotnost lůžka</dt><dd>77 kg</dd></div>
            <div><dt>Matrace</dt><dd>Není zahrnuta</dd></div>
          </dl>
          <p>Užitečný srovnávací bod pro běžné nastavení výšky a polohy doma. Do rozpočtu přidejte kompatibilní matraci a potvrďte rozsah dodávky.</p>
          <p><a class="zp-text-link" href="https://unizdrav.cz/zbozi/2777/elektricka-polohovaci-postel-classic" target="_blank" rel="noopener noreferrer">Katalog P2777 a technické údaje</a></p>
        </article>
        <article class="zp-walker-compare-card">
          <h3>Hospital P4707</h3>
          <p class="zp-walker-compare-model">Robustní rám, centrální brzda</p>
          <?php if ( $zp_bed_catalog_prices_fresh ) : ?>
          <p><strong>35 039 Kč</strong> · při načtení katalogu uvedeno „zboží je na cestě“</p>
          <?php else : ?>
          <p><strong>Cenu a dostupnost ověřte v katalogu.</strong> Cenový snímek již není aktuální.</p>
          <?php endif; ?>
          <dl>
            <div><dt>Vnější půdorys</dt><dd>105 × 214 cm</dd></div>
            <div><dt>Lehací plocha</dt><dd>90 × 196 cm</dd></div>
            <div><dt>Výška lehací plochy</dt><dd>40–70 cm</dd></div>
            <div><dt>Max. hmotnost uživatele</dt><dd>Nutno potvrdit</dd></div>
            <div><dt>Katalogová nosnost</dt><dd>250 kg (neurčená kategorie)</dd></div>
            <div><dt>Čistá hmotnost lůžka</dt><dd>110 kg</dd></div>
            <div><dt>Matrace</dt><dd>Není zahrnuta</dd></div>
          </dl>
          <p>Ověřte zejména délku kompatibilní matrace, dopravu těžkého rámu a skutečný limit hmotnosti člověka. Vyšší katalogová nosnost není automaticky povolenou hmotností uživatele.</p>
          <p><a class="zp-text-link" href="https://unizdrav.cz/zbozi/4707/elektricka-polohovaci-postel-hospital" target="_blank" rel="noopener noreferrer">Katalog P4707 a technické údaje</a></p>
        </article>
        <article class="zp-walker-compare-card">
          <h3>Multibed P4044</h3>
          <p class="zp-walker-compare-model">Specializované funkce péče na lůžku</p>
          <?php if ( $zp_bed_catalog_prices_fresh ) : ?>
          <p><strong>33 390 Kč</strong> · včetně uvedené matrace</p>
          <?php else : ?>
          <p><strong>Cenu a dostupnost ověřte v katalogu.</strong> Cenový snímek již není aktuální.</p>
          <?php endif; ?>
          <dl>
            <div><dt>Vnější půdorys</dt><dd>96 × 212 cm</dd></div>
            <div><dt>Lehací plocha</dt><dd>90 × 200 cm</dd></div>
            <div><dt>Výška lehací plochy</dt><dd>50–70 cm</dd></div>
            <div><dt>Max. hmotnost uživatele</dt><dd>Nutno potvrdit</dd></div>
            <div><dt>Katalogová nosnost</dt><dd>260 kg (neurčená kategorie)</dd></div>
            <div><dt>Hmotnost s doplňky</dt><dd>104 kg</dd></div>
            <div><dt>Matrace</dt><dd>90 × 200 × 8 cm</dd></div>
          </dl>
          <p>Obsahuje funkci bočního otáčení a toaletní otvor. Jejich praktickou vhodnost a bezpečné použití musí potvrdit odborník. Nejde o univerzální náhradu jiné péče.</p>
          <p><a class="zp-text-link" href="https://unizdrav.cz/zbozi/4044/elektricka-polohovaci-postel-s-matraci-multibed" target="_blank" rel="noopener noreferrer">Katalog P4044 a technické údaje</a></p>
        </article>
      </div>
      <p class="zp-disclaimer">Ceny zachycují veřejné katalogy k uvedenému datu; mohou se změnit a nezahrnují automaticky všechny služby. Nejsou tvrzením o úhradě pojišťovnou ani potvrzením skladem. Katalogové odkazy slouží jako zdroje údajů. Nákupní cesta v poradci zůstává podmíněna bezpečnostními a produktovými kontrolami.</p>
      <h3>Jak porovnat výšku postele, když se člověku obtížně vstává?</h3>
      <p>Rozsah nastavení lehací plochy není totéž jako výsledná výška sedu na okraji matrace. Záleží na tloušťce a stlačení matrace, způsobu přesunu a schopnostech člověka. CLASSIC má v katalogu spodní mez 38,6 cm, Multibed 50 cm. Rozdíl 11,4 cm je významný pro technické porovnání, nikoli důkaz, že jeden model je pro konkrétního člověka vhodnější.</p>
      <p>Předem odborně ověřte bezpečný rozsah výšky a způsob vstávání. <a class="zp-text-link" href="<?php echo esc_url( home_url( '/senior-nemuze-vstat-z-postele/#pomucky-k-posteli' ) ); ?>">Co řešit, pokud člověk nedokáže vstát z postele</a>.</p>
      <h3>Vejde se postel dveřmi a do malé ložnice?</h3>
      <p>Všechny tři modely mají lehací plochu širokou 90 cm, ale vnější šířka se liší. Pokud máte mezi nábytkem volných 110 cm, po vložení rámu CLASSIC zbude souhrnně jen 7,5 cm a u Hospital 5 cm. To není prostor pro bezpečnou obsluhu, pouze rozdíl rozměrů. Změřte i místo pro nohy, pečující osobu a případnou další pomůcku.</p>
      <p>Rám může přijet v rozloženém stavu. Z katalogu P2777 vyplývá balík lůžka 107 × 34 × 179 cm, u P4707 210 × 100 × 43 cm a u P4044 203 × 97 × 34 cm. Skutečnou orientaci balení, hmotnost při přenášení, zatáčky a výtah musí posoudit dopravce. Rozměr dveří není jediným omezením; nic nedemontujte nad rámec pokynů dodavatele.</p>
      <h3>Co objednat společně s postelí a co nechat potvrdit?</h3>
      <p>Do nabídky nechte rozepsat kompatibilní matraci, případné zábrany, další potřebné příslušenství, dopravu, výnos, montáž, zaučení, podmínky servisu a případný odvoz při ukončení péče. Nepřidávejte univerzální zábrany nebo silnější matraci bez posouzení celé sestavy. <a class="zp-text-link" href="<?php echo esc_url( home_url( '/antidekubitni-matrace-na-polohovaci-postel/#rozmery-kompatibilita-matrace' ) ); ?>">Kontrola kompatibility matrace a postele</a>.</p>
      <div class="zp-resource-callout">
        <h3>Poptávka dodavateli: sedm údajů, které si připravte</h3>
        <ol class="zp-guide-steps">
          <li>Přesný kód modelu a maximální dovolená hmotnost uživatele podle návodu.</li>
          <li>Kompatibilní rozměr a tloušťka matrace včetně schválených zábran.</li>
          <li>Výsledná výška sedu při vhodné sestavě a možnosti odborného nácviku.</li>
          <li>Celkový půdorys a potvrzená trasa dopravy do konkrétního pokoje.</li>
          <li>Celková cena s výnosem, montáží a vším nezbytným příslušenstvím.</li>
          <li>Skutečná dostupnost, způsob předání a termín vhodný pro rodinu.</li>
          <li>Servisní kontakt, postup při poruše, dostupnost náhradních dílů a podmínky vrácení.</li>
        </ol>
        <p>Podle odpovědí porovnejte jen stejně vhodné a kompletní sestavy. Je-li potřebná postel na omezenou dobu nebo čekáte na rozhodnutí pojišťovny, zvažte i <a class="zp-text-link" href="<?php echo esc_url( home_url( '/polohovaci-postel-na-pojistovnu/#porovnani-pujceni-postele' ) ); ?>">výpočet ceny půjčení oproti koupi</a>.</p>
      </div>
      <p><a class="zp-btn" href="#poradce-postel">Prověřit typ postele v poradci</a></p>
    </div>
  </section>

  <section id="kontrola-polohovaci-postele" class="zp-section" data-zp-editorial-guide="adjustable-bed">
    <div class="zp-wrap">
      <p class="zp-kicker">Praktická kontrola před pořízením</p>
      <h2 class="zp-section-title">Pět kroků před výběrem polohovací postele: průchod, matrace a bezpečnost jsou stejně důležité jako cena.</h2>
      <p>U elektrické postele je nutné ověřit nejen funkce polohování, ale celou sestavu v reálném bytě. Pokud je při přesunu potřeba fyzická pomoc, lůžko samo o sobě nezaručuje bezpečný způsob vstávání ani péče. Nejdřív si ujasněte, co je třeba odborně posoudit a co lze doma změřit.</p>
      <div class="zp-decision-grid">
        <article class="zp-decision-card">
          <h3>1. Změřit trasu pro dopravu a montáž</h3>
          <p>U přesného modelu UNIZDRAV P2777 CLASSIC je vnější půdorys 102,5 × 212 cm, zatímco plocha pro matraci má 90 × 200 cm. Změřte nejužší dveře, chodbu, zatáčky, místo montáže a přístup pečující osoby z potřebných stran. Rozměr matrace není rozměr celé postele; možnosti transportu rozložených částí potvrzuje dodavatel.</p>
        </article>
        <article class="zp-decision-card">
          <h3>2. Ověřit způsob přesunu a nastavení výšky</h3>
          <p>Elektricky nastavitelná výška P2777 činí podle výrobce 38,6–80,6 cm. To ale nepotvrzuje, že konkrétní člověk bezpečně usedne, vstane nebo přejde z vozíku. Je-li potřeba fyzické zvedání nebo není znám bezpečný postup, je nutné individuální odborné posouzení a případně jiné pomůcky.</p>
        </article>
        <article class="zp-decision-card">
          <h3>3. Nesplést maximální hmotnost s pracovním zatížením</h3>
          <p>Výrobce pro P2777 odděluje maximální hmotnost uživatele 178 kg a pracovní zatížení lůžka 215 kg. Tyto dvě hodnoty nejsou zaměnitelné. Ověřte zatížení podle návodu konkrétního výrobku včetně případného příslušenství; neodvozujte použitelnost z většího čísla a nezadávejte osobní hmotnost do webu.</p>
        </article>
        <article class="zp-decision-card">
          <h3>4. Matrace a boční zábrany musí tvořit kompatibilní sestavu</h3>
          <p>Matrace není u P2777 součástí základního balení. Boční zábrany nelze automaticky považovat za bezpečné pro každého: u nevhodné matrace, mezer nebo jiného příslušenství hrozí zaklínění mezi zábranou, matrací a rámem. Britský regulátor MHRA požaduje individuální posouzení rizik, kompatibility a montáže. Výběr, použití a nastavení zábran proto konzultujte s kompetentní osobou, neřešte je jen online nákupem.</p>
        <p>Pokud řešíte specializovanou matraci, <a class="zp-text-link" href="<?php echo esc_url( home_url( '/antidekubitni-matrace-na-polohovaci-postel/#rozmery-kompatibilita-matrace' ) ); ?>">projděte osm kontrol rozměrů, roštu, zábran a systému s kompresorem</a> před výběrem produktu.</p>
        </article>
        <article class="zp-decision-card">
          <h3>5. Ověřit montáž, napájení a způsob získání</h3>
          <p>Před pořízením zjistěte dostupnost elektrické zásuvky, bezpečné vedení kabelu mimo trasu chůze, dopravu a odbornou montáž. U nejisté nebo dočasné potřeby může být vhodnější prověřit půjčovnu; u delší potřeby nejdřív i podmínky možné úhrady. Výsledkem má být bezpečný plán, nikoli automatický nákup postele.</p>
        </article>
      </div>
      <p><a class="zp-text-link" href="<?php echo esc_url( home_url( '/polohovaci-postel/#poradce-postel' ) ); ?>">Ověřit konkrétní model v poradci</a> · <a class="zp-text-link" href="<?php echo esc_url( home_url( '/polohovaci-postel-na-pojistovnu/' ) ); ?>">Půjčení, úhrada nebo nákup</a></p>
      <p class="zp-disclaimer">Praktická kontrola nenahrazuje individuální posouzení přesunu, rizika pádu či používání bočních zábran. Není-li ověřená nosnost, prostor, kompatibilita matrace a bezpečný způsob použití, konkrétní obchodní nabídka nesmí obejít bezpečnostní podmínky poradce.</p>
      <p class="zp-muted-copy">Podklady ověřeny 12. 10. 2026: <a href="https://unizdrav.cz/zbozi/2777/elektricka-polohovaci-postel-classic" target="_blank" rel="noopener">UNIZDRAV — rozměry, nosnosti, výška a příslušenství P2777 CLASSIC</a>; <a href="https://www.gov.uk/guidance/bed-rails-management-and-safe-use" target="_blank" rel="noopener">MHRA — bezpečné používání bočních zábran a kompatibilita matrací</a>; <a href="https://www.england.nhs.uk/long-read/patient-entrapment-in-beds-bed-rails-and-related-devices/" target="_blank" rel="noopener">NHS England — závažná rizika zaklínění při nekompatibilním vybavení</a>. Zahraniční bezpečnostní zdroje neurčují českou úhradu; nezávislá odborná revize Zápraží není doložena.</p>
    </div>
  </section>

  <section class="zp-section zp-section-soft">
    <div class="zp-wrap zp-faq">
      <p class="zp-kicker">Časté otázky</p>
      <h2 class="zp-section-title">Co ověřit před výběrem polohovací postele.</h2>

      <details>
        <summary>Jak vybrat polohovací postel pro seniora?</summary>
        <p>Začněte tím, co má postel doma prakticky vyřešit: běžné elektrické polohování, snazší přístup pečující osoby, vyšší nosnost nebo náročnější péči na lůžku. Potom ověřte způsob přesunu, nosnost, prostor a teprve nakonec způsob pořízení.</p>
      </details>
      <details>
        <summary>Kolik stojí elektrická polohovací postel pro seniora?</summary>
        <?php if ( $zp_bed_catalog_prices_fresh ) : ?>
          <p>Ve třech veřejných katalogových příkladech načtených 28. 11. 2026 byly uvedeny ceny 20 441 Kč, 35 039 Kč a 33 390 Kč. Některé modely nemají matraci v ceně. <a class="zp-text-link" href="#srovnani-polohovacich-posteli">Porovnejte přesné modely a vybavení</a>; skutečnou celkovou cenu včetně dopravy a montáže si nechte potvrdit.</p>
        <?php else : ?>
          <p>Starší cenové údaje zde již nezobrazujeme. <a class="zp-text-link" href="#srovnani-polohovacich-posteli">Porovnejte přesné modely a vybavení</a> a ověřte aktuální nabídky, matraci, dopravu a montáž přímo u prodejce.</p>
        <?php endif; ?>
      </details>
      <details>
        <summary>Je vždy potřeba elektrická polohovací postel?</summary>
        <p>Ne. Pokud jde jen o pohodlnější vstávání, nemusí být specializované elektrické lůžko automaticky nejlepší řešení. Elektrická polohovací postel dává smysl tehdy, když je potřeba měnit výšku lůžka, polohu zad nebo nohou či usnadnit každodenní péči.</p>
      </details>
      <details>
        <summary>Jaké rozměry změřit před koupí polohovací postele?</summary>
        <p>Změřte místo v pokoji, nejužší dveře a chodby na trase dopravy i prostor kolem postele pro bezpečný přístup. Nestačí znát jen rozměr matrace; rozhoduje celkový půdorys konkrétního lůžka a reálná cesta pro montáž.</p>
      </details>
      <details>
        <summary>Jak ověřit nosnost polohovací postele?</summary>
        <p>Porovnejte technickou nosnost konkrétního modelu s reálnou potřebou a ponechte bezpečnou rezervu podle údajů výrobce. Přesnou hmotnost člověka do poradce Zápraží zadávat nemusíte.</p>
      </details>
      <details>
        <summary>Je lepší polohovací postel půjčit, koupit, nebo řešit přes pojišťovnu?</summary>
        <p>U dočasné nebo nejisté potřeby bývá rozumné nejdřív prověřit půjčení. U dlouhodobé potřeby má smysl před nákupem prověřit také pojišťovnu. Přímý nákup, půjčovna a hrazená cesta jsou tři odlišné způsoby pořízení.</p>
      </details>

      <div class="zp-hero-actions">
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/polohovaci-postel-na-pojistovnu/' ) ); ?>">Pojišťovna, půjčení a nákup</a>
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/bezpecny-byt-pro-seniora/' ) ); ?>">Zkontrolovat prostor a bezpečný byt</a>
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/navrat-z-nemocnice/' ) ); ?>">Připravit návrat domů</a>
      </div>
    </div>
  </section>
</main>
<?php get_footer(); ?>
