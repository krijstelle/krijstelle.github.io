// Principle videos: only the one nearest the middle of the screen plays.
// The others pause on their current frame. Reduced motion: none autoplay.
(function () {
  var videos = Array.prototype.slice.call(document.querySelectorAll('video[data-play-in-view]'));
  if (!videos.length) return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    videos.forEach(function (v) { v.pause(); });
    return;
  }

  var visible = new Set();

  function update() {
    var mid = window.innerHeight / 2;
    var best = null, bestDist = Infinity;
    visible.forEach(function (v) {
      var r = v.getBoundingClientRect();
      var d = Math.abs(r.top + r.height / 2 - mid);
      if (d < bestDist) { bestDist = d; best = v; }
    });
    videos.forEach(function (v) {
      if (v === best) {
        if (v.paused) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
      } else if (!v.paused) {
        v.pause();
      }
    });
  }

  // Only the middle 40% of the screen counts as "in view"
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) visible.add(e.target); else visible.delete(e.target);
    });
    update();
  }, { rootMargin: '-30% 0px -30% 0px' });

  videos.forEach(function (v) { v.pause(); io.observe(v); });
  window.addEventListener('scroll', function () { if (visible.size > 1) update(); }, { passive: true });
})();
