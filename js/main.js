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
    }
};

let currentIconType = 'calculator';
let currentSize = 1024;

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
    iconConfig.generator(previewCanvas, 256);
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
 * 确认尺寸并下载图标
 */
function confirmSizeAndDownload() {
    closeSizeModal();
    generateAndDownload();
}

/**
 * 生成并下载图标
 */
function generateAndDownload() {
    const canvas = document.createElement('canvas');
    canvas.width = currentSize;
    canvas.height = currentSize;
    
    const iconConfig = iconTypes[currentIconType];
    iconConfig.generator(canvas, currentSize);
    
    canvas.toBlob(function(blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${iconConfig.name}-icon-${currentSize}x${currentSize}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 'image/png');
}

// 页面加载时初始化
window.onload = function() {
    // 绑定图标选择事件
    document.querySelectorAll('.icon-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const iconType = this.getAttribute('data-icon');
            switchIconType(iconType);
        });
    });
    
    // 绑定尺寸选择事件
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const size = parseInt(this.getAttribute('data-size'));
            setIconSize(size);
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
        }
    });
    
    // 生成初始预览
    switchIconType('calculator');
};
