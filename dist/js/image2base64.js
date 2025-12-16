// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    
    // 点击上传区域触发文件选择
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // 文件选择事件
    fileInput.addEventListener('change', handleFileSelect);
    
    // 拖拽上传功能
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            handleFileSelect();
        }
    });
});

// 处理文件选择
function handleFileSelect() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    
    if (!file) return;
    
    if (!file.type.match('image.*')) {
        showAlert('请选择图片文件');
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const imageData = e.target.result;
        
        // 显示预览
        const previewImage = document.getElementById('previewImage');
        previewImage.src = imageData;
        document.getElementById('previewContainer').classList.remove('hidden');
        
        // 转换为Base64并显示结果
        convertToBase64(imageData, file);
    };
    
    reader.readAsDataURL(file);
}

// 转换为Base64并显示结果
function convertToBase64(imageData, file) {
    // 显示结果区域
    document.getElementById('results').classList.remove('hidden');
    
    // 显示Base64内容
    document.getElementById('base64Result').textContent = imageData;
    
    // 显示CSS使用方式，添加class标签
    const cssResult = `.test {\n    background-image: url("${imageData}");\n}`;
    document.getElementById('cssResult').textContent = cssResult;
    
    // 显示HTML使用方式
    const htmlResult = `<img src="${imageData}" alt="${file.name}">`;
    document.getElementById('htmlResult').textContent = htmlResult;
    
    // 保存文件名用于下载
    document.getElementById('previewImage').dataset.filename = file.name;
}

// Base64转图片功能
function base64ToImage() {
    const base64Input = document.getElementById('base64Input').value.trim();
    
    if (!base64Input) {
        showAlert('请输入Base64编码内容');
        return;
    }
    
    try {
        // 验证是否为有效的Base64图片数据
        if (!base64Input.startsWith('data:image/')) {
            // 如果不是完整的data URL，尝试添加默认的前缀
            if (base64Input.startsWith('/9j/') || base64Input.startsWith('iVBORw0KGgo')) {
                showAlert('请输入完整的Base64数据URL（包含data:image/前缀）');
                return;
            } else {
                showAlert('无效的Base64图片数据');
                return;
            }
        }
        
        const reversePreviewImage = document.getElementById('reversePreviewImage');
        reversePreviewImage.src = base64Input;
        document.getElementById('reversePreviewContainer').classList.remove('hidden');
        
        // 保存Base64数据用于下载
        reversePreviewImage.dataset.base64 = base64Input;
    } catch (error) {
        showAlert('转换失败：' + error.message);
    }
}

// 下载预览图片
function downloadPreviewImage() {
    const previewImage = document.getElementById('previewImage');
    const filename = previewImage.dataset.filename || 'image.png';
    
    // 创建临时下载链接
    const link = document.createElement('a');
    link.href = previewImage.src;
    link.download = filename;
    
    // 触发下载
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 下载Base64转图片的结果
function downloadReverseImage() {
    const reversePreviewImage = document.getElementById('reversePreviewImage');
    const base64Data = reversePreviewImage.dataset.base64;
    
    if (!base64Data) {
        showAlert('没有可下载的图片');
        return;
    }
    
    // 尝试从Base64数据中提取文件类型
    let filename = 'converted-image.png';
    try {
        // 从Base64数据中提取MIME类型
        const mimeType = base64Data.split(';')[0].split(':')[1];
        if (mimeType) {
            const extension = mimeType.split('/')[1];
            if (extension) {
                filename = `converted-image.${extension}`;
            }
        }
    } catch (e) {
        // 如果解析失败，使用默认文件名
        console.warn('无法解析文件类型，使用默认文件名');
    }
    
    // 创建临时下载链接
    const link = document.createElement('a');
    link.href = base64Data;
    link.download = filename;
    
    // 触发下载
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 复制Base64内容
function copyBase64() {
    const base64Content = document.getElementById('base64Result').textContent;
    copyToClipboard(base64Content);
}

// 复制CSS使用方式
function copyCSS() {
    const cssContent = document.getElementById('cssResult').textContent;
    copyToClipboard(cssContent);
}

// 复制HTML使用方式
function copyHTML() {
    const htmlContent = document.getElementById('htmlResult').textContent;
    copyToClipboard(htmlContent);
}

// 复制到剪贴板功能
function copyToClipboard(text) {
    // 创建一个临时文本区域
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // 避免滚动到底部
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showAlert('已复制到剪贴板');
        } else {
            showAlert('复制失败');
        }
    } catch (err) {
        showAlert('复制失败: ' + err);
    }
    
    document.body.removeChild(textArea);
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