// 二维码生成功能
function generateQR() {
    const inputText = document.getElementById('qr-text').value.trim();
    const size = parseInt(document.getElementById('qr-size').value);
    
    if (!inputText) {
        showAlert('请输入要生成二维码的文本内容');
        return;
    }
    
    try {
        // 获取结果容器
        const resultContainer = document.getElementById('qr-generate-result');
        if (!resultContainer) {
            showAlert('找不到结果显示区域');
            return;
        }
        
        // 清空之前的结果
        resultContainer.innerHTML = '';
        resultContainer.style.display = 'block';
        
        // 创建canvas元素
        const canvas = document.createElement('canvas');
        canvas.style.maxWidth = '100%';
        canvas.style.height = 'auto';
        
        // 使用QRious生成二维码
        const qr = new QRious({
            element: canvas,
            value: inputText,
            size: size
        });
        
        // 显示结果
        displayQRResult(canvas, inputText);
        
    } catch (error) {
        showAlert('生成二维码出错: ' + error.message);
        console.error(error);
    }
}

// 显示二维码生成结果
function displayQRResult(canvas, originalText) {
    const resultDiv = document.getElementById('qr-generate-result');
    if (resultDiv) {
        resultDiv.innerHTML = `
            <div class="result-item">
                <div class="result-title">生成的二维码：</div>
                <div class="qr-image-container">
                </div>
                <div class="qr-actions">
                    <button class="copy-btn" onclick="downloadQR('${originalText.replace(/'/g, "\\'")}')">下载图片</button>
                    <button class="copy-btn" onclick="copyQRText('${originalText.replace(/'/g, "\\'")}')">复制文本</button>
                </div>
            </div>
        `;
        
        // 将canvas添加到容器中
        resultDiv.querySelector('.qr-image-container').appendChild(canvas);
        resultDiv.style.display = 'block';
    }
}

// 下载二维码图片
function downloadQR(text) {
    const size = parseInt(document.getElementById('qr-size').value);
    
    try {
        // 创建canvas元素
        const canvas = document.createElement('canvas');
        
        // 使用QRious生成二维码
        const qr = new QRious({
            element: canvas,
            value: text,
            size: size
        });
        
        // 创建下载链接
        const link = document.createElement('a');
        link.download = 'qrcode.png';
        link.href = canvas.toDataURL();
        link.click();
        showAlert('二维码已下载');
        
    } catch (error) {
        showAlert('下载失败: ' + error.message);
    }
}

// 复制二维码文本
function copyQRText(text) {
    navigator.clipboard.writeText(text).then(() => {
        showAlert('文本已复制到剪贴板');
    }).catch(err => {
        showAlert('复制失败: ' + err);
    });
}

// 处理文件选择
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }
    
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
        showAlert('请选择图片文件');
        return;
    }
    
    // 使用FileReader读取文件
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageData = e.target.result;
        
        // 创建图片对象
        const img = new Image();
        img.onload = function() {
            // 创建canvas来处理图片
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            // 尝试解析二维码
            try {
                // 使用jsQR库解析二维码
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);
                
                if (code) {
                    displayDecodeResult(code.data);
                } else {
                    showAlert('未检测到二维码，请确保图片中包含清晰的二维码');
                }
            } catch (error) {
                showAlert('解析二维码失败: ' + error.message);
            }
        };
        img.onerror = function() {
            showAlert('图片加载失败');
        };
        img.src = imageData;
    };
    reader.onerror = function() {
        showAlert('文件读取失败');
    };
    reader.readAsDataURL(file);
}

// 显示解析结果
function displayDecodeResult(result) {
    const resultDiv = document.getElementById('qr-decode-result');
    if (resultDiv) {
        resultDiv.innerHTML = `
            <div class="result-item">
                <div class="result-title">解析结果：</div>
                <div class="result-value">${result}</div>
                <button class="copy-btn" onclick="copyToClipboard('${result.replace(/'/g, "\\'")}')">复制</button>
            </div>
        `;
        resultDiv.style.display = 'block';
    }
}

// 清空二维码生成输入
function clearQRInput() {
    document.getElementById('qr-text').value = '';
    const resultDiv = document.getElementById('qr-generate-result');
    if (resultDiv) {
        resultDiv.style.display = 'none';
        resultDiv.innerHTML = '';
    }
}

// 复制到剪贴板
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showAlert('已复制到剪贴板');
    }).catch(err => {
        showAlert('复制失败: ' + err);
    });
}

// 显示提示信息，2秒后自动关闭
function showAlert(message) {
    // 创建提示框元素
    const alertBox = document.createElement('div');
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

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 为文件输入添加事件监听器
    const fileInput = document.getElementById('qr-file');
    if (fileInput) {
        fileInput.addEventListener('change', function(event) {
            handleFileSelect(event);
        });
    }
    
    // 设置默认尺寸
    const sizeSelect = document.getElementById('qr-size');
    if (sizeSelect) {
        sizeSelect.value = '300';
    }
    
    // 设置默认示例文本
    const textInput = document.getElementById('qr-text');
    if (textInput) {
        textInput.value = 'https://www.example.com';
    }
});