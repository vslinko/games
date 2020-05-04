import { assertNotNull } from './utils.js';

export class Graphics {
  public readonly canvas: HTMLCanvasElement;
  public readonly ctx: CanvasRenderingContext2D;

  constructor(w: number, h: number, hidden: boolean = true) {
    const dpr = window.devicePixelRatio || 1;

    this.canvas = document.createElement('canvas');
    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
    if (hidden) {
      this.canvas.style.display = 'none';
    }
    document.body.appendChild(this.canvas);

    const ctx = this.canvas.getContext('2d');
    assertNotNull(ctx);
    this.ctx = ctx;
    this.ctx.scale(dpr, dpr);
  }

  destroy() {
    if (document.body.contains(this.canvas)) {
      document.body.removeChild(this.canvas);
    }
  }
}
