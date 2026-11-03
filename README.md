# ColorClik · Historia adaptable

La entrada es `index.html` → `story-desktop.html`. Una sola fuente de contenido mantiene los 18 capítulos, planes y portafolio. `story-test.html` redirige a esa misma versión para evitar divergencias.

Hasta 1100 px, `responsive.js`, `responsive.css`, `story-timeline.js`, `actor-metrics.js`, `actor-layout.js` y `mobile-motion.js` presentan los 18 capítulos con movimiento controlado por el deslizamiento nativo: pasos, saltos, puertas, encuentros, portafolio y abrazo final. Los 105 momentos narrativos mantienen el encuadre mientras avanza el gesto. Las tarjetas de planes y el contacto aparecen después de su secuencia completa, con scroll natural, para que sus acciones no se reproduzcan fuera de pantalla. Con movimiento reducido se usa la lectura sin animación. En escritorio se mantiene la animación GSAP V80. Si GSAP no carga se activa esta presentación adaptable, que anima sin depender de un CDN. Al reducir una ventana animada se pasa a la presentación adaptable; se conserva ese modo hasta recargar para no reiniciar la historia o un formulario al rotar el dispositivo.

Se utilizan WebP en todos los tamaños. Las ilustraciones añadidas en lectura vertical se cargan de forma diferida. Los originales y versiones históricas siguen disponibles como respaldo; no forman parte del código activo. No se ha medido una puntuación Lighthouse.

## Ejecución

Node.js 22 o superior, sin instalar dependencias:

```sh
node server.mjs
```

Abrir `http://localhost:8000`. El servidor admite únicamente las entradas activas y los recursos de `assets/`; no sirve documentos internos ni archivos ocultos. Añade CSP, protección contra incrustación, restricciones de permisos, tipos MIME y caché de recursos. Configurar HTTPS en el alojamiento/proxy. El CDN de GSAP y las fuentes necesitan conectividad; si falta GSAP, el contenido sigue disponible en lectura.

GitHub Pages admite la web estática, pero **no ejecuta `server.mjs` ni aplica sus cabeceras HTTP**. La página incorpora una CSP mediante meta; la protección contra incrustación necesita las cabeceras del servidor.

## Contacto y spam

El formulario común es un diálogo nativo accesible. Preselecciona servicio y plan, limita la longitud de los campos y usa datos como texto. Sin backend configurado, abre un correo para revisión del visitante: **no envía ni almacena mensajes**. El honeypot y el intervalo en navegador no constituyen protección contra bots por sí solos.

El servidor incorpora `/api/contact`, con validación del origen, servicio y campos, máximo de 16 KiB, honeypot, cinco intentos por dirección IP cada diez minutos y comprobación Turnstile en servidor (hostname y acción `contact`). Envía texto plano a través de Resend. No permite que el visitante elija destinatario o remitente. Las claves no se devuelven al navegador. Sin configuración completa, el envío directo queda deshabilitado.

Configurar como secretos/variables del alojamiento, nunca dentro del HTML:

- `PUBLIC_ORIGIN`: origen HTTPS exacto, sin barra final, por ejemplo `https://colorclik.cl`.
- `TURNSTILE_SITE_KEY`: clave pública del widget, con el dominio autorizado.
- `TURNSTILE_SECRET_KEY`: secreto Turnstile.
- `RESEND_API_KEY`: credencial de Resend.
- `MAIL_FROM`: remitente autorizado con dominio verificado.
- `MAIL_TO`: buzón fijo de destino.
- `PORT`: opcional, predeterminado 8000.

Permitir conexiones salientes a `challenges.cloudflare.com` y `api.resend.com` en el servidor. El entorno de esta entrega no tiene estas credenciales ni esos destinos habilitados: el envío real no se ha ejecutado. Configurar SPF, DKIM y DMARC en el dominio de correo para reducir la suplantación.

El límite usa memoria del proceso y la dirección del socket; tras un proxy compartido agrupa visitantes y en varias instancias no comparte contadores. Para producción con proxy o múltiples instancias, configurar el límite en el proveedor/WAF o un almacén compartido y una lista explícita de proxies de confianza antes de interpretar cabeceras reenviadas. Los controles no garantizan ausencia de ataques o spam.

## Verificación y mantenimiento

```sh
node --test tests/security-api.test.mjs
node --test tests/actor-scale.test.cjs
node --test tests/story-complete.test.cjs
node tests/qa-actor-scale.cjs
node tests/qa-complete-story.cjs
node tests/qa-mobile-motion.cjs
node tests/qa-v80.cjs
node tests/qa-v80-motion.cjs
node tests/qa-v80-portfolio.cjs
node tests/qa-v80-contact-finale.cjs
python tools/security-policy.py
python tools/package-site.py
```

El último comando actualiza los hashes CSP de los scripts inline después de editarlos; incluir `security-policy.txt` al desplegar Node. La CSP permite estilos inline porque la animación los modifica en ejecución, pero los scripts inline necesitan hashes autorizados. Revisar `docs/RESPONSIVE-SECURITY.md` para resultados y límites.

Para las pruebas de navegador: con el servidor local iniciado y Playwright/Chromium instalados, ejecutar `node tests/qa-responsive.cjs`.

La escala visual usa una unidad corporal compartida entre todas las escenas; los márgenes transparentes y las distintas proporciones de los lienzos no cambian el tamaño del personaje. Ver `docs/ACTOR-SCALE.md`.
