class Figure {
  constructor(position, matrix) {
    this.position = position;
    this.matrix = matrix;
  }

  copy() {
    return new Figure(this.position.copy(), this.matrix.copy());
  }

  moveDown() {
    return this.move(createVector(0, 1));
  }

  moveRight() {
    return this.move(createVector(1, 0));
  }

  moveLeft() {
    return this.move(createVector(-1, 0));
  }

  rotateCounterclockwise() {
    this.matrix.rotateCounterclockwise();
    return this;
  }

  move(v) {
    this.position.add(v);
    return this;
  }
}

function createLine(position) {
  return new Figure(
    position,
    new Matrix(4, 4, [0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0])
  );
}

function createCube(position) {
  return new Figure(position, new Matrix(2, 2, [2, 2, 2, 2]));
}

function createTFigure(position) {
  return new Figure(position, new Matrix(3, 2, [0, 3, 0, 3, 3, 3]));
}

function createL1Figure(position) {
  return new Figure(position, new Matrix(3, 2, [4, 0, 0, 4, 4, 4]));
}

function createL2Figure(position) {
  return new Figure(position, new Matrix(3, 2, [0, 0, 4, 4, 4, 4]));
}

function createZ1Figure(position) {
  return new Figure(position, new Matrix(3, 2, [5, 5, 0, 0, 5, 5]));
}

function createZ2Figure(position) {
  return new Figure(position, new Matrix(3, 2, [0, 5, 5, 5, 5, 0]));
}
