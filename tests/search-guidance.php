<?php
// Read-only PHP regression: no WordPress network, database or personal information.
require_once __DIR__ . '/../src/seo/search-guidance.php';
function check_route($term,$first,$count) {
  $routes=zaprazi_2_search_guidance_for_query($term);
  if(count($routes)!==$count || ($routes[0][0]??'')!==$first) {
    fwrite(STDERR, "Unexpected guidance for ".$term."\n");
    exit(1);
  }
  foreach($routes as $route) {
    if(count($route)!==3||!str_starts_with($route[0],'/')||
       str_contains($route[0],'?')||str_contains($route[0],'//')||
       preg_match('/(?:ehub|awin|cj\.com|desturl|merchant)/i',implode(' ',$route))){
      fwrite(STDERR,"Unsafe guidance route for ".$term."\n");
      exit(1);
    }
  }
}
check_route('sprcha','/sprchovaci-zidle-pro-seniory/#poradce-sprchovaci-zidle',3);
check_route('koupelna','/koupelna-a-wc/#poradce-koupelna',3);
check_route('wc','/koupelna-a-wc/#poradce-koupelna',3);
// The new doctor-transport guide must be discoverable from natural searches,
// but never hijack unrelated transport, sanitation or maintenance queries.
foreach (array(
  'prevoz seniora k lekari',
  'prevoz maminky na vysetreni',
  'sanitka k doktorovi',
  'sanita na kontrolu',
  'odvoz tatinka do nemocnice',
  'zdravotnicka dopravni sluzba',
  'sanitni prevoz',
  'preprava pacienta',
  'doprava k lekari'
) as $term) {
  check_route($term, '/prevoz-seniora-k-lekari/#urgentni-situace-prevoz', 3);
  $paths=array_column(zaprazi_2_search_guidance_for_query($term),0);
  if($paths!==array(
    '/prevoz-seniora-k-lekari/#urgentni-situace-prevoz',
    '/prevoz-seniora-k-lekari/#vyber-dopravy',
    '/prevoz-seniora-k-lekari/#otazky-pro-lekare'
  )){
    fwrite(STDERR,"Wrong transport advice sequence for ".$term."\n");
    exit(1);
  }
}
foreach (array(
  'doprava na kontrolu kotle',
  'preprava zbozi do nemocnice',
  'odvoz odpadu z nemocnice',
  'sanitace vody',
  'sanitarni potrubi',
  'preprava baliku',
  'odvoz materialu',
  'doprava do skladu'
) as $unrelated) {
  $routes=zaprazi_2_search_guidance_for_query($unrelated);
  foreach ($routes as $route) {
    if(str_starts_with($route[0]??'', '/prevoz-seniora-k-lekari/')){
      fwrite(STDERR,"Unrelated transport matched medical guide: ".$unrelated."\n");
      exit(1);
    }
  }
}
// Care allowance queries must reach official forms before merchant advice.
foreach(array(
  'prispevek na peci',
  'prispevek na peci pro seniora',
  'zadost o prispevek na peci',
  'zvyseni prispevku na peci',
  'prispevek na peci po nemocnici',
  'peci prispevek',
  'socialni setreni prispevek'
) as $q) {
  check_route($q,'/prispevek-na-peci-pro-seniora/#zadost-krok-za-krokem',3);
}
foreach(array(
  'prispevek na choditko',
  'prispevek na pojistovnu',
  'prispevek na slunecni kolektor',
  'socialni setreni solarniho vykonu',
  'pecovatelska sluzba',
  'domaci zdravotni pece',
  'pojistovna na vozik'
) as $q) {
  foreach(zaprazi_2_search_guidance_for_query($q) as $route) {
    if(str_starts_with($route[0]??'','/prispevek-na-peci-pro-seniora/')){
      fwrite(STDERR,"Wrong care allowance intent: ".$q."\n");
      exit(1);
    }
  }
}
check_route('senior nestihne dojit na wc','/senior-nestihne-dojit-na-wc/#prvni-bezpecnost-wc',3);
check_route('babicka nestihne na zachod','/senior-nestihne-dojit-na-wc/#prvni-bezpecnost-wc',3);
check_route('nedojde na toaletu','/senior-nestihne-dojit-na-wc/#prvni-bezpecnost-wc',3);
check_route('nemuze dojit na wc','/senior-nestihne-dojit-na-wc/#prvni-bezpecnost-wc',3);
check_route('wc je daleko','/senior-nestihne-dojit-na-wc/#prvni-bezpecnost-wc',3);
check_route('nastavec na wc','/nastavec-na-wc-pro-seniory/#poradce-nastavec-wc',3);
check_route('wc nastavec','/nastavec-na-wc-pro-seniory/#poradce-nastavec-wc',3);
check_route('zvyseni wc','/nastavec-na-wc-pro-seniory/#poradce-nastavec-wc',3);
check_route('zvyseni toalety','/nastavec-na-wc-pro-seniory/#poradce-nastavec-wc',3);
check_route('madlo k wc','/madlo-k-wc-pro-seniory/#poradce-opora-wc',3);
check_route('wc madlo','/madlo-k-wc-pro-seniory/#poradce-opora-wc',3);
check_route('opora u wc','/madlo-k-wc-pro-seniory/#poradce-opora-wc',3);
check_route('toaletni ram','/madlo-k-wc-pro-seniory/#poradce-opora-wc',3);
check_route('zachodove madlo','/madlo-k-wc-pro-seniory/#poradce-opora-wc',3);
check_route('madlo','/koupelna-a-wc/#poradce-koupelna',3);
check_route('madlo do vany','/koupelna-a-wc/#poradce-koupelna',2);
check_route('vanove madlo','/koupelna-a-wc/#poradce-koupelna',2);
check_route('opora do vany','/koupelna-a-wc/#poradce-koupelna',2);
check_route('drzadlo do vany','/koupelna-a-wc/#poradce-koupelna',2);
check_route('madlo do sprchy','/koupelna-a-wc/#poradce-koupelna',2);
check_route('sprchove madlo','/koupelna-a-wc/#poradce-koupelna',2);
check_route('opora ve sprse','/koupelna-a-wc/#poradce-koupelna',2);
check_route('sprchovaci zidle s madly','/sprchovaci-zidle-pro-seniory/#poradce-sprchovaci-zidle',3);
check_route('sedatko do vany s madly','/sedatko-do-vany-pro-seniory/#poradce-sedatko-vana',2);
foreach (array(
  'madlo do vany'=>'/co-zmerit-v-koupelne-pred-vyberem-pomucky/#mereni-vana',
  'madlo do sprchy'=>'/co-zmerit-v-koupelne-pred-vyberem-pomucky/#mereni-sprcha'
) as $query=>$expectedMeasure) {
  $paths=array_column(zaprazi_2_search_guidance_for_query($query),0);
  if(($paths[1]??'')!==$expectedMeasure ||
     in_array('/sedatko-do-vany-pro-seniory/#poradce-sedatko-vana',$paths,true) ||
     in_array('/sprchovaci-zidle-pro-seniory/#poradce-sprchovaci-zidle',$paths,true) ||
     in_array('/madlo-k-wc-pro-seniory/#poradce-opora-wc',$paths,true)) {
    fwrite(STDERR,"Bathroom grip must not shortcut to unrelated products: ".$query."\n");
    exit(1);
  }
}
check_route('toaletni zidle s madly','/toaletni-zidle-pro-seniory/#poradce-toaletni-zidle',2);
foreach (array('madlo k wc'=>'/madlo-k-wc-pro-seniory/#poradce-opora-wc',
               'nastavec na wc'=>'/nastavec-na-wc-pro-seniory/#poradce-nastavec-wc') as $query=>$expected) {
  $routes=zaprazi_2_search_guidance_for_query($query);
  if(($routes[0][0]??'')!==$expected ||
     ($routes[1][0]??'')!=='/co-zmerit-v-koupelne-pred-vyberem-pomucky/#mereni-wc' ||
     ($routes[2][0]??'')!=='/koupelna-a-wc/#poradce-koupelna'){
    fwrite(STDERR,"Wrong specialist / measuring / fallback order: ".$query."\n");
    exit(1);
  }
}

