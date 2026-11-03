# V7.8 — Banana and team finale

Backup: backup/pre-banana-finale-v78, parent 0265f140a42b4c4d730ab1aa10fa77a752d31add.

Aqua timeline now includes eating a banana, releasing its peel, peel dropping to the floor, slipping, then falling. New whole poses share the existing door crown and floor registration on a 1400px canvas. No detached hands or stretched axes.

Scene18: five whole characters enter at staggered scroll times from alternating sides with uniform scale; a whole group hug replaces their arrival poses. The five service buttons open the existing quotation wizard. This is keyframe sprite animation; the pose handoff is not skeletal animation. The final hug is deliberately held for reading the quotation choices.

The shared chapter easing is now C2 smootherstep. Previous service layouts and portfolio side alternation are preserved. FreshClean uses the official 640x246 source; Manton and Indeed retain their real marks without upscaling beyond native CSS width. Original SVG/high-resolution marks are still required for those two brands; they are not HD.

Checks: JavaScript syntax; VM choreography invariants and 1001 forward/reverse samples per chapter at 1440x900 and 1920x1080; five portfolio client bounds, mirrors and reduced motion; finale stagger, group bounds, uniform scale and reduced motion. Run node tests/qa-v78.cjs, node tests/qa-v78-portfolio.cjs, node tests/qa-v78-finale.cjs from repository root.

Browser visual QA is pending: the session browser was denied by its usage limit. These VM checks are not browser render verification. Do not describe the full story as visually seamless until it has been reviewed in a browser.

New images were generated from closed.webp (aqua eating a peeled banana; aqua releasing an empty peel) and PDF p18_1_222.png (same five-person embrace, alpha background, aqua denim trousers). Whole sprites, original faces/outfits, closed turquoise door at right, no text or detached limbs were requested. Sources: generated_images/exec-ec8a5e39-c023-463f-8ad1-e97b54e31021.png; exec-02fd1124-7fee-4254-8343-64cda2bac9b5.png; exec-d79e248b-529c-4fca-aa8c-94130f9602f2.png. All are delivered as optimized transparent WebP assets in assets/optimized/finale-v78.

FreshClean source: https://comercializadorafreshclean.cl/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-07-at-5.38.57-PM-e1759942617743.jpeg
