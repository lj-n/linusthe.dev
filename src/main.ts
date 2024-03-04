import "./styles.css";
import { createPointer } from "./pointer";
import { createWalls } from "./walls";
import brace from "./brace.shape";
import { PhysicsObject } from "./physic.object";

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

/** Dom elements to position physic objects */
const headingElements = document.querySelectorAll<HTMLDivElement>("h1 div");
const headingBounds = [
  headingElements[0].getBoundingClientRect(),
  headingElements[1].getBoundingClientRect(),
];
const links = document.querySelectorAll("a span");
const colors = ["#da702c", "#d0a215"];

/** Physics world */
const gravity = new RAPIER.Vector2(0.0, 9.8);
const world = new RAPIER.World(gravity);
const scaling = 50; // 1 physics meter = 50px

/**
 * Collider Groups
 * | Type             | Group        | Interact with groups | Bitmask    |
 * | :--------------- | :----------  | :------------------  | :--------- |
 * | Walls            | 0            | 2                    | 0x00010004 |
 * | Pointer          | 1            | 2                    | 0x00020004 |
 * | Objects          | 2            | 0, 1, 2              | 0x00040007 |
 */
const COLLISION_GROUP_OBJECTS = 0x00040007;

/** Physic Objects */
createWalls(world, canvas, scaling);
const pointer = createPointer(world, canvas, scaling);

const physicsObjects: PhysicsObject[] = [];

physicsObjects.push(
  /** Left side brace */
  new PhysicsObject(
    world,
    scaling,
    RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(
        headingBounds[0].left / scaling - (isMobile ? 0.5 : 0.8),
        (headingBounds[0].top + headingBounds[0].height / 2) / scaling
      )
      .setSleeping(true),
    RAPIER.ColliderDesc.convexHull(brace)!
      .setCollisionGroups(COLLISION_GROUP_OBJECTS)
      .setDensity(3),
    "#4385be"
  ),
  /** Right side brace */
  new PhysicsObject(
    world,
    scaling,
    RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(
        headingBounds[1].right / scaling + (isMobile ? 0.5 : 0.8),
        (headingBounds[1].top + headingBounds[1].height / 2) / scaling
      )
      .setRotation(Math.PI)
      .setSleeping(true),
    RAPIER.ColliderDesc.convexHull(brace)!
      .setCollisionGroups(COLLISION_GROUP_OBJECTS)
      .setDensity(3),
    "#4385be"
  ),
  /** Dot in between words */
  new PhysicsObject(
    world,
    scaling,
    RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(
        headingBounds[0].right / scaling + (isMobile ? 0.19 : 0.3),
        headingBounds[0].bottom / scaling - (isMobile ? 0.43 : 0.6)
      )
      .setRotation(Math.PI / 4)
      .setSleeping(true),
    RAPIER.ColliderDesc.cuboid(
      ...((isMobile ? [0.1, 0.1] : [0.12, 0.12]) as [number, number])
    )
      .setCollisionGroups(COLLISION_GROUP_OBJECTS)
      .setRestitution(0.8)
  ),
  /** Bars under links */
  ...Array.from(links).map((link, idx) => {
    const linkBounds = link.getBoundingClientRect();
    const cubeHalfHeight = 0.06;
    const cubeHalfWidth = linkBounds.width / 2 / scaling;

    return new PhysicsObject(
      world,
      scaling,
      RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(
          linkBounds.left / scaling + cubeHalfWidth,
          linkBounds.bottom / scaling
        )
        .setSleeping(true),
      RAPIER.ColliderDesc.cuboid(cubeHalfWidth, cubeHalfHeight)
        .setCollisionGroups(COLLISION_GROUP_OBJECTS)
        .setRestitution(0.4),
      colors[idx]
    );
  })
);

/** Animation */
let t = 0;
let dt = 1 / 60;
let currentTime = performance.now() / 1000;
let accumulator = 0;

function loop(newTime: DOMHighResTimeStamp) {
  requestAnimationFrame(loop);

  let frameTime = (newTime - currentTime) / 1000;
  if (frameTime > 0.25) frameTime = 0.25;

  currentTime = newTime;
  accumulator += frameTime;

  /** Step physics world forward */
  while (accumulator >= dt) {
    physicsObjects.forEach((obj) => obj.saveBodyState());
    pointer.update(pointerPosition);

    world.timestep = dt;
    world.step();
    t += dt;

    accumulator -= dt;
  }

  const alpha = accumulator / dt;

  /** Rendering */
  context.clearRect(0, 0, canvas.width, canvas.height);
  physicsObjects.forEach((obj) => obj.render(context, alpha));
  pointer.render(pointerDown);
}

requestAnimationFrame(loop);
