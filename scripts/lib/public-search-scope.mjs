/**
 * Pure release-aware guard for published decision pages in public search.
 * No network, WordPress writes, query text, tracking or personal data.
 * Legacy direct URLs and archive pages are deliberately outside this test.
 */
export function requiresPublishedPageScope(release) {
  const m=/^(\d+)\.(\d+)\.(\d+)$/.exec(String(release));
  if(!m)throw new Error("Invalid live release for search scope");
  const parts=m.slice(1).map(Number),floor=[0,8,247];
  if(parts.some(n=>!Number.isSafeInteger(n)))throw new Error("Invalid live release for search scope");
  for(let i=0;i<3;i++){
    if(parts[i]!==floor[i])return parts[i]>floor[i];
  }
  return true;
}

export function assertPublishedPageResults(classes) {
  if(!Array.isArray(classes)||classes.length>200)
    throw new Error("Invalid rendered search result collection");
  for(const raw of classes){
    if(typeof raw!=="string"||raw.length>512)
      throw new Error("Invalid rendered search result class");
    const tokens=new Set(raw.split(/\s+/).filter(Boolean));
    if(!tokens.has("type-page")||!tokens.has("status-publish")||
       tokens.has("type-post")||tokens.has("status-private")||tokens.has("status-draft"))
      throw new Error("Public search contains non-published-page result");
  }
  return classes.length;
}
