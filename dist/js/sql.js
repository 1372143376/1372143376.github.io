// SQL格式化功能
function formatSQL() {
    const inputSQL = document.getElementById('sql-input').value.trim();
    
    if (!inputSQL) {
        showAlert('请输入要格式化的SQL语句');
        return;
    }
    
    try {
        const formatted = formatSQLText(inputSQL);
        displayResult('格式化结果', formatted);
    } catch (error) {
        showAlert('格式化出错: ' + error.message);
        console.error(error);
    }
}

// SQL压缩功能
function compressSQL() {
    const inputSQL = document.getElementById('sql-input').value.trim();
    
    if (!inputSQL) {
        showAlert('请输入要压缩的SQL语句');
        return;
    }
    
    try {
        const compressed = compressSQLText(inputSQL);
        displayResult('压缩结果', compressed);
    } catch (error) {
        showAlert('压缩出错: ' + error.message);
        console.error(error);
    }
}

// SQL格式化实现
function formatSQLText(sql) {
    // 基本的SQL格式化实现
    let formatted = sql;
    
    // 移除多余的空格和换行
    formatted = formatted.replace(/\s+/g, ' ').trim();
    
    // 关键字大写
    const keywords = [
        'SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 
        'CREATE', 'DROP', 'ALTER', 'TABLE', 'INDEX', 'VIEW',
        'JOIN', 'INNER', 'LEFT', 'RIGHT', 'OUTER', 'ON',
        'GROUP', 'ORDER', 'BY', 'HAVING', 'LIMIT', 'OFFSET',
        'UNION', 'ALL', 'DISTINCT', 'AS', 'SET', 'VALUES',
        'AND', 'OR', 'NOT', 'IN', 'EXISTS', 'BETWEEN',
        'IS', 'NULL', 'LIKE', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END'
    ];
    
    // 将关键字转换为大写
    keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'gi');
        formatted = formatted.replace(regex, keyword);
    });
    
    // 添加换行和缩进
    formatted = formatted
        .replace(/(\b(SELECT|INSERT INTO|UPDATE|DELETE FROM|CREATE|DROP|ALTER)\b)/g, '\n$1')
        .replace(/(\b(FROM|WHERE|SET|VALUES|GROUP BY|ORDER BY|HAVING|LIMIT)\b)/g, '\n  $1')
        .replace(/(\b(LEFT|RIGHT|INNER|OUTER)?\s*JOIN\b)/g, '\n  $1')
        .replace(/(\b(AND|OR)\b)/g, '\n    $1')
        .replace(/;/g, ';\n')
        .replace(/\s*,\s*/g, ', ')
        .replace(/\s*=\s*/g, ' = ')
        .replace(/\s*>\s*/g, ' > ')
        .replace(/\s*<\s*/g, ' < ')
        .replace(/\s*>=\s*/g, ' >= ')
        .replace(/\s*<=\s*/g, ' <= ')
        .replace(/\s*<>\s*/g, ' <> ')
        .replace(/\s*!=\s*/g, ' != ');
    
    // 清理多余的空行
    formatted = formatted.replace(/\n\s*\n/g, '\n').trim();
    
    return formatted;
}

// SQL压缩实现
function compressSQLText(sql) {
    // 基本的SQL压缩实现
    let compressed = sql;
    
    // 移除注释
    compressed = compressed.replace(/--.*$/gm, ''); // 移除单行注释
    compressed = compressed.replace(/\/\*[\s\S]*?\*\//g, ''); // 移除多行注释
    
    // 移除多余的空格和换行
    compressed = compressed.replace(/\s+/g, ' ').trim();
    
    // 移除不必要的空格
    compressed = compressed
        .replace(/\s*([,;()])\s*/g, '$1')
        .replace(/\s*=\s*/g, '=')
        .replace(/\s*>\s*/g, '>')
        .replace(/\s*<\s*/g, '<')
        .replace(/\s*>=\s*/g, '>=')
        .replace(/\s*<=\s*/g, '<=')
        .replace(/\s*<>\s*/g, '<>')
        .replace(/\s*!=\s*/g, '!=');
    
    return compressed;
}

// 显示结果
function displayResult(title, result) {
    const resultDiv = document.getElementById('sql-result');
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
    document.getElementById('sql-input').value = '';
    const resultDiv = document.getElementById('sql-result');
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