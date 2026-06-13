# tent-viewer

Renders every face of `tents.stl` as a `<div>` placed with **CSS 3D transforms**
(no WebGL, no JS 3D math). Built with **[Astro](https://astro.build)**: the tent
markup is **static HTML at build time** and ships **zero JavaScript** — only a
tiny inline script wires the camera sliders.

## Run

```sh
nix shell nixpkgs#nodejs --command sh -c "npm install && npm run dev"
```

Open the printed URL (e.g. http://localhost:4321). `npm run build` emits the
static site to `dist/`; `npm run check` runs the strict TypeScript check.

## How it works

- **`scripts/generate.ts`** — a standalone generator, run **rarely** with
  `npm run generate`. It parses `tents.stl` and writes one big structured
  component, **`src/generated/Tents.tsx`**, with every tent's markup fully
  expanded and styled (faces + chevron caps, all transforms/colours baked in).
  It is **not** part of `astro build`; the committed `.tsx` is what the site uses.
- **`src/pages/index.astro`** — the page: the scene/camera rig, `<Tents />`, the
  control panel, and the only browser script (slider → CSS variable).

Regenerate only when the STL changes:

```sh
npm run generate
```

### Geometry

Each tent is an extrusion of a profile along STL-x, composed via nested
`transform-style: preserve-3d` (scene → camera → tent → faces):

- **6 side faces** — `translate3d(corner) rotateX(edge-angle)`, exact rectangles.
- **2 end caps** — the cross-section is a concave chevron (`∧`): two roof panels
  of real thickness meeting at a ridge, **open underneath**. Each cap fills only
  that slab with **four triangles** (CSS border-triangles reshaped by a 2D
  `matrix()` — no `clip-path`), so the interior stays open like the STL. Both
  caps share one parent carrying the core `rotateY(90deg)`.

The camera is pure CSS custom properties (`--rotX`, `--fov`, …) driven by the
slider panel; defaults live in `src/styles/global.css`.

## Strict TypeScript

`tsconfig.json` extends `astro/tsconfigs/strict` with `noUnusedLocals` /
`noUnusedParameters` / `noImplicitOverride`. The generator (`scripts/`), the
generated component, and the page all type-check via `npm run check`.
