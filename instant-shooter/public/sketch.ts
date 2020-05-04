import { Map } from './map.js';
import { Game } from './game.js';
import { Player } from './player.js';
import { Weapon } from './weapon.js';
import { Enemy } from './enemy.js';
import { Physics } from './physics.js';
import { createVector } from './vector.js';

function main() {
  try {
    const w = 800;
    const h = 600;
    const playerSize = 32;

    const game = new Game(w, h);

    const physics = new Physics();
    physics.setup();
    game.setPhysics(physics);

    const map = new Map(w, h);
    map.setup();
    game.setMap(map);

    const weapon = new Weapon(game, createVector(0, 0), createVector(0, 0));
    weapon.setup();

    const player = new Player(createVector(w / 2, h / 2), createVector(0, 0), playerSize, playerSize);
    player.setWeapon(weapon);
    player.setup();
    game.setCurrentPlayer(player);

    let addEnemyTime = 2000;
    const addEnemy = () => {
      if (game.enemies.size < 30) {
        const enemy = new Enemy(game, createVector(Math.random() * w, Math.random() * h), playerSize, playerSize);
        if (Math.random() > 0.5) {
          enemy.pos.x = Math.random() > 0.5 ? 0 : map.w;
        } else {
          enemy.pos.y = Math.random() > 0.5 ? 0 : map.h;
        }
        enemy.setup();
        game.addEnemy(enemy);
      }
      if (addEnemyTime > 100) {
        addEnemyTime *= 0.9;
      }
      setTimeout(addEnemy, addEnemyTime);
    };
    addEnemy();

    game.setup();

    window.addEventListener(
      'mousedown',
      () => {
        game.mousePressed();
      },
      { passive: true },
    );
    window.addEventListener(
      'mouseup',
      () => {
        game.mouseReleased();
      },
      { passive: true },
    );

    window.addEventListener(
      'keydown',
      (e) => {
        if (e.repeat) {
          return;
        }
        if (e.key === 'w') {
          game.upArrowPressed();
        }
        if (e.key === 's') {
          game.downArrowPressed();
        }
        if (e.key === 'a') {
          game.leftArrowPressed();
        }
        if (e.key === 'd') {
          game.rightArrowPressed();
        }
      },
      { passive: true },
    );

    window.addEventListener(
      'keyup',
      (e) => {
        if (e.key === 'w') {
          game.upArrowReleased();
        }
        if (e.key === 's') {
          game.downArrowReleased();
        }
        if (e.key === 'a') {
          game.leftArrowReleased();
        }
        if (e.key === 'd') {
          game.rightArrowReleased();
        }
      },
      { passive: true },
    );

    const rafCb = () => {
      game.update();
      game.draw();
      requestAnimationFrame(rafCb);
    };
    requestAnimationFrame(rafCb);
  } catch (err) {
    console.error(err);
  }
}

main();
