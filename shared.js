//headre
document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
  const btn = dropdown.querySelector('.nav-dropdown-button');
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = dropdown.classList.contains('open');
    document.querySelectorAll('.nav-dropdown.open').forEach(other => {
      other.classList.remove('open');
      other.querySelector('.nav-dropdown-button').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) { dropdown.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
  });
});
document.addEventListener('click', (e) => {
  document.querySelectorAll('.nav-dropdown.open').forEach(dropdown => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
      dropdown.querySelector('.nav-dropdown-button').setAttribute('aria-expanded', 'false');
    }
  });
  const nav = document.querySelector('.navbar');
  if (nav.classList.contains('mobile-open') && !nav.contains(e.target)) closeMobile();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.nav-dropdown.open').forEach(dropdown => {
      dropdown.classList.remove('open');
      dropdown.querySelector('.nav-dropdown-button').setAttribute('aria-expanded', 'false');
    });
    closeMobile();
  }
});
const toggle = document.querySelector('.nav-mobile-toggle');
function closeMobile() {
  document.querySelector('.navbar').classList.remove('mobile-open');
  toggle.setAttribute('aria-expanded', 'false');
}
toggle.addEventListener('click', (e) => {
  e.stopPropagation();
  const open = document.querySelector('.navbar').classList.toggle('mobile-open');
  toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});

/* Mark the current page as active from the URL (handles /page, /page/, /page.html, /index.html) */
const normPath = p => (p || '/').replace(/\/index(\.html)?$/, '/').replace(/\.html$/, '').replace(/\/+$/, '') || '/';
const currentPath = normPath(location.pathname);
document.querySelectorAll('.nav-links .nav-link, .nav-links .nav-dropdown-button').forEach(el => el.classList.remove('active'));
document.querySelectorAll('.nav-links > a.nav-link').forEach(a => {
  if (normPath(new URL(a.getAttribute('href'), location.origin).pathname) === currentPath) { a.classList.add('active'); a.setAttribute('aria-current', 'page'); }
});
document.querySelectorAll('.nav-dropdown').forEach(dd => {
  const btn = dd.querySelector('.nav-dropdown-button');
  const matches = (btn.dataset.match || '').split(/\s+/).filter(Boolean);
  dd.querySelectorAll('.nav-dropdown-item').forEach(a => {
    if (normPath(new URL(a.getAttribute('href'), location.origin).pathname) === currentPath) a.setAttribute('aria-current', 'page');
  });
  if (matches.includes(currentPath)) btn.classList.add('active');
});
document.querySelectorAll('.nav-mobile-menu a').forEach(a => {
  if (normPath(new URL(a.getAttribute('href'), location.origin).pathname) === currentPath) a.classList.add('current');
});

/* Blend the gradient when the hovered/open link is directly next to the active one */
const bars = [...document.querySelectorAll('.nav-links > .nav-link, .nav-links > .nav-dropdown > .nav-link')];
const BLEND_VARS = ['--bar-bg', '--bar-size', '--bar-pos', '--bar-hide'];
let hovered = null;
function clearBar(el) { BLEND_VARS.forEach(v => el.style.removeProperty(v)); }
function updateBlend() {
  // A bar is "lit" if it is the active page, the hovered link, or an open dropdown's button.
  const openBtn = document.querySelector('.nav-dropdown.open > .nav-link');
  const isAnchor = el => el.classList.contains('active') || el === openBtn;
  const lit = new Set(bars.filter(b => b.classList.contains('active') || b === hovered || b === openBtn));
  const inRun = new Set();
  // Group lit bars into runs of directly adjacent links; each run shares one continuous gradient.
  let i = 0;
  while (i < bars.length) {
    if (!lit.has(bars[i])) { i++; continue; }
    let j = i;
    while (j + 1 < bars.length && lit.has(bars[j + 1])) j++;
    if (j > i) {
      const run = bars.slice(i, j + 1);
      const widths = run.map(el => el.getBoundingClientRect().width);
      const total = widths.reduce((a, b) => a + b, 0);
      let offset = 0;
      run.forEach((el, k) => {
        clearTimeout(el._t);
        el.style.setProperty('--bar-bg', 'linear-gradient(90deg, var(--pink), var(--orange))');
        el.style.setProperty('--bar-size', total + 'px 100%');
        el.style.setProperty('--bar-pos', '-' + offset + 'px 0');
        const left = run[k - 1], right = run[k + 1];
        const fromLeft = left && isAnchor(left) ? true : right && isAnchor(right) ? false : !!left;
        el.style.setProperty('--bar-hide', fromLeft ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)');
        offset += widths[k];
        inRun.add(el);
      });
    }
    i = j + 1;
  }
  bars.forEach(el => {
    if (inRun.has(el)) return;
    clearTimeout(el._t);
    el._t = setTimeout(() => clearBar(el), 260); // let the retract animation finish first
  });
}
bars.forEach(b => {
  b.addEventListener('mouseenter', () => { hovered = b; updateBlend(); });
  b.addEventListener('mouseleave', () => { if (hovered === b) hovered = null; updateBlend(); });
});
document.querySelectorAll('.nav-dropdown').forEach(d => new MutationObserver(updateBlend).observe(d, { attributes: true, attributeFilter: ['class'] }));
window.addEventListener('resize', updateBlend);
updateBlend();

//footer

(function () {
  // ===== CONFIG =====
  var WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzYthtYwopTXkSCTaS5o40hsXWVU3QptcM0VjUb2yIrODSZECMT8XiPXXVo0pJH_WTskw/exec'; // Apps Script deployment URL ending in /exec
  var CACHE_KEY   = 'pls_footer_version';
  var TIMEOUT_MS  = 6000;
  // ==================

  var verEl   = document.getElementById('footer-version');
  var wrapEl  = document.getElementById('footer-updated-wrap');
  var updEl   = document.getElementById('footer-updated');
  var yearEl  = document.getElementById('footer-year');

  // Only fills the year if nothing else on the page has already done it.
  if (yearEl && !yearEl.textContent.trim()) {
    yearEl.textContent = new Date().getFullYear();
  }

  var MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  function formatDate(iso) {            // "2026-11-20" -> "20 Nov 2026"
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
    if (!m) return iso || '';
    return parseInt(m[3], 10) + ' ' + MONTHS[parseInt(m[2], 10) - 1] + ' ' + m[1];
  }

  function render(d) {
    if (!d || !d.version) return;
    if (verEl) verEl.textContent = d.version;
    if (wrapEl && updEl && d.date && d.time) {
      updEl.textContent = formatDate(d.date) + ', ' + d.time + '';
      wrapEl.hidden = false;
    }
  }

  function cacheGet() {
    try { return JSON.parse(localStorage.getItem(CACHE_KEY)); } catch (e) { return null; }
  }
  function cacheSet(d) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(d)); } catch (e) {}
  }

  // 1) Show the last known value instantly (falls back to the static HTML if none).
  var cached = cacheGet();
  if (cached) render(cached);

  // 2) Refresh from Apps Script / Google Sheet.
  if (!WEB_APP_URL || WEB_APP_URL.indexOf('PASTE_') === 0) return;

  var ctrl  = window.AbortController ? new AbortController() : null;
  var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, TIMEOUT_MS) : null;

  fetch(WEB_APP_URL + '?_=' + Date.now(), { cache: 'no-store', signal: ctrl ? ctrl.signal : undefined })
    .then(function (r) { return r.json(); })
    .then(function (d) {
      if (d && d.ok) { render(d); cacheSet(d); }
    })
    .catch(function () { /* keep cached / static footer values */ })
    .then(function () { if (timer) clearTimeout(timer); });
})();


