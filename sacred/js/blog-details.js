(function () {
  const track = document.querySelector(".cards-track");
  const leftBtn = document.querySelector(".carousel-nav.left-nav");
  const rightBtn = document.querySelector(".carousel-nav.right-nav");
  if (!track) return;

  const cards = Array.from(track.querySelectorAll(".card-col"));

  // calculate one card width (including gap) as basis for scrolling
  function getCardWidth() {
    const card = cards[0];
    if (!card) return track.clientWidth;
    const style = getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap || 16) || 16;
    return Math.round(card.getBoundingClientRect().width + gap);
  }

  // calculate how many cards fit fully in view
  function countVisible() {
    const cw = cards[0] ? cards[0].getBoundingClientRect().width : 300;
    return Math.max(1, Math.floor(track.clientWidth / cw));
  }

  // show/hide nav depending on overflow and viewport
  function updateNavVisibility() {
    const visible = countVisible();
    const total = cards.length;
    if (total > visible) {
      leftBtn.classList.remove("d-none");
      rightBtn.classList.remove("d-none");
    } else {
      leftBtn.classList.add("d-none");
      rightBtn.classList.add("d-none");
    }
  }

  // scroll by n cards
  function scrollByCards(n) {
    const amount = getCardWidth() * n;
    track.scrollBy({ left: amount, behavior: "smooth" });
  }

  // button handlers: scroll by visible count
  leftBtn.addEventListener("click", () => scrollByCards(-countVisible()));
  rightBtn.addEventListener("click", () => scrollByCards(countVisible()));

  // update nav on resize
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateNavVisibility, 120);
  });

  // initial
  updateNavVisibility();

  // mouse / touch drag to scroll
  let isDown = false,
    startX,
    scrollLeft;
  track.addEventListener("pointerdown", (e) => {
    isDown = true;
    track.classList.add("is-dragging");
    startX = e.clientX;
    scrollLeft = track.scrollLeft;
    track.setPointerCapture(e.pointerId);
  });
  track.addEventListener("pointermove", (e) => {
    if (!isDown) return;
    const x = e.clientX;
    const walk = startX - x; // negative => right
    track.scrollLeft = scrollLeft + walk;
  });
  track.addEventListener("pointerup", (e) => {
    isDown = false;
    track.classList.remove("is-dragging");
  });
  track.addEventListener("pointercancel", () => {
    isDown = false;
    track.classList.remove("is-dragging");
  });

  // show/hide nav if user scrolls to ends
  track.addEventListener("scroll", () => {
    const max = track.scrollWidth - track.clientWidth - 1;
    leftBtn.style.opacity = track.scrollLeft > 5 ? "1" : "0.45";
    rightBtn.style.opacity = track.scrollLeft < max ? "1" : "0.45";
  });

  // keyboard accessibility: allow arrows when focus in track
  track.setAttribute("tabindex", "0");
  track.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      scrollByCards(1);
      e.preventDefault();
    }
    if (e.key === "ArrowLeft") {
      scrollByCards(-1);
      e.preventDefault();
    }
  });

  // recompute nav visibility after images load (so widths are correct)
  window.addEventListener("load", updateNavVisibility);
})();

//Scrollable image and content in blog details page
(function () {
  const TOP_OFFSET = 100; // px — same as your CSS top
  const BREAKPOINT = 992; // px

  function initSticky() {
    const wrapper = document.querySelector(".blog-wrapper");
    const aside = document.querySelector(".blog-aside");
    if (!wrapper || !aside) return;

    // store original inline styles we may overwrite
    let orig = {
      position: aside.style.position || "",
      top: aside.style.top || "",
      left: aside.style.left || "",
      width: aside.style.width || "",
      transform: aside.style.transform || "",
    };

    let placeholder = null;

    function createPlaceholder(rect) {
      // create a bootstrap column placeholder to keep grid spacing
      const ph = document.createElement("div");
      ph.className = "aside-placeholder col-12 col-md-3";
      // match height so layout won't jump vertically (optional)
      ph.style.height = rect.height + "px";
      return ph;
    }

    function removePlaceholder() {
      if (placeholder && placeholder.parentNode) {
        placeholder.parentNode.removeChild(placeholder);
      }
      placeholder = null;
    }

    function update() {
      const vw = Math.max(
        document.documentElement.clientWidth || 0,
        window.innerWidth || 0
      );
      // reset for mobile / small screens
      if (vw < BREAKPOINT) {
        aside.classList.remove("js-fixed", "js-absolute");
        aside.style.position = orig.position;
        aside.style.top = orig.top;
        aside.style.left = orig.left;
        aside.style.width = orig.width;
        aside.style.transform = orig.transform;
        removePlaceholder();
        return;
      }

      const wrapRect = wrapper.getBoundingClientRect();
      const asideRect = aside.getBoundingClientRect();
      const docScrollY = window.scrollY || window.pageYOffset;
      // absolute top of wrapper in document coordinates
      const wrapperTopDoc = docScrollY + wrapRect.top;
      const wrapperBottomDoc = wrapperTopDoc + wrapRect.height;
      const asideHeight = asideRect.height;
      const stickTrigger = wrapperTopDoc - TOP_OFFSET;

      const shouldFix =
        docScrollY > stickTrigger &&
        docScrollY + TOP_OFFSET + asideHeight < wrapperBottomDoc;
      const shouldAbsolute =
        docScrollY + TOP_OFFSET + asideHeight >= wrapperBottomDoc;

      if (shouldFix) {
        // ensure placeholder exists BEFORE taking aside out of flow
        if (!placeholder) {
          placeholder = createPlaceholder(asideRect);
          // insert placeholder in the same position as aside inside the row
          // aside.parentElement is the .blog-wrapper (row)
          aside.parentElement.insertBefore(placeholder, aside);
        } else {
          // update placeholder height (in case of dynamic content)
          placeholder.style.height = asideRect.height + "px";
        }

        aside.classList.add("js-fixed");
        aside.classList.remove("js-absolute");
        aside.style.position = "fixed";
        aside.style.top = TOP_OFFSET + "px";
        // keep same width and left so it doesn't jump visually
        aside.style.left = asideRect.left + "px";
        aside.style.width = asideRect.width + "px";
        aside.style.transform = "none";
      } else if (shouldAbsolute) {
        // ensure placeholder exists (so layout preserved)
        if (!placeholder) {
          placeholder = createPlaceholder(asideRect);
          aside.parentElement.insertBefore(placeholder, aside);
        }

        aside.classList.remove("js-fixed");
        aside.classList.add("js-absolute");
        aside.style.position = "absolute";
        const topWithinWrapper = wrapRect.height - asideHeight;
        aside.style.top = topWithinWrapper + "px";
        aside.style.left = "";
        aside.style.width = "";
      } else {
        // before sticky trigger — remove placeholder and reset aside
        removePlaceholder();
        aside.classList.remove("js-fixed", "js-absolute");
        aside.style.position = orig.position;
        aside.style.top = orig.top;
        aside.style.left = orig.left;
        aside.style.width = orig.width;
        aside.style.transform = orig.transform;
      }
    }

    // throttle scroll/resize
    let running = false;
    function tick() {
      if (!running) {
        running = true;
        requestAnimationFrame(function () {
          update();
          running = false;
        });
      }
    }

    // run once
    update();

    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", function () {
      // clear inline left/width so getBoundingClientRect is up-to-date
      aside.style.left = "";
      aside.style.width = "";
      // small timeout to allow layout to settle
      setTimeout(update, 50);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSticky);
  } else {
    initSticky();
  }
})();
