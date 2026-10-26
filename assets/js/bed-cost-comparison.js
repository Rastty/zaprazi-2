// ZP_RELEASE_0_8_158
// Local-only optional cost worksheet. No prices, health data or analytics are sent or stored.
function compareBedCosts({months,monthlyRent,rentalExtras,purchaseTotal}) {
  const whole=(value,min,max)=>{
    const s=String(value??"").trim();
    if(!/^\d{1,8}$/.test(s))return null;
    const n=Number(s);
    return Number.isSafeInteger(n)&&n>=min&&n<=max?n:null;
  };
  const m=whole(months,1,60);
  const rate=whole(monthlyRent,1,1000000);
  const fees=whole(rentalExtras===""||rentalExtras==null?"0":rentalExtras,0,10000000);
  const buy=whole(purchaseTotal,1,10000000);
  if(m===null||rate===null||fees===null||buy===null)return null;
  const rent=m*rate+fees;
  if(!Number.isSafeInteger(rent)||rent>100000000)return null;
  return {rent,buy,months:m,difference:Math.abs(rent-buy),cheaper:rent===buy?"equal":rent<buy?"rent":"buy"};
}
const form=document.querySelector("#zp-bed-cost-comparison");
if(form){
  const find=id=>form.querySelector("#"+id);
  const months=find("zp-bed-cost-months");
  const monthly=find("zp-bed-cost-monthly");
  const extras=find("zp-bed-cost-rental-extras");
  const purchase=find("zp-bed-cost-purchase");
  const result=find("zp-bed-cost-result");
  const money=n=>new Intl.NumberFormat("cs-CZ",{style:"currency",currency:"CZK",maximumFractionDigits:0}).format(n);
  form.hidden=false;
  // Native HTML5 validation prevents submit on an invalid value. Invalidate the
  // previous comparison immediately on editing so stale totals never remain.
  const invalidate=()=>{
    const valid=typeof form.checkValidity!=="function"||form.checkValidity();
    result.textContent=valid
      ?"Údaje byly změněny. Pro nové srovnání stiskněte Porovnat celkové náklady."
      :"Vyplňte platné celé částky v Kč a období od 1 do 60 měsíců. Bez úplných údajů nemůžeme nabídky porovnat.";
  };
  form.addEventListener("input",invalidate);
  form.addEventListener("change",invalidate);
  form.addEventListener("submit",event=>{
    event.preventDefault();
    const x=compareBedCosts({
      months:months.value,monthlyRent:monthly.value,
      rentalExtras:extras.value,purchaseTotal:purchase.value
    });
    if(!x){
      result.textContent="Vyplňte platné celé částky v Kč a období od 1 do 60 měsíců. Bez úplných údajů nemůžeme nabídky porovnat.";
      return;
    }
    const comparison=x.cheaper==="equal"
      ?"Při těchto částkách vycházejí obě cesty finančně stejně."
      :x.cheaper==="rent"
        ?"V tomto období vychází čistě podle zadaných částek půjčení o "+money(x.difference)+" levněji."
        :"V tomto období vychází čistě podle zadaných částek koupě o "+money(x.difference)+" levněji.";
    result.textContent="Za "+x.months+" měsíců: půjčení "+money(x.rent)+"; nákup "+money(x.buy)+". "+comparison+
      " Závěr nezohledňuje vratnou kauci, budoucí servis, zbytkovou hodnotu ani úhradu pojišťovnou. Vhodnost postele ověřte zvlášť.";
  });
}
