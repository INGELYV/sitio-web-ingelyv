/**
 * Chequeos propios del sitio sobre dist/ (se ejecuta en CI y en local con `npm run check`).
 * No reemplaza la validación de HTML (html-validate); cubre reglas de este proyecto.
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';

const DIST = 'dist';
const pages = readdirSync(DIST).filter((f) => f.endsWith('.html'));
const errors = [];
const warn = (page, msg) => errors.push(`${page}: ${msg}`);

if (pages.length === 0) errors.push('dist/ no tiene páginas. ¿Falta ejecutar npm run build?');

const versions = new Set();

for (const page of pages) {
  const html = readFileSync(join(DIST, page), 'utf8');

  // 0) Los parciales deben quedar resueltos
  if (html.includes('<!-- include:')) warn(page, 'quedaron includes sin resolver (¿se copió el HTML crudo?)');

  // 1) El Play CDN de Tailwind no debe volver
  if (html.includes('cdn.tailwindcss.com')) warn(page, 'carga Tailwind desde el CDN (debe usar css/tailwind.css)');

  // 2) Cada target="_blank" necesita rel="noopener"
  for (const tag of html.match(/<a\b[^>]*target="_blank"[^>]*>/g) || []) {
    if (!/rel="[^"]*noopener/.test(tag)) warn(page, `enlace con target="_blank" sin rel="noopener": ${tag.slice(0, 90)}…`);
  }

  // 3) Un solo <h1>
  const h1 = (html.match(/<h1\b/g) || []).length;
  if (h1 !== 1) warn(page, `tiene ${h1} <h1> (debe ser exactamente 1)`);

  // 4) SEO mínimo (la 404 va con noindex, así que no lleva canonical ni Open Graph)
  const esError = page === '404.html';
  const reglasSeo = [
    ['<title>', /<title>[^<]+<\/title>/],
    ['meta description', /<meta[^>]+name="description"[^>]+content="[^"]+"/],
    ['lang="es-CL"', /<html[^>]+lang="es-CL"/],
    ...(esError
      ? [['meta robots noindex', /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/]]
      : [
          ['canonical', /<link[^>]+rel="canonical"[^>]+href="https:\/\/www\.ingelyv\.cl/],
          ['og:title', /property="og:title"/],
        ]),
  ];
  for (const [label, re] of reglasSeo) {
    if (!re.test(html)) warn(page, `falta ${label}`);
  }

  // 5) Versión de estáticos (?v=) consistente entre páginas
  for (const m of html.matchAll(/(?:css\/[a-z]+\.css|js\/main\.js)\?v=([0-9]+)/g)) versions.add(m[1]);
  for (const m of html.matchAll(/(?:href|src)="((?:css|js)\/[^"?]+)"/g)) warn(page, `${m[1]} sin ?v= (la caché serviría la versión antigua)`);

  // 6) Referencias locales existentes (enlaces internos, imágenes, css, js)
  for (const m of html.matchAll(/(?:href|src)="([^"#:]+)"/g)) {
    const raw = m[1].split('?')[0];
    if (!raw || raw.startsWith('//') || raw.startsWith('mailto') || raw.startsWith('tel')) continue;
    const base = raw.startsWith('/') ? DIST : dirname(join(DIST, page));
    const target = resolve(base, raw.replace(/^\//, ''));
    if (!existsSync(target) && !existsSync(`${target}.html`)) warn(page, `referencia inexistente: ${raw}`);
  }
}

// 7) sitemap.xml debe listar las páginas públicas (sin 404)
const sitemap = readFileSync(join(DIST, 'sitemap.xml'), 'utf8');
for (const page of pages) {
  if (page === '404.html') continue;
  const clean = page === 'index.html' ? '/' : `/${page.replace(/\.html$/, '')}`;
  if (!sitemap.includes(`https://www.ingelyv.cl${clean}<`)) errors.push(`sitemap.xml: falta ${clean}`);
}

if (versions.size > 1) errors.push(`versiones ?v= mezcladas entre páginas: ${[...versions].join(', ')}`);

if (errors.length) {
  console.error(`\n❌ ${errors.length} problema(s):\n` + errors.map((e) => `  - ${e}`).join('\n') + '\n');
  process.exit(1);
}
console.log(`✅ ${pages.length} páginas revisadas: enlaces, SEO, accesibilidad básica, versionado y sitemap.`);
