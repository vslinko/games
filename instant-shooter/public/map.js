import { noise } from './noise.js';
import { Graphics } from './graphics.js';
export class Map {
    constructor(w, h) {
        this.w = w;
        this.h = h;
        this.graphics = new Graphics(w, h);
    }
    setup() {
        this.draw();
    }
    draw() {
        const { w, h } = this;
        const { ctx } = this.graphics;
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const n = noise(x / w, y / h) * 255;
                ctx.fillStyle = `rgb(${n}, ${n}, ${n})`;
                ctx.fillRect(x, y, 1, 1);
            }
        }
    }
}
