function rgba(hex, a) {
  const c = color(hex);
  c.setAlpha(a * 255);
  return c;
}

let fillColors;
let strokeColors;

function initColors() {
  fillColors = [
    "white",
    "#ef476f",
    "#ffd166",
    "#06d6a0",
    "#118ab2",
    "#073b4c",
    rgba("#ef476f", 0.5),
    rgba("#ffd166", 0.5),
    rgba("#06d6a0", 0.5),
    rgba("#118ab2", 0.5),
    rgba("#073b4c", 0.5),
  ];
  strokeColors = [
    "#ccc",
    "#BD324E",
    "#BF9247",
    "#049F70",
    "#0C658A",
    "#0C658A",
    "#ccc",
    "#ccc",
    "#ccc",
    "#ccc",
    "#ccc",
  ];
}

function drawMatrix(graphics, cellSize, drawMatrix, options = {}) {
  if (!fillColors) {
    initColors();
  }

  const { grid, debug } = {
    grid: false,
    debug: false,
    ...options,
  };

  for (let x = 0; x < drawMatrix.w; x++) {
    for (let y = 0; y < drawMatrix.h; y++) {
      const cell = drawMatrix.get(x, y);

      if (cell || grid) {
        graphics.stroke(strokeColors[cell]);
        graphics.fill(fillColors[cell]);
        graphics.rect(x * cellSize, y * cellSize, cellSize, cellSize);
      }

      if (debug) {
        graphics.stroke(0);
        graphics.fill(0);
        graphics.textAlign(CENTER, CENTER);
        graphics.text(
          cell,
          x * cellSize + cellSize / 2,
          y * cellSize + cellSize / 2
        );
      }
    }
  }
}
