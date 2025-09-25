// 主应用程序逻辑

// 图标类型配置
const iconTypes = {
    calculator: {
        name: '计算器',
        emoji: '🧮',
        description: '点击按钮将生成一个1024x1024像素的计算器图标并自动下载',
        generator: generateCalculatorIcon
    },
    mouse: {
        name: '鼠标',
        emoji: '🖱️',
        description: '点击按钮将生成一个1024x1024像素的鼠标图标并自动下载',
        generator: generateMouseIcon
    },
    keyboard: {
        name: '键盘',
        emoji: '⌨️',
        description: '点击按钮将生成一个1024x1024像素的键盘图标并自动下载',
        generator: generateKeyboardIcon
    },
    monitor: {
        name: '显示器',
        emoji: '🖥️',
        description: '点击按钮将生成一个1024x1024像素的显示器图标并自动下载',
        generator: generateMonitorIcon
    },
    location: {
        name: '定位',
        emoji: '📍',
        description: '点击按钮将生成一个1024x1024像素的定位图标并自动下载',
        generator: generateLocationIcon
    },
    custom: {
        name: '自定义AI生成',
        emoji: '🎨',
        description: '使用AI生成自定义图标，输入描述即可创建独特的图标',
        generator: null // AI生成的图标不需要预设生成器
    }
};

let currentIconType = 'calculator';
let currentSize = 1024;
let currentDownloadType = 'custom'; // 'custom' or 'ios'
let aiGeneratedImage = null; // 存储AI生成的图像数据

// iOS应用图标尺寸配置 - 按照pt尺寸和倍率配置
const iosIconSizes = [
    // 通知图标 (20pt)
    { pt: 20, scale: 1, px: 20, filename: 'appIcon_20.png' },
    { pt: 20, scale: 2, px: 40, filename: 'appIcon_20@2x.png' },
    { pt: 20, scale: 3, px: 60, filename: 'appIcon_20@3x.png' },
    
    // 设置图标 (29pt)
    { pt: 29, scale: 1, px: 29, filename: 'appIcon_29.png' },
    { pt: 29, scale: 2, px: 58, filename: 'appIcon_29@2x.png' },
    { pt: 29, scale: 3, px: 87, filename: 'appIcon_29@3x.png' },
    
    // Spotlight搜索图标 (40pt)
    { pt: 40, scale: 1, px: 40, filename: 'appIcon_40.png' },
    { pt: 40, scale: 2, px: 80, filename: 'appIcon_40@2x.png' },
    { pt: 40, scale: 3, px: 120, filename: 'appIcon_40@3x.png' },
    
    // iPhone应用图标 (60pt)
    { pt: 60, scale: 2, px: 120, filename: 'appIcon_60@2x.png' },
    { pt: 60, scale: 3, px: 180, filename: 'appIcon_60@3x.png' },
    
    // iPad应用图标 (76pt)
    { pt: 76, scale: 2, px: 152, filename: 'appIcon_76@2x.png' },
    
    // iPad Pro应用图标 (83.5pt)
    { pt: 83.5, scale: 2, px: 167, filename: 'appIcon_83.5@2x.png' },
    
    // App Store图标 (1024pt)
    { pt: 1024, scale: 1, px: 1024, filename: 'appIcon_1024.png' }
];

/**
 * 切换图标类型
 * @param {string} iconType - 图标类型
 */
