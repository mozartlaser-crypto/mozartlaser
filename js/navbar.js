document.addEventListener("DOMContentLoaded", function() {
  const header = document.getElementById("siteHeader");
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector(".main-nav");

  if (!header || !hamburger || !nav) return;

  const SHRINK_THRESHOLD = 48;
  let lastScrollY = window.scrollY || window.pageYOffset;
  let ticking = false;

  function updateHeader(scrollY) {
    if (scrollY <= 0) {
      // Top of page → fully expanded
      header.classList.remove("shrink");
    } else if (scrollY > lastScrollY) {
      // Scrolling down → contracted
      header.classList.add("shrink");
    } else if (scrollY < lastScrollY) {
      // Scrolling up → fully expanded
      header.classList.remove("shrink");
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

  // HAMBURGER TOGGLE
  hamburger.addEventListener("click", function(e) {
    e.stopPropagation();
    nav.classList.toggle("show");
    const expanded = hamburger.getAttribute("aria-expanded") === "true";
    hamburger.setAttribute("aria-expanded", !expanded);
  });

  // CLOSE MENU WHEN CLICKING OUTSIDE
  document.addEventListener("click", function(e) {
    if (nav.classList.contains("show") && !nav.contains(e.target) && !hamburger.contains(e.target)) {
      nav.classList.remove("show");
      hamburger.setAttribute("aria-expanded", false);
    }
  });
});