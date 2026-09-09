(() => {
  const applyPlotTheme = () => {
    if (!window.Plotly) return;
    const styles = getComputedStyle(document.documentElement);
    const surface = styles.getPropertyValue('--surface').trim() || '#0d1015';
    const text = styles.getPropertyValue('--text').trim() || '#ededed';
    const muted = styles.getPropertyValue('--muted').trim() || '#9a9fa8';
    const line = styles.getPropertyValue('--line').trim() || '#20242c';
    document.querySelectorAll('.plotly-graph-div').forEach((graph) => {
      if (!graph.layout) return;
      const update = {
        paper_bgcolor: surface,
        plot_bgcolor: surface,
        font: { color: muted },
        'title.font.color': text,
        'legend.font.color': muted,
        'hoverlabel.bgcolor': surface,
        'hoverlabel.bordercolor': line,
        'hoverlabel.font.color': text,
      };
      Object.keys(graph.layout)
        .filter((key) => /^(xaxis|yaxis)\d*$/.test(key))
        .forEach((key) => {
          update[`${key}.color`] = muted;
          update[`${key}.gridcolor`] = line;
          update[`${key}.zerolinecolor`] = line;
          update[`${key}.title.font.color`] = muted;
        });
      window.Plotly.relayout(graph, update);
    });
  };
  const scheduleTheme = () => window.requestAnimationFrame(applyPlotTheme);
  window.addEventListener('load', scheduleTheme, { once: true });
  window.addEventListener('etf-dashboard:charts-ready', scheduleTheme);
  new MutationObserver(scheduleTheme).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
})();
