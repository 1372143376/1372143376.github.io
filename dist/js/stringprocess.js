// 字符串文本处理工具

// Tab切换功能
document.addEventListener('DOMContentLoaded', function() {
    // 获取所有tab按钮和内容
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // 为每个tab按钮添加点击事件
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // 移除所有按钮的active类
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // 为当前按钮添加active类
            button.classList.add('active');
            
            // 隐藏所有tab内容
            tabContents.forEach(content => content.classList.remove('active'));
            // 显示当前tab内容
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // 初始化多行字符串批量截取功能
    initSubstringTool();
    
    // 为差异对比文本框添加实时监听事件
    const originalTextArea = document.getElementById('original-text');
    const modifiedTextArea = document.getElementById('modified-text');
    
    if (originalTextArea && modifiedTextArea) {
        originalTextArea.addEventListener('input', processDiff);
        modifiedTextArea.addEventListener('input', processDiff);
    }
});

// 初始化多行字符串批量截取功能
function initSubstringTool() {
    // 可以在这里添加初始化代码
    console.log('多行字符串批量截取功能已初始化');
}

// 处理多行字符串批量按索引截取
function processSubstring() {
    // 获取输入文本
    const inputText = document.getElementById('input-text').value;
    if (!inputText.trim()) {
        showAlert('请输入要处理的文本');
        return;
    }
    
    // 获取截取参数
    const startPosition = parseInt(document.getElementById('start-position').value) || 0;
    const endPositionInput = document.getElementById('end-position').value;
    const substringLengthInput = document.getElementById('substring-length').value;
    
    // 正确处理结束位置和截取长度
    const endPosition = endPositionInput !== '' ? parseInt(endPositionInput) : null;
    const substringLength = substringLengthInput !== '' ? parseInt(substringLengthInput) : null;
    
    const positionType = document.getElementById('position-type').value;
    
    // 按行分割文本
    const lines = inputText.split('\n');
    const results = [];
    
    // 处理每一行
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.trim() === '') {
            results.push(''); // 保持空行
            continue;
        }
        
        let result;
        if (positionType === 'character') {
            // 按字符截取
            if (substringLength !== null && !isNaN(substringLength)) {
                // 如果指定了截取长度，优先使用
                result = line.substring(startPosition, startPosition + substringLength);
            } else if (endPosition !== null && !isNaN(endPosition)) {
                // 如果指定了结束位置
                result = line.substring(startPosition, endPosition);
            } else {
                // 默认情况，从起始位置截取到末尾
                result = line.substring(startPosition);
            }
        } else {
            // 按字节截取（简单处理，实际UTF-8编码可能更复杂）
            const encoder = new TextEncoder();
            const decoder = new TextDecoder();
            const bytes = encoder.encode(line);
            
            let startByte = Math.max(0, startPosition); // 确保起始位置不为负
            let endByte;
            
            if (substringLength !== null && !isNaN(substringLength)) {
                // 如果指定了截取长度
                endByte = Math.min(startByte + substringLength, bytes.length);
            } else if (endPosition !== null && !isNaN(endPosition)) {
                // 如果指定了结束位置
                endByte = Math.min(endPosition, bytes.length);
            } else {
                // 默认情况，从起始位置截取到末尾
                endByte = bytes.length;
            }
            
            // 确保起始位置不大于结束位置
            startByte = Math.min(startByte, endByte);
            
            const subBytes = bytes.slice(startByte, endByte);
            result = decoder.decode(subBytes);
        }
        
        results.push(result);
    }
    
    // 显示结果
    displaySubstringResult(results, 'substring-result');
}

// 处理多行字符串批量按文本截取
function processTextSubstring() {
    // 获取输入文本
    const inputText = document.getElementById('text-input-text').value;
    if (!inputText.trim()) {
        showAlert('请输入要处理的文本');
        return;
    }
    
    // 获取截取参数
    const startText = document.getElementById('start-text').value;
    const endText = document.getElementById('end-text').value;
    const includeStart = document.getElementById('include-start').value === 'true';
    const includeEnd = document.getElementById('include-end').value === 'true';
    
    // 按行分割文本
    const lines = inputText.split('\n');
    const results = [];
    
    // 处理每一行
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.trim() === '') {
            results.push(''); // 保持空行
            continue;
        }
        
        let result = line;
        
        // 查找起始文本位置
        let startIndex = 0;
        if (startText) {
            startIndex = line.indexOf(startText);
            if (startIndex === -1) {
                // 如果没找到起始文本，返回空字符串
                results.push('');
                continue;
            }
            
            // 根据是否包含起始文本来调整起始位置
            if (!includeStart) {
                startIndex += startText.length;
            }
        }
        
        // 查找结束文本位置
        let endIndex = line.length;
        if (endText) {
            // 从起始位置之后查找结束文本
            const endTextIndex = line.indexOf(endText, startIndex + (includeStart && startText ? startText.length : 0));
            if (endTextIndex === -1) {
                // 如果没找到结束文本，截取到末尾
                endIndex = line.length;
            } else {
                // 根据是否包含结束文本来调整结束位置
                endIndex = endTextIndex;
                if (includeEnd) {
                    endIndex += endText.length;
                }
            }
        }
        
        // 确保起始位置不大于结束位置
        if (startIndex > endIndex) {
            results.push('');
            continue;
        }
        
        // 截取文本
        result = line.substring(startIndex, endIndex);
        results.push(result);
    }
    
    // 显示结果
    displaySubstringResult(results, 'text-substring-result');
}

