// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    const colorPicker = document.getElementById('colorPicker');
    const hexInput = document.getElementById('hexInput');
    const rgbInput = document.getElementById('rgbInput');
    const hslInput = document.getElementById('hslInput');
    const colorPreview = document.getElementById('colorPreview');
    
    // 初始化颜色显示
    updateColorDisplay(colorPicker.value);
    
    // 颜色选择器事件监听
    colorPicker.addEventListener('input', function() {
        updateColorDisplay(this.value);
    });
    
    // HEX输入框事件监听
    hexInput.addEventListener('input', function() {
        const hex = this.value.trim();
        if (isValidHex(hex)) {
            colorPicker.value = hex;
            updateColorDisplay(hex);
        }
    });
    
    // RGB输入框事件监听
    rgbInput.addEventListener('input', function() {
        const rgb = this.value.trim();
        const hex = rgbToHex(rgb);
        if (hex) {
            colorPicker.value = hex;
            hexInput.value = hex;
            updateColorDisplay(hex);
        }
    });
    
    // HSL输入框事件监听
    hslInput.addEventListener('input', function() {
        const hsl = this.value.trim();
        const hex = hslToHex(hsl);
        if (hex) {
            colorPicker.value = hex;
            hexInput.value = hex;
            updateColorDisplay(hex);
        }
    });
});

// 更新颜色显示
function updateColorDisplay(hex) {
    const colorPreview = document.getElementById('colorPreview');
    const hexResult = document.getElementById('hexResult');
    const rgbResult = document.getElementById('rgbResult');
    const hslResult = document.getElementById('hslResult');
    const cssResult = document.getElementById('cssResult');
    const hexInput = document.getElementById('hexInput');
    const rgbInput = document.getElementById('rgbInput');
    const hslInput = document.getElementById('hslInput');
    
    // 更新预览
    colorPreview.style.backgroundColor = hex;
    
    // 更新HEX显示
    hexInput.value = hex;
    hexResult.textContent = hex;
    
    // 转换为RGB并更新显示
    const rgb = hexToRgb(hex);
    const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    rgbInput.value = rgbString;
    rgbResult.textContent = rgbString;
    
    // 转换为HSL并更新显示
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const hslString = `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;
    hslInput.value = hslString;
    hslResult.textContent = hslString;
    
    // 更新CSS使用方式
    cssResult.textContent = `color: ${hex};`;
}

// 验证HEX颜色值
function isValidHex(hex) {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
}

// HEX转RGB
function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// RGB转HEX
function rgbToHex(rgbString) {
    const match = rgbString.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
    if (match) {
        const r = parseInt(match[1]);
        const g = parseInt(match[2]);
        const b = parseInt(match[3]);
        
        if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        }
    }
    return null;
}

// RGB转HSL
function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        
        h /= 6;
    }

    return {
        h: h * 360,
        s: s * 100,
        l: l * 100
    };
}

// HSL转RGB
function hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    
    let r, g, b;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

// HSL转HEX
function hslToHex(hslString) {
    const match = hslString.match(/hsl\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)%\s*,\s*(\d+(?:\.\d+)?)%\s*\)/i);
    if (match) {
        const h = parseFloat(match[1]);
        const s = parseFloat(match[2]);
        const l = parseFloat(match[3]);
        
        if (h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100) {
            const rgb = hslToRgb(h, s, l);
            return "#" + ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1);
        }
    }
    return null;
}

// 复制到剪贴板功能
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.textContent;
    
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