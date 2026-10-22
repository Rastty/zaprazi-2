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
    if ( preg_match( '/\bsprch[a-z]*\b/', $query ) ) {
      return array(
        array( '/koupelna-a-wc/#poradce-koupelna', 'Poradce pro bezpečnější koupelnu', 'Madlo a sprchovací židle řeší odlišné potřeby. Ověřte možnost bezpečného úchopu a kotvení.' ),
        array( '/co-zmerit-v-koupelne-pred-vyberem-pomucky/#mereni-sprcha', 'Co ověřit ve sprše', 'Změřte prostor a ověřte podklad; samotné rozměry bezpečné kotvení nepotvrzují.' ),
      );
    }
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
