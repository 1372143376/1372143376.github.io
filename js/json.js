// 存储当前结果的全局变量
let currentResults = {
    original: null,
    formatted: ''
};

// 格式化JSON
function formatJSON() {
    const input = document.getElementById('json-input').value;
    if (!input) {
        showAlert('请输入要格式化的JSON文本');
        return;
    }
    
    try {
        // 解析JSON
        const parsed = JSON.parse(input);
        currentResults.original = parsed; // 保存原始解析结果
        
        // 格式化JSON（默认展开）
        const formatted = JSON.stringify(parsed, null, 4);
        currentResults.formatted = formatted;
        
        const resultDiv = document.getElementById('json-result');
        if (resultDiv) {
            resultDiv.innerHTML = `
                <div class="result-item">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <div class="result-title">格式化结果:</div>
                        <div>
                            <button class="copy-btn" onclick="copyToClipboard(currentResults.formatted)" style="margin-right: 5px; padding: 5px 10px; font-size: 0.9rem;">复制</button>
                            <button class="copy-btn" onclick="downloadResult(currentResults.formatted, 'formatted.json')" style="padding: 5px 10px; font-size: 0.9rem;">下载</button>
                            <button class="copy-btn" onclick="compressJSON()" style="margin-left: 5px; padding: 5px 10px; font-size: 0.9rem;">压缩</button>
                        </div>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <button class="copy-btn" onclick="collapseJSON(1)" style="margin-right: 3px; padding: 3px 6px; font-size: 0.8rem;">折叠1级</button>
                        <button class="copy-btn" onclick="collapseJSON(2)" style="margin-right: 3px; padding: 3px 6px; font-size: 0.8rem;">折叠2级</button>
                        <button class="copy-btn" onclick="collapseJSON(3)" style="margin-right: 3px; padding: 3px 6px; font-size: 0.8rem;">折叠3级</button>
                        <button class="copy-btn" onclick="collapseJSON(4)" style="margin-right: 3px; padding: 3px 6px; font-size: 0.8rem;">折叠4级</button>
                        <button class="copy-btn" onclick="collapseJSON(5)" style="margin-right: 3px; padding: 3px 6px; font-size: 0.8rem;">折叠5级</button>
                        <button class="copy-btn" onclick="collapseJSON(6)" style="margin-right: 3px; padding: 3px 6px; font-size: 0.8rem;">折叠6级</button>
                        <button class="copy-btn" onclick="collapseJSON(7)" style="margin-right: 3px; padding: 3px 6px; font-size: 0.8rem;">折叠7级</button>
                        <button class="copy-btn" onclick="formatJSON()" style="padding: 3px 6px; font-size: 0.8rem;">展开</button>
                    </div>
                    <div class="result-value">${formatted}</div>
                </div>
            `;
            resultDiv.style.display = 'block';
        } else {
            console.error('无法找到结果区域');
        }
    } catch (error) {
        showAlert('JSON格式错误: ' + error.message);
        console.error(error);
    }
}

// 压缩JSON
function compressJSON() {
    const input = document.getElementById('json-input').value;
    if (!input) {
        showAlert('请输入要压缩的JSON文本');
        return;
    }
    
    try {
        // 解析JSON
        const parsed = JSON.parse(input);
        
        // 压缩JSON
        const compressed = JSON.stringify(parsed);
        currentResults.formatted = compressed;
        
        const resultDiv = document.getElementById('json-result');
        if (resultDiv) {
            resultDiv.innerHTML = `
                <div class="result-item">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <div class="result-title">压缩结果:</div>
                        <div>
                            <button class="copy-btn" onclick="copyToClipboard(currentResults.formatted)" style="margin-right: 5px; padding: 5px 10px; font-size: 0.9rem;">复制</button>
                            <button class="copy-btn" onclick="downloadResult(currentResults.formatted, 'compressed.json')" style="padding: 5px 10px; font-size: 0.9rem;">下载</button>
                            <button class="copy-btn" onclick="formatJSON()" style="margin-left: 5px; padding: 5px 10px; font-size: 0.9rem;">格式化</button>
                        </div>
                    </div>
                    <div class="result-value">${compressed}</div>
                </div>
            `;
            resultDiv.style.display = 'block';
        } else {
            console.error('无法找到结果区域');
        }
    } catch (error) {
        showAlert('JSON格式错误: ' + error.message);
        console.error(error);
    }
}

// JSON转键值对格式
function jsonToKeyValue() {
    const input = document.getElementById('json-input').value;
    if (!input) {
        showAlert('请输入要转换的JSON文本');
        return;
    }
    
    try {
        // 解析JSON
        const parsed = JSON.parse(input);
        
        // 转换为键值对格式
        const keyValueString = convertToKeyValue(parsed);
        currentResults.formatted = keyValueString;
        
        const resultDiv = document.getElementById('json-result');
        if (resultDiv) {
            resultDiv.innerHTML = `
                <div class="result-item">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <div class="result-title">键值对格式:</div>
                        <div>
                            <button class="copy-btn" onclick="copyToClipboard(currentResults.formatted)" style="margin-right: 5px; padding: 5px 10px; font-size: 0.9rem;">复制</button>
                            <button class="copy-btn" onclick="downloadResult(currentResults.formatted, 'keyvalue.txt')" style="padding: 5px 10px; font-size: 0.9rem;">下载</button>
                            <button class="copy-btn" onclick="formatJSON()" style="margin-left: 5px; padding: 5px 10px; font-size: 0.9rem;">格式化</button>
                        </div>
                    </div>
                    <div class="result-value">${keyValueString}</div>
                </div>
            `;
            resultDiv.style.display = 'block';
        } else {
            console.error('无法找到结果区域');
        }
    } catch (error) {
        showAlert('JSON格式错误: ' + error.message);
        console.error(error);
    }
}

