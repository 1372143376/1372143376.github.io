// 导航菜单交互功能
function initNavMenu() {
    // 如果已经存在导航菜单，则不重复创建
    if (document.querySelector('.nav-icon')) {
        return;
    }
    
    // 创建导航图标和菜单
    createNavMenu();
}

// 获取nav.js版本号的函数
function getNavJsVersion() {
    // 如果配置文件中定义了版本号，则使用配置文件中的版本号
    if (typeof TOOL_CONFIG !== 'undefined' && TOOL_CONFIG.NAV_JS_VERSION) {
        return TOOL_CONFIG.NAV_JS_VERSION;
    }
    // 默认版本号
    return '1.12';
}

// 创建导航菜单
function createNavMenu() {
    // 创建导航图标
    const navIcon = document.createElement('div');
    navIcon.className = 'nav-icon';
    
    // 创建工具菜单
    const toolsMenu = document.createElement('div');
    toolsMenu.className = 'tools-menu';
    
    // 更新菜单内容
    updateNavMenu(toolsMenu);
    
    // 添加到页面body
    document.body.appendChild(navIcon);
    document.body.appendChild(toolsMenu);
    
    // 绑定事件监听器
    bindNavEvents(navIcon, toolsMenu);
    
    // 监听语言切换事件，更新菜单
    window.addEventListener('languageChanged', function() {
        updateNavMenu(toolsMenu);
    });
}

// 更新导航菜单内容
function updateNavMenu(toolsMenu) {
    // 获取翻译函数（如果i18n已加载）
    const t = (typeof i18n !== 'undefined' && i18n.t) ? function(key) { return i18n.t(key); } : function(key) { return key; };
    
    // 构建菜单HTML - 包含所有工具，使用多语言支持
    let menuHTML = '<a href="/index.html" data-i18n="back-home-menu">🏠 返回首页</a>';
    
    menuHTML += '<a href="/tools/pdf.html" data-i18n="nav-pdf">📄 PDF工具</a>';
    menuHTML += '<a href="/tools/imageedit.html" data-i18n="nav-imageedit">🖼️ 编辑图片</a>';
    menuHTML += '<a href="/tools/timestamp.html" data-i18n="nav-timestamp">⏱️ 时间戳转换</a>';
    menuHTML += '<a href="/tools/md5.html" data-i18n="nav-md5">🔐 MD5加密</a>';
    menuHTML += '<a href="/tools/camel.html" data-i18n="nav-camel">🔤 下划线驼峰互转</a>';
    menuHTML += '<a href="/tools/json.html" data-i18n="nav-json">📋 JSON格式化</a>';
    menuHTML += '<a href="/tools/calculator.html" data-i18n="nav-calculator">🧮 高级计算器</a>';
    menuHTML += '<a href="/tools/urlencode.html" data-i18n="nav-urlencode">🔗 URL编码解码</a>';
    menuHTML += '<a href="/tools/sql.html" data-i18n="nav-sql">🗄️ SQL格式化</a>';
    menuHTML += '<a href="/tools/base64.html" data-i18n="nav-base64">🔒 Base64加解密</a>';
    menuHTML += '<a href="/tools/json2any.html" data-i18n="nav-json2any">🔄 Json2Any</a>';
    menuHTML += '<a href="/tools/curl.html" data-i18n="nav-curl">🌐 curl转代码</a>';
    menuHTML += '<a href="/tools/image2base64.html" data-i18n="nav-image2base64">🖼️ 图片转Base64</a>';
    menuHTML += '<a href="/tools/colorpicker.html" data-i18n="nav-colorpicker">🎨 颜色拾取器</a>';
    menuHTML += '<a href="/tools/qr.html" data-i18n="nav-qr">📱 二维码工具</a>';
    menuHTML += '<a href="/tools/stringprocess.html" data-i18n="nav-stringprocess">✂️ 字符串文本处理</a>';
    menuHTML += '<a href="/tools/crontab.html" data-i18n="nav-crontab">⏰ 模拟Crontab执行时间</a>';
    // 已隐藏：在线图片添加水印功能
    // menuHTML += '<a href="/tools/watermark.html" data-i18n="nav-watermark">💧 在线图片添加水印</a>';
    
    toolsMenu.innerHTML = menuHTML;
    
    // 更新所有链接的文本
    toolsMenu.querySelectorAll('[data-i18n]').forEach(function(link) {
        const key = link.getAttribute('data-i18n');
        link.textContent = t(key);
    });
}

// 绑定导航事件
function bindNavEvents(navIcon, toolsMenu) {
    if (navIcon && toolsMenu) {
        // 鼠标悬浮显示菜单
        navIcon.addEventListener('mouseenter', function() {
            toolsMenu.classList.add('show');
        });
        
        // 鼠标离开隐藏菜单
        let hideTimeout;
        const hideMenu = function() {
            hideTimeout = setTimeout(function() {
                toolsMenu.classList.remove('show');
            }, 300);
        };
        
        navIcon.addEventListener('mouseleave', hideTimeout);
        toolsMenu.addEventListener('mouseleave', hideMenu);
        
        // 鼠标进入菜单时取消隐藏
        toolsMenu.addEventListener('mouseenter', function() {
            clearTimeout(hideTimeout);
        });
    }
}

// 页面加载完成后初始化导航菜单
function initNavWhenReady() {
    // 确保body和header元素都已存在
    if (!document.body || !document.querySelector('header')) {
        setTimeout(initNavWhenReady, 50);
        return;
    }
    initNavMenu();
}

if (document.readyState === 'loading') {
    // 页面仍在加载中
    document.addEventListener('DOMContentLoaded', initNavWhenReady);
} else {
    // 页面已经加载完成，延迟一点确保所有元素都准备好
    setTimeout(initNavWhenReady, 100);
}

// 如果DOMContentLoaded事件已经错过了，使用window.onload
window.addEventListener('load', function() {
    // 检查是否已经创建了导航菜单
    if (!document.querySelector('.nav-icon')) {
        initNavWhenReady();
    }
});