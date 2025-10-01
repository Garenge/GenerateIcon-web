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
let aiGeneratedImage = null;

// 文字设置配置
let textSettings = {
    fontSize: 'medium',
    customFontSize: 100,
    fontFamily: 'Arial',
    textWrap: false,
    textStyle: 'bold',
    maxLength: 7,
    textColor: '#ffffff'
};

// 底图设置配置
let backgroundSettings = {
    backgroundShape: 'rounded',
    cornerRadius: 40,
    backgroundColor: '#667eea',
    iconPadding: 20,
    shadowIntensity: 20,
    borderWidth: 0
}; // 存储AI生成的图像数据

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
    
    // 刷新预览和设置页面
    updateMainPreview();
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
    // 检查是否需要显示设置
    checkAndShowTextSettings(prompt);
    // 更新预览
    updateTextPreview();
}

/**
 * 切换文字设置模块的展开/收起状态
 */
function toggleTextSettings() {
    const module = document.querySelector('.text-settings-module');
    const content = document.getElementById('textSettingsContent');
    const toggle = document.getElementById('textSettingsToggle');
    const subtitle = document.getElementById('textSettingsSubtitle');
    
    if (content.style.display === 'none') {
        content.style.display = 'block';
        module.classList.add('expanded');
        subtitle.textContent = '点击收起设置选项';
        // 延迟初始化预览，确保DOM元素已渲染
        setTimeout(() => {
            updateTextPreview();
        }, 100);
    } else {
        content.style.display = 'none';
        module.classList.remove('expanded');
        subtitle.textContent = '点击展开设置选项';
    }
}

/**
 * 检查提示词并显示相应的设置模块
 * @param {string} prompt - 提示词
 */
function checkAndShowTextSettings(prompt) {
    const promptLower = prompt.toLowerCase();
    const iconConfigs = {
        'calculator': { emoji: '🧮', shape: 'rounded' },
        'music': { emoji: '🎵', shape: 'circle' },
        'heart': { emoji: '❤️', shape: 'heart' },
        'star': { emoji: '⭐', shape: 'star' },
        'gear': { emoji: '⚙️', shape: 'circle' },
        'home': { emoji: '🏠', shape: 'rounded' },
        'mail': { emoji: '📧', shape: 'rounded' },
        'phone': { emoji: '📱', shape: 'rounded' },
        'camera': { emoji: '📷', shape: 'circle' },
        'book': { emoji: '📚', shape: 'rounded' },
        'game': { emoji: '🎮', shape: 'rounded' },
        'shopping': { emoji: '🛒', shape: 'circle' },
        'car': { emoji: '🚗', shape: 'rounded' },
        'plane': { emoji: '✈️', shape: 'rounded' },
        'food': { emoji: '🍔', shape: 'circle' },
        'drink': { emoji: '☕', shape: 'circle' },
        'weather': { emoji: '☀️', shape: 'circle' },
        'chat': { emoji: '💬', shape: 'rounded' },
        'lock': { emoji: '🔒', shape: 'rounded' },
        'key': { emoji: '🔑', shape: 'rounded' },
        'search': { emoji: '🔍', shape: 'circle' },
        'settings': { emoji: '⚙️', shape: 'circle' },
        'user': { emoji: '👤', shape: 'circle' },
        'notification': { emoji: '🔔', shape: 'circle' },
        'download': { emoji: '⬇️', shape: 'rounded' },
        'upload': { emoji: '⬆️', shape: 'rounded' },
        'edit': { emoji: '✏️', shape: 'circle' },
        'delete': { emoji: '🗑️', shape: 'rounded' },
        'add': { emoji: '➕', shape: 'circle' },
        'remove': { emoji: '➖', shape: 'circle' },
        'play': { emoji: '▶️', shape: 'circle' },
        'pause': { emoji: '⏸️', shape: 'circle' },
        'stop': { emoji: '⏹️', shape: 'circle' },
        'next': { emoji: '⏭️', shape: 'circle' },
        'previous': { emoji: '⏮️', shape: 'circle' },
        'volume': { emoji: '🔊', shape: 'circle' },
        'mute': { emoji: '🔇', shape: 'circle' },
        'wifi': { emoji: '📶', shape: 'rounded' },
        'battery': { emoji: '🔋', shape: 'rounded' },
        'clock': { emoji: '🕐', shape: 'circle' },
        'calendar': { emoji: '📅', shape: 'rounded' },
        'location': { emoji: '📍', shape: 'circle' },
        'map': { emoji: '🗺️', shape: 'rounded' },
        'compass': { emoji: '🧭', shape: 'circle' },
        'flag': { emoji: '🏁', shape: 'rounded' },
        'trophy': { emoji: '🏆', shape: 'rounded' },
        'medal': { emoji: '🏅', shape: 'circle' },
        'gift': { emoji: '🎁', shape: 'rounded' },
        'balloon': { emoji: '🎈', shape: 'circle' },
        'party': { emoji: '🎉', shape: 'circle' },
        'fire': { emoji: '🔥', shape: 'circle' },
        'lightning': { emoji: '⚡', shape: 'rounded' },
        'snow': { emoji: '❄️', shape: 'circle' },
        'rain': { emoji: '🌧️', shape: 'circle' },
        'sun': { emoji: '☀️', shape: 'circle' },
        'moon': { emoji: '🌙', shape: 'circle' },
        'cloud': { emoji: '☁️', shape: 'rounded' }
    };
    
    // 检查是否有匹配的预设图标
    let hasMatch = false;
    for (const [key, config] of Object.entries(iconConfigs)) {
        if (promptLower.includes(key)) {
            hasMatch = true;
            break;
        }
    }
    
    const textModule = document.querySelector('.text-settings-module');
    const subtitle = document.getElementById('textSettingsSubtitle');
    
    if (!hasMatch && prompt.trim()) {
        // 没有匹配的预设图标，显示文字设置模块
        textModule.style.display = 'block';
        subtitle.textContent = '检测到文字输入，可自定义设置';
    } else {
        // 有匹配的预设图标，隐藏文字设置模块
        textModule.style.display = 'none';
    }
}