// 处理多行文本正则替换
function processRegexReplace() {
    // 获取输入文本
    const inputText = document.getElementById('regex-input-text').value;
    if (!inputText.trim()) {
        showAlert('请输入要处理的文本');
        return;
    }
    
    // 获取替换参数
    const enableReplace = document.getElementById('enable-replace').checked;
    const searchText = document.getElementById('search-text').value;
    const replaceText = document.getElementById('replace-text').value;
    
    // 按行分割文本
    const lines = inputText.split('\n');
    const results = [];
    
    // 处理每一行
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (line.trim() === '') {
            results.push(''); // 保持空行
            continue;
        }
        
        // 如果启用替换功能
        if (enableReplace && searchText) {
            try {
                // 使用正则表达式进行替换（全局替换）
                const regex = new RegExp(searchText, 'g');
                line = line.replace(regex, replaceText);
            } catch (e) {
                // 如果正则表达式无效，使用普通字符串替换
                line = line.split(searchText).join(replaceText);
            }
        }
        
        results.push(line);
    }
    
    // 显示结果
    displaySubstringResult(results, 'regex-result');
}

// 添加后缀功能
function addSuffix() {
    const suffixText = document.getElementById('suffix-text').value;
    const resultElement = document.getElementById('regex-result');
    
    if (!suffixText) {
        showAlert('请输入后缀文本');
        return;
    }
    
    if (!resultElement || resultElement.style.display === 'none') {
        showAlert('请先执行正则替换操作');
        return;
    }
    
    // 获取当前结果显示的文本
    const resultValueElement = resultElement.querySelector('.result-value');
    if (!resultValueElement) {
        showAlert('无法找到结果内容');
        return;
    }
    
    // 获取当前结果文本
    const currentText = resultValueElement.textContent;
    
    // 按行分割文本
    const lines = currentText.split('\n');
    const results = [];
    
    // 为每一行添加后缀
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.trim() === '') {
            results.push(''); // 保持空行
            continue;
        }
        
        results.push(line + suffixText);
    }
    
    // 更新结果显示
    displaySubstringResult(results, 'regex-result');
    
    showAlert('已添加后缀');
}

// 处理在线文本列表批量添加行号
function processLineNumber() {
    // 获取输入文本
    const inputText = document.getElementById('line-number-input-text').value;
    if (!inputText.trim()) {
        showAlert('请输入要处理的文本');
        return;
    }
    
    // 获取行号参数
    const startNumber = parseInt(document.getElementById('line-number-start').value) || 1;
    const separator = document.getElementById('line-number-separator').value || '. ';
    const skipEmpty = document.getElementById('line-number-skip-empty').value === 'true';
    
    // 按行分割文本
    const lines = inputText.split('\n');
    const results = [];
    
    let lineNumber = startNumber;
    
    // 处理每一行
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // 如果跳过空行且当前行为空，则跳过
        if (skipEmpty && line.trim() === '') {
            results.push(''); // 保持空行位置
            continue;
        }
        
        // 添加行号
        if (line.trim() === '') {
            results.push(''); // 保持空行
        } else {
            results.push(lineNumber + separator + line);
            lineNumber++;
        }
    }
    
    // 显示结果
    displaySubstringResult(results, 'line-number-result');
}

