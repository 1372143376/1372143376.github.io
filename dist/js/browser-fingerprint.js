// 浏览器指纹检测工具

// 常用字体列表
const commonFonts = [
    'Arial', 'Arial Black', 'Arial Narrow', 'Arial Rounded MT Bold',
    'Calibri', 'Cambria', 'Cambria Math', 'Comic Sans MS', 'Consolas',
    'Courier New', 'Georgia', 'Helvetica', 'Impact', 'Lucida Console',
    'Lucida Sans Unicode', 'Microsoft Sans Serif', 'Palatino Linotype',
    'Segoe UI', 'Tahoma', 'Times New Roman', 'Trebuchet MS', 'Verdana',
    'Webdings', 'Wingdings', 'MS Sans Serif', 'MS Serif', 'Symbol',
    'SimSun', 'SimHei', 'KaiTi', 'FangSong', 'Microsoft YaHei',
    'Hiragino Sans GB', 'PingFang SC', 'STHeiti', 'Apple LiGothic',
    'Apple LiSung', 'LiHei Pro', 'LiSong Pro', 'BiauKai', 'PMingLiU',
    'MingLiU', 'DFKai-SB', 'MS Gothic', 'MS Mincho', 'MS PGothic',
    'MS PMincho', 'Meiryo', 'Yu Gothic', 'Yu Mincho'
];

// 检测可用字体
function detectFonts() {
    const detectedFonts = [];
    const baseFonts = ['monospace', 'sans-serif', 'serif'];
    const testString = 'mmmmmmmmmmlli';
    const testSize = '72px';
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    // 获取基准字体宽度
    const baseWidths = {};
    baseFonts.forEach(baseFont => {
        context.font = testSize + ' ' + baseFont;
        baseWidths[baseFont] = context.measureText(testString).width;
    });
    
    // 检测字体
    commonFonts.forEach(font => {
        let isAvailable = false;
        
        baseFonts.forEach(baseFont => {
            const testFont = testSize + ' "' + font + '", ' + baseFont;
            context.font = testFont;
            const width = context.measureText(testString).width;
            
            if (width !== baseWidths[baseFont]) {
                isAvailable = true;
            }
        });
        
        if (isAvailable) {
            detectedFonts.push(font);
        }
    });
    
    return detectedFonts;
}

// 生成Canvas指纹
function generateCanvasFingerprint() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 200;
    canvas.height = 50;
    
    // 绘制一些文本和图形
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('Browser Fingerprint', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('Browser Fingerprint', 4, 17);
    
    return canvas.toDataURL();
}

// 生成Canvas哈希
function generateCanvasHash() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 200;
    canvas.height = 50;
    
    // 绘制复杂图形
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.textBaseline = 'alphabetic';
    
    // 绘制渐变背景
    const gradient = ctx.createLinearGradient(0, 0, 200, 50);
    gradient.addColorStop(0, 'red');
    gradient.addColorStop(1, 'blue');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 200, 50);
    
    // 绘制文本
    ctx.fillStyle = '#fff';
    ctx.fillText('Browser Fingerprint Hash', 10, 10);
    
    // 绘制几何图形
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.beginPath();
    ctx.arc(100, 25, 20, 0, Math.PI * 2);
    ctx.fill();
    
    return canvas.toDataURL();
}

// 简单的哈希函数
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // 转换为32位整数
    }
    return Math.abs(hash).toString(16);
}

