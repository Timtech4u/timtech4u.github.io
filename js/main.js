/* ═══════════════════════════════════════════════════════════════
   TIMOTHY OLALEKE — Interactive Storytelling Portfolio
   Nothing Design System / Light Theme Default
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // --- THEME TOGGLE ---
  const themeToggle = document.createElement('button');
  themeToggle.className = 'theme-toggle';
  themeToggle.setAttribute('aria-label', 'Toggle theme');
  themeToggle.innerHTML = `
    <svg class="icon-sm theme-toggle__sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
    <span class="theme-toggle__text">LIGHT</span>
  `;
  document.body.prepend(themeToggle);

  const moonSvg = `<svg class="icon-sm theme-toggle__moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  const sunSvg = `<svg class="icon-sm theme-toggle__sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;

  function setTheme(dark) {
    document.body.classList.toggle('dark', dark);
    themeToggle.innerHTML = dark
      ? `${sunSvg}<span class="theme-toggle__text">DARK</span>`
      : `${moonSvg}<span class="theme-toggle__text">LIGHT</span>`;
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }

  // Initialize — respect saved preference, default light
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') {
    setTheme(true);
  } else {
    setTheme(false);
  }

  themeToggle.addEventListener('click', function () {
    setTheme(!document.body.classList.contains('dark'));
  });

  // --- SCROLL REVEAL ---
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Start counter animation if it's a stat card
          const counter = entry.target.querySelector('[data-count]');
          if (counter && !counter.dataset.animated) {
            animateCounter(counter);
          }
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  reveals.forEach(function (el) {
    revealObserver.observe(el);
  });

  // --- COUNTER ANIMATION ---
  function animateCounter(el) {
    el.dataset.animated = 'true';
    const target = parseInt(el.dataset.count, 10);
    const duration = 1500;
    const start = performance.now();

    function easeOut(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(easeOut(progress) * target);
      el.textContent = value;
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }

  // --- CHAPTER NAV ACTIVE STATE ---
  const sections = document.querySelectorAll('.hero, .section');
  const navItems = document.querySelectorAll('.chapter-nav__item');

  const navObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navItems.forEach(function (item) {
            item.classList.toggle('active', item.dataset.section === id);
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  sections.forEach(function (section) {
    navObserver.observe(section);
  });

  // Smooth scroll for nav links
  navItems.forEach(function (item) {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.getElementById(this.dataset.section);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // --- SCROLL PROGRESS ---
  var scrollProgress = document.getElementById('scrollProgress');
  if (scrollProgress) {
    window.addEventListener('scroll', function () {
      var scrolled = window.scrollY;
      var total = document.documentElement.scrollHeight - window.innerHeight;
      var percent = (scrolled / total) * 100;
      scrollProgress.style.height = percent + '%';
    });
  }

  // --- HIDE SCROLL HINT ON SCROLL ---
  var scrollHint = document.getElementById('scrollHint');
  if (scrollHint) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 100) {
        scrollHint.style.opacity = '0';
        scrollHint.style.transform = 'translateY(20px)';
      } else {
        scrollHint.style.opacity = '1';
        scrollHint.style.transform = 'translateY(0)';
      }
    }, { passive: true });
  }

  // --- TAG INDEX FOR STAGGER ---
  document.querySelectorAll('.craft__tags').forEach(function (group) {
    group.querySelectorAll('.tag').forEach(function (tag, i) {
      tag.style.setProperty('--tag-index', i);
    });
  });

})();
