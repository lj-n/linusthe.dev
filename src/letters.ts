import './letters.css';
import type { Cuboid, RigidBody } from '@dimforge/rapier2d';

import("@dimforge/rapier2d").then((RAPIER) => {
  console.log("rapier loaded")
  const letters = document.querySelectorAll<HTMLElement>("span:not(.whitespace)");

  const button = document.getElementById("chaos-button") as HTMLButtonElement;
  button.style.display = "flex";
  button.style.opacity = "1";

  /** Physics world */
  const gravity = new RAPIER.Vector2(0.0, 9.8);
  const world = new RAPIER.World(gravity);
  const scaling = 50; // 1 physics meter = 50px

  function createPhysicsNode(element: HTMLElement) {
    const rect = element.getBoundingClientRect()

    const halfWidth = rect.width / scaling / 2
    const halfHeight = rect.height / scaling / 2

    const positionX = (rect.left / scaling) + halfWidth
    const positionY = (rect.top / scaling) + halfHeight

    const body = world.createRigidBody(
      RAPIER.RigidBodyDesc
        .dynamic()
        .setTranslation(positionX, positionY)
        .setSleeping(true)
    );

    world.createCollider(
      RAPIER.ColliderDesc.cuboid(halfWidth, halfHeight).setRestitution(0.3),
      body
    );

    return {
      element,
      body
    }
  }

  const nodes: {
    element: HTMLElement,
    body: RigidBody
  }[] = [];

  function transformElements() {
    for (const { element, body } of nodes) {
      const translation = body.translation()
      const rotation = body.rotation()
      const shape = body.collider(0).shape as Cuboid;

      const positionX = (translation.x - shape.halfExtents.x) * scaling
      const positionY = (translation.y - shape.halfExtents.y) * scaling

      element.style.position = 'fixed';
      element.style.left = `${positionX}px`;
      element.style.top = `${positionY}px`;
      element.style.transform = `rotate(${rotation}rad)`;
    }
  }

  {
    const thickness = 8;
    let width = window.innerWidth;
    let height = window.innerHeight;
    width = width / scaling;
    height = height / scaling;

    const left = RAPIER.ColliderDesc
      .cuboid(thickness / 2, height)
      .setTranslation(-thickness / 2, height / 2);

    const right = RAPIER.ColliderDesc
      .cuboid(thickness / 2, height)
      .setTranslation(width + thickness / 2, height / 2);

    const top = RAPIER.ColliderDesc
      .cuboid(width, thickness / 2)
      .setTranslation(width / 2, -thickness / 2);

    const bottom = RAPIER.ColliderDesc
      .cuboid(width, thickness / 2)
      .setTranslation(width / 2, height + thickness / 2);

    world.createCollider(left);
    world.createCollider(right);
    world.createCollider(top);
    world.createCollider(bottom);
  }

  button.addEventListener("click", (ev) => {
    if (!nodes.length) {
      nodes.push(...Array.from(letters).map(createPhysicsNode))
    }

    const mousePosition = {
      x: ev.clientX / scaling,
      y: ev.clientY / scaling
    }

    nodes.forEach(node => {
      const nodePosition = node.body.translation()
      const directionVector = {
        x: nodePosition.x - mousePosition.x,
        y: nodePosition.y - mousePosition.y
      }
      const vectorLength = Math.sqrt((directionVector.x * directionVector.x) + (directionVector.y * directionVector.y))

      const normalizedVector = {
        x: directionVector.x / vectorLength * 3,
        y: directionVector.y / vectorLength * 3
      }

      node.body.applyImpulse(normalizedVector, true)
    })
  })

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
      world.timestep = dt;
      world.step();
      t += dt;

      accumulator -= dt;
    }
    transformElements();
  }

  requestAnimationFrame(loop);
})

