/* Shared footer statistics. Only the public GitHub Pages hostname is counted. */
(() => {
  const footer = document.querySelector('.site-footer');
  if (!footer || footer.querySelector('.site-stats')) return;

  const panel = document.createElement('div');
  panel.className = 'site-stats';
  panel.dataset.state = 'loading';
  panel.innerHTML = `
    <div class="site-stats-values">
      <span><span data-stats-label="visitors"></span> <strong id="busuanzi_value_site_uv">—</strong></span>
      <span><span data-stats-label="views"></span> <strong id="busuanzi_value_site_pv">—</strong></span>
    </div>
    <p class="site-stats-note" aria-live="polite"></p>
    <a href="https://busuanzi.ibruce.info/" target="_blank" rel="noreferrer" class="site-stats-provider"></a>`;
  footer.insertBefore(panel, footer.querySelector(':scope > p'));

  const note = panel.querySelector('.site-stats-note');
  const provider = panel.querySelector('.site-stats-provider');
  const labels = {
    zh: { visitors: '全站累计访客（UV）', views: '全站累计浏览（PV）', loading: '统计加载中…',
      ready: '接入后累计；访客数为服务估算值，并非精确人数。',
      unavailable: '统计暂不可用，不影响页面浏览。', preview: '本地及预览环境不计入统计。', provider: '统计服务：不蒜子 ↗' },
    en: { visitors: 'Site visitors (UV)', views: 'Site page views (PV)', loading: 'Loading statistics…',
      ready: 'Counted since integration. Visitor totals are estimates, not exact people counts.',
      unavailable: 'Statistics unavailable. The site still works normally.', preview: 'Local and preview visits are not counted.', provider: 'Statistics: Busuanzi ↗' },
  };
  const renderLabels = () => {
    const text = labels[document.documentElement.lang.startsWith('en') ? 'en' : 'zh'];
    panel.querySelectorAll('[data-stats-label]').forEach((label) => { label.textContent = text[label.dataset.statsLabel]; });
    note.textContent = text[panel.dataset.state];
    provider.textContent = text.provider;
  };
  const setState = (state) => { panel.dataset.state = state; renderLabels(); };
  new MutationObserver(renderLabels).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  if (location.hostname !== 'wild-firefox.github.io' || location.protocol !== 'https:') {
    setState('preview');
    return;
  }

  renderLabels();
  const start = () => {
    if (document.getElementById('site-stats-provider-script')) return;
    const values = [...panel.querySelectorAll('strong')];
    const observer = new MutationObserver(() => {
      if (!values.every((value) => /^\d+$/.test(value.textContent.trim()))) return;
      window.clearTimeout(timeout);
      observer.disconnect();
      setState('ready');
    });
    observer.observe(panel.querySelector('.site-stats-values'), { childList: true, subtree: true, characterData: true });
    const timeout = window.setTimeout(() => setState('unavailable'), 10000);
    const script = document.createElement('script');
    script.id = 'site-stats-provider-script';
    script.src = 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';
    script.async = true;
    script.referrerPolicy = 'strict-origin-when-cross-origin';
    script.addEventListener('error', () => { window.clearTimeout(timeout); setState('unavailable'); }, { once: true });
    document.head.append(script);
  };
  const schedule = () => {
    if ('requestIdleCallback' in window) window.requestIdleCallback(start, { timeout: 1500 });
    else window.setTimeout(start, 600);
  };
  if (document.readyState === 'complete') schedule();
  else window.addEventListener('load', schedule, { once: true });
})();
