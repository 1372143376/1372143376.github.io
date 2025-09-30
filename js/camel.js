// 存储当前结果的全局变量
let currentResults = {
    camel: '',
    underlineLower: '',
    underlineUpper: ''
};

// 下划线转驼峰
function convertToCamel() {
    const input = document.getElementById('input-text').value;
    if (!input) {
        showAlert('请输入要转换的文本');
        return;
    }
    
    try {
        // 处理多行输入
        const lines = input.split('\n');
        const results = lines.map(line => {
            if (!line.trim()) return line; // 空行直接返回
            return line.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
        });
        
        const result = results.join('\n');
        currentResults.camel = result; // 保存结果到全局变量
        
        const resultDiv = document.getElementById('camel-result');
        if (resultDiv) {
            // 使用HTML编码避免特殊字符问题
            const encodedResult = result
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
            
            resultDiv.innerHTML = `
                <div class="result-item">
                    <div class="result-title">驼峰命名:</div>
                    <div class="result-value">${encodedResult}</div>
                    <button class="copy-btn" onclick="copyToClipboard(currentResults.camel)">复制</button>
                    <button class="copy-btn" onclick="downloadResult(currentResults.camel, 'camel_result.txt')" style="margin-left: 10px;">下载</button>
                </div>
            `;
            resultDiv.style.display = 'block';
        } else {
            console.error('无法找到结果区域');
        }
    } catch (error) {
        showAlert('转换过程中出现错误，请重试');
        console.error(error);
    }
}

// 驼峰转下划线
function convertToUnderline() {
    const input = document.getElementById('input-text').value;
    if (!input) {
        showAlert('请输入要转换的文本');
        return;
    }
    
    try {
        // 处理多行输入
        const lines = input.split('\n');
        const results = lines.map(line => {
            if (!line.trim()) return line; // 空行直接返回
            return line.replace(/([A-Z])/g, '_$1');
        });
        
        const resultLower = results.join('\n').toLowerCase();
        const resultUpper = results.join('\n').toUpperCase();
        
        // 保存结果到全局变量
        currentResults.underlineLower = resultLower;
        currentResults.underlineUpper = resultUpper;
        
        const resultDiv = document.getElementById('camel-result');
        if (resultDiv) {
            // 使用HTML编码避免特殊字符问题
            const encodedResultLower = resultLower
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
                
            const encodedResultUpper = resultUpper
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
            
            resultDiv.innerHTML = `
                <div class="result-item">
                    <div class="result-title">下划线小写:</div>
                    <div class="result-value">${encodedResultLower}</div>
                    <button class="copy-btn" onclick="copyToClipboard(currentResults.underlineLower)">复制</button>
                    <button class="copy-btn" onclick="downloadResult(currentResults.underlineLower, 'underline_lower_result.txt')" style="margin-left: 10px;">下载</button>
                </div>
                <div class="result-item">
                    <div class="result-title">下划线大写:</div>
                    <div class="result-value">${encodedResultUpper}</div>
                    <button class="copy-btn" onclick="copyToClipboard(currentResults.underlineUpper)">复制</button>
                    <button class="copy-btn" onclick="downloadResult(currentResults.underlineUpper, 'underline_upper_result.txt')" style="margin-left: 10px;">下载</button>
                </div>
            `;
            resultDiv.style.display = 'block';
        } else {
            console.error('无法找到结果区域');
        }
    } catch (error) {
        showAlert('转换过程中出现错误，请重试');
        console.error(error);
    }
}

// 清空输入和结果
function clearInput() {
    document.getElementById('input-text').value = '';
    const resultDiv = document.getElementById('camel-result');
    if (resultDiv) {
        resultDiv.style.display = 'none';
        resultDiv.innerHTML = '';
    }
    // 清空全局变量
    currentResults = {
        camel: '',
        underlineLower: '',
        underlineUpper: ''
    };
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

// 下载结果功能
function downloadResult(text, filename) {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // 清理
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 100);
    
    showAlert('结果已下载');
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