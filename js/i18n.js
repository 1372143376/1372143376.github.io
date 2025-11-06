// 多语言支持
const i18n = {
    currentLang: (function() {
        // 从localStorage读取语言设置，如果没有则默认为中文
        const savedLang = localStorage.getItem('language');
        return savedLang && (savedLang === 'zh' || savedLang === 'en') ? savedLang : 'zh';
    })(),
    
    translations: {
        zh: {
            // 首页
            'site-title': '在线工具箱',
            'site-subtitle': '实用工具集合，提高工作效率',
            'tool-timestamp': '时间戳转换',
            'tool-timestamp-desc': '日期时间与时间戳相互转换，支持多种格式',
            'tool-md5': 'MD5加密',
            'tool-md5-desc': '在线MD5加密工具，快速生成MD5哈希值',
            'tool-camel': '下划线驼峰互转',
            'tool-camel-desc': '下划线命名与驼峰命名相互转换',
            'tool-json': 'JSON格式化',
            'tool-json-desc': 'JSON格式化和压缩工具，支持键排序',
            'tool-calculator': '高级计算器',
            'tool-calculator-desc': '支持取余运算和进制转换',
            'tool-urlencode': 'URL编码解码',
            'tool-urlencode-desc': '支持encodeURI和encodeURIComponent编码解码',
            'tool-sql': 'SQL格式化',
            'tool-sql-desc': 'SQL语句格式化和压缩工具',
            'tool-base64': 'Base64加解密',
            'tool-base64-desc': 'Base64编码和解码工具',
            'tool-json2any': 'Json2Any',
            'tool-json2any-desc': 'JSON转Go结构体、Protobuf消息定义、PHP数组，YAML转Protobuf，SQL转GORM',
            'tool-curl': 'curl转代码',
            'tool-curl-desc': '将curl命令转换为多种编程语言的HTTP请求代码',
            'tool-image2base64': '图片转Base64',
            'tool-image2base64-desc': '将图片转换为Base64编码，支持CSS和HTML使用方式',
            'tool-colorpicker': '颜色拾取器',
            'tool-colorpicker-desc': '选择颜色并获取HEX、RGB、HSL等格式的颜色代码',
            'tool-qr': '二维码工具',
            'tool-qr-desc': '生成和解析二维码，支持文本转二维码和图片识别',
            'tool-stringprocess': '字符串文本处理',
            'tool-stringprocess-desc': '多行字符串批量按索引截取、按文本截取、正则替换和添加行号功能',
            'tool-crontab': '模拟Crontab执行时间',
            'tool-crontab-desc': '在线模拟Crontab表达式的执行时间，帮助判断表达式的正确性',
            'tool-watermark': '在线图片添加水印',
            'tool-watermark-desc': '给PNG、JPG、GIF图片添加文字水印，特别适合身份证、驾照、护照添加水印防盗用',
            'tool-pdf': 'PDF工具',
            'tool-pdf-desc': '丰富的PDF处理工具集合，支持合并、拆分、转换、编辑、签名等多种功能',
            'tool-imageedit': '编辑图片',
            'tool-imageedit-desc': '丰富的图片处理工具集合，支持压缩、调整大小、裁剪、转换、添加水印等多种功能',
            'tool-more': '更多工具',
            'tool-more-desc': '敬请期待更多实用工具',
            'footer-text': '© 在线工具箱 - 实用工具集合',
            'footer-contact': '联系我们',
            'contact-title': '联系我们',
            'contact-subtitle': '发消息、提问、获得解答、报告问题或提交建议',
            'contact-name': '姓名：',
            'contact-name-placeholder': '姓名',
            'contact-email': '电子邮件地址：',
            'contact-email-placeholder': '电子邮件地址',
            'contact-subject': '主题：',
            'contact-subject-placeholder': '主题',
            'contact-message': '消息：',
            'contact-message-placeholder': '我们如何可以帮助您？',
            'contact-submit': '提交',
            
            // 通用
            'back-home': '返回首页',
            'back-home-menu': '🏠 返回首页',
            
            // 导航菜单
            'nav-timestamp': '⏱️ 时间戳转换',
            'nav-md5': '🔐 MD5加密',
            'nav-camel': '🔤 下划线驼峰互转',
            'nav-json': '📋 JSON格式化',
            'nav-calculator': '🧮 高级计算器',
            'nav-urlencode': '🔗 URL编码解码',
            'nav-sql': '🗄️ SQL格式化',
            'nav-base64': '🔒 Base64加解密',
            'nav-json2any': '🔄 Json2Any',
            'nav-curl': '🌐 curl转代码',
            'nav-image2base64': '🖼️ 图片转Base64',
            'nav-colorpicker': '🎨 颜色拾取器',
            'nav-qr': '📱 二维码工具',
            'nav-stringprocess': '✂️ 字符串文本处理',
            'nav-crontab': '⏰ 模拟Crontab执行时间',
            'nav-watermark': '💧 在线图片添加水印',
            'nav-pdf': '📄 PDF工具',
            'nav-imageedit': '🖼️ 编辑图片',
            
            // 时间戳工具
            'timestamp-title': '时间戳转换工具',
            'timestamp-subtitle': '日期时间与时间戳相互转换',
            'timestamp-datetime': '日期时间：',
            'timestamp-datetime-placeholder': '格式: 2025-12-22 19:00:00',
            'timestamp-convert-to-ts': '转换为时间戳',
            'timestamp-ts': '时间戳：',
            'timestamp-ts-placeholder': '请输入时间戳',
            'timestamp-convert-to-dt': '转换为日期时间',
            'back-home-link': '← 返回工具箱首页',
            
            // MD5工具
            'md5-input-label': '输入文本：',
            'md5-input-placeholder': '请输入要加密的文本',
            'md5-generate': '生成MD5',
            'btn-clear': '清空',
            
            // JSON工具
            'json-input-label': '输入JSON文本：',
            'json-input-placeholder': '请输入要格式化的JSON文本',
            'json-format': '格式化JSON',
            'json-compress': '压缩JSON',
            'json-to-keyvalue': 'JSON转键值对',
            
            // Base64工具
            'base64-input-label': '输入文本：',
            'base64-input-placeholder': '请输入要编码或解码的文本',
            'base64-encode': 'Base64编码',
            'base64-decode': 'Base64解码',
            
            // Camel工具
            'camel-input-label': '输入文本：',
            'camel-input-placeholder': '请输入要转换的文本\n例如：hello_world 或 helloWorld',
            'camel-to-camel': '下划线转驼峰',
            'camel-to-underline': '驼峰转下划线',
            
            // 通用输入标签
            'input-text-label': '输入文本：',
            'input-label': '输入：',
            
            // 计算器工具
            'calculator-input-label': '输入数字：',
            'calculator-input-placeholder': '请输入数字',
            'calculator-modulo-divisor': '除数：',
            'calculator-modulo-divisor-placeholder': '请输入除数',
            'calculator-modulo': '取余运算',
            'calculator-bin-to-dec': '二进制转十进制',
            'calculator-dec-to-bin': '十进制转二进制',
            'calculator-dec-to-hex': '十进制转十六进制',
            'calculator-hex-to-dec': '十六进制转十进制',
            
            // URL编码工具
            'urlencode-note-title': '编码方式说明：',
            'urlencode-note-uri': 'encodeURI：不会对特殊符号编码，适用于完整URL编码',
            'urlencode-note-component': 'encodeURIComponent：会对特殊符号编码，适用于URL参数编码',
            'urlencode-encode-uri': 'encodeURI编码',
            'urlencode-encode-component': 'encodeURIComponent编码',
            'urlencode-decode-uri': 'decodeURI解码',
            'urlencode-decode-component': 'decodeURIComponent解码',
            
            // SQL工具
            'sql-input-label': '输入SQL语句：',
            'sql-input-placeholder': '请输入要格式化或压缩的SQL语句',
            'sql-format': '格式化SQL',
            'sql-compress': '压缩SQL',
            
            // Json2Any工具
            'json2any-input-label': '输入JSON、YAML或SQL：',
            'json2any-input-placeholder': '请输入要转换的JSON、YAML或SQL语句',
            'json2any-go': 'JSON转Go结构体',
            'json2any-protobuf': 'JSON转Protobuf',
            'json2any-php': 'JSON转PHP数组',
            'json2any-yaml-protobuf': 'YAML转Protobuf',
            'json2any-sql-gorm': 'SQL转GORM',
            
            // curl工具
            'curl-input-label': 'curl命令：',
            'curl-input-placeholder': '请输入curl命令，例如：curl -X GET https://www.baidu.com',
            'curl-language-label': '编程语言：',
            'curl-examples-label': '常用示例：',
            'curl-example-get': 'GET请求',
            'curl-example-post': 'POST请求',
            'curl-example-basic-auth': 'Basic Auth认证',
            'curl-example-wget': 'Wget示例',
            'curl-convert': '转换代码',
            
            // 二维码工具
            'qr-generate-title': '生成二维码',
            'qr-decode-title': '解析二维码',
            'qr-input-label': '输入内容：',
            'qr-input-placeholder': '请输入要生成二维码的文本内容',
            'qr-size-label': '二维码尺寸：',
            'qr-generate-btn': '生成二维码',
            'qr-upload-label': '上传二维码图片：',
            
            // 图片转Base64工具
            'image2base64-upload-title': '上传图片',
            'image2base64-upload-text': '点击或拖拽图片到此处',
            'image2base64-base64-title': 'Base64编码',
            'image2base64-css-title': 'CSS样式',
            'image2base64-html-title': 'HTML使用',
            'image2base64-copy-css': '复制CSS代码',
            'image2base64-copy-html': '复制HTML代码',
            'image2base64-copy-base64': '复制Base64代码',
            
            // 颜色拾取器
            'colorpicker-hex': 'HEX',
            'colorpicker-rgb': 'RGB',
            'colorpicker-hsl': 'HSL',
            'colorpicker-copy': '复制',
            'colorpicker-select-label': '选择颜色：',
            'colorpicker-color-picker-label': '颜色选择器：',
            'colorpicker-rgb-label': 'RGB值：',
            'colorpicker-hsl-label': 'HSL值：',
            'colorpicker-preview-label': '颜色预览：',
            'colorpicker-hex-format': 'HEX格式',
            'colorpicker-rgb-format': 'RGB格式',
            'colorpicker-hsl-format': 'HSL格式',
            'colorpicker-css-usage': 'CSS使用',
            'colorpicker-copy-hex': '复制HEX',
            'colorpicker-copy-rgb': '复制RGB',
            'colorpicker-copy-hsl': '复制HSL',
            'colorpicker-copy-css': '复制CSS',
            
            // 图片转Base64工具（完整）
            'image2base64-section-upload': '图片上传转Base64',
            'image2base64-upload-label': '上传图片：',
            'image2base64-upload-click': '点击选择图片或拖拽图片到此处',
            'image2base64-upload-formats': '支持 JPG、PNG、GIF 等常见图片格式',
            'image2base64-download-image': '下载图片',
            'image2base64-base64-content': 'Base64内容：',
            'image2base64-css-usage': 'CSS使用：',
            'image2base64-html-usage': 'HTML使用：',
            'image2base64-section-reverse': 'Base64转图片',
            'image2base64-base64-input-label': 'Base64内容：',
            'image2base64-base64-input-placeholder': '粘贴Base64编码内容',
            'image2base64-convert-to-image': '转换为图片',
            'image2base64-preview-image': '预览图片',
            'image2base64-reverse-preview': 'Base64转图片',
            
            // 字符串处理工具
            'stringprocess-tab-substring': '多行字符串批量按索引截取',
            'stringprocess-tab-text-substring': '多行字符串批量按文本截取',
            'stringprocess-tab-regex': '多行文本正则替换添加后缀',
            'stringprocess-tab-line-number': '在线文本列表批量添加行号',
            'stringprocess-tab-loop-string': '循环生成字符串',
            'stringprocess-tab-batch-replace': '文本字符串批量替换工具',
            'stringprocess-tab-diff': '文本代码差异对比',
            'stringprocess-input-label': '输入文本（每行一个字符串）：',
            'stringprocess-input-placeholder': '请输入要处理的文本，每行一个字符串',
            'stringprocess-start-position': '起始位置：',
            'stringprocess-end-position': '结束位置：',
            'stringprocess-substring-length': '截取长度：',
            'stringprocess-position-type': '位置类型：',
            'stringprocess-start-index': '起始索引：',
            'stringprocess-end-index': '结束索引：',
            'stringprocess-substring-btn': '批量截取',
            'stringprocess-start-text': '起始文本：',
            'stringprocess-end-text': '结束文本：',
            'stringprocess-start-text-placeholder': '输入起始文本',
            'stringprocess-end-text-placeholder': '输入结束文本',
            'stringprocess-include-start': '包含起始文本：',
            'stringprocess-include-end': '包含结束文本：',
            'stringprocess-text-before': '截取前的文本：',
            'stringprocess-text-after': '截取后的文本：',
            'stringprocess-text-extract-btn': '批量按文本截取',
            'stringprocess-regex-pattern': '正则表达式：',
            'stringprocess-regex-replacement': '替换为：',
            'stringprocess-regex-replace-btn': '批量正则替换',
            'stringprocess-regex-global': '全局替换',
            'stringprocess-enable-replace': '开启替换：',
            'stringprocess-enable': '启用',
            'stringprocess-replace-text-placeholder': '要替换成什么字符串',
            'stringprocess-add-suffix': '添加后缀：',
            'stringprocess-suffix-placeholder': '.jpg',
            'stringprocess-add-suffix-btn': '添加后缀',
            'stringprocess-linenumber-start': '起始行号：',
            'stringprocess-linenumber-format': '行号格式：',
            'stringprocess-linenumber-add-btn': '添加行号',
            'stringprocess-help-count-from-zero': '从0开始计数',
            'stringprocess-help-empty-to-end': '留空表示截取到末尾',
            'stringprocess-help-priority-over-end': '优先于结束位置',
            'stringprocess-help-empty-from-start': '留空表示从开头截取',
            'stringprocess-option-by-character': '按字符',
            'stringprocess-option-by-byte': '按字节',
            'stringprocess-option-not-include': '不包含',
            'stringprocess-option-include': '包含',
            'stringprocess-loop-count': '循环次数：',
            'stringprocess-batch-search': '搜索字符串：',
            'stringprocess-batch-replace': '替换字符串：',
            'stringprocess-diff-original': '原始文本：',
            'stringprocess-diff-modified': '修改后文本：',
            
            // Crontab工具
            'crontab-rules-title': 'Crontab表达式规则：',
            'crontab-rules-note': '注：Linux中没有second，最小是minute。',
            'crontab-minute': '分钟',
            'crontab-hour': '小时',
            'crontab-day': '一个月中的第几天',
            'crontab-month': '月份',
            'crontab-weekday': '星期几',
            'crontab-expression-label': 'Crontab表达式：',
            'crontab-expression-placeholder': '请输入Crontab表达式，例如：*/5 * * * *',
            'crontab-result-count': '显示执行次数：',
            'crontab-start-date': '起始日期：',
            'crontab-parse-btn': '解析执行时间',
            'crontab-examples-title': '常用Crontab表达式示例：',
            'crontab-example-desc': '描述',
            'crontab-example-expr': '表达式',
            'crontab-example-1min': '每1分钟执行一次',
            'crontab-example-hour': '每小时的第3和第15分钟执行',
            'crontab-example-night': '每晚的21:30执行',
            'crontab-example-month': '每月1,10,22日的4:45执行',
            'crontab-example-weekday': '每个星期一的上午8点到11点的第3和第15分钟执行',
            'crontab-example-15min': '每15分钟执行一次',
            'crontab-example-daily': '每天凌晨1点执行一次',
            'crontab-example-weekly': '每周日凌晨4:22执行',
            'crontab-example-format': '例：{0} 表示每晚21:30分执行',
            
            // 水印工具
            'watermark-title': '在线图片添加水印',
            'watermark-subtitle': '给PNG、JPG、GIF图片添加文字水印，特别适合身份证、驾照、护照添加水印防盗用',
            'watermark-step1': '第一步：上传一张图片',
            'watermark-upload-label': '上传图片：',
            'watermark-upload-text': '点击选择图片或拖拽图片到此处',
            'watermark-upload-hint': '支持 JPG、PNG、GIF 等常见图片格式',
            'watermark-step2': '第二步：设置水印参数',
            'watermark-watermark-text': '水印文字：',
            'watermark-watermark-text-placeholder': '请输入水印文字',
            'watermark-text-color': '文字颜色：',
            'watermark-font-size': '字体大小 (px)：',
            'watermark-font-size-label': '字体大小：',
            'watermark-spacing': '文字间隔 (px)：',
            'watermark-angle': '旋转角度：',
            'watermark-opacity': '透明度 (0-100)：',
            'watermark-opacity-label': '透明度：',
            'watermark-apply-btn': '添加水印',
            'watermark-clear-btn': '清空',
            'watermark-step3': '第三步：查看结果并下载',
            'watermark-download-btn': '下载图片',
            'watermark-preview': '预览图片',
            'watermark-result': '添加水印后的图片',
            
            // PDF工具
            'pdf-title': 'PDF工具集合',
            'pdf-subtitle': '丰富的PDF处理工具，全部在浏览器本地处理，保护您的隐私',
            'pdf-search-placeholder': '🔍 搜索PDF工具...',
            'pdf-basic-tools': '📄 基础工具',
            'pdf-merge': '合并PDF',
            'pdf-split': '拆分PDF',
            'pdf-compress': '压缩PDF',
            'pdf-edit': '编辑PDF',
            'pdf-sign': '签署PDF',
            'pdf-page-ops': '📑 页面操作',
            'pdf-rotate': '旋转PDF页面',
            'pdf-delete': '删除PDF页面',
            'pdf-extract': '提取PDF页面',
            'pdf-reorder': '重新排列页面',
            'pdf-crop': '裁剪PDF',
            'pdf-image-tools': '🖼️ 图片相关',
            'pdf-images2pdf': '图片转PDF',
            'pdf-pdf2images': 'PDF转图片',
            'pdf-extract-images': '从PDF提取图片',
            'pdf-ocr': 'PDF文本识别',
            'pdf-other-tools': '🛠️ 其他工具',
            'pdf-watermark': '添加水印',
            'pdf-pagenumbers': '添加页码',
            'pdf-overlay': 'PDF叠加',
            'pdf-annotate': '注释PDF',
            'pdf-to-word': 'PDF转Word',
            'pdf-no-results': '未找到匹配的工具',
            'pdf-modal-title': 'PDF工具',
            
            // 图片编辑工具
            'imageedit-title': '图片编辑工具集合',
            'imageedit-subtitle': '丰富的图片处理工具，全部在浏览器本地处理，保护您的隐私',
            'imageedit-search-placeholder': '🔍 搜索图片工具...',
            'imageedit-optimize-tools': '⚡ 优化工具',
            'imageedit-edit-tools': '✏️ 编辑工具',
            'imageedit-convert-tools': '🔄 转换工具',
            'imageedit-compress': '压缩图像文件',
            'imageedit-resize': '调整图像大小',
            'imageedit-enhance': '提升图片质量',
            'imageedit-crop': '裁剪图片',
            'imageedit-rotate': '旋转图片',
            'imageedit-editor': '照片编辑器',
            'imageedit-watermark': '给图片加水印',
            'imageedit-blur': '模糊面部/区域',
            'imageedit-remove-bg': '去除背景',
            'imageedit-to-jpg': '转换至JPG',
            'imageedit-from-jpg': 'JPG转其他格式',
            'imageedit-html-to-image': 'HTML转图片',
            'imageedit-no-results': '未找到匹配的工具',
            'imageedit-modal-title': '图片工具',
        },
        en: {
            // Homepage
            'site-title': 'Online Toolbox',
            'site-subtitle': 'Practical tools collection to improve work efficiency',
            'tool-timestamp': 'Timestamp Converter',
            'tool-timestamp-desc': 'Convert between date/time and timestamp, support multiple formats',
            'tool-md5': 'MD5 Encryption',
            'tool-md5-desc': 'Online MD5 encryption tool, quickly generate MD5 hash values',
            'tool-camel': 'Underscore CamelCase Converter',
            'tool-camel-desc': 'Convert between underscore naming and camelCase naming',
            'tool-json': 'JSON Formatter',
            'tool-json-desc': 'JSON formatting and compression tool with key sorting support',
            'tool-calculator': 'Advanced Calculator',
            'tool-calculator-desc': 'Support remainder operation and base conversion',
            'tool-urlencode': 'URL Encode/Decode',
            'tool-urlencode-desc': 'Support encodeURI and encodeURIComponent encoding/decoding',
            'tool-sql': 'SQL Formatter',
            'tool-sql-desc': 'SQL statement formatting and compression tool',
            'tool-base64': 'Base64 Encode/Decode',
            'tool-base64-desc': 'Base64 encoding and decoding tool',
            'tool-json2any': 'Json2Any',
            'tool-json2any-desc': 'JSON to Go struct, Protobuf message definition, PHP array, YAML to Protobuf, SQL to GORM',
            'tool-curl': 'curl to Code',
            'tool-curl-desc': 'Convert curl commands to HTTP request code in multiple programming languages',
            'tool-image2base64': 'Image to Base64',
            'tool-image2base64-desc': 'Convert images to Base64 encoding, support CSS and HTML usage',
            'tool-colorpicker': 'Color Picker',
            'tool-colorpicker-desc': 'Select colors and get HEX, RGB, HSL format color codes',
            'tool-qr': 'QR Code Tool',
            'tool-qr-desc': 'Generate and parse QR codes, support text to QR code and image recognition',
            'tool-stringprocess': 'String Text Processing',
            'tool-stringprocess-desc': 'Multi-line string batch processing: index-based extraction, text extraction, regex replacement, and line numbering',
            'tool-crontab': 'Crontab Simulator',
            'tool-crontab-desc': 'Online simulation of Crontab expression execution time to verify expression correctness',
            'tool-watermark': 'Image Watermark',
            'tool-watermark-desc': 'Add text watermarks to PNG, JPG, GIF images, especially suitable for ID cards, driver licenses, passports to prevent misuse',
            'tool-pdf': 'PDF Tools',
            'tool-pdf-desc': 'Rich PDF processing tool collection, support merge, split, convert, edit, sign and other functions',
            'tool-imageedit': 'Edit Images',
            'tool-imageedit-desc': 'Rich image processing tool collection, support compress, resize, crop, convert, add watermark and other functions',
            'tool-more': 'More Tools',
            'tool-more-desc': 'More practical tools coming soon',
            'footer-text': '© Online Toolbox - Practical Tools Collection',
            'footer-contact': 'Contact Us',
            'contact-title': 'Contact Us',
            'contact-subtitle': 'Send messages, ask questions, get answers, report problems, or submit suggestions',
            'contact-name': 'Name:',
            'contact-name-placeholder': 'Name',
            'contact-email': 'Email Address:',
            'contact-email-placeholder': 'Email Address',
            'contact-subject': 'Subject:',
            'contact-subject-placeholder': 'Subject',
            'contact-message': 'Message:',
            'contact-message-placeholder': 'How can we help you?',
            'contact-submit': 'Submit',
            
            // Common
            'back-home': 'Back to Home',
            'back-home-menu': '🏠 Back to Home',
            
            // Navigation menu
            'nav-timestamp': '⏱️ Timestamp Converter',
            'nav-md5': '🔐 MD5 Encryption',
            'nav-camel': '🔤 Underscore CamelCase Converter',
            'nav-json': '📋 JSON Formatter',
            'nav-calculator': '🧮 Advanced Calculator',
            'nav-urlencode': '🔗 URL Encode/Decode',
            'nav-sql': '🗄️ SQL Formatter',
            'nav-base64': '🔒 Base64 Encode/Decode',
            'nav-json2any': '🔄 Json2Any',
            'nav-curl': '🌐 curl to Code',
            'nav-image2base64': '🖼️ Image to Base64',
            'nav-colorpicker': '🎨 Color Picker',
            'nav-qr': '📱 QR Code Tool',
            'nav-stringprocess': '✂️ String Text Processing',
            'nav-crontab': '⏰ Crontab Simulator',
            'nav-watermark': '💧 Image Watermark',
            'nav-pdf': '📄 PDF Tools',
            'nav-imageedit': '🖼️ Edit Images',
            
            // Timestamp tool
            'timestamp-title': 'Timestamp Converter',
            'timestamp-subtitle': 'Convert between date/time and timestamp',
            'timestamp-datetime': 'Date Time:',
            'timestamp-datetime-placeholder': 'Format: 2025-12-22 19:00:00',
            'timestamp-convert-to-ts': 'Convert to Timestamp',
            'timestamp-ts': 'Timestamp:',
            'timestamp-ts-placeholder': 'Please enter timestamp',
            'timestamp-convert-to-dt': 'Convert to Date Time',
            'back-home-link': '← Back to Toolbox Home',
            
            // MD5 tool
            'md5-input-label': 'Input Text:',
            'md5-input-placeholder': 'Please enter text to encrypt',
            'md5-generate': 'Generate MD5',
            'btn-clear': 'Clear',
            
            // JSON tool
            'json-input-label': 'Input JSON Text:',
            'json-input-placeholder': 'Please enter JSON text to format',
            'json-format': 'Format JSON',
            'json-compress': 'Compress JSON',
            'json-to-keyvalue': 'JSON to Key-Value',
            
            // Base64 tool
            'base64-input-label': 'Input Text:',
            'base64-input-placeholder': 'Please enter text to encode or decode',
            'base64-encode': 'Base64 Encode',
            'base64-decode': 'Base64 Decode',
            
            // Camel tool
            'camel-input-label': 'Input Text:',
            'camel-input-placeholder': 'Please enter text to convert\nExample: hello_world or helloWorld',
            'camel-to-camel': 'Underscore to CamelCase',
            'camel-to-underline': 'CamelCase to Underscore',
            
            // Common input labels
            'input-text-label': 'Input Text:',
            'input-label': 'Input:',
            
            // Calculator tool
            'calculator-input-label': 'Input Number:',
            'calculator-input-placeholder': 'Please enter a number',
            'calculator-modulo-divisor': 'Divisor:',
            'calculator-modulo-divisor-placeholder': 'Please enter divisor',
            'calculator-modulo': 'Modulo Operation',
            'calculator-bin-to-dec': 'Binary to Decimal',
            'calculator-dec-to-bin': 'Decimal to Binary',
            'calculator-dec-to-hex': 'Decimal to Hexadecimal',
            'calculator-hex-to-dec': 'Hexadecimal to Decimal',
            
            // URL encode tool
            'urlencode-note-title': 'Encoding Method Description:',
            'urlencode-note-uri': 'encodeURI: Does not encode special symbols, suitable for complete URL encoding',
            'urlencode-note-component': 'encodeURIComponent: Encodes special symbols, suitable for URL parameter encoding',
            'urlencode-encode-uri': 'encodeURI Encode',
            'urlencode-encode-component': 'encodeURIComponent Encode',
            'urlencode-decode-uri': 'decodeURI Decode',
            'urlencode-decode-component': 'decodeURIComponent Decode',
            
            // SQL tool
            'sql-input-label': 'Input SQL Statement:',
            'sql-input-placeholder': 'Please enter SQL statement to format or compress',
            'sql-format': 'Format SQL',
            'sql-compress': 'Compress SQL',
            
            // Json2Any tool
            'json2any-input-label': 'Input JSON, YAML or SQL:',
            'json2any-input-placeholder': 'Please enter JSON, YAML or SQL statement to convert',
            'json2any-go': 'JSON to Go Struct',
            'json2any-protobuf': 'JSON to Protobuf',
            'json2any-php': 'JSON to PHP Array',
            'json2any-yaml-protobuf': 'YAML to Protobuf',
            'json2any-sql-gorm': 'SQL to GORM',
            
            // curl tool
            'curl-input-label': 'curl Command:',
            'curl-input-placeholder': 'Please enter curl command, e.g.: curl -X GET https://www.baidu.com',
            'curl-language-label': 'Programming Language:',
            'curl-examples-label': 'Common Examples:',
            'curl-example-get': 'GET Request',
            'curl-example-post': 'POST Request',
            'curl-example-basic-auth': 'Basic Auth',
            'curl-example-wget': 'Wget Example',
            'curl-convert': 'Convert Code',
            
            // QR Code tool
            'qr-generate-title': 'Generate QR Code',
            'qr-decode-title': 'Parse QR Code',
            'qr-input-label': 'Input Content:',
            'qr-input-placeholder': 'Please enter text content to generate QR code',
            'qr-size-label': 'QR Code Size:',
            'qr-generate-btn': 'Generate QR Code',
            'qr-upload-label': 'Upload QR Code Image:',
            
            // Image to Base64 tool
            'image2base64-upload-title': 'Upload Image',
            'image2base64-upload-text': 'Click or drag image here',
            'image2base64-base64-title': 'Base64 Encoding',
            'image2base64-css-title': 'CSS Style',
            'image2base64-html-title': 'HTML Usage',
            'image2base64-copy-css': 'Copy CSS Code',
            'image2base64-copy-html': 'Copy HTML Code',
            'image2base64-copy-base64': 'Copy Base64 Code',
            
            // Color Picker
            'colorpicker-hex': 'HEX',
            'colorpicker-rgb': 'RGB',
            'colorpicker-hsl': 'HSL',
            'colorpicker-copy': 'Copy',
            'colorpicker-select-label': 'Select Color:',
            'colorpicker-color-picker-label': 'Color Picker:',
            'colorpicker-rgb-label': 'RGB Value:',
            'colorpicker-hsl-label': 'HSL Value:',
            'colorpicker-preview-label': 'Color Preview:',
            'colorpicker-hex-format': 'HEX Format',
            'colorpicker-rgb-format': 'RGB Format',
            'colorpicker-hsl-format': 'HSL Format',
            'colorpicker-css-usage': 'CSS Usage',
            'colorpicker-copy-hex': 'Copy HEX',
            'colorpicker-copy-rgb': 'Copy RGB',
            'colorpicker-copy-hsl': 'Copy HSL',
            'colorpicker-copy-css': 'Copy CSS',
            
            // Image to Base64 tool (complete)
            'image2base64-section-upload': 'Image Upload to Base64',
            'image2base64-upload-label': 'Upload Image:',
            'image2base64-upload-click': 'Click to select image or drag image here',
            'image2base64-upload-formats': 'Supports common image formats: JPG, PNG, GIF, etc.',
            'image2base64-download-image': 'Download Image',
            'image2base64-base64-content': 'Base64 Content:',
            'image2base64-css-usage': 'CSS Usage:',
            'image2base64-html-usage': 'HTML Usage:',
            'image2base64-section-reverse': 'Base64 to Image',
            'image2base64-base64-input-label': 'Base64 Content:',
            'image2base64-base64-input-placeholder': 'Paste Base64 encoded content',
            'image2base64-convert-to-image': 'Convert to Image',
            'image2base64-preview-image': 'Preview Image',
            'image2base64-reverse-preview': 'Base64 to Image',
            
            // String Processing tool
            'stringprocess-tab-substring': 'Multi-line String Batch Extract by Index',
            'stringprocess-tab-text-substring': 'Multi-line String Batch Extract by Text',
            'stringprocess-tab-regex': 'Multi-line Text Regex Replace Add Suffix',
            'stringprocess-tab-line-number': 'Online Text List Batch Add Line Numbers',
            'stringprocess-tab-loop-string': 'Loop Generate String',
            'stringprocess-tab-batch-replace': 'Text String Batch Replacement Tool',
            'stringprocess-tab-diff': 'Text Code Difference Comparison',
            'stringprocess-input-label': 'Input Text (one string per line):',
            'stringprocess-input-placeholder': 'Please enter the text to process, one string per line',
            'stringprocess-start-position': 'Start Position:',
            'stringprocess-end-position': 'End Position:',
            'stringprocess-substring-length': 'Extraction Length:',
            'stringprocess-position-type': 'Position Type:',
            'stringprocess-start-index': 'Start Index:',
            'stringprocess-end-index': 'End Index:',
            'stringprocess-substring-btn': 'Batch Extract',
            'stringprocess-start-text': 'Start Text:',
            'stringprocess-end-text': 'End Text:',
            'stringprocess-start-text-placeholder': 'Enter start text',
            'stringprocess-end-text-placeholder': 'Enter end text',
            'stringprocess-include-start': 'Include Start Text:',
            'stringprocess-include-end': 'Include End Text:',
            'stringprocess-text-before': 'Text Before:',
            'stringprocess-text-after': 'Text After:',
            'stringprocess-text-extract-btn': 'Batch Extract by Text',
            'stringprocess-regex-pattern': 'Regex Pattern:',
            'stringprocess-regex-replacement': 'Replace With:',
            'stringprocess-regex-replace-btn': 'Batch Regex Replace',
            'stringprocess-regex-global': 'Global Replace',
            'stringprocess-enable-replace': 'Enable Replace:',
            'stringprocess-enable': 'Enable',
            'stringprocess-replace-text-placeholder': 'What string to replace with',
            'stringprocess-add-suffix': 'Add Suffix:',
            'stringprocess-suffix-placeholder': '.jpg',
            'stringprocess-add-suffix-btn': 'Add Suffix',
            'stringprocess-linenumber-start': 'Start Line Number:',
            'stringprocess-linenumber-format': 'Line Number Format:',
            'stringprocess-linenumber-add-btn': 'Add Line Number',
            'stringprocess-help-count-from-zero': 'Count from 0',
            'stringprocess-help-empty-to-end': 'Leave blank to extract to the end',
            'stringprocess-help-priority-over-end': 'Prioritize over end position',
            'stringprocess-help-empty-from-start': 'Leave blank to extract from start',
            'stringprocess-option-by-character': 'By Character',
            'stringprocess-option-by-byte': 'By Byte',
            'stringprocess-option-not-include': 'Not Include',
            'stringprocess-option-include': 'Include',
            'stringprocess-loop-count': 'Loop Count:',
            'stringprocess-batch-search': 'Search String:',
            'stringprocess-batch-replace': 'Replace String:',
            'stringprocess-diff-original': 'Original Text:',
            'stringprocess-diff-modified': 'Modified Text:',
            
            // Crontab tool
            'crontab-rules-title': 'Crontab Expression Rules:',
            'crontab-rules-note': 'Note: Linux has no second, minimum is minute.',
            'crontab-minute': 'Minute',
            'crontab-hour': 'Hour',
            'crontab-day': 'Day of Month',
            'crontab-month': 'Month',
            'crontab-weekday': 'Day of Week',
            'crontab-expression-label': 'Crontab Expression:',
            'crontab-expression-placeholder': 'Please enter Crontab expression, e.g.: */5 * * * *',
            'crontab-result-count': 'Display Count:',
            'crontab-start-date': 'Start Date:',
            'crontab-parse-btn': 'Parse Execution Time',
            'crontab-examples-title': 'Common Crontab Expression Examples:',
            'crontab-example-desc': 'Description',
            'crontab-example-expr': 'Expression',
            'crontab-example-1min': 'Every 1 minute',
            'crontab-example-hour': '3rd and 15th minute of every hour',
            'crontab-example-night': 'Every night at 21:30',
            'crontab-example-month': '4:45 on 1st, 10th, 22nd of every month',
            'crontab-example-weekday': '3rd and 15th minute from 8am to 11am on Mondays',
            'crontab-example-15min': 'Every 15 minutes',
            'crontab-example-daily': 'Every day at 1:00 AM',
            'crontab-example-weekly': 'Every Sunday at 4:22 AM',
            'crontab-example-format': 'Example: {0} means execute every night at 21:30',
            
            // Watermark tool
            'watermark-title': 'Image Watermark',
            'watermark-subtitle': 'Add text watermarks to PNG, JPG, GIF images, especially suitable for ID cards, driver licenses, passports to prevent misuse',
            'watermark-step1': 'Step 1: Upload an Image',
            'watermark-upload-label': 'Upload Image:',
            'watermark-upload-text': 'Click to select image or drag image here',
            'watermark-upload-hint': 'Supports common image formats like JPG, PNG, GIF',
            'watermark-step2': 'Step 2: Set Watermark Parameters',
            'watermark-watermark-text': 'Watermark Text:',
            'watermark-watermark-text-placeholder': 'Please enter watermark text',
            'watermark-text-color': 'Text Color:',
            'watermark-font-size': 'Font Size (px):',
            'watermark-font-size-label': 'Font Size:',
            'watermark-spacing': 'Text Spacing (px):',
            'watermark-angle': 'Rotation Angle:',
            'watermark-opacity': 'Opacity (0-100):',
            'watermark-opacity-label': 'Opacity:',
            'watermark-apply-btn': 'Apply Watermark',
            'watermark-clear-btn': 'Clear',
            'watermark-step3': 'Step 3: View Result and Download',
            'watermark-download-btn': 'Download Image',
            'watermark-preview': 'Preview Image',
            'watermark-result': 'Watermarked Image',
            
            // PDF tool
            'pdf-title': 'PDF Tools Collection',
            'pdf-subtitle': 'Rich PDF processing tools, all processed locally in the browser to protect your privacy',
            'pdf-search-placeholder': '🔍 Search PDF Tools...',
            'pdf-basic-tools': '📄 Basic Tools',
            'pdf-merge': 'Merge PDF',
            'pdf-split': 'Split PDF',
            'pdf-compress': 'Compress PDF',
            'pdf-edit': 'Edit PDF',
            'pdf-sign': 'Sign PDF',
            'pdf-page-ops': '📑 Page Operations',
            'pdf-rotate': 'Rotate PDF Pages',
            'pdf-delete': 'Delete PDF Pages',
            'pdf-extract': 'Extract PDF Pages',
            'pdf-reorder': 'Reorder Pages',
            'pdf-crop': 'Crop PDF',
            'pdf-image-tools': '🖼️ Image Related',
            'pdf-images2pdf': 'Images to PDF',
            'pdf-pdf2images': 'PDF to Images',
            'pdf-extract-images': 'Extract Images from PDF',
            'pdf-ocr': 'PDF Text Recognition',
            'pdf-other-tools': '🛠️ Other Tools',
            'pdf-watermark': 'Add Watermark',
            'pdf-pagenumbers': 'Add Page Numbers',
            'pdf-overlay': 'PDF Overlay',
            'pdf-annotate': 'Annotate PDF',
            'pdf-to-word': 'PDF to Word',
            'pdf-no-results': 'No matching tools found',
            'pdf-modal-title': 'PDF Tool',
            
            // Image Edit Tools
            'imageedit-title': 'Image Edit Tools Collection',
            'imageedit-subtitle': 'Rich image processing tools, all processed locally in browser, protecting your privacy',
            'imageedit-search-placeholder': '🔍 Search image tools...',
            'imageedit-optimize-tools': '⚡ Optimize Tools',
            'imageedit-edit-tools': '✏️ Edit Tools',
            'imageedit-convert-tools': '🔄 Convert Tools',
            'imageedit-compress': 'Compress Image File',
            'imageedit-resize': 'Adjust Image Size',
            'imageedit-enhance': 'Enhance Image Quality',
            'imageedit-crop': 'Crop Image',
            'imageedit-rotate': 'Rotate Image',
            'imageedit-editor': 'Photo Editor',
            'imageedit-watermark': 'Add Watermark to Image',
            'imageedit-blur': 'Blur Face/Area',
            'imageedit-remove-bg': 'Remove Background',
            'imageedit-to-jpg': 'Convert to JPG',
            'imageedit-from-jpg': 'Convert JPG to Other Formats',
            'imageedit-html-to-image': 'HTML to Image',
            'imageedit-no-results': 'No matching tools found',
            'imageedit-modal-title': 'Image Tool',
        }
    },
    
    // 获取翻译文本
    t: function(key) {
        return this.translations[this.currentLang]?.[key] || key;
    },
    
    // 切换语言
    setLanguage: function(lang) {
        if (this.translations[lang]) {
            this.currentLang = lang;
            localStorage.setItem('language', lang);
            document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
            this.updatePage();
        }
    },
    
    // 更新页面文本
    updatePage: function() {
        // 确保当前语言设置是最新的（每次更新时都重新读取）
        const savedLang = localStorage.getItem('language');
        if (savedLang && (savedLang === 'zh' || savedLang === 'en')) {
            this.currentLang = savedLang;
        }
        
        // 设置HTML lang属性
        document.documentElement.lang = this.currentLang === 'zh' ? 'zh-CN' : 'en';
        
        // 更新所有带有data-i18n属性的元素
        const elements = document.querySelectorAll('[data-i18n]');
        if (elements.length === 0) {
            // 如果没有找到元素，可能是DOM还没加载完成，等待一下再试
            return;
        }
        
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (!key) return; // 如果没有key，跳过
            
            const text = this.t(key);
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                // 对于输入框，只更新placeholder
                if (element.hasAttribute('placeholder') || key.includes('placeholder')) {
                    element.setAttribute('placeholder', text);
                }
            } else if (element.tagName === 'TITLE') {
                // 对于标题，需要加上完整标题后缀
                const suffix = this.currentLang === 'zh' ? ' - 实用工具集合' : ' - Online Toolbox';
                element.textContent = text + suffix;
            } else if (element.tagName === 'LABEL') {
                // 对于label，只更新文本内容，保留HTML结构
                element.textContent = text;
            } else {
                // 对于其他元素（如 h3, p, button, span 等）
                // 检查是否是纯文本元素（没有子元素或只有文本节点）
                const hasElementChildren = element.children.length > 0;
                const hasOnlyText = Array.from(element.childNodes).every(node => 
                    node.nodeType === Node.TEXT_NODE || node.nodeType === Node.COMMENT_NODE
                );
                
                if (hasElementChildren && !hasOnlyText) {
                    // 有子元素（如图标、链接等），需要保留结构
                    // 查找第一个文本节点并更新
                    const textNode = Array.from(element.childNodes).find(node => 
                        node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0
                    );
                    if (textNode) {
                        textNode.textContent = text;
                    } else {
                        // 如果没有文本节点，在第一个子元素前插入文本
                        if (element.firstChild) {
                            element.insertBefore(document.createTextNode(text), element.firstChild);
                        } else {
                            element.textContent = text;
                        }
                    }
                } else {
                    // 纯文本元素或没有子元素，直接更新文本内容
                    element.textContent = text;
                }
            }
        });
        
        // 更新页面标题（如果title标签有data-i18n属性）
        const titleElement = document.querySelector('title');
        if (titleElement) {
            const titleKey = titleElement.getAttribute('data-i18n');
            if (titleKey) {
                const titleText = this.t(titleKey);
                document.title = titleText + (this.currentLang === 'zh' ? ' - 实用工具集合' : ' - Online Toolbox');
            }
        }
        
        // 触发自定义事件，通知其他脚本更新
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: this.currentLang } }));
    },
    
    // 初始化
    init: function() {
        // 重新从localStorage读取语言设置（可能在页面加载期间被其他页面修改了）
        const savedLang = localStorage.getItem('language');
        if (savedLang && (savedLang === 'zh' || savedLang === 'en')) {
            this.currentLang = savedLang;
        } else {
            // 如果没有保存的语言设置，默认为中文
            this.currentLang = 'zh';
        }
        
        // 设置HTML lang属性
        document.documentElement.lang = this.currentLang === 'zh' ? 'zh-CN' : 'en';
        
        // 确保DOM元素存在后再更新
        const updateWhenReady = () => {
            // 确保body和至少一个data-i18n元素存在
            if (document.body) {
                const elements = document.querySelectorAll('[data-i18n]');
                if (elements.length > 0) {
                    // 找到元素了，立即更新
                    this.updatePage();
                    // 延迟一点再更新一次，确保所有动态添加的元素也被更新
                    setTimeout(() => {
                        this.updatePage();
                    }, 300);
                    return;
                }
            }
            // 如果DOM还没准备好，等待一下再试（最多等待5秒）
            if (typeof updateWhenReady.attempts === 'undefined') {
                updateWhenReady.attempts = 0;
            }
            updateWhenReady.attempts++;
            if (updateWhenReady.attempts < 100) { // 最多尝试100次，约5秒
                setTimeout(updateWhenReady, 50);
            } else {
                // 如果超时还没找到元素，至少尝试更新一次
                this.updatePage();
            }
        };
        
        // 立即开始检查
        updateWhenReady();
    }
};

