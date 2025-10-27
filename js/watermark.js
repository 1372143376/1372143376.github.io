// 在线图片添加水印工具

let originalImage = null;
let watermarkedImage = null;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initWatermarkTool();
});

// 初始化水印工具
function initWatermarkTool() {
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');
    const watermarkColorText = document.getElementById('watermark-color-text');
    const watermarkColor = document.getElementById('watermark-color');
    const opacitySlider = document.getElementById('watermark-opacity');
    const opacityValue = document.getElementById('opacity-value');
    
    // 文件选择事件
    fileInput.addEventListener('change', handleFileSelect);
    
    // 拖拽上传事件
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('drop', handleFileDrop);
    uploadArea.addEventListener('click', () => fileInput.click());
    
    // 颜色选择器同步
    watermarkColor.addEventListener('input', function() {
        watermarkColorText.value = this.value;
    });
    
    watermarkColorText.addEventListener('input', function() {
        watermarkColor.value = this.value;
    });
    
    // 透明度滑块同步
    opacitySlider.addEventListener('input', function() {
        opacityValue.textContent = this.value + '%';
    });
}

// 处理文件选择
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file && file.type.match('image.*')) {
        processImageFile(file);
    }
}

// 处理拖拽文件
function handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    document.getElementById('uploadArea').classList.add('dragover');
}

// 处理拖拽放置
function handleFileDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    document.getElementById('uploadArea').classList.remove('dragover');
    
    const file = event.dataTransfer.files[0];
    if (file && file.type.match('image.*')) {
        document.getElementById('fileInput').files = event.dataTransfer.files;
        processImageFile(file);
    }
}

// 处理图片文件
function processImageFile(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            originalImage = img;
            // 显示预览图片
            displayPreviewImage(img);
            showAlert('图片上传成功，请设置水印参数');
        };
        img.src = e.target.result;
    };
    
    reader.readAsDataURL(file);
}

// 显示预览图片
function displayPreviewImage(img) {
    const previewContainer = document.getElementById('previewContainer');
    const previewImage = document.getElementById('previewImage');
    
    previewImage.src = img.src;
    previewContainer.classList.remove('hidden');
    
    // 隐藏结果容器
    document.getElementById('resultContainer').classList.add('hidden');
}

// 添加水印
function applyWatermark() {
    if (!originalImage) {
        showAlert('请先上传一张图片');
        return;
    }
    
    const watermarkText = document.getElementById('watermark-text').value;
    if (!watermarkText) {
        showAlert('请输入水印文字');
        return;
    }
    
    try {
        // 获取水印参数
        const watermarkColor = document.getElementById('watermark-color').value;
        const watermarkOpacity = parseInt(document.getElementById('watermark-opacity').value) / 100;
        const watermarkFontSize = parseInt(document.getElementById('watermark-font-size').value);
        const watermarkSpacing = parseInt(document.getElementById('watermark-spacing').value);
        const watermarkAngle = parseInt(document.getElementById('watermark-angle').value);
        
        // 创建canvas来处理图片
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // 设置canvas尺寸与原图一致
        canvas.width = originalImage.width;
        canvas.height = originalImage.height;
        
        // 绘制原图
        ctx.drawImage(originalImage, 0, 0);
        
        // 设置水印样式
        ctx.fillStyle = hexToRgbA(watermarkColor, watermarkOpacity);
        ctx.font = `${watermarkFontSize}px Arial`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        
        // 保存当前状态
        ctx.save();
        
        // 移动到画布中心进行旋转
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(watermarkAngle * Math.PI / 180);
        
        // 计算水印文本的尺寸
        const textWidth = ctx.measureText(watermarkText).width;
        
        // 绘制水印（重复平铺效果）
        const startX = -canvas.width / 2;
        const startY = -canvas.height / 2;
        const endX = canvas.width / 2;
        const endY = canvas.height / 2;
        
        for (let y = startY; y < endY; y += watermarkSpacing + watermarkFontSize) {
            for (let x = startX; x < endX; x += watermarkSpacing + textWidth) {
                ctx.fillText(watermarkText, x, y);
            }
        }
        
        // 恢复状态
        ctx.restore();
        
        // 将结果保存为图片
        watermarkedImage = new Image();
        watermarkedImage.onload = function() {
            displayResultImage(watermarkedImage);
        };
        watermarkedImage.src = canvas.toDataURL('image/png');
    } catch (error) {
        showAlert('添加水印时出错: ' + error.message);
        console.error(error);
    }
}

// 显示结果图片
function displayResultImage(img) {
    const resultContainer = document.getElementById('resultContainer');
    const resultImage = document.getElementById('resultImage');
    
    resultImage.src = img.src;
    resultContainer.classList.remove('hidden');
}

// 下载水印图片
function downloadWatermarkImage() {
    if (!watermarkedImage) {
        showAlert('没有可下载的图片');
        return;
    }
    
    const link = document.createElement('a');
    link.download = 'watermarked-image.png';
    link.href = watermarkedImage.src;
    link.click();
    
    showAlert('图片已下载');
}

// 清空输入
function clearWatermarkInput() {
    document.getElementById('fileInput').value = '';
    document.getElementById('watermark-text').value = '水印文字';
    document.getElementById('watermark-color').value = '#CCCCCC';
    document.getElementById('watermark-color-text').value = '#CCCCCC';
    document.getElementById('watermark-opacity').value = '50';
    document.getElementById('opacity-value').textContent = '50%';
    document.getElementById('watermark-font-size').value = '30';
    document.getElementById('watermark-spacing').value = '50';
    document.getElementById('watermark-angle').value = '45';
    
    // 隐藏预览和结果
    document.getElementById('previewContainer').classList.add('hidden');
    document.getElementById('resultContainer').classList.add('hidden');
    
    originalImage = null;
    watermarkedImage = null;
}

// 将十六进制颜色转换为RGBA
function hexToRgbA(hex, opacity) {
    let c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length === 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + opacity + ')';
    }
    throw new Error('Bad Hex');
}

// 显示提示信息，2秒后自动关闭
function showAlert(message) {
    // 检查是否已经存在提示框，如果存在则移除
    const existingAlerts = document.querySelectorAll('.alert-box');
    existingAlerts.forEach(alert => alert.remove());
    
    // 创建提示框元素
    const alertBox = document.createElement('div');
    alertBox.className = 'alert-box';
    alertBox.textContent = message;
    alertBox.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #333;
        color: white;
        padding: 15px 20px;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-size: 14px;
        max-width: 300px;
    `;
    
    // 添加到页面
    document.body.appendChild(alertBox);
    
    // 2秒后自动移除
    setTimeout(() => {
        if (alertBox.parentNode) {
            alertBox.parentNode.removeChild(alertBox);
        }
    }, 2000);
}