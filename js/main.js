/* ============================================================
   VISIONARY MINDS — main.js
   Handles: sticky nav, mobile menu, scroll animations,
            contact form, gallery lightbox, back-to-top,
            smooth scroll, active nav link.
   Pattern : IIFE + strict mode; no globals leaked.
   ============================================================ */

'use strict';

(function () {

  /* ── DOM READY ────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    setActiveNav();
    initStickyHeader();
    initMobileNav();
    initSmoothScroll();
    initScrollAnimations();
    initBackToTop();
    initContactForm();
    initGalleryLightbox();
    initCounters();
  });


  /* ── 1. ACTIVE NAV LINK ──────────────────────────────── */
  function setActiveNav() {
    var page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(function (link) {
      var href = link.getAttribute('href') || '';
      if (href === page || (page === '' && href === 'index.html')) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }


  /* ── 2. STICKY HEADER (shadow on scroll) ─────────────── */
  function initStickyHeader() {
    var header = document.getElementById('site-header');
    if (!header) return;

    function onScroll() {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }


  /* ── 3. MOBILE NAV ───────────────────────────────────── */
  function initMobileNav() {
    var toggle = document.getElementById('nav-toggle');
    var menu   = document.getElementById('nav-menu');
    if (!toggle || !menu) return;

    // Open / close
    toggle.addEventListener('click', function () {
      var isOpen = menu.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMobileNav);
    });

    // Close on outside tap
    document.addEventListener('click', function (e) {
      if (menu.classList.contains('open') &&
          !menu.contains(e.target) &&
          !toggle.contains(e.target)) {
        closeMobileNav();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        closeMobileNav();
        toggle.focus();
      }
    });

    function closeMobileNav() {
      menu.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }


  /* ── 4. SMOOTH SCROLL ────────────────────────────────── */
  function initSmoothScroll() {
    var header = document.getElementById('site-header');

    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (!id || id === '#') return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        var offset = header ? header.offsetHeight + 16 : 0;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - offset,
          behavior: 'smooth'
        });
      });
    });
  }


  /* ── 5. SCROLL FADE-IN ANIMATIONS ───────────────────── */
  function initScrollAnimations() {
    var els = document.querySelectorAll('[data-fade]');
    if (!els.length) return;

    // No IntersectionObserver? Just show everything.
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    els.forEach(function (el) { observer.observe(el); });
  }


  /* ── 6. BACK TO TOP ──────────────────────────────────── */
  function initBackToTop() {
    var btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', function () {
      btn.classList.toggle('visible', window.scrollY > 450);
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ── 7. CONTACT FORM ─────────────────────────────────── */
  function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      // Validate required fields
      form.querySelectorAll('[required]').forEach(function (field) {
        var group = field.closest('.form-group');
        if (!field.value.trim()) {
          if (group) group.classList.add('error');
          valid = false;
        } else {
          if (group) group.classList.remove('error');
        }
      });

      // Email pattern check
      var emailField = form.querySelector('#email');
      if (emailField && emailField.value.trim()) {
        var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        var emailGroup = emailField.closest('.form-group');
        if (!emailRe.test(emailField.value.trim())) {
          if (emailGroup) emailGroup.classList.add('error');
          valid = false;
        }
      }

      if (!valid) return;

      // Success state
      var submitBtn = form.querySelector('[type="submit"]');
      var original  = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) {
        submitBtn.textContent = '✓ Message Sent!';
        submitBtn.disabled = true;
        submitBtn.classList.add('btn-success');
      }
      form.reset();

      // Reset button after 4 s
      setTimeout(function () {
        if (submitBtn) {
          submitBtn.textContent = original;
          submitBtn.disabled = false;
          submitBtn.classList.remove('btn-success');
        }
      }, 4000);
    });

    // Clear error on input
    form.querySelectorAll('input, textarea, select').forEach(function (field) {
      field.addEventListener('input', function () {
        var group = field.closest('.form-group');
        if (group) group.classList.remove('error');
      });
    });
  }


  /* ── 8. GALLERY LIGHTBOX ─────────────────────────────── */
  function initGalleryLightbox() {
    var lb       = document.getElementById('lightbox');
    var lbImg    = document.getElementById('lb-img');
    var lbClose  = document.getElementById('lb-close');
    var lbPrev   = document.getElementById('lb-prev');
    var lbNext   = document.getElementById('lb-next');
    var items    = document.querySelectorAll('.gal-item[data-src]');
    if (!lb || !items.length) return;

    var current = 0;
    var srcs    = Array.prototype.map.call(items, function (el) {
      return el.dataset.src;
    });
    var alts = Array.prototype.map.call(items, function (el) {
      return el.dataset.alt || 'Gallery image';
    });

    function openLb(index) {
      current = index;
      lbImg.src = srcs[current];
      lbImg.alt = alts[current];
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
      lbClose.focus();
    }

    function closeLb() {
      lb.classList.remove('open');
      document.body.style.overflow = '';
      if (items[current]) items[current].focus();
    }

    function showNext() {
      current = (current + 1) % srcs.length;
      lbImg.src = srcs[current];
      lbImg.alt = alts[current];
    }

    function showPrev() {
      current = (current - 1 + srcs.length) % srcs.length;
      lbImg.src = srcs[current];
      lbImg.alt = alts[current];
    }

    items.forEach(function (item, i) {
      item.addEventListener('click', function () { openLb(i); });
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLb(i); }
      });
    });

    lbClose.addEventListener('click', closeLb);
    if (lbPrev) lbPrev.addEventListener('click', showPrev);
    if (lbNext) lbNext.addEventListener('click', showNext);

    // Close on backdrop click
    lb.addEventListener('click', function (e) {
      if (e.target === lb) closeLb();
    });

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape')     closeLb();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft')  showPrev();
    });
  }


  /* ── 9. ANIMATED COUNTERS ────────────────────────────── */
  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    if (!('IntersectionObserver' in window)) {
      counters.forEach(function (el) {
        el.textContent = el.dataset.count;
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el     = entry.target;
        var target = parseInt(el.dataset.count, 10);
        var suffix = el.dataset.suffix || '';
        var start  = 0;
        var dur    = 1800;
        var step   = 16;
        var inc    = target / (dur / step);

        observer.unobserve(el);

        var timer = setInterval(function () {
          start += inc;
          if (start >= target) {
            start = target;
            clearInterval(timer);
          }
          el.textContent = Math.floor(start) + suffix;
        }, step);
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { observer.observe(el); });
  }

}());
