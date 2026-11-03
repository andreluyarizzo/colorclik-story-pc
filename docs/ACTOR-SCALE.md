# Escala de personajes · 3 de noviembre de 2026

Se reemplaza el ajuste independiente de cada imagen mediante `object-fit: contain` por una escala corporal común a las 18 escenas. Una pose vertical y una composición cuadrada ya no reciben tamaños distintos por las dimensiones de su lienzo. Las capas adicionales dejan de usar alturas del 78 %, 92 % o anchos del 40 %/60 % como factor de tamaño corporal; esos valores solo conservan la posición en la coreografía.

`actor-metrics.js` contiene 124 referencias medidas a partir del canal alfa y referencias corporales revisadas para las ilustraciones que incluyen puertas o varios personajes. `tools/measure-actors.py` reproduce el cálculo sin modificar las imágenes. `actor-layout.js` aplica una transformación uniforme, preserva la proporción original y registra la referencia del suelo a 12 px del borde inferior del escenario.

La unidad es la misma para todos los capítulos de un viewport. Se calcula a partir del escenario más estrecho y de la altura disponible, dejando espacio para los cinco personajes enlazados completos. Así el personaje individual conserva la escala del equipo, sin que la composición de cinco personas obligue a reducirlos repentinamente. Los lienzos transparentes se compensan al centrar y al apoyar la ilustración.

Las posturas agachadas y los saltos recogidos conservan su menor altura visible, en vez de estirarse para llegar a la altura de una figura de pie. No se redibujan los personajes ni se separan sus cuerpos en las ilustraciones conjuntas: las pequeñas diferencias anatómicas y de perspectiva que ya existen en esos dibujos se conservan.

## Comprobaciones

Las pruebas de navegador recorrieron los 105 momentos y comprobaron la unidad proyectada, la proporción nativa y el anclaje del suelo de cada capa visible:

| Viewport | Unidad corporal compartida |
| --- | ---: |
| 320 × 568 | 140,35 px |
| 375 × 812 | 164,47 px |
| 768 × 1024 | 263,83 px |
| 1024 × 768 | 207,36 px |
| 812 × 375 | 101,25 px |

El recorrido completo sigue disponible. Las trayectorias de salida, caída y salto se mantienen: durante esas acciones el personaje puede salir del encuadre intencionalmente. Las capturas `scale-*.png` y la grabación `scale-story-preview.mp4` muestran el resultado.

La modificación afecta a la presentación adaptable y al respaldo que se activa si GSAP no está disponible. La coreografía original GSAP de escritorio mantiene su normalización anterior.

En teléfono vertical (hasta 600 px), las ilustraciones usan todo el ancho disponible mientras los textos conservan sus márgenes. La unidad corporal aumenta aproximadamente un 15 % respecto a la entrega anterior, manteniendo al equipo completo visible. Tablet y horizontal conservan su escala anterior.

## Encuadre Android Ultra

La presentación de teléfono ya no limita todas las escenas al ancho de la fila de cinco personajes. Las escenas normales y el abrazo final usan un plano cercano uniforme; los cinco proyectos usan un plano abierto para mantener al equipo enlazado completo. La anatomía y proporciones originales se mantienen en ambos encuadres.

La altura disponible se mide con una referencia CSS de 100svh, para estabilizar el diseño cuando aparecen o desaparecen las barras del navegador. El tamaño cercano también reserva la altura real del texto, los márgenes y la separación. Un ResizeObserver y la carga de fuentes actualizan el cálculo si cambia el texto. No se redimensiona la historia mientras un diálogo esté abierto, para evitar cambios al mostrar el teclado.

Pruebas con emulación Chromium de Android, táctil y densidad 3 (no un Galaxy S26 Ultra físico):

| Viewport CSS | Cuerpo en plano cercano | Cuerpo del equipo en plano abierto |
| --- | ---: | ---: |
| 384 × 854 | 247,7 px | 168,4 px |
| 412 × 915 | 265,8 px | 180,7 px |
| 480 × 1067 | 309,7 px | 210,5 px |
| 412 × 780 | 265,8 px | 180,7 px |

También se comprobaron 412 × 915 con títulos de 36 px y descripciones de 21 px. Los formatos cubren distintos anchos de ventana y ajustes de visualización; no se afirma que un modelo de teléfono tenga un único viewport fijo. En estos tamaños el plano cercano aumenta aproximadamente un 47 % respecto a la entrega anterior. Las pruebas esperan que las imágenes visibles estén cargadas antes de capturar el resultado.
