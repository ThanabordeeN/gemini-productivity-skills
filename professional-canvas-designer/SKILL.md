---
name: professional-canvas-designer
description: Expert skill for creating high-quality, professional-grade posters, social media banners, and infographics using node-canvas. It incorporates professional design principles like Visual Hierarchy, Typography, and Grid Systems.
---

# Professional Canvas Designer

Use this skill to programmatically generate professional visual assets with Node.js `node-canvas`.

## Design Guidelines
- Always refer to `references/design-principles.md` for rules on Grid, Typography, and Color Palettes.
- Prioritize "Visual Hierarchy": Headlines should be 3-4x larger than body text.
- Use White Space: Keep a margin of at least 5% of the canvas width on all sides.

## Professional Patterns

### 1. Split-Screen Layout (Modern/Tech)
Divide the canvas into two sections (Text vs Image) with a curved divider for a dynamic look.
- **Utilize:** `scripts/draw_utils.cjs` -> `drawCurvedSplit(ctx, width, height, startX_Percent, color)`

### 2. Multi-line Thai Text
Thai text often requires specific line-height adjustments and font loading.
- **Utilize:** `scripts/draw_utils.cjs` -> `wrapText(ctx, text, x, y, maxWidth, lineHeight)`
- **Font:** Prefer 'Sarabun', 'Leelawadee UI', or 'Inter' for a clean look.

## Example Workflow

1. Define a `CONSTANT` configuration for colors, margins, and font sizes.
2. Initialize `createCanvas(width, height)`.
3. Draw backgrounds and decorative elements (curves, gradients).
4. Place text using hierarchical font sizes.
5. Add logos/icons at the 1/3 or 2/3 focal points or near corners with proper padding.
6. Export using `canvas.createPNGStream()`.

## Advanced Utilities
- **Gradient Backgrounds:**
  ```javascript
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, '#1a1a1a');
  grad.addColorStop(1, '#333333');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);
  ```
- **Image Overlays:**
  ```javascript
  ctx.globalAlpha = 0.5;
  ctx.drawImage(img, 0, 0);
  ctx.globalAlpha = 1.0;
  ```