check_route('vana','/sedatko-do-vany-pro-seniory/#poradce-sedatko-vana',2);
check_route('toaletni zidle','/toaletni-zidle-pro-seniory/#poradce-toaletni-zidle',2);
check_route('nocni cesta na wc','/nocni-cesta-z-postele-na-wc/#nocni-audit',2);
check_route('choditko','/choditka-pro-seniory/',3);
check_route('rollator','/choditka-pro-seniory/',3);
check_route('rollator se sedatkem','/rollator-pro-seniory/#rollator-se-sedatkem',3);
check_route('choditko se sedatkem','/rollator-pro-seniory/#rollator-se-sedatkem',3);
check_route('sedatko na rollator','/rollator-pro-seniory/#rollator-se-sedatkem',3);
check_route('sedatko do vany','/sedatko-do-vany-pro-seniory/#poradce-sedatko-vana',2);

check_route('vozik','/invalidni-vozik/',3);
check_route('polohovaci postel','/polohovaci-postel/',2);
check_route('nemocnice','/navrat-z-nemocnice/#plan-navratu',2);
check_route('schody','/schody-pro-seniora-doma/#plan-schody',3);
check_route('kreslo','/vstavani-z-kresla-pro-seniora/#jak-postupovat-kreslo',3);
check_route('zvedaci kreslo','/vstavani-z-kresla-pro-seniora/#jak-postupovat-kreslo',3);
check_route('polohovaci kreslo','/vstavani-z-kresla-pro-seniora/#jak-postupovat-kreslo',3);
check_route('vstavani ze zidle','/vstavani-z-kresla-pro-seniora/#jak-postupovat-kreslo',3);
check_route('toaletni zidle','/toaletni-zidle-pro-seniory/#poradce-toaletni-zidle',2);
check_route('sprchovaci zidle','/sprchovaci-zidle-pro-seniory/#poradce-sprchovaci-zidle',3);


