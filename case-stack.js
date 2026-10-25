/* Roadmap stack: cards sit in an isometric pile, then fan out side by side
   once the group scrolls into view. Without JS (or with reduced motion) the
   cards just show side by side. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-stack]').forEach(function (root) {
    if (reduce || !('IntersectionObserver' in window)) return;
    root.classList.add('is-stacked');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        root.classList.remove('is-stacked');
        io.disconnect();
      });
    }, { rootMargin: '0px 0px -60% 0px' }); // fan once the stack's top passes 40% down the screen
    io.observe(root);
  });
})();

/* Image pop-up (roadmap cards and any [data-lightbox] link): clicking opens the full image in a dialog with a
   close button, instead of a new tab. Esc or a click outside also closes it. */
(function () {
  var cards = document.querySelectorAll('.cs-stack__card, [data-lightbox]');
  if (!cards.length || typeof HTMLDialogElement !== 'function') return;

  var dialog = document.createElement('dialog');
  dialog.className = 'cs-lightbox';
  dialog.setAttribute('aria-label', 'Enlarged image');
  dialog.innerHTML =
    '<button type="button" class="cs-lightbox__close" aria-label="Close">' +
    '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
    '</button><img class="cs-lightbox__img" alt="">';
  document.body.appendChild(dialog);
  var img = dialog.querySelector('.cs-lightbox__img');

  cards.forEach(function (card) {
    card.addEventListener('click', function (e) {
      e.preventDefault();
      var src = card.querySelector('img');
      img.src = card.getAttribute('href');
      img.alt = src ? src.alt : '';
      dialog.showModal();
      document.documentElement.classList.add('has-lightbox');
    });
  });

  dialog.querySelector('.cs-lightbox__close').addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('close', function () { document.documentElement.classList.remove('has-lightbox'); });
})();
