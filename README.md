# Hound Express — Gestión de guías

Aplicación web para registrar envíos, actualizar su estado, consultar el historial de seguimiento y cotizar servicios.

## Funcionalidades

- Registro de guías con validación de campos y números duplicados.
- Actualización de estado de Pendiente a En tránsito y Entregada.
- Historial con fecha y hora de cada cambio.
- Guardado de las guías en el almacenamiento local del navegador.
- Resumen por estado, búsqueda de servicios y cotizador.
- Diseño adaptable a móviles, navegación por teclado y metadatos SEO.

Las guías se almacenan en el navegador en el que se registran; no se sincronizan entre dispositivos ni usuarios.

## Desarrollo local

Requiere Node.js 22 o posterior.

```bash
npm ci
npm run dev
```

## Pruebas y compilación

```bash
npm test -- --runInBand
npm run lint
npm run build
```

La compilación de producción queda en `dist/`.

## Publicación en GitHub Pages

El workflow de `.github/workflows/deploy.yml` compila y publica el sitio al subir cambios a `main`, o al ejecutarlo manualmente desde la pestaña **Actions**.

1. En GitHub, abre **Settings → Pages** y selecciona **GitHub Actions** como origen de publicación.
2. Sube los cambios a la rama `main` o ejecuta el workflow **Deploy to GitHub Pages** desde **Actions**.
3. Espera a que termine correctamente y abre la URL que GitHub muestra en **Settings → Pages**. Para este repositorio, normalmente será `https://moremaster123.github.io/Hound-Express-Modulo-30/`.

También puede alojarse en Netlify usando `npm run build` como comando de compilación y `dist` como directorio de publicación.
