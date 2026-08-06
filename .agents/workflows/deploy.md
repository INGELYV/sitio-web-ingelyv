---
description: Despliega el sitio web de INGELYV SPA en Web Host Chile (push a GitHub → GitHub Actions sube via FTP automáticamente)
---

# Deploy del sitio web INGELYV SPA

Este workflow sube los archivos del sitio web a Web Host Chile via GitHub Actions.
Al hacer push a la rama `main`, GitHub Actions se encarga de sincronizar todos los archivos al servidor FTP automáticamente.

## Pasos

1. Hacer commit de todos los cambios pendientes:
```powershell
git add -A
git commit -m "update: descripción breve del cambio"
```

2. Hacer push a GitHub (esto dispara el deploy automático):
```powershell
git push origin main
```

3. Verificar que el workflow de GitHub Actions se ejecutó correctamente visitando:
   https://github.com/INGELYV/sitio-web-ingelyv/actions

4. Verificar que el sitio cargue correctamente visitando https://ingelyv.cl en el navegador

## Información de conexión FTP (manejada por GitHub Actions)
- **Servidor:** ftp.ingelyv.cl
- **Usuario:** deploy@ingelyv.cl
- **Secreto:** FTP_PASSWORD (configurado en GitHub Secrets)
- **Directorio destino:** /public_html

## Archivos del sitio
- `index.html` - Página principal
- `servicios.html` - Página de servicios
- `nosotros.html` - Página sobre nosotros
- `contacto.html` - Página de contacto
- `css/styles.css` - Estilos CSS
- `js/main.js` - JavaScript
- `favicon.png` - Favicon (Logo INGELYV)
- `Logo INGELYV SPA.png` - Logo
- `img/ecosistema-ingelyv.png` - Imagen ecosistema
- `Profe German Camisa Azul sin Lentes.jpg` - Foto fundador
- `Igor Labbe Sepulveda INGELYV.jpg` - Foto fundador
- `qr_whatsapp_INGELYV.png` - QR WhatsApp
