// Swiping "Selected work" cards: fan-out on scroll + drag to scroll
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('cardStack');
  if (!container) return;

  const cards = Array.from(container.querySelectorAll('.card-wrapper'));
  // Update selector to the animator wrapper
  const cardAnimators = Array.from(container.querySelectorAll('.card-animator'));

  // On mobile the card size is read from the page, so the fan effect fits the smaller cards
  let CARD_WIDTH = 400;
  let CARD_MARGIN = 24;
  const measureCards = () => {
    const isMobile = window.matchMedia('(max-width: 640px)').matches;
    CARD_WIDTH = isMobile ? cards[0].offsetWidth : 400;
    CARD_MARGIN = isMobile ? parseFloat(getComputedStyle(cards[0]).marginRight) || 0 : 24;
  };
  measureCards();

  let isDragging = false;
  let startX = 0;
  let scrollLeft = 0;

  // --- Scroll Animation Logic (The Fan Effect) ---
  const handleScroll = () => {
    const currentScrollX = container.scrollLeft;

    cards.forEach((card, index) => {
      // Logic: Where does the card "start" in the scrollable area?
      const startPos = index * (CARD_WIDTH + CARD_MARGIN);

      // Calculate how far we've scrolled past the card's start
      const maxRotate = -15 + (index * 2);

      // We calculate progress between 0 and 1
      let progress = (currentScrollX - startPos) / CARD_WIDTH;

      // Clamp progress
      if (progress < 0) progress = 0;
      if (progress > 1) progress = 1;

      // Calculate rotation
      const rotation = progress * maxRotate;

      // Calculate scale to create depth
      let scaleProgress = (currentScrollX - startPos) / (CARD_WIDTH * 2);
      if (scaleProgress < 0) scaleProgress = 0;
      if (scaleProgress > 1) scaleProgress = 1;

      const scale = 1 - (scaleProgress * 0.05);

      const animator = cardAnimators[index];

      // Explicitly set transform origin here for clarity
      animator.style.transformOrigin = 'top left';

      // Only apply transform to cards that aren't the very last one
      // The last card usually stays flat to indicate end of stack
      if (index !== cards.length - 1) {
        animator.style.transform = `rotate(${rotation}deg) scale(${scale})`;
      } else {
        animator.style.transform = 'scale(1)';
      }
    });
  };

  // Attach scroll listener
  container.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', () => { measureCards(); handleScroll(); });
  // Initial call to set positions on load
  handleScroll();

  // --- Drag to Scroll Logic ---
  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
    container.style.cursor = 'grabbing';
  });

  container.addEventListener('mouseleave', () => {
    isDragging = false;
    container.style.cursor = 'grab';
  });

  container.addEventListener('mouseup', () => {
    isDragging = false;
    container.style.cursor = 'grab';
  });

  container.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll speed multiplier
    container.scrollLeft = scrollLeft - walk;
  });
});


// Page starts dark; once the hero has mostly scrolled away (Selected work is coming up),
// fade the page to light. The nav stays dark while the page is dark or it's over the hero.
(function () {
  const nav  = document.querySelector('.navbar');
  const hero = document.querySelector('.hero');
  if (!nav || !hero) return;
  const update = () => {
    const heroBottom = hero.getBoundingClientRect().bottom;
    const pageDark = heroBottom > window.innerHeight * 0.55;
    document.body.classList.toggle('page-dark', pageDark);
    nav.classList.toggle('navbar--dark', pageDark || heroBottom > nav.offsetHeight);
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
})();
