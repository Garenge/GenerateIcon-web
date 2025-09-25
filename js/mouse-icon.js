// 鼠标图标生成器

/**
 * 生成鼠标图标
 * @param {HTMLCanvasElement} canvas - Canvas元素
 * @param {number} size - 图标尺寸
 */
function generateMouseIcon(canvas, size) {
    const ctx = canvas.getContext('2d');
    const scale = size / 1024;
    
    clearCanvas(canvas);
    setupHighQualityRendering(ctx);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // 鼠标主体
    const mouseWidth = 600 * scale;
    const mouseHeight = 400 * scale;
    const mouseX = centerX - mouseWidth / 2;
    const mouseY = centerY - mouseHeight / 2;
    
    // 绘制阴影
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(mouseX + 8 * scale, mouseY + 8 * scale, mouseWidth, mouseHeight);
    
    // 鼠标主体背景
    const gradient = ctx.createLinearGradient(mouseX, mouseY, mouseX, mouseY + mouseHeight);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(0.3, '#f8f9fa');
    gradient.addColorStop(1, '#e9ecef');
    ctx.fillStyle = gradient;
    
    // 绘制圆角矩形
    drawRoundedRect(ctx, mouseX, mouseY, mouseWidth, mouseHeight, 30 * scale);
    ctx.fill();
    
    // 鼠标边框
    ctx.strokeStyle = '#dee2e6';
    ctx.lineWidth = 3 * scale;
    ctx.stroke();
    
    // 鼠标滚轮
    const wheelWidth = 40 * scale;
    const wheelHeight = 80 * scale;
    const wheelX = centerX - wheelWidth / 2;
    const wheelY = mouseY + 60 * scale;
    
    ctx.fillStyle = '#6c757d';
    drawRoundedRect(ctx, wheelX, wheelY, wheelWidth, wheelHeight, 20 * scale);
    ctx.fill();
    
    // 滚轮纹理
    ctx.strokeStyle = '#495057';
    ctx.lineWidth = 2 * scale;
    for (let i = 0; i < 3; i++) {
        const y = wheelY + 20 * scale + i * 20 * scale;
        ctx.beginPath();
        ctx.moveTo(wheelX + 10 * scale, y);
        ctx.lineTo(wheelX + wheelWidth - 10 * scale, y);
        ctx.stroke();
    }
    
    // 鼠标按键分割线
    ctx.strokeStyle = '#adb5bd';
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    ctx.moveTo(mouseX + 20 * scale, mouseY + 200 * scale);
    ctx.lineTo(mouseX + mouseWidth - 20 * scale, mouseY + 200 * scale);
    ctx.stroke();
    
    // 鼠标线缆
    const cableLength = 300 * scale;
    const cableX = mouseX + mouseWidth - 20 * scale;
    const cableY = mouseY + mouseHeight - 20 * scale;
    
    ctx.strokeStyle = '#6c757d';
    ctx.lineWidth = 8 * scale;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cableX, cableY);
    ctx.quadraticCurveTo(cableX + 100 * scale, cableY - 50 * scale, cableX + cableLength, cableY - 100 * scale);
    ctx.stroke();
    
    // 线缆插头
    const plugSize = 20 * scale;
    ctx.fillStyle = '#495057';
    ctx.fillRect(cableX + cableLength - plugSize, cableY - 100 * scale - plugSize/2, plugSize, plugSize);
}