/**
 * 更新文字设置
 */
function updateTextSettings() {
    const fontSizeEl = document.getElementById('fontSize');
    const customFontSizeEl = document.getElementById('customFontSize');
    const fontFamilyEl = document.getElementById('fontFamily');
    const textWrapEl = document.getElementById('textWrap');
    const textStyleEl = document.getElementById('textStyle');
    const maxLengthEl = document.getElementById('maxLength');
    const textColorEl = document.getElementById('textColor');
    
    if (fontSizeEl) textSettings.fontSize = fontSizeEl.value;
    if (customFontSizeEl) textSettings.customFontSize = parseInt(customFontSizeEl.value) || 100;
    if (fontFamilyEl) textSettings.fontFamily = fontFamilyEl.value;
    if (textWrapEl) textSettings.textWrap = textWrapEl.value === 'true';
    if (textStyleEl) textSettings.textStyle = textStyleEl.value;
    if (maxLengthEl) textSettings.maxLength = parseInt(maxLengthEl.value) || 7;
    if (textColorEl) textSettings.textColor = textColorEl.value;
}

/**
 * 更新底图设置
 */
function updateBackgroundSettings() {
    const backgroundShapeEl = document.getElementById('backgroundShape');
    const cornerRadiusEl = document.getElementById('cornerRadius');
    const backgroundColorEl = document.getElementById('backgroundColor');
    const iconPaddingEl = document.getElementById('iconPadding');
    const shadowIntensityEl = document.getElementById('shadowIntensity');
    const borderWidthEl = document.getElementById('borderWidth');
    
    if (backgroundShapeEl) backgroundSettings.backgroundShape = backgroundShapeEl.value;
    if (cornerRadiusEl) {
        backgroundSettings.cornerRadius = parseInt(cornerRadiusEl.value);
        document.getElementById('cornerRadiusValue').textContent = backgroundSettings.cornerRadius + 'px';
    }
    if (backgroundColorEl) backgroundSettings.backgroundColor = backgroundColorEl.value;
    if (iconPaddingEl) {
        backgroundSettings.iconPadding = parseInt(iconPaddingEl.value);
        document.getElementById('iconPaddingValue').textContent = backgroundSettings.iconPadding + 'px';
    }
    if (shadowIntensityEl) {
        backgroundSettings.shadowIntensity = parseInt(shadowIntensityEl.value);
        document.getElementById('shadowIntensityValue').textContent = backgroundSettings.shadowIntensity + 'px';
    }
    if (borderWidthEl) {
        backgroundSettings.borderWidth = parseInt(borderWidthEl.value);
        document.getElementById('borderWidthValue').textContent = backgroundSettings.borderWidth + 'px';
    }
}

