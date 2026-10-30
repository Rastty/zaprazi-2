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
  const form = new RegExp('(?:^|[?&#;&\\s])(?:ep\\.|epn\\.)?' + key +
    '=' + value + '(?=$|[&#;&\\s])');
  for (const raw of [request.url(), request.postData() || ""]) {
    let decoded = String(raw);
    for (let depth = 0; depth < 4; depth++) {
      if (json.test(decoded) || form.test(decoded)) return true;
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
