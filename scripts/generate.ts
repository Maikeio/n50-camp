// Standalone generator — run rarely, with `npm run generate`.
//
// Parses tents.stl and writes one big structured component, src/generated/Tents.tsx,
// with every tent's markup fully expanded and styled (faces + chevron caps). This
// is the committed source the site renders; it is NOT part of `astro build`.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";

// Supersample: lay the geometry out SS× larger so each face/cap rasterises at
// high resolution, then a matching scale(1/SS) in the camera (global.css --k)
// shrinks it back — textures are minified (crisp) instead of magnified (blurry).
// KEEP IN SYNC with --k in src/styles/global.css.
const SS = 4;
const SCALE = 300 * SS; // world units -> px
const OUT = join(process.cwd(), "src/generated/Tents.tsx");

type Vec3 = [number, number, number];
type Vec2 = [number, number];
type Tri = { n: Vec3; vs: Vec3[] };

// ---------------------------------------------------------------------------
// Vector / formatting helpers
// ---------------------------------------------------------------------------
const norm = (a: Vec3): Vec3 => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};
const fmt = (x: number): string => x.toFixed(2);
const round4 = (x: number): number => Math.round(x * 1e4) / 1e4;
const key = (v: Vec3): string => `${round4(v[0])},${round4(v[1])},${round4(v[2])}`;
const svgPoints = (p: Vec2[]): string => p.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");

// ---------------------------------------------------------------------------
// Parse binary STL
// ---------------------------------------------------------------------------
function parseSTL(buf: Buffer): Tri[] {
  const ntri = buf.readUInt32LE(80);
  let off = 84;
  const tris: Tri[] = [];
  for (let i = 0; i < ntri; i++) {
    const n: Vec3 = [buf.readFloatLE(off), buf.readFloatLE(off + 4), buf.readFloatLE(off + 8)];
    off += 12;
    const vs: Vec3[] = [];
    for (let j = 0; j < 3; j++) {
      vs.push([buf.readFloatLE(off), buf.readFloatLE(off + 4), buf.readFloatLE(off + 8)]);
      off += 12;
    }
    off += 2;
    tris.push({ n, vs });
  }
  return tris;
}

// ---------------------------------------------------------------------------
// Group triangles into tents (connected components by shared vertices)
// ---------------------------------------------------------------------------
function components(tris: Tri[]): number[][] {
  const parent: number[] = tris.map((_, i) => i);
  const find = (a: number): number => {
    let r = a;
    while (parent[r] !== r) {
      const p = parent[r] as number;
      parent[r] = parent[p] as number;
      r = parent[r] as number;
    }
    return r;
  };
  const union = (a: number, b: number): void => {
    parent[find(a)] = find(b);
  };

  const v2t = new Map<string, number[]>();
  tris.forEach((t, i) => {
    for (const v of t.vs) {
      const k = key(v);
      const list = v2t.get(k);
      if (list) list.push(i);
      else v2t.set(k, [i]);
    }
  });
  for (const list of v2t.values()) {
    const first = list[0] as number;
    for (let j = 1; j < list.length; j++) union(first, list[j] as number);
  }

  const comps = new Map<number, number[]>();
  tris.forEach((_, i) => {
    const r = find(i);
    const list = comps.get(r);
    if (list) list.push(i);
    else comps.set(r, [i]);
  });
  return [...comps.values()];
}

// ---------------------------------------------------------------------------
// Coplanar face grouping
// ---------------------------------------------------------------------------
function planeKey(n: Vec3, p: Vec3): string {
  let [nx, ny, nz] = norm(n);
  let d = nx * p[0] + ny * p[1] + nz * p[2];
  if (d < 0) {
    nx = -nx;
    ny = -ny;
    nz = -nz;
    d = -d;
  }
  const q = (x: number): number => Math.round(x * 100) / 100;
  return `${q(nx)},${q(ny)},${q(nz)},${q(d)}`;
}

function planeVertices(faceTris: Tri[]): Vec3[] {
  const seen = new Map<string, Vec3>();
  for (const t of faceTris) {
    for (const p of t.vs) seen.set(key(p), [round4(p[0]), round4(p[1]), round4(p[2])]);
  }
  return [...seen.values()].sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]);
}

