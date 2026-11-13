/**
 * Bounded transport-only retries for read-only production checks.
 * A bad HTTP status, redirect, invalid body or content assertion must still
 * fail immediately. Never follow redirects, send form data or change hosts.
 */
export async function fetchPublicWithNetworkRetry(fetcher,url,options={}){
  if(typeof fetcher!=="function"||typeof url!=="string")
    throw Error("PUBLIC_RETRY_INVALID_REQUEST");
  let target;
  try{target=new URL(url)}catch{throw Error("PUBLIC_RETRY_INVALID_URL")}
  if(target.origin!=="https://zaprazi.cz"||target.search||target.hash||
    target.username||target.password||
    (options.method&&options.method!=="GET")||
    !["manual","error"].includes(options.redirect))
    throw Error("PUBLIC_RETRY_UNAUTHORIZED_REQUEST");

  const waits=[300,900];
  for(let attempt=0;attempt<=waits.length;attempt++){
    try{
      // A fresh timeout is required for each attempt; never reuse an aborted
      // signal. Discard any caller-provided signal rather than retry it.
      const {signal:unused,...safeOptions}=options;
      return await fetcher(url,{...safeOptions,signal:AbortSignal.timeout(15000)});
    }catch{
      if(attempt===waits.length)throw Error("PUBLIC_RETRY_NETWORK_UNAVAILABLE");
      await new Promise(resolve=>setTimeout(resolve,waits[attempt]));
    }
  }
}
