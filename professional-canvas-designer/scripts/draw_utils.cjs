/**
 * Reusable Professional Drawing Utilities for node-canvas
 */

function drawCurvedSplit(ctx, width, height, startX_Percent, color) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(width * startX_Percent, 0);
    ctx.bezierCurveTo(width * (startX_Percent - 0.1), height * 0.4, width * (startX_Percent + 0.1), height * 0.6, width * startX_Percent, height);
    ctx.lineTo(width, height);
    ctx.lineTo(width, 0);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, y);
    return y + lineHeight; // Return next Y position
}

module.exports = { drawCurvedSplit, wrapText };
