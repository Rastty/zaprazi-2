# Zápraží 0.8.153 – při otevření návodu neztratit rozpracovaný výběr

## Co bylo špatně
Verze 0.8.151 přidala pětici výsledkových odkazů na přesné části měřicího průvodce. Na rozdíl od měřicích odkazů uvnitř druhé fáze poradců se odkazy **ve výsledku** otevíraly ve stejné kartě. Po návratu tak člověk mohl ztratit dosavadní odpovědi, protože poradci je záměrně nesynchronizují do úložiště ani na server.

## Oprava
- Výsledkový odkaz u všech pěti koupelnových specialistů používá `target="_blank" rel="noopener noreferrer"`.
- Viditelný text vysvětluje novou kartu a že rozpracované odpovědi zůstanou v původní kartě.
- Cílová URL je interní, pevná, bez odpovědí a bez uživatelských dat.
- Žádná změna enginu, safety gate, produktových doporučení, datování zdrojů nebo affiliate map.

## QA
- Regresní Node test pomocné komponenty (lokální kotvy, target, noopener, nenápadný nekomerční odkaz).
- Predeploy GitHub CI, Browser QA a Legacy fidelity (aktuální produkce 0.8.152).
- Read-only **ponasazovací** browser test pěti reálných dvoufázových formulářů: odpověď „nosnost neznámá“, nový tab otevře správný návod, na původní kartě zůstane výsledek, otázky i odpovědi, bez obchodních odkazů a bez POST. Nový test se před 0.8.153 spolehlivě přeskočí.
- Po WordPress Pull + Deploy ověřit release 0.8.153, integritu, 25/25 affiliate a manuálně spustit QA nebo samostatný QA-only PR k ověření live verze.

Neukládat rodinné, zdravotní ani jiné osobní informace.