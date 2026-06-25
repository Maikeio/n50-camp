// Shared placement inputs for the tent components. --row-* and --angle feed the
// hero-arc→header-line fly (see .tent in header.css, driven by --bend on body).
// rowX/rowZ default to the scene centerline (0); consumers pass the side-tent
// corrections.
export interface TentPlacement {
  rowX?: number;
  rowY: number;
  rowZ?: number;
  angle: number;
}

export function tentStyle({
  rowX = 0,
  rowY,
  rowZ = 0,
  angle,
}: TentPlacement): string {
  return `--row-x:${rowX}px;--row-y:${rowY}px;--row-z:${rowZ}px;--angle:${angle}deg`;
}
