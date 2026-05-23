/* ============================================================
   safari-fix.js — Mozart Laser
   Fixes cursor lag and animation glitches in Safari by:
   1. Overriding cursor positioning to use transform:translate()
      instead of top/left (avoids layout recalc every frame)
   2. Promoting animated elements to GPU layers via will-change
   ============================================================ */

(function () {

  /* ── 1. CURSOR: switch from top/left to transform ── */
  var dot  = document.getElementById('cur-dot');
  var ring = document.getElementById('cur-ring');

  if (dot && ring) {
    /* Force GPU compositing layers on both elements */
    dot.style.willChange  = 'transform';
    ring.style.willChange = 'transform';

    /* Reset any top/left the inline script may have set */
    dot.style.top  = '0px';
    dot.style.left = '0px';
    ring.style.top  = '0px';
    ring.style.left = '0px';

    var mx = 0, my = 0, rx = 0, ry = 0;
    var rafId = null;

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
      /* Move dot instantly — no interpolation needed */
      dot.style.transform = 'translate(' + (mx - 4) + 'px,' + (my - 4) + 'px)';
    }, { passive: true });

    /* Cancel any existing RAF loop from the inline script, start fresh */
    function loop() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.transform = 'translate(' + (rx - 18) + 'px,' + (ry - 18) + 'px)';
      rafId = requestAnimationFrame(loop);
    }

    /* Small delay so inline script's loop starts first, then we take over */
    setTimeout(function () {
      if (rafId) cancelAnimationFrame(rafId);
      loop();
    }, 0);
  }

  /* ── 2. GPU PROMOTION for animated elements ── */
  /* Run after DOM is ready */
  function promoteElements() {
    var selectors = [
      '.site-header',
      '.img-stage',
      '.product-card',
      '.post-card',
      '.post-card-inner',
      '.value-card',
      '.reveal',
      '.img-thumbs',
      '.thumb',
      '.btn-primary',
      '.btn-secondary',
      '.mobile-nav-overlay',
    ];
    selectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        if (!el.style.willChange) {
          el.style.willChange = 'transform';
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', promoteElements);
  } else {
    promoteElements();
  }

  /* ── 3. WEBKIT: ensure -webkit-backdrop-filter is set alongside backdrop-filter ── */
  /* Safari < 15 needs the prefix. For inline styles set by JS, mirror them. */
  var header = document.getElementById('siteHeader');
  if (header) {
    var origAdd = header.classList.add.bind(header.classList);
    /* No need to patch classList — navbar.css already has -webkit- prefixes */
  }

})();