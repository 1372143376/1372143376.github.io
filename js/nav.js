// 导航菜单交互功能
function initNavMenu() {
    // 如果已经存在导航菜单，则不重复创建
    if (document.querySelector('.nav-icon')) {
        return;
    }
    
    // 创建导航图标和菜单
    createNavMenu();
}

// 创建导航菜单
function createNavMenu() {
    // 获取当前页面的文件名
    const currentPage = window.location.pathname.split('/').pop();
    
    // 创建导航图标
    const navIcon = document.createElement('div');
    navIcon.className = 'nav-icon';
    
    // 创建工具菜单
    const toolsMenu = document.createElement('div');
    toolsMenu.className = 'tools-menu';
    
    // 根据当前页面调整链接
    let menuHTML = '<a href="../index.html">🏠 返回首页</a>';
    
    if (currentPage !== 'timestamp.html') {
        menuHTML += '<a href="timestamp.html">⏱️ 时间戳转换</a>';
    }
    
    if (currentPage !== 'md5.html') {
        menuHTML += '<a href="md5.html">🔐 MD5加密</a>';
    }
    
    if (currentPage !== 'camel.html') {
        menuHTML += '<a href="camel.html">🔤 下划线驼峰互转</a>';
    }
    
    if (currentPage !== 'json.html') {
        menuHTML += '<a href="json.html">📋 JSON格式化</a>';
    }
    
    if (currentPage !== 'calculator.html') {
        menuHTML += '<a href="calculator.html">🧮 高级计算器</a>';
    }
    
    if (currentPage !== 'urlencode.html') {
        menuHTML += '<a href="urlencode.html">🔗 URL编码解码</a>';
    }
    
    if (currentPage !== 'sql.html') {
        menuHTML += '<a href="sql.html">🗄️ SQL格式化</a>';
    }
    
    if (currentPage !== 'base64.html') {
        menuHTML += '<a href="base64.html">🔒 Base64加解密</a>';
    }
    
    if (currentPage !== 'json2any.html') {
        menuHTML += '<a href="json2any.html">🔄 Json2Any</a>';
    }
    
    if (currentPage !== 'curl.html') {
        menuHTML += '<a href="curl.html">🌐 curl转代码</a>';
    }
    
    if (currentPage !== 'image2base64.html') {
        menuHTML += '<a href="image2base64.html">🖼️ 图片转Base64</a>';
    }
    
    if (currentPage !== 'colorpicker.html') {
        menuHTML += '<a href="colorpicker.html">🎨 颜色拾取器</a>';
    }
    
    if (currentPage !== 'qr.html') {
        menuHTML += '<a href="qr.html">📱 二维码工具</a>';
    }
    
    if (currentPage !== 'stringprocess.html') {
        menuHTML += '<a href="stringprocess.html">✂️ 字符串文本处理</a>';
    }
    
    toolsMenu.innerHTML = menuHTML;
    
    // 添加到页面body
    document.body.appendChild(navIcon);
    document.body.appendChild(toolsMenu);
    
    // 绑定事件监听器
    bindNavEvents(navIcon, toolsMenu);
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
        
        navIcon.addEventListener('mouseleave', hideMenu);
        toolsMenu.addEventListener('mouseleave', hideMenu);
        
        // 鼠标进入菜单时取消隐藏
        toolsMenu.addEventListener('mouseenter', function() {
            clearTimeout(hideTimeout);
        });
    }
}

// 页面加载完成后初始化导航菜单
if (document.readyState === 'loading') {
    // 页面仍在加载中
    document.addEventListener('DOMContentLoaded', initNavMenu);
} else {
    // 页面已经加载完成
    initNavMenu();
}

// 如果DOMContentLoaded事件已经错过了，使用window.onload
window.addEventListener('load', function() {
    // 检查是否已经创建了导航菜单
    if (!document.querySelector('.nav-icon')) {
        initNavMenu();
    }
});