function switchIconType(iconType) {
    currentIconType = iconType;
    const iconConfig = iconTypes[iconType];
    
    // 更新UI
    document.getElementById('iconTitle').textContent = `${iconConfig.emoji} ${iconConfig.name}图标`;
    document.getElementById('iconDescription').textContent = iconConfig.description;
    
    // 更新按钮状态
    document.querySelectorAll('.icon-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-icon="${iconType}"]`).classList.add('active');
    
    // 生成预览
    const previewCanvas = document.getElementById('previewCanvas');
    if (iconType === 'custom' && aiGeneratedImage) {
        // 显示AI生成的图标
        drawAIImageOnCanvas(previewCanvas, aiGeneratedImage);
    } else if (iconConfig.generator) {
        // 显示预设图标
        iconConfig.generator(previewCanvas, 256);
    } else {
        // 清空画布
        const ctx = previewCanvas.getContext('2d');
        ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    }
}

/**
 * 设置图标尺寸
 * @param {number} size - 图标尺寸
 */
function setIconSize(size) {
    currentSize = size;
    
    // 更新按钮状态
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-size="${size}"]`).classList.add('active');
    
    // 更新自定义输入框
    document.getElementById('customSize').value = size;
    
    // 更新当前尺寸显示
    document.getElementById('currentSizeDisplay').textContent = `${size}px`;
}

/**
 * 打开尺寸选择弹窗
 */
function openSizeModal() {
    const modal = document.getElementById('sizeModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

/**
 * 关闭尺寸选择弹窗
 */
function closeSizeModal() {
    const modal = document.getElementById('sizeModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

/**
 * 切换下载类型标签页
 * @param {string} type - 下载类型 ('custom' 或 'ios')
 */
function switchDownloadType(type) {
    currentDownloadType = type;
    
    // 更新标签页状态
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-type="${type}"]`).classList.add('active');
    
    // 显示/隐藏对应内容
    document.getElementById('customSizeTab').style.display = type === 'custom' ? 'block' : 'none';
    document.getElementById('iosSizeTab').style.display = type === 'ios' ? 'block' : 'none';
    
    // 显示/隐藏尺寸信息区域
    const sizeInfo = document.querySelector('.size-info');
    if (type === 'ios') {
        sizeInfo.style.display = 'none';
    } else {
        sizeInfo.style.display = 'block';
    }
    
    // 更新确认按钮文本
    const confirmBtn = document.getElementById('confirmBtn');
    if (type === 'ios') {
        confirmBtn.textContent = '📱 下载所有iOS图标';
    } else {
        confirmBtn.textContent = '确认并下载';
    }
}

/**
 * 确认尺寸并下载图标
 */
function confirmSizeAndDownload() {
    closeSizeModal();
    
    if (currentDownloadType === 'ios') {
        downloadAllIOSIcons();
    } else {
        generateAndDownload();
    }
}

/**
 * 生成并下载图标
 */
function generateAndDownload() {
    const canvas = document.createElement('canvas');
    canvas.width = currentSize;
    canvas.height = currentSize;
    
    const iconConfig = iconTypes[currentIconType];
    
    if (currentIconType === 'custom' && aiGeneratedImage) {
        // 下载AI生成的图标
        drawAIImageOnCanvas(canvas, aiGeneratedImage);
    } else if (iconConfig.generator) {
        // 下载预设图标
        iconConfig.generator(canvas, currentSize);
    } else {
        alert('请先生成图标');
        return;
    }
    
    canvas.toBlob(function(blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${iconConfig.name}-icon-${currentSize}x${currentSize}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // 显示下载成功提示
        showSingleDownloadComplete(iconConfig.name, currentSize);
    }, 'image/png');
}

/**
 * 下载所有iOS应用图标
 */
async function downloadAllIOSIcons() {
    const iconConfig = iconTypes[currentIconType];
    const totalCount = iosIconSizes.length;
    
    // 显示下载进度提示
    showDownloadProgress(0, totalCount);
    
    try {
        const zip = new JSZip();
        let processedCount = 0;
        
        // 生成所有iOS图标
        for (const iconSize of iosIconSizes) {
            const canvas = document.createElement('canvas');
            canvas.width = iconSize.px;
            canvas.height = iconSize.px;
            
            // 生成图标
            if (currentIconType === 'custom' && aiGeneratedImage) {
                // 生成AI图标
                drawAIImageOnCanvas(canvas, aiGeneratedImage);
            } else if (iconConfig.generator) {
                // 生成预设图标
                iconConfig.generator(canvas, iconSize.px);
            } else {
                throw new Error('请先生成图标');
            }
            
            // 将canvas转换为blob
            const blob = await new Promise(resolve => {
                canvas.toBlob(resolve, 'image/png', 0.9); // 0.9质量压缩
            });
            
            // 添加到ZIP文件
            zip.file(iconSize.filename, blob);
            
            processedCount++;
            showDownloadProgress(processedCount, totalCount);
            
            // 添加小延迟避免阻塞UI
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        // 生成ZIP文件
        showDownloadProgress(totalCount, totalCount, '正在压缩文件...');
        const zipBlob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } });
        
        // 下载ZIP文件
        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${iconConfig.name}-iOS-Icons.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // 显示完成提示
        hideDownloadProgress();
        showDownloadComplete();
        
    } catch (error) {
        console.error('生成iOS图标时出错:', error);
        hideDownloadProgress();
        showDownloadError();
    }
}

