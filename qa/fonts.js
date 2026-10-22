// Local stand-in for Google Fonts so QA renders the real faces offline.
const fs = require('fs'), path = require('path');
const NM = path.join(__dirname, '..', 'node_modules');
const MAP = [
  ['Alexandria', ['@fontsource-variable/alexandria/index.css'], 'Alexandria Variable'],
  ['IBM Plex Sans Arabic', ['@fontsource/ibm-plex-sans-arabic/300.css', '@fontsource/ibm-plex-sans-arabic/400.css', '@fontsource/ibm-plex-sans-arabic/500.css', '@fontsource/ibm-plex-sans-arabic/600.css', '@fontsource/ibm-plex-sans-arabic/700.css'], 'IBM Plex Sans Arabic'],
  ['Handjet', ['@fontsource-variable/handjet/index.css'], 'Handjet Variable'],
  ['EB Garamond', ['@fontsource/eb-garamond/500.css', '@fontsource/eb-garamond/600.css', '@fontsource/eb-garamond/700.css'], 'EB Garamond'],
  ['Lobster', ['@fontsource/lobster/400.css'], 'Lobster'],
  ['Bebas Neue', ['@fontsource/bebas-neue/400.css'], 'Bebas Neue'],
  ['Courier Prime', ['@fontsource/courier-prime/400.css', '@fontsource/courier-prime/700.css'], 'Courier Prime'],
];
function buildCss() {
  let out = '';
  for (const [g, files, fsname] of MAP) for (const f of files) {
    const full = path.join(NM, f); if (!fs.existsSync(full)) continue;
    const dir = path.dirname(f);
    let css = fs.readFileSync(full, 'utf8').split(`'${fsname}'`).join(`'${g}'`);
    css = css.replace(/url\(\.\/files\/([^)]+)\)/g, (m, file) => `url(https://fonts.gstatic.com/qa/${dir}/files/${file})`);
    out += css + '\n';
  }
  return out;
}
async function installRoutes(page) {
  const css = buildCss();
  await page.route('https://fonts.googleapis.com/**', r => r.fulfill({ status: 200, contentType: 'text/css', body: css }));
  await page.route('https://fonts.gstatic.com/qa/**', r => {
    const rel = decodeURIComponent(new URL(r.request().url()).pathname.replace('/qa/', ''));
    const file = path.join(NM, rel);
    if (fs.existsSync(file)) r.fulfill({ status: 200, contentType: 'font/woff2', body: fs.readFileSync(file) }); else r.fulfill({ status: 404, body: '' });
  });
  await page.route(/^https?:\/\/(?!fonts\.)/, r => r.abort());
}
module.exports = { installRoutes };
