# tent-viewer

Renders five camping tents — every face a `<div>` placed with **CSS 3D
transforms** (no WebGL, no JS 3D math). Built with **[Astro](https://astro.build)**:
the tent markup is **static HTML at build time** and the site ships **zero
JavaScript** — the hero, the camera fly-in and the reveals are all pure CSS.

## Run

```sh
nix shell nixpkgs#nodejs --command sh -c "npm install && npm run dev"
```

Open the printed URL (e.g. http://localhost:4321). `npm run build` emits the
static site to `dist/`; `npm run check` runs the strict TypeScript check.

## How it works

- **`src/components/Tents.tsx`** — the five tents as one big structured
  component: every face and chevron cap with its transforms baked in. It was
  originally derived from a `tents.stl` model but is now the **source of truth,
  edited by hand** (the build-time generator has been removed).
- **`src/pages/index.astro`** — the page: the sticky 3D stage (scene → camera →
  `<Tents />` + the `N50CAMP` wordmark) and the article that scrolls in beneath it.
- **`src/styles/global.css`** — all the styling and motion (see below). No script.

### Geometry

Each tent is an extrusion of a profile along STL-x, composed via nested
`transform-style: preserve-3d` (scene → camera → tent → faces):

- **6 side faces** — `translate3d(corner) rotateX(edge-angle)`, exact rectangles.
  The two slim bottom faces (the feet) are filled black.
- **2 end caps** — the cross-section is a concave chevron (`∧`): two roof panels
  of real thickness meeting at a ridge, **open underneath**. Each cap is a single
  **SVG `<polygon>`** (white fill + black stroke) drawing that concave outline in
  one crisp raster, 3D-transformed like the faces — so the interior stays open
  and the bordered edge stays sharp (no `clip-path` compositing).
  Both caps share one parent carrying the core `rotateY(90deg)`.

The coordinates in `Tents.tsx` are laid out **×4 larger** for crisp
rasterisation and scaled back down by a matching `scale3d(1/--k)` in the camera
(`--k` in `global.css` — it must match the layout scale baked into the markup).

### Motion (CSS only)

The camera is a set of `@property`-registered custom properties (`--rotX`,
`--fov`, `--bend`, …). Because they're registered, a **scroll-driven animation**
(`animation-timeline: scroll()`) can interpolate them, flying the scene from a
full-page 3/4 hero into a compact sticky header as you scroll — no JS:

- **`--bend`** bends the row of tents from a quarter-circle arc around the
  wordmark (hero) to a straight line (header).
- The **wordmark** is a real object in the 3D scene (a child of `#camera`); its
  own keyframes lift it from lying on the floor to standing as the caption.
- **Zoom** is viewport-adaptive and computed in `#camera`'s static transform (not
  in the keyframes) so it reflows on window resize: the hero fills the screen
  without overflowing either axis and the header keeps a fixed docked size,
  shrinking only when too narrow.
- Article paragraphs fade/lift in on a `view()` timeline.

A `@supports not (animation-timeline: scroll())` block degrades to a static
header-state scene with the article below.

## Strict TypeScript

`tsconfig.json` extends `astro/tsconfigs/strict` with `noUnusedLocals` /
`noUnusedParameters` / `noImplicitOverride`. The tents component and the page
all type-check via `npm run check`.