// 递归转换对象为键值对格式
function convertToKeyValue(obj, prefix = '') {
    let result = '';
    
    if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
        // 处理对象
        const keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = obj[key];
            const newPrefix = prefix ? `${prefix}[${key}]` : key;
            
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                // 嵌套对象
                result += convertToKeyValue(value, newPrefix);
            } else if (Array.isArray(value)) {
                // 数组处理
                for (let j = 0; j < value.length; j++) {
                    const arrayItem = value[j];
                    const arrayPrefix = `${newPrefix}[${j}]`;
                    
                    if (typeof arrayItem === 'object' && arrayItem !== null) {
                        result += convertToKeyValue(arrayItem, arrayPrefix);
                    } else {
                        result += `${arrayPrefix}=${encodeURIComponent(arrayItem)}&`;
                    }
                }
            } else {
                // 基本类型值
                result += `${newPrefix}=${encodeURIComponent(value)}&`;
            }
        }
    } else {
        // 直接是基本类型值
        result += `${prefix}=${encodeURIComponent(obj)}&`;
    }
    
    // 移除末尾的&符号
    if (result.endsWith('&')) {
        result = result.slice(0, -1);
    }
    
    return result;
}

// 折叠JSON到指定级别 - 正确实现折叠功能
function collapseJSON(level) {
    if (!currentResults.original) {
        showAlert('请先格式化JSON');
        return;
    }
    
    try {
        // 使用自定义函数实现真正的折叠功能
        const collapsed = collapseJSONObject(currentResults.original, level);
        currentResults.formatted = collapsed;
        
        // 重新构建整个结果区域，保持按钮和布局
        const resultDiv = document.getElementById('json-result');
        if (resultDiv) {
            resultDiv.innerHTML = `
                <div class="result-item">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <div class="result-title">格式化结果:</div>
                        <div>
                            <button class="copy-btn" onclick="copyToClipboard(currentResults.formatted)" style="margin-right: 5px; padding: 5px 10px; font-size: 0.9rem;">复制</button>
                            <button class="copy-btn" onclick="downloadResult(currentResults.formatted, 'formatted.json')" style="padding: 5px 10px; font-size: 0.9rem;">下载</button>
                            <button class="copy-btn" onclick="compressJSON()" style="margin-left: 5px; padding: 5px 10px; font-size: 0.9rem;">压缩</button>
                        </div>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <button class="copy-btn" onclick="collapseJSON(1)" style="margin-right: 3px; padding: 3px 6px; font-size: 0.8rem;">折叠1级</button>
                        <button class="copy-btn" onclick="collapseJSON(2)" style="margin-right: 3px; padding: 3px 6px; font-size: 0.8rem;">折叠2级</button>
                        <button class="copy-btn" onclick="collapseJSON(3)" style="margin-right: 3px; padding: 3px 6px; font-size: 0.8rem;">折叠3级</button>
                        <button class="copy-btn" onclick="collapseJSON(4)" style="margin-right: 3px; padding: 3px 6px; font-size: 0.8rem;">折叠4级</button>
                        <button class="copy-btn" onclick="collapseJSON(5)" style="margin-right: 3px; padding: 3px 6px; font-size: 0.8rem;">折叠5级</button>
                        <button class="copy-btn" onclick="collapseJSON(6)" style="margin-right: 3px; padding: 3px 6px; font-size: 0.8rem;">折叠6级</button>
                        <button class="copy-btn" onclick="collapseJSON(7)" style="margin-right: 3px; padding: 3px 6px; font-size: 0.8rem;">折叠7级</button>
                        <button class="copy-btn" onclick="formatJSON()" style="padding: 3px 6px; font-size: 0.8rem;">展开</button>
                    </div>
                    <div class="result-value">${collapsed}</div>
                </div>
            `;
        }
        
        showAlert(`已折叠到${level}级`);
    } catch (error) {
        showAlert('折叠过程中出现错误: ' + error.message);
        console.error(error);
    }
}

// 递归折叠JSON对象到指定层级
function collapseJSONObject(obj, maxLevel, currentLevel = 1) {
    // 如果是基本类型，直接返回
    if (obj === null || typeof obj !== 'object') {
        return JSON.stringify(obj);
    }
    
    // 如果达到最大层级，折叠为占位符
    if (currentLevel >= maxLevel) {
        if (Array.isArray(obj)) {
            return '[...]';
        } else {
            return '{...}';
        }
    }
    
    // 递归处理对象或数组
    if (Array.isArray(obj)) {
        if (obj.length === 0) return '[]';
        const items = obj.map(item => collapseJSONObject(item, maxLevel, currentLevel + 1));
        return '[\n' + items.map(item => '    '.repeat(currentLevel) + item).join(',\n') + '\n' + '    '.repeat(currentLevel - 1) + ']';
    } else {
        const keys = Object.keys(obj);
        if (keys.length === 0) return '{}';
        const items = keys.map(key => {
            const value = obj[key];
            const collapsedValue = collapseJSONObject(value, maxLevel, currentLevel + 1);
            return '    '.repeat(currentLevel) + `"${key}": ${collapsedValue}`;
        });
        return '{\n' + items.join(',\n') + '\n' + '    '.repeat(currentLevel - 1) + '}';
    }
}

// 清空输入和结果
function clearInput() {
    document.getElementById('json-input').value = '';
    const resultDiv = document.getElementById('json-result');
    if (resultDiv) {
        resultDiv.style.display = 'none';
        resultDiv.innerHTML = '';
    }
    // 清空全局变量
    currentResults = {
        original: null,
        formatted: ''
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
    const blob = new Blob([text], { type: 'application/json' });
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