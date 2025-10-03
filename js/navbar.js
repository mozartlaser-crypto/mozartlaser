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
