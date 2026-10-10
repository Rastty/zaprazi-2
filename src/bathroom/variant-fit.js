// ZP_RELEASE_0_8_98
/**
 * The main Bathroom Advisor offers two bath-transfer constructions.
 * A yes for the 110 kg transfer bench cannot confirm the 100 kg bath seat,
 * and vice versa. Reset the load confirmation whenever the variant changes.
 * Health-like answers remain ephemeral in the browser.
 */
export function resetBathroomLoadFitOnBathVariantChange(form, changedAnswerName) {
  if (changedAnswerName !== "bathFit") return false;
  const group = form.querySelector('[data-zp-bath-required="loadFit"]');
  if (!group) throw new Error("Missing mandatory Bathroom load-fit gate");
  group.querySelectorAll('input[type="radio"]').forEach((input) => {
    input.checked = false;
  });
  group.classList.remove("is-error");
  group.removeAttribute("aria-invalid");
  return true;
}
