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