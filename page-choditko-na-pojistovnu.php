<?php
/* ZP_RELEASE_0_8_8 */
/*
Template Name: ZaPrazi — Chodítko na pojišťovnu
*/
$zp_sukl_valid_through = '2026-10-31';
$zp_sukl_today = current_time( 'Y-m-d' );
$zp_sukl_is_current = $zp_sukl_today <= $zp_sukl_valid_through;

get_header();
?>
<main id="main-content" tabindex="-1">
  <section class="zp-hero">
    <div class="zp-wrap">
      <p class="zp-kicker">ZaPrazi.cz · Úhrada zdravotnické pomůcky</p>
      <h1>Chodítko na pojišťovnu v roce 2026.</h1>
      <p class="zp-lead">Prakticky a bez slibů: jak funguje ePoukaz, co znamená úhrada v seznamu SÚKL a co si ověřit dřív, než chodítko koupíte nebo objednáte.</p>
      <div class="zp-hero-actions">
        <a class="zp-btn" href="<?php echo esc_url( home_url( '/#poradce' ) ); ?>">Nejdřív vybrat vhodný typ</a>
        <a class="zp-text-link" href="#postup">Jak postupovat s ePoukazem</a>
      </div>
    </div>
  </section>

  <section class="zp-wrap">
    <div class="zp-grid zp-resource-summary">
      <article class="zp-card">
        <p class="zp-kicker">Od 1. 1. 2026</p>
        <h2>ePoukaz je standard.</h2>
        <p>Zdravotnické prostředky na poukaz se od roku 2026 standardně předepisují elektronicky. Papírová forma zůstává jen pro zákonné výjimky.</p>
      </article>
      <article class="zp-card">
        <p class="zp-kicker">Ověřený příklad</p>
        <?php if ( $zp_sukl_is_current ) : ?>
          <h2>MEYRA Ideal: 3 408 Kč.</h2>
          <p>Oficiální říjnový seznam SÚKL uvádí pro IDEAL ROLLATOR 3061982 úhradu 3 408 Kč. Tento záznam je platný pro říjen 2026.</p>
        <?php else : ?>
          <h2>Říjnový záznam už není aktuální.</h2>
          <p>ZaPrazi má ověřený říjnový seznam SÚKL, ale po 31. 10. 2026 už jeho částku neprezentujeme jako současný stav. Ověřte nový měsíční seznam.</p>
        <?php endif; ?>
      </article>
      <article class="zp-card">
        <p class="zp-kicker">Důležitá hranice</p>
        <h2>Úhrada není automatický nárok.</h2>
        <p>Zápis prostředku v seznamu neznamená, že ho konkrétní člověk automaticky dostane bez doplatku. Rozhodují podmínky, správný předpis a výdej.</p>
      </article>
    </div>
  </section>

  <section class="zp-section">
    <div class="zp-wrap zp-method-grid">
      <div>
        <p class="zp-kicker">Nejdražší chyba</p>
        <h2 class="zp-section-title">Nekupujte chodítko předem s tím, že ho pojišťovna proplatí zpětně.</h2>
        <p>VZP výslovně uvádí, že zdravotnický prostředek koupený z vlastních peněz nelze následně zpětně proplatit ani po dodatečném doporučení lékaře. Pokud má být pomůcka hrazena na poukaz, musí správný postup začít předpisem a výdejem přes oprávněného výdejce.</p>
        <a class="zp-link-btn" href="https://www.vzp.cz/o-nas/tiskove-centrum/otazky-tydne/proplaceni-choditka" target="_blank" rel="noopener">Ověřit u VZP</a>
      </div>

      <aside class="zp-resource-callout">
        <h3>Běžné chodítko: co VZP uvádí</h3>
        <ul>
          <li>kolové nebo bodové chodítko může mimo jiné předepsat praktický lékař,</li>
          <li>VZP uvádí úhradu maximálně 1 kus za 5 let,</li>
          <li>výjimkou jsou některé složitější typy, například kolová chodítka s podpůrnými prvky, kde se režim může lišit.</li>
        </ul>
        <p class="zp-muted-copy">Tato obecná pravidla nenahrazují posouzení konkrétního prostředku a aktuálního úhradového záznamu.</p>
        <a class="zp-link-btn" href="https://www.vzp.cz/o-nas/aktuality/jake-zdravotnicke-prostredky-pro-pacienty-s-poruchou-mobility-muze-od-1-1-2022-predepsat-prakticky-lekar" target="_blank" rel="noopener">Zdroj VZP</a>
      </aside>
    </div>
  </section>

  <section id="postup" class="zp-section zp-section-soft">
    <div class="zp-wrap">
      <p class="zp-kicker">Postup krok za krokem</p>
      <h2 class="zp-section-title">Nejdřív správný typ, potom poukaz.</h2>

      <div class="zp-resource-steps">
        <article>
          <span>1</span>
          <div>
            <h3>Ujasněte si, jakou oporu člověk skutečně potřebuje.</h3>
            <p>Pevné chodítko, dvoukolové chodítko a čtyřkolový rollátor nejsou zaměnitelné. Prostředí, schopnost chodítko posouvat a bezpečné ovládání brzd jsou důležitější než samotná značka.</p>
          </div>
        </article>
        <article>
          <span>2</span>
          <div>
            <h3>Lékař vystaví ePoukaz, pokud jsou splněné podmínky.</h3>
            <p>Od 1. ledna 2026 je elektronický poukaz standardní formou předpisu zdravotnického prostředku. ZaPrazi neposuzuje, zda konkrétní člověk podmínky splňuje.</p>
          </div>
        </article>
        <article>
          <span>3</span>
          <div>
            <h3>ePoukaz dostanete elektronicky nebo jinou dostupnou cestou.</h3>
            <p>SÚKL uvádí možnost aplikace eRecept, e-mailu, SMS nebo papírové průvodky. U výdeje lze za určitých podmínek využít také identifikační doklad.</p>
          </div>
        </article>
        <article>
          <span>4</span>
          <div>
            <h3>Vyberte oprávněného výdejce, ne libovolný e-shop.</h3>
            <p>Prostředek hrazený na poukaz vydává oprávněný výdejce. Běžná maloobchodní produktová stránka může prodávat stejný model pouze za přímou úhradu a poukaz nepřijímat.</p>
          </div>
        </article>
        <article>
          <span>5</span>
          <div>
            <h3>Před výdejem znovu ověřte aktuální záznam a podmínky.</h3>
            <p>Seznam SÚKL se mění. ZaPrazi proto zobrazuje datum ověření a měsíčně platný údaj po skončení jeho platnosti přestane prezentovat jako aktuální.</p>
          </div>
        </article>
      </div>
    </div>
  </section>

  <section class="zp-section">
    <div class="zp-wrap zp-method-grid">
      <div>
        <p class="zp-kicker">Konkrétní příklad</p>
        <h2 class="zp-section-title">MEYRA Ideal Rollator 3061982.</h2>
        <p>V oficiálním seznamu SÚKL platném pro říjen 2026 jsme ověřili tento konkrétní prostředek.</p>
        <?php if ( ! $zp_sukl_is_current ) : ?>
          <p class="zp-stale-evidence"><strong>Pozor:</strong> tento měsíční záznam už není aktuální. Níže uvedená částka je historický údaj z října 2026 a před rozhodnutím je nutné ověřit nový seznam SÚKL.</p>
        <?php endif; ?>

        <div class="zp-resource-facts">
          <div><span>Kód SÚKL</span><strong>5005963</strong></div>
          <div><span>Kód zobrazovaný výrobcem</span><strong>07-5005963</strong></div>
          <div><span><?php echo $zp_sukl_is_current ? 'Úhrada v aktuálním říjnovém seznamu' : 'Historická úhrada v říjnovém seznamu'; ?></span><strong>3 408 Kč</strong></div>
          <div><span>Úhradová skupina</span><strong>07.03.02.03</strong></div>
          <div><span>Interval v záznamu</span><strong>60 měsíců</strong></div>
          <div><span>Platnost ověřeného záznamu</span><strong>do 31. 10. 2026</strong></div>
        </div>
      </div>

      <aside class="zp-resource-callout">
        <h3>Co tento údaj neříká</h3>
        <ul>
          <li>nepotvrzuje individuální nárok konkrétního člověka,</li>
          <li>nepotvrzuje, že každý obchod umí ePoukaz přijmout,</li>
          <li>nepotvrzuje automaticky konečný doplatek při konkrétním výdeji,</li>
          <li>neznamená, že právě tento rollátor je pro daného člověka vhodný.</li>
        </ul>
        <a class="zp-link-btn" href="<?php echo esc_url( home_url( '/#poradce' ) ); ?>">Ověřit nejdřív vhodný typ</a>
      </aside>
    </div>
  </section>

  <section class="zp-section zp-section-dark">
    <div class="zp-wrap">
      <p class="zp-kicker zp-kicker-light">ePoukaz 2026</p>
      <h2 class="zp-section-title">Co je prakticky důležité pro rodinu.</h2>
      <div class="zp-acquire-grid">
        <article>
          <h3>Standardní platnost 30 dnů</h3>
          <p>SÚKL uvádí standardní platnost ePoukazu 30 dnů. Předepisující ji může prodloužit až na jeden rok.</p>
        </article>
        <article>
          <h3>Papír jen ve výjimkách</h3>
          <p>Listinný poukaz zůstává například pro vybrané technické nebo zákonem definované situace. Běžný proces je od roku 2026 elektronický.</p>
        </article>
        <article>
          <h3>Výdej a prodej nejsou totéž</h3>
          <p>To, že je výrobek na e-shopu, neznamená, že přes tento e-shop lze čerpat úhradu. Vždy ověřte konkrétního výdejce a jeho postup.</p>
        </article>
      </div>
    </div>
  </section>

  <section class="zp-section">
    <div class="zp-wrap zp-faq">
      <p class="zp-kicker">Časté otázky</p>
      <h2 class="zp-section-title">Rychlá orientace.</h2>

      <details>
        <summary>Je každé chodítko hrazené pojišťovnou?</summary>
        <p>Ne. Rozhoduje konkrétní zdravotnický prostředek, jeho zařazení a úhradové podmínky. Nestačí, že se výrobek obecně jmenuje chodítko nebo rollátor.</p>
      </details>
      <details>
        <summary>Musím mít od roku 2026 papírový poukaz?</summary>
        <p>Standardně ne. Od 1. ledna 2026 je běžnou formou ePoukaz. Papírový poukaz zůstává jen pro stanovené výjimky.</p>
      </details>
      <details>
        <summary>Mohu chodítko s ePoukazem koupit v libovolném e-shopu?</summary>
        <p>Ne automaticky. Maloobchodní prodej a výdej prostředku na poukaz jsou odlišné cesty. Před objednáním ověřte, zda konkrétní výdejce ePoukaz pro daný prostředek zpracuje.</p>
      </details>
      <details>
        <summary>Je úhrada 3 408 Kč u MEYRA Ideal garantovaná i v listopadu?</summary>
        <p>Ne. Částka 3 408 Kč je ověřená v oficiálním seznamu platném pro říjen 2026. Od 1. listopadu ZaPrazi tento údaj nepovažuje za aktuální, dokud neověří nový měsíční seznam.</p>
      </details>
    </div>
  </section>

  <section class="zp-section zp-section-soft">
    <div class="zp-wrap">
      <p class="zp-kicker">Oficiální zdroje</p>
      <h2 class="zp-section-title">Ověřujte u zdroje, ne podle reklamního textu.</h2>

      <div class="zp-resource-sources">
        <article>
          <h3>SÚKL: povinný ePoukaz od 1. 1. 2026</h3>
          <p>Ověřeno 6. 10. 2026.</p>
          <a href="https://sukl.gov.cz/media/tiskove-zpravy/poukaz-na-zdravotnicke-prostredky-od-1-ledna-2026-uz-jen-elektronicky/" target="_blank" rel="noopener">Otevřít zdroj SÚKL</a>
        </article>
        <article>
          <h3>SÚKL: pravidla předepisování a výdeje od roku 2026</h3>
          <p>Ověřeno 6. 10. 2026.</p>
          <a href="https://sukl.gov.cz/faq/jaka-jsou-pravidla-pro-predpisovani-a-vydej-zdravotnickych-prostredku-od-1-1-2026/" target="_blank" rel="noopener">Otevřít pravidla SÚKL</a>
        </article>
        <article>
          <h3>VZP: zpětné proplacení zakoupeného chodítka není možné</h3>
          <p>Ověřeno 6. 10. 2026.</p>
          <a href="https://www.vzp.cz/o-nas/tiskove-centrum/otazky-tydne/proplaceni-choditka" target="_blank" rel="noopener">Otevřít zdroj VZP</a>
        </article>
        <article>
          <h3>VZP: preskripce běžných chodítek a frekvenční limit</h3>
          <p>VZP uvádí mimo jiné praktického lékaře a maximálně 1 kus za 5 let u běžných kolových/bodových chodítek.</p>
          <a href="https://www.vzp.cz/o-nas/aktuality/jake-zdravotnicke-prostredky-pro-pacienty-s-poruchou-mobility-muze-od-1-1-2022-predepsat-prakticky-lekar" target="_blank" rel="noopener">Otevřít zdroj VZP</a>
        </article>
        <article>
          <h3>SÚKL: seznam cen a úhrad ZP k 1. 10. 2026</h3>
          <p>Obsahuje ověřený záznam IDEAL ROLLATOR 3061982, kód 5005963.</p>
          <a href="https://eud.sukl.gov.cz/pub/deska/40000001/athena/26V018PP@SUKLAA/26D0TRRB@SUKLAA/ZPSCAU_20261001.pdf" target="_blank" rel="noopener">Otevřít oficiální PDF</a>
        </article>
      </div>

      <p class="zp-disclaimer"><strong>Hranice ZaPrazi:</strong> tato stránka vysvětluje postup a ověřené veřejné údaje. Nejde o diagnózu, preskripci ani potvrzení individuálního nároku na úhradu.</p>
    </div>
  </section>
</main>
<?php get_footer(); ?>