// 处理循环生成字符串
function processLoopString() {
    // 获取输入文本
    const inputText = document.getElementById('loop-input-text').value;
    if (!inputText.trim()) {
        showAlert('请输入要处理的文本');
        return;
    }
    
    // 获取循环次数
    const loopCount = parseInt(document.getElementById('loop-count').value) || 10;
    
    // 计算文本中有多少个%d占位符
    const placeholderCount = (inputText.match(/%d/g) || []).length;
    
    if (placeholderCount === 0) {
        showAlert('文本中没有找到%d占位符');
        return;
    }
    
    const results = [];
    
    // 循环生成字符串
    for (let i = 0; i < loopCount; i++) {
        // 使用sprintf方式替换占位符，所有占位符都使用相同的值i
        let result = inputText;
        for (let j = 0; j < placeholderCount; j++) {
            // 每次替换第一个出现的%d
            result = result.replace('%d', i);
        }
        
        results.push(result);
    }
    
    // 显示结果
    displaySubstringResult(results, 'loop-string-result');
}

// 处理文本字符串批量替换
function processBatchReplace() {
    // 获取输入文本
    const inputText = document.getElementById('batch-replace-input-text').value;
    if (!inputText.trim()) {
        showAlert('请输入要处理的文本');
        return;
    }
    
    // 获取替换参数
    const searchString = document.getElementById('search-string').value;
    const replaceString = document.getElementById('replace-string').value;
    const replaceMode = document.getElementById('replace-mode').value;
    const caseSensitive = document.getElementById('case-sensitive').value === 'true';
    
    if (!searchString) {
        showAlert('请输入要查找的文本');
        return;
    }
    
    // 按行分割文本
    const lines = inputText.split('\n');
    const results = [];
    
    // 处理每一行
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (line.trim() === '') {
            results.push(''); // 保持空行
            continue;
        }
        
        // 根据替换模式进行处理
        if (replaceMode === 'regex') {
            try {
                // 使用正则表达式进行替换
                const flags = caseSensitive ? 'g' : 'gi';
                const regex = new RegExp(searchString, flags);
                line = line.replace(regex, replaceString);
            } catch (e) {
                showAlert('正则表达式格式错误: ' + e.message);
                return;
            }
        } else {
            // 普通文本替换
            if (caseSensitive) {
                // 大小写敏感替换
                line = line.split(searchString).join(replaceString);
            } else {
                // 大小写不敏感替换
                const regex = new RegExp(searchString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
                line = line.replace(regex, replaceString);
            }
        }
        
        results.push(line);
    }
    
    // 显示结果
    displaySubstringResult(results, 'batch-replace-result');
}

// 处理文本代码差异对比
function processDiff() {
    // 获取输入文本
    const originalText = document.getElementById('original-text').value;
    const modifiedText = document.getElementById('modified-text').value;
    
    // 获取对比参数
    const diffMode = document.getElementById('diff-mode') ? document.getElementById('diff-mode').value : 'line';
    const ignoreWhitespace = document.getElementById('ignore-whitespace') ? document.getElementById('ignore-whitespace').value === 'true' : false;
    
    // 根据对比模式处理文本
    let originalLines, modifiedLines;
    
    if (ignoreWhitespace) {
        // 如果忽略空白字符，先去除空白字符
        originalLines = originalText.split('\n').map(line => line.trim()).filter(line => line !== '');
        modifiedLines = modifiedText.split('\n').map(line => line.trim()).filter(line => line !== '');
    } else {
        originalLines = originalText.split('\n');
        modifiedLines = modifiedText.split('\n');
    }
    
    // 生成差异结果
    const diffResult = generateSideBySideDiffResult(originalLines, modifiedLines);
    
    // 显示结果
    displaySideBySideDiffResult(diffResult);
}

