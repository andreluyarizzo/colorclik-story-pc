# V8.0 — Connected catch and coherent group transitions

Backup: backup/pre-coherent-contact-v80 at57be1e5b21b60d9e95c15036ba85ac44b811fd5c.

The separate airborne aqua and reaching purple sprites did not share a grip. Scene11 now uses integrated full compositions for high contact, intermediate lowering and low catch. Both hands physically hold aqua sleeves in every catch composition. The independent falling overlay remains hidden, and the low catch holds the same lowering image instead of switching to a differently registered old catch. The three new compositions share door crown/height registration on1400px square canvases.

Portfolio now alternates two full-team leg poses by traveled distance. All five people remain in their original yellow/blue/red/aqua/purple line, hands linked, native direction left; the previously approved mirrored layout and alternating project sides remain. New aqua jeans match the rest of the story. Decorative yellow rays were removed from the second generated step to prevent flicker. Whole team bobbing was removed.

The finale's unrelated individual arrival trajectories and mirrored figures were removed. They are replaced by three coordinated whole-group poses: gathering inward, embrace forming, final hug. Fixed order purple/aqua/red/yellow/blue, red front and center. Same canvas2100x1200, common1100px visible height and1160px baseline. No independent direction flips or character swaps; quotation wizard remains intact. This intentionally replaces individual full-screen walk-ins with a coordinated group gathering. It is three-pose sprite choreography, not continuous skeletal motion.

Assets: assets/optimized/coherent-v80. Eight optimized transparent WebPs. Built-in image generation was used for the seven new poses/cleaned variants, while the approved hug is reused. Source PNGs preserved. Exact base prompts and references in V80-IMAGE-PROMPTS.json; the two targeted follow-ups are also recorded there.

Verification: sprite contact-sheet inspection confirmed connected grips, ordered downward contact states and fixed final group order. At1440x900 and1920x1080 VM tests cover: integrated contact frame selection with no independent aqua overlay; all previous chapter invariants; two team gait frames and five portfolio layouts; three whole-group finale states, one visible at a time; reverse scroll identity, fixed axes and reduced motion. Inline/external JS syntax, asset existence and alpha image decoding checked.

Run from repository root:
node tests/qa-v80.cjs
node tests/qa-v80-portfolio.cjs
node tests/qa-v80-motion.cjs
node tests/qa-v80-contact-finale.cjs

Browser render verification remains pending because the browser session was blocked by its usage limit. VM tests and contact-sheet inspection are not browser testing; do not claim visually imperceptible keyframe handoffs.
