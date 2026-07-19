  const html = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  const status = document.getElementById('status');

  function setTheme(theme){
    html.setAttribute('data-theme', theme);
    status.textContent = theme === 'dark' ? 'Dark mode' : 'Light mode';
    localStorage.setItem('theme-demo', theme);
  }

  const saved = localStorage.getItem('theme-demo');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(saved || (prefersDark ? 'dark' : 'light'));

  toggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });
