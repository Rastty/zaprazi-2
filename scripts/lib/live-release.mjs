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
export const EXPECTED_LIVE_RELEASE=parseThemeRelease(
 readFileSync(new URL("../../style.css",import.meta.url),"utf8")
);
