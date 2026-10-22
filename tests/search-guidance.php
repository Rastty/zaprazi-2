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
check_route('madlo do vany','/sedatko-do-vany-pro-seniory/#poradce-sedatko-vana',2);
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
check_route('vozik','/invalidni-vozik/',3);
check_route('polohovaci postel','/polohovaci-postel/',2);
check_route('nemocnice','/navrat-z-nemocnice/#plan-navratu',2);
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
