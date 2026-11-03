"""Refresh script hashes after changing inline JavaScript. No third-party dependencies."""
from pathlib import Path
import re,hashlib,base64
root=Path(__file__).resolve().parents[1]
p=root/'story-desktop.html';html=p.read_text()
hashes=['\'sha256-'+base64.b64encode(hashlib.sha256(s.encode()).digest()).decode()+'\'' for s in re.findall(r'<script>(.*?)</script>',html,re.S)]
policy="default-src 'self'; script-src 'self' https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ https://challenges.cloudflare.com "+' '.join(hashes)+"; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; object-src 'none'; base-uri 'self'; form-action 'self'"
meta='<meta http-equiv="Content-Security-Policy" content="'+policy+'">'
html=re.sub(r'<meta http-equiv="Content-Security-Policy"[^>]*>\n?','',html)
html=html.replace('<meta charset="UTF-8">','<meta charset="UTF-8">\n'+meta)
p.write_text(html)
(root/'security-policy.txt').write_text(policy+"; frame-ancestors 'none'")
