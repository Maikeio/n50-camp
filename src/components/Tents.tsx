// The five tents — every face and chevron cap as a CSS-3D-transformed element.
// This file is the source of truth: originally derived from tents.stl, now
// maintained by hand. Each wrapper's --bend term flies its tent between the
// hero arc and the header line; the camera/scene rig lives in global.css.
import type { VNode } from "preact";

export function CenterTent(): VNode {
  return (
    <div class="tent">
      <div
        class="face"
        style="width:754.92px;height:291.38px;transform:translate3d(-377.47px,-206.04px,-71.78px) rotateX(45.07deg)"
      />
      <div
        class="face face--foot"
        style="width:754.92px;height:56.86px;transform:translate3d(-377.47px,206.40px,-72.62px) rotateX(-10.46deg)"
      />
      <div
        class="face"
        style="width:754.92px;height:292.57px;transform:translate3d(-377.47px,-0.24px,134.50px) rotateX(-45.07deg)"
      />
      <div
        class="face"
        style="width:754.92px;height:369.96px;transform:translate3d(-377.47px,-262.08px,-84.26px) rotateX(44.95deg)"
      />
      <div
        class="face face--foot"
        style="width:754.92px;height:57.41px;transform:translate3d(-377.47px,-262.08px,-84.26px) rotateX(12.55deg)"
      />
      <div
        class="face"
        style="width:754.92px;height:369.54px;transform:translate3d(-377.47px,-0.24px,177.10px) rotateX(-44.72deg)"
      />
      <div class="caps" style="transform:rotateY(90deg)">
        <div
          class="cap"
          style="width:261.36px;height:524.40px;transform:translate3d(-177.10px,-262.08px,377.45px)"
        >
          <svg viewBox="0 0 261.36 524.40">
            <polygon points="261.36,0.00 0.00,261.84 260.04,524.40 249.72,468.48 42.60,261.84 248.88,56.04" />
          </svg>
        </div>
        <div
          class="cap"
          style="width:261.36px;height:524.40px;transform:translate3d(-177.10px,-262.08px,-377.47px)"
        >
          <svg viewBox="0 0 261.36 524.40">
            <polygon points="261.36,0.00 0.00,261.84 260.04,524.40 249.72,468.48 42.60,261.84 248.88,56.04" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function SideTent(): VNode {
  return (
    <div class="tent">
      <div
        class="face"
        style="width:503.28px;height:301.48px;transform:translate3d(-251.69px,-213.22px,-74.10px) rotateX(45.08deg)"
      />
      <div
        class="face face--foot"
        style="width:503.28px;height:49.36px;transform:translate3d(-251.69px,213.62px,-75.06px) rotateX(-9.23deg)"
      />
      <div
        class="face"
        style="width:503.28px;height:302.92px;transform:translate3d(-251.69px,-0.34px,139.38px) rotateX(-45.06deg)"
      />
      <div
        class="face"
        style="width:503.28px;height:369.79px;transform:translate3d(-251.69px,-262.06px,-84.18px) rotateX(44.95deg)"
      />
      <div
        class="face face--foot"
        style="width:503.28px;height:49.87px;transform:translate3d(-251.69px,-262.06px,-84.18px) rotateX(11.66deg)"
      />
      <div
        class="face"
        style="width:503.28px;height:369.62px;transform:translate3d(-251.69px,-0.34px,177.06px) rotateX(-44.71deg)"
      />
      <div class="caps" style="transform:rotateY(90deg)">
        <div
          class="cap"
          style="width:261.24px;height:524.40px;transform:translate3d(-177.06px,-262.06px,251.59px)"
        >
          <svg viewBox="0 0 261.24 524.40">
            <polygon points="261.24,0.00 0.00,261.72 260.04,524.40 252.12,475.68 37.68,261.72 251.16,48.84" />
          </svg>
        </div>
        <div
          class="cap"
          style="width:261.24px;height:524.40px;transform:translate3d(-177.06px,-262.06px,-251.69px)"
        >
          <svg viewBox="0 0 261.24 524.40">
            <polygon points="261.24,0.00 0.00,261.72 260.04,524.40 252.12,475.68 37.68,261.72 251.16,48.84" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function Tents(): VNode {
  const SIDE_TENTS = 8;
  return (
    <>
      <div
        class="tent-position tent-position--center"
        style="--row-y:0px;--angle:0deg"
      >
        <CenterTent />
      </div>
      {[...Array(SIDE_TENTS)].map((_, i) => (
        <>
          <div
            class={"tent-position" + (i >= 2 ? " hero-only" : "")}
            style={`--row-y:${-700 * (i + 1)}px;--angle:${22.5 * (i + 1)}deg`}
          >
            <SideTent />
          </div>
          <div
            class={"tent-position" + (i >= 2 ? " hero-only" : "")}
            style={`--row-y:${700 * (i + 1)}px;--angle:${-22.5 * (i + 1)}deg`}
          >
            <SideTent />
          </div>
        </>
      ))}
    </>
  );
}
