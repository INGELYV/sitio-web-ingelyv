# CLAUDE.md — Arquitectura de webingelyv (INGELYV SPA)

> Guía para Claude Code en este repositorio. Describe la arquitectura **tal como está hoy**, los patrones vigentes y las reglas a seguir en cada iteración.
>
> Este archivo no se publica: Cloudflare Pages solo recibe `dist/` (lista blanca de `scripts/build-dist.sh`). Aun así, no escribas aquí secretos ni tokens.

---

## 1. Resumen del proyecto

- **Qué es:** sitio corporativo de INGELYV SPA (registro empresarial, sitios web corporativos, automatización e IA, reclutamiento y consultoría), ubicada en Concepción, Chile.
- **Origen:** creado en Antigravity y migrado a Claude Code.
- **Dominio:** `https://www.ingelyv.cl` (también `https://ingelyv.cl`). El DNS y el proxy están en Cloudflare.
- **Hosting:** Cloudflare Pages, proyecto `ingelyv` (`https://ingelyv.pages.dev`). `www.ingelyv.cl` e `ingelyv.cl` son dominios personalizados del proyecto (DNS: CNAME → `ingelyv.pages.dev`, proxied). El FTP (Web Host Chile) y n8n están **retirados**.
- **Repositorio:** `INGELYV/sitio-web-ingelyv` (público), rama de producción `main`.
- **Idioma:** español de Chile (`lang="es-CL"`). La documentación también va en español.

---

## 2. Stack tecnológico

| Capa | Tecnología | Notas |
|---|---|---|
| Marcado | HTML5 estático, multipágina (MPA) | Sin framework ni plantillas |
| Estilos | Tailwind CSS **Play CDN** (`cdn.tailwindcss.com?plugins=forms,container-queries`) | `tailwind.config` inline en el `<head>` de **cada** página |
| Estilos propios | `css/styles.css` (~500 líneas) | Tokens, utilidades propias y ajustes responsive |
| Comportamiento | `js/main.js` (JS puro) | Un único script compartido por todas las páginas |
| SEO | JSON-LD (`Organization`, `ProfessionalService` y `FAQPage` en servicios), OG/Twitter, canonical | Imagen OG dedicada: `img/og-ingelyv.png` (1200×630) |
| Imágenes | `img/` con `<picture>` WebP + fallback JPG/PNG; hero desde Unsplash | |
| Tipografía / iconos | Google Fonts: **Space Grotesk** + **Material Symbols Outlined** | |
| Formulario | Sin backend: abre WhatsApp con el mensaje armado + respaldo `mailto:` | Ver §4.6 |
| Mapa | Iframe de Google Maps (Contacto) | |
| Build | `scripts/build-dist.sh` (bash) | Copia los archivos públicos a `dist/` (lista blanca) |
| CI/CD | GitHub Actions → `cloudflare/wrangler-action@v3` | Cada push a `main` despliega `dist/` a Cloudflare Pages |

No hay `package.json`, dependencias npm, tests ni linter.

---

## 3. Estructura del proyecto

```
/
├── index.html              # Inicio: hero dividido, ecosistema y 3 pilares
├── servicios.html          # 5 tarjetas de servicio + FAQ (con JSON-LD FAQPage) + CTA
├── nosotros.html           # Historia (línea de tiempo), misión/visión/valores, banner, equipo, CTA
├── contacto.html           # TEMA OSCURO: info, formulario #contact-form (WhatsApp/email), mapa
├── 404.html                # Página de error con enlaces rápidos
├── css/styles.css          # Tokens, utilidades propias y ajustes responsive
├── js/main.js              # Menú móvil, enlace activo, reveal, formulario, scroll suave
├── img/
│   ├── logo-ingelyv.png                    # Logo (header, footer)
│   ├── og-ingelyv.png                      # Imagen Open Graph / Twitter
│   ├── ecosistema-ingelyv.{webp,png}       # Imagen del ecosistema (index)
│   ├── fundador-ceo-ingelyv.{webp,jpg}     # Equipo (nosotros)
│   └── fundador-cto-ingelyv.jpg            # Equipo (nosotros)
├── favicon.ico / favicon.png               # Referenciados con ?v=N para evitar caché
├── qr_whatsapp_INGELYV.png                 # QR de WhatsApp (no referenciado por las páginas)
├── robots.txt / sitemap.xml                # SEO: URLs limpias, dominio www, bots de IA permitidos
├── scripts/build-dist.sh   # Arma dist/ para Cloudflare Pages (lista blanca)
├── dist/                   # Salida del build (ignorada por git)
├── .github/workflows/deploy.yml            # Build + deploy de dist/ a Cloudflare Pages
├── .agents/                # Documentación heredada de Antigravity (deploy, protocolo de navegación)
└── .gitignore
```

