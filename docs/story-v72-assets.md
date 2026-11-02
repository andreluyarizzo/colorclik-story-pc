# Story V7.2: poses and alignment

Six new transparent assets were made with the built-in image generation tool, using the original PDF characters and turquoise door as identity references. Project assets are in `assets/optimized/story-v72/`.

Prompt set (all: original 3D identity, clothes, face, shoes, full uncropped figure, transparent background, no text):
- landing: red girl absorbing a landing, both shoes firmly on the floor, bent knees and arms balancing.
- caught: grandfather supporting the red girl by her forearms as her feet reach the floor; original open turquoise door to the right.
- farewell: grandfather outside the open door, looking left and waving goodbye.
- closing: grandfather holds the handle and pulls the turquoise leaf nearly closed; narrow warm interior still visible.
- closed: grandfather just closed the door, hand on handle, shoulders beginning to relax.
- slip: grandfather steps on a banana peel, foot slides, arms rise and torso begins leaning back.

The original tired and falling images are reused. WebP encoding and uniform resizing register the turquoise door crown at (1000,180), height1140, in a 1400-square canvas. No character receives independent X/Y stretching. Scene8 uses a fixed standing height and a crouched flight height based on the same head scale. The landing sprite rests exactly on the shared floor. Each story beat selects a decoded keyframe; there is no blur, ghost crossfade or image slicing. Timing remains a pure function of scroll, including reverse.

Originals of the six generated images remain at their generated output paths. The WebP versions are the production deliverables. Existing earlier scenes and quotation forms are retained.
