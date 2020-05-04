import { Vector } from './vector';

export interface IChange {
  readonly object: IObject;
  readonly startVel: Vector;
  readonly startPos: Vector;
  prevVel: Vector;
  prevPos: Vector;
  nextVel: Vector;
  nextPos: Vector;
}

export type TObjectType = 'bullet' | 'enemy' | 'player';

export interface IObject {
  type: TObjectType;
  r: number;
  pos: Vector;
  vel: Vector;
  forces: Vector[];
  velLimit?: number;
  couldIntersect: Set<TObjectType>;
  handleIntersect?(object: IObject, change: IChange): void;
  afterUpdate?(): void;
}
