# Escala de personajes · 3 de noviembre de 2026

Se reemplaza el ajuste independiente de cada imagen mediante `object-fit: contain` por una escala corporal común a las 18 escenas. Una pose vertical y una composición cuadrada ya no reciben tamaños distintos por las dimensiones de su lienzo. Las capas adicionales dejan de usar alturas del 78 %, 92 % o anchos del 40 %/60 % como factor de tamaño corporal; esos valores solo conservan la posición en la coreografía.

`actor-metrics.js` contiene 124 referencias medidas a partir del canal alfa y referencias corporales revisadas para las ilustraciones que incluyen puertas o varios personajes. `tools/measure-actors.py` reproduce el cálculo sin modificar las imágenes. `actor-layout.js` aplica una transformación uniforme, preserva la proporción original y registra la referencia del suelo a 12 px del borde inferior del escenario.

La unidad es la misma para todos los capítulos de un viewport. Se calcula a partir del escenario más estrecho y de la altura disponible, dejando espacio para los cinco personajes enlazados completos. Así el personaje individual conserva la escala del equipo, sin que la composición de cinco personas obligue a reducirlos repentinamente. Los lienzos transparentes se compensan al centrar y al apoyar la ilustración.

Las posturas agachadas y los saltos recogidos conservan su menor altura visible, en vez de estirarse para llegar a la altura de una figura de pie. No se redibujan los personajes ni se separan sus cuerpos en las ilustraciones conjuntas: las pequeñas diferencias anatómicas y de perspectiva que ya existen en esos dibujos se conservan.

## Comprobaciones

Las pruebas de navegador recorrieron los 105 momentos y comprobaron la unidad proyectada, la proporción nativa y el anclaje del suelo de cada capa visible:

| Viewport | Unidad corporal compartida |
| --- | ---: |
| 320 × 568 | 122,55 px |
| 375 × 812 | 143,83 px |
| 768 × 1024 | 263,83 px |
| 1024 × 768 | 207,36 px |
| 812 × 375 | 101,25 px |

El recorrido completo sigue disponible. Las trayectorias de salida, caída y salto se mantienen: durante esas acciones el personaje puede salir del encuadre intencionalmente. Las capturas `scale-*.png` y la grabación `scale-story-preview.mp4` muestran el resultado.

La modificación afecta a la presentación adaptable y al respaldo que se activa si GSAP no está disponible. La coreografía original GSAP de escritorio mantiene su normalización anterior.
