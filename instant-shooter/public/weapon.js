import { Bullet } from './bullet.js';
import { WEAPON_FIRE_PER_SECOND } from './constants.js';
import { createVector } from './vector.js';
export class Weapon {
    constructor(game, pos, direction) {
        this.game = game;
        this.pos = pos;
        this.direction = direction;
        this.interval = null;
    }
    setup() { }
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
    fire() {
        const bullet = new Bullet(this.game, this.pos.copy().add(createVector(0, 0, 1)), this.direction.copy().normalize());
        bullet.setup();
        this.game.addBullet(bullet);
    }
}
