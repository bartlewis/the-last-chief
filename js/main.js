/* ============================================
   THE LAST CHIEF — Main JavaScript
   Lightbox, Sticky Nav, Scroll Animations, Form
   ============================================ */

(function () {
  'use strict';

  // Wait for DOM to be fully ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {

  // --- Lightbox ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const btnClose = lightbox.querySelector('.lightbox__close');
  const btnPrev = lightbox.querySelector('.lightbox__prev');
  const btnNext = lightbox.querySelector('.lightbox__next');

  // Collect all gallery images
  const galleryItems = Array.from(document.querySelectorAll('[data-gallery]'));
  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    lightbox.hidden = false;
    // Force reflow then add active class for transition
    lightbox.offsetHeight;
    lightbox.classList.add('lightbox--active');
    document.body.style.overflow = 'hidden';
    btnClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('lightbox--active');
    setTimeout(function () {
      lightbox.hidden = true;
      document.body.style.overflow = '';
    }, 300);
  }

  function updateLightbox() {
    var item = galleryItems[currentIndex];
    var img = item.querySelector('img');
    var caption = item.querySelector('figcaption');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = caption ? caption.textContent : '';
    lightboxCounter.textContent = (currentIndex + 1) + ' of ' + galleryItems.length;
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    updateLightbox();
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    updateLightbox();
  }

  // Click to open
  galleryItems.forEach(function (item, i) {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      openLightbox(i);
    });
  });

  // Close
  btnClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  // Prev / Next
  btnPrev.addEventListener('click', function (e) {
    e.stopPropagation();
    prevImage();
  });
  btnNext.addEventListener('click', function (e) {
    e.stopPropagation();
    nextImage();
  });

  // Keyboard
  document.addEventListener('keydown', function (e) {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });

  // Touch swipe
  var touchStartX = 0;
  var touchEndX = 0;

  lightbox.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', function (e) {
    touchEndX = e.changedTouches[0].screenX;
    var diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextImage();
      else prevImage();
    }
  }, { passive: true });


  // --- Sticky Navigation ---
  var nav = document.getElementById('nav');
  var hero = document.getElementById('hero');

  var navObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        nav.classList.remove('nav--visible');
      } else {
        nav.classList.add('nav--visible');
      }
    });
  }, { threshold: 0.1 });

  navObserver.observe(hero);


  // --- Mobile Nav Toggle ---
  var navToggle = document.getElementById('nav-toggle');
  var navLinks = document.getElementById('nav-links');

  navToggle.addEventListener('click', function () {
    var expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !expanded);
    navLinks.classList.toggle('nav__links--open');
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navToggle.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('nav__links--open');
    });
  });


  // --- Scroll Fade-in ---
  var fadeElements = document.querySelectorAll('.fade-in');

  var fadeObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in--visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  fadeElements.forEach(function (el) {
    fadeObserver.observe(el);
  });


  // --- Back to Top ---
  var backToTop = document.getElementById('back-to-top');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) {
      backToTop.classList.add('back-to-top--visible');
    } else {
      backToTop.classList.remove('back-to-top--visible');
    }
  }, { passive: true });

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  // --- Email Signup Form ---
  var form = document.getElementById('signup-form');
  var successMsg = document.getElementById('signup-success');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var btn = form.querySelector('.signup-form__button');
    var originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    // If the Formspree action URL has a real ID, submit via fetch
    var action = form.getAttribute('action');
    if (action && action.indexOf('PLACEHOLDER') === -1) {
      fetch(action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(function (response) {
        if (response.ok) {
          form.hidden = true;
          successMsg.hidden = false;
        } else {
          btn.textContent = originalText;
          btn.disabled = false;
          alert('Something went wrong. Please try again.');
        }
      }).catch(function () {
        btn.textContent = originalText;
        btn.disabled = false;
        alert('Something went wrong. Please try again.');
      });
    } else {
      // Placeholder mode — just show the success message
      setTimeout(function () {
        form.hidden = true;
        successMsg.hidden = false;
      }, 600);
    }
  });

  } // end init()

})();
