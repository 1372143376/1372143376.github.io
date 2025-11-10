/**
 * 按位运算计算器
 * 支持二进制、十进制、十六进制的位运算计算
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM元素
    const number1Input = document.getElementById('number1');
    const base1Select = document.getElementById('base1');
    const number2Input = document.getElementById('number2');
    const base2Select = document.getElementById('base2');
    const operatorSelect = document.getElementById('operator');
    const calculateBtn = document.getElementById('calculateBtn');
    const resetBtn = document.getElementById('resetBtn');
    
    // 结果显示元素
    const resultBinary = document.getElementById('resultBinary');
    const resultDecimal = document.getElementById('resultDecimal');
    const resultHex = document.getElementById('resultHex');
    const resultOctal = document.getElementById('resultOctal');
    const binaryVisual = document.getElementById('binaryVisual');
    
    // 错误信息元素
    const error1 = document.getElementById('error1');
    const error2 = document.getElementById('error2');
    
    // 初始化
    init();
    
    function init() {
        // 绑定事件
        calculateBtn.addEventListener('click', calculate);
        resetBtn.addEventListener('click', reset);
        
        // 输入框实时计算
        number1Input.addEventListener('input', validateInput);
        number2Input.addEventListener('input', validateInput);
        base1Select.addEventListener('change', validateInput);
        base2Select.addEventListener('change', validateInput);
        operatorSelect.addEventListener('change', validateInput);
        
        // 自动计算示例
        setTimeout(calculate, 100);
    }
    
    /**
     * 验证输入
     */
    function validateInput() {
        clearErrors();
        
        const num1 = number1Input.value.trim();
        const num2 = number2Input.value.trim();
        const base1 = parseInt(base1Select.value);
        const base2 = parseInt(base2Select.value);
        const operator = operatorSelect.value;
        
        let hasError = false;
        
        // 验证第一个数字
        if (num1 && !isValidNumber(num1, base1)) {
            error1.textContent = getErrorMessage(base1);
            number1Input.classList.add('input-error');
            hasError = true;
        }
        
        // 验证第二个数字（对于一元运算符，第二个数字可以为空）
        if (operator !== '~' && num2 && !isValidNumber(num2, base2)) {
            error2.textContent = getErrorMessage(base2);
            number2Input.classList.add('input-error');
            hasError = true;
        }
        
        // 如果输入有效，自动计算
        if (!hasError && num1 && (operator === '~' || num2)) {
            calculate();
        }
    }
    
    /**
     * 检查数字是否有效
     */
    function isValidNumber(num, base) {
        if (!num) return false;
        
        try {
            const value = parseInt(num, base);
            return !isNaN(value) && isFinite(value);
        } catch (e) {
            return false;
        }
    }
    
    /**
     * 获取错误消息
     */
    function getErrorMessage(base) {
        const baseNames = {
            2: '二进制',
            10: '十进制',
            16: '十六进制'
        };
        return `请输入有效的${baseNames[base]}数字`;
    }
    
    /**
     * 清除错误信息
     */
    function clearErrors() {
        error1.textContent = '';
        error2.textContent = '';
        number1Input.classList.remove('input-error');
        number2Input.classList.remove('input-error');
    }
    
    /**
     * 执行计算
     */
    function calculate() {
        clearErrors();
        
        const num1 = number1Input.value.trim();
        const num2 = number2Input.value.trim();
        const base1 = parseInt(base1Select.value);
        const base2 = parseInt(base2Select.value);
        const operator = operatorSelect.value;
        
        // 验证输入
        if (!num1) {
            error1.textContent = '请输入第一个数字';
            number1Input.classList.add('input-error');
            return;
        }
        
        if (operator !== '~' && !num2) {
            error2.textContent = '请输入第二个数字';
            number2Input.classList.add('input-error');
            return;
        }
        
        if (!isValidNumber(num1, base1)) {
            error1.textContent = getErrorMessage(base1);
            number1Input.classList.add('input-error');
            return;
        }
        
        if (operator !== '~' && !isValidNumber(num2, base2)) {
            error2.textContent = getErrorMessage(base2);
            number2Input.classList.add('input-error');
            return;
        }
        
        try {
            // 转换为十进制整数
            const value1 = parseInt(num1, base1);
            const value2 = operator !== '~' ? parseInt(num2, base2) : 0;
            
            // 执行位运算
            let result;
            switch (operator) {
                case '&':
                    result = value1 & value2;
                    break;
                case '|':
                    result = value1 | value2;
                    break;
                case '^':
                    result = value1 ^ value2;
                    break;
                case '~':
                    result = ~value1;
                    break;
                case '<<':
                    result = value1 << value2;
                    break;
                case '>>':
                    result = value1 >> value2;
                    break;
                default:
                    throw new Error('不支持的运算符');
            }
            
            // 转换为32位有符号整数
            result = result | 0;
            
            // 更新结果显示
            updateResults(result, value1, value2, operator);
            
        } catch (error) {
            console.error('计算错误:', error);
            resultBinary.textContent = '计算错误';
            resultDecimal.textContent = '计算错误';
            resultHex.textContent = '计算错误';
            resultOctal.textContent = '计算错误';
            binaryVisual.innerHTML = '<p style="text-align: center; color: #e74c3c;">计算过程中发生错误</p>';
        }
    }
    
    /**
     * 更新结果显示
     */
    function updateResults(result, value1, value2, operator) {
        // 转换为不同进制
        const binaryStr = toBinaryString(result);
        const decimalStr = result.toString(10);
        const hexStr = '0x' + result.toString(16).toUpperCase();
        const octalStr = '0' + result.toString(8);
        
        // 更新结果显示
        resultBinary.textContent = binaryStr;
        resultDecimal.textContent = decimalStr;
        resultHex.textContent = hexStr;
        resultOctal.textContent = octalStr;
        
        // 更新二进制可视化
        updateBinaryVisualization(result, value1, value2, operator);
    }
    
    /**
     * 转换为32位二进制字符串
     */
    function toBinaryString(num) {
        // 转换为32位有符号整数的二进制表示
        const binary = (num >>> 0).toString(2);
        // 补齐32位
        return '0b' + '0'.repeat(32 - binary.length) + binary;
    }
    
    /**
     * 更新二进制可视化
     */
    function updateBinaryVisualization(result, value1, value2, operator) {
        const resultBinary = (result >>> 0).toString(2).padStart(32, '0');
        const value1Binary = (value1 >>> 0).toString(2).padStart(32, '0');
        const value2Binary = (value2 >>> 0).toString(2).padStart(32, '0');
        
        let html = '';
        
        // 显示操作数（对于一元运算符只显示一个操作数）
        if (operator !== '~') {
            html += `<div class="binary-row">
                <span style="margin-right: 10px; font-weight: 600;">操作数1:</span>
                ${createBitVisualization(value1Binary)}
            </div>`;
            
            html += `<div class="binary-row">
                <span style="margin-right: 10px; font-weight: 600;">操作数2:</span>
                ${createBitVisualization(value2Binary)}
            </div>`;
        } else {
            html += `<div class="binary-row">
                <span style="margin-right: 10px; font-weight: 600;">操作数:</span>
                ${createBitVisualization(value1Binary)}
            </div>`;
        }
        
        // 显示运算符
        html += `<div class="binary-row" style="margin: 10px 0; color: #666; font-weight: 600;">
            ${getOperatorSymbol(operator)}
        </div>`;
        
        // 显示结果
        html += `<div class="binary-row">
            <span style="margin-right: 10px; font-weight: 600;">结果:</span>
            ${createBitVisualization(resultBinary)}
        </div>`;
        
        binaryVisual.innerHTML = html;
    }
    
    /**
     * 创建二进制位可视化
     */
    function createBitVisualization(binaryStr) {
        let bitsHtml = '';
        for (let i = 0; i < binaryStr.length; i++) {
            const bit = binaryStr[i];
            const bitClass = bit === '1' ? 'bit-1' : 'bit-0';
            bitsHtml += `<div class="bit ${bitClass}">${bit}</div>`;
        }
        return bitsHtml;
    }
    
    /**
     * 获取运算符符号
     */
    function getOperatorSymbol(operator) {
        const symbols = {
            '&': '按位与 (&)',
            '|': '按位或 (|)',
            '^': '按位异或 (^)',
            '~': '按位取反 (~)',
            '<<': '左移 (<<)',
            '>>': '右移 (>>)'
        };
        return symbols[operator] || operator;
    }
    
    /**
     * 重置计算器
     */
    function reset() {
        number1Input.value = '10';
        base1Select.value = '10';
        number2Input.value = '3';
        base2Select.value = '10';
        operatorSelect.value = '&';
        
        clearErrors();
        
        // 清空结果显示
        resultBinary.textContent = '-';
        resultDecimal.textContent = '-';
        resultHex.textContent = '-';
        resultOctal.textContent = '-';
        
        binaryVisual.innerHTML = '<p style="text-align: center; color: #666;" data-i18n="bitwise-binary-visual-desc">计算后显示二进制位可视化</p>';
    }
    
    // 国际化支持
    function updateTexts() {
        // 页面加载时更新文本
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const text = window.i18n ? window.i18n.t(key) : key;
            if (text && text !== key) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = text;
                } else {
                    element.textContent = text;
                }
            }
        });
    }
    
    // 监听语言切换
    if (typeof window !== 'undefined' && window.addEventListener) {
        window.addEventListener('languageChanged', updateTexts);
    }
    
    // 页面加载时执行一次国际化
    setTimeout(updateTexts, 100);
});