/**
 * Privacy canary for read-only production browser QA.
 * Detects exact Advisor field/value pairs in outgoing request URLs and bodies.
 * Never logs, stores or sends the inspected request or Advisor answer.
 * A passing canary is NOT a comprehensive network/consent audit.
 */
const escapeRe = value => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function requestContainsAdvisorAnswer(request, answer) {
  if (!answer || typeof answer.name !== "string" ||
      typeof answer.value !== "string" || !answer.name || !answer.value) return false;
  const key = escapeRe(answer.name);
  const value = escapeRe(answer.value);
  // JSON event payloads and URL/form/GA4-style event parameters.
  const json = new RegExp('["\\\']' + key + '["\\\']\\s*:\\s*["\\\']' + value + '["\\\']');
  const form = new RegExp('(?:^|[?&#;&=\\s])(?:ep\\.|epn\\.|up\\.|upn\\.)?' + key +
    '=' + value + '(?=$|[&#;&\\s])');
  // Analytics can also place answer pairs in Referer, Cookie or custom
  // request headers. Puppeteer exposes these synchronously for this canary.
  // Inspect only in memory; never print headers or answer values.
  // Some telemetry serializes parameters as {name, value: {string_value}}.
  // These pairs must not carry Advisor answers even without a direct JSON key.
  const namedParam = new RegExp('"name"\\s*:\\s*"' + key +
    '"\\s*,\\s*"value"\\s*:\\s*(?:\\{\\s*"(?:string_value|stringValue)"\\s*:\\s*)?"' +
    value + '"');
  const headers = typeof request.headers === "function" ? request.headers() : {};
  if (!headers || typeof headers !== "object" || Array.isArray(headers))
    throw new TypeError("Malformed request headers");
  if (Object.entries(headers).some(([name, value]) =>
    name.toLowerCase() === answer.name.toLowerCase() &&
    String(value) === answer.value)) return true;
  const surfaces = [request.url(), request.postData() || "",
    ...Object.values(headers).map(String)];
  for (const raw of surfaces) {
    let decoded = String(raw);
    for (let depth = 0; depth < 4; depth++) {
      if (json.test(decoded) || form.test(decoded) || namedParam.test(decoded)) return true;
      // application/x-www-form-urlencoded uses '+' for spaces.
      // Inspect it without changing or logging the original request.
      if (decoded.includes("+")) {
        const formDecoded = decoded.replace(/\\+/g, " ");
        if (json.test(formDecoded) || form.test(formDecoded) ||
            namedParam.test(formDecoded)) return true;
      }
      try {
        const next = decodeURIComponent(decoded);
        if (next === decoded) break;
        decoded = next;
      } catch {
        break; // malformed URL encoding must not crash browser QA
      }
    }
  }
  return false;
}

/**
 * Read-only canary for accidental persistence of a selected practical answer.
 * Entries are ephemeral [key, value] pairs from localStorage/sessionStorage;
 * cookies are inspected in memory, never printed or sent anywhere.
 */
export function persistentStorageContainsAdvisorAnswer(entries, cookies, answer) {
  if (!answer || typeof answer.name !== "string" ||
      typeof answer.value !== "string" || !answer.name || !answer.value) return false;
  if (!Array.isArray(entries)) throw new TypeError("Expected storage entries");
  const payload = value => requestContainsAdvisorAnswer({
    url: () => "", postData: () => String(value ?? "")
  }, answer);
  for (const entry of entries) {
    if (!Array.isArray(entry) || entry.length !== 2) throw new TypeError("Malformed storage entry");
    const [key, value] = entry;
    if (key === answer.name && value === answer.value) return true;
    // Storage keys themselves can contain the complete answer pair, e.g.
    // localStorage.setItem("supportNeed=steady", "1"). Inspect both sides;
    // neither is ever logged or copied outside this read-only QA process.
    if (payload(key) || payload(value)) return true;
  }
  return payload(cookies);
}
