// Base64编码功能
function encodeBase64() {
    const inputText = document.getElementById('input-text').value.trim();
    
    if (!inputText) {
        if (typeof Utils !== 'undefined') {
            Utils.showAlert('请输入要编码的文本', 'warning');
        } else {
            alert('请输入要编码的文本');
        }
        return;
    }
    
    try {
        const encoded = btoa(unescape(encodeURIComponent(inputText)));
        if (typeof Utils !== 'undefined') {
            Utils.displayResult('base64-result', 'Base64编码结果', encoded);
        } else {
            displayResult('Base64编码结果', encoded);
        }
    } catch (error) {
        if (typeof Utils !== 'undefined') {
            Utils.showAlert('编码出错: ' + error.message, 'error');
        } else {
            alert('编码出错: ' + error.message);
        }
        console.error(error);
    }
}

// Base64解码功能
function decodeBase64() {
    const inputText = document.getElementById('input-text').value.trim();
    
    if (!inputText) {
        if (typeof Utils !== 'undefined') {
            Utils.showAlert('请输入要解码的Base64文本', 'warning');
        } else {
            alert('请输入要解码的Base64文本');
        }
        return;
    }
    
    try {
        const decoded = decodeURIComponent(escape(atob(inputText)));
        if (typeof Utils !== 'undefined') {
            Utils.displayResult('base64-result', 'Base64解码结果', decoded);
        } else {
            displayResult('Base64解码结果', decoded);
        }
    } catch (error) {
        if (typeof Utils !== 'undefined') {
            Utils.showAlert('解码出错: ' + error.message, 'error');
        } else {
            alert('解码出错: ' + error.message);
        }
        console.error(error);
    }
}

// 显示结果（兼容旧代码）
function displayResult(title, result) {
    const resultDiv = document.getElementById('base64-result');
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

// 复制到剪贴板（兼容旧代码）
function copyToClipboard(text) {
    if (typeof Utils !== 'undefined') {
        Utils.copyToClipboard(text);
    } else {
        navigator.clipboard.writeText(text).then(() => {
            alert('已复制到剪贴板');
        }).catch(err => {
            alert('复制失败: ' + err);
        });
    }
}

// 清空输入和结果
function clearInput() {
    if (typeof Utils !== 'undefined') {
        Utils.clearInputs('input-text', 'base64-result');
    } else {
        document.getElementById('input-text').value = '';
        const resultDiv = document.getElementById('base64-result');
        if (resultDiv) {
            resultDiv.style.display = 'none';
            resultDiv.innerHTML = '';
        }
    }
}