---

## 4. Arquitectura y patrones de diseño

1. **MPA estático sin compilación.** Cada `.html` es autocontenido: `<head>` completo (SEO + JSON-LD), config de Tailwind, header, contenido, footer y script. `build-dist.sh` solo copia archivos, sin transformarlos.
2. **Utility-first con una capa CSS propia.** El layout y la mayoría de los estilos van con clases de Tailwind en el HTML. `styles.css` agrega:
   - tokens en `:root` (`--color-*`, `--shadow-*`);
   - utilidades semánticas reutilizables (`glass-card`, `hover-lift`, etc.);
   - un bloque responsive (`@media (max-width: 767px)` y tablet) que **sobrescribe estilos seleccionando strings de clases de Tailwind** (`section[class*="py-20"]`, `.space-y-12 > div …`) con `!important`.
3. **Mejora progresiva en JS.** `main.js` registra un único `DOMContentLoaded` y cada módulo se activa solo si existe su elemento (*guard clauses*).
4. **Design tokens duplicados en dos lugares:** `tailwind.config.theme.extend.colors` (en cada página) y `:root` en `styles.css`. Deben mantenerse sincronizados.
5. **Enlaces internos con `.html` y URLs públicas limpias.** El HTML enlaza `servicios.html`, `index.html`, etc. Cloudflare Pages sirve URLs limpias de forma nativa (redirige `/x.html` → `/x`). Los canonical, OG y `sitemap.xml` usan siempre la forma limpia `https://www.ingelyv.cl/servicios`.
6. **Formulario sin backend.** `#contact-form` valida `#name` y `#message`, arma un texto con nombre, empresa, teléfono, servicio y mensaje, y abre `https://wa.me/56948004882?text=…`. Luego muestra `#contact-feedback` con enlaces de respaldo a WhatsApp y `mailto:contacto@ingelyv.cl`, construidos con `textContent` (nunca con `innerHTML` y datos del usuario). No se guarda nada en ningún servidor.
7. **SEO por página.** `<title>`, `meta description`, `canonical`, Open Graph, Twitter Card y JSON-LD con URL absoluta `https://www.ingelyv.cl/...`, más `sitemap.xml` y `robots.txt`, que permite explícitamente los bots de IA.
8. **Conversión centrada en WhatsApp.** CTA "Cotizar" en el header, CTA del hero con texto prellenado por servicio y botón flotante verde (con `aria-label`) en todas las páginas.

---

## 5. Jerarquía de componentes

### 5.1 Plantilla de página (común a todas)

```
<html lang="es-CL">
├── <head>
│   ├── meta charset/viewport, <title>, description, canonical
│   ├── favicons (?v=N)
│   ├── Open Graph + Twitter Card (img/og-ingelyv.png)
│   ├── Google Fonts (Space Grotesk, Material Symbols)
│   ├── <script> Tailwind Play CDN + <script> tailwind.config
│   ├── css/styles.css
│   └── <script type="application/ld+json"> (Organization, ProfessionalService[, FAQPage])
└── <body class="… flex flex-col min-h-screen page-fade-in">   (contacto: + dark-page blueprint-pattern)
    ├── <header> sticky
    │   ├── Logo (img/logo-ingelyv.png) → index.html
    │   ├── <nav> escritorio: .nav-link × 4 (Inicio, Servicios, Nosotros, Contacto)
    │   ├── CTA "Cotizar" (wa.me con texto prellenado)
    │   ├── #mobile-menu-btn (icono menu/close)
    │   └── #mobile-menu.mobile-menu (mismos enlaces + CTA)
    ├── <main class="flex-grow">  → secciones propias de cada página (un <h1> por página)
    ├── <footer> bg-primary, borde naranjo
    │   ├── Logo + claim + iconos (web, mail)
    │   ├── Columnas: Navegación | Servicios | Contacto
    │   └── Barra de copyright
    ├── Botón flotante de WhatsApp (fixed bottom-6 right-6, aria-label)
    └── <script src="js/main.js">
```

