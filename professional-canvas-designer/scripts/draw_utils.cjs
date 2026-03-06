/**
 * Advanced Professional Drawing Utilities (2026 Edition)
 * 
 * Design System Constants:
 *   BASE_UNIT = 8px (all spacing should be multiples of 8)
 *   SAFE_MARGIN = BASE_UNIT * 8 = 64px (minimum edge margin)
 *   CARD_PADDING = BASE_UNIT * 5 = 40px (content padding inside cards)
 *   GAP = BASE_UNIT * 3 = 24px (spacing between elements)
 */

const DESIGN = {
    BASE: 8,
    SAFE_MARGIN: 64,
    CARD_PADDING: 40,
    GAP: 24,
    BORDER_RADIUS: { sm: 16, md: 24, lg: 40, xl: 56 },
};

// ─── Primitive Helpers ─────────────────────────────────────────────

/**
 * Draws a rounded rectangle path (does NOT fill or stroke)
 */
function roundRect(ctx, x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
}

// ─── Layout Helpers ────────────────────────────────────────────────

/**
 * Calculate a grid layout within a bounding box.
 * Returns array of {x, y, w, h} for each cell.
 * 
 * @param {number} x - Left edge of grid area
 * @param {number} y - Top edge of grid area
 * @param {number} totalW - Total width available
 * @param {number} totalH - Total height available
 * @param {number} cols - Number of columns
 * @param {number} rows - Number of rows
 * @param {number} [gap=24] - Gap between cells
 * @returns {Array<{x: number, y: number, w: number, h: number}>}
 */
function gridLayout(x, y, totalW, totalH, cols, rows, gap = DESIGN.GAP) {
    const cellW = (totalW - gap * (cols - 1)) / cols;
    const cellH = (totalH - gap * (rows - 1)) / rows;
    const cells = [];
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            cells.push({
                x: x + col * (cellW + gap),
                y: y + row * (cellH + gap),
                w: cellW,
                h: cellH,
            });
        }
    }
    return cells;
}

/**
 * Get usable content area inside a card (respecting CARD_PADDING).
 * Always use this to position text/content inside boxes.
 * 
 * @param {{x: number, y: number, w: number, h: number}} box
 * @param {number} [padding=40]
 * @returns {{x: number, y: number, w: number, h: number}}
 */
function contentArea(box, padding = DESIGN.CARD_PADDING) {
    return {
        x: box.x + padding,
        y: box.y + padding,
        w: box.w - padding * 2,
        h: box.h - padding * 2,
    };
}

/**
 * Calculate safe drawing area (with margins from canvas edges).
 * Always start layout from this, never from (0, 0).
 * 
 * @param {number} canvasW
 * @param {number} canvasH
 * @param {number} [margin=64]
 * @returns {{x: number, y: number, w: number, h: number}}
 */
function safeArea(canvasW, canvasH, margin = DESIGN.SAFE_MARGIN) {
    return {
        x: margin,
        y: margin,
        w: canvasW - margin * 2,
        h: canvasH - margin * 2,
    };
}

// ─── Background Effects ────────────────────────────────────────────

/**
 * Modern Mesh-like Gradient Background with multiple aura layers.
 * Supports 3-5 colors for rich depth.
 */
function drawMeshGradient(ctx, width, height, colors) {
    ctx.save();

    // Base fill
    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, width, height);

    // Aura layers — each at a different position/size for organic feel
    const auras = [
        { cx: 0.15, cy: 0.2, r: 0.7 },
        { cx: 0.85, cy: 0.75, r: 0.8 },
        { cx: 0.5, cy: 0.1, r: 0.5 },
        { cx: 0.3, cy: 0.9, r: 0.6 },
    ];

    for (let i = 1; i < colors.length && i <= auras.length; i++) {
        const a = auras[i - 1];
        const g = ctx.createRadialGradient(
            width * a.cx, height * a.cy, 0,
            width * a.cx, height * a.cy, width * a.r
        );
        g.addColorStop(0, colors[i]);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, width, height);
    }

    ctx.restore();
}

/**
 * Subtle noise/grain overlay for premium print-like feel.
 * Uses sparse random dots for performance (fast even on large canvases).
 * @param {number} [opacity=0.03] - Keep between 0.02-0.05
 */
