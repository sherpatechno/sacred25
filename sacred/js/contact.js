(function () {
  // attach to .info-request inputs
  const wraps = document.querySelectorAll(".info-request .form-floating-wrap");

  wraps.forEach((wrap) => {
    const input = wrap.querySelector(".form-control");
    const label = wrap.querySelector(".floating-label");
    if (!input || !label) return;

    // ensure placeholder text exists; if not, set it based on label text
    if (
      !input.getAttribute("placeholder") ||
      input.getAttribute("placeholder").trim() === ""
    ) {
      // extract plain label text (without star)
      const labelText = label.textContent.replace(/\*/g, "").trim();
      input.setAttribute("placeholder", labelText);
    }

    // helper to mark filled state
    const checkFilled = () => {
      if (input.value && input.value.trim() !== "") {
        wrap.classList.add("filled");
      } else {
        wrap.classList.remove("filled");
      }
    };

    // focus: remove placeholder and activate label (so label appears)
    input.addEventListener("focus", () => {
      // remove placeholder so caret looks clean
      input.dataset._placeholder = input.getAttribute("placeholder") || "";
      input.removeAttribute("placeholder");

      // mark active to show label & line
      wrap.classList.add("active");
    });

    // blur: if empty, restore placeholder and hide label
    input.addEventListener("blur", () => {
      if (!input.value || input.value.trim() === "") {
        // restore placeholder
        const ph = input.dataset._placeholder || "";
        if (ph) input.setAttribute("placeholder", ph);
        wrap.classList.remove("active");
        wrap.classList.remove("filled");
      } else {
        // keep the label visible when filled
        wrap.classList.remove("active"); // active only during focus; keep filled for visual state
        wrap.classList.add("filled");
      }
    });

    // on input, update filled class
    input.addEventListener("input", checkFilled);

    // initial check (autofill or pre-filled values)
    setTimeout(() => {
      checkFilled();
      if (input.value && input.value.trim() !== "") {
        // make label visible for prefilled fields
        wrap.classList.add("filled");
        // ensure placeholder removed
        input.dataset._placeholder = input.getAttribute("placeholder") || "";
        input.removeAttribute("placeholder");
      }
    }, 120);
  });
})();
