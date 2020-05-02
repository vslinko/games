class Game {
  constructor() {
    this.w = 10;
    this.h = 20;
    this.cellSize = 20;
    this._sounds = new Sounds();
    this._state = "welcome";
    this._speedUp = false;
  }

  preload() {
    // this._sounds.preload();
  }

  getNextFigure() {
    return this._queue.getNext();
  }

  shiftFigure() {
    return this._queue.shiftFigure();
  }

  setup() {
    pixelDensity(1);
    createCanvas(this.w * this.cellSize + 200, this.h * this.cellSize);
  }

  startGame() {
    this._state = "game";
    this._queue = new Queue(createGraphics(100, 400), this.cellSize);
    this._score = new Score(createGraphics(100, 400));
    this._levelStartTime = Date.now();

    this._field = new Field(
      this,
      createGraphics(this.w * this.cellSize, this.h * this.cellSize),
      new Matrix(this.w, this.h),
      this.cellSize
    );

    this._sounds.playBgMusic();

    this._scheduleUpdate();
  }

  _scheduleUpdate() {
    this._timeout = setTimeout(() => {
      this._update();
    }, this._getSpeed());
  }

  _update() {
    const result = this._field.update();
    this._processResult(result);

    if (this._state === "game") {
      this._scheduleUpdate();
    }
  }

  _getSpeed() {
    if (this._speedUp) {
      return 40;
    }

    return map(this._score.getLevel(), 1, 10, 1000, 100);
  }

  draw() {
    background(255);

    switch (this._state) {
      case "welcome":
        this._drawWelcome();
        break;

      case "game":
        this._drawPlaygroud();
        break;

      case "gameover":
        this._drawPlaygroud();
        this._drawGameOverPopup();
        break;
    }
  }

  _drawWelcome() {
    text("Welcome to TETRIS!\nPress SPACE to start.", width / 2, height / 2);
  }

  _drawPlaygroud() {
    this._score.draw();
    image(this._score.graphics, 0, 0);
    this._field.draw();
    image(this._field.graphics, 100, 0);
    this._queue.draw();
    image(this._queue.graphics, width - 100, 0);
  }

  _drawGameOverPopup() {
    fill("white");
    stroke("black");
    rectMode(CENTER);
    rect(width / 2, height / 2, 200, 100);

    textAlign(CENTER);
    fill("black");
    strokeWeight(0);
    text("Game Over!\nPress SPACE to restart.", width / 2, height / 2);
    strokeWeight(1);
  }

  downArrowPressed() {
    if (this._state === "game") {
      this._speedUp = true;
      clearTimeout(this._timeout);
      this._update();
    }
  }

  downArrowReleased() {
    this._speedUp = false;
  }

  upArrowPressed() {
    if (this._state === "game") {
      const rotated = this._field.rotateCounterclockwise();
      if (rotated) {
        this._sounds.playSelection();
      }
    }
  }

  rightArrowPressed() {
    if (this._state === "game") {
      clearInterval(this._leftArrow);
      this._field.moveRight();
      this._rightArrow = setInterval(() => {
        this._field.moveRight();
      }, 100);
    }
  }

  rightArrowReleased() {
    clearInterval(this._rightArrow);
  }

  leftArrowPressed() {
    if (this._state === "game") {
      clearInterval(this._rightArrow);
      this._field.moveLeft();
      this._leftArrow = setInterval(() => {
        this._field.moveLeft();
      }, 100);
    }
  }

  leftArrowReleased() {
    clearInterval(this._leftArrow);
  }

  spaceBarPressed() {
    if (this._state === "welcome" || this._state === "gameover") {
      this.startGame();
    }
  }

  _processResult(result) {
    let sound = null;

    if (result.gameOver) {
      this._state = "gameover";
      clearTimeout(this._timeout);
      this._sounds.stopBgMusic();
      this._sounds.playGameOver();
    } else if (result.linesRemoved > 0) {
      this._score.line();
      sound = "line";
    } else if (result.drop) {
      this._score.score();
      sound = "fall";
    }

    this._score.tick();

    const levelChanged = Date.now() - this._levelStartTime >= 1000 * 60;
    if (levelChanged) {
      this._score.level();
      this._levelStartTime = Date.now();
      sound = "level";
    }

    switch (sound) {
      case "line":
        this._sounds.playLine();
        break;
      case "fall":
        this._sounds.playFall();
        break;
      case "level":
        this._sounds.playNextLevel();
        break;
    }
  }
}
