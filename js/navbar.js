document.addEventListener("DOMContentLoaded", function() {
  const header = document.getElementById("siteHeader");
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector(".main-nav");

  if (!header || !hamburger || !nav) return;

  // ================================
  // SHRINK/SHOW HEADER ON SCROLL
  // ================================
  const SHRINK_THRESHOLD = 48;
  let lastScrollY = window.scrollY || window.pageYOffset;
  let ticking = false;

  function updateHeader(scrollY) {
    // Shrink header if scrolling past threshold
    if (scrollY > SHRINK_THRESHOLD) header.classList.add("shrink");
    else header.classList.remove("shrink");

    // Show navbar if scrolling up, hide if scrolling down
    if (scrollY < lastScrollY) {
      // Scrolling up
      header.classList.remove("hide");
    } else if (scrollY > lastScrollY) {
      // Scrolling down
      header.classList.add("hide");
    }

    lastScrollY = scrollY;
    ticking = false;
  }

  function onScroll() {
    const scrollY = window.scrollY || window.pageYOffset;
    if (!ticking) {
      window.requestAnimationFrame(() => updateHeader(scrollY));
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  updateHeader(lastScrollY);

  // ================================
  // HAMBURGER TOGGLE
  // ================================
  hamburger.addEventListener("click", function(e) {
    e.stopPropagation(); // prevents the click from closing immediately
    nav.classList.toggle("show");
    const expanded = hamburger.getAttribute("aria-expanded") === "true";
    hamburger.setAttribute("aria-expanded", !expanded);
  });

  // ================================
  // CLOSE MENU WHEN CLICKING OUTSIDE
  // ================================
  document.addEventListener("click", function(e) {
    if (nav.classList.contains("show") && !nav.contains(e.target) && !hamburger.contains(e.target)) {
      nav.classList.remove("show");
      hamburger.setAttribute("aria-expanded", false);
    }
  });
});