function drawGrainOverlay(ctx, width, height, opacity = 0.03) {
    ctx.save();
    const count = Math.round(width * height * 0.05); // 5% coverage
    for (let i = 0; i < count; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const brightness = Math.random() > 0.5 ? 255 : 0;
        ctx.fillStyle = `rgba(${brightness},${brightness},${brightness},${opacity})`;
        ctx.fillRect(x, y, 1, 1);
    }
    ctx.restore();
}

// ─── Card / Box Components ─────────────────────────────────────────

/**
 * Bento Grid cell with soft modern shadow.
 */
function drawBentoBox(ctx, x, y, w, h, radius = DESIGN.BORDER_RADIUS.lg, color = '#FFFFFF', shadowOpacity = 0.15) {
    ctx.save();
    ctx.shadowColor = `rgba(0, 0, 0, ${shadowOpacity})`;
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 12;
    ctx.fillStyle = color;
    roundRect(ctx, x, y, w, h, radius);
    ctx.fill();
    ctx.restore();
}

/**
 * Glassmorphism Card — frosted glass with border and inner glow.
 */
function drawGlassBox(ctx, x, y, w, h, radius = DESIGN.BORDER_RADIUS.lg, opacity = 0.12, borderColor = 'rgba(255, 255, 255, 0.35)') {
    ctx.save();

    // Subtle outer shadow for depth
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 8;

    // Glass surface
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    roundRect(ctx, x, y, w, h, radius);
    ctx.fill();

    // Outer border
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Inner glow
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 0.5;
    roundRect(ctx, x + 3, y + 3, w - 6, h - 6, Math.max(radius - 3, 0));
    ctx.stroke();

    ctx.restore();
}

/**
 * Neubrutalism Box — thick borders, hard shadow, high energy.
 */
function drawNeubrutalBox(ctx, x, y, w, h, color, borderWidth = 5, shadowOffset = 8) {
    ctx.save();
    // Hard shadow
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + shadowOffset, y + shadowOffset, w, h);
    // Main box
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
    // Border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(x, y, w, h);
    ctx.restore();
}

/**
 * Accent line / divider — horizontal or vertical.
 */
function drawAccentLine(ctx, x, y, length, color = '#00F5FF', thickness = 3, direction = 'horizontal') {
    ctx.save();
    ctx.fillStyle = color;
    if (direction === 'horizontal') {
        roundRect(ctx, x, y, length, thickness, thickness / 2);
    } else {
        roundRect(ctx, x, y, thickness, length, thickness / 2);
    }
    ctx.fill();
    ctx.restore();
}

/**
 * Decorative dot grid pattern — subtle background texture.
 */