// 自动初始化 - 确保在DOM准备好后执行
// 注意：如果页面中已经手动调用了 i18n.init()，这个自动初始化不会重复执行
(function() {
    let autoInitExecuted = false;
    
    // 确保i18n对象已经定义后才初始化
    function waitAndInit() {
        if (typeof i18n === 'undefined') {
            setTimeout(waitAndInit, 50);
            return;
        }
        
        // 如果已经手动初始化过，跳过自动初始化
        if (autoInitExecuted) {
            return;
        }
        
        // 初始化函数
        function performInit() {
            // 确保从localStorage读取最新的语言设置
            const savedLang = localStorage.getItem('language');
            if (savedLang && (savedLang === 'zh' || savedLang === 'en')) {
                i18n.currentLang = savedLang;
            } else {
                i18n.currentLang = 'zh';
            }
            
            // 调用初始化方法
            i18n.init();
            autoInitExecuted = true;
        }
        
        // 检查DOM状态并初始化
        if (document.body) {
            // body已经存在，立即初始化
            performInit();
        } else if (document.readyState === 'loading') {
            // DOM还在加载中，等待DOMContentLoaded
            document.addEventListener('DOMContentLoaded', () => {
                // DOM加载完成后立即初始化
                performInit();
            });
        } else {
            // DOM已经加载完成（interactive或complete），立即初始化
            performInit();
        }
    }
    
    // 开始等待和初始化
    waitAndInit();
    
    // 额外监听window.onload，确保页面完全加载后再更新一次
    window.addEventListener('load', function() {
        if (typeof i18n !== 'undefined') {
            const savedLang = localStorage.getItem('language');
            if (savedLang && (savedLang === 'zh' || savedLang === 'en')) {
                i18n.currentLang = savedLang;
                // 延迟一点确保所有动态内容都加载完成
                setTimeout(() => {
                    i18n.updatePage();
                }, 200);
            }
        }
    });
})();

