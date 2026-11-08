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
