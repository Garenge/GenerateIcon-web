// 计算器图标生成器

/**
 * 生成计算器图标
 * @param {HTMLCanvasElement} canvas - Canvas元素
 * @param {number} size - 图标尺寸
 */
function generateCalculatorIcon(canvas, size) {
    const ctx = canvas.getContext('2d');
    const scale = size / 1024;
    
    clearCanvas(canvas);
    setupHighQualityRendering(ctx);
    
    const bodyWidth = 800 * scale;
    const bodyHeight = 1000 * scale;
    const x = (canvas.width - bodyWidth) / 2;
    const y = (canvas.height - bodyHeight) / 2;
    
    // 绘制阴影
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(x + 8 * scale, y + 8 * scale, bodyWidth, bodyHeight);
    
    // 计算器主体背景
    const gradient = ctx.createLinearGradient(x, y, x, y + bodyHeight);
    gradient.addColorStop(0, '#f8f9fa');
    gradient.addColorStop(1, '#e9ecef');
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, bodyWidth, bodyHeight);
    
    // 边框
    ctx.strokeStyle = '#dee2e6';
    ctx.lineWidth = 2 * scale;
    ctx.strokeRect(x, y, bodyWidth, bodyHeight);
    
    // 屏幕区域
    const screenWidth = bodyWidth - 40 * scale;
    const screenHeight = 200 * scale;
    const screenX = x + 20 * scale;
    const screenY = y + 30 * scale;
    
    // 屏幕背景
    ctx.fillStyle = '#000';
    ctx.fillRect(screenX, screenY, screenWidth, screenHeight);
    
    // 屏幕边框
    ctx.strokeStyle = '#495057';
    ctx.lineWidth = 3 * scale;
    ctx.strokeRect(screenX, screenY, screenWidth, screenHeight);
    
    // 屏幕内容
    ctx.fillStyle = '#00ff00';
    ctx.font = `bold ${60 * scale}px monospace`;
    ctx.textAlign = 'right';
    ctx.fillText('123.45', screenX + screenWidth - 20 * scale, screenY + screenHeight - 20 * scale);
    
    // 按钮网格
    const buttonSize = 120 * scale;
    const buttonSpacing = 20 * scale;
    const startX = x + 40 * scale;
    const startY = y + 280 * scale;
    
    const buttons = [
        ['C', '±', '%', '÷'],
        ['7', '8', '9', '×'],
        ['4', '5', '6', '-'],
        ['1', '2', '3', '+'],
        ['0', '0', '.', '=']
    ];
    
    buttons.forEach((row, rowIndex) => {
        row.forEach((button, colIndex) => {
            let btnX = startX + colIndex * (buttonSize + buttonSpacing);
            let btnY = startY + rowIndex * (buttonSize + buttonSpacing);
            let btnWidth = buttonSize;
            let btnHeight = buttonSize;
            
            if (button === '0' && colIndex === 0) {
                btnWidth = buttonSize * 2 + buttonSpacing;
            }
            
            // 绘制按钮阴影
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(btnX + 2 * scale, btnY + 2 * scale, btnWidth, btnHeight);
            
            // 按钮背景
            let buttonGradient;
            if (['÷', '×', '-', '+', '='].includes(button)) {
                // 运算符按钮 - 橙色
                buttonGradient = ctx.createLinearGradient(btnX, btnY, btnX, btnY + btnHeight);
                buttonGradient.addColorStop(0, '#ff9500');
                buttonGradient.addColorStop(1, '#ff7b00');
            } else if (['C', '±', '%'].includes(button)) {
                // 功能按钮 - 灰色
                buttonGradient = ctx.createLinearGradient(btnX, btnY, btnX, btnY + btnHeight);
                buttonGradient.addColorStop(0, '#a6a6a6');
                buttonGradient.addColorStop(1, '#8e8e8e');
            } else {
                // 数字按钮 - 白色
                buttonGradient = ctx.createLinearGradient(btnX, btnY, btnX, btnY + btnHeight);
                buttonGradient.addColorStop(0, '#ffffff');
                buttonGradient.addColorStop(1, '#f0f0f0');
            }
            
            ctx.fillStyle = buttonGradient;
            ctx.fillRect(btnX, btnY, btnWidth, btnHeight);
            
            // 按钮边框
            ctx.strokeStyle = '#d1d5db';
            ctx.lineWidth = 1 * scale;
            ctx.strokeRect(btnX, btnY, btnWidth, btnHeight);
            
            // 按钮文字
            ctx.fillStyle = button === '0' && colIndex === 0 ? '#000' : 
                ['÷', '×', '-', '+', '='].includes(button) ? '#fff' :
                    ['C', '±', '%'].includes(button) ? '#fff' : '#000';
            ctx.font = `bold ${40 * scale}px -apple-system, BlinkMacSystemFont, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(button, btnX + btnWidth/2, btnY + btnHeight/2);
        });
    });
}
