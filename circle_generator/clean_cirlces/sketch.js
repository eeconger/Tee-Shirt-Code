let black;
/** White ink layer — lettering only (circles stay on black). */
let whiteInk;

/** Pixels per inch for an 8.5×11 in page (e.g. 72, 150, 300). */
const DPI = 150;

const COLS = 8;
const ROWS = 14;
/** 0–1: fraction of grid cells that get a circle (roughly). */
const FILL_PROBABILITY = 0.55;

/** One letter per circle click, in order (John Doe). */
const WORD = ["J", "o", "h", "n", "D", "o", "e"];

let gridPattern;
/** Next letter index into WORD (0 .. WORD.length). */
let letterIndex = 0;
/** key "col,row" -> letter string */
let lettersOnCells;

function setup() {
  pixelDensity(1);
  createCanvas(8.5 * DPI, 11 * DPI);

  black = new Riso("black");
  whiteInk = new Riso("white");

  regeneratePattern();
  noLoop();
}

function regeneratePattern() {
  gridPattern = [];
  for (let c = 0; c < COLS; c++) {
    gridPattern[c] = [];
    for (let r = 0; r < ROWS; r++) {
      gridPattern[c][r] = random() <= FILL_PROBABILITY;
    }
  }
  letterIndex = 0;
  lettersOnCells = {};
}

function getGridLayout() {
  const margin = (60 * DPI) / 72;
  const innerW = width - 2 * margin;
  const innerH = height - 2 * margin;
  const spacing = min(innerW / (COLS - 1), innerH / (ROWS - 1));
  const gridW = (COLS - 1) * spacing;
  const gridH = (ROWS - 1) * spacing;
  const startX = (width - gridW) / 2;
  const startY = (height - gridH) / 2;
  const d = spacing * 0.55;
  return { margin, spacing, startX, startY, d };
}

function draw() {
  background(255);
  clearRiso();

  const { spacing, startX, startY, d } = getGridLayout();

  black.noStroke();
  black.fill(255);

  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS; r++) {
      if (!gridPattern[c][r]) {
        continue;
      }
      const x = startX + c * spacing;
      const y = startY + r * spacing;
      black.ellipse(x, y, d, d);
    }
  }

  whiteInk.noStroke();
  whiteInk.textAlign(CENTER, CENTER);
  whiteInk.textFont("Helvetica");
  whiteInk.textSize(spacing * 0.38);

  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS; r++) {
      const key = cellKey(c, r);
      const ch = lettersOnCells[key];
      if (!ch) {
        continue;
      }
      const x = startX + c * spacing;
      const y = startY + r * spacing;
      whiteInk.fill(255);
      whiteInk.text(ch, x, y);
    }
  }

  drawRiso();

  // Preview: white ink cannot read correctly under drawRiso()'s MULTIPLY blend,
  // so draw the same letters on the main canvas (still normal BLEND after drawRiso).
  push();
  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  textFont("Helvetica");
  textSize(spacing * 0.38);
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS; r++) {
      const key = cellKey(c, r);
      const ch = lettersOnCells[key];
      if (!ch) {
        continue;
      }
      const x = startX + c * spacing;
      const y = startY + r * spacing;
      text(ch, x, y);
    }
  }
  pop();
}

function cellKey(c, r) {
  return c + "," + r;
}

/** Map screen/client coords to canvas pixel coords when the canvas is CSS-scaled. */
function pointerToCanvas(clientX, clientY) {
  const el = document.querySelector("canvas");
  if (!el || typeof clientX !== "number") {
    return { x: mouseX, y: mouseY };
  }
  const rect = el.getBoundingClientRect();
  const sx = width / rect.width;
  const sy = height / rect.height;
  return {
    x: (clientX - rect.left) * sx,
    y: (clientY - rect.top) * sy,
  };
}

function handleCircleClick(px, py) {
  if (letterIndex >= WORD.length) {
    return;
  }

  const { spacing, startX, startY, d } = getGridLayout();
  const radius = (d / 2) * 1.1;

  let best = null;
  let bestDist = Infinity;

  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS; r++) {
      if (!gridPattern[c][r]) {
        continue;
      }
      const x = startX + c * spacing;
      const y = startY + r * spacing;
      const dMouse = dist(px, py, x, y);
      if (dMouse <= radius && dMouse < bestDist) {
        bestDist = dMouse;
        best = { c, r, x, y };
      }
    }
  }

  if (!best) {
    return;
  }

  const key = cellKey(best.c, best.r);
  if (Object.prototype.hasOwnProperty.call(lettersOnCells, key)) {
    return;
  }

  lettersOnCells[key] = WORD[letterIndex];
  letterIndex += 1;
  redraw();
}

function mousePressed(event) {
  if (event && typeof event.clientX === "number") {
    const p = pointerToCanvas(event.clientX, event.clientY);
    handleCircleClick(p.x, p.y);
  } else {
    handleCircleClick(mouseX, mouseY);
  }
}

function touchStarted(event) {
  if (event && event.touches && event.touches.length > 0) {
    const t = event.touches[0];
    const p = pointerToCanvas(t.clientX, t.clientY);
    handleCircleClick(p.x, p.y);
  }
  return false;
}

function keyPressed() {
  if (key === "e" || key === "E") {
    exportRiso();
  }
  if (key === "r" || key === "R") {
    regeneratePattern();
    redraw();
  }
}
