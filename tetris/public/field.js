class Field {
  constructor(game, graphics, matrix, cellSize) {
    this._game = game;
    this.graphics = graphics;
    this.matrix = matrix;
    this.cellSize = cellSize;
    
    this.currentFigure = this._createRandomFigure();
    this._game.shiftFigure();
  }

  _getShadow() {
    let f = this.currentFigure;
    while (true) {
      const newF = f.copy().moveDown();
      if (this._intersection(newF)) {
        break;
      }
      f = newF;
    }

    return f;
  }

  rotateCounterclockwise() {
    return this._changeFigure((f) => f.copy().rotateCounterclockwise());
  }

  moveRight() {
    return this._changeFigure((f) => f.copy().moveRight());
  }

  moveLeft() {
    return this._changeFigure((f) => f.copy().moveLeft());
  }

  update() {
    const result = {
      gameOver: false,
      drop: false,
      linesRemoved: 0,
    };

    const moved = this._changeFigure((f) => f.copy().moveDown());

    if (!moved) {
      this._replaceFigure(result);
    }

    return result;
  }

  draw() {
    const { graphics, cellSize, currentFigure, matrix } = this;

    const fieldMatrix = matrix.copy();

    if (currentFigure) {
      const shadow = this._getShadow();
      fieldMatrix.fill(
        shadow.position.x,
        shadow.position.y,
        shadow.matrix,
        (next, prev) => (next > 0 ? next + 5 : prev)
      );

      fieldMatrix.fill(
        currentFigure.position.x,
        currentFigure.position.y,
        currentFigure.matrix,
        (next, prev) => (next > 0 ? next : prev)
      );
    }

    this.graphics.background(255);
    drawMatrix(graphics, cellSize, fieldMatrix, {
      grid: true,
      debug: false,
    });
  }

  _createRandomFigure() {
    const x = floor(this.matrix.w / 2) - 2;
    const y = 0;
    const createFigure = this._game.getNextFigure();
    return createFigure(createVector(x, y));
  }

  _changeFigure(fn) {
    const newFigure = fn(this.currentFigure);

    if (this._intersection(newFigure)) {
      return false;
    }

    this.currentFigure = newFigure;

    return true;
  }

  _replaceFigure(result) {
    const changes = new Matrix(this.matrix.w, this.matrix.h);
    changes.fill(
      this.currentFigure.position.x,
      this.currentFigure.position.y,
      this.currentFigure.matrix
    );
    this.matrix.add(changes);

    this._removeFullLines(result);

    let newFigure = this._createRandomFigure();
    for (let i = 0; i < random([0, 1, 2, 3]); i++) {
      newFigure.rotateCounterclockwise();
    }

    const variants = [
      (f) => f,
      (f) => f.copy().moveLeft(),
      (f) => f.copy().moveRight(),
    ];

    let variantFound = false;
    outer: for (let i = 0; i < 3; i++) {
      for (const variant of variants) {
        const newFigureVariant = variant(newFigure);

        if (!this._intersection(newFigureVariant)) {
          newFigure = newFigureVariant;
          variantFound = true;
          break outer;
        }
      }
      newFigure.rotateCounterclockwise();
    }

    if (!variantFound) {
      this.currentFigure = null;
      result.gameOver = true;
      return;
    }

    this._game.shiftFigure();

    result.drop = true;

    this.currentFigure = newFigure;
  }

  _removeFullLines(result) {
    const oldMatrix = this.matrix;
    const newMatrix = new Matrix(oldMatrix.w, oldMatrix.h);

    for (let oldY = oldMatrix.h - 1, newY = oldY; oldY >= 0; oldY--) {
      let full = true;
      for (let x = 0; x < newMatrix.w; x++) {
        const v = oldMatrix.get(x, oldY);
        if (v === 0) {
          full = false;
        }
        newMatrix.set(x, newY, v);
      }
      if (full) {
        result.linesRemoved++;
      } else {
        newY--;
      }
    }

    this.matrix = newMatrix;
  }

  _intersection(figure) {
    const dx = figure.position.x;
    const dy = figure.position.y;
    const m = figure.matrix;

    for (let y = 0; y < m.h; y++) {
      for (let x = 0; x < m.w; x++) {
        if (m.get(x, y) === 0) {
          continue;
        }

        const xx = x + dx;
        const yy = y + dy;

        if (xx >= this.matrix.w || yy >= this.matrix.h || xx < 0 || yy < 0) {
          return true;
        }

        if (this.matrix.get(xx, yy) > 0) {
          return true;
        }
      }
    }

    return false;
  }
}
