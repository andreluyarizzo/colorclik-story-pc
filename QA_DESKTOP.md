# ColorClik PC V6.6 — Comprobación de escritorio

Código comprobado: `affccdb31961300b3421c3d8dd9f42fe2fda8136`.
Publicación: https://andreluyarizzo.github.io/colorclik-story-pc/
Repositorio nuevo: https://github.com/andreluyarizzo/colorclik-story-pc

## Alcance y método

Pruebas sobre la página publicada en navegador Brave, con viewport verificado de 1440 × 900 y 1920 × 1080. Se avanzó y retrocedió con scroll real, consultando las poses y la visibilidad de las capas y revisando capturas. Los cambios se limitan a escritorio. El repositorio original `colorclik-web` no recibió operaciones de escritura.

## Resultado

| Comprobación | Resultado |
| --- | --- |
| Recursos originales | 48 PNG idénticos byte a byte a los del ZIP. No se generaron imágenes con IA. |
| Rutas locales | Sin referencias locales faltantes en HTML; todas las poses solicitadas existen. 26 y 44 no se solicitan. |
| JavaScript | Los dos scripts pasan la comprobación de sintaxis de Node. |
| IDs HTML | Sin IDs duplicados. |
| Escenas anteriores | Recorrido por las escenas originales con scroll; sin rediseño. Se corrigió la orientación de la composición de la puerta en escritorio para continuar hacia 39. |
| Despedida | Se observan 39 y 40 antes de 41, con la puerta azul. |
| Planes web | Tres planes visibles después de 41; los centros de los tres enlaces no están tapados por otras capas. Asuntos de correo diferenciados. |
| Marcha | Pose 42 y ciclo reutilizado 43/45; salida derecha y entrada izquierda. |
| Puerta roja | Poses 46, 47 y 48; apertura por capas y aparición de 49 con el texto de Branding y Diseño. |
| Retroceso | Se ocultan puerta roja y pelirroja al regresar; reaparecen las composiciones anteriores sin conservar actores nuevos visibles. |
| Superposición | Exclusión de composición/personaje durante el relevo 41/42; fundidos sucesivos de títulos. |
| Formulario de Marketing | Apertura y cierre, campos obligatorios, avance, resumen y regreso comprobados con datos ficticios. |
| Preselección | Impulso, Crecimiento y Escala quedan seleccionados al abrir desde su tarjeta. Se corrigieron los espacios del atributo original. |
| Consola | Sin errores ni advertencias en las sesiones de comprobación. |
| Escritorio | Sin desbordamiento horizontal en los puntos inspeccionados de 1440 × 900 y 1920 × 1080. |
| Móvil | Bloque de coreografía móvil comparado byte a byte con el ZIP; permanece igual. No se ejecutó una nueva ronda de diseño o desarrollo móvil. |

## Recursos optimizados

Se preservaron los PNG y se añadieron 48 copias WebP transparentes de las mismas imágenes: 11.710.470 bytes frente a 94.671.411 bytes de originales. Esta comparación corresponde al conjunto de imágenes, no a una medición del tráfico total de la página. Se conservan relación de aspecto y transparencia.

## Evidencia

- `docs/qa-desktop-1440.jpg`: final de la historia en escritorio.
- `docs/qa-desktop-1920.jpg`: final de la historia en escritorio.

## Límites y pendientes

- Los botones web usan `mailto:`; el formulario prepara un correo en el cliente del visitante. No hay backend de envío ni almacenamiento de datos en GitHub Pages.
- No se envió ningún correo real durante las pruebas. La entrega efectiva depende de la aplicación de correo y del buzón de destino.
- Los precios originales permanecen marcados como referenciales; falta su confirmación comercial.
- No se desarrollaron los demás personajes ni la versión móvil.
- GSAP, ScrollTrigger y fuentes requieren conexión a sus CDN.
