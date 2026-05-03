document.addEventListener("DOMContentLoaded", function () {
  const header = document.getElementById("siteHeader");
  const hamburger = document.querySelector(".hamburger");
  const desktopNav = document.querySelector(".main-nav");

  if (!header || !hamburger || !desktopNav) return;

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
  // BUILD MOBILE OVERLAY
  // Clone links from the desktop nav and inject a separate overlay into <body>
  // so position:fixed covers the entire viewport with no clipping
  // ============================
  const overlay = document.createElement('div');
  overlay.className = 'mobile-nav-overlay';

  // Clone the <ul> from the desktop nav
  const desktopUl = desktopNav.querySelector('ul');
  const mobileUl = desktopUl.cloneNode(true);
  overlay.appendChild(mobileUl);

  // Append overlay directly to body (outside header)
  document.body.appendChild(overlay);

  // ============================
  // OPEN / CLOSE
  // ============================
  function openMenu() {
    overlay.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
  }

  function closeMenu() {
    overlay.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  }

  hamburger.addEventListener('click', function (e) {
    e.stopPropagation();
    overlay.classList.contains('open') ? closeMenu() : openMenu();
  });

  // Close when a link is tapped
  overlay.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  // ============================
  // SHRINK ON SCROLL
  // ============================
  let lastScrollY = window.scrollY || window.pageYOffset;
  let ticking = false;

  function updateHeader(scrollY) {
    if (scrollY <= 0) {
      header.classList.remove('shrink');
    } else if (scrollY > lastScrollY) {
      header.classList.add('shrink');
    } else {
      header.classList.remove('shrink');
    }
    lastScrollY = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    const scrollY = window.scrollY || window.pageYOffset;
    if (!ticking) {
      window.requestAnimationFrame(() => updateHeader(scrollY));
      ticking = true;
    }
  }, { passive: true });

  updateHeader(lastScrollY);
});