/**
 * 更新文字预览
 */
function updateTextPreview() {
    const canvas = document.getElementById('textPreviewCanvas');
    if (!canvas) return;
    
    // 先更新设置值
    updateTextSettings();
    
    const ctx = canvas.getContext('2d');
    const promptInput = document.getElementById('aiPrompt');
    const prompt = promptInput ? promptInput.value.trim() : '';
    
    // 获取预览文字
    let previewText = 'MYAPP';
    if (prompt) {
        const words = prompt.trim().split(/\s+/);
        const firstWord = words[0] || 'MYAPP';
        previewText = firstWord.substring(0, textSettings.maxLength).toUpperCase();
    }
    
    // 更新预览文字显示
    const previewTextEl = document.getElementById('previewText');
    if (previewTextEl) {
        previewTextEl.textContent = previewText;
    }
    
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制背景
    ctx.fillStyle = '#667eea';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制文字
    ctx.fillStyle = textSettings.textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // 计算字体大小（按比例缩放）
    let fontSize;
    switch (textSettings.fontSize) {
        case 'small':
            fontSize = 24;
            break;
        case 'large':
            fontSize = 36;
            break;
        case 'custom':
            fontSize = Math.max(12, Math.min(48, textSettings.customFontSize * 0.3));
            break;
        default: // medium
            fontSize = 30;
    }
    
    // 构建字体样式
    ctx.font = `${textSettings.textStyle} ${fontSize}px ${textSettings.fontFamily}`;
    
    // 处理文字换行
    if (textSettings.textWrap && previewText.length > 4) {
        const maxCharsPerLine = Math.ceil(Math.sqrt(previewText.length));
        const lines = [];
        
        for (let i = 0; i < previewText.length; i += maxCharsPerLine) {
            lines.push(previewText.slice(i, i + maxCharsPerLine));
        }
        
        const lineHeight = fontSize * 1.2;
        const startY = canvas.height / 2 - (lines.length - 1) * lineHeight / 2;
        
        lines.forEach((line, index) => {
            ctx.fillText(line, canvas.width / 2, startY + index * lineHeight);
        });
    } else {
        // 单行文字
        ctx.fillText(previewText, canvas.width / 2, canvas.height / 2);
    }
    
    // 更新预览详情
    const fontSizeText = textSettings.fontSize === 'custom' ? `${textSettings.customFontSize}px` : 
                        textSettings.fontSize === 'small' ? '80px' :
                        textSettings.fontSize === 'large' ? '120px' : '100px';
    
    const previewDetailsEl = document.getElementById('previewDetails');
    if (previewDetailsEl) {
        previewDetailsEl.textContent = 
            `字体: ${textSettings.fontFamily}, 大小: ${fontSizeText}, 样式: ${textSettings.textStyle}`;
    }
}

/**
 * 更新底图预览
 */
function updateBackgroundPreview() {
    // 先更新设置值
    updateBackgroundSettings();
    
    // 更新主预览画布
    updateMainPreview();
}

/**
 * 处理字体大小选择变化
 */
