import { createVector, Vector } from './vector.js';
import { Mouse } from './mouse.js';
import { Physics } from './physics.js';
import { Player } from './player.js';
import { Bullet } from './bullet.js';
import { Enemy } from './enemy.js';
import { Map } from './map.js';
import { assertNotNull } from './utils.js';
import { Graphics } from './graphics.js';

export class Game {
  private readonly mouse: Mouse;
  private physics: Physics | null;
  private currentPlayer: Player | null;
  private bullets: Set<Bullet>;
  public enemies: Set<Enemy>;
  private map: Map | null;
  private lastUpdate: number | null;
  private lastDraw: number | null;
  private debug: boolean;
  public readonly w: number;
  public readonly h: number;
  public readonly graphics: Graphics;
  private readonly upArrowForce: Vector;
  private readonly downArrowForce: Vector;
  private readonly leftArrowForce: Vector;
  private readonly rightArrowForce: Vector;

  constructor(w: number, h: number) {
    this.mouse = new Mouse();
    this.physics = null;
    this.currentPlayer = null;
    this.bullets = new Set();
    this.enemies = new Set();
    this.map = null;
    this.lastUpdate = null;
    this.lastDraw = null;
    this.debug = false;
    this.w = w;
    this.h = h;
    this.upArrowForce = createVector(0, -1);
    this.downArrowForce = createVector(0, 1);
    this.leftArrowForce = createVector(-1, 0);
    this.rightArrowForce = createVector(1, 0);
    this.graphics = new Graphics(w, h, false);
  }

  setPhysics(physics: Physics) {
    this.physics = physics;
  }

  addBullet(b: Bullet) {
    assertNotNull(this.physics);
    this.bullets.add(b);
    this.physics.addObject(b);
  }

  removeBullet(b: Bullet) {
    assertNotNull(this.physics);
    this.bullets.delete(b);
    this.physics.removeObject(b);
  }

  addEnemy(e: Enemy) {
    assertNotNull(this.physics);
    this.enemies.add(e);
    this.physics.addObject(e);
  }

  removeEnemy(e: Enemy) {
    assertNotNull(this.physics);
    this.enemies.delete(e);
    this.physics.removeObject(e);
    e.afterDestroy();
  }

  get players() {
    const players: (Player | Enemy)[] = [...this.enemies];

    if (this.currentPlayer) {
      players.push(this.currentPlayer);
    }

    return players;
  }

  setMap(map: Map) {
    this.map = map;
  }

  setCurrentPlayer(player: Player) {
    assertNotNull(this.physics);
    this.currentPlayer = player;
    this.physics.addObject(player);
  }

  update() {
    assertNotNull(this.currentPlayer);
    assertNotNull(this.physics);

    const now = Date.now();
    const diff = this.lastUpdate ? now - this.lastUpdate : 0;

    this.currentPlayer.direction = createVector(this.mouse.mouseX, this.mouse.mouseY).sub(this.currentPlayer.pos);

    this.physics.update(diff);

    this.lastUpdate = now;
  }

  mousePressed() {
    assertNotNull(this.currentPlayer);
    this.currentPlayer.startFire();
  }

  mouseReleased() {
    assertNotNull(this.currentPlayer);
    this.currentPlayer.stopFire();
  }

  setup() {
    this.update();
  }

  draw() {
    assertNotNull(this.map);
    assertNotNull(this.physics);

    const now = Date.now();
    if (!this.lastDraw) {
      this.lastDraw = now;
    }
    const diff = now - this.lastDraw;
    const rate = 1000 / diff;

    const { ctx } = this.graphics;

    ctx.drawImage(this.map.graphics.canvas, 0, 0);

    if (this.debug) {
      ctx.fillText(rate.toFixed(0), 10, 10);
    }

    for (const player of this.players) {
      ctx.save();
      ctx.translate(player.pos.x, player.pos.y);
      ctx.rotate(player.angle());
      const scale = player.graphics.canvas.width / player.w;
      ctx.drawImage(
        player.graphics.canvas,
        0,
        0,
        player.w * scale,
        player.h * scale,
        -player.w / 2,
        -player.h / 2,
        player.w,
        player.h,
      );
      ctx.restore();

      if (this.debug) {
        ctx.save();
        ctx.textAlign = 'center';
        ctx.fillText(player.vel.mag().toFixed(3), player.pos.x, player.pos.y);
        ctx.restore();
      }
    }

    for (const bullet of this.bullets) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(bullet.pos.x, bullet.pos.y, bullet.r, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();
      ctx.strokeStyle = 'black';
      ctx.stroke();
      if (this.debug) {
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.fillText(bullet.pos.z.toFixed(3), bullet.pos.x, bullet.pos.y);
      }
      ctx.restore();
    }

    if (this.debug) {
      for (const change of this.physics.changes.values()) {
        ctx.beginPath();
        ctx.moveTo(change.startPos.x, change.startPos.y);
        ctx.lineTo(change.nextPos.x, change.nextPos.y);
        ctx.stroke();
      }
    }

    this.lastDraw = now;
  }

  upArrowPressed() {
    assertNotNull(this.currentPlayer);
    this.currentPlayer.addForce(this.upArrowForce);
  }

  upArrowReleased() {
    assertNotNull(this.currentPlayer);
    this.currentPlayer.removeForce(this.upArrowForce);
  }

  downArrowPressed() {
    assertNotNull(this.currentPlayer);
    this.currentPlayer.addForce(this.downArrowForce);
  }

  downArrowReleased() {
    assertNotNull(this.currentPlayer);
    this.currentPlayer.removeForce(this.downArrowForce);
  }

  leftArrowPressed() {
    assertNotNull(this.currentPlayer);
    this.currentPlayer.addForce(this.leftArrowForce);
  }

  leftArrowReleased() {
    assertNotNull(this.currentPlayer);
    this.currentPlayer.removeForce(this.leftArrowForce);
  }

  rightArrowPressed() {
    assertNotNull(this.currentPlayer);
    this.currentPlayer.addForce(this.rightArrowForce);
  }

  rightArrowReleased() {
    assertNotNull(this.currentPlayer);
    this.currentPlayer.removeForce(this.rightArrowForce);
  }
}
