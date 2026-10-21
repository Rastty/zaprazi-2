// ZP_RELEASE_0_8_144
// Browser-only arithmetic. It cannot certify suitability or safe passage.
function compareDoorwayWidths({clearWidth,chairWidth}){
 const parse=value=>{
  const s=String(value??"").trim().replace(",",".");
  if(!/^\d{1,3}(?:\.\d)?$/.test(s))return null;
  const n=Number(s);
  return Number.isFinite(n)&&n>=1&&n<=500?n:null;
 };
 const door=parse(clearWidth),chair=parse(chairWidth);
 if(door===null||chair===null)return null;
 const difference=Math.round((door-chair)*10)/10;
 return {difference,category:difference<=0?"not_enough":"unverified_margin"};
}
const form=document.querySelector("#zp-doorway-check");
if(form){
 const door=form.querySelector("#zp-door-clear-width");
 const chair=form.querySelector("#zp-chair-overall-width");
 const result=form.querySelector("#zp-doorway-result");
 const fmt=n=>new Intl.NumberFormat("cs-CZ",{maximumFractionDigits:1}).format(n);
 form.hidden=false;
 const invalidate=()=>{result.textContent="Údaje byly změněny. Předchozí přepočet už neplatí; porovnejte nové hodnoty.";};
 form.addEventListener("input",invalidate);
 form.addEventListener("change",invalidate);
 form.addEventListener("submit",event=>{
  event.preventDefault();
  const x=compareDoorwayWidths({clearWidth:door.value,chairWidth:chair.value});
  if(!x){
   result.textContent="Zadejte obě ověřené šířky v centimetrech (1 až 500, nejvýše jedno desetinné místo).";
   return;
  }
  if(x.category==="not_enough"){
   result.textContent="Volný otvor není širší než celková šířka vozíku (rozdíl "+fmt(x.difference)+" cm). Tyto rozměry pro přímý průjezd nestačí. Ověřte jiné řešení s odborníkem nebo dodavatelem.";
  }else{
   result.textContent="Čistý rozdíl šířek je "+fmt(x.difference)+" cm. To NENÍ potvrzení bezpečného průjezdu. Je nutné ověřit boční rezervu, úhel nájezdu, zatáčení, práh, ovládání a bezpečné použití konkrétního vozíku.";
  }
 });
}