// 生成并排差异结果
function generateSideBySideDiffResult(originalLines, modifiedLines) {
    const result = {
        original: [],
        modified: []
    };
    
    // 简单的行对比实现
    const maxLines = Math.max(originalLines.length, modifiedLines.length);
    
    // 创建一个简单的差异对比算法
    const diffLines = [];
    
    // 这里我们使用一个简化的算法来对比两组行
    // 在实际应用中，可以使用更复杂的算法如 Myers diff algorithm
    let i = 0, j = 0;
    
    while (i < originalLines.length || j < modifiedLines.length) {
        const originalLine = i < originalLines.length ? originalLines[i] : null;
        const modifiedLine = j < modifiedLines.length ? modifiedLines[j] : null;
        
        if (originalLine === modifiedLine) {
            // 没有变化的行
            diffLines.push({
                type: 'unchanged',
                original: originalLine,
                modified: modifiedLine,
                originalIndex: i,
                modifiedIndex: j
            });
            i++;
            j++;
        } else if (originalLine === null) {
            // 新增的行
            diffLines.push({
                type: 'added',
                original: null,
                modified: modifiedLine,
                originalIndex: null,
                modifiedIndex: j
            });
            j++;
        } else if (modifiedLine === null) {
            // 删除的行
            diffLines.push({
                type: 'removed',
                original: originalLine,
                modified: null,
                originalIndex: i,
                modifiedIndex: null
            });
            i++;
        } else {
            // 检查是否是修改的行
            // 这里我们简化处理，认为不同的行就是修改的行
            diffLines.push({
                type: 'changed',
                original: originalLine,
                modified: modifiedLine,
                originalIndex: i,
                modifiedIndex: j
            });
            i++;
            j++;
        }
    }
    
    // 格式化结果用于显示
    for (const diff of diffLines) {
        switch (diff.type) {
            case 'unchanged':
                result.original.push({
                    content: diff.original,
                    type: 'unchanged'
                });
                result.modified.push({
                    content: diff.modified,
                    type: 'unchanged'
                });
                break;
            case 'added':
                result.original.push({
                    content: '',
                    type: 'empty'
                });
                result.modified.push({
                    content: diff.modified,
                    type: 'added'
                });
                break;
            case 'removed':
                result.original.push({
                    content: diff.original,
                    type: 'removed'
                });
                result.modified.push({
                    content: '',
                    type: 'empty'
                });
                break;
            case 'changed':
                result.original.push({
                    content: diff.original,
                    type: 'removed'
                });
                result.modified.push({
                    content: diff.modified,
                    type: 'added'
                });
                break;
        }
    }
    
    return result;
}

// 显示并排差异结果
function displaySideBySideDiffResult(diffResult) {
    // 获取结果容器
    const originalResultElement = document.getElementById('original-diff-result');
    const modifiedResultElement = document.getElementById('modified-diff-result');
    
    if (!originalResultElement || !modifiedResultElement) {
        return;
    }
    
    // 构建原始文本结果
    let originalHTML = '';
    for (let i = 0; i < diffResult.original.length; i++) {
        const line = diffResult.original[i];
        const lineClass = `diff-line diff-line-${line.type}`;
        originalHTML += `<div class="${lineClass}">${line.content || '&nbsp;'}</div>`;
    }
    
    // 构建修改后文本结果
    let modifiedHTML = '';
    for (let i = 0; i < diffResult.modified.length; i++) {
        const line = diffResult.modified[i];
        const lineClass = `diff-line diff-line-${line.type}`;
        modifiedHTML += `<div class="${lineClass}">${line.content || '&nbsp;'}</div>`;
    }
    
    // 显示结果
    originalResultElement.innerHTML = originalHTML;
    modifiedResultElement.innerHTML = modifiedHTML;
}

// 显示差异结果 (保留原有函数以兼容其他功能)
function displayDiffResult(diffResult) {
    // 转义特殊字符以避免HTML注入问题
    const escapedResultText = diffResult
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    
    // 添加颜色样式
    const styledResult = escapedResultText
        .replace(/^\+ .*/gm, '<span style="color: green;">$&</span>')
        .replace(/^- .*/gm, '<span style="color: red;">$&</span>')
        .replace(/^  .*/gm, '<span style="color: #333;">$&</span>');
    
    let resultHTML = `
        <div class="result-item">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <div class="result-title">差异对比结果:</div>
                <div>
                    <button class="copy-btn" onclick="copyToClipboard(\`${escapedResultText}\`)">复制</button>
                    <button class="copy-btn" onclick="downloadResult(\`${escapedResultText}\`, 'diff_result.txt')">下载</button>
                </div>
            </div>
            <div class="result-value" style="font-family: monospace; white-space: pre; background: #f8f8f8; padding: 15px; border-radius: 4px; border: 1px solid #eee;">
                ${styledResult}
            </div>
            <div style="margin-top: 10px; font-size: 14px; color: #666;">
                <div><span style="color: red;">-</span> 删除的行</div>
                <div><span style="color: green;">+</span> 新增的行</div>
                <div><span style="color: #333;">&nbsp;</span> 未变化的行</div>
            </div>
        </div>
    `;
    
    // 显示结果
    const resultElement = document.getElementById('diff-result');
    if (resultElement) {
        resultElement.innerHTML = resultHTML;
        resultElement.style.display = 'block'; // 确保结果显示
    }
}

// 显示截取结果 (修改现有函数以支持差异对比)
function displaySubstringResult(results, resultElementId) {
    const resultText = results.join('\n');
    
    // 转义特殊字符以避免HTML注入问题
    const escapedResultText = resultText
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    
    let resultHTML = `
        <div class="result-item">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <div class="result-title">处理结果:</div>
                <div>
                    <button class="copy-btn" onclick="copyToClipboard(\`${escapedResultText}\`)">复制</button>
                    <button class="copy-btn" onclick="downloadResult(\`${escapedResultText}\`, 'substring_result.txt')">下载</button>
                </div>
            </div>
            <div class="result-value">${escapedResultText}</div>
        </div>
    `;
    
    // 使用传入的元素ID
    const resultElement = document.getElementById(resultElementId);
    if (resultElement) {
        resultElement.innerHTML = resultHTML;
        resultElement.style.display = 'block'; // 确保结果显示
    }
}

