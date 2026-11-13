import test from "node:test";
import assert from "node:assert/strict";
import {fetchPublicWithNetworkRetry} from "../scripts/lib/public-readonly-retry.mjs";

const URL="https://zaprazi.cz/sitemap_index.xml";
const OPTIONS={redirect:"manual"};

test("read-only fetch retries only transient transport failures with fresh timeout",async()=>{
  let calls=0;
  const signals=[];
  const response={status:200};
  const fetcher=async (url,options)=>{
    assert.equal(url,URL);
    assert.equal(options.redirect,"manual");
    assert.equal(options.method,undefined);
    signals.push(options.signal);
    calls++;
    if(calls<3)throw new TypeError("socket closed");
    return response;
  };
  assert.equal(await fetchPublicWithNetworkRetry(fetcher,URL,OPTIONS),response);
  assert.equal(calls,3);
  assert.equal(new Set(signals).size,3);
});

test("non-200 HTTP response is returned unchanged without retry",async()=>{
  let calls=0;
  const response={status:503};
  const result=await fetchPublicWithNetworkRetry(async()=>{
    calls++;
    return response;
  },URL,OPTIONS);
  assert.equal(result,response);
  assert.equal(calls,1);
});

test("transport failure remains fail-closed after bounded attempts",async()=>{
  let calls=0;
  await assert.rejects(fetchPublicWithNetworkRetry(async()=>{
    calls++;
    throw new Error("private upstream detail must not leak");
  },URL,OPTIONS),{message:"PUBLIC_RETRY_NETWORK_UNAVAILABLE"});
  assert.equal(calls,3);
});

test("rejects off-site, query-bearing, redirected and writable requests before fetch",async()=>{
  let calls=0;
  const fetcher=async()=>{calls++;return {status:200}};
  const bad=[
    ["https://example.com/sitemap_index.xml",OPTIONS],
    [URL+"?session=private",OPTIONS],
    [URL+"#fragment",OPTIONS],
    [URL,{redirect:"follow"}],
    [URL,{redirect:"manual",method:"POST"}],
  ];
  for(const [url,options] of bad)
    await assert.rejects(fetchPublicWithNetworkRetry(fetcher,url,options));
  assert.equal(calls,0);
});
