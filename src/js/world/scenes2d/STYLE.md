# Illustrated scenes — style and contract

The site has two modes. **Immersive** draws every idea with GPU particles in the dark. **Illustrated** draws the same
ideas as animated 2D prints on paper. This folder is the illustrated stage: one scene per idea, same names as
`world/scenes.js` (`SCENE_INFO`), so lessons ask for `scene: 'kanizsa'` and get the right picture in either mode.

## The look: a risograph print lab
Think of a small studio that prints posters on a riso machine, then makes them move.

- **Paper** shows through everywhere. The page behind the stage is paper `#F4F5F9`; never paint a full background.
- **Flat inks only** (`k.INK`): navy `#121535` (the "black"), blue `#2F47E8`, fluorescent pink `#FF4DAA`, yellow `#FFE24A`,
  plus teal, orange, green, violet, red, gold for variety. A scene normally uses **2–4 inks**. No gradients except the
  halftone fades the kit provides. No drop shadows, no glows, no 3D shading.
- **Halftone** is the texture: `k.ht('pink','l')` fills with a dot screen (`s` 6px, `m` 9px, `l` 13px). Fade a halftone with
  `mask="url(#fade-r)"` (radial) or `mask="url(#fade-y)"` (top→bottom).
- **Misregistration**: print a second pass of a key shape in another ink, nudged 3–7px (`k.misreg`, or a `<g transform="translate(6 5)">`
  copy under the main shape). One or two per scene, not everywhere.
- **Overprint**: do NOT use `mix-blend-mode` inside a scene (Chrome mis-renders blended groups with pattern fills — the
  halftone leaks to the bounding box). The whole SVG already multiplies onto the paper. For a see-through layer use
  `fill-opacity` .8–.9.
- **Type as image** is welcome: `k.text(x, y, 'Aa', { family: 'display' | 'dot' | 'serif' | 'script' | 'bebas' | 'mono' | 'ar' })`.
  `display` = Anybody (variable width: pass `width: 50…150`), `dot` = Doto (letters made of dots — a Gestalt joke).
  Keep words few; the stage is a picture, not a page. Latin words only when the slide itself uses them (Order, Serif…).
- **Registration marks** (`k.regmark(x,y)`) in one or two corners are the studio's signature. Optional.
- **Mature, not childish.** Bold geometric shapes, confident composition, generous paper. No faces with expressions,
  no characters or mascots, no cartoon eyes on shapes, no emoji. Abstract profile silhouettes are fine where the idea
  needs them (vase/faces, different minds). **No brand logos, no copies of real artworks or slide photos.**

## Motion
- **Entrance** (≈0.8–1.6 s): layers arrive like print passes — `k.press(t, [layer1, layer2…])` slides each ink in from a
  slightly different offset and lets it register. Or draw strokes (`stroke-dasharray`), stamp shapes (scale from 0 with
  `back.out`), wipe with a clip.
- **Idle loop**: calm and slow (2–8 s cycles): bob, breathe, rotate a few degrees, swap a highlight. Use `k.loop()` — it
  already skips itself under reduced motion. The loop should *demonstrate the idea* when it can (Kanizsa shows the
  triangle your mind adds, then removes it).
- Never flash, never shake continuously, nothing faster than ~0.25 s per cycle.
- `k.reduced()` true → show the final composed state, no loops. The stage enforces this too: under reduced motion every
  entrance timeline jumps to its end (callbacks suppressed) and every repeating animation stays on its first frame.
- **Pivots in SVG:** in GSAP a px `transformOrigin` on an SVG element is measured from the element's own box. To pivot
  around a point in viewBox coordinates use `svgOrigin: '300 300'` (the eye's zoom, blink and halo had this bug).
- **Text direction:** `k.text()` sets `direction` per text (rtl when the string has Arabic letters, else ltr), so
  `anchor: 'start' | 'end'` lands on the same side whatever the page direction. Override with `{ dir: 'rtl' }`.

## Contract
Each group file (`mind.js`, `shape.js`, … ) default-exports `{ sceneName: { view?, draw(k, name), play?(svg, k, name) } }`.
- `view`: SVG viewBox, default `'0 0 600 600'`. Keep the composition inside ~40…560 so it breathes in the frame.
- `draw(k)`: returns the **inner** SVG markup (no `<svg>` wrapper). Pure: no DOM access, no randomness without a seed.
- `play(svg, k)`: runs when the scene appears. Use `k.gsap` / `k.tl()` / `k.loop()`. Everything you create is collected and
  killed automatically when the scene leaves (GSAP context), so you don't return cleanup. Query only inside `svg`.
- IDs inside a scene (clipPath, gradients) must be prefixed with the scene name (`id="kz-clip"`), because two scenes
  overlap during a transition and the contact sheet renders all scenes at once.
- Size budget: < 400 SVG elements per scene; animate transforms/opacity, not path data, except for small stroke draws.
- The frame is square and ~220 px tall on phones (a band at the top of the screen) and ~460–700 px on desktop: the idea
  must read at 220 px. One clear idea per scene, big shapes.

## Checking your work
`node build.mjs --dev --scenes2d` → `dist/dev-scenes2d.html`
- `#/` contact sheet: every scene name, MISSING ones in red (they show the fallback dot field).
- `#/s/<name>` the real stage with the entrance; ←/→ to step, R to replay.
Screenshot with `node qa/shoot.js '{"file":"dev-scenes2d.html","hash":"/s/eye","w":900,"h":900,"settle":3500}'` (see qa/shoot.js).
`eye` (mind.js) and `kanizsa` (gestalt.js) are the reference scenes for quality and density.
