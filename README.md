# ColorClik · Historia PC V6.6

Proyecto independiente publicado en https://andreluyarizzo.github.io/colorclik-story-pc/.
Repositorio: https://github.com/andreluyarizzo/colorclik-story-pc.

## Alcance

Historia de escritorio con GSAP y ScrollTrigger, hasta la aparición de la pelirroja (imagen 49). La versión móvil original se conserva y queda fuera del trabajo de esta entrega. No se modificó el repositorio `colorclik-web`.

## Recursos y estructura

- `index.html`: entrada con redirección relativa a `story-desktop.html`.
- `story-desktop.html`: historia, estilos y control del scroll.
- `story-test.html`: misma versión para pruebas.
- `assets/yellow/`: todos los PNG originales, sin cambios. No existen 26 ni 44 en el ZIP; no se solicitan.
- `assets/doors/red-door.png`: puerta roja original independiente.
- `assets/optimized/`: copias WebP transparentes a calidad 90 para escritorio, sin generación de imágenes. Total 11,7 MB frente a 94,7 MB de originales; se conserva la relación de aspecto y el canal alfa.
- `.nojekyll`: publicación estática desde `main`, carpeta raíz.

## Correcciones de escritorio

- Continuidad de orientación y encuadre en las composiciones de la puerta azul.
- Encuadre común para 38–41 y suelo común para los actores de la extensión.
- Una sola capa de personaje durante el paso de la composición 41 a la pose 42.
- Despedida 39/40, azul solo 41 y aparición posterior de los tres planes web.
- Ciclo de marcha reutilizando 43 y 45; salida derecha y entrada izquierda.
- Puerta roja y poses 46–48; aparición de 49 y del texto Branding y Diseño.
- Fundidos sucesivos para evitar títulos superpuestos; las capas ocultas no interceptan clics.
- Precarga de WebP y actualización al completar la decodificación.
- Corrección de espacios en el nombre del plan al abrir el formulario en escritorio.
- Evitar que Enter recargue la historia al completar el formulario en escritorio.

## Contacto

En escritorio se reutiliza el formulario original de ColorClik con sus cinco servicios, colores y opciones de correo y WhatsApp. Los seis botones de planes preseleccionan el servicio y plan correspondientes. La versión móvil conserva su formulario previo. GitHub Pages no envía correos ni guarda datos: no se incluye un backend. Los precios existentes siguen marcados como referenciales.

## Dependencias

GSAP 3.12.5 y ScrollTrigger se cargan desde jsDelivr; las fuentes desde Google Fonts. Requiere conexión a Internet.

Las comprobaciones y límites se documentan en `QA_DESKTOP.md`.

## Trabajo por partes

La actualización de escala y precios, las pruebas de los formularios originales y el orden de las próximas escenas se documentan en [docs/PARTE_1.md](docs/PARTE_1.md). El informe QA_DESKTOP.md corresponde a la publicación inicial V6.6.