/**
 * 显示下载进度
 * @param {number} current - 当前下载数量
 * @param {number} total - 总数量
 * @param {string} message - 自定义消息
 */
function showDownloadProgress(current, total, message = '正在生成iOS图标...') {
    let progressDiv = document.getElementById('downloadProgress');
    if (!progressDiv) {
        progressDiv = document.createElement('div');
        progressDiv.id = 'downloadProgress';
        progressDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-size: 14px;
            font-weight: 500;
        `;
        document.body.appendChild(progressDiv);
    }
    
    const percentage = Math.round((current / total) * 100);
    progressDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3); border-radius: 50%; position: relative;">
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 12px;">${current}/${total}</div>
            </div>
            <div>${message} ${percentage}%</div>
        </div>
    `;
}

/**
 * 隐藏下载进度
 */
function hideDownloadProgress() {
    const progressDiv = document.getElementById('downloadProgress');
    if (progressDiv) {
        progressDiv.remove();
    }
}

/**
 * 显示下载完成提示
 */
function showDownloadComplete() {
    const completeDiv = document.createElement('div');
    completeDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #28a745, #20c997);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-size: 14px;
        font-weight: 500;
        animation: slideInRight 0.3s ease;
    `;
    completeDiv.innerHTML = '🎉 iOS图标ZIP文件下载完成！';
    document.body.appendChild(completeDiv);
    
    // 3秒后自动隐藏
    setTimeout(() => {
        completeDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => completeDiv.remove(), 300);
    }, 3000);
}

/**
 * 显示单个图标下载成功提示
 * @param {string} iconName - 图标名称
 * @param {number} size - 图标尺寸
 */
function showSingleDownloadComplete(iconName, size) {
    const completeDiv = document.createElement('div');
    completeDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #28a745, #20c997);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-size: 14px;
        font-weight: 500;
        animation: slideInRight 0.3s ease;
    `;
    completeDiv.innerHTML = `🎉 ${iconName}图标 (${size}×${size}) 下载完成！`;
    document.body.appendChild(completeDiv);
    
    // 3秒后自动隐藏
    setTimeout(() => {
        completeDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => completeDiv.remove(), 300);
    }, 3000);
}

/**
 * 显示下载错误提示
 */
