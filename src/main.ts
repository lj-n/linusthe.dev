import "./styles.css";
import { createCube } from "./cube";
import { createPointer } from "./pointer";
import { createWalls } from "./walls";

const RAPIER = await import("@dimforge/rapier2d");

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const context = canvas.getContext("2d") as CanvasRenderingContext2D;
const isMobile = window.matchMedia("(max-width: 768px)").matches;

/** resize the canvas */
function handleResize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", handleResize, false);
handleResize();

/** hide the cursor */
document.body.style.cursor = "none";
document.querySelectorAll("a").forEach((el) => {
  el.style.cursor = "none";
});

// /** handle pointer position */
const pointerPosition = new RAPIER.Vector2(canvas.width, canvas.height);
let pointerDown = false;
function setPointerPosition(e: PointerEvent) {
  pointerPosition.x = e.clientX;
  pointerPosition.y = e.clientY;
  pointerDown = e.buttons === 1;
}
window.addEventListener("pointermove", setPointerPosition);
window.addEventListener("pointerdown", () => {
  world.gravity = new RAPIER.Vector2(0.0, -6);
  pointerDown = true;
});
window.addEventListener("mouseup", () => {
  world.gravity = new RAPIER.Vector2(0.0, 9.8);
  pointerDown = false;
});

/** physics */
const gravity = new RAPIER.Vector2(0.0, 9.8);
const world = new RAPIER.World(gravity);
const scalingFactor = 50; // 1 physics meter = 50px

/** create walls */
createWalls(world, canvas, scalingFactor);

/** cubes below heading */
const heading = document.querySelector("h1 > div") as HTMLSpanElement;
const headingBounds = heading.getBoundingClientRect();

const headingCubeHalfSize = 0.36;
const cubes = ["#d14d41", "#da702c", "#4385be"].map((color, idx) => {
  return createCube(world, scalingFactor, context, {
    hx: headingCubeHalfSize,
    hy: headingCubeHalfSize,
    translation: new RAPIER.Vector2(
      headingBounds.left / scalingFactor +
        headingCubeHalfSize +
        idx * headingCubeHalfSize * 2 +
        idx * 0.1,
      headingBounds.bottom / scalingFactor + 0.1
    ),
    color,
    restitution: 0.8,
  });
});

/** cube between words */
cubes.push(
  createCube(world, scalingFactor, context, {
    hx: isMobile ? 0.08 : 0.12,
    hy: isMobile ? 0.08 : 0.12,
    translation: new RAPIER.Vector2(
      headingBounds.right / scalingFactor + (isMobile ? 0.2 : 0.3),
      headingBounds.bottom / scalingFactor - (isMobile ? 0.42 : 0.6)
    ),
    rotation: Math.PI / 4,
    radius: 2,
  })
);

/** cubes below links */
const links = document.querySelectorAll("a span");
const colors = ["#ce5d97", "#879a39"];
links.forEach((link, idx) => {
  const linkBounds = link.getBoundingClientRect();
  const cubeHalfHeight = 0.08;
  const cubeHalfWidth = linkBounds.width / scalingFactor / 2;

  cubes.push(
    createCube(world, scalingFactor, context, {
      hx: cubeHalfWidth,
      hy: cubeHalfHeight,
      translation: new RAPIER.Vector2(
        linkBounds.left / scalingFactor + cubeHalfWidth,
        linkBounds.bottom / scalingFactor
      ),
      color: colors[idx],
      radius: 1,
      restitution: 0.2,
      density: 4,
    })
  );
});

/** create pointer */
const pointer = createPointer(world, canvas, scalingFactor);

let t = 0;
let dt = 1 / 60;
let currentTime = performance.now() / 1000;
let accumulator = 0;

function loop(newTime: DOMHighResTimeStamp) {
  let frameTime = (newTime - currentTime) / 1000;
  if (frameTime > 0.25) frameTime = 0.25;

  currentTime = newTime;
  accumulator += frameTime;

  while (accumulator >= dt) {
    cubes.forEach((cube) => cube.setPreviousBodyState());
    pointer.update(pointerPosition);

    world.timestep = dt;
    world.step();
    t += dt;

    accumulator -= dt;
  }

  const alpha = accumulator / dt;

  context.clearRect(0, 0, canvas.width, canvas.height);

  cubes.forEach((cube) => cube.render(alpha));
  pointer.render(pointerDown);

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