### 5.2 Secciones por página

| Página | Secciones (en orden) |
|---|---|
| `index.html` | Hero dividido (`.split-screen-container` > 2 × `.split-panel`) · Ecosistema (`<picture>` WebP) · Soluciones (3 `glass-card hover-lift`) |
| `servicios.html` | Banner hero (`bg-primary`) · Grid de 5 servicios (Registro Empresarial Full, Sitios Web, Automatización e IA, Reclutamiento, Consultoría) · FAQ · CTA |
| `nosotros.html` | Hero "Nosotros" · Historia (línea de tiempo `.space-y-12`) · Misión, visión y valores · Banner estratégico (`h-64`) · Equipo (`#equipo`, 2 perfiles) · Franja CTA |
| `contacto.html` | Hero de contacto (info + tarjetas / formulario `#contact-form`) · Mapa (iframe) |
| `404.html` | Mensaje 404 + enlaces rápidos |

### 5.3 Componentes duplicados (editar en las 5 páginas a la vez)

Header y menú móvil · footer · botón flotante de WhatsApp · bloque `<head>` (favicons, fuentes, Tailwind) · `tailwind.config` · JSON-LD de `Organization`/`ProfessionalService` (en 4 páginas). **Excepción:** `contacto.html` usa variantes oscuras del header y footer, así que el cambio se aplica a mano respetando su paleta.

### 5.4 Módulos de `js/main.js`

| Módulo | Disparador / elementos | Efecto |
|---|---|---|
| Menú móvil | `#mobile-menu-btn`, `#mobile-menu` | Alterna `.open` y cambia el icono `menu`/`close` |
| Enlace activo | `.nav-link` + `location.pathname` | Normaliza ambos lados (`/servicios`, `/servicios.html`, `servicios.html` → `servicios`; `/` → `index`) y agrega `.nav-link-active` |
| Scroll reveal | `.reveal` | Agrega `.active` cuando el elemento entra en el viewport (−100 px) |
| Formulario | `#contact-form` con `#name #company #phone #sector #message` | Valida, abre WhatsApp con el mensaje y muestra `#contact-feedback` con respaldo por email |
| Scroll suave | `a[href^="#"]` | Desplaza con un offset de 80 px y cierra el menú móvil |

El mensaje usa el **texto visible** de la opción elegida en `<select id="sector">`, así que agregar o renombrar servicios no requiere tocar `main.js`.

---

## 6. Sistema de diseño

**Colores (páginas claras):**

| Token | Valor | Uso |
|---|---|---|
| `primary` | `#002D62` | Azul institucional: textos, header CTA, footer |
| `primary-light` | `#1a4b8a` | Hover de primary y gradientes |
| `accent-orange` | `#FF8C00` | Acentos, CTA del hero, títulos del footer |
| `accent-orange-hover` | `#e67e00` | Hover |
| `background-light` | `#f5f5f8` | Fondo general |
| `background-dark` | `#0f0f23` | Reservado |
| `cement-gray` | `#9ca3af` | Solo en `index` y `404` |

**Contacto (tema oscuro):** allí `primary` = `#f2690d` (naranjo), `primary-blue` = `#002D62`, `background-dark` = `#0f172a`, `surface-dark` = `#1e293b` y `border-dark` = `#334155`. ⚠️ En `contacto.html`, `text-primary` es **naranjo**, no azul.

**Tipografía:** Space Grotesk en todo el sitio (`font-display` / `font-body`). Títulos en `font-black`, con `tracking-tight` y a menudo en `uppercase`.

