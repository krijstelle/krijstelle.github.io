// Case study carousel: native swipe/scroll-snap, plus mouse drag, buttons, dots and arrow keys
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-carousel]').forEach((root) => {
    const track = root.querySelector('.cs-carousel__track');
    const slides = [...track.querySelectorAll('.cs-carousel__slide')];
    const dotsWrap = root.querySelector('.cs-carousel__dots');
    const prev = root.querySelector('[data-prev]');
    const next = root.querySelector('[data-next]');
    let current = 0;

    const dots = slides.map((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'cs-carousel__dot';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Slide ${i + 1} of ${slides.length}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
      return dot;
    });

    // Scroll so the slide sits in the centre of the track
    const goTo = (i) => {
      const index = Math.max(0, Math.min(slides.length - 1, i));
      const slide = slides[index];
      const box = track.getBoundingClientRect();
      const r = slide.getBoundingClientRect();
      const left = track.scrollLeft + (r.left + r.width / 2) - (box.left + box.width / 2);
      track.scrollTo({ left, behavior: 'smooth' });
    };

    // The active slide is the one closest to the centre of the visible track
    const update = () => {
      const box = track.getBoundingClientRect();
      const centre = box.left + box.width / 2;
      let best = 0;
      let bestDist = Infinity;
      slides.forEach((slide, i) => {
        const r = slide.getBoundingClientRect();
        const dist = Math.abs(r.left + r.width / 2 - centre);
        if (dist < bestDist) { bestDist = dist; best = i; }
      });
      current = best;
      slides.forEach((slide, i) => slide.classList.toggle('is-active', i === best));
      dots.forEach((dot, i) => dot.setAttribute('aria-selected', i === best ? 'true' : 'false'));
      prev.disabled = best === 0;
      next.disabled = best === slides.length - 1;
    };

    let ticking = false;
    track.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { update(); ticking = false; });
    }, { passive: true });
    window.addEventListener('resize', update);

    prev.addEventListener('click', () => goTo(current - 1));
    next.addEventListener('click', () => goTo(current + 1));

    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(current - 1); }
    });

    // Mouse drag (touch and trackpads already swipe natively)
    let dragging = false;
    let startX = 0;
    let startLeft = 0;
    let moved = 0;
    let startIndex = 0;
    track.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse') return;
      dragging = true;
      moved = 0;
      startIndex = current;
      startX = e.clientX;
      startLeft = track.scrollLeft;
      track.classList.add('is-dragging');
    });
    window.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      moved = e.clientX - startX;
      track.scrollLeft = startLeft - moved;
    });
    window.addEventListener('pointerup', () => {
      if (!dragging) return;
      dragging = false;
      track.classList.remove('is-dragging');
      // Settle on the nearest slide; a short drag still moves one slide
      update();
      let target = current;
      if (current === startIndex && moved < -60) target = startIndex + 1;
      if (current === startIndex && moved > 60) target = startIndex - 1;
      goTo(target);
    });

    track.addEventListener('scrollend', update);
    update();
    root.classList.add('is-ready');
  });
});
