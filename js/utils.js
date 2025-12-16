/**
 * 公共工具函数库
 * 提供项目中通用的工具函数
 */

// 工具函数命名空间
const Utils = {
    /**
     * 显示提示信息
     * @param {string} message - 提示信息
     * @param {string} type - 提示类型：'success', 'error', 'info', 'warning'
     * @param {number} duration - 显示时长（毫秒），默认 2000
     */
    showAlert: function(message, type = 'info', duration = 2000) {
        // 移除已存在的提示框
        const existingAlert = document.querySelector('.utils-alert');
        if (existingAlert) {
            existingAlert.remove();
        }

        // 创建提示框元素
        const alertBox = document.createElement('div');
        alertBox.className = 'utils-alert';
        alertBox.textContent = message;
        
        // 根据类型设置样式
        const typeStyles = {
            success: {
                background: '#4caf50',
                color: 'white',
                icon: '✓'
            },
            error: {
                background: '#f44336',
                color: 'white',
                icon: '✕'
            },
            warning: {
                background: '#ff9800',
                color: 'white',
                icon: '⚠'
            },
            info: {
                background: '#2196f3',
                color: 'white',
                icon: 'ℹ'
            }
        };

        const style = typeStyles[type] || typeStyles.info;
        
        alertBox.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${style.background};
            color: ${style.color};
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-size: 14px;
            max-width: 400px;
            display: flex;
            align-items: center;
            gap: 8px;
            animation: slideInRight 0.3s ease-out;
        `;

        // 添加图标
        const icon = document.createElement('span');
        icon.textContent = style.icon;
        icon.style.fontWeight = 'bold';
        alertBox.insertBefore(icon, alertBox.firstChild);
        
        // 添加到页面
        document.body.appendChild(alertBox);
        
        // 自动移除
        setTimeout(() => {
            if (alertBox.parentNode) {
                alertBox.style.animation = 'slideOutRight 0.3s ease-out';
                setTimeout(() => {
                    if (alertBox.parentNode) {
                        alertBox.parentNode.removeChild(alertBox);
                    }
                }, 300);
            }
        }, duration);
    },

    /**
     * 复制文本到剪贴板
     * @param {string} text - 要复制的文本
     * @param {boolean} showAlert - 是否显示成功提示，默认 true
     * @returns {Promise<boolean>} 是否复制成功
     */
    copyToClipboard: async function(text, showAlert = true) {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
                if (showAlert) {
                    this.showAlert('已复制到剪贴板', 'success');
                }
                return true;
            } else {
                // 降级方案：使用传统方法
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                
                try {
                    const successful = document.execCommand('copy');
                    document.body.removeChild(textArea);
                    if (successful && showAlert) {
                        this.showAlert('已复制到剪贴板', 'success');
                    }
                    return successful;
                } catch (err) {
                    document.body.removeChild(textArea);
                    throw err;
                }
            }
        } catch (err) {
            console.error('复制失败:', err);
            if (showAlert) {
                this.showAlert('复制失败: ' + err.message, 'error');
            }
            return false;
        }
    },

    /**
     * 防抖函数
     * @param {Function} func - 要防抖的函数
     * @param {number} wait - 等待时间（毫秒）
     * @returns {Function} 防抖后的函数
     */
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * 节流函数
     * @param {Function} func - 要节流的函数
     * @param {number} limit - 时间限制（毫秒）
     * @returns {Function} 节流后的函数
     */
    throttle: function(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * 格式化文件大小
     * @param {number} bytes - 字节数
     * @returns {string} 格式化后的文件大小
     */
    formatFileSize: function(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    },

    /**
     * 生成唯一 ID
     * @returns {string} 唯一 ID
     */
    generateId: function() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    /**
     * 安全的 JSON 解析
     * @param {string} jsonString - JSON 字符串
     * @param {*} defaultValue - 解析失败时的默认值
     * @returns {*} 解析后的对象或默认值
     */
    safeJsonParse: function(jsonString, defaultValue = null) {
        try {
            return JSON.parse(jsonString);
        } catch (e) {
            console.warn('JSON 解析失败:', e);
            return defaultValue;
        }
    },

    /**
     * 格式化日期时间
     * @param {Date|number} date - 日期对象或时间戳
     * @param {string} format - 格式字符串，默认 'YYYY-MM-DD HH:mm:ss'
     * @returns {string} 格式化后的日期字符串
     */
    formatDateTime: function(date, format = 'YYYY-MM-DD HH:mm:ss') {
        const d = date instanceof Date ? date : new Date(date);
        if (isNaN(d.getTime())) return '';

        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const seconds = String(d.getSeconds()).padStart(2, '0');

        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hours)
            .replace('mm', minutes)
            .replace('ss', seconds);
    },

    /**
     * 清空输入和结果
     * @param {string|Array<string>} inputIds - 输入框 ID 或 ID 数组
     * @param {string|Array<string>} resultIds - 结果容器 ID 或 ID 数组
     */
    clearInputs: function(inputIds, resultIds = []) {
        const ids = Array.isArray(inputIds) ? inputIds : [inputIds];
        ids.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.value = '';
            }
        });

        const resultIdsArray = Array.isArray(resultIds) ? resultIds : [resultIds];
        resultIdsArray.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = 'none';
                element.innerHTML = '';
            }
        });
    },

    /**
     * 显示结果
     * @param {string} containerId - 结果容器 ID
     * @param {string} title - 结果标题
     * @param {string} content - 结果内容
     * @param {boolean} showCopyBtn - 是否显示复制按钮，默认 true
     */
    displayResult: function(containerId, title, content, showCopyBtn = true) {
        const container = document.getElementById(containerId);
        if (!container) return;

        let html = `
            <div class="result-item">
                <div class="result-title">${title}：</div>
                <div class="result-value">${this.escapeHtml(content)}</div>
        `;

        if (showCopyBtn) {
            html += `
                <button class="copy-btn" onclick="Utils.copyToClipboard('${this.escapeJsString(content)}')">
                    ${typeof i18n !== 'undefined' ? i18n.t('copy') || '复制' : '复制'}
                </button>
            `;
        }

        html += '</div>';

        container.innerHTML = html;
        container.style.display = 'block';
    },

    /**
     * HTML 转义
     * @param {string} text - 要转义的文本
     * @returns {string} 转义后的文本
     */
    escapeHtml: function(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    /**
     * JavaScript 字符串转义（用于在 HTML 属性中使用）
     * @param {string} text - 要转义的文本
     * @returns {string} 转义后的文本
     */
    escapeJsString: function(text) {
        return String(text)
            .replace(/\\/g, '\\\\')
            .replace(/'/g, "\\'")
            .replace(/"/g, '\\"')
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r')
            .replace(/\t/g, '\\t');
    }
};

// 添加 CSS 动画样式（如果还没有）
if (!document.getElementById('utils-styles')) {
    const style = document.createElement('style');
    style.id = 'utils-styles';
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// 暴露到全局作用域
window.Utils = Utils;

