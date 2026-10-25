/* Drag-to-resize viewport demo: a browser frame that snaps between a
   medium and a large screen, swapping the screenshot for each. */
(function () {
  document.querySelectorAll('[data-resize]').forEach(function (root) {
    var stage = root.querySelector('.cs-resize__stage');
    var frame = root.querySelector('.cs-resize__frame');
    var handle = root.querySelector('.cs-resize__handle');
    var buttons = root.querySelectorAll('[data-size]');
    var min = parseFloat(root.dataset.min) || 0.77; // medium width as a share of large
    var state = 'm';
    var dragging = false;

    function setWidth(ratio, animate) {
      ratio = Math.max(min, Math.min(1, ratio));
      root.classList.toggle('is-animating', !!animate);
      stage.style.setProperty('--w', (ratio * 100) + '%');
      var next = ratio > (min + 1) / 2 ? 'l' : 'm';
      if (next !== state) {
        state = next;
        root.dataset.state = state;
        buttons.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.size === state); });
        handle.setAttribute('aria-valuetext', state === 'l' ? 'Large screen' : 'Medium screen');
      }
      handle.setAttribute('aria-valuenow', Math.round(ratio * 100));
    }

    function snap() { setWidth(state === 'l' ? 1 : min, true); }

    function ratioAt(x) {
      var r = stage.getBoundingClientRect();
      return (x - r.left) / r.width;
    }

    handle.addEventListener('pointerdown', function (e) {
      dragging = true;
      handle.setPointerCapture(e.pointerId);
      root.classList.add('is-dragging');
      e.preventDefault();
    });
    handle.addEventListener('pointermove', function (e) {
      if (dragging) setWidth(ratioAt(e.clientX), false);
    });
    function end() {
      if (!dragging) return;
      dragging = false;
      root.classList.remove('is-dragging');
      snap();
    }
    handle.addEventListener('pointerup', end);
    handle.addEventListener('pointercancel', end);

    handle.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { state = 'l'; }
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { state = 'm'; }
      else return;
      e.preventDefault();
      setWidth(state === 'l' ? 1 : min, true);
    });

    buttons.forEach(function (b) {
      b.addEventListener('click', function () { setWidth(b.dataset.size === 'l' ? 1 : min, true); });
    });

    root.dataset.state = state;
    setWidth(min, false);
  });
})();
