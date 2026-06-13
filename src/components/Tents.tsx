// The five tents — every face and chevron cap as a CSS-3D-transformed element.
// This file is the source of truth: originally derived from tents.stl, now
// maintained by hand. Each tent's --bend term flies it between the hero arc and
// the header line; the camera/scene rig lives in src/styles/global.css.
import type { VNode } from "preact";

export default function Tents(): VNode {
  return (
    <>
      <div class="tent" style="transform:translate3d(calc(-0.00px + var(--bend) * -10.19px),calc(-1.18px + var(--bend) * 1.18px),-45.60px) rotateZ(calc(var(--bend) * 0.00deg))">
        <div class="face" style="width:754.92px;height:291.38px;transform:translate3d(-377.47px,-206.04px,-71.78px) rotateX(45.07deg)" />
        <div class="face face--foot" style="width:754.92px;height:56.86px;transform:translate3d(-377.47px,206.40px,-72.62px) rotateX(-10.46deg)" />
        <div class="face" style="width:754.92px;height:292.57px;transform:translate3d(-377.47px,-0.24px,134.50px) rotateX(-45.07deg)" />
        <div class="face" style="width:754.92px;height:369.96px;transform:translate3d(-377.47px,-262.08px,-84.26px) rotateX(44.95deg)" />
        <div class="face face--foot" style="width:754.92px;height:57.41px;transform:translate3d(-377.47px,-262.08px,-84.26px) rotateX(12.55deg)" />
        <div class="face" style="width:754.92px;height:369.54px;transform:translate3d(-377.47px,-0.24px,177.10px) rotateX(-44.72deg)" />
        <div class="caps" style="transform:rotateY(90deg)">
          <div class="cap" style="width:261.36px;height:524.40px;transform:translate3d(-177.10px,-262.08px,377.45px)"><svg viewBox="0 0 261.36 524.40"><polygon points="261.36,0.00 0.00,261.84 260.04,524.40 249.72,468.48 42.60,261.84 248.88,56.04" /></svg></div>
          <div class="cap" style="width:261.36px;height:524.40px;transform:translate3d(-177.10px,-262.08px,-377.47px)"><svg viewBox="0 0 261.36 524.40"><polygon points="261.36,0.00 0.00,261.84 260.04,524.40 249.72,468.48 42.60,261.84 248.88,56.04" /></svg></div>
        </div>
      </div>
      <div class="tent" style="transform:translate3d(calc(-12.74px + var(--bend) * 518.53px),calc(-1383.72px + var(--bend) * 138.03px),-47.25px) rotateZ(calc(var(--bend) * 45.00deg))">
        <div class="face" style="width:503.28px;height:301.48px;transform:translate3d(-251.69px,-213.22px,-74.10px) rotateX(45.08deg)" />
        <div class="face face--foot" style="width:503.28px;height:49.36px;transform:translate3d(-251.69px,213.62px,-75.06px) rotateX(-9.23deg)" />
        <div class="face" style="width:503.28px;height:302.92px;transform:translate3d(-251.69px,-0.34px,139.38px) rotateX(-45.06deg)" />
        <div class="face" style="width:503.28px;height:369.79px;transform:translate3d(-251.69px,-262.06px,-84.18px) rotateX(44.95deg)" />
        <div class="face face--foot" style="width:503.28px;height:49.87px;transform:translate3d(-251.69px,-262.06px,-84.18px) rotateX(11.66deg)" />
        <div class="face" style="width:503.28px;height:369.62px;transform:translate3d(-251.69px,-0.34px,177.06px) rotateX(-44.71deg)" />
        <div class="caps" style="transform:rotateY(90deg)">
          <div class="cap" style="width:261.24px;height:524.40px;transform:translate3d(-177.06px,-262.06px,251.59px)"><svg viewBox="0 0 261.24 524.40"><polygon points="261.24,0.00 0.00,261.72 260.04,524.40 252.12,475.68 37.68,261.72 251.16,48.84" /></svg></div>
          <div class="cap" style="width:261.24px;height:524.40px;transform:translate3d(-177.06px,-262.06px,-251.69px)"><svg viewBox="0 0 261.24 524.40"><polygon points="261.24,0.00 0.00,261.72 260.04,524.40 252.12,475.68 37.68,261.72 251.16,48.84" /></svg></div>
        </div>
      </div>
      <div class="tent" style="transform:translate3d(calc(-12.74px + var(--bend) * 136.65px),calc(-689.28px + var(--bend) * 15.11px),-47.25px) rotateZ(calc(var(--bend) * 22.50deg))">
        <div class="face" style="width:503.28px;height:301.48px;transform:translate3d(-251.69px,-213.23px,-74.10px) rotateX(45.08deg)" />
        <div class="face face--foot" style="width:503.28px;height:49.36px;transform:translate3d(-251.69px,213.61px,-75.06px) rotateX(-9.23deg)" />
        <div class="face" style="width:503.28px;height:302.92px;transform:translate3d(-251.69px,-0.35px,139.38px) rotateX(-45.06deg)" />
        <div class="face" style="width:503.28px;height:369.79px;transform:translate3d(-251.69px,-262.07px,-84.18px) rotateX(44.95deg)" />
        <div class="face face--foot" style="width:503.28px;height:49.87px;transform:translate3d(-251.69px,-262.07px,-84.18px) rotateX(11.66deg)" />
        <div class="face" style="width:503.28px;height:369.62px;transform:translate3d(-251.69px,-0.35px,177.06px) rotateX(-44.71deg)" />
        <div class="caps" style="transform:rotateY(90deg)">
          <div class="cap" style="width:261.24px;height:524.40px;transform:translate3d(-177.06px,-262.07px,251.59px)"><svg viewBox="0 0 261.24 524.40"><polygon points="261.24,0.00 0.00,261.72 260.04,524.40 252.12,475.68 37.68,261.72 251.16,48.84" /></svg></div>
          <div class="cap" style="width:261.24px;height:524.40px;transform:translate3d(-177.06px,-262.07px,-251.69px)"><svg viewBox="0 0 261.24 524.40"><polygon points="261.24,0.00 0.00,261.72 260.04,524.40 252.12,475.68 37.68,261.72 251.16,48.84" /></svg></div>
        </div>
      </div>
      <div class="tent" style="transform:translate3d(calc(-12.74px + var(--bend) * 136.65px),calc(690.12px + var(--bend) * -15.96px),-47.25px) rotateZ(calc(var(--bend) * -22.50deg))">
        <div class="face" style="width:503.28px;height:301.48px;transform:translate3d(-251.69px,-213.22px,-74.10px) rotateX(45.08deg)" />
        <div class="face face--foot" style="width:503.28px;height:49.36px;transform:translate3d(-251.69px,213.62px,-75.06px) rotateX(-9.23deg)" />
        <div class="face" style="width:503.28px;height:302.92px;transform:translate3d(-251.69px,-0.34px,139.38px) rotateX(-45.06deg)" />
        <div class="face" style="width:503.28px;height:369.79px;transform:translate3d(-251.69px,-262.06px,-84.18px) rotateX(44.95deg)" />
        <div class="face face--foot" style="width:503.28px;height:49.87px;transform:translate3d(-251.69px,-262.06px,-84.18px) rotateX(11.66deg)" />
        <div class="face" style="width:503.28px;height:369.62px;transform:translate3d(-251.69px,-0.34px,177.06px) rotateX(-44.71deg)" />
        <div class="caps" style="transform:rotateY(90deg)">
          <div class="cap" style="width:261.24px;height:524.40px;transform:translate3d(-177.06px,-262.06px,251.59px)"><svg viewBox="0 0 261.24 524.40"><polygon points="261.24,0.00 0.00,261.72 260.04,524.40 252.12,475.68 37.68,261.72 251.16,48.84" /></svg></div>
          <div class="cap" style="width:261.24px;height:524.40px;transform:translate3d(-177.06px,-262.06px,-251.69px)"><svg viewBox="0 0 261.24 524.40"><polygon points="261.24,0.00 0.00,261.72 260.04,524.40 252.12,475.68 37.68,261.72 251.16,48.84" /></svg></div>
        </div>
      </div>
      <div class="tent" style="transform:translate3d(calc(-12.74px + var(--bend) * 518.53px),calc(1383.51px + var(--bend) * -137.82px),-47.25px) rotateZ(calc(var(--bend) * -45.00deg))">
        <div class="face" style="width:503.28px;height:301.48px;transform:translate3d(-251.69px,-213.25px,-74.10px) rotateX(45.08deg)" />
        <div class="face face--foot" style="width:503.28px;height:49.24px;transform:translate3d(-251.69px,213.71px,-75.06px) rotateX(-9.26deg)" />
        <div class="face" style="width:503.28px;height:303.01px;transform:translate3d(-251.69px,-0.37px,139.38px) rotateX(-45.05deg)" />
        <div class="face" style="width:503.28px;height:369.87px;transform:translate3d(-251.69px,-262.09px,-84.18px) rotateX(44.93deg)" />
        <div class="face face--foot" style="width:503.28px;height:49.87px;transform:translate3d(-251.69px,-262.09px,-84.18px) rotateX(11.66deg)" />
        <div class="face" style="width:503.28px;height:369.54px;transform:translate3d(-251.69px,-0.25px,177.06px) rotateX(-44.72deg)" />
        <div class="caps" style="transform:rotateY(90deg)">
          <div class="cap" style="width:261.24px;height:524.40px;transform:translate3d(-177.06px,-262.09px,251.59px)"><svg viewBox="0 0 261.24 524.40"><polygon points="261.24,0.00 0.00,261.84 260.04,524.40 252.12,475.80 37.68,261.72 251.16,48.84" /></svg></div>
          <div class="cap" style="width:261.24px;height:524.40px;transform:translate3d(-177.06px,-262.09px,-251.69px)"><svg viewBox="0 0 261.24 524.40"><polygon points="261.24,0.00 0.00,261.84 260.04,524.40 252.12,475.80 37.68,261.72 251.16,48.84" /></svg></div>
        </div>
      </div>
    </>
  );
}
