# ColorClik — Parte 1: escala, precios y formularios

## Entrega
- Se mantiene el repositorio independiente colorclik-story-pc; colorclik-web solo se leyó.
- Misma altura visible para los personajes, usando límites alfa del cuerpo y una línea de suelo común. Las poses agachadas conservan la proporción de su actuación.
- Se conservan todos los PNG y WebP existentes. Sin imágenes nuevas de IA.
- Marketing muestra los tres planes a la vez en escritorio; precios y botones más legibles.
- Desarrollo Web reserva espacio para la composición de la puerta azul; precios dimensionados por el ancho disponible.
- Se integra el formulario original de ColorClik: cinco servicios, mismos pasos, preguntas, colores, personajes y opciones de correo/WhatsApp.
- Los botones de Marketing y Web preseleccionan servicio y plan. Cotizar del encabezado permite elegir cualquiera de los cinco servicios.
- El formulario de Branding se puede abrir desde su escena; los planes de Branding y las escenas posteriores se harán en las siguientes partes.
- El móvil conserva su coreografía y su formulario anterior. Los módulos nuevos solo se cargan en escritorio.

## Pruebas de esta parte
Navegador de revisión: viewport 1363 × 936. La conexión al navegador local no estuvo disponible; no se atribuyen a esta entrega nuevas pruebas a 1440 × 900 o 1920 × 1080.
- JavaScript: sintaxis comprobada para historia, puente y módulo original de cotización.
- Comparación byte a byte: PNG originales intactos y bloque de coreografía móvil igual al ZIP.
- Formulario: las cinco opciones cambian de servicio, preguntas y color; se probó avance a datos y resumen con datos ficticios.
- Preselección: Impulso, Crecimiento, Escala, Landing, Web Corporativa y Tienda Online correctos.
- No se enviaron mensajes reales.
- Cuerpos visibles de azul y pelirroja: aproximadamente 486,70 y 486,71 px en el punto final comprobado. Suelo compartido con diferencia inferior a 1 px.
- Precios Marketing: aproximadamente 34 px; precios Web: aproximadamente 32 px en el viewport comprobado. Los seis botones tienen área de clic accesible y la puerta no tapa la tercera tarjeta web.
- Encabezados de los planes web y botones con altura común para alinear sus precios.
- Sin desbordamiento horizontal en los puntos inspeccionados. Los errores de la extensión del navegador son ajenos al sitio y se separaron de los registros de la página.

## Procedencia de los formularios
Copia del módulo compilado docs/app.js y docs/ui-components.css del repositorio original colorclik-web. Se conservan las licencias incluidas en el JavaScript. Se adaptan exclusivamente las rutas de imágenes para apuntar a los recursos originales públicos. No se cambian el contenido del formulario, los destinatarios ni la lógica de los mensajes.

## Orden acordado para seguir, basado en las 18 páginas del PDF
| Páginas | Parte de la historia |
| --- | --- |
| 1–4 | Amarilla: presentación, salto, entrada/salida y planes de Marketing. |
| 5–6 | Puerta azul, despedida, azul solo, planes Web y salida a la derecha. |
| 7–8 | Llegada a puerta roja, pelirroja, planes de Branding y salto hacia abajo. |
| 9–10 | Encuentro con personaje acuamarina, planes de Redes y caída. |
| 11–12 | Rescate desde puerta morada y planes de Soluciones a Medida. |
| 13–17 | Grupo empujando alternando dirección y proyectos. |
| 18 | Grupo abrazado y contacto final con el formulario original. |

La presente parte instala la base común de escala, precios y formularios; no da por implementado el recorrido completo de las 18 páginas. La próxima revisión se concentra en la coreografía de las páginas 1–6 antes de ampliar a las escenas restantes.

## Evidencia
- docs/phase1-marketing.jpg
- docs/phase1-form.jpg
- docs/phase1-web.jpg

## Límites
Los formularios preparan mensajes en la aplicación de correo o WhatsApp del visitante. No existe backend de envío automático. Los recursos visuales del formulario se reutilizan desde colorclik-web; las escenas usan sus recursos locales originales.