function handleFontSizeChange() {
    const fontSizeSelect = document.getElementById('fontSize');
    const customSizeInput = document.getElementById('customFontSize');
    
    if (fontSizeSelect.value === 'custom') {
        customSizeInput.style.display = 'block';
        customSizeInput.value = textSettings.customFontSize;
    } else {
        customSizeInput.style.display = 'none';
    }
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
    
    // 更新文字设置
    updateTextSettings();
    
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
 * 本地智能图标生成（无需API）
 * @param {string} prompt - 提示词
 * @returns {Promise<ImageData>} 图像数据
 */
async function callHuggingFaceAPI(prompt) {
    // 直接使用本地智能生成，无需任何外部API
    return await generateSimpleIconFromPrompt(prompt);
}

/**
 * 根据提示词生成智能图标
 * @param {string} prompt - 提示词
 * @returns {Promise<ImageData>} 图像数据
 */
async function generateSimpleIconFromPrompt(prompt) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 512;
    
    // 颜色配置
    const colors = {
        'blue': '#2196F3',
        'red': '#F44336',
        'green': '#4CAF50',
        'yellow': '#FFC107',
        'purple': '#9C27B0',
        'orange': '#FF9800',
        'pink': '#E91E63',
        'teal': '#009688',
        'indigo': '#3F51B5',
        'cyan': '#00BCD4',
        'lime': '#CDDC39',
        'amber': '#FFC107',
        'deep-orange': '#FF5722',
        'brown': '#795548',
        'grey': '#607D8B',
        'default': '#667eea'
    };
    
    // 图标配置
    const iconConfigs = {
        'calculator': { emoji: '🧮', shape: 'rounded' },
        'music': { emoji: '🎵', shape: 'circle' },
        'heart': { emoji: '❤️', shape: 'heart' },
        'star': { emoji: '⭐', shape: 'star' },
        'gear': { emoji: '⚙️', shape: 'circle' },
        'home': { emoji: '🏠', shape: 'rounded' },
        'mail': { emoji: '📧', shape: 'rounded' },
        'phone': { emoji: '📱', shape: 'rounded' },
        'camera': { emoji: '📷', shape: 'circle' },
        'book': { emoji: '📚', shape: 'rounded' },
        'game': { emoji: '🎮', shape: 'rounded' },
        'shopping': { emoji: '🛒', shape: 'circle' },
        'car': { emoji: '🚗', shape: 'rounded' },
        'plane': { emoji: '✈️', shape: 'rounded' },
        'food': { emoji: '🍔', shape: 'circle' },
        'drink': { emoji: '☕', shape: 'circle' },
        'weather': { emoji: '☀️', shape: 'circle' },
        'chat': { emoji: '💬', shape: 'rounded' },
        'lock': { emoji: '🔒', shape: 'rounded' },
        'key': { emoji: '🔑', shape: 'rounded' },
        'search': { emoji: '🔍', shape: 'circle' },
        'settings': { emoji: '⚙️', shape: 'circle' },
        'user': { emoji: '👤', shape: 'circle' },
        'notification': { emoji: '🔔', shape: 'circle' },
        'download': { emoji: '⬇️', shape: 'rounded' },
        'upload': { emoji: '⬆️', shape: 'rounded' },
        'edit': { emoji: '✏️', shape: 'circle' },
        'delete': { emoji: '🗑️', shape: 'rounded' },
        'add': { emoji: '➕', shape: 'circle' },
        'remove': { emoji: '➖', shape: 'circle' },
        'play': { emoji: '▶️', shape: 'circle' },
        'pause': { emoji: '⏸️', shape: 'circle' },
        'stop': { emoji: '⏹️', shape: 'circle' },
        'next': { emoji: '⏭️', shape: 'circle' },
        'previous': { emoji: '⏮️', shape: 'circle' },
        'volume': { emoji: '🔊', shape: 'circle' },
        'mute': { emoji: '🔇', shape: 'circle' },
        'wifi': { emoji: '📶', shape: 'rounded' },
        'battery': { emoji: '🔋', shape: 'rounded' },
        'clock': { emoji: '🕐', shape: 'circle' },
        'calendar': { emoji: '📅', shape: 'rounded' },
        'location': { emoji: '📍', shape: 'circle' },
        'map': { emoji: '🗺️', shape: 'rounded' },
        'compass': { emoji: '🧭', shape: 'circle' },
        'flag': { emoji: '🏁', shape: 'rounded' },
        'trophy': { emoji: '🏆', shape: 'rounded' },
        'medal': { emoji: '🏅', shape: 'circle' },
        'gift': { emoji: '🎁', shape: 'rounded' },
        'balloon': { emoji: '🎈', shape: 'circle' },
        'party': { emoji: '🎉', shape: 'circle' },
        'fire': { emoji: '🔥', shape: 'circle' },
        'lightning': { emoji: '⚡', shape: 'rounded' },
        'snow': { emoji: '❄️', shape: 'circle' },
        'rain': { emoji: '🌧️', shape: 'circle' },
        'sun': { emoji: '☀️', shape: 'circle' },
        'moon': { emoji: '🌙', shape: 'circle' },
        'cloud': { emoji: '☁️', shape: 'rounded' }
    };
    
    const promptLower = prompt.toLowerCase();
    
    // 提取颜色
    let color = colors.default;
    for (const [key, value] of Object.entries(colors)) {
        if (promptLower.includes(key)) {
            color = value;
            break;
        }
    }
    
    // 提取图标
    let iconConfig = { emoji: null, shape: 'circle' };
    for (const [key, config] of Object.entries(iconConfigs)) {
        if (promptLower.includes(key)) {
            iconConfig = config;
            break;
        }
    }
    
    // 如果没有找到预设图标，使用用户输入的文字
    if (!iconConfig.emoji) {
        // 提取第一个单词或前N个字符（使用用户设置的最大长度）
        const words = prompt.trim().split(/\s+/);
        const firstWord = words[0] || 'ICON';
        iconConfig.emoji = firstWord.substring(0, textSettings.maxLength).toUpperCase();
        iconConfig.isText = true; // 标记为文字图标
    }
    
    // 绘制背景
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 512, 512);
    
    // 绘制背景形状
    ctx.fillStyle = color;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 4;
    
    if (iconConfig.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(256, 256, 180, 0, 2 * Math.PI);
        ctx.fill();
    } else if (iconConfig.shape === 'rounded') {
        ctx.fillRoundRect(76, 76, 360, 360, 40);
    } else if (iconConfig.shape === 'heart') {
        drawHeart(ctx, 256, 256, 120);
    } else if (iconConfig.shape === 'star') {
        drawStar(ctx, 256, 256, 120);
    }
    
    // 重置阴影
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    
    // 绘制图标
    ctx.fillStyle = iconConfig.isText ? textSettings.textColor : '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    if (iconConfig.emoji && iconConfig.emoji.length <= 2 && !iconConfig.isText) {
        // 如果是emoji（通常1-2个字符），使用大字体
        ctx.font = 'bold 100px Arial';
        ctx.fillText(iconConfig.emoji, 256, 256);
    } else {
        // 如果是文字，使用文字设置
        let fontSize;
        if (iconConfig.isText) {
            // 使用用户设置的字体大小
            switch (textSettings.fontSize) {
                case 'small':
                    fontSize = 80;
                    break;
                case 'large':
                    fontSize = 120;
                    break;
                case 'custom':
                    fontSize = textSettings.customFontSize;
                    break;
                default: // medium
                    fontSize = 100;
            }
        } else {
            // 根据文字长度调整字体大小（保持原有逻辑）
            const textLength = iconConfig.emoji.length;
            fontSize = 120;
            if (textLength > 4) {
                fontSize = 80;
            } else if (textLength > 2) {
                fontSize = 100;
            }
        }
        
        // 构建字体样式
        const fontFamily = iconConfig.isText ? textSettings.fontFamily : 'Arial';
        const fontWeight = iconConfig.isText ? textSettings.textStyle : 'bold';
        ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        
        // 处理文字换行
        if (iconConfig.isText && textSettings.textWrap && iconConfig.emoji.length > 4) {
            // 文字换行处理
            const words = iconConfig.emoji.split('');
            const maxCharsPerLine = Math.ceil(Math.sqrt(iconConfig.emoji.length));
            const lines = [];
            
            for (let i = 0; i < words.length; i += maxCharsPerLine) {
                lines.push(words.slice(i, i + maxCharsPerLine).join(''));
            }
            
            const lineHeight = fontSize * 1.2;
            const startY = 256 - (lines.length - 1) * lineHeight / 2;
            
            lines.forEach((line, index) => {
                ctx.fillText(line, 256, startY + index * lineHeight);
            });
        } else {
            // 单行文字
            ctx.fillText(iconConfig.emoji, 256, 256);
        }
    }
    
    // 添加高光效果
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    if (iconConfig.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(200, 200, 60, 0, 2 * Math.PI);
        ctx.fill();
    }
    
    return ctx.getImageData(0, 0, 512, 512);
}

