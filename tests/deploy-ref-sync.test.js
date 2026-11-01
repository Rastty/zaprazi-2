import test from "node:test";
import assert from "node:assert/strict";
import {verifyDeployRefs} from "../scripts/check-deploy-ref-sync.mjs";

const main="a".repeat(40),dev="b".repeat(40);
const refs=(m=main,d=main)=>m+"\trefs/heads/main\n"+d+"\trefs/heads/dev\n";

test("canonical main, dev and checkout all matching permit only a manual deploy gate",()=>{
  assert.deepEqual(verifyDeployRefs(refs(),main),{
    status:"ready_for_manual_deploy_gate",commit:main,branches:["main","dev"],
    note:"Ref sync alone does not prove CI, WordPress deploy or production acceptance"
  });
});

test("block the currently risky case: dev lagging main",()=>{
  assert.throws(()=>verifyDeployRefs(refs(main,dev),main),/PENDING_RELEASE_SYNC/);
});

test("block stale checkout even when canonical branches match",()=>{
  assert.throws(()=>verifyDeployRefs(refs(),dev),/local checkout is not the release commit/);
});

test("fail closed on missing, duplicate, malformed or unrelated refs",()=>{
  const cases=[
    main+"\trefs/heads/main\n",
    refs()+main+"\trefs/heads/dev\n",
    main+" refs/heads/main\n"+main+"\trefs/heads/dev\n",
    refs()+main+"\trefs/heads/production\n",
    "not-a-sha\trefs/heads/main\n"+main+"\trefs/heads/dev\n",
    ""
  ];
  for(const evidence of cases)
    assert.throws(()=>verifyDeployRefs(evidence,main),/ref|required/i);
  assert.throws(()=>verifyDeployRefs(refs(),"bad-sha"),/local checkout/);
});

test("do not accept untrusted or non-string evidence",()=>{
  assert.throws(()=>verifyDeployRefs(null,main),/Invalid deploy ref evidence/);
  assert.throws(()=>verifyDeployRefs(refs(),null),/Invalid deploy ref evidence/);
});
