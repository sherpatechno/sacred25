// Navbar scroll effect
let lastScrollTop = 0;
const navbar = document.querySelector(".navbar");
const scrolledClass = "scrolled";

window.addEventListener("scroll", function () {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  // Always check if we've scrolled past the threshold
  if (scrollTop > 50) {
    navbar.classList.add(scrolledClass);
  } else {
    navbar.classList.remove(scrolledClass);
  }

  lastScrollTop = scrollTop;
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    if (targetId === "#") return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 70,
        behavior: "smooth",
      });
    }
  });
});

// Enhanced submenu positioning
function adjustSubmenuPosition() {
  // Only run on desktop
  if (window.innerWidth < 768) return;

  document.querySelectorAll(".dropdown-submenu").forEach((submenu) => {
    const menu = submenu.querySelector(".dropdown-menu");
    const submenuRect = menu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const parentRect = submenu.getBoundingClientRect();

    // Calculate if submenu would extend beyond viewport
    const wouldExtendBeyond =
      parentRect.right + menu.offsetWidth > viewportWidth;

    // Check if there's enough space on the left
    const enoughSpaceOnLeft = parentRect.left - menu.offsetWidth > 0;

    if (wouldExtendBeyond && enoughSpaceOnLeft) {
      submenu.classList.add("left-aligned");
    } else {
      submenu.classList.remove("left-aligned");
    }
  });
}

// Nepal Slider Functionality
function initNepalSlider() {
  const track = document.getElementById("nepalSliderTrack");
  const cards = document.querySelectorAll(".nepal-card");
  const prevBtn = document.getElementById("nepalSliderPrev");
  const nextBtn = document.getElementById("nepalSliderNext");

  if (!track || !prevBtn || !nextBtn) return;

  let currentPosition = 0;
  const cardWidth = cards[0].offsetWidth + 20; // card width + gap
  const visibleCards =
    window.innerWidth < 768 ? 1 : window.innerWidth < 992 ? 2 : 3;
  let maxPosition = (cards.length - visibleCards) * cardWidth;

  function updateButtons() {
    prevBtn.disabled = currentPosition === 0;
    nextBtn.disabled = currentPosition >= maxPosition;
  }

  function slide(direction) {
    if (direction === "next" && currentPosition < maxPosition) {
      currentPosition += cardWidth;
    } else if (direction === "prev" && currentPosition > 0) {
      currentPosition -= cardWidth;
    }

    track.style.transform = `translateX(-${currentPosition}px)`;
    updateButtons();
  }

  prevBtn.addEventListener("click", () => slide("prev"));
  nextBtn.addEventListener("click", () => slide("next"));

  // Initialize button states
  updateButtons();

  // Recalculate on window resize
  window.addEventListener("resize", function () {
    const newVisibleCards =
      window.innerWidth < 768 ? 1 : window.innerWidth < 992 ? 2 : 3;
    const newMaxPosition = (cards.length - newVisibleCards) * cardWidth;

    if (currentPosition > newMaxPosition) {
      currentPosition = newMaxPosition;
      track.style.transform = `translateX(-${currentPosition}px)`;
    }

    maxPosition = newMaxPosition;
    updateButtons();
  });
}

// Reviews Slider Functionality
function initReviewsSlider() {
  const track = document.getElementById("reviewsSliderTrack");
  const cards = document.querySelectorAll(".review-card");
  const prevBtn = document.getElementById("reviewsSliderPrev");
  const nextBtn = document.getElementById("reviewsSliderNext");

  if (!track || !prevBtn || !nextBtn) return;

  let currentPosition = 0;
  const cardWidth = cards[0].offsetWidth + 30; // card width + gap
  const visibleCards =
    window.innerWidth < 768
      ? 1
      : window.innerWidth < 992
      ? 2
      : window.innerWidth < 1200
      ? 3
      : 4;
  let maxPosition = (cards.length - visibleCards) * cardWidth;

  function updateButtons() {
    prevBtn.disabled = currentPosition === 0;
    nextBtn.disabled = currentPosition >= maxPosition;
  }

  function slide(direction) {
    if (direction === "next" && currentPosition < maxPosition) {
      currentPosition += cardWidth;
    } else if (direction === "prev" && currentPosition > 0) {
      currentPosition -= cardWidth;
    }

    track.style.transform = `translateX(-${currentPosition}px)`;
    updateButtons();
  }

  prevBtn.addEventListener("click", () => slide("prev"));
  nextBtn.addEventListener("click", () => slide("next"));

  // Initialize button states
  updateButtons();

  // Recalculate on window resize
  window.addEventListener("resize", function () {
    const newVisibleCards =
      window.innerWidth < 768
        ? 1
        : window.innerWidth < 992
        ? 2
        : window.innerWidth < 1200
        ? 3
        : 4;
    const newMaxPosition = (cards.length - newVisibleCards) * cardWidth;

    if (currentPosition > newMaxPosition) {
      currentPosition = newMaxPosition;
      track.style.transform = `translateX(-${currentPosition}px)`;
    }

    maxPosition = newMaxPosition;
    updateButtons();
  });
}

// Run on page load and window resize
window.addEventListener("load", function () {
  adjustSubmenuPosition();
  initNepalSlider();
  initReviewsSlider();
});
window.addEventListener("resize", adjustSubmenuPosition);

// Also run when dropdowns are hovered (in case of dynamic content)
document.querySelectorAll(".dropdown-submenu").forEach((submenu) => {
  submenu.addEventListener("mouseenter", adjustSubmenuPosition);
});

