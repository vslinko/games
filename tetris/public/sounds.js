async function loadSoundAsync(path) {
  return new Promise((resolve, reject) => {
    const file = loadSound(
      path,
      () => {
        resolve(file);
      },
      reject
    );
  });
}

class Sounds {
  constructor() {
    this.currentBg = -1;
    this._bgsScheduled = false;
    this._bgStopped = true;
    this._bgs = null;
  }

  async _preload() {
    this._bgsScheduled = true;

    const [
      bgs,
      fall,
      gameOver,
      line,
      nextLevel,
      selection,
    ] = await Promise.all([
      Promise.all([
        loadSoundAsync("sounds/music-a.ogg"),
        loadSoundAsync("sounds/music-b.ogg"),
        loadSoundAsync("sounds/music-c.ogg"),
      ]),
      loadSoundAsync("sounds/fall.wav"),
      loadSoundAsync("sounds/game-over.mp3"),
      loadSoundAsync("sounds/line.wav"),
      loadSoundAsync("sounds/next-level.mp3"),
      loadSoundAsync("sounds/selection.wav"),
    ]);

    this._bgs = bgs;
    this._gameOver = gameOver;
    this._fall = fall;
    this._line = line;
    this._nextLevel = nextLevel;
    this._selection = selection;

    for (const bg of this._bgs) {
      bg.onended(() => {
        this._bgEnded();
      });
    }

    this.playBgMusic();
  }

  playGameOver() {
    this._gameOver.play();
  }

  playFall() {
    this._fall.play();
  }

  playLine() {
    this._line.play();
  }

  playNextLevel() {
    this._nextLevel.play();
  }

  playSelection() {
    this._selection.play();
  }

  playBgMusic() {
    if (!this._bgs && !this._bgsScheduled) {
      this._preload();
      return;
    }

    if (!this._bgStopped) {
      return;
    }

    this._bgStopped = false;
    this.currentBg = 0;
    this._bgs[this.currentBg].setVolume(1);
    this._bgs[this.currentBg].play();
  }

  stopBgMusic() {
    this._bgStopped = true;
    this._bgs[this.currentBg].stop();
    this.currentBg = -1;
  }

  _bgEnded() {
    if (this._bgStopped) {
      return;
    }

    this.currentBg++;
    if (this.currentBg === this._bgs.length) {
      this.currentBg = 0;
    }
    this._bgs[this.currentBg].play();
  }
}
