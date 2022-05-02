function toggleMenu() {
  const isMenuToggled = !document.documentElement.classList.contains('docs-menu-toggled');
  document.documentElement.classList.toggle('docs-menu-toggled', isMenuToggled);
  sessionStorage.setItem('docs-menu', isMenuToggled ? 'toggled' : '');
}

function toggleTheme() {
  const isDark = !document.documentElement.classList.contains('docs-theme-dark');
  document.documentElement.classList.toggle('docs-theme-dark', isDark);
  sessionStorage.setItem('docs-theme', isDark ? 'dark' : 'light');
}

const menuToggle = document.getElementById('docs-menu-toggle');
const themeToggle = document.getElementById('docs-theme-toggle');

// Toggle the menu
menuToggle.addEventListener('click', toggleMenu);

// Toggle the theme
themeToggle.addEventListener('click', toggleTheme);
document.addEventListener('keydown', event => {
  if (
    event.key === '\\' &&
    !event.composedPath().some(el => ['input', 'textarea'].includes(el?.tagName?.toLowerCase()))
  ) {
    event.preventDefault();
    toggleTheme();
  }
});
