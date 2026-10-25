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
