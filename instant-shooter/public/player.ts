import { MAX_ACC_PXPS, MAX_VEL_PXPS, FRICTION_PXPS } from './constants.js';
import { createVector, Vector } from './vector.js';
import { IObject, IChange } from './object.js';
import { Weapon } from './weapon.js';
import { Graphics } from './graphics.js';

export class Player implements IObject {
  public readonly type: 'player';
  public readonly r: number;
  public pos: Vector;
  public vel: Vector;
  public direction: Vector;
  public readonly velLimit: number;
  public weapon: Weapon | null;
  public readonly couldIntersect: Set<never>;

  public readonly w: number;
  public readonly h: number;
  public readonly graphics: Graphics;
  private readonly _forces: Set<Vector>;

  constructor(pos: Vector, direction: Vector, w: number, h: number) {
    this.type = 'player';
    this.pos = pos;
    this.direction = direction;
    this._forces = new Set();
    this.vel = createVector(0, 0);
    this.w = w;
    this.h = h;
    this.r = Math.min(w, h) / 2;
    this.velLimit = MAX_VEL_PXPS;
    this.weapon = null;
    this.graphics = new Graphics(w, h);
    this.couldIntersect = new Set();
  }

  angle() {
    return createVector(1, 0).angleBetween(this.direction);
  }

  setWeapon(w: Weapon) {
    this.weapon = w;
    this.updateWeaponInfo();
  }

  startFire() {
    if (this.weapon) {
      this.weapon.startFire();
    }
  }

  stopFire() {
    if (this.weapon) {
      this.weapon.stopFire();
    }
  }

  get forces() {
    return [this.getFriction(), this.moveDirection.copy().normalize().setMag(MAX_ACC_PXPS)];
  }

  getFriction() {
    return this.vel.mag() > 0 ? this.vel.copy().normalize().multScalar(-FRICTION_PXPS) : createVector();
  }

  handleIntersect(object: IObject, change: IChange) {
    if (object.type === 'bullet') {
      change.nextVel.multScalar(0.5);
    }
  }

  afterUpdate() {
    if (this._forces.size === 0 && this.vel.mag() < 0.1) {
      this.vel = createVector();
    }
    this.updateWeaponInfo();
  }

  updateWeaponInfo() {
    if (this.weapon) {
      this.weapon.pos = this.pos.copy().add(this.direction.copy().normalize().setMag(this.r));

      this.weapon.direction = this.direction.copy();
    }
  }

  setup() {
    this.draw();
  }

  draw() {
    const { r } = this;
    const { ctx } = this.graphics;

    ctx.beginPath();
    ctx.arc(r, r, r, 0, Math.PI * 2);
    ctx.fillStyle = 'green';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(r, r);
    ctx.lineTo(r * 2, r);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.stroke();
  }

  addForce(f: Vector) {
    this._forces.add(f);
  }

  removeForce(f: Vector) {
    this._forces.delete(f);
  }

  get moveDirection() {
    return Array.from(this._forces).reduce((acc, f) => {
      acc.add(f);
      return acc;
    }, createVector());
  }
}
