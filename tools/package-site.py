"""Create a publishable ZIP without historical source versions or original PNGs."""
from pathlib import Path
from zipfile import ZipFile,ZIP_DEFLATED
root=Path(__file__).resolve().parents[1]
files=['index.html','story-desktop.html','story-test.html','responsive.js','responsive.css','mobile-composition.css','mobile-motion.js','story-timeline.js','actor-metrics.js','actor-layout.js','desktop-foundation.js','desktop-foundation.css','scene07-v80.js','scene07-v80.css','server.mjs','contact-api.mjs','security-policy.txt','README.md']
out=root/'dist';out.mkdir(exist_ok=True)
with ZipFile(out/'colorclik-site.zip','w',ZIP_DEFLATED) as z:
    for file in files:z.write(root/file,file)
    for folder in ['assets/optimized','assets/brand']:
        for p in sorted((root/folder).rglob('*')):
            if p.is_file():z.write(p,p.relative_to(root))
print(out/'colorclik-site.zip')
