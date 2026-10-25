// Version toggle: tabs in [data-toggle] switch which panel shows (e.g. carry-on V1, V2, V3).
// Panels crossfade and a pill slides behind the selected tab (styles in styles.css).
(function () {
  document.querySelectorAll('[data-toggle]').forEach(function (group) {
    var tabs = Array.prototype.slice.call(group.querySelectorAll('[role="tab"]'));
    var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });
    var pill = document.createElement('span');
    pill.className = 'cs-toggle__pill';
    pill.setAttribute('aria-hidden', 'true');
    tabs[0].parentNode.insertBefore(pill, tabs[0]);

    function movePill(tab) {
      pill.style.width = tab.offsetWidth + 'px';
      pill.style.transform = 'translateX(' + tab.offsetLeft + 'px)';
    }
    function select(tab) {
      tabs.forEach(function (t, i) {
        var on = t === tab;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        panels[i].classList.toggle('is-active', on);
        panels[i].setAttribute('aria-hidden', on ? 'false' : 'true');
        panels[i].inert = !on;
      });
      movePill(tab);
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(tab); });
      tab.addEventListener('keydown', function (e) {
        var next = e.key === 'ArrowRight' ? tabs[(i + 1) % tabs.length] : e.key === 'ArrowLeft' ? tabs[(i - 1 + tabs.length) % tabs.length] : null;
        if (next) { e.preventDefault(); select(next); next.focus(); }
      });
    });

    // Without JS the panels use [hidden]; with JS they stay rendered so they can fade
    panels.forEach(function (p) { p.hidden = false; p.querySelectorAll('img').forEach(function (img) { img.loading = 'eager'; }); });
    var start = tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0] || tabs[0];
    pill.style.transition = 'none';
    select(start);
    pill.offsetWidth;
    pill.style.transition = '';
    group.classList.add('is-ready');
    function current() { return tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0]; }
    window.addEventListener('resize', function () { movePill(current()); });
    // The page can start hidden (e.g. behind the password screen), so the tabs measure 0 at load.
    // Re-measure, without animating, whenever the tab row's size changes.
    if ('ResizeObserver' in window) {
      new ResizeObserver(function () {
        pill.style.transition = 'none';
        movePill(current());
        pill.offsetWidth;
        pill.style.transition = '';
      }).observe(tabs[0].parentNode);
    }
  });
})();
