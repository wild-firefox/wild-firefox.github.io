(() => {
  const root = document.documentElement;
  const page = document.body.dataset.page;
  const languageButton = document.querySelector('.language-toggle');
  const themeButton = document.querySelector('.theme-toggle');
  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  document.querySelectorAll(`[data-page-link="${page}"]`).forEach((link) => { link.classList.add('active'); link.setAttribute('aria-current', 'page'); });
  const translatableElements = document.querySelectorAll('[data-zh][data-en]');
  let language = localStorage.getItem('site-language') || 'zh';
  const applyLanguage = () => {
    root.lang = language === 'zh' ? 'zh-CN' : 'en';
    translatableElements.forEach((element) => { element.textContent = element.dataset[language]; });
    languageButton.textContent = language === 'zh' ? 'EN' : '中';
    languageButton.setAttribute('aria-label', language === 'zh' ? 'Switch to English' : '切换到中文');
  };
  applyLanguage();
  if (translatableElements.length < 2) languageButton.hidden = true;
  languageButton.addEventListener('click', () => { language = language === 'zh' ? 'en' : 'zh'; localStorage.setItem('site-language', language); applyLanguage(); });
  const savedTheme = localStorage.getItem('site-theme');
  if (savedTheme) root.dataset.theme = savedTheme;
  themeButton.addEventListener('click', () => { const nextTheme = root.dataset.theme === 'light' ? 'dark' : 'light'; root.dataset.theme = nextTheme; localStorage.setItem('site-theme', nextTheme); });
  menuButton.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') === 'true'; menuButton.setAttribute('aria-expanded', String(!open)); mobileNav.hidden = open; });
  document.querySelector('[data-print]')?.addEventListener('click', () => window.print());
  document.querySelector('#year').textContent = new Date().getFullYear();
})();
