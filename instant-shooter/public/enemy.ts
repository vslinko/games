import { FRICTION_PXPS, MAX_ACC_PXPS, MAX_VEL_PXPS } from './constants.js';
import { createVector, Vector } from './vector.js';
import { IObject, IChange } from './object.js';
import { Graphics } from './graphics.js';

export class Enemy implements IObject {
  public readonly type: 'enemy';
  public readonly r: number;
  public pos: Vector;
  public vel: Vector;
  public readonly velLimit: number;
  public readonly couldIntersect: Set<'bullet'>;
  private health: number;

  private readonly game: any;
  public readonly w: number;
  public readonly h: number;
  public readonly graphics: Graphics;

  constructor(game: any, pos: Vector, w: number, h: number) {
    this.type = 'enemy';
    this.game = game;
    this.pos = pos;
    this.vel = createVector(0, 0);
    this.w = w;
    this.h = h;
    this.r = Math.min(w, h) / 2;
    this.velLimit = MAX_VEL_PXPS / 2;
    this.health = 1;
    this.graphics = new Graphics(w, h);
    this.couldIntersect = new Set(['bullet']);
  }

  get direction() {
    return this.moveDirection;
  }

  get moveDirection() {
    return this.game.currentPlayer.pos.copy().sub(this.pos);
  }

  setup() {
    this.draw();
  }

  handleIntersect(object: IObject, change: IChange) {
    if (object.type === 'bullet') {
      change.nextVel.multScalar(0.5);
      this.health -= 0.4;
    }
    if (this.health <= 0) {
      this.game.removeEnemy(this);
    }
  }

  afterDestroy() {
    this.graphics.destroy();
  }

  draw() {
    const { r } = this;
    const { ctx } = this.graphics;

    ctx.beginPath();
    ctx.arc(r, r, r, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(r, r);
    ctx.lineTo(r * 2, r);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.stroke();
  }

  angle() {
    return createVector(1, 0).angleBetween(this.direction);
  }

  get forces() {
    return [this.getFriction(), this.moveDirection.copy().normalize().setMag(MAX_ACC_PXPS)];
  }

  getFriction() {
    return this.vel.mag() > 0 ? this.vel.copy().normalize().multScalar(-FRICTION_PXPS) : createVector();
  }
}
