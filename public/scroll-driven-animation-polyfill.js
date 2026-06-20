(() => {
  console.info("Firefox, please stop making us hand-crank scroll animations like it is 2012.");

  const camera = document.getElementById("camera");
  const wordmark = document.getElementById("wordmark");
  if (!camera || !wordmark) {
    return;
  }

  document.documentElement.classList.add("firefox-scroll-polyfill");

  const stableViewportProbe = document.createElement("div");
  stableViewportProbe.style.cssText = "position:fixed;left:0;top:0;width:0;height:100svh;visibility:hidden;pointer-events:none;";
  document.documentElement.append(stableViewportProbe);

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const lerp = (from, to, progress) => from + (to - from) * progress;
  const stableViewportHeight = () =>
    stableViewportProbe.getBoundingClientRect().height ||
    document.documentElement.clientHeight ||
    window.innerHeight;

  let ticking = false;

  function scheduleUpdate() {
    if (ticking) {
      return;
    }

    ticking = true;
    requestAnimationFrame(update);
  }

  function update() {
    ticking = false;

    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight = stableViewportHeight();
    const progress = clamp(window.scrollY / (viewportHeight * 0.72), 0, 1);
    const heroTop = viewportWidth / viewportHeight >= 1.5 ? viewportHeight * 0.30 : viewportHeight * 0.50;
    const cameraTop = lerp(heroTop, viewportHeight * 0.10, progress);
    const fitHero = clamp(Math.min(viewportWidth / 910, viewportHeight / 390), 0.3, 1.5);
    const fitDock = Math.min(0.6, viewportWidth / 829);
    const sceneScale = lerp(fitHero, fitDock, progress);

    const rotX = lerp(40, 90, progress);
    const dist = lerp(20, 30, progress);
    const panY = lerp(-120, -36, progress);
    const fov = lerp(1500, 900, progress);
    const bend = 1 - progress;

    camera.style.top = `${cameraTop}px`;
    camera.style.setProperty("--p", progress.toFixed(5));
    camera.style.setProperty("--bend", bend.toFixed(5));
    camera.style.transform = [
      `perspective(${fov.toFixed(2)}px)`,
      `translate(0px, ${panY.toFixed(2)}px)`,
      `translateZ(${dist.toFixed(2)}px)`,
      `scale(${sceneScale.toFixed(5)})`,
      `rotateX(${rotX.toFixed(3)}deg)`,
      "rotateY(0deg)",
      "rotateZ(90deg)",
      "scale3d(0.25, 0.25, 0.25)",
    ].join(" ");

    wordmark.style.transform = [
      `translate3d(${lerp(880, 0, progress).toFixed(2)}px, 0px, ${lerp(-120, -300, progress).toFixed(2)}px)`,
      "rotateZ(-90deg)",
      `rotateX(${lerp(0, -90, progress).toFixed(3)}deg)`,
      `scale(${lerp(1.9, 1, progress).toFixed(5)})`,
      "translate(-50%, -50%)",
    ].join(" ");
  }

  update();
  addEventListener("scroll", scheduleUpdate, { passive: true });
  addEventListener("resize", scheduleUpdate, { passive: true });
})();
