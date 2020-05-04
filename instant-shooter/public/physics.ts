import { createVector, Vector } from './vector.js';
import { IObject, IChange } from './object.js';

class Change implements IChange {
  public readonly object: IObject;
  public readonly startVel: Vector;
  public readonly startPos: Vector;
  public prevVel: Vector;
  public prevPos: Vector;
  public nextVel: Vector;
  public nextPos: Vector;

  constructor(
    object: IObject,
    startVel: Vector,
    startPos: Vector,
    prevVel: Vector,
    prevPos: Vector,
    nextVel: Vector,
    nextPos: Vector,
  ) {
    this.object = object;
    this.startVel = startVel;
    this.startPos = startPos;
    this.prevVel = prevVel;
    this.prevPos = prevPos;
    this.nextVel = nextVel;
    this.nextPos = nextPos;
  }

  intersects(change: Change) {
    const ar = this.object.r;
    const br = change.object.r;
    const a1 = this.prevPos;
    const a2 = this.nextPos;
    const b1 = change.prevPos;
    const b2 = change.nextPos;

    if (calcCircleDist(a1, ar, b1, br) > this.moveDist() + change.moveDist()) {
      return false;
    }

    const av = this.nextPos.copy().sub(this.prevPos);
    const bv = change.nextPos.copy().sub(change.prevPos);

    const maxDist = Math.ceil(Math.max(dist(a1, a2), dist(b1, b2)));
    const timeframes = maxDist;

    av.multScalar(1 / timeframes);
    bv.multScalar(1 / timeframes);

    let a = a1.copy();
    let b = b1.copy();
    for (let i = 0; i <= timeframes; i++) {
      if (calcCircleDist(a, ar, b, br) <= 1) {
        return true;
      }

      a.add(av);
      b.add(bv);
    }

    return false;
  }

  moveDist() {
    return dist(this.prevPos, this.nextPos);
  }
}

export class Physics {
  private readonly objects: Set<IObject>;
  private readonly deletedObjects: Set<IObject>;
  public readonly changes: Map<IObject, Change>;

  constructor() {
    this.objects = new Set();
    this.deletedObjects = new Set();
    this.changes = new Map();
  }

  setup() {}

  addObject(o: IObject) {
    this.objects.add(o);
  }

  removeObject(o: IObject) {
    this.objects.delete(o);
    this.deletedObjects.add(o);
  }

  update(diff: number) {
    if (diff === 0) {
      return;
    }

    const fullChunkSize = 10;
    const fullChunks = Math.floor(diff / fullChunkSize);
    const lastChunkSize = diff % fullChunkSize;
    this.changes.clear();
    this.deletedObjects.clear();

    for (let i = 0; i <= fullChunks; i++) {
      const lastChunk = i === fullChunks;
      const chunkSize = lastChunk ? lastChunkSize : fullChunkSize;
      if (chunkSize < 0.001) {
        continue;
      }
      const scale = chunkSize / 1000;

      for (const object of this.objects) {
        const forces = object.forces;
        const velLimit = object.velLimit;

        const acc = forces.reduce((acc, f) => {
          acc.add(f);
          return acc;
        }, createVector());

        acc.multScalar(scale);

        const prevPos = this.changes.has(object) ? this.changes.get(object)!.nextPos : object.pos;
        const prevVel = this.changes.has(object) ? this.changes.get(object)!.nextVel : object.vel;
        const nextVel = prevVel.copy().add(acc);
        if (velLimit) {
          nextVel.limit(velLimit);
        }
        const nextPos = prevPos.copy().add(nextVel.copy().multScalar(scale));

        // if (nextPos.x - this.r < 0) {
        //   nextPos.x = this.r;
        // }
        // if (nextPos.x + this.r > this.game.map.w) {
        //   nextPos.x = this.game.map.w - this.r;
        // }
        // if (nextPos.y - this.r < 0) {
        //   nextPos.y = this.r;
        // }
        // if (nextPos.y + this.r > this.game.map.h) {
        //   nextPos.y = this.game.map.h - this.r;
        // }

        if (this.changes.has(object)) {
          const change = this.changes.get(object)!;
          change.prevVel = prevVel;
          change.prevPos = prevPos;
          change.nextVel = nextVel;
          change.nextPos = nextPos;
        } else {
          this.changes.set(object, new Change(object, prevVel, prevPos, prevVel, prevPos, nextVel, nextPos));
        }
      }

      const changes = Array.from(this.changes.values());
      for (let i = 0; i < changes.length; i++) {
        const changeA = changes[i];
        const objectA = changeA.object;

        for (let j = i + 1; j < changes.length; j++) {
          const changeB = changes[j];
          const objectB = changeB.object;

          if (this.deletedObjects.has(objectA)) {
            continue;
          }
          if (this.deletedObjects.has(objectB)) {
            continue;
          }

          const aCouldIntersectB = objectA.couldIntersect.has(objectB.type);
          const bCouldIntersectA = objectB.couldIntersect.has(objectA.type);

          if (!aCouldIntersectB && !bCouldIntersectA) {
            continue;
          }

          if (changeA.intersects(changeB)) {
            if (aCouldIntersectB && objectA.handleIntersect) {
              objectA.handleIntersect(objectB, changeA);
            }

            if (bCouldIntersectA && objectB.handleIntersect) {
              objectB.handleIntersect(objectA, changeB);
            }
          }
        }
      }

      for (const deletedObject of this.deletedObjects) {
        this.changes.delete(deletedObject);
      }
      this.deletedObjects.clear();
    }

    for (const change of this.changes.values()) {
      change.object.vel = change.nextVel;
      change.object.pos = change.nextPos;
      if (change.object.afterUpdate) {
        change.object.afterUpdate();
      }
    }
  }
}

function dist(p1: Vector, p2: Vector) {
  return Math.hypot(p2.x - p1.x, p2.y - p1.y);
}

function calcCircleDist(p1: Vector, r1: number, p2: Vector, r2: number) {
  return dist(p1, p2) - (r2 + r1);
}
