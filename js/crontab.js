// 模拟Crontab表达式执行时间工具

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 设置默认起始日期为今天
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    document.getElementById('start-date').value = dateString;
});

// 解析Crontab表达式并计算执行时间
function parseCronExpression() {
    const expression = document.getElementById('cron-expression').value.trim();
    const count = parseInt(document.getElementById('result-count').value) || 10;
    const startDateStr = document.getElementById('start-date').value;
    
    if (!expression) {
        showAlert('请输入Crontab表达式');
        return;
    }
    
    try {
        // 解析Crontab表达式
        const cronParts = expression.split(/\s+/);
        if (cronParts.length !== 5) {
            throw new Error('Crontab表达式格式不正确，应包含5个字段');
        }
        
        const [minute, hour, dayOfMonth, month, dayOfWeek] = cronParts;
        
        // 设置起始日期
        let startDate = new Date();
        if (startDateStr) {
            startDate = new Date(startDateStr);
        }
        startDate.setSeconds(0);
        startDate.setMilliseconds(0);
        
        // 计算执行时间
        const executionTimes = calculateExecutionTimes(
            minute, hour, dayOfMonth, month, dayOfWeek, 
            startDate, count
        );
        
        // 显示结果
        displayResults(executionTimes);
    } catch (error) {
        showAlert('解析出错: ' + error.message);
        console.error(error);
    }
}

// 计算执行时间
function calculateExecutionTimes(minute, hour, dayOfMonth, month, dayOfWeek, startDate, count) {
    const times = [];
    let currentDate = new Date(startDate);
    
    // 确保我们从下一个可能的执行时间开始
    currentDate.setMinutes(currentDate.getMinutes() + 1);
    
    while (times.length < count) {
        // 检查当前时间是否匹配Crontab表达式
        if (matchesCronExpression(currentDate, minute, hour, dayOfMonth, month, dayOfWeek)) {
            times.push(new Date(currentDate));
        }
        
        // 增加时间进行下一次检查
        // 为了效率，我们按分钟递增
        currentDate.setMinutes(currentDate.getMinutes() + 1);
        
        // 防止无限循环
        if (currentDate.getFullYear() > startDate.getFullYear() + 10) {
            break;
        }
    }
    
    return times;
}

// 检查日期是否匹配Crontab表达式
function matchesCronExpression(date, minute, hour, dayOfMonth, month, dayOfWeek) {
    return (
        matchesField(date.getMinutes(), minute, 0, 59) &&
        matchesField(date.getHours(), hour, 0, 23) &&
        matchesField(date.getDate(), dayOfMonth, 1, 31) &&
        matchesField(date.getMonth() + 1, month, 1, 12) &&
        matchesField(date.getDay(), dayOfWeek, 0, 6)
    );
}

// 检查字段是否匹配
function matchesField(value, expression, min, max) {
    // 处理通配符
    if (expression === '*') {
        return true;
    }
    
    // 处理除法表达式，如 */5
    if (expression.includes('/')) {
        const parts = expression.split('/');
        if (parts[0] === '*') {
            const divisor = parseInt(parts[1]);
            return value % divisor === 0;
        } else {
            // 处理类似 1-10/2 的表达式
            const rangeParts = parts[0].split('-');
            const start = parseInt(rangeParts[0]);
            const end = rangeParts.length > 1 ? parseInt(rangeParts[1]) : start;
            const divisor = parseInt(parts[1]);
            
            for (let i = start; i <= end; i += divisor) {
                if (value === i) {
                    return true;
                }
            }
            return false;
        }
    }
    
    // 处理范围表达式，如 1-5
    if (expression.includes('-')) {
        const parts = expression.split('-');
        const start = parseInt(parts[0]);
        const end = parseInt(parts[1]);
        return value >= start && value <= end;
    }
    
    // 处理列表表达式，如 1,2,3
    if (expression.includes(',')) {
        const values = expression.split(',').map(v => parseInt(v));
        return values.includes(value);
    }
    
    // 处理单个值
    return value === parseInt(expression);
}

// 显示结果
function displayResults(executionTimes) {
    const resultDiv = document.getElementById('crontab-result');
    if (!resultDiv) return;
    
    if (executionTimes.length === 0) {
        resultDiv.innerHTML = '<p>未找到匹配的执行时间</p>';
        resultDiv.style.display = 'block';
        return;
    }
    
    let html = `
        <div class="result-item">
            <div class="result-title">以下是最近 ${executionTimes.length} 次执行时间：</div>
            <div class="result-list">
    `;
    
    executionTimes.forEach((time, index) => {
        // 格式化时间显示
        const formattedTime = formatDateTime(time);
        html += `<div class="result-item">${index + 1}. ${formattedTime}</div>`;
    });
    
    html += `
            </div>
            <button class="copy-btn" onclick="copyToClipboard(\`${executionTimes.map((time, index) => 
                `${index + 1}. ${formatDateTime(time)}`).join('\\n')}\`)">复制结果</button>
        </div>
    `;
    
    resultDiv.innerHTML = html;
    resultDiv.style.display = 'block';
}

// 格式化日期时间显示
function formatDateTime(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
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
    document.getElementById('cron-expression').value = '';
    document.getElementById('result-count').value = '10';
    
    // 重置起始日期为今天
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    document.getElementById('start-date').value = dateString;
    
    const resultDiv = document.getElementById('crontab-result');
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