# Professional Design Principles for Canvas

## 1. Grid & Alignment
- **Margin System:** Always define a `SAFE_MARGIN` (e.g., 5% of width).
- **Alignment:** Use a consistent anchor (Left, Center, or Right). If Left-aligned, ensure all text blocks start at the same `x` coordinate.
- **Rule of Thirds:** Place key focal points (like a face or a CTA) at 1/3 or 2/3 of the canvas width/height.

## 2. Typography Hierarchy
- **Level 1 (Headline):** Bold, largest size, high contrast color.
- **Level 2 (Sub-headline):** Medium size, medium weight.
- **Level 3 (Body):** Regular weight, easy to read size (e.g., 24-36px for 1000px width).
- **Line Height:** Set `lineHeight` to 1.2x - 1.5x of font size for readability.

## 3. Color Palette (Pro Examples)
- **Corporate:** Navy (#003366), White (#FFFFFF), Accent Orange (#FF6600).
- **Modern Tech:** Dark Grey (#1A1A1A), Electric Blue (#007BFF), Soft Grey (#F8F9FA).
- **Minimalist:** Off-white (#FAF9F6), Charcoal (#333333), Gold Accent (#D4AF37).

## 4. Visual Elements
- **S-Curve / Bezier:** Use `bezierCurveTo` for organic separation between image and text.
- **Gradients:** Use `createLinearGradient` to add depth to backgrounds or text.
- **Overlay:** Use a semi-transparent black overlay (`rgba(0,0,0,0.5)`) if text is placed directly over a busy image.
