import type { World, Vector2, Collider } from "@dimforge/rapier2d";
import { handSVG, lerpVector } from "./utils";

const RAPIER = await import("@dimforge/rapier2d");

/**
 * Collider Groups
 * | Type             | Group        | Interact with groups | Bitmask    |
 * | :--------------- | :----------  | :------------------  | :--------- |
 * | Walls            | 0            | 2                    | 0x00010004 |
 * | Pointer          | 1            | 2                    | 0x00020004 |
 * | Objects          | 2            | 0, 1, 2              | 0x00040007 |
 */
const COLLISION_GROUP_POINTER = 0x00020004;

/**
 * Creates a pointer object that represents a movable pointer in a physics world.
 * @param world - The physics world.
 * @param canvas - The HTML canvas element.
 * @param scalingFactor - The scaling factor to convert real-world coordinates to physics world coordinates.
 * @param radius - The radius of the pointer.
 * @param lerpFactor - The interpolation factor for smooth movement of the pointer.
 * @returns An object containing the pointer's body, collider, context, and methods to update and render the pointer.
 */
export function createPointer(
  world: World,
  canvas: HTMLCanvasElement,
  scalingFactor: number,
  lerpFactor = 0.5
) {
  const body = world.createRigidBody(
    RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(
      canvas.width / scalingFactor,
      canvas.height / scalingFactor
    )
  );

  const collider: Collider[] = [];

  collider.push(
    world.createCollider(
      RAPIER.ColliderDesc.ball(0.55)
        .setEnabled(false)
        .setCollisionGroups(COLLISION_GROUP_POINTER),
      body
    ),
    world.createCollider(
      RAPIER.ColliderDesc.ball(2.5)
        .setEnabled(false)
        .setTranslation(4.5, 4.5)
        .setCollisionGroups(COLLISION_GROUP_POINTER),
      body
    ),
    world.createCollider(
      RAPIER.ColliderDesc.ball(2.5)
        .setEnabled(false)
        .setTranslation(3.7, 4.5)
        .setCollisionGroups(COLLISION_GROUP_POINTER),
      body
    ),
    world.createCollider(
      RAPIER.ColliderDesc.ball(0.7)
        .setEnabled(false)
        .setTranslation(2.53, 2)
        .setCollisionGroups(COLLISION_GROUP_POINTER),
      body
    ),
    world.createCollider(
      RAPIER.ColliderDesc.ball(0.6)
        .setEnabled(false)
        .setTranslation(3.9, 2)
        .setCollisionGroups(COLLISION_GROUP_POINTER),
      body
    ),
    world.createCollider(
      RAPIER.ColliderDesc.ball(1.4)
        .setEnabled(false)
        .setTranslation(4.8, 3)
        .setCollisionGroups(COLLISION_GROUP_POINTER),
      body
    ),
    world.createCollider(
      RAPIER.ColliderDesc.cuboid(0.52, 2)
        .setEnabled(false)
        .setRotation(-0.61)
        .setTranslation(1.15, 1.6)
        .setCollisionGroups(COLLISION_GROUP_POINTER),
      body
    )
  );

  /** prevent immediate forces when the pointer moves to the initial position */
  setTimeout(() => {
    collider.forEach((c) => c.setEnabled(true));
  }, 1000);

  return {
    body,
    collider,
    context: canvas.getContext("2d")!,
    /**
     * Updates the pointer position in the physics world based on the real world pointer position.
     * @param realWorldPointerPosition The position of the pointer in the real world.
     */
    update(realWorldPointerPosition: Vector2) {
      const physicsWorldTargetPosition = {
        x: realWorldPointerPosition.x / scalingFactor,
        y: realWorldPointerPosition.y / scalingFactor,
      };

      const position = lerpVector(
        this.body.translation(),
        physicsWorldTargetPosition,
        lerpFactor
      );

      this.body.setNextKinematicTranslation(position);
    },
    /**
     * Renders the pointer.
     * @param pointerDown - Indicates whether the pointer is currently down.
     */
    render(pointerDown: boolean) {
      let { x, y } = this.body.translation();
      /** position index finger at pointer */
      x = x * scalingFactor;
      y = y * scalingFactor;
      x -= 55;
      y -= 48;

      const svg = pointerDown ? handSVG.click : handSVG.default;

      const handLines = new Path2D();
      for (const [idx, path] of svg.entries()) {
        if (idx === 0) continue; // skip background path
        handLines.addPath(new Path2D(path), new DOMMatrix([1, 0, 0, 1, x, y]));
      }

      const handBackground = new Path2D();
      handBackground.addPath(
        new Path2D(svg[0]),
        new DOMMatrix([1, 0, 0, 1, x, y])
      );

      this.context.fillStyle = "#FFFCF0";
      this.context.fill(handBackground);

      this.context.fillStyle = "#100F0F";
      this.context.fill(handLines);
    },
  };
}
