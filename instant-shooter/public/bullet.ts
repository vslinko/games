import { BULLET_SPEED_PXPS, BULLET_FALL_INITIAL_VEL, BULLET_FALL_MUL, BULLET_SPEED_MUL } from './constants.js';
import { createVector, Vector } from './vector.js';
import { IObject } from './object.js';

export class Bullet implements IObject {
  public readonly type: 'bullet';
  private readonly game: any;
  public readonly r: number;
  public pos: Vector;
  public vel: Vector;
  public readonly couldIntersect: Set<'enemy'>;

  constructor(game: any, pos: Vector, direction: Vector) {
    this.type = 'bullet';
    this.game = game;
    this.r = 3;
    this.couldIntersect = new Set(['enemy']);
    this.pos = pos.copy().add(
      direction
        .copy()
        .normalize()
        .setMag(this.r * 2),
    );
    this.vel = direction
      .copy()
      .normalize()
      .multScalar(BULLET_SPEED_PXPS)
      .add(createVector(0, 0, BULLET_FALL_INITIAL_VEL));
  }

  setup() {}

  get forces() {
    return [createVector(this.vel.x * BULLET_SPEED_MUL, this.vel.y * BULLET_SPEED_MUL, this.vel.z * BULLET_FALL_MUL)];
  }

  handleIntersect(object: IObject) {
    if (object.type === 'enemy') {
      this.game.removeBullet(this);
      return;
    }
  }

  afterUpdate() {
    if (this.pos.z <= 0) {
      this.game.removeBullet(this);
      return;
    }
  }
}
