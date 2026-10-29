import test from "node:test";
import assert from "node:assert/strict";
import {recommendBathroom} from "../src/bathroom/engine.js";
function generator(seed){
  let state=seed>>>0;
  return max=>{state^=state<<13;state^=state>>>17;state^=state<<5;return(state>>>0)%max;};
}
test("seeded 3,000-combination safety sweep never emits products without necessary checks",()=>{
  const pick=generator(0x5a9e2026);
  const needs=["raise_toilet","toilet_support","toilet_nearby","shower_seated",
    "bath_transfer","multifunction_toilet_shower","combined_shower_toilet"];
  const transfer=["independent","steadying","person_assist","unknown"];
  const fits=["yes","no","unknown"];
  const wall=["verified","unverified","not_possible","unknown"];
  const caseFor=()=>({
    primaryNeed:needs[pick(needs.length)],
    transferAbility:transfer[pick(transfer.length)],
    loadFit:fits[pick(fits.length)],
    toiletFit:fits[pick(fits.length)],
    feetFlatAtRaisedHeight:fits[pick(fits.length)],
    floorStable:fits[pick(fits.length)],
    spaceFit:fits[pick(fits.length)],
    wallFixing:wall[pick(wall.length)],
    supportFrameFit:fits[pick(fits.length)],
    bathTransferIndependent:fits[pick(fits.length)],
    bathFit:fits[pick(fits.length)],
    bathBenchFit:fits[pick(fits.length)]
  });
  for(let i=0;i<3000;i++){
    const input=caseFor();
    const out=recommendBathroom({...input,privateNote:"DO_NOT_ECHO_PRIVATE"});
    assert.doesNotMatch(JSON.stringify(out),/DO_NOT_ECHO_PRIVATE/);
    if(out.status!=="candidate"){
      assert.deepEqual(out.recommendations,[],JSON.stringify(input));
      assert.deepEqual(out.acquisition,[],JSON.stringify(input));
      continue;
    }
    assert.equal(input.loadFit,"yes",JSON.stringify(input));
    assert.ok(["independent","steadying"].includes(input.transferAbility),JSON.stringify(input));
    assert.ok(out.recommendations.length>0);
    if(input.primaryNeed==="raise_toilet")
      assert.equal(input.toiletFit==="yes"&&input.feetFlatAtRaisedHeight==="yes",true);
    if(input.primaryNeed==="toilet_support")
      assert.equal(input.wallFixing==="verified"||input.supportFrameFit==="yes",true);
    if(["toilet_nearby","shower_seated","multifunction_toilet_shower"].includes(input.primaryNeed))
      assert.equal(input.floorStable==="yes"&&input.spaceFit==="yes",true);
    if(input.primaryNeed==="bath_transfer")
      assert.equal(input.transferAbility==="independent"&&input.bathTransferIndependent==="yes"&&
        (input.bathFit==="yes"||(input.bathFit==="no"&&input.bathBenchFit==="yes")),true);
    assert.notEqual(input.primaryNeed,"combined_shower_toilet");
  }
});