// 复制到剪贴板功能（与其他页面保持一致）
function copyToClipboard(text) {
    // 使用现代剪贴板API（如果可用）
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showAlert('已复制到剪贴板');
        }).catch(err => {
            console.error('复制失败:', err);
            // 降级到传统方法
            fallbackCopyTextToClipboard(text);
        });
    } else {
        // 降级到传统方法
        fallbackCopyTextToClipboard(text);
    }
}

// 降级的复制方法
function fallbackCopyTextToClipboard(text) {
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

// 下载结果功能（与其他页面保持一致）
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

// 显示提示信息，2秒后自动关闭（与其他页面保持一致）
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

// 清空按索引截取输入
function clearSubstringInput() {
    document.getElementById('input-text').value = '';
    document.getElementById('start-position').value = '0';
    document.getElementById('end-position').value = '';
    document.getElementById('substring-length').value = '';
    const resultElement = document.getElementById('substring-result');
    if (resultElement) {
        resultElement.innerHTML = '';
        resultElement.style.display = 'none'; // 隐藏结果区域
    }
}

// 清空按文本截取输入
function clearTextSubstringInput() {
    document.getElementById('text-input-text').value = '';
    document.getElementById('start-text').value = '';
    document.getElementById('end-text').value = '';
    document.getElementById('include-start').value = 'false';
    document.getElementById('include-end').value = 'false';
    const resultElement = document.getElementById('text-substring-result');
    if (resultElement) {
        resultElement.innerHTML = '';
        resultElement.style.display = 'none'; // 隐藏结果区域
    }
}

// 清空正则替换输入
function clearRegexInput() {
    document.getElementById('regex-input-text').value = '';
    document.getElementById('enable-replace').checked = true;
    document.getElementById('search-text').value = '';
    document.getElementById('replace-text').value = '';
    document.getElementById('suffix-text').value = '';
    const resultElement = document.getElementById('regex-result');
    if (resultElement) {
        resultElement.innerHTML = '';
        resultElement.style.display = 'none'; // 隐藏结果区域
    }
}

// 清空行号输入
function clearLineNumberInput() {
    document.getElementById('line-number-input-text').value = '';
    document.getElementById('line-number-start').value = '1';
    document.getElementById('line-number-separator').value = '. ';
    document.getElementById('line-number-skip-empty').value = 'true';
    const resultElement = document.getElementById('line-number-result');
    if (resultElement) {
        resultElement.innerHTML = '';
        resultElement.style.display = 'none'; // 隐藏结果区域
    }
}

// 清空循环生成字符串输入
function clearLoopStringInput() {
    document.getElementById('loop-input-text').value = '';
    document.getElementById('loop-count').value = '10';
    const resultElement = document.getElementById('loop-string-result');
    if (resultElement) {
        resultElement.innerHTML = '';
        resultElement.style.display = 'none'; // 隐藏结果区域
    }
}

// 清空文本字符串批量替换输入
function clearBatchReplaceInput() {
    document.getElementById('batch-replace-input-text').value = '';
    document.getElementById('search-string').value = '';
    document.getElementById('replace-string').value = '';
    document.getElementById('replace-mode').value = 'normal';
    document.getElementById('case-sensitive').value = 'true';
    const resultElement = document.getElementById('batch-replace-result');
    if (resultElement) {
        resultElement.innerHTML = '';
        resultElement.style.display = 'none'; // 隐藏结果区域
    }
}

// 清空文本代码差异对比输入
function clearDiffInput() {
    document.getElementById('original-text').value = '';
    document.getElementById('modified-text').value = '';
    if (document.getElementById('diff-mode')) {
        document.getElementById('diff-mode').value = 'line';
    }
    if (document.getElementById('ignore-whitespace')) {
        document.getElementById('ignore-whitespace').value = 'false';
    }
    
    // 清空结果区域
    const originalResultElement = document.getElementById('original-diff-result');
    const modifiedResultElement = document.getElementById('modified-diff-result');
    
    if (originalResultElement) {
        originalResultElement.innerHTML = '';
    }
    
    if (modifiedResultElement) {
        modifiedResultElement.innerHTML = '';
    }
}