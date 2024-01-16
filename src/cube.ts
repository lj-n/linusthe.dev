import type { World, Vector2 } from "@dimforge/rapier2d";
import { lerpRadians, lerpVector } from "./utils";

const RAPIER = await import("@dimforge/rapier2d");

/**
 * Creates a cube object in a 2D world.
 * @param world - The world in which the cube exists.
 * @param scalingFactor - The scaling factor to convert world coordinates to pixel coordinates.
 * @param context - The canvas rendering context used to draw the cube.
 * @param options - Additional options for the cube.
 * @returns An object representing the cube with its associated properties and methods.
 */
export function createCube(
  world: World,
  scalingFactor: number,
  context: CanvasRenderingContext2D,
  {
    hx,
    hy,
    color = "#100F0F",
    translation = new RAPIER.Vector2(0, 0),
    rotation = 0,
    restitution = 0.5,
    density = 1.0,
    sleeping = true,
    radius = 4,
  }: {
    hx: number;
    hy: number;
    color?: string;
    translation?: Vector2;
    rotation?: number;
    restitution?: number;
    density?: number;
    sleeping?: boolean;
    radius?: number;
  }
) {
  const bodyDesc = RAPIER.RigidBodyDesc
    .dynamic()
    .setTranslation(translation.x, translation.y)
    .setRotation(rotation)
    .setSleeping(sleeping);
  const body = world.createRigidBody(bodyDesc);

  const colliderDesc = RAPIER.ColliderDesc
    .cuboid(hx, hy)
    .setRestitution(restitution)
    .setDensity(density);
  const collider = world.createCollider(colliderDesc, body);

  return {
    body,
    collider,
    pTranslation: body.translation(),
    pRotation: body.rotation(),
    /**
     * Save the previous translation and rotation
     * to inerpolate the values at a high framerate
     */
    setPreviousBodyState() {
      this.pTranslation = body.translation();
      this.pRotation = body.rotation();
    },
    /**
     * Renders the cube.
     * @param alpha - The alpha value used for interpolation.
     */
    render(alpha: number) {
      const position = lerpVector(
        this.pTranslation,
        this.body.translation(),
        alpha
      );
      const rotation = lerpRadians(
        this.pRotation, 
        this.body.rotation(), 
        alpha
      );

      /** scale the position to pixels */
      const scaledPosition = {
        x: position.x * scalingFactor,
        y: position.y * scalingFactor,
      };

      context.save();

      context.translate(scaledPosition.x, scaledPosition.y);
      context.rotate(rotation);

      context.beginPath();
      context.roundRect(
        -hx * scalingFactor,
        -hy * scalingFactor,
        hx * scalingFactor * 2,
        hy * scalingFactor * 2,
        [radius]
      );

      context.fillStyle = color;
      context.fill();

      context.restore();
    },
  };
}