**Radios:** son deliberadamente rectos (`rounded-sm` = 0.125rem). Mantén esa estética.

**Utilidades propias (`styles.css`):** `glass-card`, `hover-lift`, `split-screen-container`/`split-panel`, `blueprint-pattern`, `grid-pattern`, `dark-page`, `reveal`/`reveal.active`, `mobile-menu`/`.open`, `nav-link-active`, `form-input`, `page-fade-in`.
Hay CSS definido que conviene verificar con grep antes de reutilizarlo, porque podría no estar en uso: `service-card`/`service-icon-bg`, `glass-card-dark`, `premium-gradient-bg` y `premium-gradient-text`.

**Iconos:** Material Symbols Outlined. El tamaño se fuerza con `!text-sm`, `!text-lg`, `!text-4xl` o `!text-[20px]`.

**Imágenes:** las locales van en `img/` con nombre kebab-case, en WebP con fallback (`<picture>`) y con `width`/`height` para evitar saltos de layout.

---

## 7. Despliegue y entorno

`.github/workflows/deploy.yml` se ejecuta con cada push a `main` (y manualmente con *Run workflow*): `bash scripts/build-dist.sh` → `wrangler pages deploy dist --project-name=ingelyv --branch=main`. **Todo push a `main` es un deploy a producción.** Requiere el secret `CLOUDFLARE_API_TOKEN` (permiso *Account → Cloudflare Pages → Edit*).

**Migración a Cloudflare Pages: completada (19-09-2026)**
- Deploy automático con el secret `CLOUDFLARE_API_TOKEN`.
- Dominios `www.ingelyv.cl` e `ingelyv.cl` activos en *Workers & Pages → ingelyv → Custom domains*, con registros DNS `CNAME → ingelyv.pages.dev` (proxied). Los registros MX/TXT del correo no se tocan.
- Rollback de emergencia (hosting antiguo): `ingelyv.cl` A → `107.190.131.66` y `www` CNAME → `ingelyv.cl`.
- Redirect Rule *"Redirect from root to WWW"* (zona `ingelyv.cl` → Rules): `https://ingelyv.cl/*` → `https://www.ingelyv.cl/${1}` (301, conserva la query string). La versión canónica es `www`.
- Si tras un deploy se ve contenido antiguo, purgar la caché: dominio `ingelyv.cl` → *Caching → Configuration → Purge Everything*.

**Comandos**
- Deploy manual:
  ```bash
  bash scripts/build-dist.sh
  npx wrangler pages deploy dist --project-name ingelyv --branch main
  ```
- **Nunca desplegar `.`** (la raíz). Si agregas un recurso público fuera de `css/`, `js/` o `img/`, súmalo a la lista blanca de `build-dist.sh`.
- Preview local:
  ```bash
  bash scripts/build-dist.sh
  npx serve dist
  ```
- Pages resuelve HTTPS, URLs limpias y `404.html`. Para cabeceras o redirecciones propias se usan `_headers` / `_redirects` en la raíz, y `build-dist.sh` los copia si existen.
- **Conector:** está conectado el conector *Cloudflare Developer Platform* (MCP). Sirve para Workers, KV, R2, D1 y la documentación, pero **no** para Pages: los deploys de Pages van por wrangler o GitHub Actions.
- **GitHub:** usar la CLI `gh` (sesión de la cuenta INGELYV). Nunca guardar tokens en la URL del remoto.

---

## 8. Deuda técnica y riesgos conocidos (priorizados)

1. **Tailwind Play CDN en producción.** No está pensado para producción: implica JS de runtime, un flash sin estilos y peor rendimiento. Migrar a Tailwind CLI con un CSS compilado; encaja con el paso de build de `dist/`.
2. **Formulario sin registro propio.** Las consultas solo llegan si el usuario envía el WhatsApp o el email; no queda copia. Si en el futuro se necesita, evaluar Cloudflare Pages Functions + Turnstile (anti-spam).
3. **Header y footer duplicados en 5 archivos**, con riesgo de desincronización. Considerar parciales en el paso de build.
4. **CSS responsive acoplado a strings de clases Tailwind** (`[class*="…"]` + `!important`). Cambiar una clase en el HTML puede romper silenciosamente el diseño móvil.
5. **Tokens inconsistentes:** `primary` cambia de significado en Contacto y hay naranjos distintos (`#FF8C00`, `#f2690d`, `#FF6B00`). El año del © está escrito a mano.
6. **Enlaces `target="_blank"` sin `rel="noopener"`**, y sin tests, linter ni validación de HTML, enlaces o accesibilidad.

