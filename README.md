# Tee-Shirt-Code

Tee shirt code — includes **p5.riso** (cloned from [antiboredom/p5.riso](https://github.com/antiboredom/p5.riso)).

Documentation: https://antiboredom.github.io/p5.riso/

## GitHub Pages

Examples use **relative** paths to `lib/p5.riso.js`, so they work as a static site.

1. On GitHub: **Settings → Pages**.
2. **Build and deployment**: Source **Deploy from a branch**.
3. Branch **main**, folder **`/` (root)** → Save.
4. After the workflow runs, open:

   **`https://eeconger.github.io/Tee-Shirt-Code/`**

   Start from the **Examples** index:  
   `https://eeconger.github.io/Tee-Shirt-Code/index.html`

**Circle generator** (same Pages site):

- `https://eeconger.github.io/Tee-Shirt-Code/circle_generator/clean_cirlces/index.html`
- `https://eeconger.github.io/Tee-Shirt-Code/circle_generator/defined_circles/index.html`

The repo includes **`.nojekyll`** so GitHub does not run Jekyll (avoids odd behavior with static HTML).

## Notes:

To do:

- add more dithering options
  - add dithering options for graphics, or for entire color object (layers)
- document halftones
- function to select like colored pixels (magic wand)
- translate image color spaces
- document CMYK channel compression function
