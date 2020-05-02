class Score {
  constructor(graphics) {
    this.graphics = graphics;
    this._ticks = 0;
    this._score = 0;
    this._level = 1;
    this._lines = 0;
  }

  getLevel() {
    return this._level;
  }

  level() {
    this._level++;
  }

  score() {
    this._score++;
  }

  tick() {
    this._ticks++;
  }

  line() {
    this._lines++;
  }

  draw() {
    this.graphics.background(255);
    this.graphics.text(
      [
        `Ticks: ${this._ticks}`,
        `Score: ${this._score}`,
        `Level: ${this._level}`,
        `Lines: ${this._lines}`,
      ].join("\n"),
      10,
      10
    );
  }
}