// Pre-calculate positions for all dropdowns on page load
document.addEventListener("DOMContentLoaded", function () {
  // Add a small delay to ensure all elements are rendered
  setTimeout(adjustSubmenuPosition, 100);

  // Automatically detect number of cards and apply appropriate class
  const tripsRow = document.querySelector(".trips-row");
  const tripCards = document.querySelectorAll(".trip-col");
  const cardCount = tripCards.length;

  // Remove any existing card count classes
  tripsRow.classList.remove("one-card", "two-cards", "three-cards");

  // Add appropriate class based on card count
  if (cardCount === 1) {
    tripsRow.classList.add("one-card");
  } else if (cardCount === 2) {
    tripsRow.classList.add("two-cards");
  } else if (cardCount === 3) {
    tripsRow.classList.add("three-cards");
  }
  // For 4+ cards, no special class needed (uses default)

  /* Mobile accordion inside panels */
  if (window.innerWidth <= 991) {
    const collapse = document.querySelector(".navbar-collapse");
    const mainPanel = document.getElementById("main-panel");

    document
      .querySelectorAll(".nav-item.dropdown > .nav-link")
      .forEach((link, i) => {
        const dropdown = link.nextElementSibling;
        const panelId = `panel-${i}`;

        // Create panel
        const panel = document.createElement("div");
        panel.className = "mobile-panel";
        panel.id = panelId;

        panel.innerHTML = `
        <button class="panel-back">← Back</button>
        ${dropdown.innerHTML}
      `;

        collapse.appendChild(panel);

        // Open panel
        link.addEventListener("click", (e) => {
          e.preventDefault();
          document
            .querySelectorAll(".mobile-panel")
            .forEach((p) => p.classList.remove("active"));
          panel.classList.add("active");
        });

        // Back button
        panel.querySelector(".panel-back").addEventListener("click", () => {
          document
            .querySelectorAll(".mobile-panel")
            .forEach((p) => p.classList.remove("active"));
          mainPanel.classList.add("active");
        });
      });
  }
});
//close button
document.addEventListener("DOMContentLoaded", function () {
  const navbar = document.querySelector(".navbar");
  const collapse = document.getElementById("navbarNav");
  const closeBtn = document.querySelector(".navbar-close");
  const toggler = document.querySelector(".navbar-toggler");

  if (!navbar || !collapse || !closeBtn) return;

  // Close menu when ✕ is clicked
  closeBtn.addEventListener("click", function () {
    // Use Bootstrap API to close collapse
    const bsCollapse =
      bootstrap.Collapse.getInstance(collapse) ||
      new bootstrap.Collapse(collapse, { toggle: false });

    bsCollapse.hide();

    // Reset mobile panels
    document.querySelectorAll(".mobile-panel").forEach((panel) => {
      panel.classList.remove("active");
    });

    const mainPanel = document.getElementById("main-panel");
    if (mainPanel) mainPanel.classList.add("active");
  });
});
(function syncNavbarState() {
  const navbar = document.querySelector(".navbar");
  const collapse = document.getElementById("navbarNav");

  if (!navbar || !collapse) return;

  collapse.addEventListener("show.bs.collapse", () => {
    navbar.classList.add("menu-open");
  });

  collapse.addEventListener("hide.bs.collapse", () => {
    navbar.classList.remove("menu-open");
  });
})();

//Search Overlay
document.addEventListener("DOMContentLoaded", function () {
  const searchOverlay = document.getElementById("searchOverlay");
  const searchWrapper = document.querySelector(".navbar-search");
  const searchButton = document.querySelector(".navbar-search button");
  const searchInputOverlay = searchOverlay.querySelector("input");
  const searchClose = document.querySelector(".search-close");
  const navbar = document.querySelector(".navbar");

  if (!searchOverlay || !searchWrapper || !navbar) return;

  /* ===============================
     DESKTOP BEHAVIOR (HOVER)
  ================================ */
  if (window.innerWidth >= 992) {
    let isOpen = false;

    function openDesktopSearch() {
      if (isOpen) return;
      isOpen = true;
      searchOverlay.classList.add("active");
      navbar.classList.add("search-active");

      setTimeout(() => {
        searchInputOverlay.focus();
      }, 120);
    }

    function closeDesktopSearch() {
      if (!isOpen) return;
      isOpen = false;
      searchOverlay.classList.remove("active");
      navbar.classList.remove("search-active");
    }

    // Hover / focus opens
    searchWrapper.addEventListener("mouseenter", openDesktopSearch);
    searchWrapper.addEventListener("focusin", openDesktopSearch);

    // Leaving overlay closes
    searchOverlay.addEventListener("mouseleave", closeDesktopSearch);

    // Leaving navbar closes (premium delay)
    navbar.addEventListener("mouseleave", () => {
      setTimeout(() => {
        if (!navbar.matches(":hover") && !searchOverlay.matches(":hover")) {
          closeDesktopSearch();
        }
      }, 120);
    });

    return;
  }

  /* ===============================
     MOBILE BEHAVIOR (CLICK)
  ================================ */
  searchButton.addEventListener("click", function (e) {
    e.preventDefault();

    searchOverlay.classList.add("active");
    document.body.classList.add("search-open");

    setTimeout(() => {
      searchInputOverlay.focus();
    }, 150);
  });

  if (searchClose) {
    searchClose.addEventListener("click", closeMobileSearch);
  }

  function closeMobileSearch() {
    searchOverlay.classList.remove("active");
    document.body.classList.remove("search-open");
  }

  // ESC support (mobile only)
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeMobileSearch();
    }
  });
});
