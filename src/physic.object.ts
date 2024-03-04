import type {
  Ball,
  Collider,
  ColliderDesc,
  ConvexPolygon,
  Cuboid,
  RigidBody,
  RigidBodyDesc,
  Vector,
  World,
} from "@dimforge/rapier2d";
import { lerpRadians, lerpVector } from "./utils";

const RAPIER = await import("@dimforge/rapier2d");

/**
 * Represents a physics object in the world.
 */
export class PhysicsObject {
  /** The world that the physics object belongs to. */
  readonly world: World;
  /** The scaling factor applied to the object's position and size. */
  readonly scaling: number;
  /** The rigid body associated with the physics object. */
  readonly body: RigidBody;
  /** The collider associated with the physics object. */
  readonly collider: Collider;

  /** The color for rendering the physics object. */
  color: string;

  /**
   * The previous translation of the physics object's body.
   * Used for interpolation at high framerates.
   */
  private previousTranslation: Vector;

  /**
   * The previous rotation of the physics object's body.
   * Used for interpolation at high framerates.
   */
  private previousRotation: number;

  constructor(
    world: World,
    scaling: number,
    bodyDesc: RigidBodyDesc,
    colliderDesc: ColliderDesc,
    color: string = "#000000"
  ) {
    this.world = world;
    this.scaling = scaling;
    this.body = world.createRigidBody(bodyDesc);
    this.collider = world.createCollider(colliderDesc, this.body);

    this.color = color;

    this.previousTranslation = this.body.translation();
    this.previousRotation = this.body.rotation();
  }

  /**
   * Save the previous translation and rotation
   * to interpolate the values at high framerates.
   */
  saveBodyState() {
    this.previousTranslation = this.body.translation();
    this.previousRotation = this.body.rotation();
  }

  /**
   * Renders the shape on a canvas context with the given alpha value.
   *
   * @param context - The canvas rendering context.
   * @param alpha - The alpha value used for interpolation.
   */
  render(context: CanvasRenderingContext2D, alpha: number) {
    const [position, rotation] = [
      lerpVector(this.previousTranslation, this.body.translation(), alpha),
      lerpRadians(this.previousRotation, this.body.rotation(), alpha),
    ];

    switch (this.collider.shape.type) {
      case RAPIER.ShapeType.Ball:
        context.beginPath();
        context.arc(
          position.x * this.scaling,
          position.y * this.scaling,
          (this.collider.shape as Ball).radius * this.scaling,
          0,
          2 * Math.PI
        );
        context.closePath();

        context.fillStyle = this.color;
        context.fill();
        break;

      case RAPIER.ShapeType.Cuboid:
        context.save();

        context.translate(position.x * this.scaling, position.y * this.scaling);
        context.rotate(rotation);

        context.beginPath();
        context.roundRect(
          -(this.collider.shape as Cuboid).halfExtents.x * this.scaling,
          -(this.collider.shape as Cuboid).halfExtents.y * this.scaling,
          (this.collider.shape as Cuboid).halfExtents.x * this.scaling * 2,
          (this.collider.shape as Cuboid).halfExtents.y * this.scaling * 2,
          [4]
        );
        context.closePath();

        context.fillStyle = this.color;
        context.fill();

        context.restore();
        break;

      case RAPIER.ShapeType.ConvexPolygon:
        const { vertices } = this.collider.shape as ConvexPolygon;

        context.save();

        context.translate(position.x * this.scaling, position.y * this.scaling);
        context.rotate(rotation);

        context.beginPath();
        context.moveTo(vertices[0] * this.scaling, vertices[1] * this.scaling);
        for (let i = 2; i < vertices.length; i += 2) {
          context.lineTo(
            vertices[i] * this.scaling,
            vertices[i + 1] * this.scaling
          );
        }
        context.closePath();

        context.fillStyle = this.color;
        context.fill();

        context.restore();
        break;

      default:
    }
  }
}
