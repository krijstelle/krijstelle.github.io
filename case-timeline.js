// A/B test timeline: native horizontal scroll, plus mouse drag and arrow keys
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-timeline]').forEach((root) => {
    const track = root.querySelector('.cs-timeline__track');

    // Fade the right edge only while there is more to scroll
    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      root.classList.toggle('has-more', track.scrollLeft < max - 4);
      root.classList.toggle('has-less', track.scrollLeft > 4);
    };
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();

    const step = () => track.querySelector('.cs-timeline__item').offsetWidth + 24;
    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); track.scrollBy({ left: step(), behavior: 'smooth' }); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); track.scrollBy({ left: -step(), behavior: 'smooth' }); }
    });

    // Mouse drag (touch and trackpads already scroll natively)
    let dragging = false;
    let startX = 0;
    let startLeft = 0;
    track.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse') return;
      dragging = true;
      startX = e.clientX;
      startLeft = track.scrollLeft;
      track.classList.add('is-dragging');
    });
    window.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      track.scrollLeft = startLeft - (e.clientX - startX);
    });
    window.addEventListener('pointerup', () => {
      if (!dragging) return;
      dragging = false;
      track.classList.remove('is-dragging');
    });
    track.addEventListener('dragstart', (e) => e.preventDefault());
  });
});