function drawDotPattern(ctx, x, y, w, h, dotColor = 'rgba(255,255,255,0.05)', spacing = 32, dotRadius = 1.5) {
    ctx.save();
    ctx.fillStyle = dotColor;
    for (let dx = x; dx < x + w; dx += spacing) {
        for (let dy = y; dy < y + h; dy += spacing) {
            ctx.beginPath();
            ctx.arc(dx, dy, dotRadius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    ctx.restore();
}

// ─── Clipping & Measurement ────────────────────────────────────────

/**
 * Set a clipping region to a rounded rectangle.
 * All drawing after this call will be clipped to the box.
 * MUST call ctx.restore() after drawing to remove the clip.
 * 
 * Usage:
 *   ctx.save();
 *   clipToBox(ctx, x, y, w, h, radius);
 *   // ... draw text, images, etc. — nothing escapes the box
 *   ctx.restore();
 */
function clipToBox(ctx, x, y, w, h, radius = 0) {
    roundRect(ctx, x, y, w, h, radius);
    ctx.clip();
}

/**
 * Pre-calculate how many lines a text block will take.
 * Use this BEFORE drawing to check if text fits, and adjust font size if needed.
 * 
 * @returns {{ lines: number, height: number, fits: boolean }}
 */
function measureTextBlock(ctx, text, maxWidth, lineHeight, maxHeight = Infinity, letterSpacing = 0) {
    const words = text.split(' ');
    let line = '';
    let lineCount = 1;

    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const testWidth = ctx.measureText(testLine).width + (testLine.length * letterSpacing);
        if (testWidth > maxWidth && n > 0) {
            line = words[n] + ' ';
            lineCount++;
        } else {
            line = testLine;
        }
    }
    const totalHeight = lineCount * lineHeight;
    return { lines: lineCount, height: totalHeight, fits: totalHeight <= maxHeight };
}

// ─── Typography ────────────────────────────────────────────────────

/**
 * Wrap text with proper line height, optional letter spacing, and maxHeight limit.
 * Stops rendering lines that would overflow maxHeight. Truncates with "..." if cut.
 * Returns the Y position after the last rendered line.
 * 
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} text
 * @param {number} x
 * @param {number} y - Baseline Y of the FIRST line
 * @param {number} maxWidth
 * @param {number} lineHeight
 * @param {number} [letterSpacing=0]
 * @param {number} [maxHeight=Infinity] - Stop rendering if text exceeds this height
 * @returns {number} nextY - Y position for the next element below this text
 */
function wrapText(ctx, text, x, y, maxWidth, lineHeight, letterSpacing = 0, maxHeight = Infinity) {
    const words = text.split(' ');
    let line = '';
    let currentY = y;
    const limitY = y + maxHeight;
    const pendingLines = [];

    // First pass: collect all lines
    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const testWidth = ctx.measureText(testLine).width + (testLine.length * letterSpacing);

        if (testWidth > maxWidth && n > 0) {
            pendingLines.push(line.trim());
            line = words[n] + ' ';
        } else {
            line = testLine;
        }
    }
    if (line.trim()) pendingLines.push(line.trim());

    // Second pass: render with height limit
    for (let i = 0; i < pendingLines.length; i++) {
        // Check if the NEXT line would exceed maxHeight
        if (currentY + lineHeight > limitY && i < pendingLines.length - 1) {
            // Truncate with ellipsis on this line
            let truncated = pendingLines[i];
            while (ctx.measureText(truncated + '...').width > maxWidth && truncated.length > 0) {
                truncated = truncated.slice(0, -1);
            }
            drawTextWithSpacing(ctx, truncated + '...', x, currentY, letterSpacing);
            return currentY + lineHeight;
        }
        drawTextWithSpacing(ctx, pendingLines[i], x, currentY, letterSpacing);
        currentY += lineHeight;
    }
    return currentY;
}

/**
 * Draw single-line text with manual letter spacing.
 */
function drawTextWithSpacing(ctx, text, x, y, spacing) {
    if (spacing === 0) {
        ctx.fillText(text, x, y);
        return;
    }
    let currentX = x;
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        ctx.fillText(char, currentX, y);
        currentX += ctx.measureText(char).width + spacing;
    }
}

/**
 * Draw a badge/tag label — small rounded pill with text.
 */
function drawBadge(ctx, text, x, y, bgColor = '#5E5CE6', textColor = '#FFFFFF', fontSize = 18) {
    ctx.save();
    ctx.font = `bold ${fontSize}px "Prompt"`;
    const metrics = ctx.measureText(text);
    const paddingX = 16;
    const paddingY = 8;
    const badgeW = metrics.width + paddingX * 2;
    const badgeH = fontSize + paddingY * 2;

    ctx.fillStyle = bgColor;
    roundRect(ctx, x, y, badgeW, badgeH, badgeH / 2);
    ctx.fill();

    ctx.fillStyle = textColor;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + paddingX, y + badgeH / 2);
    ctx.restore();
}

// ─── Exports ───────────────────────────────────────────────────────

module.exports = {
    DESIGN,
    // Primitives
    roundRect,
    // Layout
    gridLayout,
    contentArea,
    safeArea,
    // Clipping & Measurement
    clipToBox,
    measureTextBlock,
    // Backgrounds
    drawMeshGradient,
    drawGrainOverlay,
    // Cards
    drawBentoBox,
    drawGlassBox,
    drawNeubrutalBox,
    // Decorative
    drawAccentLine,
    drawDotPattern,
    // Typography
    wrapText,
    drawBadge,
};
