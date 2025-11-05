// 通用语言切换功能
(function() {
    // 创建语言切换按钮
    function createLanguageSwitcher() {
        // 检查是否已经存在语言切换器
        if (document.querySelector('.language-switcher')) {
            return;
        }
        
        const header = document.querySelector('header');
        if (!header) {
            // 如果header不存在，等待一下再试
            setTimeout(createLanguageSwitcher, 100);
            return;
        }
        
        // 创建语言切换容器
        const switcher = document.createElement('div');
        switcher.className = 'language-switcher';
        switcher.innerHTML = `
            <button id="lang-zh" class="active">中文</button>
            <button id="lang-en">English</button>
        `;
        
        // 插入到header（确保header存在且已挂载到DOM）
        try {
            // 再次检查header是否存在且有parentNode
            if (header && header.parentNode) {
                header.style.position = 'relative';
                header.insertBefore(switcher, header.firstChild);
            } else {
                // 如果header还没挂载，等待一下再试
                setTimeout(createLanguageSwitcher, 100);
                return;
            }
        } catch (e) {
            console.error('Error creating language switcher:', e);
            setTimeout(createLanguageSwitcher, 100);
            return;
        }
        
        // 绑定按钮事件（等待i18n加载）
        bindLanguageButtons(switcher);
        
        // 更新按钮状态
        updateLanguageButtons();
        
        // 监听语言切换事件
        window.addEventListener('languageChanged', updateLanguageButtons);
    }
    
    // 绑定语言切换按钮事件
    function bindLanguageButtons(switcher) {
        const zhBtn = switcher.querySelector('#lang-zh');
        const enBtn = switcher.querySelector('#lang-en');
        
        if (zhBtn) {
            zhBtn.addEventListener('click', function() {
                if (typeof i18n !== 'undefined') {
                    i18n.setLanguage('zh');
                } else {
                    // 如果i18n还没加载，等待一下再试
                    setTimeout(function() {
                        if (typeof i18n !== 'undefined') {
                            i18n.setLanguage('zh');
                        }
                    }, 100);
                }
            });
        }
        
        if (enBtn) {
            enBtn.addEventListener('click', function() {
                if (typeof i18n !== 'undefined') {
                    i18n.setLanguage('en');
                } else {
                    // 如果i18n还没加载，等待一下再试
                    setTimeout(function() {
                        if (typeof i18n !== 'undefined') {
                            i18n.setLanguage('en');
                        }
                    }, 100);
                }
            });
        }
    }
    
    // 更新语言切换按钮状态
    function updateLanguageButtons() {
        if (typeof i18n === 'undefined') {
            return;
        }
        const lang = i18n.currentLang;
        const zhBtn = document.getElementById('lang-zh');
        const enBtn = document.getElementById('lang-en');
        if (zhBtn) zhBtn.classList.toggle('active', lang === 'zh');
        if (enBtn) enBtn.classList.toggle('active', lang === 'en');
    }
    
    // 初始化 - 等待i18n加载完成
    function init() {
        if (typeof i18n === 'undefined') {
            // 如果i18n还没加载，等待一下再试（最多等待3秒）
            if (typeof init.attempts === 'undefined') {
                init.attempts = 0;
            }
            init.attempts++;
            if (init.attempts < 60) { // 最多尝试60次，约3秒
                setTimeout(init, 50);
            }
            return;
        }
        
        // 确保i18n已经初始化，并且从localStorage读取最新语言设置
        const savedLang = localStorage.getItem('language');
        if (savedLang && (savedLang === 'zh' || savedLang === 'en')) {
            i18n.currentLang = savedLang;
        } else if (!i18n.currentLang) {
            i18n.currentLang = 'zh';
        }
        
        createLanguageSwitcher();
    }
    
    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            // DOM加载完成后，等待一下确保i18n.js已经执行
            setTimeout(init, 200);
        });
    } else {
        // DOM已经加载完成，等待一下确保i18n.js已经执行
        setTimeout(init, 200);
    }
    
    // 额外监听window.onload，确保页面完全加载后再初始化
    window.addEventListener('load', function() {
        if (typeof i18n !== 'undefined' && !document.querySelector('.language-switcher')) {
            init();
        }
    });
})();

