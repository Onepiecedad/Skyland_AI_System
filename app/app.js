document.addEventListener('DOMContentLoaded', () => {
  // Session UUID must be initialized before anything else —
  // all events (form, voice, dashboard) bind to this ID
  window.SkylandSession.init();

  // Initialize voice module (requires SDK + session to be ready)
  if (window.SkylandVoice) {
    window.SkylandVoice.init();
  }

  // Initialize i18n (language toggle)
  if (window.SkylandI18n) {
    window.SkylandI18n.init();
  }

  // Initialize void form module (webhook submission + AI response)
  if (window.SkylandVoid) {
    window.SkylandVoid.init();
  }

  const navItems = document.querySelectorAll('.nav-item');
  const pages = document.querySelectorAll('.page');
  const mainEl = document.querySelector('main');
  const pageIds = ['core', 'neural', 'flux', 'void'];

  // --- Build scroll indicator dots ---
  const indicatorEl = document.getElementById('scroll-indicator');
  pageIds.forEach((id, i) => {
    if (i > 0) {
      const line = document.createElement('div');
      line.className = 'scroll-line';
      indicatorEl.appendChild(line);
    }
    const dot = document.createElement('div');
    dot.className = 'scroll-dot' + (i === 0 ? ' active' : '');
    dot.dataset.page = id;
    dot.addEventListener('click', () => scrollToPage(id));
    indicatorEl.appendChild(dot);
  });

  const scrollDots = indicatorEl.querySelectorAll('.scroll-dot');
  const progressBar = document.getElementById('scroll-progress-bar');

  // --- Scroll to page ---
  let isNavigating = false;

  function scrollToPage(pageId) {
    const target = document.getElementById(pageId);
    if (!target || isNavigating) return;

    isNavigating = true;

    // Stop voice if leaving Flux module
    const currentPage = getCurrentPage();
    if (currentPage === 'flux' && pageId !== 'flux') {
      if (window.SkylandVoice) {
        window.SkylandVoice.stop();
      }
    }

    // Temporarily disable snap to avoid interference with programmatic scroll
    mainEl.style.scrollSnapType = 'none';

    target.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Re-enable snap and reset lock after scroll completes
    const reEnable = () => {
      mainEl.style.scrollSnapType = '';
      isNavigating = false;
    };
    // Use scrollend event if available, otherwise fallback to timeout
    if ('onscrollend' in mainEl) {
      mainEl.addEventListener('scrollend', reEnable, { once: true });
    } else {
      setTimeout(reEnable, 900);
    }

    // Update URL hash
    history.replaceState(null, '', '#' + pageId);
  }

  // --- Scroll arrow clicks → next section ---
  document.querySelectorAll('.scroll-arrow').forEach(arrow => {
    arrow.addEventListener('click', () => {
      const target = arrow.getAttribute('data-target');
      if (target) scrollToPage(target);
    });
  });

  function getCurrentPage() {
    const inView = document.querySelector('.page.in-view');
    return inView ? inView.id : 'core';
  }

  // --- Sidebar nav clicks ---
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const pageId = item.getAttribute('data-page');
      scrollToPage(pageId);
    });
  });

  // --- Scroll indicator dot clicks ---
  scrollDots.forEach(dot => {
    dot.addEventListener('click', () => {
      scrollToPage(dot.dataset.page);
    });
  });

  // --- IntersectionObserver for section visibility ---
  const observerOptions = {
    root: mainEl,
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const page = entry.target;
      if (entry.isIntersecting) {
        // Mark as in-view for CSS animations
        page.classList.add('in-view');
        
        // Update sidebar nav
        navItems.forEach(n => n.classList.remove('active'));
        const navTarget = document.querySelector(`[data-page="${page.id}"]`);
        if (navTarget) navTarget.classList.add('active');

        // Update scroll indicator dots
        scrollDots.forEach(d => d.classList.remove('active'));
        const activeDot = indicatorEl.querySelector(`[data-page="${page.id}"]`);
        if (activeDot) activeDot.classList.add('active');

        // Update URL hash silently
        history.replaceState(null, '', '#' + page.id);

        // Stop voice when leaving Flux
        if (page.id !== 'flux' && window.SkylandVoice) {
          // Only stop if voice was active
        }
      }
    });
  }, observerOptions);

  pages.forEach(page => observer.observe(page));

  // --- Scroll-driven glass parallax + progress bar ---
  const glassCards = document.querySelectorAll('.page-glass');
  let ticking = false;

  function updateParallax() {
    const vh = mainEl.clientHeight;
    const scrollTop = mainEl.scrollTop;
    const scrollHeight = mainEl.scrollHeight - vh;

    // Progress bar
    progressBar.style.width = (scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0) + '%';

    // Parallax each glass card
    pages.forEach((page, i) => {
      const glass = glassCards[i];
      if (!glass) return;

      const rect = page.getBoundingClientRect();
      const mainRect = mainEl.getBoundingClientRect();
      // How far the page center is from the viewport center (-1 to +1 range)
      const pageCenter = rect.top - mainRect.top + rect.height / 2;
      const viewCenter = vh / 2;
      const offset = (pageCenter - viewCenter) / vh; // -1 = above, 0 = center, +1 = below

      // Clamp to [-1.2, 1.2] for smooth edges
      const clamped = Math.max(-1.2, Math.min(1.2, offset));

      // Transform: slide + opacity (no scale — cards stay static size)
      const translateY = clamped * 60;
      const opacity = 1 - Math.abs(clamped) * 0.5;

      glass.style.transform = `translateY(${translateY}px)`;
      glass.style.opacity = Math.max(opacity, 0.3);
    });

    ticking = false;
  }

  mainEl.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });

  // Initial render
  updateParallax();

  // --- Keyboard navigation ---
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    const currentIdx = pageIds.indexOf(getCurrentPage());
    
    if ((e.key === 'ArrowDown' || e.key === 'PageDown') && currentIdx < pageIds.length - 1) {
      e.preventDefault();
      scrollToPage(pageIds[currentIdx + 1]);
    } else if ((e.key === 'ArrowUp' || e.key === 'PageUp') && currentIdx > 0) {
      e.preventDefault();
      scrollToPage(pageIds[currentIdx - 1]);
    }
  });

  // --- Handle initial hash or default to 'core' ---
  const hash = location.hash.replace('#', '') || 'core';
  if (hash !== 'core' && pageIds.includes(hash)) {
    // Use instant scroll for initial load
    requestAnimationFrame(() => {
      const target = document.getElementById(hash);
      if (target) {
        target.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
    });
  }

  // --- Smart Portal: Live profile sync ---
  const form = document.getElementById('contact-form');
  if (form) {
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        const field = input.getAttribute('data-field');
        const mirror = document.getElementById('scan-' + field);
        if (mirror) mirror.textContent = input.value || '—';
      });
    });
  }

  // --- Flow step traveling light ---
  const flowSteps = document.querySelectorAll('.phil-flow .flow-step');
  if (flowSteps.length) {
    let activeStep = 0;
    flowSteps[0].classList.add('step-active');
    setInterval(() => {
      flowSteps[activeStep].classList.remove('step-active');
      activeStep = (activeStep + 1) % flowSteps.length;
      flowSteps[activeStep].classList.add('step-active');
    }, 2000);
  }
});