// Searches for practical help must route to the relevant human-first guide,
// not jump to a product or service purchase. Query values here are already
// lower-case ASCII terms as normalized by search.php.
check_route('presun z postele na vozik','/senior-nemuze-vstat-z-postele/#presun-z-postele-na-vozik',3);
check_route('presun z voziku na postel','/senior-nemuze-vstat-z-postele/#presun-z-postele-na-vozik',3);
check_route('zvedani seniora z postele','/senior-nemuze-vstat-z-postele/#presun-z-postele-na-vozik',3);
check_route('nemuzu zvednout maminku z postele','/senior-nemuze-vstat-z-postele/#presun-z-postele-na-vozik',3);
check_route('domaci zdravotni pece','/navrat-z-nemocnice/#domaci-zdravotni-pece-nebo-pecovatelska-sluzba',3);
check_route('domaci pece','/navrat-z-nemocnice/#domaci-zdravotni-pece-nebo-pecovatelska-sluzba',3);
check_route('pecovatelska sluzba','/navrat-z-nemocnice/#domaci-zdravotni-pece-nebo-pecovatelska-sluzba',3);
check_route('osobni asistence','/navrat-z-nemocnice/#domaci-zdravotni-pece-nebo-pecovatelska-sluzba',3);
check_route('hul nebo choditko','/choditka-pro-seniory/#hul-nebo-choditko',3);
check_route('francouzska berle','/choditka-pro-seniory/#hul-nebo-choditko',3);
check_route('berle pro seniora','/choditka-pro-seniory/#hul-nebo-choditko',3);
// Real caregiver concerns must be prioritized above generic product and
// room categories. Every selected destination is static and safety-first.
check_route('senior odmita choditko','/senior-odmita-choditko/#proc-senior-odmita',3);
check_route('maminka nechce choditko','/senior-odmita-choditko/#proc-senior-odmita',3);
check_route('senior nechce do sprchy','/senior-odmita-koupani/#vyber-hygieny-bez-sprchy',3);
check_route('senior odmita koupani','/senior-odmita-koupani/#vyber-hygieny-bez-sprchy',3);
check_route('senior malo pije','/senior-malo-pije/#varovne-priznaky-malo-pije',3);
check_route('senior nepije','/senior-malo-pije/#varovne-priznaky-malo-pije',3);
check_route('tatinek skoro nepije','/senior-malo-pije/#varovne-priznaky-malo-pije',3);
check_route('babicka nemuze pit','/senior-malo-pije/#varovne-priznaky-malo-pije',3);
check_route('malo pije','/senior-malo-pije/#varovne-priznaky-malo-pije',3);
check_route('nechce pit','/senior-malo-pije/#varovne-priznaky-malo-pije',3);
check_route('nepije','/senior-malo-pije/#varovne-priznaky-malo-pije',3);
check_route('malo pije cerpadlo','',0);
check_route('voda do bytu nepije','',0);
check_route('maminka nechce pit','/senior-malo-pije/#varovne-priznaky-malo-pije',3);
check_route('babicka sama doma','/senior-doma-sam-sos-pomoc/#jak-funguje-pomoc-sos',3);
check_route('senior sam doma pres noc','/senior-doma-sam-sos-pomoc/#jak-funguje-pomoc-sos',3);
foreach(array(
  'choditko se sedatkem'=>'/rollator-pro-seniory/#rollator-se-sedatkem',
  'sprchovaci zidle'=>'/sprchovaci-zidle-pro-seniory/#poradce-sprchovaci-zidle',
  'zvedaci postel'=>'/polohovaci-postel/',
  'vodu do bytu'=>'',
  'fotovoltaika'=>''
) as $query=>$first) {
  $routes=zaprazi_2_search_guidance_for_query($query);
  if(($routes[0][0]??'')!==$first){
    fwrite(STDERR,"Caregiver rescue hijacked other query: ".$query."\n");
    exit(1);
  }
}
check_route('zvedaci postel','/polohovaci-postel/',2);
check_route('zvedaci kreslo','/vstavani-z-kresla-pro-seniora/#jak-postupovat-kreslo',3);
check_route('peceni doma','',0);