---

## 9. Buenas prácticas para futuras interacciones

**Flujo de trabajo**
- Trabajar en ramas y en cambios pequeños e iterativos, con PR hacia `main`. Nunca hacer push directo a `main` sin verificar, porque despliega a producción.
- Antes de crear una rama, hacer `git fetch` y partir de `origin/main`: el `main` local puede estar desactualizado.
- Verificar cada cambio en el navegador (`bash scripts/build-dist.sh && npx serve dist`), en escritorio y a **375 px** de ancho, y revisar la consola sin errores.
- Commits en español y descriptivos, con prefijo `update:`, `fix:`, `chore:` o `ci:` cuando aplique.
- Nunca commitear tokens, `.wrangler/`, `dist/` ni credenciales.

**Al editar componentes compartidos**
- Header, footer, botón de WhatsApp, `<head>`, `tailwind.config` y JSON-LD deben cambiarse en **todas las páginas** (respetando la variante oscura de `contacto.html`). Después, hacer grep para confirmar que no quedó ninguna sin actualizar.
- Si cambia un color, actualizar tanto `tailwind.config` como `:root` en `styles.css`.

**Al agregar una página**
- Copiar la plantilla completa de una página clara (p. ej. `servicios.html`), con `lang="es-CL"`.
- Actualizar `<title>`, description, canonical (URL limpia), `og:*`/`twitter:*` y JSON-LD.
- Agregar el enlace en el nav de escritorio, el menú móvil y el footer de todas las páginas.
- Agregarla a `sitemap.xml`. `build-dist.sh` ya copia todos los `*.html`.

**Al tocar el formulario**
- El texto del WhatsApp y del email se arma en `main.js`: si cambias los campos del formulario, actualiza también ese módulo.
- Tratar toda entrada del usuario como no confiable: nada de `innerHTML` con valores del formulario.

**Estilos e imágenes**
- Preferir utilidades de Tailwind y las clases propias existentes antes de crear CSS nuevo.
- No agregar más selectores `[class*="…"]`. Los nuevos ajustes responsive deben usar prefijos `sm:`/`md:`/`lg:`.
- Imágenes nuevas en `img/`, con nombre kebab-case, WebP + fallback y `width`/`height`.
- Mantener la estética (radios rectos, Space Grotesk, azul/naranjo, glassmorphism sutil).

**Accesibilidad y SEO**
- `alt` descriptivo en imágenes. `aria-label` en botones que solo muestran un icono.
- Enlaces con `target="_blank"` deben llevar `rel="noopener"`.
- Un solo `<h1>` por página. Jerarquía de títulos coherente.

**Contenido**
- Los datos de contacto (teléfono `+56 9 4800 4882`, `contacto@ingelyv.cl`, dirección) aparecen en muchos lugares (header, hero, footer, JSON-LD, botón flotante). Si cambian, reemplazarlos globalmente con grep.

---

## Convenciones de Modelos y Permisos (System Note)
- **Modelo predeterminado:** Utilizar siempre la familia **Opus** para tareas de ingeniería, refactorización y lógica central.
- **Ajuste de Esfuerzo (Reasoning):** En lugar de cambiar de modelo, se debe modular el nivel de razonamiento (Bajo para consultas rápidas, Máximo para implementaciones complejas).
- **Modelos Secundarios:** Usar Fable solo para integraciones extremadamente complejas. Usar Haiku exclusivamente para tareas de clasificación masiva de datos.
- **Modo de Permisos:** Priorizar el modo **Automático** durante la implementación para evitar interrupciones constantes, o el modo **Plan** cuando se requiera proponer arquitectura sin tocar el código fuente.
