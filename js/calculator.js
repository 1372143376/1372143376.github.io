// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化时隐藏取余输入框
    document.getElementById('modulo-input').style.display = 'none';
});

// 显示取余输入框
function showModuloInput() {
    document.getElementById('modulo-input').style.display = 'block';
}

// 隐藏取余输入框
function hideModuloInput() {
    document.getElementById('modulo-input').style.display = 'none';
}

// 取余运算
function calculateModulo() {
    showModuloInput();
    
    const inputNumber = document.getElementById('input-number').value.trim();
    const divisor = document.getElementById('modulo-divisor').value.trim();
    
    if (!inputNumber) {
        showAlert('请输入被除数');
        return;
    }
    
    if (!divisor) {
        showAlert('请输入除数');
        return;
    }
    
    if (parseInt(divisor) === 0) {
        showAlert('除数不能为0');
        return;
    }
    
    try {
        const result = parseInt(inputNumber) % parseInt(divisor);
        const operationName = `${inputNumber} % ${divisor}`;
        displayResult(operationName, result);
    } catch (error) {
        showAlert('计算出错: ' + error.message);
        console.error(error);
    }
}

// 二进制转十进制
function calculateBinToDec() {
    hideModuloInput();
    
    const inputNumber = document.getElementById('input-number').value.trim();
    
    if (!inputNumber) {
        showAlert('请输入二进制数');
        return;
    }
    
    // 验证是否为有效的二进制数
    if (!/^[01]+$/.test(inputNumber)) {
        showAlert('请输入有效的二进制数（只包含0和1）');
        return;
    }
    
    try {
        const result = parseInt(inputNumber, 2);
        const operationName = `二进制 ${inputNumber} 转十进制`;
        displayResult(operationName, result);
    } catch (error) {
        showAlert('计算出错: ' + error.message);
        console.error(error);
    }
}

// 十进制转二进制
function calculateDecToBin() {
    hideModuloInput();
    
    const inputNumber = document.getElementById('input-number').value.trim();
    
    if (!inputNumber) {
        showAlert('请输入十进制数');
        return;
    }
    
    // 验证是否为有效的十进制数
    if (!/^-?\d+$/.test(inputNumber)) {
        showAlert('请输入有效的十进制数');
        return;
    }
    
    try {
        const result = parseInt(inputNumber).toString(2);
        const operationName = `十进制 ${inputNumber} 转二进制`;
        displayResult(operationName, result);
    } catch (error) {
        showAlert('计算出错: ' + error.message);
        console.error(error);
    }
}

// 十进制转十六进制
function calculateDecToHex() {
    hideModuloInput();
    
    const inputNumber = document.getElementById('input-number').value.trim();
    
    if (!inputNumber) {
        showAlert('请输入十进制数');
        return;
    }
    
    // 验证是否为有效的十进制数
    if (!/^-?\d+$/.test(inputNumber)) {
        showAlert('请输入有效的十进制数');
        return;
    }
    
    try {
        const result = parseInt(inputNumber).toString(16).toUpperCase();
        const operationName = `十进制 ${inputNumber} 转十六进制`;
        displayResult(operationName, result);
    } catch (error) {
        showAlert('计算出错: ' + error.message);
        console.error(error);
    }
}

// 十六进制转十进制
function calculateHexToDec() {
    hideModuloInput();
    
    const inputNumber = document.getElementById('input-number').value.trim();
    
    if (!inputNumber) {
        showAlert('请输入十六进制数');
        return;
    }
    
    // 验证是否为有效的十六进制数
    if (!/^[0-9A-Fa-f]+$/.test(inputNumber)) {
        showAlert('请输入有效的十六进制数（0-9, A-F）');
        return;
    }
    
    try {
        const result = parseInt(inputNumber, 16);
        const operationName = `十六进制 ${inputNumber.toUpperCase()} 转十进制`;
        displayResult(operationName, result);
    } catch (error) {
        showAlert('计算出错: ' + error.message);
        console.error(error);
    }
}

// 显示结果（不包含复制和下载按钮）
function displayResult(operationName, result) {
    const resultDiv = document.getElementById('calculator-result');
    if (resultDiv) {
        resultDiv.innerHTML = `
            <div class="result-item">
                <div class="result-title">${operationName} =</div>
                <div class="result-value">${result}</div>
            </div>
        `;
        resultDiv.style.display = 'block';
    }
}

// 清空输入和结果
function clearInput() {
    document.getElementById('input-number').value = '';
    document.getElementById('modulo-divisor').value = '';
    const resultDiv = document.getElementById('calculator-result');
    if (resultDiv) {
        resultDiv.style.display = 'none';
        resultDiv.innerHTML = '';
    }
    // 隐藏取余输入框
    hideModuloInput();
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