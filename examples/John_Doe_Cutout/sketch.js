// Riso color layers (each behaves like its own drawing surface).
let blue, red, yellow;

function setup() {
  // Keep pixel math 1:1 with the canvas size (important for exports).
  pixelDensity(1);
  // Rebuild composition once per second.
  frameRate(1);
  // 8.5x11 inches at 150 dpi.
  createCanvas(8.5 * 150, 11 * 150);

  // Create 3 ink layers.
  yellow = new Riso("yellow");
  red = new Riso("red");
  blue = new Riso("blue");
}

function draw() {
  // Base circle size before randomness.
  let s = 100;
  // White preview background.
  background(255);

  // Draw filled circles only (no outlines).
  blue.noStroke();
  red.noStroke();
  yellow.noStroke();

  // Target grid size across the full page.
  const cols = 5;
  const rows = 7;
  // Keep the original center-to-center spacing from the first version.
  const spacing = 140;
  // Compute grid footprint so any cols/rows combo stays centered on canvas.
  const gridWidth = (cols - 1) * spacing;
  const gridHeight = (rows - 1) * spacing;
  const startX = (width - gridWidth) / 2;
  const startY = (height - gridHeight) / 2;

  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      const x = startX + col * spacing;
      const y = startY + row * spacing;
      // Blue opacity varies by row (top to bottom).
      blue.fill(map(y, 0, height, 20, 220));
      // Slight random offset/size gives organic overlap and texture.
      blue.ellipse(
        x + random(-20, 20),
        y + random(-20, 20),
        s + random(-20, 20),
        s + random(-20, 20),
      );
      // Red opacity varies by column (left to right).
      red.fill(map(x, 0, width, 20, 220));
      red.ellipse(
        x + random(-20, 20),
        y + random(-20, 20),
        s + random(-20, 20),
        s + random(-20, 20),
      );
      // Yellow opacity is inverse across columns.
      yellow.fill(map(x, 0, width, 220, 20));
      yellow.ellipse(
        x + random(-20, 20),
        y + random(-20, 20),
        s + random(-20, 20),
        s + random(-20, 20),
      );
    }
  }

  // Draw text onto an offscreen graphic used as a cutout mask.
  let textGraphic = createGraphics(width, height);
  // Black text defines the cutout area.
  textGraphic.fill(0);
  textGraphic.textStyle(BOLD);
  textGraphic.textFont("Helvetica");
  textGraphic.textAlign(CENTER, CENTER);
  textGraphic.textSize(20);
  // Alternate text each redraw: John -> Doe -> John -> ...
  const label = frameCount % 2 === 1 ? "John" : "Doe";
  // Place the text at the current mouse location.
  textGraphic.text(label, mouseX, mouseY);

  // Subtract text shape from each ink layer.
  red.cutout(textGraphic);
  blue.cutout(textGraphic);
  yellow.cutout(textGraphic);

  // Composite all Riso layers to screen preview.
  drawRiso();
}

function mousePressed() {
  // Export grayscale plates (one file per color), then freeze frame.
  exportRiso();
  noLoop();
}
