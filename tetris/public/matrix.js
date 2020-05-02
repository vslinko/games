class Matrix {
  constructor(w, h, data) {
    this.w = w;
    this.h = h;
    this._data = data || new Array(w * h).fill(0);
  }

  copy() {
    return new Matrix(this.w, this.h, this._data.concat());
  }

  map(fn) {
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        const i = this.getIndex(x, y);
        this._data[i] = fn(this._data[i]);
      }
    }
  }

  add(m) {
    if (this.w !== m.w || this.h !== m.h) {
      throw new Error();
    }

    for (let y = 0; y < m.h; y++) {
      for (let x = 0; x < m.w; x++) {
        this.set(x, y, this.get(x, y) + m.get(x, y));
      }
    }

    return this;
  }

  fill(dx, dy, m, fn) {
    for (let y = 0; y < m.h; y++) {
      for (let x = 0; x < m.w; x++) {
        const prevV = this.get(x + dx, y + dy);
        let nextV = m.get(x, y);
        if (fn) {
          nextV = fn(nextV, prevV);
        }

        this.set(x + dx, y + dy, nextV);
      }
    }

    return this;
  }

  set(x, y, v) {
    this._data[this.getIndex(x, y)] = v;
    return this;
  }

  get(x, y) {
    return this._data[this.getIndex(x, y)];
  }

  getIndex(x, y) {
    return y * this.w + x;
  }

  rotateCounterclockwise() {
    const newW = this.h;
    const newH = this.w;
    const newData = new Array(newW * newH);

    for (let y = 0; y < newH; y++) {
      for (let x = 0; x < newW; x++) {
        const newIndex = y * newW + x;
        const oldIndexX = this.w - y - 1;
        const oldIndexY = x;
        const oldIndex = oldIndexY * this.w + oldIndexX;
        newData[newIndex] = this._data[oldIndex];
      }
    }

    this.w = newW;
    this.h = newH;
    this._data = newData;

    return this;
  }
}
