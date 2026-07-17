/* ============================================================
   KEVIN BUYA — Portfolio | Multi-Page JS
   ============================================================ */
(function () {
  'use strict';

  // Loader
  const loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hidden'), 400);
    });
  }

  // Nav scroll
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  // Mobile menu
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  if (navToggle && mobileMenu) {
    const mobileLinks = mobileMenu.querySelectorAll('.mobile-menu__link');

    function toggleMenu() {
      const isOpen = mobileMenu.classList.contains('open');
      mobileMenu.classList.toggle('open');
      navToggle.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', !isOpen);
      document.body.style.overflow = isOpen ? '' : 'hidden';
    }

    navToggle.addEventListener('click', toggleMenu);
    mobileLinks.forEach(link => link.addEventListener('click', () => {
      if (mobileMenu.classList.contains('open')) toggleMenu();
    }));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) toggleMenu();
    });
  }

  // Smooth scroll for same-page anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Reveal on scroll
  const revealObserver = new IntersectionObserver(
    (entries) => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    }),
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // Animated counters
  const counterObserver = new IntersectionObserver(
    (entries) => entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    }),
    { threshold: 0.5 }
  );
  document.querySelectorAll('.stat__number[data-count]').forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1500;
    const start = performance.now();
    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.round((1 - Math.pow(1 - progress, 3)) * target);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // Work page filters
  const filterBtns = document.querySelectorAll('.work__filter');
  if (filterBtns.length) {
    const allCards = document.querySelectorAll('.video-card, .project');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Show/hide sections and cards
        document.querySelectorAll('.work-section').forEach(section => {
          if (filter === 'all') {
            section.style.display = '';
          } else {
            const hasMatchingCards = section.querySelectorAll(`[data-category="${filter}"]`).length > 0;
            section.style.display = hasMatchingCards ? '' : 'none';
          }
        });

        allCards.forEach(card => {
          const cat = card.dataset.category;
          if (!cat) return;
          if (filter === 'all' || cat === filter) {
            card.style.display = '';
            card.style.opacity = '0';
            card.style.transform = 'translateY(12px)';
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
              });
            });
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // Testimonial carousel
  const testimonials = document.querySelectorAll('.testimonial');
  const dots = document.querySelectorAll('.testimonials__dot');
  if (testimonials.length > 1) {
    let current = 0;
    let timer;

    function showSlide(i) {
      testimonials.forEach(t => t.classList.remove('active'));
      dots.forEach(d => d.classList.remove('active'));
      testimonials[i].classList.add('active');
      dots[i].classList.add('active');
      current = i;
    }

    dots.forEach(dot => dot.addEventListener('click', () => {
      showSlide(parseInt(dot.dataset.slide, 10));
      clearInterval(timer);
      timer = setInterval(() => showSlide((current + 1) % testimonials.length), 6000);
    }));

    timer = setInterval(() => showSlide((current + 1) % testimonials.length), 6000);
  }

  // Contact form
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (form.querySelector('#name') || {}).value || '';
      const email = (form.querySelector('#email') || {}).value || '';
      const message = (form.querySelector('#message') || {}).value || '';
      if (!name.trim() || !email.trim() || !message.trim()) return;

      const subject = encodeURIComponent('New Project Inquiry from ' + name.trim());
      const phone = (form.querySelector('#phone') || {}).value || '';
      const service = (form.querySelector('#project') || {}).value || 'Not specified';
      const body = encodeURIComponent(
        'Name: ' + name.trim() + '\n' +
        'Email: ' + email.trim() + '\n' +
        (phone ? 'Phone: ' + phone.trim() + '\n' : '') +
        'Service: ' + service + '\n\n' +
        message.trim()
      );
      window.location.href = 'mailto:misfitculturesa@gmail.com?subject=' + subject + '&body=' + body;
    });
  }

  // Lazy load iframes on scroll
  const iframeObserver = new IntersectionObserver(
    (entries) => entries.forEach(entry => {
      if (entry.isIntersecting) {
        const iframe = entry.target;
        if (iframe.dataset.src) {
          iframe.src = iframe.dataset.src;
        }
        iframeObserver.unobserve(iframe);
      }
    }),
    { rootMargin: '200px' }
  );
  document.querySelectorAll('iframe[data-src]').forEach(el => iframeObserver.observe(el));

})();
