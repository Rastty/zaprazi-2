<?php
/* ZP_RELEASE_0_8_199 */
/*
Template Name: Zápraží — Chodítko na pojišťovnu
*/
$zp_sukl_valid_through = '2026-10-31';
$zp_sukl_today = current_time( 'Y-m-d' );
$zp_sukl_is_current = $zp_sukl_today <= $zp_sukl_valid_through;
$zp_sukl_november_active = $zp_sukl_today >= '2026-11-01' && $zp_sukl_today <= '2026-11-30';

get_header();
?>
<main id="main-content" tabindex="-1">
  <section class="zp-hero">
    <div class="zp-wrap">
      <p class="zp-kicker">Zápraží · Úhrada zdravotnické pomůcky</p>
      <h1>Chodítko na pojišťovnu v roce 2026.</h1>
      <p class="zp-lead">Prakticky a bez slibů: jak funguje ePoukaz, co znamená úhrada v seznamu SÚKL a co si ověřit dřív, než chodítko koupíte nebo objednáte.</p>
      <div class="zp-hero-actions">
        <a class="zp-btn" data-zp-journey="advisor" href="<?php echo esc_url( home_url( '/#poradce' ) ); ?>">Ověřit vhodný typ v poradci</a>
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/choditka-pro-seniory/#vyber-typu' ) ); ?>">Porovnat typy chodítek</a>
        <a class="zp-text-link" href="#postup">Jak postupovat s ePoukazem</a>
        <?php if ( ! $zp_sukl_is_current ) : ?>
          <a class="zp-text-link" href="#zp-overit-mesicni-seznam">Kde ověřit platný seznam SÚKL</a>
        <?php endif; ?>
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/kompenzacni-pomucky-pro-seniory/#pojistovna' ) ); ?>">Všechny pomůcky na pojišťovnu</a>
      </div>
    </div>
  </section>

  <section id="rychla-cesta-na-epoukaz" class="zp-section zp-section-soft" aria-labelledby="rychla-cesta-na-epoukaz-nadpis">
    <div class="zp-wrap">
      <p class="zp-kicker">Odpověď bez dlouhého hledání</p>
      <h2 id="rychla-cesta-na-epoukaz-nadpis" class="zp-section-title">Jak získat chodítko na pojišťovnu? Nejdřív ověřit, teprve potom objednávat.</h2>
      <ol class="zp-guide-steps">
        <li><strong>Ověřte bezpečný typ pomůcky.</strong> Pevné chodítko a rollátor nejsou zaměnitelné. Pokud člověk padá, potřebuje fyzickou pomoc nebo nedokáže bezpečně brzdit, požádejte nejdřív o odborné posouzení. <a class="zp-text-link" href="<?php echo esc_url( home_url( '/#poradce' ) ); ?>">Začít orientačním poradcem</a>.</li>
        <li><strong>Zeptejte se předepisujícího lékaře na možnost ePoukazu.</strong> Lékař musí posoudit podmínky pro konkrétní prostředek; samotný název „chodítko“ ani článek na internetu nezaručují úhradu. <a class="zp-text-link" href="#postup">Projít celý postup předpisu</a>.</li>
        <li><strong>U oprávněného výdejce ověřte přesný model, aktuální úhradu a případný doplatek.</strong> Nepředpokládejte, že běžný e-shop přijme ePoukaz nebo že dva podobně označené modely lze zaměnit. <a class="zp-text-link" href="#zp-overit-mesicni-seznam">Jak ověřit platný seznam SÚKL</a>.</li>
      </ol>
      <p class="zp-disclaimer"><strong>Neplaťte předem v očekávání zpětného proplacení.</strong> VZP výslovně upozorňuje, že soukromě zakoupené chodítko následně neproplatí ani po dodatečném doporučení lékaře. <a class="zp-text-link" href="https://www.vzp.cz/o-nas/tiskove-centrum/otazky-tydne/proplaceni-choditka" target="_blank" rel="noopener noreferrer">Oficiální odpověď VZP</a> (ověřeno 7. 11. 2026).</p>
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
          <p>Zápraží má ověřený říjnový seznam SÚKL, ale po 31. 10. 2026 už jeho částku neprezentujeme jako současný stav. U konkrétního výrobku nemáme ověřenou úhradu pro další měsíc.</p>
          <?php if ( $zp_sukl_november_active ) : ?>
            <p><a class="zp-text-link" href="#zp-overit-mesicni-seznam">Listopadový seznam už SÚKL zveřejnil. Zjistěte, kde ověřit nový údaj.</a></p>
          <?php else : ?>
            <p><a class="zp-text-link" href="#zp-overit-mesicni-seznam">Otevřít postup pro ověření seznamu platného pro daný měsíc.</a></p>
          <?php endif; ?>
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
            <p><a class="zp-text-link" href="<?php echo esc_url( home_url( '/choditka-pro-seniory/' ) ); ?>">Nejdřív porovnat typy chodítek</a> · <a class="zp-text-link" href="<?php echo esc_url( home_url( '/choditko-do-bytu-pro-seniory/' ) ); ?>">Chodítko do bytu</a> · <a class="zp-text-link" href="<?php echo esc_url( home_url( '/rollator-pro-seniory/' ) ); ?>">Rollátor</a></p>
          </div>
        </article>
        <article>
          <span>2</span>
          <div>
            <h3>Lékař vystaví ePoukaz, pokud jsou splněné podmínky.</h3>
            <p>Od 1. ledna 2026 je elektronický poukaz standardní formou předpisu zdravotnického prostředku. Zápraží neposuzuje, zda konkrétní člověk podmínky splňuje.</p>
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
            <p>Seznam SÚKL se mění. Zápraží proto zobrazuje datum ověření a měsíčně platný údaj po skončení jeho platnosti přestane prezentovat jako aktuální.</p>
            <p>Pokud chodítko potřebujete dřív, než se vyřídí poukaz, <a class="zp-text-link" href="#kdyz-cekate-na-epoukaz">projděte bezpečné dočasné možnosti</a>. Půjčení není automaticky hrazené pojišťovnou.</p>
          </div>
        </article>
      </div>
    </div>
  </section>

  <section id="kdyz-cekate-na-epoukaz" class="zp-section zp-section-soft" aria-labelledby="cekani-na-epoukaz-nadpis">
    <div class="zp-wrap">
      <p class="zp-kicker">Praktická situace</p>
      <h2 id="cekani-na-epoukaz-nadpis" class="zp-section-title">Chodítko potřebujete dřív, než se vyřídí ePoukaz?</h2>
      <p>Nečekejte s řešením bezpečnosti chůze jen kvůli administrativě. Pokud je chůze nejistá, dochází k pádům nebo člověk potřebuje fyzickou pomoc, nejdřív se poraďte s ošetřujícím lékařem či rehabilitačním odborníkem o bezpečném postupu. Samotné půjčení nevhodného chodítka problém neřeší.</p>
      <div class="zp-decision-grid">
        <article class="zp-decision-card">
          <h3>1. Ověřte stav předpisu a výdeje</h3>
          <p>U předepisujícího a oprávněného výdejce zjistěte, jaký je další krok, zda jsou splněné podmínky a kdy lze pomůcku skutečně vydat. Zápraží nemůže potvrdit nárok ani termín výdeje.</p>
        </article>
        <article class="zp-decision-card">
          <h3>2. Zvažte dočasné půjčení, pokud je typ bezpečně určený</h3>
          <p>Ptejte se na dostupnost konkrétního typu, vyzkoušení, brzdy, šířku, nosnost, kauci, dopravu a vrácení. Půjčení je samostatná cesta, nikoli příslib úhrady z ePoukazu.</p>
          <p><a class="zp-text-link" href="<?php echo esc_url( home_url( '/pujceni-choditka/' ) ); ?>">Půjčení chodítka: praktické podmínky a ověřené příklady</a></p>
        </article>
        <article class="zp-decision-card">
          <h3>3. Připravte rozměry před výběrem modelu</h3>
          <p>Změřte průchody a ověřte výšku madel i potřebnou oporu. Neznámé parametry neodhadujte; při nejistotě požádejte o odborné posouzení.</p>
          <p><a class="zp-text-link" href="<?php echo esc_url( home_url( '/co-zmerit-pred-vyberem-choditka/#co-zmerit' ) ); ?>">Seznam měření před výběrem chodítka</a></p>
        </article>
      </div>
      <p class="zp-disclaimer"><strong>Pozor na dvojí platbu:</strong> předem zakoupené chodítko nelze automaticky zpětně proplatit pojišťovnou. Půjčení a výdej na ePoukaz mají odlišné podmínky. <a href="https://www.vzp.cz/o-nas/tiskove-centrum/otazky-tydne/proplaceni-choditka" target="_blank" rel="noopener">Ověřit pravidlo zpětného proplacení u VZP</a>.</p>
    </div>
  </section>

  <section class="zp-section">
    <div class="zp-wrap zp-method-grid">
      <div>
        <p class="zp-kicker">Konkrétní příklad</p>
        <h2 class="zp-section-title">MEYRA Ideal Rollator 3061982.</h2>
        <p>V oficiálním seznamu SÚKL platném pro říjen 2026 jsme ověřili tento konkrétní prostředek.</p>
        <?php if ( ! $zp_sukl_is_current ) : ?>
          <p class="zp-stale-evidence"><strong>Pozor:</strong> tento měsíční záznam už není aktuální. Níže uvedená částka je historický údaj z října 2026, nikoli potvrzená úhrada pro dnešek. <a href="#zp-overit-mesicni-seznam">Ověřit platný seznam SÚKL a konkrétní kód 5005963</a>.</p>
        <?php endif; ?>

        <div class="zp-resource-facts">
          <div><span>Kód SÚKL</span><strong>5005963</strong></div>
          <div><span>Kód zobrazovaný výrobcem</span><strong>07-5005963</strong></div>
          <div><span><?php echo $zp_sukl_is_current ? 'Úhrada v aktuálním říjnovém seznamu' : 'Historická úhrada v říjnovém seznamu'; ?></span><strong>3 408 Kč</strong></div>
          <div><span>Úhradová skupina</span><strong>07.03.02.03</strong></div>
          <div><span>Interval v záznamu</span><strong>60 měsíců</strong></div>
          <div><span>Platnost ověřeného záznamu</span><strong>do 31. 10. 2026</strong></div>
        </div>

        <div class="zp-card" role="note" aria-labelledby="zp-identita-choditka-nadpis">
          <h3 id="zp-identita-choditka-nadpis">Stejný kód ZP ještě neurčuje přesnou variantu chodítka.</h3>
          <p>Výrobce MEYRA veřejně uvádí kód ZP <strong>07-5005963</strong> u označení <strong>IDEAL ROLLATOR 3061982</strong> i <strong>ROLLATOR 2 3061982-R</strong>. Tyto záznamy mohou mít různé rozměry a údaje pro výběr. Samotný kód z pojišťovny tedy nestačí k tomu, abyste bez další kontroly zaměnili konkrétní výrobky.</p>
          <p><strong>Před předpisem nebo výdejem</strong> si u lékaře a oprávněného výdejce potvrďte přesné označení vydávaného modelu, potřebnou šířku průchodu, výšku madel, nosnost a bezpečné ovládání brzd. Neověřené rozměry nedoplňujte odhadem. Aktuální úhradu a podmínky je nutné ověřit v seznamu SÚKL platném pro daný měsíc, nikoli v říjnovém příkladu.</p>
          <p class="zp-muted-copy">Zdroje výrobce, kontrola 4. 11. 2026: <a class="zp-text-link" href="https://www.meyra.cz/ctyrkolove-choditko-rollator.html" target="_blank" rel="noopener noreferrer">IDEAL ROLLATOR (3061982)</a> a <a class="zp-text-link" href="https://www.meyra.cz/ctyrkolove-choditko-rollator2.html" target="_blank" rel="noopener noreferrer">ROLLATOR 2 (3061982-R)</a>. Nejde o potvrzení, že oba modely mají totožnou úhradu či že je lze zaměnit. <a class="zp-text-link" href="#zp-overit-mesicni-seznam">Ověřit aktuální seznam SÚKL</a>.</p>
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
        <summary>Stačí kód SÚKL 5005963 k výběru přesného rollátoru?</summary>
        <p>Ne. MEYRA uvádí stejný kód zdravotnického prostředku u označení IDEAL ROLLATOR 3061982 a ROLLATOR 2 3061982-R. Před výdejem ověřte přesný model, rozměry a ovládání a u oprávněného výdejce platné podmínky poukazu; tyto varianty nelze považovat za automaticky zaměnitelné. <a class="zp-text-link" href="#zp-identita-choditka-nadpis">Proč je nutné ověřit model</a>.</p>
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
        <p>Ne. Částka 3 408 Kč je historický údaj z oficiálního říjnového seznamu. Samotné zveřejnění dalšího měsíčního seznamu neověřuje konkrétní výrobek. <a class="zp-text-link" href="#zp-overit-mesicni-seznam">Jak prověřit kód 5005963 a podmínky úhrady</a>.</p>
      </details>
    </div>
  </section>

  <section class="zp-section zp-section-soft">
    <div class="zp-wrap">
      <p class="zp-kicker">Oficiální zdroje</p>
      <h2 class="zp-section-title">Ověřujte u zdroje, ne podle reklamního textu.</h2>

      <div class="zp-resource-sources">
        <article id="zp-overit-mesicni-seznam">
          <h3>Jak ověřit aktuální měsíční seznam úhrad ZP</h3>
          <p>Na úřední desce SÚKL otevřete <strong>Seznamy ZP</strong> a vyberte seznam hrazených prostředků na poukaz platný pro daný měsíc (nikoli seznam léků ani návrh seznamu). V dokumentu vyhledejte <strong>kód 5005963</strong> a znovu prověřte identitu výrobku, podmínky a výši úhrady s oprávněným výdejcem. Částka v seznamu neprokazuje individuální nárok, konečný doplatek ani vhodnost pro člověka.</p>
          <?php if ( $zp_sukl_november_active ) : ?>
            <p><strong>Listopad 2026:</strong> SÚKL zveřejnil finální seznam k 1. 11. 2026 dne 23. 10. 2026 (č. j. sukl313250/2026). V Zápraží dosud nemáme jednotlivý záznam kódu 5005963 pro listopad ověřený.</p>
            <a href="https://eud.sukl.gov.cz/pub/deska/40000001/athena/26V01973@SUKLAA" target="_blank" rel="noopener noreferrer">Otevřít oficiální listopadový seznam</a>
          <?php else : ?>
            <p>Vybírejte seznam podle měsíce, ve kterém ověřujete úhradu. Starší měsíční záznam neznamená současnou výši úhrady.</p>
          <?php endif; ?>
          <p><a class="zp-text-link" href="https://eud.sukl.gov.cz/pub/deska/40000001/athena/?kategorie_id=11" target="_blank" rel="noopener noreferrer">Otevřít úřední desku SÚKL — Seznamy ZP</a></p>
          <p class="zp-muted-copy">Ověřeno 2. 11. 2026: zveřejnění listopadového seznamu; nikoli položková výše úhrady konkrétního chodítka.</p>
        </article>
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

      <p class="zp-disclaimer"><strong>Hranice Zápraží:</strong> tato stránka vysvětluje postup a ověřené veřejné údaje. Nejde o diagnózu, preskripci ani potvrzení individuálního nároku na úhradu.</p>
    </div>
  </section>
</main>
<?php get_footer(); ?>