// 检测浏览器指纹
function detectBrowserFingerprint() {
    try {
        // 基础信息
        document.getElementById('user-agent').textContent = navigator.userAgent;
        document.getElementById('language').textContent = navigator.language || 'unknown';
        document.getElementById('platform').textContent = navigator.platform || 'unknown';
        
        // 屏幕信息
        document.getElementById('screen-resolution').textContent = 
            `${screen.width} × ${screen.height}`;
        document.getElementById('color-depth').textContent = 
            `${screen.colorDepth}位`;
        
        // 时区信息
        const now = new Date();
        document.getElementById('timezone').textContent = 
            Intl.DateTimeFormat().resolvedOptions().timeZone;
        document.getElementById('timezone-offset').textContent = 
            `UTC${now.getTimezoneOffset() > 0 ? '-' : '+'}${Math.abs(now.getTimezoneOffset() / 60)}`;
        document.getElementById('date-time').textContent = 
            now.toLocaleString();
        
        // WebGL信息
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl) {
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                if (debugInfo) {
                    document.getElementById('webgl-renderer').textContent = 
                        gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                    document.getElementById('webgl-vendor').textContent = 
                        gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
                }
                document.getElementById('webgl-version').textContent = 
                    gl.getParameter(gl.VERSION);
            } else {
                document.getElementById('webgl-renderer').textContent = '不支持WebGL';
                document.getElementById('webgl-vendor').textContent = '不支持WebGL';
                document.getElementById('webgl-version').textContent = '不支持WebGL';
            }
        } catch (e) {
            document.getElementById('webgl-renderer').textContent = '检测失败';
            document.getElementById('webgl-vendor').textContent = '检测失败';
            document.getElementById('webgl-version').textContent = '检测失败';
        }
        
        // Canvas指纹
        try {
            const canvasFingerprint = generateCanvasFingerprint();
            const canvasHash = generateCanvasHash();
            
            document.getElementById('canvas-fingerprint').textContent = 
                canvasFingerprint.substring(0, 50) + '...';
            document.getElementById('canvas-hash').textContent = 
                simpleHash(canvasFingerprint);
        } catch (e) {
            document.getElementById('canvas-fingerprint').textContent = '检测失败';
            document.getElementById('canvas-hash').textContent = '检测失败';
        }
        
        // 字体信息
        try {
            const fonts = detectFonts();
            document.getElementById('fonts-list').textContent = 
                fonts.length > 0 ? fonts.slice(0, 5).join(', ') + (fonts.length > 5 ? '...' : '') : '无检测到字体';
            document.getElementById('fonts-count').textContent = 
                `${fonts.length}个字体`;
        } catch (e) {
            document.getElementById('fonts-list').textContent = '检测失败';
            document.getElementById('fonts-count').textContent = '检测失败';
        }
        
        // 插件信息
        try {
            const plugins = Array.from(navigator.plugins || []).map(p => p.name);
            document.getElementById('plugins-list').textContent = 
                plugins.length > 0 ? plugins.slice(0, 5).join(', ') + (plugins.length > 5 ? '...' : '') : '无插件';
            document.getElementById('plugins-count').textContent = 
                `${plugins.length}个插件`;
        } catch (e) {
            document.getElementById('plugins-list').textContent = '检测失败';
            document.getElementById('plugins-count').textContent = '检测失败';
        }
        
        // 显示结果区域
        document.getElementById('fingerprint-result').style.display = 'block';
        
        // 生成指纹哈希
        generateFingerprintHash();
        
    } catch (error) {
        console.error('检测浏览器指纹时出错:', error);
        alert('检测浏览器指纹时出错，请检查浏览器设置或重试。');
    }
}

// 生成指纹哈希
function generateFingerprintHash() {
    try {
        const fingerprintData = {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            screen: `${screen.width}x${screen.height}`,
            colorDepth: screen.colorDepth,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            timezoneOffset: new Date().getTimezoneOffset(),
            canvas: generateCanvasFingerprint(),
            webgl: getWebGLInfo(),
            fonts: detectFonts().length,
            plugins: Array.from(navigator.plugins || []).length
        };
        
        const fingerprintString = JSON.stringify(fingerprintData);
        const hash = simpleHash(fingerprintString);
        
        document.getElementById('fingerprint-hash').textContent = hash;
        
    } catch (error) {
        console.error('生成指纹哈希时出错:', error);
        document.getElementById('fingerprint-hash').textContent = '生成失败';
    }
}

// 获取WebGL信息
function getWebGLInfo() {
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                return {
                    renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
                    vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
                    version: gl.getParameter(gl.VERSION)
                };
            }
        }
    } catch (e) {
        // 忽略错误
    }
    return {};
}

// 复制所有信息到剪贴板
function copyAllInfo() {
    try {
        let allInfo = '浏览器指纹检测结果\\n\\n';
        
        // 收集所有信息
        const infoElements = document.querySelectorAll('.info-value');
        infoElements.forEach(element => {
            const label = element.previousElementSibling ? 
                element.previousElementSibling.textContent.replace(':', '') : '未知';
            allInfo += `${label}: ${element.textContent}\\n`;
        });
        
        allInfo += `\\n指纹哈希: ${document.getElementById('fingerprint-hash').textContent}`;
        
        // 复制到剪贴板
        navigator.clipboard.writeText(allInfo).then(() => {
            alert('所有信息已复制到剪贴板！');
        }).catch(err => {
            // 如果clipboard API不可用，使用传统方法
            const textArea = document.createElement('textarea');
            textArea.value = allInfo;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('所有信息已复制到剪贴板！');
        });
        
    } catch (error) {
        console.error('复制信息时出错:', error);
        alert('复制信息失败，请手动复制。');
    }
}

// 清空所有信息
function clearAll() {
    const infoElements = document.querySelectorAll('.info-value');
    infoElements.forEach(element => {
        element.textContent = '';
    });
    
    document.getElementById('fingerprint-hash').textContent = '';
    document.getElementById('fingerprint-result').style.display = 'none';
}

// 页面加载完成后自动检测
window.addEventListener('load', function() {
    // 可以在这里添加自动检测的逻辑
    // detectBrowserFingerprint(); // 取消注释可以自动检测
});