<?php
/* ZP_RELEASE_0_8_183 */
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
      <p class="zp-muted-copy">Pokud má být toaleta dočasně přímo vedle postele, <a class="zp-text-link" href="<?php echo esc_url( home_url( '/toaletni-zidle-vedle-postele/#sedm-kontrol-zidle-postel' ) ); ?>">nejdřív změřte prostor pro bezpečné umístění toaletní židle</a>, ne pouze její sedák.</p>
      <p class="zp-muted-copy">Při péči o ležícího člověka potřebujete umýt vlasy mimo koupelnu? <a class="zp-text-link" href="<?php echo esc_url( home_url( '/myti-vlasu-na-luzku/#vyber-myti-vlasu' ) ); ?>">Jak vybrat bezpečný způsob mytí vlasů na lůžku</a>. Nejprve ověřte bezpečnou polohu a potřebu pomoci.</p>
      <p class="zp-muted-copy">Po operaci kyčle nebo při omezeném ohýbání může být problém i oblékání dolní poloviny těla. <a class="zp-text-link" href="<?php echo esc_url( home_url( '/oblekani-ponozek-a-kalhot-bez-ohybani/#podle-problemu-oblekani' ) ); ?>">Jak připravit oblékání ponožek a kalhot doma</a>.</p>
      <p class="zp-muted-copy">Před návratem člověka, který nezvládne koupelnu, domluvte také způsob hygieny na lůžku. <a class="zp-text-link" href="<?php echo esc_url( home_url( '/hygiena-leziciho-seniora-doma/#vyber-hygieny-na-luzku' ) ); ?>">Sedm kroků hygieny a kontrolní seznam</a>.</p>
      <p class="zp-muted-copy">Je cesta domů obtížná kvůli nastupování člověka na sedadlo, nikoliv jen kvůli převozu pomůcek? <a class="zp-text-link" href="<?php echo esc_url( home_url( '/nastupovani-seniora-do-auta/#situace-nastupovani-auto' ) ); ?>">Jak bezpečně nastoupit a vystoupit z auta</a>.</p>
      <p class="zp-muted-copy"><strong>Potřebujete zajistit dopravu na kontrolu nebo z nemocnice domů?</strong> <a class="zp-text-link" href="<?php echo esc_url( home_url( '/prevoz-seniora-k-lekari/#vyber-dopravy' ) ); ?>">Rozdíl mezi lékařem indikovaným zdravotním transportem, vlastním autem a přepravou s vozíkem</a>. Úhradu vždy posuzuje lékař podle zdravotního stavu.</p>
      <div class="zp-hero-actions">
        <a class="zp-btn" href="#plan-navratu">Připravit plán návratu</a>
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/otazky-pred-propustenim-z-nemocnice/' ) ); ?>">Sedm otázek k vytištění před propuštěním</a>
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
        <article class="zp-decision-card"><h3>1. Vstup a přesun</h3><p>Člověk se musí bezpečně dostat domů a mezi postelí, židlí a WC. Pokud je k tomu potřeba fyzické zvedání druhou osobou, nejdřív řešíme transfer. <a class="zp-text-link" href="<?php echo esc_url( home_url( '/senior-nemuze-vstat-z-postele/#presun-z-postele-na-vozik' ) ); ?>">Sedm otázek, když doma nezvládáte přesun z postele</a>.</p></article>
        <article class="zp-decision-card"><h3>2. WC a postel</h3><p>Tyto dvě věci musí fungovat hned první den. Koupelnu lze v některých situacích bezpečně dořešit následně.</p><p>Ještě před propuštěním vyjasněte hlavně noční přesun. <a class="zp-text-link" href="<?php echo esc_url( home_url( '/otazky-pred-propustenim-z-nemocnice/#wc-prvni-noc' ) ); ?>">Co se zeptat na cestu k WC první noc</a>.</p></article>
        <article class="zp-decision-card"><h3>3. Návazná péče</h3><p>NZIP doporučuje řešit domácí zdravotní péči už při plánování propuštění. Nemocniční lékař ji může po hospitalizaci indikovat na 14 dní.</p></article>
      </div>
      <p class="zp-muted-copy">Zdravotní domácí péče není totéž co pečovatelská služba. <a class="zp-text-link" href="#domaci-zdravotni-pece-nebo-pecovatelska-sluzba">Rozlišit zdravotní péči, pečovatelskou službu a osobní asistenci</a>.</p>
      <p class="zp-muted-copy">Zdroj: Národní zdravotnický informační portál (Ministerstvo zdravotnictví), „Domácí péče“.</p>
      <a class="zp-text-link" href="https://www.nzip.cz/clanek/209-domaci-pece" target="_blank" rel="noopener">Ověřit informace o domácí péči</a>
    </div>
  </section>


  <section id="domaci-zdravotni-pece-nebo-pecovatelska-sluzba" class="zp-section zp-section-soft" aria-labelledby="domaci-pece-sluzby-nadpis">
    <div class="zp-wrap">
      <p class="zp-kicker">Když rodina potřebuje pomoc doma</p>
      <h2 id="domaci-pece-sluzby-nadpis" class="zp-section-title">Domácí zdravotní péče, pečovatelská služba, nebo osobní asistence: co vlastně potřebujeme?</h2>
      <p>Po propuštění z nemocnice může být potřeba pomoc zdravotní sestry, pravidelná pomoc s hygienou nebo delší dohled v domácnosti. <strong>Jde o odlišné služby.</strong> Předepsaná domácí zdravotní péče není automaticky pomoc s úklidem a pečovatelská služba nenahrazuje zdravotnické ošetření. Rodina někdy potřebuje více forem pomoci současně.</p>
      <div class="zp-decision-grid">
        <article class="zp-decision-card">
          <p class="zp-kicker">Zdravotní úkony doma</p>
          <h3>Domácí zdravotní péče (home care)</h3>
          <p>Je určená pro odborné zdravotní úkony, například ošetřování ran nebo další péči podle indikace lékaře. <strong>Předpis a rozsah určuje lékař</strong>; u splněných podmínek je zdravotní péče hrazena z veřejného zdravotního pojištění. Nemocniční ošetřující lékař ji může po hospitalizaci indikovat na 14 dní; pokračování se řeší s praktickým lékařem.</p>
          <p><strong>První otázka v nemocnici:</strong> „Potřebujeme domácí zdravotní sestru? Je vystavená indikace, kdo zajistí poskytovatele a od kdy?“</p>
          <p><a class="zp-text-link" href="https://www.nzip.cz/clanek/209-domaci-pece" target="_blank" rel="noopener noreferrer">NZIP: kdo domácí zdravotní péči předepisuje</a></p>
        </article>
        <article class="zp-decision-card">
          <p class="zp-kicker">Praktická pomoc v běžném dni</p>
          <h3>Terénní pečovatelská služba</h3>
          <p>Pomáhá s běžnými činnostmi, jako je hygiena, jídlo, nákup nebo péče o domácnost, v domluvených časech. Jde o <strong>sociální službu za úhradu</strong>, nikoli o sesterskou zdravotní péči placenou automaticky zdravotní pojišťovnou. Dostupnost hodin a konkrétních úkonů ověřte u registrovaného poskytovatele.</p>
          <p><strong>První otázka pro službu:</strong> „Můžete k nám docházet ve dnech a hodinách, kdy rodina nemůže pomáhat? Co přesně zajistíte a kolik to stojí?“</p>
          <p><a class="zp-text-link" href="https://mpsv.gov.cz/pece-a-sluzby" target="_blank" rel="noopener noreferrer">MPSV: pečovatelská služba a další možnosti</a></p>
        </article>
        <article class="zp-decision-card">
          <p class="zp-kicker">Delší a pružnější přítomnost</p>
          <h3>Osobní asistence</h3>
          <p>Je sociální služba pro člověka, který potřebuje pomoc v běžném životě ve větším nebo pružnějším rozsahu. Neznamená automaticky zajištěnou nepřetržitou péči: <strong>skutečné časy, kapacitu a cenu je nutné domluvit</strong> s konkrétním poskytovatelem.</p>
          <p><strong>První otázka:</strong> „Kdo bude s člověkem v době, kdy rodina není doma, a umíte pokrýt ráno, večer, víkend či noc?“</p>
          <p><a class="zp-text-link" href="https://mpsv.gov.cz/pece-a-sluzby" target="_blank" rel="noopener noreferrer">MPSV: kdy přichází v úvahu osobní asistence</a></p>
        </article>
      </div>
      <div class="zp-system-empty">
        <h3>Potřebujeme službu, ale žádná není domluvená</h3>
        <p><strong>Před propuštěním to řekněte zdravotnickému týmu.</strong> Požádejte o nemocničního sociálního pracovníka a o plán bezpečného zajištění potřebných přesunů, stravy, hygieny a případné zdravotní péče. Nezaměňujte potvrzené přijetí služby s pouhým kontaktem na poskytovatele.</p>
        <p>Pokud už jste doma, obraťte se na sociální odbor obce s rozšířenou působností nebo krajskou poradnu pro pečující. Ověřte poskytovatele ve veřejném registru MPSV. Při akutním ohrožení života či zdraví řešte nejprve zdravotnickou pomoc na lince 155, nikoli hledání pečovatelské služby.</p>
      </div>
      <h3>Šest kroků k zajištění pomoci doma</h3>
      <ol class="zp-guide-steps">
        <li><strong>Sepište potřebné úkony, ne diagnózy.</strong> Zdravotní ošetření, hygiena, jídlo, přesuny, doprovod, úklid, večerní či noční přítomnost.</li>
        <li><strong>Označte, co musí fungovat hned první noc.</strong> Bezpečný přesun, WC, možnost přivolat pomoc a zajištěná nezbytná péče mají přednost před běžnými nákupy.</li>
        <li><strong>Domluvte zdravotní část s lékařem.</strong> Zeptejte se na indikaci domácí zdravotní péče, konkrétního poskytovatele, začátek a následné pokračování.</li>
        <li><strong>Sociální část řešte se sociálním pracovníkem.</strong> Najděte registrované terénní služby, ověřte působnost, volnou kapacitu, rozsah, cenu a smluvní podmínky.</li>
        <li><strong>Prověřte příspěvek na péči.</strong> Je určený lidem splňujícím zákonné podmínky dlouhodobé závislosti na pomoci jiné osoby, nikoli automaticky každému po hospitalizaci. <a class="zp-text-link" href="https://mpsv.gov.cz/up-cz/prispevek-na-peci" target="_blank" rel="noopener noreferrer">Úřad práce: podmínky příspěvku na péči</a>.</li>
        <li><strong>Zapište konkrétní odpovědnost.</strong> Kdo přijde, kdy, na jaký úkon, kdo otevře dveře a komu volat, pokud sjednaná pomoc nepřijde. Plán nemusíte zadávat na web.</li>
      </ol>
      <h3>Odpovědi na otázky rodin</h3>
      <div class="zp-faq">
        <details><summary>Zaplatí zdravotní pojišťovna pečovatelku na pomoc s hygienou a nákupy?</summary><p>Běžná pečovatelská služba je sociální, nikoliv zdravotní služba. Je zpravidla za úhradu uživatele; podle individuálních podmínek lze k její úhradě využít příspěvek na péči. Hrazená domácí zdravotní péče je naopak určena pro indikované zdravotní výkony.</p></details>
        <details><summary>Stačí, že nám nemocnice dala telefonní číslo pečovatelské služby?</summary><p>Ne. Kontakt neznamená potvrzený termín, dostupnou kapacitu ani dohodnutý rozsah. Před odchodem domů ověřte, kdo potřebnou pomoc skutečně poskytne a co dělat, pokud ji zatím zajistit nelze.</p></details>
        <details><summary>Kde hledat důvěryhodného poskytovatele?</summary><p>U sociálních služeb využijte <a href="https://mpsv.gov.cz/pro-verejnost" target="_blank" rel="noopener noreferrer">informace MPSV o registru poskytovatelů</a> nebo sociální odbor obce. Dostupnost, aktuální cenu i přesný rozsah potvrzuje přímo vybraný poskytovatel. Se zdravotní domácí péčí pomáhá předepisující lékař.</p></details>
      </div>
      <p class="zp-muted-copy">Zdroje ověřeny 28. 10. 2026: <a class="zp-text-link" href="https://mpsv.gov.cz/pece-a-sluzby" target="_blank" rel="noopener noreferrer">MPSV — Péče a služby</a>, <a class="zp-text-link" href="https://www.nzip.cz/clanek/209-domaci-pece" target="_blank" rel="noopener noreferrer">NZIP — Domácí péče</a>, <a class="zp-text-link" href="https://www.vzp.cz/o-nas/tiskove-centrum/otazky-tydne/kdo-ma-narok-na-hrazenou-domaci-peci" target="_blank" rel="noopener noreferrer">VZP — hrazená domácí péče</a> a <a class="zp-text-link" href="https://mpsv.gov.cz/up-cz/prispevek-na-peci" target="_blank" rel="noopener noreferrer">ÚP — příspěvek na péči</a>. Neuvádíme neověřené lokální kapacity, ceny ani individuální nárok. Nezávislá odborná revize obsahu zatím není doložena.</p>
      <div class="zp-hero-actions">
        <a class="zp-btn" href="<?php echo esc_url( home_url( '/otazky-pred-propustenim-z-nemocnice/#socialni-a-zdravotni-sluzby' ) ); ?>">Otázky pro nemocnici a sociálního pracovníka</a>
        <a class="zp-text-link" href="#plan-navratu">Sestavit plán první noci doma</a>
      </div>
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
        <a class="zp-text-link" href="<?php echo esc_url( home_url( '/nocni-cesta-z-postele-na-wc/' ) ); ?>">Sedm bodů noční cesty na WC</a>
      </div>
    </div>
  </section>

  <section class="zp-section zp-section-dark">
    <div class="zp-wrap">
      <p class="zp-kicker zp-kicker-light">Pomůcky po propuštění</p>
      <h2 class="zp-section-title">Půjčovna, ePoukaz a běžný nákup jsou tři odlišné cesty.</h2>
      <p>Má člověk při návratu domů používat speciální antidekubitní matraci? <a class="zp-text-link" href="<?php echo esc_url( home_url( '/antidekubitni-matrace-na-polohovaci-postel/#pracovni-list-matrace' ) ); ?>">Připravte sedm údajů pro pečující tým a ověřte kompatibilitu celé postele</a> dříve než objednáte vybavení.</p>
      <p>Má být součástí návratu domů cesta autem se skládacím invalidním vozíkem? Nejdřív vyřešte bezpečné nastoupení a převážení prázdného vozíku. <a class="zp-text-link" href="<?php echo esc_url( home_url( '/invalidni-vozik-do-auta/#mereni-kufru-vozik' ) ); ?>">Změřit kufr auta, složený vozík a možnosti bezpečného naložení</a>.</p>
      <p>Od 1. ledna 2026 je standardem elektronický ePoukaz na zdravotnické prostředky. To ale neznamená, že každý retail produkt lze automaticky vydat nebo proplatit přes pojišťovnu.</p>
      <p>Zápraží proto nejdřív řeší praktickou potřebu a až následně vede do samostatného poradce pro konkrétní kategorii.</p>
      <p>Pokud ještě neznáte pokyny nemocničního týmu, začněte <a class="zp-text-link" href="<?php echo esc_url( home_url( '/otazky-pred-propustenim-z-nemocnice/' ) ); ?>">seznamem otázek před propuštěním</a>. Tento poradce řeší až praktický plán domácnosti.</p>
      <p>Teprve když je jasný bezpečný typ a potřebné parametry pomůcky, lze porovnat cesty pořízení: <a class="zp-text-link" href="<?php echo esc_url( home_url( '/pujceni-choditka/' ) ); ?>">půjčení chodítka</a>, <a class="zp-text-link" href="<?php echo esc_url( home_url( '/polohovaci-postel-na-pojistovnu/' ) ); ?>">půjčení nebo úhradu polohovací postele</a> či <a class="zp-text-link" href="<?php echo esc_url( home_url( '/invalidni-vozik-na-pojistovnu/' ) ); ?>">půjčení nebo úhradu vozíku</a>. U všech tří kategorií jde o samostatné podmínky, nikoli o jeden univerzální nárok.</p>
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

  <section id="navrat-domu-dalsi-problemy" class="zp-section zp-section-soft">
    <div class="zp-wrap">
      <p class="zp-kicker">Po návratu domů</p>
      <h2 class="zp-section-title">Co když se objeví problém, který v nemocnici nikdo neřešil?</h2>
      <p>První dny mohou ukázat překážky, které se při propuštění nečekaly. Začněte bezpečností a praktickým rozhovorem, ne nákupem další pomůcky.</p>
      <div class="zp-decision-grid">
        <article class="zp-decision-card"><h3>Odmítá chodítko</h3><p>Nenutit do chůze se špatně zvolenou pomůckou. Nejdřív ověřit důvod a bezpečnost.</p><p><a class="zp-text-link" href="<?php echo esc_url( home_url( '/senior-odmita-choditko/#sedm-kroku-bez-natlaku' ) ); ?>">Sedm kroků pro rodinu</a></p></article>
        <article class="zp-decision-card"><h3>Odmítá sprchování</h3><p>Zachovat důstojnost, vyhodnotit přesun, nabídnout bezpečnou alternativu hygieny.</p><p><a class="zp-text-link" href="<?php echo esc_url( home_url( '/senior-odmita-koupani/#vyber-hygieny-bez-sprchy' ) ); ?>">Alternativy koupání bez nátlaku</a></p></article>
        <article class="zp-decision-card"><h3>Téměř nepije</h3><p>Rozlišit obtížný úchop od rizika dehydratace a poruchy polykání.</p><p><a class="zp-text-link" href="<?php echo esc_url( home_url( '/senior-malo-pije/#varovne-priznaky-malo-pije' ) ); ?>">Kdy pomoci doma a kdy volat lékaře</a></p></article>
        <article class="zp-decision-card"><h3>Zůstává doma sám</h3><p>Domluvit reakci na nouzové volání ještě před první nocí bez doprovodu.</p><p><a class="zp-text-link" href="<?php echo esc_url( home_url( '/senior-doma-sam-sos-pomoc/#jak-funguje-pomoc-sos' ) ); ?>">Kdo opravdu přijme SOS volání</a></p></article>
      </div>
    </div>
  </section>
</main>
<?php get_footer(); ?>
