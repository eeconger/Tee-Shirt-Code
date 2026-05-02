let black;

/** Pixels per inch for an 8.5×11 in page (e.g. 72, 150, 300). */
const DPI = 150;

const COLS = 8;
const ROWS = 14;

function setup() {
  pixelDensity(1);
  createCanvas(8.5 * DPI, 11 * DPI);

  black = new Riso("black");
  noLoop();
}

function draw() {
  background(255);
  clearRiso();

  const margin = (60 * DPI) / 72;
  const innerW = width - 2 * margin;
  const innerH = height - 2 * margin;
  // One step size so neighbors are equally spaced horizontally and vertically.
  const spacing = min(innerW / (COLS - 1), innerH / (ROWS - 1));
  const gridW = (COLS - 1) * spacing;
  const gridH = (ROWS - 1) * spacing;
  const startX = (width - gridW) / 2;
  const startY = (height - gridH) / 2;
  const d = spacing * 0.55;

  black.noStroke();
  black.fill(255);

  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS; r++) {
      const x = startX + c * spacing;
      const y = startY + r * spacing;
      black.ellipse(x, y, d, d);
    }
  }

  drawRiso();
}

function keyPressed() {
  if (key === "e" || key === "E") {
    exportRiso();
  }
}