// A genuine fall gets safety-first help; unrelated solar/pump searches must not match.
check_route('senior spadl doma','/senior-spadl-doma/#prvni-krok-pad',3);
check_route('maminka upadla v bytu','/senior-spadl-doma/#prvni-krok-pad',3);
check_route('pad seniora','/senior-spadl-doma/#prvni-krok-pad',3);
check_route('opakovane pady doma','/senior-spadl-doma/#prvni-krok-pad',3);
foreach (array('cerpadla','spadl vykon solarnich panelu','pad napeti') as $unrelated) {
  $routes = zaprazi_2_search_guidance_for_query($unrelated);
  foreach ($routes as $route) {
    if (str_starts_with($route[0] ?? '', '/senior-spadl-doma/')) {
      fwrite(STDERR, "Unrelated term falsely matched a senior fall: ".$unrelated."\n");
      exit(1);
    }
  }
}

check_route('schodolez','/schody-pro-seniora-doma/#plan-schody',3);
check_route('schodistova sedacka','/schody-pro-seniora-doma/#plan-schody',3);
check_route('schody u vchodu','/schody-pro-seniora-doma/#plan-schody',3);

check_route('obuv','/obuv-pro-seniory/',2);
check_route('sobestacnost','/sobestacnost/',2);
check_route('epoukaz','/kompenzacni-pomucky-pro-seniory/#pojistovna',2);
if(zaprazi_2_search_guidance_for_query('fotovoltaika')!==array() ||
   zaprazi_2_search_guidance_for_query('')!==array() ||
   zaprazi_2_search_guidance_for_query(null)!==array()){
  fwrite(STDERR,"Unrelated queries must not receive invented advisor match.\n");
  exit(1);
}
echo "SEARCH_GUIDANCE_SAFE_ROUTES_OK\n";
