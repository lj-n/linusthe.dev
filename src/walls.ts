import { World } from "@dimforge/rapier2d";

const RAPIER = await import("@dimforge/rapier2d");

/**
 * Creates walls around the world based on the provided canvas dimensions.
 *
 * @param world - The world in which the walls will be created.
 * @param canvas - The HTML canvas element representing the game area.
 * @param scalingFactor - The scaling factor to adjust the size of the walls (default: 50).
 * @param thickness - The thickness of the walls (default: 8).
 */
export function createWalls(
  world: World,
  canvas: HTMLCanvasElement,
  scalingFactor = 50,
  thickness = 8
) {
  let { width, height } = canvas;
  width = width / scalingFactor;
  height = height / scalingFactor;

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
