import test from "node:test";
import assert from "node:assert/strict";
import {planGrowth} from "../scripts/growth-graph.mjs";

const graph={schemaVersion:1,nodes:[{id:"measurement",lane:"learning",priority:80,dependsOn:[],action:"Audit",doneWhen:"Evidence"}],feedbackEdges:[]};
function accepts(url){
  const state={schemaVersion:1,asOf:"2026-11-03",metrics:{organic_clicks_28d:1},metricSources:{organic_clicks_28d:url},nodes:{}};
  return ()=>planGrowth(graph,state,new Date("2026-11-03T12:00:00Z"));
}
test("rejects non-public evidence destinations",()=>{
  for(const host of ["169.254.169.254","100.100.100.200","198.18.0.1","192.0.0.1","224.0.0.1","0.0.0.0","[fe80::1]","[fc00::1]","[::ffff:127.0.0.1]","localhost","service.internal"]){
    assert.throws(accepts("https://"+host+"/report"),/HTTPS evidence/,host);
  }
});
test("keeps ordinary public HTTPS evidence working",()=>{
  for(const host of ["github.com","example.org","8.8.8.8"]){
    assert.doesNotThrow(accepts("https://"+host+"/report"),host);
  }
});
