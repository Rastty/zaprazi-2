<?php
/* ZP_RELEASE_0_8_26 */
/*
Template Name: Zápraží — Ochrana soukromí
*/
get_header();
?>
<main id="main-content" tabindex="-1">
  <section class="zp-hero">
    <div class="zp-wrap">
      <p class="zp-kicker">Zápraží · Transparentnost</p>
      <h1>Ochrana soukromí a měření návštěvnosti.</h1>
      <p class="zp-lead">Domácí poradce je navržený tak, aby praktické odpovědi zůstaly v otevřené stránce. Volitelné Google Analytics načítáme až po výslovném souhlasu.</p>
    </div>
  </section>

  <section class="zp-section zp-section-soft">
    <div class="zp-wrap zp-method-grid">
      <div>
        <p class="zp-kicker">Domácí poradce</p>
        <h2 class="zp-section-title">Odpovědi neposíláme do analytiky.</h2>
        <p>Volby jako prostředí, potřebná míra opory, schopnost ovládat brzdy nebo nadzvednout chodítko používá prohlížeč pouze k výpočtu výsledku poradce.</p>
        <p>Tyto odpovědi nejsou součástí URL, neposílají se jako formulář na server a analytický adaptér k nim nemá přístup.</p>
      </div>

      <div class="zp-trust-list">
        <div><strong>Neukládáme profil</strong><span>Poradce nevytváří účet ani trvalý zdravotní profil.</span></div>
        <div><strong>Bez odpovědí v GA4</strong><span>Do Google Analytics neposíláme odpovědi z poradce ani odvozený profil.</span></div>
        <div><strong>Bez produktového ID</strong><span>Generické funnel eventy neobsahují doporučený produkt ani obchodníka.</span></div>
        <div><strong>Bez volného zdravotního textu</strong><span>Poradce v Mobility v1 nevyžaduje zadávání diagnózy ani volného zdravotního popisu.</span></div>
      </div>
    </div>
  </section>

  <section class="zp-section">
    <div class="zp-wrap">
      <p class="zp-kicker">Volitelné měření</p>
      <h2 class="zp-section-title">Google Analytics se nenačte, dokud ho nepovolíte.</h2>

      <div class="zp-decision-grid">
        <article class="zp-decision-card">
          <h3>Bez souhlasu</h3>
          <p>Zápraží nenačítá knihovnu Google Analytics a neposílá jí návštěvu ani události poradce.</p>
        </article>
        <article class="zp-decision-card">
          <h3>Po souhlasu</h3>
          <p>Používáme existující GA4 stream Zápraží pro základní návštěvnost a několik obecných kroků funnelu. Google Analytics může standardně pracovat s first-party identifikátory a technickými informacemi o návštěvě.</p>
        </article>
        <article class="zp-decision-card">
          <h3>Souhlas lze změnit</h3>
          <p>Ve footeru je vždy odkaz <strong>Nastavení měření</strong>. Při odvolání souhlasu se při dalším načtení Google Analytics už nespustí.</p>
        </article>
      </div>
    </div>
  </section>

  <section class="zp-section zp-section-dark">
    <div class="zp-wrap">
      <p class="zp-kicker zp-kicker-light">Co můžeme měřit po souhlasu</p>
      <h2 class="zp-section-title">Jen obecné kroky, ne obsah odpovědí.</h2>
      <div class="zp-acquire-grid">
        <article><h3>Návštěva stránky</h3><p>Základní page view po udělení souhlasu.</p></article>
        <article><h3>Spuštění poradce</h3><p><code>builder_start</code></p></article>
        <article><h3>Dokončení poradce</h3><p><code>builder_complete</code></p></article>
        <article><h3>Zobrazení doporučení</h3><p><code>recommendation_view</code></p></article>
        <article><h3>Klik na produkt</h3><p><code>product_click</code></p></article>
        <article><h3>Klik k obchodníkovi</h3><p><code>merchant_click</code></p></article>
      </div>
      <p class="zp-disclaimer">U těchto událostí Zápraží předává pouze název události. Neobsahují odpovědi z poradce, produktové ID, merchant ID ani odvozený profil.</p>
    </div>
  </section>

  <section class="zp-section">
    <div class="zp-wrap zp-method-grid">
      <div>
        <p class="zp-kicker">Technické nastavení</p>
        <h2 class="zp-section-title">Měření bez reklamní personalizace.</h2>
        <p>Zápraží v aktuální implementaci vypíná Google Signals a signály pro personalizaci reklam. Měření používáme pro pochopení, zda lidé poradce dokončí a zda se dostanou k užitečnému dalšímu kroku.</p>
        <p>Volba souhlasu se ukládá v prohlížeči pod klíčem <code>zaprazi_analytics_consent_v1</code>, aby web věděl, zda má Google Analytics načíst.</p>
      </div>

      <aside class="zp-resource-callout">
        <h3>Google Analytics obecně</h3>
        <p>Podle dokumentace Google může standardní GA4 po načtení pracovat se statistikami relací, přibližnou geolokací a informacemi o prohlížeči a zařízení. GA4 používá také first-party cookie <code>_ga</code> k rozlišení uživatelů a relací.</p>
        <p>Zápraží proto Google Analytics spouští až po vašem souhlasu.</p>
        <a class="zp-link-btn" href="https://support.google.com/analytics/answer/6004245?hl=cs" target="_blank" rel="noopener">Ochrana dat v Google Analytics</a>
      </aside>
    </div>
  </section>

  <section class="zp-section zp-section-soft">
    <div class="zp-wrap">
      <p class="zp-kicker">Změna volby</p>
      <h2 class="zp-section-title">Měření můžete kdykoli povolit nebo odmítnout.</h2>
      <p>Na každé stránce použijte ve footeru tlačítko <strong>Nastavení měření</strong>. Pokud jste měření dříve povolili a následně ho odmítnete, Zápraží odstraní dostupné cookies začínající <code>_ga</code> a stránku načte znovu bez Google Analytics.</p>
      <p>Pokud chcete odstranit další lokální data webu, můžete je kdykoli smazat také v nastavení svého prohlížeče.</p>
    </div>
  </section>
</main>
<?php get_footer(); ?>
