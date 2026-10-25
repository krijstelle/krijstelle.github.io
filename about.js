// About page: photo tilt, timeline draw-on-scroll, dot activation
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Photo tilt toward the cursor ---
  const photo = document.getElementById('aboutPhoto');
  if (photo && !reduceMotion) {
    const MAX_TILT = 6; // degrees

    photo.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const r = photo.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;  // -0.5 → 0.5
      const y = (e.clientY - r.top) / r.height - 0.5;
      photo.style.setProperty('--ry', `${x * MAX_TILT * 2}deg`);
      photo.style.setProperty('--rx', `${-y * MAX_TILT * 2}deg`);
    });

    photo.addEventListener('pointerleave', () => {
      photo.style.setProperty('--rx', '0deg');
      photo.style.setProperty('--ry', '0deg');
    });
  }

  // --- Timeline: rail draws as you scroll ---
  const timeline = document.getElementById('timeline');
  if (!timeline) return;

  // --- Career hover preview (desktop + mouse only; hidden by CSS otherwise) ---
  const preview = document.getElementById('careerPreview');
  const desktopHover = window.matchMedia('(min-width: 1200px) and (hover: hover) and (pointer: fine)');
  if (preview) {
    const slides = preview.querySelectorAll('.career-preview__slide');

    timeline.querySelectorAll('.timeline__item[data-preview]').forEach((item) => {
      item.addEventListener('mouseenter', () => {
        if (!desktopHover.matches) return;
        slides.forEach((slide) => {
          slide.classList.toggle('is-active', slide.dataset.preview === item.dataset.preview);
        });
        preview.classList.add('is-visible');
      });
    });

    timeline.addEventListener('mouseleave', () => preview.classList.remove('is-visible'));
  }

  let ticking = false;
  const updateProgress = () => {
    const r = timeline.getBoundingClientRect();
    // Line reaches a row once that row passes ~60% of the viewport height
    const trigger = window.innerHeight * 0.6;
    let progress = (trigger - r.top) / r.height;
    if (progress < 0) progress = 0;
    if (progress > 1) progress = 1;
    timeline.style.setProperty('--progress', progress);
    ticking = false;
  };

  if (reduceMotion) {
    timeline.style.setProperty('--progress', 1);
  } else {
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    }, { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress();
  }

  // --- Timeline: dots fill when their row enters view ---
  const items = timeline.querySelectorAll('.timeline__item');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('is-active'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-active');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -40% 0px' });

  items.forEach((item) => observer.observe(item));
});
