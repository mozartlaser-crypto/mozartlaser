document.addEventListener("DOMContentLoaded", function() {
  const header = document.getElementById("siteHeader");
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector(".main-nav");

  if (!header || !hamburger || !nav) return;

  // ============================
  // TRUST BAR
  // ============================
  const trustBar = document.createElement('div');
  trustBar.id = 'trust-bar';
  trustBar.innerHTML = `
    
    <span>Handmade in California</span>
    <span>Ships in 3&ndash;5 Days</span>
	<span>Refund guarantee</span>
    
  `;
  header.appendChild(trustBar);

  // ============================
  // SHRINK ON SCROLL
  // ============================
  let lastScrollY = window.scrollY || window.pageYOffset;
  let ticking = false;

  function updateHeader(scrollY) {
    if (scrollY <= 0) {
      header.classList.remove("shrink");
    } else if (scrollY > lastScrollY) {
      header.classList.add("shrink");
    } else if (scrollY < lastScrollY) {
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

  // ============================
  // HAMBURGER TOGGLE
  // ============================
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