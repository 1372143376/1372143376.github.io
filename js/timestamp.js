// 初始化日期时间输入框为当前时间
document.addEventListener('DOMContentLoaded', function() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    document.getElementById('datetime-input').value = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    
    // 同时显示当前时间戳
    const timestamp = Math.floor(now.getTime() / 1000);
    document.getElementById('timestamp-input').value = timestamp;
});

// 时间戳转换相关函数
function convertToTimestamp() {
    const datetimeInput = document.getElementById('datetime-input').value;
    if (!datetimeInput) {
        showAlert('请输入日期时间');
        return;
    }
    
    // 解析日期时间格式 "YYYY-MM-DD HH:MM:SS"
    const parts = datetimeInput.split(' ');
    if (parts.length !== 2) {
        showAlert('日期时间格式不正确，请使用格式: 2025-12-22 19:00:00');
        return;
    }
    
    const datePart = parts[0].split('-');
    const timePart = parts[1].split(':');
    
    if (datePart.length !== 3 || timePart.length !== 3) {
        showAlert('日期时间格式不正确，请使用格式: 2025-12-22 19:00:00');
        return;
    }
    
    const year = parseInt(datePart[0]);
    const month = parseInt(datePart[1]) - 1; // 月份从0开始
    const day = parseInt(datePart[2]);
    const hours = parseInt(timePart[0]);
    const minutes = parseInt(timePart[1]);
    const seconds = parseInt(timePart[2]);
    
    const date = new Date(year, month, day, hours, minutes, seconds);
    
    // 检查日期是否有效
    if (isNaN(date.getTime())) {
        showAlert('日期时间格式不正确，请检查输入');
        return;
    }
    
    const timestamp = Math.floor(date.getTime() / 1000);
    
    // 更新时间戳输入框
    const timestampInput = document.getElementById('timestamp-input');
    if (timestampInput) {
        timestampInput.value = timestamp;
        console.log('时间戳输入框已更新为:', timestamp);
    } else {
        console.error('无法找到时间戳输入框');
    }
    
    const resultDiv = document.getElementById('timestamp-result');
    if (resultDiv) {
        resultDiv.innerHTML = `
            <div class="result-item">
                <div class="result-title">时间戳（秒）:</div>
                <div class="result-value">${timestamp}</div>
                <button class="copy-btn" onclick="copyToClipboard('${timestamp}')">复制</button>
            </div>
            <div class="result-item">
                <div class="result-title">时间戳（毫秒）:</div>
                <div class="result-value">${date.getTime()}</div>
                <button class="copy-btn" onclick="copyToClipboard('${date.getTime()}')">复制</button>
            </div>
            <div class="result-item">
                <div class="result-title">对应时间:</div>
                <div class="result-value">${date.toLocaleString('zh-CN')}</div>
                <button class="copy-btn" onclick="copyToClipboard('${date.toLocaleString('zh-CN')}')">复制</button>
            </div>
        `;
        resultDiv.style.display = 'block';
    } else {
        console.error('无法找到结果区域');
    }
}

function convertToDatetime() {
    const timestampInput = document.getElementById('timestamp-input').value;
    if (!timestampInput) {
        showAlert('请输入时间戳');
        return;
    }
    
    const timestamp = parseInt(timestampInput);
    let date;
    
    // 判断是秒还是毫秒时间戳
    if (timestampInput.length === 10) {
        date = new Date(timestamp * 1000);
    } else if (timestampInput.length === 13) {
        date = new Date(timestamp);
    } else {
        showAlert('请输入有效的时间戳（10位或13位数字）');
        return;
    }
    
    // 检查日期是否有效
    if (isNaN(date.getTime())) {
        showAlert('时间戳无效，请检查输入');
        return;
    }
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    // 更新日期时间输入框
    const datetimeInput = document.getElementById('datetime-input');
    if (datetimeInput) {
        datetimeInput.value = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        console.log('日期时间输入框已更新为:', `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`);
    } else {
        console.error('无法找到日期时间输入框');
    }
    
    const resultDiv = document.getElementById('timestamp-result');
    if (resultDiv) {
        resultDiv.innerHTML = `
            <div class="result-item">
                <div class="result-title">日期时间:</div>
                <div class="result-value">${year}-${month}-${day} ${hours}:${minutes}:${seconds}</div>
                <button class="copy-btn" onclick="copyToClipboard('${year}-${month}-${day} ${hours}:${minutes}:${seconds}')">复制</button>
            </div>
            <div class="result-item">
                <div class="result-title">UTC时间:</div>
                <div class="result-value">${date.toISOString()}</div>
                <button class="copy-btn" onclick="copyToClipboard('${date.toISOString()}')">复制</button>
            </div>
            <div class="result-item">
                <div class="result-title">星期:</div>
                <div class="result-value">${getWeekday(date.getDay())}</div>
                <button class="copy-btn" onclick="copyToClipboard('${getWeekday(date.getDay())}')">复制</button>
            </div>
        `;
        resultDiv.style.display = 'block';
    } else {
        console.error('无法找到结果区域');
    }
}

function getWeekday(day) {
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    return weekdays[day];
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