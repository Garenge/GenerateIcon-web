// 显示器图标生成器

/**
 * 生成显示器图标
 * @param {HTMLCanvasElement} canvas - Canvas元素
 * @param {number} size - 图标尺寸
 */
function generateMonitorIcon(canvas, size) {
    const ctx = canvas.getContext('2d');
    const scale = size / 1024;
    
    clearCanvas(canvas);
    setupHighQualityRendering(ctx);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // 显示器屏幕
    const screenWidth = 700 * scale;
    const screenHeight = 500 * scale;
    const screenX = centerX - screenWidth / 2;
    const screenY = centerY - screenHeight / 2 - 50 * scale;
    
    // 绘制阴影
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(screenX + 8 * scale, screenY + 8 * scale, screenWidth, screenHeight);
    
    // 屏幕边框
    ctx.fillStyle = '#2c3e50';
    drawRoundedRect(ctx, screenX, screenY, screenWidth, screenHeight, 20 * scale);
    ctx.fill();
    
    // 屏幕内容区域
    const contentWidth = screenWidth - 40 * scale;
    const contentHeight = screenHeight - 40 * scale;
    const contentX = screenX + 20 * scale;
    const contentY = screenY + 20 * scale;
    
    // 屏幕背景
    ctx.fillStyle = '#1a1a1a';
    drawRoundedRect(ctx, contentX, contentY, contentWidth, contentHeight, 10 * scale);
    ctx.fill();
    
    // 屏幕内容
    ctx.fillStyle = '#00ff00';
    ctx.font = `bold ${40 * scale}px monospace`;
    ctx.textAlign = 'center';
    ctx.fillText('Hello World', centerX, contentY + contentHeight/2 - 20 * scale);
    
    // 显示器支架
    const standWidth = 200 * scale;
    const standHeight = 80 * scale;
    const standX = centerX - standWidth / 2;
    const standY = screenY + screenHeight + 20 * scale;
    
    ctx.fillStyle = '#34495e';
    drawRoundedRect(ctx, standX, standY, standWidth, standHeight, 10 * scale);
    ctx.fill();
    
    // 支架连接线
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 8 * scale;
    ctx.beginPath();
    ctx.moveTo(centerX, screenY + screenHeight);
    ctx.lineTo(centerX, standY);
    ctx.stroke();
}
