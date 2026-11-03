# Validación adaptable y seguridad · 3 de noviembre de 2026

## Cambios

- Misma fuente HTML para 18 escenas. Hasta 1100 px: historia animada mediante scroll nativo, contenido completo y personajes de las escenas correspondientes. `mobile-motion.js` adapta los pasos, saltos, apertura de puerta, encuentros y abrazo final a un encuadre vertical. El movimiento y las poses son reversibles al volver hacia arriba. No es una copia geométrica de la pantalla ancha: los capítulos narrativos usan encuadre sticky y los planes/contacto mantienen lectura natural después de su secuencia narrativa completa.
- Preferencia de movimiento reducido: lectura sin animación. Si falla GSAP se utiliza la animación adaptable, independiente del CDN. Redimensionar una ventana de escritorio a tablet activa la presentación adaptable.
- Sustitución de referencias PNG de la historia por WebP. Carga diferida de imágenes fuera de pantalla y retirada del asistente externo de 323 KB del flujo activo.
- Un único diálogo de contacto con controles nativos, retorno del foco y servicio/plan preseleccionados. Sustituye a los dos formularios anteriores y sus distintos comportamientos. El formulario simplificado recoge nombre, correo y descripción; no incluye el asistente anterior de pasos ni su botón de WhatsApp.
- `story-test.html` redirige a la versión activa: se elimina una copia de más de 2300 líneas que podía divergir.
- Servidor estático opcional con cabeceras de seguridad, lista de archivos públicos permitidos y API de correo protegida. CSP en el HTML para alojamiento estático. Reduce vías de inyección de scripts; no evita que terceros creen sitios falsos. La protección contra phishing por correo requiere SPF, DKIM y DMARC en DNS, todavía sin configurar.
- `tools/package-site.py` produce `dist/colorclik-site.zip`, con recursos activos y sin PNG originales, versiones históricas, pruebas o capturas. Los archivos fuente de respaldo se conservan.

## Pruebas realizadas

- Chromium: 320, 375, 768, 1024, 1440 y 1920 px de ancho. Las 18 escenas visibles en lectura vertical, sin desbordamiento horizontal. Apertura del diálogo, Escape, retorno del foco y preselección de Landing/Desarrollo Web correctos. Sin errores JavaScript capturados.
- Preferencia de movimiento reducido en 1440 px y cambio a 375 px: contenido completo disponible.
- Pruebas existentes de V80: estados reversibles, movimiento, portafolio y final, en 1440 × 900 y 1920 × 1080: aprobadas. Estas son pruebas de lógica con mocks; no equivalen a una revisión visual de la animación real.
- API con respuestas simuladas de Turnstile/Resend: configuración incompleta rechazada, origen ajeno rechazado, honeypot, correo con salto de línea, tamaño excesivo, token inválido y hostname incorrecto rechazados. Entrega simulada correcta y sexto intento bloqueado.
- Sintaxis de JavaScript y `git diff --check`: correctos.

## Límites

El CDN `cdn.jsdelivr.net` no está autorizado por la red del entorno. Las comprobaciones de navegador en escritorio ejercitaron la presentación animada de respaldo, no la animación real con GSAP. Es necesario revisar esa animación en el alojamiento con acceso al CDN. Las fuentes también dependen de conectividad.

No se enviaron mensajes reales, no se configuraron claves, DNS de correo, HTTPS ni WAF, y no se publicó una nueva versión. El entorno tampoco permite los proveedores nuevos de Turnstile/Resend. La API está preparada pero requiere configuración del alojamiento (ver README). El rate limit es local al proceso; requiere adaptación para proxies y escalado. No es una auditoría de penetración ni garantiza evitar todos los ataques.

## Movimiento adaptable

Pruebas de 375 × 812, 768 × 1024, 1024 × 768 y 812 × 375: siete capítulos muestreados con avance, retroceso y comparación de poses/transformaciones; sin superposición entre textos e ilustraciones. El código precarga el siguiente momento y mantiene un conjunto limitado de 20 imágenes preparadas. El render usa requestAnimationFrame solo ante scroll, resize o carga de imagen, y se limita a capítulos cercanos mediante IntersectionObserver. No se ejecuta un bucle de animación continuo.

La preferencia de movimiento reducido se respeta y puede cambiar durante la sesión. Las capturas `motion-mobile-scene*.png` y el video `complete-story-preview.mp4` muestran la presentación en teléfono.

## Historia completa · 105 momentos

`story-timeline.js` define las 18 secuencias completas con 105 momentos y 87 recursos WebP. Incluye las ocho acciones del teléfono/portátil/papeles, dos golpes en la puerta azul y dos en la roja, todas las salidas y despedidas, presentación y salto de la pelirroja, aterrizaje y salida, comida y caída de la cáscara, resbalón, contacto alto y descenso al rescatar al abuelo, saludo y salida de ambos personajes, cinco proyectos tirados por el equipo y reunión/abrazo final.

Cada secuencia tiene una pista de scroll propia antes de las tarjetas de precios. Así sus acciones no transcurren mientras la ilustración está fuera de pantalla. Las capas de una composición se actualizan juntas cuando sus imágenes están listas; las posiciones dependen únicamente del progreso del capítulo.

Pruebas en Chromium de 320 × 568, 375 × 812, 768 × 1024, 1024 × 768 y 812 × 375: recorrido de los 105 momentos en cada tamaño, ilustración dentro del viewport durante cada momento, ningún recurso de imagen ausente y ningún error JavaScript. Las pruebas de lógica muestrean todas las fases, comprueban la existencia de recursos, la reversibilidad y la cobertura de las acciones clave. El límite sigue siendo la naturaleza del material: animación por poses y trayectorias, no animación esquelética continua.
