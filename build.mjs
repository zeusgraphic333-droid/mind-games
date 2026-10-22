// Bundle src/js/main.js + src/styles/*.css into one self-contained dist/index.html
//   node build.mjs [--dev]                  → dist/index.html (the whole game)
//   node build.mjs --dev --zone shape       → dist/dev-shape.html (one zone only: lesson + games, routes #/dev/learn · #/dev/game/<n> · #/dev/quiz)
//   node build.mjs --dev --sample           → dist/dev-sample.html (reference lesson with every block type)
//   node build.mjs --dev --zone gestalt --lang en → dist/dev-gestalt.en.html (the English edition: lessons/gestalt.en.js + games/gestalt.en.js)
//   node build.mjs --dev --scenes2d         → dist/dev-scenes2d.html (illustrated scenes: #/ contact sheet · #/s/<name> one scene)
//   --out <file.html> writes to dist/<file.html> instead (parallel work: never two people building the same file)
//   any dev page: ?lang=en|ar and ?mode=illustrated|immersive
import * as esbuild from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';

const root = path.dirname(new URL(import.meta.url).pathname);
const src = p => path.join(root, 'src', p);
const argv = process.argv.slice(2);
const minify = !argv.includes('--dev');
const zone = argv.includes('--zone') ? argv[argv.indexOf('--zone') + 1] : null;
const sample = argv.includes('--sample');
const scenes2d = argv.includes('--scenes2d');
const identArg = argv.includes('--ident');
const langArg = argv.includes('--lang') ? argv[argv.indexOf('--lang') + 1] : '';

const common = { bundle: true, format: 'iife', target: ['es2020'], minify, write: false, legalComments: 'none', charset: 'utf8', define: { 'process.env.NODE_ENV': '"production"' }, logLevel: 'error' };
let opts;
const sfx = langArg === 'en' ? '.en' : '';
if (zone || sample) {
  const imp = sample
    ? `import lesson, { games } from './content/lessons/_sample.js'; devBoot('shape', lesson, games);`
    : `import lesson from './content/lessons/${zone}${sfx}.js'; import games from './games/${zone}${sfx}.js'; devBoot('${zone}', lesson, games, '${langArg}');`;
  opts = { ...common, stdin: { contents: `import { devBoot } from './devboot.js'; ${imp}`, resolveDir: src('js'), sourcefile: 'dev-entry.js', loader: 'js' } };
} else if (scenes2d) opts = { ...common, entryPoints: [src('js/dev2d.js')] };
else if (identArg) opts = { ...common, entryPoints: [src('js/devident.js')] };
else opts = { ...common, entryPoints: [src('js/main.js')] };

const js = await esbuild.build(opts);
const cssFiles = fs.readdirSync(src('styles')).filter(f => f.endsWith('.css')).sort();
const cssRaw = cssFiles.map(f => fs.readFileSync(src('styles/' + f), 'utf8')).join('\n');
const css = await esbuild.transform(cssRaw, { loader: 'css', minify, charset: 'utf8', logLevel: 'error' });
let html = fs.readFileSync(src('index.html'), 'utf8');
const jsCode = js.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
html = html.replace('/*%CSS%*/', () => css.code).replace('/*%JS%*/', () => jsCode);
const outArg = argv.includes('--out') ? argv[argv.indexOf('--out') + 1] : '';
const outName = outArg || (zone ? `dev-${zone}${sfx}.html` : sample ? 'dev-sample.html' : scenes2d ? 'dev-scenes2d.html' : identArg ? 'dev-ident.html' : 'index.html');
fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist', outName), html);
const kb = n => (n / 1024).toFixed(0) + 'KB';
console.log('built dist/' + outName, kb(Buffer.byteLength(html)), '(js', kb(Buffer.byteLength(jsCode)), 'css', kb(Buffer.byteLength(css.code)) + ')');
