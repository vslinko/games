const game = new Game();

function preload() {
  game.preload();
}

function setup() {
  game.setup();
}

function draw() {
  game.draw();
}

function keyPressed() {
  if (key === " ") {
    game.spaceBarPressed();
  }
  if (keyCode === DOWN_ARROW) {
    game.downArrowPressed();
  }
  if (keyCode === UP_ARROW) {
    game.upArrowPressed();
  }
  if (keyCode === RIGHT_ARROW) {
    game.rightArrowPressed();
  }
  if (keyCode === LEFT_ARROW) {
    game.leftArrowPressed();
  }
}

function keyReleased() {
  if (keyCode === DOWN_ARROW) {
    game.downArrowReleased();
  }
  if (keyCode === RIGHT_ARROW) {
    game.rightArrowReleased();
  }
  if (keyCode === LEFT_ARROW) {
    game.leftArrowReleased();
  }
}
