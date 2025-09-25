// 定位图标生成器

/**
 * 生成定位图标
 * @param {HTMLCanvasElement} canvas - Canvas元素
 * @param {number} size - 图标尺寸
 */
function generateLocationIcon(canvas, size) {
    const ctx = canvas.getContext('2d');
    const scale = size / 1024;
    
    clearCanvas(canvas);
    setupHighQualityRendering(ctx);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // 背景圆形
    const bgRadius = 450 * scale;
    const bgGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, bgRadius);
    bgGradient.addColorStop(0, '#4A90E2');
    bgGradient.addColorStop(0.7, '#357ABD');
    bgGradient.addColorStop(1, '#2E5B8A');
    
    ctx.fillStyle = bgGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, bgRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // 外圈装饰环
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 8 * scale;
    ctx.beginPath();
    ctx.arc(centerX, centerY, bgRadius - 20 * scale, 0, Math.PI * 2);
    ctx.stroke();
    
    // 定位针主体
    const pinHeight = 200 * scale;
    const pinWidth = 60 * scale;
    const pinX = centerX - pinWidth / 2;
    const pinY = centerY - pinHeight / 2 - 50 * scale;
    
    // 定位针阴影
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(pinX + 4 * scale, pinY + 4 * scale, pinWidth, pinHeight);
    
    // 定位针背景
    const pinGradient = ctx.createLinearGradient(pinX, pinY, pinX, pinY + pinHeight);
    pinGradient.addColorStop(0, '#FF6B6B');
    pinGradient.addColorStop(0.5, '#E74C3C');
    pinGradient.addColorStop(1, '#C0392B');
    ctx.fillStyle = pinGradient;
    ctx.fillRect(pinX, pinY, pinWidth, pinHeight);
    
    // 定位针圆角
    drawRoundedRect(ctx, pinX, pinY, pinWidth, pinHeight, 30 * scale);
    ctx.fill();
    
    // 定位针边框
    ctx.strokeStyle = '#A93226';
    ctx.lineWidth = 3 * scale;
    ctx.stroke();
    
    // 定位针顶部圆点
    const dotRadius = 25 * scale;
    ctx.fillStyle = '#FF6B6B';
    ctx.beginPath();
    ctx.arc(centerX, pinY - dotRadius, dotRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // 圆点边框
    ctx.strokeStyle = '#A93226';
    ctx.lineWidth = 3 * scale;
    ctx.stroke();
    
    // 定位针内部装饰
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(pinX + 8 * scale, pinY + 8 * scale, pinWidth - 16 * scale, 15 * scale);
    
    // 定位针文字 "LOC"
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${24 * scale}px -apple-system, BlinkMacSystemFont, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('LOC', centerX, pinY + pinHeight / 2);
    
    // 信号波纹效果
    const waveCount = 3;
    for (let i = 0; i < waveCount; i++) {
        const waveRadius = (bgRadius + 50 * scale) + (i * 80 * scale);
        const waveAlpha = 0.3 - (i * 0.1);
        
        ctx.strokeStyle = `rgba(255, 255, 255, ${waveAlpha})`;
        ctx.lineWidth = 6 * scale;
        ctx.setLineDash([10 * scale, 10 * scale]);
        ctx.beginPath();
        ctx.arc(centerX, centerY, waveRadius, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    // 重置线条样式
    ctx.setLineDash([]);
    
    // 坐标网格背景
    const gridSize = 100 * scale;
    const gridStartX = centerX - 150 * scale;
    const gridStartY = centerY + 100 * scale;
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2 * scale;
    
    // 绘制网格
    for (let i = 0; i < 4; i++) {
        const x = gridStartX + i * gridSize;
        const y = gridStartY + i * gridSize;
        
        // 垂直线
        ctx.beginPath();
        ctx.moveTo(x, gridStartY);
        ctx.lineTo(x, gridStartY + 3 * gridSize);
        ctx.stroke();
        
        // 水平线
        ctx.beginPath();
        ctx.moveTo(gridStartX, y);
        ctx.lineTo(gridStartX + 3 * gridSize, y);
        ctx.stroke();
    }
    
    // 网格上的小点
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const x = gridStartX + i * gridSize;
            const y = gridStartY + j * gridSize;
            ctx.beginPath();
            ctx.arc(x, y, 3 * scale, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // 当前位置标记
    const currentX = gridStartX + gridSize;
    const currentY = gridStartY + gridSize;
    
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(currentX, currentY, 8 * scale, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#FFA500';
    ctx.lineWidth = 2 * scale;
    ctx.stroke();
    
    // 当前位置标记的十字
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3 * scale;
    ctx.beginPath();
    ctx.moveTo(currentX - 12 * scale, currentY);
    ctx.lineTo(currentX + 12 * scale, currentY);
    ctx.moveTo(currentX, currentY - 12 * scale);
    ctx.lineTo(currentX, currentY + 12 * scale);
    ctx.stroke();
}
