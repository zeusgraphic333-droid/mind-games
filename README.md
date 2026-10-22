# Mind Games · عقلك بيشتغلك

An immersive study experience for **Graphic Design Fundamentals (MDP001)** at Badr University in Cairo —
Lecture 02 (Psychology of Design · Express Meaning) and Lecture 03 (Gestalt Principles of Visual Perception).

Everything you see is a single GPU particle cloud that assembles into each idea: the viewer's eye, Kandinsky's
three shapes, negative space, Runge's colour sphere, letterforms, Black Square compositions and every Gestalt law.
Lessons drive the cloud as you scroll; trials, zone quizzes, a boss fight, a timed portal-style exam and a revenge
mode turn revision into play. Progress, ranks and achievements are saved in the browser.

## Build

```bash
npm install
node build.mjs            # → dist/index.html (one self-contained file)
node build.mjs --dev --zone gestalt   # → dist/dev-gestalt.html (one district, for writing lessons)
```

Stack: Three.js (custom point shader, bloom, film pass) · GSAP · esbuild · vanilla ES modules.
Fonts: Alexandria, IBM Plex Sans Arabic, Handjet (+ EB Garamond, Lobster, Bebas Neue, Courier Prime as type specimens).

Content is written for study; slide wording is quoted from the course lectures (2026–2027).
