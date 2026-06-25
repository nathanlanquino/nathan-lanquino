/* ==========================================================================
   Nathan Lanquino — Operations & Systems Specialist
   Production JavaScript
   ========================================================================== */

(function () {
  'use strict';

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close mobile menu after a nav link is clicked
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close mobile menu on outside click
    document.addEventListener('click', function (e) {
      if (!navLinks.classList.contains('open')) return;
      if (navLinks.contains(e.target) || navToggle.contains(e.target)) return;
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });
  }

  /* ---------- Active nav link on scroll (scrollspy) ---------- */
  var sections = document.querySelectorAll('main section[id]');
  var navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  function updateActiveNav() {
    var scrollPos = window.scrollY + 120;
    var current = null;

    sections.forEach(function (section) {
      if (section.offsetTop <= scrollPos) {
        current = section.getAttribute('id');
      }
    });

    navAnchors.forEach(function (a) {
      var href = a.getAttribute('href').replace('#', '');
      a.classList.toggle('active', href === current);
    });
  }

  var scrollSpyTicking = false;
  window.addEventListener('scroll', function () {
    if (!scrollSpyTicking) {
      window.requestAnimationFrame(function () {
        updateActiveNav();
        scrollSpyTicking = false;
      });
      scrollSpyTicking = true;
    }
  });
  updateActiveNav();

  /* ---------- Scroll reveal animations ---------- */
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    // Fallback: just show everything
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Testimonial carousel ---------- */
  var testimonials = [
    {
      quote: "The improvements allowed leadership to make decisions faster and with greater confidence because information was readily available and reliable.",
      name: "Operations Director",
      title: "Healthcare Recruitment Industry"
    }
  ];

  // Additional testimonials can be appended to the array above as they come in.
  // Each one needs: quote, name, title.

  var dots = document.querySelectorAll('.testimonial-dots .dot');
  var quoteEl = document.querySelector('.testimonial-text');
  var nameEl = document.querySelector('.author-name');
  var titleEl = document.querySelector('.author-title');
  var currentTestimonial = 0;
  var testimonialTimer = null;

  function renderTestimonial(index) {
    if (!testimonials[index] || !quoteEl) return;
    var t = testimonials[index];
    quoteEl.textContent = t.quote;
    if (nameEl) nameEl.textContent = t.name;
    if (titleEl) titleEl.textContent = t.title;
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === index);
    });
  }

  if (dots.length) {
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        currentTestimonial = i % testimonials.length;
        renderTestimonial(currentTestimonial);
      });
    });
  }

  // Only auto-rotate if there's more than one testimonial loaded
  if (testimonials.length > 1) {
    testimonialTimer = setInterval(function () {
      currentTestimonial = (currentTestimonial + 1) % testimonials.length;
      renderTestimonial(currentTestimonial);
    }, 6000);
  }

  /* ---------- Back to top button ---------- */
  var backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      backToTop.classList.toggle('visible', window.scrollY > 600);
    });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Contact form validation + submission ---------- */
  var form = document.getElementById('contact-form');

  if (form) {
    var statusEl = form.querySelector('.form-status');

    function setFieldError(field, message) {
      var errorEl = form.querySelector('[data-error-for="' + field.id + '"]');
      if (errorEl) errorEl.textContent = message || '';
      field.setAttribute('aria-invalid', message ? 'true' : 'false');
    }

    function validateField(field) {
      if (field.hasAttribute('required') && !field.value.trim()) {
        setFieldError(field, 'This field is required.');
        return false;
      }
      if (field.type === 'email' && field.value.trim()) {
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(field.value.trim())) {
          setFieldError(field, 'Enter a valid email address.');
          return false;
        }
      }
      setFieldError(field, '');
      return true;
    }

    form.querySelectorAll('input, textarea').forEach(function (field) {
      field.addEventListener('blur', function () { validateField(field); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var fields = Array.prototype.slice.call(form.querySelectorAll('input, textarea'));
      var isValid = fields.every(function (field) { return validateField(field); });

      if (!isValid) {
        if (statusEl) {
          statusEl.textContent = 'Please fix the highlighted fields and try again.';
          statusEl.className = 'form-status error';
        }
        return;
      }

      var submitBtn = form.querySelector('.btn-submit');
      var originalLabel = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      // NOTE: This form currently has no backend wired up.
      // Replace this block with a real submission, e.g.:
      //   fetch('https://formspree.io/f/YOUR_FORM_ID', { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      // or swap the <form> action/method for a service like Formspree, Netlify Forms, or Getform.
      window.setTimeout(function () {
        if (statusEl) {
          statusEl.textContent = "Thanks — this form isn't connected to an inbox yet. Please email nathan@yourdomain.com directly, or use the Calendly link above.";
          statusEl.className = 'form-status success';
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
        }
      }, 600);
    });
  }

  /* ---------- Current year in footer ---------- */
  var yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