// ---------------------------------------------------------------------------
// Emit one tent's JSX lines (indented), faces + chevron caps fully styled.
// ---------------------------------------------------------------------------
function tentLines(tris: Tri[], idxs: number[], C: Vec3): string[] {
  const vmap = new Map<string, Vec3>();
  for (const i of idxs) {
    const tri = tris[i];
    if (tri) for (const v of tri.vs) vmap.set(key(v), v);
  }
  const verts = [...vmap.values()];
  const cx = verts.reduce((s, v) => s + v[0], 0) / verts.length;
  const cy = verts.reduce((s, v) => s + v[1], 0) / verts.length;
  const cz = verts.reduce((s, v) => s + v[2], 0) / verts.length;

  const planes = new Map<string, Tri[]>();
  for (const i of idxs) {
    const tri = tris[i];
    if (!tri) continue;
    const k = planeKey(tri.n, tri.vs[0] as Vec3);
    const list = planes.get(k);
    if (list) list.push(tri);
    else planes.set(k, [tri]);
  }

  interface Side {
    w: number;
    h: number;
    x: number;
    y: number;
    z: number;
    ang: number;
  }
  const sides: Side[] = [];
  const capFaces: Vec3[][] = [];
  for (const ft of planes.values()) {
    const pv = planeVertices(ft);
    if (pv.length === 4) {
      const x0 = Math.min(...pv.map((p) => p[0]));
      const x1 = Math.max(...pv.map((p) => p[0]));
      const L = x1 - x0;
      const ends = [...new Map(pv.map((p): [string, Vec2] => [`${p[1]},${p[2]}`, [p[1], p[2]]])).values()].sort(
        (a, b) => a[0] - b[0] || a[1] - b[1]
      );
      const [P, Q] = ends as [Vec2, Vec2];
      const dy = Q[0] - P[0];
      const dz = Q[1] - P[1];
      sides.push({
        w: L * SCALE,
        h: Math.hypot(dy, dz) * SCALE,
        x: (x0 - cx) * SCALE,
        y: (P[0] - cy) * SCALE,
        z: (P[1] - cz) * SCALE,
        ang: (Math.atan2(dz, dy) * 180) / Math.PI,
      });
    } else {
      capFaces.push(pv);
    }
  }

  // the two slim feet (the bottom faces) are the two shortest sides → fill black
  const footMax = sides.map((s) => s.h).sort((a, b) => a - b)[1];
  const faceLines = sides.map((s) => {
    const cls = s.h <= footMax + 0.5 ? "face face--foot" : "face";
    return (
      `        <div class="${cls}" style="width:${fmt(s.w)}px;height:${fmt(s.h)}px;` +
      `transform:translate3d(${fmt(s.x)}px,${fmt(s.y)}px,${fmt(s.z)}px) rotateX(${fmt(s.ang)}deg)" />`
    );
  });

  // ---- end caps: shared rotateY(90deg) parent, two chevron cap-groups ----
  const capLines: string[] = [];
  capLines.push(`        <div class="caps" style="transform:rotateY(90deg)">`);
  for (const pv of capFaces) {
    const ys = pv.map((p) => p[1]);
    const zs = pv.map((p) => p[2]);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const minZ = Math.min(...zs);
    const maxZ = Math.max(...zs);
    const xcap = (pv[0] as Vec3)[0];

    // chevron vertices: two ridge points + four feet
    const byZ = [...pv].sort((a, b) => b[2] - a[2]);
    const oRidge = byZ[0] as Vec3;
    const iRidge = byZ[1] as Vec3;
    const [OL, IL, IR, OR] = byZ.slice(2).sort((a, b) => a[1] - b[1]) as [Vec3, Vec3, Vec3, Vec3];
    const cl = (p: Vec3): Vec2 => [(maxZ - p[2]) * SCALE, (p[1] - minY) * SCALE];

    // the concave 6-point chevron outline (boundary order)
    const outline: Vec2[] = [OL, oRidge, OR, IR, iRidge, IL].map(cl);
    const W = (maxZ - minZ) * SCALE;
    const H = (maxY - minY) * SCALE;

    const tx = -(maxZ - cz) * SCALE;
    const ty = (minY - cy) * SCALE;
    const tz = (xcap - cx) * SCALE;
    // one element: an SVG polygon (white fill + black stroke) — a sharp bordered
    // chevron in a single raster, 3D-transformed like the faces (no clip-path
    // layer compositing, so the fill/stroke edge stays crisp).
    capLines.push(
      `          <div class="cap" style="width:${fmt(W)}px;height:${fmt(H)}px;` +
        `transform:translate3d(${fmt(tx)}px,${fmt(ty)}px,${fmt(tz)}px)">` +
        `<svg viewBox="0 0 ${fmt(W)} ${fmt(H)}"><polygon points="${svgPoints(outline)}" /></svg></div>`
    );
  }
  capLines.push(`        </div>`);

  const tx = (cx - C[0]) * SCALE;
  const ty = (cy - C[1]) * SCALE;
  const tz = (cz - C[2]) * SCALE;
  return [
    `      <div class="tent" style="transform:translate3d(${fmt(tx)}px,${fmt(ty)}px,${fmt(tz)}px)">`,
    ...faceLines,
    ...capLines,
    `      </div>`,
  ];
}

// ---------------------------------------------------------------------------
// Main: emit src/generated/Tents.tsx
// ---------------------------------------------------------------------------
function main(): void {
  const buf = readFileSync(new URL("tents.stl", import.meta.url));
  const tris = parseSTL(buf);

  const allv = [...new Map(tris.flatMap((t) => t.vs.map((v): [string, Vec3] => [key(v), v]))).values()];
  const axis = (i: 0 | 1 | 2): number =>
    (Math.min(...allv.map((v) => v[i])) + Math.max(...allv.map((v) => v[i]))) / 2;
  const C: Vec3 = [axis(0), axis(1), axis(2)];

  const comps = components(tris);
  const body = comps.flatMap((idxs) => tentLines(tris, idxs, C));

  const out = [
    "// AUTO-GENERATED by scripts/generate.ts — do not edit by hand.",
    "// Regenerate with `npm run generate` when tents.stl changes.",
    'import type { VNode } from "preact";',
    "",
    "export default function Tents(): VNode {",
    "  return (",
    "    <>",
    ...body,
    "    </>",
    "  );",
    "}",
    "",
  ].join("\n");

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, out);
  console.log(`wrote ${OUT}: ${comps.length} tents`);
}

main();
