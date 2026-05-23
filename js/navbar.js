/* ============================================================
   MOZART LASER — navbar.js
   Direction-aware scroll behaviour:
     • At the very top (≤ THRESHOLD px)  → no class (fully transparent)
     • Scrolling DOWN past threshold      → .scrolled-down (more opaque, smaller)
     • Scrolling UP while away from top   → .scrolled-up   (lighter frost, full height)
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {

  var header     = document.getElementById("siteHeader");
  var hamburger  = document.querySelector(".hamburger");
  var desktopNav = document.querySelector(".main-nav");

  if (!header || !hamburger || !desktopNav) return;

  /* ============================================================
     BUILD MOBILE OVERLAY
     ============================================================ */
  var overlay = document.createElement("div");
  overlay.className = "mobile-nav-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-label", "Navigation menu");
  overlay.setAttribute("aria-modal", "true");

  var mobileUl = desktopNav.querySelector("ul").cloneNode(true);
  overlay.appendChild(mobileUl);
  document.body.appendChild(overlay);

  /* ── open / close ── */
  function openMenu() {
    overlay.classList.add("open");
    hamburger.classList.add("open");
    hamburger.setAttribute("aria-expanded", "true");
    document.body.classList.add("nav-open");
  }
  function closeMenu() {
    overlay.classList.remove("open");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  }

  hamburger.addEventListener("click", function (e) {
    e.stopPropagation();
    overlay.classList.contains("open") ? closeMenu() : openMenu();
  });
  overlay.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeMenu);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeMenu();
  });

  /* ============================================================
     DIRECTION-AWARE SCROLL
     ============================================================ */
  var THRESHOLD   = 40;    /* px — below this, always transparent */
  var lastScrollY = window.scrollY || window.pageYOffset;
  var ticking     = false;

  function setScrollState(scrollY) {
    var scrollingDown = scrollY > lastScrollY;

    if (scrollY <= THRESHOLD) {
      /* Back at the top — remove all scroll classes */
      header.classList.remove("scrolled-down", "scrolled-up");
    } else if (scrollingDown) {
      /* Moving down the page — heavier frost, shrink */
      header.classList.add("scrolled-down");
      header.classList.remove("scrolled-up");
    } else {
      /* Moving up the page — lighter frost, full height */
      header.classList.add("scrolled-up");
      header.classList.remove("scrolled-down");
    }

    lastScrollY = scrollY <= 0 ? 0 : scrollY;
    ticking = false;
  }

  window.addEventListener("scroll", function () {
    var scrollY = window.scrollY || window.pageYOffset;
    if (!ticking) {
      window.requestAnimationFrame(function () { setScrollState(scrollY); });
      ticking = true;
    }
  }, { passive: true });

  /* Run once on load */
  setScrollState(window.scrollY || window.pageYOffset);

  /* ============================================================
     ACTIVE LINK
     ============================================================ */
  var currentFile = window.location.pathname.split("/").pop() || "index.html";
  desktopNav.querySelectorAll("a").forEach(function (a) {
    var href = a.getAttribute("href") || "";
    if (href === currentFile || (currentFile === "" && href === "index.html")) {
      a.classList.add("active");
    }
  });

});