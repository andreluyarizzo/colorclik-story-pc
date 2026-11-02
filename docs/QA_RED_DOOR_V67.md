# V6.7 red doorway — 2026-11-02

Backup: `backup/pre-red-door-20261102` at `20a678e8dccc5f602bd7768ed78c4e45c1009e0b`.

The supplied archive was `muñeca roja(1).zip` (11 PNGs), not a full V6.7 source package. Existing main was used as the authoritative source. Ten supplied images were normalized to a shared transparent 1200×1500 canvas and delivered as WebP; the duplicate closed-door variant was not needed.

Only scene-07 imports and portal markup change in story-desktop.html. Earlier scenes, blue walking assets, quotation markup, handlers, and vendor files remain byte-identical. colorclik-web was not modified.

Sequence: arrival from right, two knocks against the leaf, crack/open with Branding studio visible, greeting from inside, blue walks right and clears the stage, red character steps outside, closes the door, faces the audience and waves. All ten frames remain mounted and preloaded. Scroll progress determines every pose and visibility; no timed choreography or direction-dependent state.

Validation:
- JavaScript syntax: PASS.
- 10 WebP files: actual RGBA, transparent exterior, common dimensions: PASS.
- 1001 progress samples at 1440×900 and 1920×1080, forward and backward: identical states; exactly one portal frame visible; visitor remains visible through welcome and exits before closing: PASS.
- Real Brave browser, iframe viewports 1440×900 and 1920×1080: inspected knock contact, Branding interior, blue departure and final closed-door wave. Rewound from final wave to knocking and confirmed closed frame and blue restoration.
- Branding quotation button opens existing wizard with Branding service selected: PASS. No request submitted.
- Prior-scene animation/form source comparison: PASS.

This is a scroll-driven image storyboard, not skeletal 3D motion. Original artwork contains differences in poses and perspective; door anchors are normalized, and the page never hides all portal frames between beats.

Reproduce visually at `qa-red-door.html`. Position control is normalized document scroll (0–7000); 5343 samples knocking, 5800 welcome, 6113 departure, 7000 final. Size buttons set the iframe's actual layout viewport; CSS scales its preview to fit the surrounding browser.
