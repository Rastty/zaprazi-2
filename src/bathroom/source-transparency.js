// ZP_RELEASE_0_8_172
/**
 * Public source provenance for a product already accepted by the decision
 * engine. Evidence is not an additional shop or affiliate navigation path.
 * Merchant/product-store sources are shown as plain text, while independent
 * instructions and manufacturer documentation can be opened safely.
 *
 * "Checked" means evidence was reviewed on that date; it never proves a
 * current price, stock availability, patient fit or reimbursement.
 */
const sourceLabels=Object.freeze({
  merchant_product_page:"Produktový list prodejce",
  approved_merchant_product_page:"Produktový list prodejce",
  manufacturer_product_page:"Technické informace výrobce",
  manufacturer_manual:"Návod výrobce",
  independent_setup_guidance:"Nezávislý návod k používání",
  independent_use_case_guidance:"Nezávislé vysvětlení použití",
  independent_installation_guidance:"Nezávislé pokyny k upevnění",
  independent_bathing_guidance:"Nezávislé rady ke koupání",
  independent_transfer_guidance:"Nezávislé pokyny k přesunu"
});

const safeSourceUrl=(value)=>{
  try{
    const url=new URL(value);
    return url.protocol==="https:" && !url.username && !url.password ? url.href : null;
  }catch{return null;}
};

const dateLabel=(value)=>{
  const date=String(value||"");
  const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if(!m)return "datum nezjištěno";
  const d=new Date(date+"T12:00:00.000Z");
  if(Number.isNaN(d.getTime())||d.toISOString().slice(0,10)!==date)return "datum nezjištěno";
  return "podklad zkontrolován "+Number(m[3])+". "+Number(m[2])+". "+m[1];
};

export function renderBathroomProductEvidence(product,escapeHtml){
  if(typeof escapeHtml!=="function")throw new Error("HTML escaping is required");
  if(!Array.isArray(product?.evidence)||!product.evidence.length)return "";
  const entries=product.evidence.map(item=>{
    const label=sourceLabels[item?.type]||"Doplňující zdroj";
    const checked=dateLabel(item?.checkedAt);
    const src=safeSourceUrl(item?.url);
    const isCommerce=/merchant_product_page/.test(item?.type||"");
    const isTrustedDocument=/^(independent_|manufacturer_)/.test(item?.type||"");
    const text=escapeHtml(label);
    // Never create a second merchant link under "technical sources".
    const main=src&&isTrustedDocument&&!isCommerce
      ? '<a href="'+escapeHtml(src)+'" target="_blank" rel="noopener noreferrer">'+text+'</a>'
      : text;
    return "<li>"+main+" <small>("+escapeHtml(checked)+")</small></li>";
  }).join("");
  return '<details class="zp-sources"><summary>Odkud máme parametry výrobku?</summary>'+
    '<p class="zp-muted-copy">Zdroje byly zkontrolovány v uvedených dnech. Nejde o dnešní potvrzení ceny, skladové dostupnosti ani vhodnosti pro konkrétního člověka.</p>'+
    '<ul>'+entries+'</ul></details>';
}
