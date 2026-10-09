# Zápraží 2.0 — bezpečnostní rozlišení nosnosti lůžka (2026-10-09)

## Ověřený nedostatek

Dřívější formulář se ptal na maximální hmotnost samotného uživatele, ale pro robustní postel UNIZDRAV Hospital P4707 a specializovanou Multibed P4044 zobrazoval prodejcem uvedenou pouze obecnou „nosnost“ 250 kg / 260 kg. V produktových podkladech těchto modelů není zvlášť výslovně uveden maximální limit hmotnosti pacienta. Nesprávné je převést tento údaj bez ověření na „max. hmotnost uživatele“.

Pro kontrast, UNIZDRAV CLASSIC P2777 jasně rozlišuje „Max. hmotnost pacienta 178 kg“ od „Pracovní zatížení 215 kg“.

### Zdroje ověřené 9. 10. 2026

- Hospital: https://unizdrav.cz/zbozi/4707/elektricka-polohovaci-postel-hospital — **Nosnost 250 kg**, bez explicitně odděleného pacientského maxima na produktové stránce.
- Multibed: https://unizdrav.cz/zbozi/4044/elektricka-polohovaci-postel-s-matraci-multibed — **Nosnost 260 kg**, bez explicitně odděleného pacientského maxima.
- CLASSIC: https://unizdrav.cz/zbozi/2777/elektricka-polohovaci-postel-classic — **Max. hmotnost pacienta 178 kg**, **pracovní zatížení 215 kg**.

## Implementované bezpečnostní chování

- Dvoufázový předběžný výběr nadále ukazuje technické údaje, nikdy však nákupní odkaz před dokončením ověření.
- Ve větvích Hospital / Multibed se ve druhém kroku zobrazí výhradně relevantní doplňující otázka `userCapacityVerified`: zda byl limit hmotnosti samotného uživatele pro přesnou konfiguraci ověřen u výrobce nebo odborné výdejny.
- Pouhé `loadFit=yes` a `spaceFit=yes` nikdy nesmí vydat finální produkt ani affiliate nabídku v těchto dvou větvích.
- `userCapacityVerified=no/unknown` (nebo chybějící potvrzení) končí `needs_more_info` bez produktové nabídky a vysvětluje další krok.
- U standardního CLASSIC se tato dodatečná otázka vůbec nezobrazuje, protože je limit pacienta výslovně doložen.
- Vzniklá informace se nikam neukládá ani neposílá do analytiky či obchodníkovi. Nenahrazuje fyzické ověření a odborný postup.

## Akceptace

Unit testy pokrývají všechny kombinace chybějícího/neznámého/negativního potvrzení i ověřenou cestu, zabraňují odemknutí běžnou nosností a chrání dostupnost standardního CLASSIC. Po následném nasazení ověřit produkční Chrome QA pro oba nové formulářové scénáře.
