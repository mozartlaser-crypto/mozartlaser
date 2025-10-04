 (function(){
      const header = document.getElementById('siteHeader');
      if(!header) return;

      const SHRINK_THRESHOLD = 48; 
      let lastScrollY = 0, ticking = false;

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      function updateHeader(scrollY){
        if (scrollY > SHRINK_THRESHOLD) header.classList.add('shrink');
        else header.classList.remove('shrink');
        ticking = false;
      }

      function onScroll(){
        lastScrollY = window.scrollY || window.pageYOffset;
        if (!ticking) {
          window.requestAnimationFrame(()=> updateHeader(lastScrollY));
          ticking = true;
        }
      }

      window.addEventListener('scroll', onScroll, {passive: true});
      updateHeader(window.scrollY || window.pageYOffset);
    })(); (function(){
      const header = document.getElementById('siteHeader');
      if(!header) return;

      const SHRINK_THRESHOLD = 48; 
      let lastScrollY = 0, ticking = false;

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      function updateHeader(scrollY){
        if (scrollY > SHRINK_THRESHOLD) header.classList.add('shrink');
        else header.classList.remove('shrink');
        ticking = false;
      }

      function onScroll(){
        lastScrollY = window.scrollY || window.pageYOffset;
        if (!ticking) {
          window.requestAnimationFrame(()=> updateHeader(lastScrollY));
          ticking = true;
        }
      }

      window.addEventListener('scroll', onScroll, {passive: true});
      updateHeader(window.scrollY || window.pageYOffset);
    })();

// Existing shrink-on-scroll code
(function(){
  const header = document.getElementById('siteHeader');
  if(!header) return;

  const SHRINK_THRESHOLD = 48; 
  let lastScrollY = 0, ticking = false;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function updateHeader(scrollY){
    if (scrollY > SHRINK_THRESHOLD) header.classList.add('shrink');
    else header.classList.remove('shrink');
    ticking = false;
  }

  function onScroll(){
    lastScrollY = window.scrollY || window.pageYOffset;
    if (!ticking) {
      window.requestAnimationFrame(()=> updateHeader(lastScrollY));
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, {passive: true});
  updateHeader(window.scrollY || window.pageYOffset);
})();

// NEW: Hamburger toggle
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('.main-nav');

hamburger.addEventListener('click', () => {
  nav.classList.toggle('show');
  const expanded = hamburger.getAttribute('aria-expanded') === 'true';
  hamburger.setAttribute('aria-expanded', !expanded);
});
document.addEventListener("DOMContentLoaded", function() {
  const header = document.getElementById("siteHeader");
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector(".main-nav");

  // Shrinking header on scroll (if you have that feature)
  let lastScrollTop = 0;
  window.addEventListener("scroll", function() {
    const scrollTop = window.scrollY;
    if (scrollTop > lastScrollTop && scrollTop > 50) {
      header.classList.add("shrink");
    } else {
      header.classList.remove("shrink");
    }
    lastScrollTop = scrollTop;
  });

  // Toggle mobile menu
  hamburger.addEventListener("click", function(e) {
    e.stopPropagation(); // prevent the click from triggering document listener
    nav.classList.toggle("show");
  });

  // Close menu when clicking outside
  document.addEventListener("click", function(e) {
    if (nav.classList.contains("show") && !nav.contains(e.target) && !hamburger.contains(e.target)) {
      nav.classList.remove("show");
    }
  });
});