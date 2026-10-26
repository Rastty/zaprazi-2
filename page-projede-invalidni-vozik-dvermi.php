<?php
/* ZP_RELEASE_0_8_160 */
/*
Template Name: Zápraží — Projde invalidní vozík dveřmi
*/
get_header();
?>
<main id="main-content" tabindex="-1">
<section class="zp-hero"><div class="zp-wrap">
<p class="zp-kicker">Zápraží · Invalidní vozík · Praktické měření</p>
<h1>Projde invalidní vozík dveřmi? Jak správně změřit průchod.</h1>
<p class="zp-lead">Šířka sedu vozíku a šířka dveří v katalogu nestačí. Změřte volný otvor při otevřených dveřích, celkovou šířku konkrétního vozíku a prostor na obou stranách. Přepočet může odhalit <strong>příliš úzké místo</strong>, ale sám nikdy nepotvrdí bezpečný průjezd.</p>
<div class="zp-hero-actions">
<a class="zp-btn" href="#mereni-pruchodu">Změřit průchod v šesti krocích</a>
<a class="zp-text-link" href="#porovnani-sirek">Porovnat šířky</a>
<a class="zp-text-link" href="<?php echo esc_url( home_url( '/invalidni-vozik/#poradce-vozik' ) ); ?>">Poradce invalidního vozíku</a>
</div>
<p class="zp-muted-copy">Návod pro rodinu · 16. 10. 2026 · bez ukládání rozměrů či osobních údajů.</p>
</div></section>
<section id="mereni-pruchodu" class="zp-section"><div class="zp-wrap">
<p class="zp-kicker">Doma · s metrem a papírem</p>
<h2 class="zp-section-title">Šest kontrol před výběrem konkrétního vozíku.</h2>
<div class="zp-decision-grid">
<article class="zp-decision-card"><h3>1. Změřte opravdu volný otvor</h3><p>Otevřete dveře tak, jak je bude člověk skutečně používat. Změřte <strong>nejužší volnou šířku</strong> mezi otevřeným křídlem a protější zárubní či jinou překážkou. Nestačí stavební rozměr otvoru ani šířka dveřního křídla.</p></article>
<article class="zp-decision-card"><h3>2. Zjistěte celkovou šířku přesné varianty vozíku</h3><p>Šířka sedu není celková šířka vozíku. Varianty se mohou lišit koly i výbavou. Požadujte parametr <strong>celková šířka</strong> z návodu nebo dokumentace konkrétní nabízené varianty; neodhadujte podle fotografie.</p></article>
<article class="zp-decision-card"><h3>3. Hledejte překážky po celé trase</h3><p>Zkontrolujte obruče, kola, opěrky, dveřní kliky a vyčnívající předměty. Měření zopakujte v místech, kde se skutečně nacházejí části vozíku. Průchod nemusí být stejně široký v každé výšce.</p></article>
<article class="zp-decision-card"><h3>4. Počítejte s otevíráním a zatáčením</h3><p>Za dveřmi může být krátká chodba, roh nebo nábytek. Samotný číselný rozdíl šířek neříká nic o prostoru pro otočení, úhlu nájezdu ani o tom, kdo a jak dveře otevře.</p></article>
<article class="zp-decision-card"><h3>5. Prověřte práh a podlahu</h3><p>Zapište práh, sklon a nerovnosti před dveřmi i za nimi. Bezpečné překonání závisí na konkrétním vozíku a způsobu pohonu. Nezkoušejte s člověkem riskantní průjezd podle výsledku online výpočtu.</p></article>
<article class="zp-decision-card"><h3>6. Před pořízením ověřte praktický průjezd s odborníkem</h3><p>Je nutné samostatně ověřit manévrování, zastavení, přesun na vozík a dohled. Pokud člověk potřebuje fyzické zvedání, opakovaně padá nebo není jasné ovládání, je na místě individuální odborné posouzení.</p></article>
</div></div></section>
<section id="porovnani-sirek" class="zp-section"><div class="zp-wrap">
<p class="zp-kicker">Dobrovolný orientační přepočet</p>
<h2 class="zp-section-title">Je otvor alespoň širší než vozík?</h2>
<p>Zadejte <strong>vlastní naměřené údaje</strong> v centimetrech. Nejde o schválení vhodnosti, ani o univerzální bezpečnou rezervu.</p>
<form id="zp-doorway-check" class="zp-rental-budget" hidden>
<div class="zp-rental-budget-fields">
<label for="zp-door-clear-width"><strong>Skutečná volná šířka otevřených dveří (cm)</strong>
<input id="zp-door-clear-width" type="number" min="1" max="500" step="0.1" inputmode="decimal" placeholder="Změřeno mezi překážkami" required></label>
<label for="zp-chair-overall-width"><strong>Celková šířka konkrétní varianty vozíku (cm)</strong>
<input id="zp-chair-overall-width" type="number" min="1" max="500" step="0.1" inputmode="decimal" placeholder="Z dokumentace varianty" required></label>
</div>
<button class="zp-btn" type="submit">Orientačně porovnat šířky</button>
<p id="zp-doorway-result" class="zp-rental-budget-result" role="status" aria-live="polite" aria-atomic="true"></p>
</form>
<noscript><p class="zp-disclaimer">Bez JavaScriptu: odečtěte celkovou šířku vozíku od skutečné volné šířky průchodu. Nulový či záporný rozdíl nestačí ani fyzicky; kladný rozdíl nikdy automaticky nepotvrzuje bezpečné použití.</p></noscript>
<p class="zp-disclaimer"><strong>Důležité:</strong> i při kladném rozdílu je nutné zvlášť ověřit boční rezervu, zatáčení, práh, způsob pohonu, otevření dveří a bezpečnost přesunu. Přepočet není individuální posouzení, česká stavební norma ani záruka průjezdu.</p>
</div></section>
<section class="zp-section"><div class="zp-wrap">
<h2 class="zp-section-title">Co dál s naměřenými údaji?</h2>
<p>Sepište si nejužší průchod, celkovou šířku přesné varianty vozíku, práh, prostor pro otočení a způsob pomoci. Před konkrétní nabídkou je potřeba ověřit také sed, nosnost, ovládání a bezpečný přesun.</p>
<div class="zp-hero-actions">
<a class="zp-btn" href="<?php echo esc_url( home_url( '/invalidni-vozik/#poradce-vozik' ) ); ?>">Pokračovat poradcem vozíku</a>
<a class="zp-text-link" href="<?php echo esc_url( home_url( '/bezpecny-byt-pro-seniora/' ) ); ?>">Bezpečný byt</a>
<a class="zp-text-link" href="<?php echo esc_url( home_url( '/invalidni-vozik-na-pojistovnu/' ) ); ?>">Půjčit, koupit nebo ověřit úhradu</a>
</div>
<p class="zp-muted-copy">Metodická inspirace: <a href="https://www.access-board.gov/ada/guides/chapter-4-entrances-doors-and-gates/" target="_blank" rel="noopener">U.S. Access Board — skutečná průchozí šířka dveří a prostor pro manévrování</a> (ověřeno 16. 10. 2026). Americké pokyny nejsou automaticky použitelný český právní limit. Zápraží netvrdí univerzální schvalovací šířku a nenahrazuje odborné posouzení.</p>
</div></section>
</main>
<?php get_footer(); ?>
