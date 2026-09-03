(() => {
  const root = document.documentElement;
  const page = document.body.dataset.page;
  document.querySelectorAll('.desktop-nav, .mobile-nav').forEach((nav) => {
    if (nav.querySelector('[data-page-link="outputs"]')) return;
    const resumeLink = nav.querySelector('a[href="/resume"]');
    if (!resumeLink) return;
    const outputsLink = document.createElement('a');
    outputsLink.href = '/publications';
    outputsLink.dataset.pageLink = 'outputs';
    outputsLink.dataset.zh = '科研成果';
    outputsLink.dataset.en = 'Publications';
    outputsLink.textContent = '科研成果';
    resumeLink.before(outputsLink);
  });
  const languageButton = document.querySelector('.language-toggle');
  const themeButton = document.querySelector('.theme-toggle');
  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const bilingualPages = new Set(['home', 'about']);
  const navigationLabels = new Map([
    ['/', ['首页', 'Home']],
    ['/about', ['关于', 'About']],
    ['/projects', ['项目经历', 'Projects']],
    ['/research', ['研究', 'Research']],
    ['/publications', ['科研成果', 'Publications']],
    ['/resume', ['简历', 'Resume']],
    ['/contact', ['联系', 'Contact']],
  ]);
  document.querySelectorAll('.desktop-nav a, .mobile-nav a').forEach((link) => {
    const labels = navigationLabels.get(link.getAttribute('href'));
    if (!labels) return;
    link.dataset.zh = labels[0];
    link.dataset.en = labels[1];
  });
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) { skipLink.dataset.zh = '跳至正文'; skipLink.dataset.en = 'Skip to content'; }
  document.querySelectorAll(`[data-page-link="${page}"]`).forEach((link) => { link.classList.add('active'); link.setAttribute('aria-current', 'page'); });
  const translatableElements = document.querySelectorAll('[data-zh][data-en]');
  const supportsLanguageSwitch = bilingualPages.has(page);
  let language = supportsLanguageSwitch ? (localStorage.getItem('site-language') || 'zh') : 'zh';
  const applyLanguage = () => {
    root.lang = language === 'zh' ? 'zh-CN' : 'en';
    translatableElements.forEach((element) => { element.textContent = element.dataset[language]; });
    languageButton.textContent = language === 'zh' ? 'EN' : '中';
    languageButton.setAttribute('aria-label', language === 'zh' ? 'Switch to English' : '切换到中文');
    themeButton.setAttribute('aria-label', language === 'zh' ? '切换主题' : 'Toggle theme');
  };
  if (supportsLanguageSwitch) {
    applyLanguage();
    languageButton.addEventListener('click', () => { language = language === 'zh' ? 'en' : 'zh'; localStorage.setItem('site-language', language); applyLanguage(); });
  } else {
    root.lang = 'zh-CN';
    languageButton.hidden = true;
  }
  const savedTheme = localStorage.getItem('site-theme');
  if (savedTheme) root.dataset.theme = savedTheme;
  themeButton.addEventListener('click', () => { const nextTheme = root.dataset.theme === 'light' ? 'dark' : 'light'; root.dataset.theme = nextTheme; localStorage.setItem('site-theme', nextTheme); });
  menuButton.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') === 'true'; menuButton.setAttribute('aria-expanded', String(!open)); mobileNav.hidden = open; });
  document.querySelector('[data-print]')?.addEventListener('click', () => window.print());
  document.querySelector('#year').textContent = new Date().getFullYear();
})();
