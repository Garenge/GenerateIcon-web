// 键盘图标生成器

/**
 * 生成键盘图标
 * @param {HTMLCanvasElement} canvas - Canvas元素
 * @param {number} size - 图标尺寸
 */
function generateKeyboardIcon(canvas, size) {
    const ctx = canvas.getContext('2d');
    const scale = size / 1024;
    
    clearCanvas(canvas);
    setupHighQualityRendering(ctx);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // 键盘主体
    const keyboardWidth = 800 * scale;
    const keyboardHeight = 300 * scale;
    const keyboardX = centerX - keyboardWidth / 2;
    const keyboardY = centerY - keyboardHeight / 2;
    
    // 绘制阴影
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(keyboardX + 6 * scale, keyboardY + 6 * scale, keyboardWidth, keyboardHeight);
    
    // 键盘背景
    const gradient = ctx.createLinearGradient(keyboardX, keyboardY, keyboardX, keyboardY + keyboardHeight);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(1, '#f8f9fa');
    ctx.fillStyle = gradient;
    drawRoundedRect(ctx, keyboardX, keyboardY, keyboardWidth, keyboardHeight, 15 * scale);
    ctx.fill();
    
    // 键盘边框
    ctx.strokeStyle = '#dee2e6';
    ctx.lineWidth = 2 * scale;
    ctx.stroke();
    
    // 按键
    const keyWidth = 50 * scale;
    const keyHeight = 50 * scale;
    const keySpacing = 8 * scale;
    const startX = keyboardX + 30 * scale;
    const startY = keyboardY + 30 * scale;
    
    const keys = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
    ];
    
    keys.forEach((row, rowIndex) => {
        const rowY = startY + rowIndex * (keyHeight + keySpacing);
        const rowStartX = startX + (rowIndex * 25 * scale); // 错位排列
        
        row.forEach((key, colIndex) => {
            const keyX = rowStartX + colIndex * (keyWidth + keySpacing);
            const keyY = rowY;
            
            // 按键阴影
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            drawRoundedRect(ctx, keyX + 2 * scale, keyY + 2 * scale, keyWidth, keyHeight, 5 * scale);
            ctx.fill();
            
            // 按键背景
            ctx.fillStyle = '#ffffff';
            drawRoundedRect(ctx, keyX, keyY, keyWidth, keyHeight, 5 * scale);
            ctx.fill();
            
            // 按键边框
            ctx.strokeStyle = '#d1d5db';
            ctx.lineWidth = 1 * scale;
            ctx.stroke();
            
            // 按键文字
            ctx.fillStyle = '#333';
            ctx.font = `bold ${16 * scale}px -apple-system, BlinkMacSystemFont, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(key, keyX + keyWidth/2, keyY + keyHeight/2);
        });
    });
}
