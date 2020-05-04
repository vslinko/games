import { Bullet } from './bullet.js';
import { WEAPON_FIRE_PER_SECOND } from './constants.js';
import { createVector, Vector } from './vector.js';

export class Weapon {
  private readonly game: any;
  public pos: Vector;
  public direction: Vector;
  private interval: number | null;

  constructor(game: any, pos: Vector, direction: Vector) {
    this.game = game;
    this.pos = pos;
    this.direction = direction;
    this.interval = null;
  }

  setup() {}

  startFire() {
    this.fire();
    this.interval = setInterval(() => {
      this.fire();
    }, 1000 / WEAPON_FIRE_PER_SECOND);
  }

  stopFire() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  private fire() {
    const bullet = new Bullet(this.game, this.pos.copy().add(createVector(0, 0, 1)), this.direction.copy().normalize());
    bullet.setup();
    this.game.addBullet(bullet);
  }
}
