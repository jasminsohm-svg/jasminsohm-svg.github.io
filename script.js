  const menuOpen    = document.getElementById('menuOpen');
  const menuClose   = document.getElementById('menuClose');
  const menuOverlay = document.getElementById('menuOverlay');


  function openMenu() {
    sessionStorage.setItem('menuReturnUrl', window.location.href);
    menuOverlay.classList.add('is-open');
    document.body.classList.add('menu-is-open');
    menuOpen.setAttribute('aria-expanded', 'true');
    menuClose.focus();
  }

  function closeMenu() {
    menuOverlay.classList.remove('is-open');
    document.body.classList.remove('menu-is-open');
    menuOpen.setAttribute('aria-expanded', 'false');
    menuOpen.focus();
  }

  menuOpen.addEventListener('click', openMenu);
  menuClose.addEventListener('click', closeMenu);

  // Menü schließen wenn Seite aus Browser-Cache wiederhergestellt wird (bfcache)
  window.addEventListener('pageshow', () => {
    if (menuOverlay && menuOverlay.classList.contains('is-open')) {
      closeMenu();
    }
  });

  // ESC schließt Menü
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOverlay.classList.contains('is-open')) {
      closeMenu();
    }
  });

// ── STAT-PREV SWIPE SLIDER ──
(function () {
  const slider = document.getElementById('statSlider');
  if (!slider) return;

  const wrap = slider.parentElement;
  const totalSlides = slider.querySelectorAll('.stat-prev__slide').length;
  const dotContainers = slider.querySelectorAll('.stat-prev__dots');
  let currentSlide = 0;
  let startX = 0;
  let isDragging = false;
  let dragDelta = 0;

  function slideWidth() { return wrap.offsetWidth; }

  function updateDots(index) {
    dotContainers.forEach((container) => {
      container.querySelectorAll('.dot').forEach((dot, j) => {
        dot.classList.toggle('dot--active', j === index);
      });
    });
  }

  function goTo(index) {
    currentSlide = Math.max(0, Math.min(index, totalSlides - 1));
    slider.style.transition = 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
    slider.style.transform = `translateX(-${currentSlide * slideWidth()}px)`;
    updateDots(currentSlide);
  }

  // ── Touch ──
  slider.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    dragDelta = 0;
  }, { passive: true });

  slider.addEventListener('touchmove', (e) => {
    dragDelta = e.touches[0].clientX - startX;
  }, { passive: true });

  slider.addEventListener('touchend', () => {
    if (Math.abs(dragDelta) > 40) {
      goTo(dragDelta < 0 ? currentSlide + 1 : currentSlide - 1);
    } else {
      goTo(currentSlide);
    }
    dragDelta = 0;
  });

  // ── Mouse drag ──
  slider.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    dragDelta = 0;
    slider.style.transition = 'none';
    e.preventDefault();
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    dragDelta = e.clientX - startX;
    slider.style.transform = `translateX(${-currentSlide * slideWidth() + dragDelta}px)`;
  });

  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    if (Math.abs(dragDelta) > 40) {
      goTo(dragDelta < 0 ? currentSlide + 1 : currentSlide - 1);
    } else {
      goTo(currentSlide);
    }
    dragDelta = 0;
  });

  // Initialzustand
  goTo(0);
})();

// ── HOME: NAVBAR-HINTERGRUND SYNCHRON ZUM SEITEN-VERLAUF ──
// Damit die sticky Navbar immer exakt den Bildausschnitt zeigt, der auch
// "dahinter" liegen würde (ohne die laggy background-attachment:fixed-Technik).
(function () {
  const page = document.querySelector('.page--home');
  const navbar = page ? page.querySelector('.navbar') : null;
  if (!page || !navbar) return;

  const IMG_W = 941;
  const IMG_H = 1672;
  let scale = 1;
  let offsetX = 0;
  let ticking = false;

  function recompute() {
    const w = page.offsetWidth;
    const h = page.scrollHeight;
    scale = Math.max(w / IMG_W, h / IMG_H);
    offsetX = (w - IMG_W * scale) / 2;
    navbar.style.backgroundSize = `${IMG_W * scale}px ${IMG_H * scale}px`;
    updatePosition();
  }

  function updatePosition() {
    const scrollY = window.scrollY || window.pageYOffset || 0;
    navbar.style.backgroundPosition = `${offsetX}px ${-scrollY}px`;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updatePosition);
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', recompute);
  window.addEventListener('load', recompute);
  recompute();
})();
