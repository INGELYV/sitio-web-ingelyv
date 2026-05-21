---
description: Despliega el sitio web de INGELYV SPA en Web Host Chile (sube los archivos via FTP)
---

# Deploy del sitio web INGELYV SPA

Este workflow sube los archivos del sitio web a Web Host Chile via FTP.

## Pasos

1. Verificar qué archivos cambiaron revisando la carpeta del proyecto en `c:\Users\INGELYV SPA\Desktop\SITIO WEB INGELYV SPA\SITIO WEB INGELYV SPA`

// turbo
2. Ejecutar el script de deploy para subir TODOS los archivos:
```powershell
powershell -ExecutionPolicy Bypass -File "c:\Users\INGELYV SPA\Desktop\SITIO WEB INGELYV SPA\SITIO WEB INGELYV SPA\deploy.ps1"
```

3. Verificar que el sitio cargue correctamente visitando https://ingelyv.cl en el navegador

## Información de conexión FTP
- **Servidor:** ftp.ingelyv.cl
- **Usuario:** deploy@ingelyv.cl
- **Puerto:** 21
- **Directorio destino:** /public_html

## Archivos del sitio
- `index.html` - Página principal
- `servicios.html` - Página de servicios
- `nosotros.html` - Página sobre nosotros
- `contacto.html` - Página de contacto
- `css/styles.css` - Estilos CSS
- `js/main.js` - JavaScript
- `Logo INGELYV SPA.png` - Logo
- `img/ecosistema-ingelyv.png` - Imagen ecosistema
- `Profe German Camisa Azul sin Lentes.jpg` - Foto fundador
- `Igor Labbe Sepulveda INGELYV.jpg` - Foto fundador
- `qr_whatsapp_INGELYV.png` - QR WhatsApp