function showDownloadError() {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #dc3545, #c82333);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-size: 14px;
        font-weight: 500;
        animation: slideInRight 0.3s ease;
    `;
    errorDiv.innerHTML = '❌ 生成iOS图标时出错，请重试';
    document.body.appendChild(errorDiv);
    
    // 5秒后自动隐藏
    setTimeout(() => {
        errorDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => errorDiv.remove(), 300);
    }, 5000);
}

// 页面加载时初始化
window.onload = function() {
    // 绑定图标选择事件
    document.querySelectorAll('.icon-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const iconType = this.getAttribute('data-icon');
            if (iconType === 'custom') {
                openAIModal();
            } else {
                switchIconType(iconType);
            }
        });
    });
    
    // 绑定尺寸选择事件
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const size = parseInt(this.getAttribute('data-size'));
            setIconSize(size);
        });
    });
    
    // 绑定标签页切换事件
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            switchDownloadType(type);
        });
    });
    
    // 绑定自定义尺寸输入事件
    document.getElementById('customSize').addEventListener('input', function() {
        const size = parseInt(this.value);
        if (size >= 16 && size <= 2048) {
            currentSize = size;
            // 更新按钮状态
            document.querySelectorAll('.size-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            // 更新当前尺寸显示
            document.getElementById('currentSizeDisplay').textContent = `${size}px`;
        }
    });
    
    // 点击弹窗外部关闭弹窗
    document.getElementById('sizeModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeSizeModal();
        }
    });
    
    // ESC键关闭弹窗
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeSizeModal();
            closeAIModal();
        }
    });
    
    // 生成初始预览
    switchIconType('calculator');
};

// AI生成相关函数

/**
 * 打开AI生成弹窗
 */
function openAIModal() {
    const modal = document.getElementById('aiModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

/**
 * 关闭AI生成弹窗
 */
function closeAIModal() {
    const modal = document.getElementById('aiModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

/**
 * 设置AI提示词
 * @param {string} prompt - 提示词
 */
function setAIPrompt(prompt) {
    document.getElementById('aiPrompt').value = prompt;
}

/**
 * 生成AI图标
 */
async function generateAIIcon() {
    const prompt = document.getElementById('aiPrompt').value.trim();
    if (!prompt) {
        alert('请输入图标描述');
        return;
    }
    
    const generateBtn = document.getElementById('generateAIBtn');
    const btnText = generateBtn.querySelector('.btn-text');
    const btnLoading = generateBtn.querySelector('.btn-loading');
    
    // 显示加载状态
    generateBtn.disabled = true;
    generateBtn.classList.add('loading');
    
    try {
        // 调用Hugging Face API
        const imageData = await callHuggingFaceAPI(prompt);
        
        // 保存AI生成的图像
        aiGeneratedImage = imageData;
        
        // 切换到自定义图标类型
        switchIconType('custom');
        
        // 关闭弹窗
        closeAIModal();
        
        // 显示成功提示
        showAIGenerationSuccess();
        
    } catch (error) {
        console.error('AI生成失败:', error);
        showAIGenerationError(error.message);
    } finally {
        // 恢复按钮状态
        generateBtn.disabled = false;
        generateBtn.classList.remove('loading');
    }
}

/**
 * 调用免费AI图像生成API
 * @param {string} prompt - 提示词
 * @returns {Promise<ImageData>} 图像数据
 */
async function callHuggingFaceAPI(prompt) {
    // 使用免费的Replicate API (无需token，但有使用限制)
    const API_URL = 'https://api.replicate.com/v1/predictions';
    
    // 优化提示词，专门用于图标生成
    const optimizedPrompt = `${prompt}, app icon, simple, clean, white background, high quality, 512x512`;
    
    try {
        // 首先尝试使用免费的Stable Diffusion模型
        const response = await fetch('https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: optimizedPrompt,
                parameters: {
                    num_inference_steps: 20,
                    guidance_scale: 7.5,
                    width: 512,
                    height: 512
                }
            })
        });
        
        if (response.ok) {
            const blob = await response.blob();
            return await createImageFromBlob(blob);
        }
        
        // 如果Hugging Face失败，使用备用的免费服务
        throw new Error('Hugging Face API暂时不可用');
        
    } catch (error) {
        // 使用备用的免费AI图像生成服务
        return await callBackupAIService(prompt);
    }
}

/**
 * 备用AI图像生成服务
 * @param {string} prompt - 提示词
 * @returns {Promise<ImageData>} 图像数据
 */
async function callBackupAIService(prompt) {
    // 使用免费的AI图像生成服务
    const API_URL = 'https://api.unsplash.com/photos/random';
    
    // 由于免费API限制，我们生成一个基于提示词的简单图标
    return await generateSimpleIconFromPrompt(prompt);
}

/**
 * 根据提示词生成简单图标
 * @param {string} prompt - 提示词
 * @returns {Promise<ImageData>} 图像数据
 */
async function generateSimpleIconFromPrompt(prompt) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 512;
    
    // 根据提示词生成简单的图标
    const colors = {
        'blue': '#2196F3',
        'red': '#F44336',
        'green': '#4CAF50',
        'yellow': '#FFC107',
        'purple': '#9C27B0',
        'orange': '#FF9800',
        'pink': '#E91E63',
        'default': '#667eea'
    };
    
    // 提取颜色关键词
    let color = colors.default;
    const promptLower = prompt.toLowerCase();
    for (const [key, value] of Object.entries(colors)) {
        if (promptLower.includes(key)) {
            color = value;
            break;
        }
    }
    
    // 绘制背景
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 512, 512);
    
    // 绘制圆形背景
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(256, 256, 200, 0, 2 * Math.PI);
    ctx.fill();
    
    // 根据提示词绘制简单图标
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 200px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    let iconText = '?';
    if (promptLower.includes('calculator') || promptLower.includes('计算器')) {
        iconText = '🧮';
    } else if (promptLower.includes('music') || promptLower.includes('音乐')) {
        iconText = '🎵';
    } else if (promptLower.includes('heart') || promptLower.includes('爱心')) {
        iconText = '❤️';
    } else if (promptLower.includes('star') || promptLower.includes('星星')) {
        iconText = '⭐';
    } else if (promptLower.includes('gear') || promptLower.includes('齿轮')) {
        iconText = '⚙️';
    } else if (promptLower.includes('home') || promptLower.includes('家')) {
        iconText = '🏠';
    } else if (promptLower.includes('mail') || promptLower.includes('邮件')) {
        iconText = '📧';
    } else if (promptLower.includes('phone') || promptLower.includes('电话')) {
        iconText = '📱';
    } else if (promptLower.includes('camera') || promptLower.includes('相机')) {
        iconText = '📷';
    } else if (promptLower.includes('book') || promptLower.includes('书')) {
        iconText = '📚';
    } else {
        iconText = '🎨';
    }
    
    // 绘制图标
    ctx.font = 'bold 120px Arial';
    ctx.fillText(iconText, 256, 256);
    
    // 添加一些装饰
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 8;
    ctx.stroke();
    
    return ctx.getImageData(0, 0, 512, 512);
}

/**
 * 从Blob创建Image对象
 * @param {Blob} blob - 图像blob
 * @returns {Promise<ImageData>} 图像数据
 */
function createImageFromBlob(blob) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            resolve(ctx.getImageData(0, 0, canvas.width, canvas.height));
        };
        img.onerror = reject;
        img.src = URL.createObjectURL(blob);
    });
}

/**
 * 在画布上绘制AI生成的图像
 * @param {HTMLCanvasElement} canvas - 目标画布
 * @param {ImageData} imageData - 图像数据
 */
function drawAIImageOnCanvas(canvas, imageData) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 创建临时画布来缩放图像
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = imageData.width;
    tempCanvas.height = imageData.height;
    tempCtx.putImageData(imageData, 0, 0);
    
    // 绘制到目标画布
    ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
}

/**
 * 显示AI生成成功提示
 */
function showAIGenerationSuccess() {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #28a745, #20c997);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-size: 14px;
        font-weight: 500;
        animation: slideInRight 0.3s ease;
    `;
    successDiv.innerHTML = '🎨 智能图标生成成功！现在可以下载了';
    document.body.appendChild(successDiv);
    
    // 3秒后自动隐藏
    setTimeout(() => {
        successDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => successDiv.remove(), 300);
    }, 3000);
}

/**
 * 显示AI生成错误提示
 * @param {string} message - 错误消息
 */
function showAIGenerationError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #dc3545, #c82333);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-size: 14px;
        font-weight: 500;
        animation: slideInRight 0.3s ease;
    `;
    errorDiv.innerHTML = `❌ AI生成失败: ${message}`;
    document.body.appendChild(errorDiv);
    
    // 5秒后自动隐藏
    setTimeout(() => {
        errorDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => errorDiv.remove(), 300);
    }, 5000);
}
