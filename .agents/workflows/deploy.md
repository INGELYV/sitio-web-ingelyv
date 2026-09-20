---
description: Despliega el sitio web de INGELYV SPA en Cloudflare Pages (push a main → GitHub Actions → wrangler)
---

# Deploy del sitio web INGELYV SPA (Cloudflare Pages)

El sitio se publica en **Cloudflare Pages**, proyecto `ingelyv` (https://ingelyv.pages.dev), con los dominios `www.ingelyv.cl` e `ingelyv.cl`.
Solo se publica la carpeta `dist/`, que arma `scripts/build-dist.sh` con una lista blanca de archivos públicos.

## Opción 1: Automático (recomendado)
Todo push a `main` ejecuta `.github/workflows/deploy.yml`: build de `dist/` y `wrangler pages deploy`.
Lo habitual es trabajar en una rama y hacer merge de un PR hacia `main`.

- Requiere el secret `CLOUDFLARE_API_TOKEN` en GitHub (token con permiso *Account → Cloudflare Pages → Edit*).
- Se puede ejecutar a mano desde GitHub → Actions → *Deploy Website to Cloudflare Pages* → **Run workflow**.
- Revisar el resultado en https://github.com/INGELYV/sitio-web-ingelyv/actions

## Opción 2: Manual (wrangler)
```powershell
bash scripts/build-dist.sh
npx wrangler pages deploy --branch main
```

> **Importante:** nunca desplegar `.` (la raíz), porque publicaría `CLAUDE.md`, `.agents/` y otros archivos internos.

## Verificación
- https://ingelyv.pages.dev y https://www.ingelyv.cl cargan las 5 páginas.
- `https://www.ingelyv.cl/CLAUDE.md` responde 404.

## Notas
- Cloudflare Pages resuelve HTTPS, las URLs limpias (`/servicios.html` → `/servicios`) y la página `404.html`. Por eso no se usa `.htaccess`.
- Cabeceras o redirecciones propias: usar los archivos `_headers` / `_redirects` en la raíz; `build-dist.sh` los copia a `dist/` si existen.
- El formulario de contacto no tiene backend: abre WhatsApp con el mensaje armado y ofrece un respaldo `mailto:`.
