// URL编码功能
function encodeURItext() {
    const inputText = document.getElementById('input-text').value.trim();
    
    if (!inputText) {
        showAlert('请输入要编码的文本');
        return;
    }
    
    try {
        const encoded = encodeURI(inputText);
        displayResult('encodeURI编码结果', encoded);
    } catch (error) {
        showAlert('编码出错: ' + error.message);
        console.error(error);
    }
}

// encodeURIComponent编码功能
function encodeURIComponentText() {
    const inputText = document.getElementById('input-text').value.trim();
    
    if (!inputText) {
        showAlert('请输入要编码的文本');
        return;
    }
    
    try {
        const encoded = encodeURIComponent(inputText);
        displayResult('encodeURIComponent编码结果', encoded);
    } catch (error) {
        showAlert('编码出错: ' + error.message);
        console.error(error);
    }
}

// URL解码功能
function decodeURItext() {
    const inputText = document.getElementById('input-text').value.trim();
    
    if (!inputText) {
        showAlert('请输入要解码的文本');
        return;
    }
    
    try {
        const decoded = decodeURI(inputText);
        displayResult('decodeURI解码结果', decoded);
    } catch (error) {
        showAlert('解码出错: ' + error.message);
        console.error(error);
    }
}

// decodeURIComponent解码功能
function decodeURIComponentText() {
    const inputText = document.getElementById('input-text').value.trim();
    
    if (!inputText) {
        showAlert('请输入要解码的文本');
        return;
    }
    
    try {
        const decoded = decodeURIComponent(inputText);
        displayResult('decodeURIComponent解码结果', decoded);
    } catch (error) {
        showAlert('解码出错: ' + error.message);
        console.error(error);
    }
}

// 显示结果
function displayResult(title, result) {
    const resultDiv = document.getElementById('urlencode-result');
    if (resultDiv) {
        resultDiv.innerHTML = `
            <div class="result-item">
                <div class="result-title">${title}：</div>
                <div class="result-value">${result}</div>
                <button class="copy-btn" onclick="copyToClipboard('${result.replace(/'/g, "\\'")}')">复制</button>
            </div>
        `;
        resultDiv.style.display = 'block';
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

// 清空输入和结果
function clearInput() {
    document.getElementById('input-text').value = '';
    const resultDiv = document.getElementById('urlencode-result');
    if (resultDiv) {
        resultDiv.style.display = 'none';
        resultDiv.innerHTML = '';
    }
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