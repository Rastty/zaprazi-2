<?php get_header(); ?>
<main id="main-content" class="zp-wrap zp-archive zp-recovery-page" tabindex="-1">
  <header class="zp-archive-header">
    <p class="zp-kicker">Stránka nenalezena · 404</p>
    <h1>Odkaz už nevede na dostupnou stránku.</h1>
    <p>Adresa může obsahovat chybu nebo může vést na dřívější článek, který už není součástí Zápraží. Starý obsah o energetice a stavebnictví jsme vyřadili, abychom se mohli soustředit na bezpečnější a samostatnější život doma.</p>
    <p>Nechceme vás přesměrovat na nesouvisející článek. Pokud řešíte praktickou pomoc seniorovi nebo jeho blízkým, můžete pokračovat některou z následujících cest.</p>
    <div class="zp-hero-actions">
      <a class="zp-btn" href="<?php echo esc_url( home_url( '/' ) ); ?>">Přejít na úvod Zápraží</a>
      <a class="zp-text-link" href="<?php echo esc_url( home_url( '/#poradce' ) ); ?>">Spustit Domácího poradce</a>
    </div>
  </header>

  <section class="zp-search-guidance" aria-labelledby="zp-recovery-title">
    <h2 id="zp-recovery-title">S čím vám můžeme pomoci?</h2>
    <div class="zp-decision-grid">
      <article class="zp-decision-card">
        <h3><a href="<?php echo esc_url( home_url( '/choditka-pro-seniory/' ) ); ?>">Chůze a opora</a></h3>
        <p>Jaký typ chodítka nebo rollátoru stojí za zvážení a co před výběrem změřit.</p>
      </article>
      <article class="zp-decision-card">
        <h3><a href="<?php echo esc_url( home_url( '/koupelna-a-wc/' ) ); ?>">Koupelna a WC</a></h3>
        <p>Sprchování, vstávání z WC, vhodné opory a bezpečné přesuny doma.</p>
      </article>
      <article class="zp-decision-card">
        <h3><a href="<?php echo esc_url( home_url( '/bezpecny-byt-pro-seniora/' ) ); ?>">Bezpečnější byt</a></h3>
        <p>Co zkontrolovat u prahů, osvětlení, cesty na WC a dalších rizikových míst.</p>
      </article>
      <article class="zp-decision-card">
        <h3><a href="<?php echo esc_url( home_url( '/navrat-z-nemocnice/' ) ); ?>">Návrat z nemocnice</a></h3>
        <p>Co potřebuje rodina připravit na první noc doma a kdy si vyžádat odbornou pomoc.</p>
      </article>
    </div>
    <p>Našli jste starý odkaz na jiné téma? Původní technický obsah už zde nenabízíme; jeho nahrazení nesouvisejícím zdravotním návodem by nebylo fér.</p>
  </section>
</main>
<?php get_footer(); ?>
