//footer
const year = document.getElementById("footer-year");
if (year) {
  year.textContent = new Date().getFullYear();
}

// topnavbra dropdown 1 at a time
document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
  const btn = dropdown.querySelector('.nav-dropdown-button');
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = dropdown.classList.contains('open');

    document.querySelectorAll('.nav-dropdown.open').forEach(other => {
      other.classList.remove('open');
      other.querySelector('.nav-dropdown-button').setAttribute('aria-expanded', 'false');
    });

    if (!isOpen) {
      dropdown.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

document.addEventListener('click', (e) => {
  document.querySelectorAll('.nav-dropdown.open').forEach(dropdown => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
      dropdown.querySelector('.nav-dropdown-button').setAttribute('aria-expanded', 'false');
    }
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.nav-dropdown.open').forEach(dropdown => {
      dropdown.classList.remove('open');
      dropdown.querySelector('.nav-dropdown-button').setAttribute('aria-expanded', 'false');
    });
  }
});
