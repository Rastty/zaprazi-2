// ZP_RELEASE_0_8_155
// A user-initiated, ephemeral print action: no data entry, persistence,
// analytics, network requests, URL changes or personalized information.
const button = document.querySelector("[data-zp-paper-print]");
const sheet = document.querySelector("[data-zp-paper-checklist]");
if (button && sheet && typeof window.print === "function") {
  button.hidden = false;
  const reset = () => document.body.classList.remove("zp-paper-print-mode");
  window.addEventListener("afterprint", reset);
  button.addEventListener("click", () => {
    document.body.classList.add("zp-paper-print-mode");
    try {
      window.print();
    } catch {
      reset();
    }
  });
}
