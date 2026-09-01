// Merge the two highlight.js themes into one stylesheet whose light/dark split
// is driven by html[data-theme], so it follows the site's toggle rather than
// the OS setting.
const fs = require('fs');
const path = require('path');

const root = 'E:/paramthakkar123.github.io/js/highlightjs/styles';

function scope(css, prefix) {
  // Strip comments, then prefix every selector in every rule. The hljs theme
  // files are flat (no @media / nesting), so a simple rule split is sufficient.
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const rules = [];
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(clean)) !== null) {
    const selectors = m[1]
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .map(s => `${prefix} ${s}`)
      .join(',');
    const body = m[2].trim();
    if (selectors && body) rules.push(`${selectors}{${body}}`);
  }
  return rules.join('\n');
}

const light = fs.readFileSync(path.join(root, 'github.min.css'), 'utf8');
const dark = fs.readFileSync(path.join(root, 'github-dark.min.css'), 'utf8');

const header = `/* highlight.js GitHub themes (v11.9.0), scoped to the site's own theme
   attribute so they follow the header toggle instead of the OS colour scheme.
   Regenerate with scripts/build-hljs-theme.js after upgrading highlight.js. */\n`;

const out = [
  header,
  '/* ---------- light ---------- */',
  scope(light, 'html[data-theme="light"]'),
  '',
  '/* ---------- dark ---------- */',
  scope(dark, 'html[data-theme="dark"]'),
  ''
].join('\n');

fs.writeFileSync('E:/paramthakkar123.github.io/css/hljs-theme.css', out);
console.log('wrote css/hljs-theme.css', fs.statSync('E:/paramthakkar123.github.io/css/hljs-theme.css').size, 'bytes');
