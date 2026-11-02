# Publicar ColorClik PC en un repositorio nuevo

1. En GitHub, crea un repositorio **público** vacío, por ejemplo `colorclik-story-pc` (no inicializar con README, .gitignore ni licencia).
2. Extrae este ZIP en una carpeta local y abre Git Bash en esa carpeta.
3. Ejecuta los comandos siguientes, sustituyendo `TU_USUARIO` por tu usuario de GitHub:

```bash
git init
git add .
git commit -m "ColorClik PC V6.6: historia completa hasta puerta roja"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/colorclik-story-pc.git
git push -u origin main
```

4. En GitHub: **Settings > Pages > Build and deployment > Deploy from a branch**, selecciona `main` y `/(root)`, y guarda.
5. Abre `https://TU_USUARIO.github.io/colorclik-story-pc/` cuando termine la publicación.

No se ha publicado automáticamente ni se ha creado el repositorio desde este ZIP.