/**
 * 绘制心形
 */
function drawHeart(ctx, x, y, size) {
    ctx.beginPath();
    ctx.moveTo(x, y + size * 0.3);
    ctx.bezierCurveTo(x, y, x - size * 0.5, y, x - size * 0.5, y + size * 0.3);
    ctx.bezierCurveTo(x - size * 0.5, y + size * 0.7, x, y + size * 1.2, x, y + size * 1.2);
    ctx.bezierCurveTo(x, y + size * 1.2, x + size * 0.5, y + size * 0.7, x + size * 0.5, y + size * 0.3);
    ctx.bezierCurveTo(x + size * 0.5, y, x, y, x, y + size * 0.3);
    ctx.fill();
}

/**
 * 绘制星形
 */
function drawStar(ctx, x, y, size) {
    const spikes = 5;
    const outerRadius = size;
    const innerRadius = size * 0.4;
    
    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i * Math.PI) / spikes;
        const px = x + Math.cos(angle) * radius;
        const py = y + Math.sin(angle) * radius;
        
        if (i === 0) {
            ctx.moveTo(px, py);
        } else {
            ctx.lineTo(px, py);
        }
    }
    ctx.closePath();
    ctx.fill();
}

/**
 * Canvas绘制圆角矩形
 */
CanvasRenderingContext2D.prototype.fillRoundRect = function(x, y, width, height, radius) {
    this.beginPath();
    this.moveTo(x + radius, y);
    this.lineTo(x + width - radius, y);
    this.quadraticCurveTo(x + width, y, x + width, y + radius);
    this.lineTo(x + width, y + height - radius);
    this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    this.lineTo(x + radius, y + height);
    this.quadraticCurveTo(x, y + height, x, y + height - radius);
    this.lineTo(x, y + radius);
    this.quadraticCurveTo(x, y, x + radius, y);
    this.closePath();
    this.fill();
};

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

