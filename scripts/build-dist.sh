#!/usr/bin/env bash
# Arma dist/ solo con los archivos públicos del sitio (lista blanca) para Cloudflare Pages.
# Todo lo que no esté aquí (CLAUDE.md, .agents/, .github/, scripts/…) NO se publica.
# Si agregas un recurso público fuera de css/, js/ o img/, súmalo a esta lista.
set -euo pipefail
cd "$(dirname "$0")/.."

rm -rf dist
mkdir -p dist

cp ./*.html dist/
cp favicon.ico favicon.png qr_whatsapp_INGELYV.png dist/
cp robots.txt sitemap.xml dist/
cp -r css js img dist/

# Configuración propia de Cloudflare Pages, si existe
for f in _headers _redirects; do
  if [ -f "$f" ]; then cp "$f" dist/; fi
done

echo "dist/ listo:"
find dist -type f | sort
