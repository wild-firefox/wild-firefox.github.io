# Personal profile maintenance

## Resume content

The current download is `assets/files/jiacheng-gu-resume-3.5.pdf`, copied unchanged
from the user-provided 3.5 PDF. It is intentionally public, like the resume page.
Do not copy other local application documents, identity documents, or review files
into published assets. `output/`, `outputs/`, and `tmp/` contain local artifacts
and are ignored by Git.

`resume.html` is the detailed web resume. Related summaries live in `index.html`,
`about.html`, `projects.html`, `research.html`, `contact.html`, and `blog.html`.
Keep dates, employer names, target role, and results consistent across these pages.
Keep older projects and competitions that are omitted from the one-page PDF.
The three patent entries are retained with their contribution roles distinguished;
the PDF highlights one patent, rather than all three contributions.

New copy has explicit `data-zh` / `data-en` attributes; older strings use the
translation map in `assets/js/resume.js`. Preserve both language versions and do
not nest bilingual elements inside one another: the language switch replaces
each bilingual element's text content. Update the shared JS/CSS version query
on profile pages when editing those assets.

GitHub 200+ stars and CSDN 320,000+ views are figures supplied in resume 3.5,
not live API results. Their labels must continue to say they are recorded figures.

## Visitor statistics

`assets/js/site-stats.js` owns the shared footer counters. `resume.js` loads it
after initializing navigation and translations. It is intentionally separate
from resume content and the ETF dashboard implementation.

- Provider: [Busuanzi](https://busuanzi.ibruce.info/), using its documented
  `busuanzi_value_site_uv` and `busuanzi_value_site_pv` elements.
- UV is a service estimate, not an exact count of people. PV counts page views.
  Figures accumulate through this provider; they do not reconstruct historical
  visits before integration. No arbitrary starting count is added.
- Only HTTPS pages on `wild-firefox.github.io` load the provider. Localhost,
  IP addresses, file previews, and other hostnames never request the service.
- The provider loads asynchronously after page load / idle time. It receives
  visitor requests and referrer information under its own counting mechanism;
  this is third-party traffic measurement, not a local-only counter.
- Each profile page gets one counter panel; the game has its own independent
  implementation and is not changed by this integration.
- Switching language updates labels without loading the provider again.
- Errors or a 10-second timeout show an unavailable message, never fake zeroes.
  Successful late responses can still restore the real counter values.

Preview locally with a static server. A local preview deliberately displays
“本地及预览环境不计入统计” rather than live production counts. Verify actual
numbers separately after deploying to the production hostname. GitHub Pages
remains the existing host; no Sites registration or hosting migration is needed.
