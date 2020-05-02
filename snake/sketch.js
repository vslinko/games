let w = 20;
let h = 20;
let cellSize = 30;
let direction = 1;

let snake = []
let food;
let state = 'game';

let directionStack = []

function makeFood() {
  let valid;
  do {
    food = {
      x: floor(random(0, w)),
      y: floor(random(0, h))
    }
    valid = true;
    for (const p of snake) {
      if (p.x === food.x && p.y === food.y) {
        valid = false;
        break;
      }
    }
  } while (!valid)
}

function setup() {
  frameRate(4)

  createCanvas(w * cellSize, h * cellSize);

  snake.push({
    x: floor(w / 2),
    y: floor(h / 2)
  })
  snake.push({
    x: snake[snake.length - 1].x - 1,
    y: snake[snake.length - 1].y
  })
  snake.push({
    x: snake[snake.length - 1].x - 1,
    y: snake[snake.length - 1].y
  })

  makeFood()
}

function turn() {
  if (directionStack.length > 0) {
    const newDirection = directionStack.shift()
    if (newDirection % 2 !== direction % 2) {
      direction = newDirection;
    }
    directionStack = []
  }

  const newSnake = snake.map(p => ({
    ...p
  }))
  const lastP = {
    ...newSnake[newSnake.length - 1]
  };
  let applyNewSnake = true
  for (let i = newSnake.length - 1; i > 0; i--) {
    newSnake[i].x = newSnake[i - 1].x;
    newSnake[i].y = newSnake[i - 1].y;
  }

  switch (direction) {
    case 0:
      newSnake[0].y--;
      break;
    case 1:
      newSnake[0].x++;
      break;
    case 2:
      newSnake[0].y++;
      break;
    case 3:
      newSnake[0].x--;
      break;
  }

  if (newSnake[0].x >= w) {
    newSnake[0].x = 0;
  }
  if (newSnake[0].y < 0) {
    newSnake[0].y = h - 1;
  }
  if (newSnake[0].y >= h) {
    newSnake[0].y = 0;
  }
  if (newSnake[0].x < 0) {
    newSnake[0].x = w - 1;
  }

  if (newSnake[0].x == food.x && newSnake[0].y == food.y) {
    food = null
    newSnake.push(lastP)
  }

  if (newSnake.length === w * h) {
    noLoop()
    state = 'won'
    snake = newSnake
    return
  }

  for (let i = 0; i < newSnake.length - 1; i++) {
    for (let j = i + 1; j < newSnake.length; j++) {
      const a = newSnake[i]
      const b = newSnake[j]
      if (a.x == b.x && a.y == b.y) {
        noLoop()
        state = 'gameOver'
        return
      }
    }
  }

  snake = newSnake

  if (!food) {
    makeFood()
  }
}

function draw() {
  turn()

  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      stroke(220)
      fill(255)
      rect(x * cellSize, y * cellSize, cellSize, cellSize)
    }
  }

  for (let i = 0; i < snake.length; i++) {
    const p = snake[i]
    stroke(220)
    if (i === 0) {
      fill(0, 0, 255)
    } else {
      fill(0, 0, 150)
    }
    rect(p.x * cellSize, p.y * cellSize, cellSize, cellSize)
  }

  if (food) {
    stroke(220)
    fill(255, 0, 0)
    rect(food.x * cellSize, food.y * cellSize, cellSize, cellSize)
  }

  if (state === 'gameOver') {
    textAlign(CENTER, CENTER);
    text('Game Over', width / 2, height / 2)
  }
  if (state === 'won') {
    textAlign(CENTER, CENTER);
    text('Winner!', width / 2, height / 2)
  }
}

function keyPressed() {
  if (state !== 'game') {
    return
  }

  switch (keyCode) {
    case UP_ARROW:
      directionStack.push(0)
      break;
    case RIGHT_ARROW:
      directionStack.push(1)
      break;
    case DOWN_ARROW:
      directionStack.push(2)
      break;
    case LEFT_ARROW:
      directionStack.push(3)
      break;
  }
  loop()
}