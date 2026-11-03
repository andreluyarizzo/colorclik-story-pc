# V7.9 — Correct falling pose, gait cycles and finale clipping

Backup: backup/pre-motion-layout-v79 (213048ec154fffa5ace64875ca5deea5457fdbdc).

Screenshot defects addressed:
- Scene11 used aqua-walk.webp for the falling actor. It now uses a dedicated falling/reaching pose, normal hand/body proportions, and a fixed floor endpoint.
- Aqua, purple and red departures now select mounted contact/passing frames by traveled distance. No network image swaps and no detached limbs. Whole poses are normalized to 1100px square, visible height1000px, baseline1060px. No anisotropic scale, bobbing or rotating walk cards.
- Finale copy previously had absolutely positioned children inside an empty flex box. Flex static-position centering could place the quotation heading above the viewport. The container now has explicit full-stage height, display:block, and explicit top offsets for both title and quotation panel. Group height capped at48vh with88vh floor to leave title space.
- Finale arrivals use the same gait decks. Existing yellow11/13 and blue43/45 are reused; earlier chapters retain their approved layout. Original quotation wizard and all five service buttons are preserved. Portfolio alternating sides is preserved.

Assets: assets/optimized/motion-v79 (16 transparent optimized WebPs:9 generated poses and7 existing reference frames). Built-in image generation was used; exact prompts, reference paths and generated source paths are recorded in V79-IMAGE-PROMPTS.json. Original generated PNGs were preserved.

Checks passed at1440x900 and1920x1080: chapter8–12 invariants and1001 forward/reverse states; five portfolio clients and bounds; finale arrivals, aspect ratios, group bounds and reduced motion; all four gait phases reached, exactly one pose visible, feet baseline fixed, reverse phase identity; inline/external JS syntax and asset paths/alpha decoding.

Limit: browser visual verification remains unavailable because the browser session hit its usage limit. VM geometry/scroll tests and sprite contact-sheet inspection are not browser QA. New four-phase cycles improve stepping but are still keyframe animation, not continuous skeletal animation; do not claim that every pose handoff is imperceptible.
