/**
 * Expect checked-out WordPress theme release, not the live site's self-report.
 * This fails if the repository points to a new release not yet deployed.
 */
import {readFileSync} from "node:fs";
export function parseThemeRelease(css){
 const m=String(css).slice(0,1000).match(/^Version:\s*(\d+\.\d+\.\d+)\s*$/m);
 if(!m)throw new Error("Missing or malformed WordPress theme Version header");
 return m[1];
}
export const SOURCE_THEME_RELEASE=parseThemeRelease(
 readFileSync(new URL("../../style.css",import.meta.url),"utf8")
);

// Pull-request checks run BEFORE the user deploys the next theme release.
// The workflow validates and publishes the actual production version into
// GITHUB_ENV. Only a pull_request may use it. workflow_dispatch and local
// postdeploy checks always insist on the checked-out source release.
const predeployVersion=process.env.GITHUB_EVENT_NAME==="pull_request"
  ? process.env.ZP_RELEASE : undefined;
if(predeployVersion && !/^\d+\.\d+\.\d+$/.test(predeployVersion)){
 throw new Error("Malformed predeploy release");
}
export const EXPECTED_LIVE_RELEASE=predeployVersion || SOURCE_THEME_RELEASE;