/**
 * 初始化文字设置模块
 */
function initializeTextSettings() {
    // 设置默认值
    const fontSizeEl = document.getElementById('fontSize');
    const fontFamilyEl = document.getElementById('fontFamily');
    const textStyleEl = document.getElementById('textStyle');
    const maxLengthEl = document.getElementById('maxLength');
    const textWrapEl = document.getElementById('textWrap');
    const textColorEl = document.getElementById('textColor');
    
    if (fontSizeEl) fontSizeEl.value = textSettings.fontSize;
    if (fontFamilyEl) fontFamilyEl.value = textSettings.fontFamily;
    if (textStyleEl) textStyleEl.value = textSettings.textStyle;
    if (maxLengthEl) maxLengthEl.value = textSettings.maxLength;
    if (textWrapEl) textWrapEl.value = textSettings.textWrap.toString();
    if (textColorEl) textColorEl.value = textSettings.textColor;
    
    // 初始化预览
    setTimeout(() => {
        updateTextPreview();
    }, 200);
}

/**
 * 初始化底图设置模块
 */
function initializeBackgroundSettings() {
    // 设置默认值
    const backgroundShapeEl = document.getElementById('backgroundShape');
    const cornerRadiusEl = document.getElementById('cornerRadius');
    const backgroundColorEl = document.getElementById('backgroundColor');
    const iconPaddingEl = document.getElementById('iconPadding');
    const shadowIntensityEl = document.getElementById('shadowIntensity');
    const borderWidthEl = document.getElementById('borderWidth');
    
    if (backgroundShapeEl) backgroundShapeEl.value = backgroundSettings.backgroundShape;
    if (cornerRadiusEl) cornerRadiusEl.value = backgroundSettings.cornerRadius;
    if (backgroundColorEl) backgroundColorEl.value = backgroundSettings.backgroundColor;
    if (iconPaddingEl) iconPaddingEl.value = backgroundSettings.iconPadding;
    if (shadowIntensityEl) shadowIntensityEl.value = backgroundSettings.shadowIntensity;
    if (borderWidthEl) borderWidthEl.value = backgroundSettings.borderWidth;
    
    // 初始化预览
    setTimeout(() => {
        updateBackgroundPreview();
    }, 200);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化默认图标
    switchIconType('calculator');
    
    // 绑定事件监听器
    bindEventListeners();
    
    // 初始化文字设置模块
    initializeTextSettings();
    
    // 初始化底图设置模块
    initializeBackgroundSettings();
});

