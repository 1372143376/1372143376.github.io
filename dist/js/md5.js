// MD5加密函数
function generateMD5() {
    const input = document.getElementById('md5-input').value;
    if (!input) {
        showAlert('请输入要加密的文本');
        return;
    }
    
    // 使用crypto-js库进行MD5加密
    try {
        const md5Hash = CryptoJS.MD5(input).toString();
        const md5HashUpper = md5Hash.toUpperCase();
        const md5Hash16 = md5Hash.substring(8, 24);
        const md5Hash16Upper = md5Hash16.toUpperCase();
        
        const resultDiv = document.getElementById('md5-result');
        if (resultDiv) {
            resultDiv.innerHTML = `
                <div class="result-item">
                    <div class="result-title">32位[大]:</div>
                    <div class="result-value">${md5HashUpper}</div>
                    <button class="copy-btn" onclick="copyToClipboard('${md5HashUpper}')">复制</button>
                </div>
                <div class="result-item">
                    <div class="result-title">32位[小]:</div>
                    <div class="result-value">${md5Hash}</div>
                    <button class="copy-btn" onclick="copyToClipboard('${md5Hash}')">复制</button>
                </div>
                <div class="result-item">
                    <div class="result-title">16位[大]:</div>
                    <div class="result-value">${md5Hash16Upper}</div>
                    <button class="copy-btn" onclick="copyToClipboard('${md5Hash16Upper}')">复制</button>
                </div>
                <div class="result-item">
                    <div class="result-title">16位[小]:</div>
                    <div class="result-value">${md5Hash16}</div>
                    <button class="copy-btn" onclick="copyToClipboard('${md5Hash16}')">复制</button>
                </div>
            `;
            resultDiv.style.display = 'block';
        } else {
            console.error('无法找到MD5结果区域');
        }
    } catch (error) {
        showAlert('加密过程中出现错误，请重试');
        console.error(error);
    }
}

// 清空输入和结果
function clearInput() {
    document.getElementById('md5-input').value = '';
    const resultDiv = document.getElementById('md5-result');
    if (resultDiv) {
        resultDiv.style.display = 'none';
        resultDiv.innerHTML = '';
    }
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
            showAlert('已复制到剪贴板: ' + text);
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