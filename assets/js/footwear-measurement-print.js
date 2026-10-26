// ZP_RELEASE_0_8_165
// Only a voluntary local print action. No persistence, URLs, analytics or
// visitor measurements ever leave this page.
const button = document.querySelector("#zp-footwear-measurement-print");
if (button && typeof window.print === "function") {
  const reset = () => { document.body.classList.remove("zp-footwear-print-mode"); };
  window.addEventListener("afterprint", reset);
  button.addEventListener("click", () => {
    document.body.classList.add("zp-footwear-print-mode");
    try {
      window.print();
    } catch {
      reset();
    }
  });
}