/**
 * 更新主预览画布 - 组合式显示（底图+图标）
 */
function updateMainPreview() {
    const previewCanvas = document.getElementById('previewCanvas');
    if (!previewCanvas) return;
    
    const ctx = previewCanvas.getContext('2d');
    const canvasSize = previewCanvas.width;
    
    // 清空画布
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    
    // 保存当前状态
    ctx.save();
    
    // 绘制底图背景
    ctx.fillStyle = backgroundSettings.backgroundColor;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = backgroundSettings.shadowIntensity;
    ctx.shadowOffsetY = 4;
    
    // 根据形状绘制背景
    if (backgroundSettings.backgroundShape === 'circle') {
        ctx.beginPath();
        ctx.arc(canvasSize / 2, canvasSize / 2, canvasSize / 2 - 10, 0, 2 * Math.PI);
        ctx.fill();
    } else if (backgroundSettings.backgroundShape === 'rounded') {
        const radius = backgroundSettings.cornerRadius;
        ctx.beginPath();
        ctx.moveTo(radius, 10);
        ctx.lineTo(canvasSize - radius, 10);
        ctx.quadraticCurveTo(canvasSize - 10, 10, canvasSize - 10, radius);
        ctx.lineTo(canvasSize - 10, canvasSize - radius);
        ctx.quadraticCurveTo(canvasSize - 10, canvasSize - 10, canvasSize - radius, canvasSize - 10);
        ctx.lineTo(radius, canvasSize - 10);
        ctx.quadraticCurveTo(10, canvasSize - 10, 10, canvasSize - radius);
        ctx.lineTo(10, radius);
        ctx.quadraticCurveTo(10, 10, radius, 10);
        ctx.closePath();
        ctx.fill();
    } else { // square
        ctx.fillRect(10, 10, canvasSize - 20, canvasSize - 20);
    }
    
    // 重置阴影
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    
    // 设置图标绘制区域（考虑内边距）
    const padding = backgroundSettings.iconPadding;
    const iconSize = canvasSize - padding * 2;
    const iconX = padding;
    const iconY = padding;
    
    // 创建图标绘制区域
    ctx.save();
    ctx.translate(iconX, iconY);
    ctx.scale(iconSize / canvasSize, iconSize / canvasSize);
    
    // 绘制图标内容
    if (currentIconType === 'custom' && aiGeneratedImage) {
        // 绘制AI生成的图标
        drawAIImageOnCanvas(previewCanvas, aiGeneratedImage);
    } else if (currentIconType !== 'custom') {
        // 绘制预设图标
        const iconConfig = iconTypes[currentIconType];
        if (iconConfig && iconConfig.generator) {
            iconConfig.generator(previewCanvas, canvasSize);
        }
    }
    
    // 恢复状态
    ctx.restore();
    ctx.restore();
}

/**
 * 切换设置面板的显示/隐藏状态
 */
function toggleSettingsPanel() {
    const settingsPanel = document.getElementById('settingsPanel');
    const layout = document.querySelector('.three-column-layout');
    
    if (settingsPanel.classList.contains('show')) {
        settingsPanel.classList.remove('show');
        layout.classList.remove('settings-visible');
    } else {
        settingsPanel.classList.add('show');
        layout.classList.add('settings-visible');
    }
}
