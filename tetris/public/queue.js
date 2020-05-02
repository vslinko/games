class Queue {
  constructor(graphics, cellSize) {
    this.graphics = graphics;
    this.cellSize = cellSize;
    this._queue = [
      this._randomFigure(),
      this._randomFigure(),
      this._randomFigure(),
    ];
  }

  getNext() {
    return this._queue[0];
  }

  shiftFigure() {
    const figure = this._queue.shift();
    this._queue.push(this._randomFigure());
    return figure;
  }

  draw() {
    this.graphics.background(255);

    let margin = 0;
    for (const createFigure of this._queue) {
      const figure = createFigure(0, 0);
      const g = createGraphics(
        figure.matrix.w * this.cellSize,
        figure.matrix.h * this.cellSize
      );
      drawMatrix(g, this.cellSize, figure.matrix);
      this.graphics.image(g, 10, margin);
      margin += figure.matrix.h * this.cellSize + this.cellSize;
    }
  }

  _randomFigure() {
    return random([
      createLine,
      createCube,
      createTFigure,
      createL1Figure,
      createL2Figure,
      createZ1Figure,
      createZ2Figure,
    ]);
  }
}
