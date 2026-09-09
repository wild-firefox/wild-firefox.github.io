(() => {
  const vendorUrl = '/assets/vendor/plotly-3.5.0.min.js?v=20260909';
  const chartsUrl = '/assets/js/etf-dashboard-charts.js?v=20260909';
  let started = false;

  const loadScript = (src) => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });

  const preloadCharts = () => {
    const preload = document.createElement('link');
    preload.rel = 'preload';
    preload.as = 'script';
    preload.href = chartsUrl;
    document.head.appendChild(preload);
  };

  const start = async () => {
    if (started) return;
    started = true;
    document.body.dataset.chartsState = 'loading';
    preloadCharts();
    try {
      if (!window.Plotly) await loadScript(vendorUrl);
      await loadScript(chartsUrl);
      document.body.dataset.chartsState = 'ready';
      window.dispatchEvent(new CustomEvent('etf-dashboard:charts-ready'));
    } catch (error) {
      document.body.dataset.chartsState = 'error';
      console.error('ETF dashboard charts failed to load.', error);
    }
  };

  const firstChart = document.querySelector('.plotly-graph-div');
  if ('IntersectionObserver' in window && firstChart) {
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      start();
    }, { rootMargin: '900px 0px' });
    observer.observe(firstChart);
  }

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(start, { timeout: 1400 });
  } else {
    window.setTimeout(start, 350);
  }
})();
