<?php
/**
 * Contextual search rescue for the old mixed-topic Zápraží archive.
 * Only static, approved internal destinations; search terms never enter a
 * recommendation, tracking, merchant URL, or persistent profile.
 *
 * Call with lower-case ASCII words separated by spaces.
 */
function zaprazi_2_search_guidance_for_query( $query ) {
  if ( ! is_string( $query ) || '' === $query ) {
    return array();
  }
  $query = substr( $query, 0, 160 );

  // A caregiver asking about lifting a person between bed and wheelchair
  // needs transfer-risk assessment before a wheelchair or bed product.
  // Do not match "zvedaci postel" or "zvedaci kreslo": those are product
  // questions, not a request to lift or move a person.
  $transfer_verb = preg_match( '/\\b(?:presun[a-z]*|premist[a-z]*|prenas[a-z]*|zved(?:an[a-z]*|nut[a-z]*|nout|at|am|ame|ani))\\b/', $query );
  $transfer_bed = preg_match( '/\\b(?:postel[a-z]*|luzk[a-z]*)\\b/', $query );
  $transfer_person_or_destination = preg_match( '/\\b(?:vozik[a-z]*|zidl[a-z]*|wc|toalet[a-z]*|senior[a-z]*|mamink[a-z]*|tatink[a-z]*|babic[a-z]*|ded[a-z]*|rodic[a-z]*|osob[a-z]*|clovek[a-z]*)\\b/', $query );
  if ( $transfer_verb && $transfer_bed && $transfer_person_or_destination ) {
    return array(
      array( '/senior-nemuze-vstat-z-postele/#presun-z-postele-na-vozik', 'Nezvládáme přesun z postele: co bezpečně ověřit', 'Nezkoušejte neověřené zvedání. Nejprve určete s odborníkem bezpečný způsob přesunu a potřebnou asistenci.' ),
      array( '/senior-nemuze-vstat-z-postele/#co-delat-postel', 'Kde přesně vstávání nebo přesun selhává?', 'Rozlišit posazení, postavení, rovnováhu a přesun; pomůcka sama neřeší všechny kroky.' ),
      array( '/invalidni-vozik/#poradce-vozik', 'Na co myslet u invalidního vozíku', 'Vozík musí odpovídat i přesunu, sedu, brzdám a skutečným průchodům. Nákup až po ověření.' ),
    );
  }

  // Healthcare provided on a physician's indication and paid social support
  // are different services. Capture these intents before generic hospital
  // queries and avoid misleading visitors into product recommendations.
  if ( preg_match( '/\\b(?:domac[a-z]*\\s+(?:(?:zdravotn[a-z]*|osetrovatelsk[a-z]*)\\s+)?pec[ei]|pecovatelsk[a-z]*\\s+sluzb[a-z]*|osobn[a-z]*\\s+asistenc[a-z]*|zdravotn[a-z]*\\s+pec[ei]\\s+doma)\\b/', $query ) ) {
    return array(
      array( '/navrat-z-nemocnice/#domaci-zdravotni-pece-nebo-pecovatelska-sluzba', 'Domácí zdravotní péče, pečovatelská služba, nebo osobní asistence?', 'Odlište zdravotní úkony od pomoci s hygienou, jídlem či dohledem a zjistěte, kdo službu skutečně zajistí.' ),
      array( '/otazky-pred-propustenim-z-nemocnice/#socialni-a-zdravotni-sluzby', 'Otázky pro lékaře a sociálního pracovníka', 'Zeptejte se na indikaci zdravotní péče, dostupnou kapacitu sociální služby a bezpečný plán po propuštění.' ),
      array( '/navrat-z-nemocnice/#plan-navratu', 'Plán na první noc doma', 'Ověřte vstup, přesuny, WC, postel a to, kdo potřebnou pomoc opravdu poskytne.' ),
    );
  }

  // Walking stick and forearm crutch are not interchangeable with a walker.
  // Explicit stick/crutch questions should reach the safety comparison
  // before generic walker advice.
  if ( preg_match( '/\\b(?:hul|hole|holi|berl[a-z]*)\\b/', $query ) ) {
    return array(
      array( '/choditka-pro-seniory/#hul-nebo-choditko', 'Hůl, francouzská berle, nebo chodítko?', 'Porovnejte druhy opory, jejich omezení a situace, kdy musí vhodnost posoudit odborník.' ),
      array( '/choditka-pro-seniory/#vyber-typu', 'Jaký typ chodítka stojí za zvážení?', 'Pevné, dvoukolové a čtyřkolové modely vyžadují rozdílné ovládání a odpovídající schopnosti.' ),
      array( '/co-zmerit-pred-vyberem-choditka/#co-zmerit', 'Co změřit před výběrem pomůcky', 'Zkontrolujte výšku opory, šířku průchodů a prostor; rozměry samotné nepotvrzují bezpečnost.' ),
    );
  }

  // A request for a grab bar near a bath/shower is not a request for a
  // seat. Avoid routing it to the product-specific seat/chair Advisors.
  // If the user explicitly mentions a chair or a seat, the usual product
  // intent rules below remain authoritative.
  $grip_intent = preg_match( '/\b(?:madl[a-z]*|opor[a-z]*|drzadl[a-z]*)\b/', $query );
  $seat_intent = preg_match( '/\b(?:zidl[a-z]*|sedatk[a-z]*)\b/', $query );
  if ( $grip_intent && ! $seat_intent ) {
    if ( preg_match( '/\bvan[a-z]*\b/', $query ) ) {
      return array(
        array( '/koupelna-a-wc/#poradce-koupelna', 'Poradce pro bezpečnější koupelnu', 'Madlo a sedátko do vany nejsou zaměnitelné. Nejdřív ověřte přesun a způsob bezpečného uchycení.' ),
        array( '/co-zmerit-v-koupelne-pred-vyberem-pomucky/#mereni-vana', 'Co ověřit u vany', 'Změřte prostor a ověřte podklad; samotné rozměry bezpečné kotvení nepotvrzují.' ),
      );
    }
    if ( preg_match( '/\b(?:sprch[a-z]*|sprs[a-z]*)\b/', $query ) ) {
      return array(
        array( '/koupelna-a-wc/#poradce-koupelna', 'Poradce pro bezpečnější koupelnu', 'Madlo a sprchovací židle řeší odlišné potřeby. Ověřte možnost bezpečného úchopu a kotvení.' ),
        array( '/co-zmerit-v-koupelne-pred-vyberem-pomucky/#mereni-sprcha', 'Co ověřit ve sprše', 'Změřte prostor a ověřte podklad; samotné rozměry bezpečné kotvení nepotvrzují.' ),
      );
    }
  }

  // Specific mobility-in-bed question takes precedence over generic bed purchase.
  // Do not recommend an unverified bed handle or rail as a merchant product.
  if ( preg_match( '/\b(?:vstav[a-z]*|vstan[a-z]*|vstat[a-z]*|madl[a-z]*|hrazd[a-z]*)\b.{0,55}\b(?:postel[a-z]*|luzk[a-z]*)\b|\b(?:postel[a-z]*|luzk[a-z]*)\b.{0,55}\b(?:vstav[a-z]*|vstan[a-z]*|vstat[a-z]*|madl[a-z]*|hrazd[a-z]*)\b/', $query ) ) {
    return array(
      array( '/senior-nemuze-vstat-z-postele/#co-delat-postel', 'Když člověk nevstane z postele', 'Rozlišit posazení, postavení, bezpečný přesun a typ opory bez neověřeného nákupu.' ),
      array( '/senior-nemuze-vstat-z-postele/#pomucky-k-posteli', 'Madlo, hrazda, nebo zábrana?', 'Tyto výrobky mají různý účel a rizika; ověřte kompatibilitu lůžka a matrace.' ),
      array( '/polohovaci-postel/#poradce-postel', 'Poradce pro polohovací postel', 'Pokud je vhodný tento typ zařízení, poradce prověří jeho parametry a bezpečnost.' ),
    );
  }

  // An actual fall is an urgent life-situation intent, not a product name.
  // Require an explicit person/home context so "spadl vykon" or "cerpadla"
  // cannot hijack unrelated historical archive searches.
  if (
    preg_match( '/\b(?:spadl[a-z]*|upadl[a-z]*|pad[a-z]*|zakopl[a-z]*)\b/', $query ) &&
    preg_match( '/\b(?:senior[a-z]*|babic[a-z]*|ded[a-z]*|mamink[a-z]*|tatink[a-z]*|rodic[a-z]*|clovek[a-z]*|osob[a-z]*|doma|bytu|chodbe)\b/', $query )
  ) {
    return array(
      array( '/senior-spadl-doma/#prvni-krok-pad', 'Senior spadl doma: co udělat hned', 'Nejdřív rozpoznat naléhavost a přivolat potřebnou pomoc. Výběr pomůcek až později.' ),
      array( '/senior-spadl-doma/#plan-po-padu', 'Sedm kroků po pádu pro rodinu', 'Praktický plán po zajištění bezpečí, včetně odborného posouzení a domácích rizik.' ),
      array( '/bezpecny-byt-pro-seniora/#audit-bytu', 'Prevence dalšího pádu doma', 'Prověřte překážky, osvětlení a nebezpečné přesuny v domácnosti.' ),
    );
  }

  // Specific seated-rollator intent must precede generic "choditko"
  // routing, but never hijack an unrelated bathtub seat query.
  if ( preg_match( '/\b(?:roll?ator[a-z]*|choditk[a-z]*)\b.{0,45}\bsedatk[a-z]*\b|\bsedatk[a-z]*\b.{0,45}\b(?:roll?ator[a-z]*|choditk[a-z]*)\b/', $query ) ) {
    return array(
      array( '/rollator-pro-seniory/#rollator-se-sedatkem', 'Rollátor se sedátkem: kdy je vhodný?', 'Bezpečné usedání, parkovací brzdy, skutečná trasa a rozdíl od přepravního vozíku.' ),
      array( '/rollator-pro-seniory/#poradce-rollator', 'Prověřit ruční brzdy v poradci', 'Nejdřív bezpečný způsob používání, teprve potom vhodný kandidát a způsob pořízení.' ),
      array( '/pujceni-choditka/#rozpocet-pujceni-choditka', 'Půjčení rollátoru: příklady nákladů', 'Půjčení porovnejte až po výběru vhodného typu; ceníky a dostupnost ověřte.' ),
    );
  }

  $groups = array(
    array( '/\btoalet[a-z]*\s+zidl[a-z]*\b/', array(
      array( '/toaletni-zidle-pro-seniory/#poradce-toaletni-zidle', 'Poradce pro toaletní židli', 'Nejdřív ověřte bezpečný přesun, stabilitu a prostor.' ),
      array( '/nocni-cesta-z-postele-na-wc/#nocni-audit', 'Noční cesta z postele na WC', 'Sedm praktických bodů před výběrem pomůcky.' ),
    ) ),
    array( '/\bnocn[a-z]*\b.*\b(?:wc|toalet[a-z]*)\b/', array(
      array( '/nocni-cesta-z-postele-na-wc/#nocni-audit', 'Kontrola noční cesty na WC', 'Projděte světlo, průchody, vstávání a bezpečný návrat.' ),
      array( '/toaletni-zidle-pro-seniory/#poradce-toaletni-zidle', 'Prověřit toaletní židli', 'Pouze pokud je bezpečný přesun možné zvládnout.' ),
    ) ),
    array( '/\bsprch[a-z]*\b/', array(
      array( '/sprchovaci-zidle-pro-seniory/#poradce-sprchovaci-zidle', 'Poradce pro sprchovací židli', 'Ověřte, zda je sed vhodné řešení, i rozměry a stabilitu.' ),
      array( '/koupelna-a-wc/#poradce-koupelna', 'Obecný poradce pro koupelnu', 'Rozliší problém u WC, sprchy i vany.' ),
      array( '/co-zmerit-v-koupelne-pred-vyberem-pomucky/#mereni-sprcha', 'Co změřit ve sprše', 'Připravte rozměry před kontrolou konkrétního výrobku.' ),
    ) ),
    array( '/\bvan[a-z]*\b/', array(
      array( '/sedatko-do-vany-pro-seniory/#poradce-sedatko-vana', 'Poradce pro sedátko do vany', 'Nejdřív prověřte přesun přes okraj a kompatibilitu.' ),
      array( '/co-zmerit-v-koupelne-pred-vyberem-pomucky/#mereni-vana', 'Co změřit u vany', 'Rozměry pomáhají při kontrole modelu, nejsou potvrzením bezpečnosti.' ),
    ) ),
    // Named WC aids outrank the generic bathroom route. A toilet seat riser
    // does not solve a missing handhold; wall bars require verified anchoring.
    array( '/\b(?:nastav(?:ec|c[a-z]*)|zvys[a-z]*)\b.{0,48}\b(?:wc|toalet[a-z]*)\b|\b(?:wc|toalet[a-z]*)\b.{0,48}\b(?:nastav(?:ec|c[a-z]*)|zvys[a-z]*)\b/', array(
      array( '/nastavec-na-wc-pro-seniory/#poradce-nastavec-wc', 'Poradce pro nástavec na WC', 'Vyšší sed pomůže jen při vhodné výšce, stabilitě a bezpečném přesunu.' ),
      array( '/co-zmerit-v-koupelne-pred-vyberem-pomucky/#mereni-wc', 'Co změřit u WC', 'Ověřte výšku sedu, tvar mísy, uchycení a prostor.' ),
      array( '/koupelna-a-wc/#poradce-koupelna', 'Nevíte, zda je problém ve výšce, nebo v opoře?', 'Obecný poradce rozliší různé situace u WC.' ),
    ) ),
    array( '/\b(?:madl[a-z]*|opor[a-z]*|ram[a-z]*)\b.{0,48}\b(?:wc|toalet[a-z]*)\b|\b(?:wc|toalet[a-z]*)\b.{0,48}\b(?:madl[a-z]*|opor[a-z]*|ram[a-z]*)\b|\bzachodov[a-z]*\s+madl[a-z]*\b/', array(
      array( '/madlo-k-wc-pro-seniory/#poradce-opora-wc', 'Poradce pro madlo a oporu u WC', 'Nejdřív ověřte místo úchopu, bezpečné kotvení nebo stabilitu samostatné opory.' ),
      array( '/co-zmerit-v-koupelne-pred-vyberem-pomucky/#mereni-wc', 'Co změřit u WC', 'Prověřte prostor pro vstávání a skutečný podklad pro uchycení.' ),
      array( '/koupelna-a-wc/#poradce-koupelna', 'Jde o nízké WC, nebo chybějící oporu?', 'Poradce pomůže odlišit různé příčiny potíží.' ),
    ) ),
    array( '/\b(?:wc|toalet[a-z]*|nastavc[a-z]*|madl[a-z]*|koupeln[a-z]*)\b/', array(
      array( '/koupelna-a-wc/#poradce-koupelna', 'Poradce pro koupelnu a WC', 'Vyberte, zda je problém v dosednutí, opoře, chůzi nebo hygieně.' ),
      array( '/co-zmerit-v-koupelne-pred-vyberem-pomucky/#vyberte-misto', 'Co doma změřit', 'Praktické rozměry pro WC, sprchu a vanu.' ),
      array( '/pomucky-do-koupelny-na-pojistovnu/', 'Pomůcky a zdravotní pojišťovna', 'Případnou úhradu ověřujte pro konkrétní prostředek.' ),
    ) ),
    array( '/\b(?:choditk[a-z]*|rolator[a-z]*|rollator[a-z]*|chuz[a-z]*)\b/', array(
      array( '/choditka-pro-seniory/', 'Poradce pro chůzi a chodítka', 'Rozliší potřebu opory a vhodný typ pomůcky.' ),
      array( '/co-zmerit-pred-vyberem-choditka/', 'Co změřit před výběrem chodítka', 'Průchody, výšku a použití ověřte před konkrétní nabídkou.' ),
      array( '/pujceni-choditka/', 'Půjčit, nebo koupit chodítko?', 'Délka používání ovlivní cestu pořízení.' ),
    ) ),
    array( '/\b(?:vozik[a-z]*|invalidn[a-z]*)\b/', array(
      array( '/invalidni-vozik/', 'Poradce pro invalidní vozík', 'Nejdřív vyjasněte praktický způsob používání a bezpečný přesun.' ),
      array( '/projede-invalidni-vozik-dvermi/', 'Projede vozík dveřmi?', 'Jak změřit průchod před výběrem modelu.' ),
      array( '/invalidni-vozik-na-pojistovnu/', 'Vozík a zdravotní pojišťovna', 'Oddělte schválený prostředek od maloobchodní nabídky.' ),
    ) ),
    array( '/\bkresl[a-z]*\b|\bvstav[a-z]*\b.{0,50}\bzidl[a-z]*\b|\bzidl[a-z]*\b.{0,50}\bvstav[a-z]*\b/', array(
      array( '/vstavani-z-kresla-pro-seniora/#jak-postupovat-kreslo', 'Senior nemůže vstát z křesla', 'Nejdřív bezpečný přesun, výška sedu a pevnost opěrek.' ),
      array( '/vstavani-z-kresla-pro-seniora/#mereni-kresla', 'Co změřit před výběrem křesla', 'Sedm kontrol před koupí i před odborným posouzením.' ),
      array( '/bezpecny-byt-pro-seniora/#audit-bytu', 'Prověřit bezpečnost bytu', 'Další rizika pádů, chůze a cesty z postele na WC.' ),
    ) ),
    array( '/\b(?:postel[a-z]*|luzk[a-z]*|polohovac[a-z]*)\b/', array(
      array( '/polohovaci-postel/', 'Poradce pro polohovací postel', 'Ověřte potřebu, rozměry, péči a způsob pořízení.' ),
      array( '/polohovaci-postel-na-pojistovnu/', 'Postel: půjčení, nákup a úhrada', 'Nejdřív zjistěte podmínky pro konkrétní řešení.' ),
    ) ),
    array( '/\b(?:nemocnic[a-z]*|propust[a-z]*|navrat[a-z]*)\b/', array(
      array( '/navrat-z-nemocnice/#plan-navratu', 'Plán návratu z nemocnice', 'Co připravit na první hodiny a noc doma.' ),
      array( '/otazky-pred-propustenim-z-nemocnice/', 'Otázky pro nemocniční tým', 'Praktický seznam před odchodem z oddělení.' ),
    ) ),
    array( '/\b(?:obuv[a-z]*|bot[a-z]*|chodidl[a-z]*)\b/', array(
      array( '/obuv-pro-seniory/', 'Poradce pro obuv', 'Praktická volba obuvi začíná potřebou a bezpečností.' ),
      array( '/jak-zmerit-chodidlo-pro-vyber-obuvi/', 'Jak změřit chodidlo', 'Co doma změřit, než vyberete velikost.' ),
    ) ),
    array( '/\b(?:sobestac[a-z]*|uchop[a-z]*)\b/', array(
      array( '/sobestacnost/', 'Poradce pro každodenní soběstačnost', 'Pomůcky vybírejte podle konkrétního úkonu doma.' ),
      array( '/bezpecny-byt-pro-seniora/', 'Audit bezpečného bytu', 'Projděte situaci v jednotlivých místnostech.' ),
    ) ),
    array( '/\b(?:schod[a-z]*|schodist[a-z]*|schodolez[a-z]*)\b/', array(
      array( '/schody-pro-seniora-doma/#plan-schody', 'Co dělat, když senior nezvládá schody', 'Nejdřív bezpečný přístup a sedm věcí, které ověřit před výběrem zařízení.' ),
      array( '/schody-pro-seniora-doma/#prispevek-schody', 'Schodišťová sedačka, plošina a příspěvek', 'Případný příspěvek ověřujte u Úřadu práce podle konkrétní situace.' ),
      array( '/bezpecny-byt-pro-seniora/#audit-bytu', 'Bezpečný domov bez zbytečných rizik', 'Prověřte i vstupní práh, WC, noční trasu a běžný pohyb doma.' ),
    ) ),
    array( '/\b(?:pojistov[a-z]*|epoukaz[a-z]*|uhrad[a-z]*)\b/', array(
      array( '/kompenzacni-pomucky-pro-seniory/#pojistovna', 'Jak ověřit úhradu pomůcky', 'Podmínky a nárok se liší podle konkrétního prostředku.' ),
      array( '/choditko-na-pojistovnu/', 'Chodítko na pojišťovnu', 'Aktuální postup a ověření v evidenci SÚKL.' ),
    ) ),
  );
  foreach ( $groups as $group ) {
    if ( preg_match( $group[0], $query ) ) {
      return $group[1];
    }
  }
  return array();
}
