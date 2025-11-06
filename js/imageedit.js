// 图片编辑工具功能实现
(function() {
    'use strict';
    
    // 工具配置
    const toolConfigs = {
        compress: {
            title: '压缩图像文件',
            description: '压缩JPG、PNG、SVG、GIF文件，节省空间同时保持质量',
            multiple: false,
            accept: 'image/*'
        },
        resize: {
            title: '调整图像大小',
            description: '按百分比或像素定义尺寸，调整JPG、PNG、SVG、GIF图像大小',
            multiple: false,
            accept: 'image/*'
        },
        crop: {
            title: '裁剪图片',
            description: '通过设置像素裁剪图像文件。支持JPG、PNG或GIF图像文件',
            multiple: false,
            accept: 'image/*'
        },
        'to-jpg': {
            title: '转换至JPG文件',
            description: '轻松批量将PNG、GIF、TIF、PSD、SVG、WEBP、HEIC或原始格式图像转换为JPG格式',
            multiple: true,
            accept: 'image/*'
        },
        'from-jpg': {
            title: 'JPG文件转换至',
            description: '将JPG图像文件转换为PNG或GIF文件。允许多个JPG文件创建动画GIF文件',
            multiple: true,
            accept: 'image/jpeg,image/jpg'
        },
        editor: {
            title: '照片编辑器',
            description: '使用文本、效果、边框或贴纸使图片更加生动有趣。提供简单的编辑工具满足创意需求',
            multiple: false,
            accept: 'image/*'
        },
        enhance: {
            title: '提升图片质量',
            description: '以高分辨率放大图像。轻松提升JPG和PNG图像的大小，同时保持视觉质量',
            multiple: false,
            accept: 'image/*'
        },
        'remove-bg': {
            title: '去除背景',
            description: '快速去除图像背景，同时保持高质量。快速检测主体并轻松去除背景',
            multiple: false,
            accept: 'image/*'
        },
        watermark: {
            title: '给图片加水印',
            description: '快速为图片添加图像或文字水印。允许选择布局、透明度和位置',
            multiple: false,
            accept: 'image/*'
        },
        rotate: {
            title: '旋转图片',
            description: '同时旋转多个JPG、PNG或GIF图像。每次只能选择水平或垂直旋转',
            multiple: true,
            accept: 'image/*'
        },
        'html-to-image': {
            title: 'HTML转图片',
            description: '将HTML中的网页转换为JPG或SVG。用户复制并粘贴网页的URL链接，然后点击转换为图像',
            multiple: false,
            accept: ''
        },
        blur: {
            title: '模糊面部',
            description: '轻松模糊照片中的面部。此外，允许模糊车牌或其他物体以隐藏私人信息',
            multiple: false,
            accept: 'image/*'
        }
    };
    
    // 全局变量
    let uploadedFiles = [];
    let currentTool = null;
    let currentImage = null;
    let cropCanvas = null;
    let cropCtx = null;
    let isCropping = false;
    let cropStartX = 0;
    let cropStartY = 0;
    let cropEndX = 0;
    let cropEndY = 0;
    
    // 初始化搜索功能
    function initSearch() {
        const searchInput = document.getElementById('search-input');
        const toolCards = document.querySelectorAll('.image-tool-card');
        const sections = document.querySelectorAll('.image-tools-section');
        const noResults = document.getElementById('no-results');
        
        if (!searchInput || toolCards.length === 0) {
            return;
        }
        
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase().trim();
            let hasResults = false;
            
            if (!searchTerm) {
                toolCards.forEach(card => card.style.display = 'block');
                sections.forEach(section => section.style.display = 'block');
                if (noResults) noResults.style.display = 'none';
                return;
            }
            
            toolCards.forEach(card => {
                const toolName = card.getAttribute('data-tool') || '';
                const toolText = card.textContent.toLowerCase();
                
                if (toolName.toLowerCase().includes(searchTerm) || toolText.includes(searchTerm)) {
                    card.style.display = 'block';
                    hasResults = true;
                } else {
                    card.style.display = 'none';
                }
            });
            
            sections.forEach(section => {
                const cards = section.querySelectorAll('.image-tool-card');
                let hasVisibleCards = false;
                cards.forEach(card => {
                    if (card.style.display === 'block') hasVisibleCards = true;
                });
                section.style.display = hasVisibleCards ? 'block' : 'none';
            });
            
            if (noResults) {
                noResults.style.display = !hasResults ? 'block' : 'none';
            }
        });
    }
    
    // 打开工具模态框
    window.openToolModal = function(toolType) {
        currentTool = toolType;
        uploadedFiles = [];
        currentImage = null;
        const config = toolConfigs[toolType];
        if (!config) return;
        
        const modal = document.getElementById('tool-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalContent = document.getElementById('modal-content');
        
        modalTitle.textContent = config.title;
        modalContent.innerHTML = generateModalContent(toolType, config);
        
        // 如果是裁剪工具，调整弹窗宽度
        if (toolType === 'crop') {
            const modalContent = modal.querySelector('.tool-modal-content');
            if (modalContent) {
                modalContent.style.maxWidth = '1200px';
                modalContent.style.width = '90%';
            }
        } else {
            const modalContent = modal.querySelector('.tool-modal-content');
            if (modalContent) {
                modalContent.style.maxWidth = '';
                modalContent.style.width = '';
            }
        }
        
        // 确保弹窗居中显示
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        
        // 初始化文件上传（HTML转图片不需要）
        if (toolType !== 'html-to-image') {
            initFileUpload(toolType, config);
        }
        
        // 初始化特定工具的UI
        if (toolType === 'crop') {
            setTimeout(initCropTool, 100);
        }
    };
    
    // 关闭工具模态框
    window.closeToolModal = function() {
        const modal = document.getElementById('tool-modal');
        modal.style.display = 'none';
        uploadedFiles = [];
        processedFiles = [];
        currentImage = null;
        currentTool = null;
        isCropping = false;
        const downloadAllBtn = document.getElementById('download-all-btn');
        if (downloadAllBtn) {
            downloadAllBtn.style.display = 'none';
        }
        // 清理拖拽事件监听器
        document.removeEventListener('mousemove', dragImage);
        document.removeEventListener('mouseup', endDragImage);
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
    };
    
    // 生成模态框内容
    function generateModalContent(toolType, config) {
        let html = `<p style="color: #666; margin-bottom: 20px;">${config.description}</p>`;
        
        // HTML转图片工具不需要文件上传区域
        if (toolType !== 'html-to-image') {
            // 裁剪工具使用更小的上传区域
            const uploadStyle = toolType === 'crop' 
                ? 'padding: 10px; font-size: 12px;' 
                : 'padding: 40px;';
            const iconSize = toolType === 'crop' ? '20px' : '48px';
            const textSize = toolType === 'crop' ? '12px' : '16px';
            const descSize = toolType === 'crop' ? '10px' : '14px';
            
            html += `
                <div class="file-upload-area" id="upload-area" style="${uploadStyle}">
                    <div style="font-size: ${iconSize}; margin-bottom: ${toolType === 'crop' ? '8px' : '15px'};">📁</div>
                    <div style="font-size: ${textSize}; color: #666; margin-bottom: ${toolType === 'crop' ? '5px' : '10px'};">
                        点击或拖拽文件到此处
                    </div>
                    <div style="font-size: ${descSize}; color: #999;">
                        ${config.multiple ? '支持选择多个文件' : '仅支持单个文件'}
                    </div>
                    <input type="file" id="file-input" class="file-input" 
                           accept="${config.accept}" 
                           ${config.multiple ? 'multiple' : ''}>
                </div>
                <div class="file-list" id="file-list"></div>
                <div id="preview-container" class="preview-container"></div>
            `;
        }
        
        html += `
            <div id="tool-options"></div>
            <button class="process-btn" id="process-btn" onclick="processImage()" ${toolType === 'html-to-image' ? '' : 'disabled'} style="${toolType === 'crop' ? 'padding: 8px 16px; font-size: 13px;' : ''}">
                处理图片
            </button>
            <button class="process-btn" id="download-all-btn" onclick="downloadAllFiles()" style="display: none; margin-top: 10px; background: #2196F3; ${toolType === 'crop' ? 'padding: 8px 16px; font-size: 13px;' : ''}">
                下载所有
            </button>
            <div class="progress-bar" id="progress-bar">
                <div class="progress-fill" id="progress-fill"></div>
            </div>
            <div class="result-info" id="result-info"></div>
        `;
        
        // 根据工具类型添加特定选项
        if (toolType === 'compress') {
            html += `
                <div class="form-group" style="margin-top: 20px;">
                    <label>压缩质量 (0.1-1.0，越小文件越小)：</label>
                    <input type="number" id="compress-quality" value="0.8" min="0.1" max="1" step="0.1"
                           style="width: 100%; padding: 10px; margin-top: 8px;">
                    <div style="font-size: 12px; color: #666; margin-top: 5px;">
                        建议值：0.8（平衡质量和文件大小）
                    </div>
                </div>
                <div class="form-group" style="margin-top: 15px;">
                    <label>最大宽度（像素，0表示不限制）：</label>
                    <input type="number" id="compress-max-width" value="1920" min="0"
                           style="width: 100%; padding: 10px; margin-top: 8px;">
                </div>
                <div class="form-group" style="margin-top: 15px;">
                    <label>最大高度（像素，0表示不限制）：</label>
                    <input type="number" id="compress-max-height" value="1920" min="0"
                           style="width: 100%; padding: 10px; margin-top: 8px;">
                </div>
            `;
        }
        
        if (toolType === 'resize') {
            html += `
                <div class="form-group" style="margin-top: 20px;">
                    <label>调整方式：</label>
                    <select id="resize-mode" style="width: 100%; padding: 10px; margin-top: 8px;">
                        <option value="percentage">按百分比</option>
                        <option value="pixels">按像素</option>
                    </select>
                </div>
                <div class="form-group" style="margin-top: 15px;">
                    <label id="resize-label">缩放百分比：</label>
                    <input type="number" id="resize-value" value="50" min="1" max="500"
                           style="width: 100%; padding: 10px; margin-top: 8px;">
                    <div id="resize-help" style="font-size: 12px; color: #666; margin-top: 5px;">
                        输入百分比（1-500），例如：50表示缩小到50%
                    </div>
                </div>
                <div class="form-group" style="margin-top: 15px;">
                    <label>保持宽高比：</label>
                    <select id="resize-keep-aspect" style="width: 100%; padding: 10px; margin-top: 8px;">
                        <option value="true">是</option>
                        <option value="false">否</option>
                    </select>
                </div>
            `;
        }
        
        if (toolType === 'crop') {
            html += `
                <div style="margin-top: 15px;">
                    <!-- 预览画布 -->
                    <div id="crop-canvas-container" style="margin-top: 15px; display: flex; gap: 20px;">
                        <div style="flex: 2; min-width: 0;">
                            <div style="font-size: 14px; font-weight: 600; margin-bottom: 10px; color: #333;">裁剪预览</div>
                            <div id="crop-preview-wrapper" style="text-align: center; border: 1px solid #e0e0e0; border-radius: 4px; padding: 10px; background: #f9f9f9; overflow: auto; max-height: 800px;"></div>
                        </div>
                        <div style="flex: 1; min-width: 0;">
                            <div style="font-size: 14px; font-weight: 600; margin-bottom: 10px; color: #333;">原图</div>
                            <div id="crop-original-wrapper" style="text-align: center; border: 1px solid #e0e0e0; border-radius: 4px; padding: 10px; background: #f9f9f9; max-height: 800px; overflow: auto;"></div>
                            
                            <!-- 比例参数显示在原图下方 -->
                            <div style="margin-top: 20px;">
                                <div style="font-weight: 600; font-size: 15px; margin-bottom: 10px;">手动裁剪</div>
                                
                                <!-- 标签页 -->
                                <div style="display: flex; gap: 5px; border-bottom: 1px solid #e0e0e0; margin-bottom: 10px;">
                                    <button type="button" id="crop-tab-ratio" class="crop-tab-btn active" onclick="switchCropTab('ratio')" 
                                            style="flex: 1; padding: 10px; background: white; border: none; border-bottom: 2px solid #4CAF50; color: #4CAF50; cursor: pointer; font-size: 14px;">
                                        比例
                                    </button>
                                    <button type="button" id="crop-tab-size" class="crop-tab-btn" onclick="switchCropTab('size')" 
                                            style="flex: 1; padding: 10px; background: white; border: none; border-bottom: 2px solid transparent; color: #666; cursor: pointer; font-size: 14px;">
                                        尺寸
                                    </button>
                                </div>
                                
                                <!-- 比例标签页 -->
                                <div id="crop-ratio-tab" class="crop-tab-content">
                                    <div style="max-height: 200px; overflow-y: auto; border: 1px solid #e0e0e0; border-radius: 4px;">
                                        <div class="crop-preset-item" data-preset="free" onclick="selectCropPreset('free')" style="padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #f0f0f0;">
                                            <div style="font-size: 13px;">自由比例</div>
                                        </div>
                                        <div class="crop-preset-item" data-preset="original" onclick="selectCropPreset('original')" style="padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #f0f0f0;">
                                            <div style="font-size: 13px;">原图比例</div>
                                        </div>
                                        <div class="crop-preset-item" data-preset="1:1" onclick="selectCropPreset('1:1')" style="padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #f0f0f0;">
                                            <div style="font-size: 13px;">1:1 方形</div>
                                        </div>
                                        <div class="crop-preset-item" data-preset="2:3" onclick="selectCropPreset('2:3')" style="padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #f0f0f0;">
                                            <div style="font-size: 13px;">2:3 单反相机 (竖)</div>
                                        </div>
                                        <div class="crop-preset-item" data-preset="3:2" onclick="selectCropPreset('3:2')" style="padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #f0f0f0;">
                                            <div style="font-size: 13px;">3:2 单反相机 (横)</div>
                                        </div>
                                        <div class="crop-preset-item" data-preset="3:4" onclick="selectCropPreset('3:4')" style="padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #f0f0f0;">
                                            <div style="font-size: 13px;">3:4 电商主图</div>
                                        </div>
                                        <div class="crop-preset-item" data-preset="4:3" onclick="selectCropPreset('4:3')" style="padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #f0f0f0;">
                                            <div style="font-size: 13px;">4:3 媒体主图</div>
                                        </div>
                                        <div class="crop-preset-item" data-preset="9:16" onclick="selectCropPreset('9:16')" style="padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #f0f0f0;">
                                            <div style="font-size: 13px;">9:16 视频封面 (竖)</div>
                                        </div>
                                        <div class="crop-preset-item" data-preset="16:9" onclick="selectCropPreset('16:9')" style="padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #f0f0f0;">
                                            <div style="font-size: 13px;">16:9 视频封面 (横)</div>
                                        </div>
                                        <div class="crop-preset-item" data-preset="1:2" onclick="selectCropPreset('1:2')" style="padding: 8px 12px; cursor: pointer;">
                                            <div style="font-size: 13px;">1:2 手机壁纸</div>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- 尺寸标签页 -->
                                <div id="crop-size-tab" class="crop-tab-content" style="display: none;">
                                    <div style="max-height: 200px; overflow-y: auto; border: 1px solid #e0e0e0; border-radius: 4px;">
                                        <div class="crop-preset-item" data-preset="free-size" onclick="selectCropSize('free-size')" style="padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #f0f0f0;">
                                            <div style="font-size: 13px;">自由尺寸</div>
                                        </div>
                                        <div class="crop-preset-item" data-preset="original-size" onclick="selectCropSize('original-size')" style="padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #f0f0f0;">
                                            <div style="font-size: 13px;">原尺寸</div>
                                        </div>
                                        <div class="crop-preset-item" data-preset="a4" onclick="selectCropSize('a4')" style="padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #f0f0f0;">
                                            <div style="font-size: 13px;">A4纸: 210*297mm</div>
                                        </div>
                                        <div class="crop-preset-item" data-preset="a5" onclick="selectCropSize('a5')" style="padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #f0f0f0;">
                                            <div style="font-size: 13px;">A5纸: 148*210mm</div>
                                        </div>
                                        <div class="crop-preset-item" data-preset="id-photo" onclick="selectCropSize('id-photo')" style="padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #f0f0f0;">
                                            <div style="font-size: 13px;">身份证照: 26*32mm</div>
                                        </div>
                                        <div class="crop-preset-item" data-preset="one-inch" onclick="selectCropSize('one-inch')" style="padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #f0f0f0;">
                                            <div style="font-size: 13px;">一寸照: 25*35mm</div>
                                        </div>
                                        <div class="crop-preset-item" data-preset="two-inch" onclick="selectCropSize('two-inch')" style="padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #f0f0f0;">
                                            <div style="font-size: 13px;">二寸照: 35*49mm</div>
                                        </div>
                                        <div class="crop-preset-item" data-preset="wechat-header" onclick="selectCropSize('wechat-header')" style="padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #f0f0f0;">
                                            <div style="font-size: 13px;">公众号首图: 900*833px</div>
                                        </div>
                                        <div class="crop-preset-item" data-preset="wechat-secondary" onclick="selectCropSize('wechat-secondary')" style="padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #f0f0f0;">
                                            <div style="font-size: 13px;">公众号次图: 200*200px</div>
                                        </div>
                                        <div class="crop-preset-item" data-preset="moments-cover" onclick="selectCropSize('moments-cover')" style="padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #f0f0f0;">
                                            <div style="font-size: 13px;">朋友圈封面: 1080*1080px</div>
                                        </div>
                                        <div class="crop-preset-item" data-preset="wallpaper" onclick="selectCropSize('wallpaper')" style="padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #f0f0f0;">
                                            <div style="font-size: 13px;">电脑壁纸: 1920*1080px</div>
                                        </div>
                                        <div class="crop-preset-item" data-preset="square-main" onclick="selectCropSize('square-main')" style="padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #f0f0f0;">
                                            <div style="font-size: 13px;">方形主图: 800*800px</div>
                                        </div>
                                        <div class="crop-preset-item" data-preset="vertical-main" onclick="selectCropSize('vertical-main')" style="padding: 8px 12px; cursor: pointer;">
                                            <div style="font-size: 13px;">竖版主图: 800*1200px</div>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- 宽高输入框 -->
                                <div style="margin-top: 15px; display: flex; gap: 10px; align-items: center;">
                                    <div style="flex: 1;">
                                        <input type="number" id="crop-width" value="" min="1" placeholder="长"
                                               style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px; min-width: 120px;">
                                    </div>
                                    <span style="color: #666; font-size: 18px;">×</span>
                                    <div style="flex: 1;">
                                        <input type="number" id="crop-height" value="" min="1" placeholder="宽"
                                               style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px; min-width: 120px;">
                                    </div>
                                    <select id="crop-unit" style="padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
                                        <option value="px" selected>像素</option>
                                        <option value="mm">毫米</option>
                                    </select>
                                </div>
                                
                                <!-- 操作按钮 -->
                                <div style="margin-top: 15px; display: flex; gap: 10px; justify-content: center;">
                                    <button type="button" id="crop-rotate-left" onclick="rotateCropImage(-90)" 
                                            style="padding: 10px 15px; background: #f5f5f5; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; font-size: 18px;" title="逆时针旋转">↶</button>
                                    <button type="button" id="crop-rotate-right" onclick="rotateCropImage(90)" 
                                            style="padding: 10px 15px; background: #f5f5f5; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; font-size: 18px;" title="顺时针旋转">↷</button>
                                    <button type="button" id="crop-flip-h" onclick="flipCropImage('horizontal')" 
                                            style="padding: 10px 15px; background: #f5f5f5; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; font-size: 18px;" title="水平翻转">⇄</button>
                                    <button type="button" id="crop-flip-v" onclick="flipCropImage('vertical')" 
                                            style="padding: 10px 15px; background: #f5f5f5; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; font-size: 18px;" title="垂直翻转">⇅</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        if (toolType === 'from-jpg') {
            html += `
                <div class="form-group" style="margin-top: 20px;">
                    <label>转换为格式：</label>
                    <select id="convert-format" style="width: 100%; padding: 10px; margin-top: 8px;">
                        <option value="png">PNG</option>
                        <option value="gif">GIF（动画）</option>
                    </select>
                </div>
                <div class="form-group" style="margin-top: 15px;">
                    <label>GIF动画延迟（毫秒，仅GIF格式有效）：</label>
                    <input type="number" id="gif-delay" value="500" min="100" max="5000" step="100"
                           style="width: 100%; padding: 10px; margin-top: 8px;">
                </div>
            `;
        }
        
        if (toolType === 'editor') {
            html += `
                <div class="form-group" style="margin-top: 20px;">
                    <label>添加文本：</label>
                    <input type="text" id="editor-text" placeholder="输入要添加的文本"
                           style="width: 100%; padding: 10px; margin-top: 8px;">
                </div>
                <div class="form-group" style="margin-top: 15px;">
                    <label>字体大小：</label>
                    <input type="number" id="editor-font-size" value="24" min="10" max="100"
                           style="width: 100%; padding: 10px; margin-top: 8px;">
                </div>
                <div class="form-group" style="margin-top: 15px;">
                    <label>文字颜色：</label>
                    <input type="color" id="editor-text-color" value="#000000"
                           style="width: 100%; padding: 10px; margin-top: 8px; height: 50px; cursor: pointer;">
                </div>
                <div class="form-group" style="margin-top: 15px;">
                    <label>X坐标：</label>
                    <input type="number" id="editor-x" value="50" min="0"
                           style="width: 100%; padding: 10px; margin-top: 8px;">
                </div>
                <div class="form-group" style="margin-top: 15px;">
                    <label>Y坐标：</label>
                    <input type="number" id="editor-y" value="50" min="0"
                           style="width: 100%; padding: 10px; margin-top: 8px;">
                </div>
                <div class="form-group" style="margin-top: 15px;">
                    <label>添加边框：</label>
                    <select id="editor-border" style="width: 100%; padding: 10px; margin-top: 8px;">
                        <option value="none">无</option>
                        <option value="solid">实线</option>
                        <option value="dashed">虚线</option>
                        <option value="dotted">点线</option>
                    </select>
                </div>
                <div class="form-group" style="margin-top: 15px;">
                    <label>边框宽度（像素）：</label>
                    <input type="number" id="editor-border-width" value="5" min="1" max="50"
                           style="width: 100%; padding: 10px; margin-top: 8px;">
                </div>
                <div class="form-group" style="margin-top: 15px;">
                    <label>边框颜色：</label>
                    <input type="color" id="editor-border-color" value="#000000"
                           style="width: 100%; padding: 10px; margin-top: 8px; height: 50px; cursor: pointer;">
                </div>
            `;
        }
        
        if (toolType === 'enhance') {
            html += `
                <div class="form-group" style="margin-top: 20px;">
                    <label>放大倍数：</label>
                    <input type="number" id="enhance-scale" value="2" min="1" max="4" step="0.5"
                           style="width: 100%; padding: 10px; margin-top: 8px;">
                    <div style="font-size: 12px; color: #666; margin-top: 5px;">
                        推荐值：2（放大2倍），最大支持4倍
                    </div>
                </div>
            `;
        }
        
        if (toolType === 'watermark') {
            html += `
                <div class="form-group" style="margin-top: 20px;">
                    <label>水印文字：</label>
                    <input type="text" id="watermark-text" placeholder="请输入水印文字" value="水印文字"
                           style="width: 100%; padding: 10px; margin-top: 8px;">
                </div>
                <div class="form-group" style="margin-top: 15px;">
                    <label>文字颜色：</label>
                    <div style="display: flex; align-items: center; gap: 10px; margin-top: 8px;">
                        <input type="color" id="watermark-color" value="#CCCCCC"
                               style="width: 50px; height: 40px; border: none; border-radius: 4px; cursor: pointer;">
                        <input type="text" id="watermark-color-text" value="#CCCCCC" placeholder="#CCCCCC"
                               style="flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                </div>
                <div class="form-group" style="margin-top: 15px;">
                    <label>透明度 (0-100)：</label>
                    <input type="range" id="watermark-opacity" min="0" max="100" value="50"
                           style="width: 100%; margin-top: 8px;">
                    <span id="watermark-opacity-value" style="display: inline-block; margin-top: 5px;">50%</span>
                </div>
                <div class="form-group" style="margin-top: 15px;">
                    <label>字体大小 (px)：</label>
                    <input type="number" id="watermark-font-size" min="10" max="100" value="30"
                           style="width: 100%; padding: 10px; margin-top: 8px;">
                </div>
                <div class="form-group" style="margin-top: 15px;">
                    <label>文字间隔 (px)：</label>
                    <input type="number" id="watermark-spacing" min="10" max="200" value="50"
                           style="width: 100%; padding: 10px; margin-top: 8px;">
                </div>
                <div class="form-group" style="margin-top: 15px;">
                    <label>旋转角度：</label>
                    <input type="number" id="watermark-angle" min="0" max="360" value="45"
                           style="width: 100%; padding: 10px; margin-top: 8px;">
                </div>
            `;
        }
        
        if (toolType === 'rotate') {
            html += `
                <div class="form-group" style="margin-top: 20px;">
                    <label>旋转角度：</label>
                    <select id="rotate-angle" style="width: 100%; padding: 10px; margin-top: 8px;">
                        <option value="90">顺时针90度</option>
                        <option value="180">180度</option>
                        <option value="270">逆时针90度</option>
                        <option value="-90">逆时针90度</option>
                    </select>
                </div>
            `;
        }
        
        if (toolType === 'html-to-image') {
            html += `
                <div class="form-group" style="margin-top: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500;">网站 URL</label>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <div style="flex: 1; position: relative;">
                            <span style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 18px;">🌐</span>
                            <input type="url" id="html-url" placeholder="https://www.iloveimg.com/zh-cn/html-to-image"
                                   style="width: 100%; padding: 12px 12px 12px 40px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
                        </div>
                        <button type="button" id="html-refresh-btn" onclick="refreshHtmlUrl()" 
                                style="padding: 12px 16px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;" 
                                title="刷新">🔄</button>
                    </div>
                    <div id="html-url-error" style="display: none; color: #f44336; font-size: 12px; margin-top: 5px;">这个URL链接无效，请检查其书写是否正确。</div>
                </div>
                
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
                    <div class="form-group" style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 500;">屏幕大小</label>
                        <select id="html-screen-size" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
                            <option value="1200">你的屏幕 (1200px)</option>
                            <option value="1920" selected>高清桌面版 (1920px)</option>
                            <option value="1440">桌面版 (1440px)</option>
                            <option value="768">平板电脑版 (768px)</option>
                            <option value="320">移动版 (320px)</option>
                        </select>
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 500;">转换为</label>
                        <select id="html-output-format" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
                            <option value="jpg">JPG</option>
                            <option value="png">PNG</option>
                        </select>
                    </div>
                </div>
                
                <div id="html-preview-container" style="margin-top: 20px; text-align: center; display: none;">
                    <div style="margin-bottom: 10px; font-weight: 500; font-size: 16px;">预览</div>
                    <div style="border: 1px solid #ddd; border-radius: 4px; padding: 10px; background: white;">
                        <img id="html-preview-image" style="max-width: 100%; border-radius: 4px;">
                    </div>
                </div>
                
                <div id="html-loading-status" style="display: none; margin-top: 15px; padding: 15px; background: #e3f2fd; border-radius: 4px; text-align: center;">
                    <div style="font-size: 14px; color: #1976d2;">正在访问 URL...</div>
                    <div style="font-size: 12px; color: #666; margin-top: 5px;">这可能需要一会儿...</div>
                </div>
            `;
        }
        
        if (toolType === 'blur') {
            html += `
                <div class="form-group" style="margin-top: 20px;">
                    <label>模糊方式：</label>
                    <select id="blur-mode" style="width: 100%; padding: 10px; margin-top: 8px;">
                        <option value="face">自动检测面部</option>
                        <option value="manual">手动选择区域</option>
                        <option value="full">整张图片</option>
                    </select>
                </div>
                <div class="form-group" style="margin-top: 15px;">
                    <label>模糊强度（1-20）：</label>
                    <input type="number" id="blur-intensity" value="10" min="1" max="20"
                           style="width: 100%; padding: 10px; margin-top: 8px;">
                </div>
                <div id="blur-canvas-container" style="margin-top: 20px; text-align: center;"></div>
            `;
        }
        
        return html;
    }
    
    // 初始化文件上传
    function initFileUpload(toolType, config) {
        const uploadArea = document.getElementById('upload-area');
        const fileInput = document.getElementById('file-input');
        const fileList = document.getElementById('file-list');
        const processBtn = document.getElementById('process-btn');
        const previewContainer = document.getElementById('preview-container');
        
        // 点击上传区域
        uploadArea.addEventListener('click', () => fileInput.click());
        
        // 文件选择
        fileInput.addEventListener('change', (e) => {
            handleFiles(Array.from(e.target.files), toolType);
        });
        
        // 拖拽上传
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            handleFiles(Array.from(e.dataTransfer.files), toolType);
        });
        
        // 水印功能初始化
        if (toolType === 'watermark') {
            // 颜色选择器同步
            const watermarkColor = document.getElementById('watermark-color');
            const watermarkColorText = document.getElementById('watermark-color-text');
            if (watermarkColor && watermarkColorText) {
                watermarkColor.addEventListener('input', function() {
                    watermarkColorText.value = this.value;
                });
                watermarkColorText.addEventListener('input', function() {
                    if (/^#[0-9A-Fa-f]{6}$/.test(this.value)) {
                        watermarkColor.value = this.value;
                    }
                });
            }
            
            // 透明度滑块
            const opacitySlider = document.getElementById('watermark-opacity');
            const opacityValue = document.getElementById('watermark-opacity-value');
            if (opacitySlider && opacityValue) {
                opacitySlider.addEventListener('input', function() {
                    opacityValue.textContent = this.value + '%';
                });
            }
        }
        
        // HTML转图片URL刷新
        window.refreshHtmlUrl = function() {
            const urlInput = document.getElementById('html-url');
            if (urlInput && urlInput.value) {
                // 触发转换
                processImage();
            }
        };
        
        // HTML转图片URL输入验证
        if (toolType === 'html-to-image') {
            const urlInput = document.getElementById('html-url');
            const urlError = document.getElementById('html-url-error');
            
            if (urlInput) {
                urlInput.addEventListener('input', function() {
                    if (urlError) urlError.style.display = 'none';
                });
                
                urlInput.addEventListener('blur', function() {
                    const url = this.value.trim();
                    if (url && !isValidUrl(url)) {
                        if (urlError) urlError.style.display = 'block';
                    } else {
                        if (urlError) urlError.style.display = 'none';
                    }
                });
            }
        }
        
        // URL验证函数
        function isValidUrl(string) {
            try {
                const url = new URL(string);
                return url.protocol === 'http:' || url.protocol === 'https:';
            } catch (_) {
                return false;
            }
        }
        
        // 调整大小模式切换
        if (toolType === 'resize') {
            const resizeMode = document.getElementById('resize-mode');
            const resizeLabel = document.getElementById('resize-label');
            const resizeValue = document.getElementById('resize-value');
            const resizeHelp = document.getElementById('resize-help');
            
            if (resizeMode) {
                resizeMode.addEventListener('change', function() {
                    if (this.value === 'percentage') {
                        resizeLabel.textContent = '缩放百分比：';
                        resizeValue.placeholder = '50';
                        resizeValue.value = '50';
                        resizeValue.min = '1';
                        resizeValue.max = '500';
                        resizeHelp.textContent = '输入百分比（1-500），例如：50表示缩小到50%';
                    } else {
                        resizeLabel.textContent = '宽度（像素）：';
                        resizeValue.placeholder = '1920';
                        resizeValue.value = '1920';
                        resizeValue.min = '1';
                        resizeValue.max = '10000';
                        resizeHelp.textContent = '输入目标宽度（像素）';
                    }
                });
            }
        }
        
        // 裁剪功能初始化
        if (toolType === 'crop') {
            // 初始化默认选中"自由比例"
            setTimeout(() => {
                const freeItem = document.querySelector('[data-preset="free"]');
                if (freeItem) {
                    freeItem.style.background = '#f0f0f0';
                }
                window.cropAspectRatio = null;
                // 初始化图片偏移
                window.cropImageOffsetX = 0;
                window.cropImageOffsetY = 0;
            }, 100);
            
            // 宽高输入框联动
            setTimeout(() => {
                const cropWidth = document.getElementById('crop-width');
                const cropHeight = document.getElementById('crop-height');
                
                if (cropWidth && cropHeight) {
                    // 宽度变化时，如果锁定了比例，自动更新高度
                    cropWidth.addEventListener('input', function() {
                        if (window.cropAspectRatio && window.cropAspectRatio > 0) {
                            cropHeight.value = Math.round(this.value / window.cropAspectRatio);
                            // 重置偏移
                            window.cropImageOffsetX = 0;
                            window.cropImageOffsetY = 0;
                            updateCropPreview();
                        } else {
                            // 重置偏移
                            window.cropImageOffsetX = 0;
                            window.cropImageOffsetY = 0;
                            updateCropPreview();
                        }
                    });
                    
                    // 高度变化时，如果锁定了比例，自动更新宽度
                    cropHeight.addEventListener('input', function() {
                        if (window.cropAspectRatio && window.cropAspectRatio > 0) {
                            cropWidth.value = Math.round(this.value * window.cropAspectRatio);
                            // 重置偏移
                            window.cropImageOffsetX = 0;
                            window.cropImageOffsetY = 0;
                            updateCropPreview();
                        } else {
                            // 重置偏移
                            window.cropImageOffsetX = 0;
                            window.cropImageOffsetY = 0;
                            updateCropPreview();
                        }
                    });
                }
            }, 200);
        }
        
        // 裁剪标签页切换
        window.switchCropTab = function(tab) {
            const tabs = ['ratio', 'size'];
            tabs.forEach(t => {
                const btn = document.getElementById(`crop-tab-${t}`);
                const content = document.getElementById(`crop-${t}-tab`);
                if (btn && content) {
                    if (t === tab) {
                        btn.classList.add('active');
                        btn.style.borderBottom = '2px solid #4CAF50';
                        btn.style.color = '#4CAF50';
                        content.style.display = 'block';
                    } else {
                        btn.classList.remove('active');
                        btn.style.borderBottom = '2px solid transparent';
                        btn.style.color = '#666';
                        content.style.display = 'none';
                    }
                }
            });
        };
        
        // 选择裁剪预设比例
        window.selectCropPreset = function(preset) {
            // 移除所有选中状态
            document.querySelectorAll('.crop-preset-item').forEach(item => {
                item.style.background = 'white';
            });
            
            // 设置当前选中
            const item = document.querySelector(`[data-preset="${preset}"]`);
            if (item) {
                item.style.background = '#f0f0f0';
            }
            
            const cropWidth = document.getElementById('crop-width');
            const cropHeight = document.getElementById('crop-height');
            if (!cropWidth || !cropHeight) return;
            
            // 重置图片偏移
            window.cropImageOffsetX = 0;
            window.cropImageOffsetY = 0;
            
            if (preset === 'free') {
                // 自由比例，不锁定
                window.cropAspectRatio = null;
                updateCropPreview();
            } else if (preset === 'original') {
                // 原图比例 - 使用原图的像素尺寸
                if (currentImage) {
                    const img = new Image();
                    img.onload = function() {
                        cropWidth.value = img.width;
                        cropHeight.value = img.height;
                        const ratio = img.width / img.height;
                        window.cropAspectRatio = ratio;
                        updateCropPreview();
                    };
                    img.src = currentImage.src;
                }
            } else {
                // 解析比例，如 "1:1", "2:3" 等
                // 基于原图尺寸，计算最大满足目标比例的裁剪框（不能超出原图范围）
                if (currentImage) {
                    const img = new Image();
                    img.onload = function() {
                        const parts = preset.split(':');
                        if (parts.length === 2) {
                            const targetRatio = parseFloat(parts[0]) / parseFloat(parts[1]);
                            const originalRatio = img.width / img.height;
                            
                            // 计算最大满足目标比例的裁剪框尺寸（不能超出原图）
                            let newWidth, newHeight;
                            
                            if (targetRatio > originalRatio) {
                                // 目标比例更宽，以原图宽度为限制
                                newWidth = img.width;
                                newHeight = Math.round(img.width / targetRatio);
                            } else {
                                // 目标比例更高，以原图高度为限制
                                newWidth = Math.round(img.height * targetRatio);
                                newHeight = img.height;
                            }
                            
                            // 确保不超过原图尺寸（双重保险）
                            newWidth = Math.min(newWidth, img.width);
                            newHeight = Math.min(newHeight, img.height);
                            
                            cropWidth.value = newWidth;
                            cropHeight.value = newHeight;
                            window.cropAspectRatio = targetRatio;
                            updateCropPreview();
                        }
                    };
                    img.src = currentImage.src;
                }
            }
        };
        
        // 选择裁剪预设尺寸
        window.selectCropSize = function(size) {
            // 移除所有选中状态
            document.querySelectorAll('.crop-preset-item').forEach(item => {
                item.style.background = 'white';
            });
            
            // 设置当前选中
            const item = document.querySelector(`[data-preset="${size}"]`);
            if (item) {
                item.style.background = '#f0f0f0';
            }
            
            const cropWidth = document.getElementById('crop-width');
            const cropHeight = document.getElementById('crop-height');
            const cropUnit = document.getElementById('crop-unit');
            if (!cropWidth || !cropHeight) return;
            
            // 重置图片偏移
            window.cropImageOffsetX = 0;
            window.cropImageOffsetY = 0;
            
            // 尺寸预设（像素，96 DPI）
            const sizePresets = {
                'free-size': null,
                'original-size': null, // 会在初始化时设置
                'a4': { width: 794, height: 1123, unit: 'mm' }, // A4: 210*297mm at 96 DPI
                'a5': { width: 559, height: 794, unit: 'mm' }, // A5: 148*210mm at 96 DPI
                'id-photo': { width: 98, height: 121, unit: 'mm' }, // 身份证照: 26*32mm at 96 DPI
                'one-inch': { width: 94, height: 132, unit: 'mm' }, // 一寸照: 25*35mm at 96 DPI
                'two-inch': { width: 132, height: 185, unit: 'mm' }, // 二寸照: 35*49mm at 96 DPI
                'wechat-header': { width: 900, height: 833, unit: 'px' },
                'wechat-secondary': { width: 200, height: 200, unit: 'px' },
                'moments-cover': { width: 1080, height: 1080, unit: 'px' },
                'wallpaper': { width: 1920, height: 1080, unit: 'px' },
                'square-main': { width: 800, height: 800, unit: 'px' },
                'vertical-main': { width: 800, height: 1200, unit: 'px' }
            };
            
            if (size === 'free-size') {
                window.cropAspectRatio = null;
                updateCropPreview();
            } else if (size === 'original-size') {
                if (currentImage) {
                    const img = new Image();
                    img.onload = function() {
                        cropWidth.value = img.width;
                        cropHeight.value = img.height;
                        if (cropUnit) cropUnit.value = 'px';
                        window.cropAspectRatio = img.width / img.height;
                        updateCropPreview();
                    };
                    img.src = currentImage.src;
                }
            } else {
                const preset = sizePresets[size];
                if (preset) {
                    cropWidth.value = preset.width;
                    cropHeight.value = preset.height;
                    if (cropUnit) cropUnit.value = preset.unit;
                    window.cropAspectRatio = preset.width / preset.height;
                    updateCropPreview();
                }
            }
        };
        
        
        // 旋转裁剪图片
        window.rotateCropImage = function(angle) {
            if (!window.cropRotation) window.cropRotation = 0;
            window.cropRotation += angle;
            updateCropPreview();
        };
        
        // 翻转裁剪图片
        window.flipCropImage = function(direction) {
            if (!window.cropFlip) window.cropFlip = { h: false, v: false };
            if (direction === 'horizontal') {
                window.cropFlip.h = !window.cropFlip.h;
            } else {
                window.cropFlip.v = !window.cropFlip.v;
            }
            updateCropPreview();
        };
        
        // 更新裁剪预览
        window.updateCropPreview = function() {
            if (currentTool !== 'crop' || !currentImage) return;
            drawCropPreview();
        };
        
        function handleFiles(files, toolType) {
            if (!config.multiple && files.length > 1) {
                alert('此工具仅支持单个文件');
                files = [files[0]];
            }
            
            uploadedFiles = files;
            displayFileList();
            
            // 显示预览（裁剪工具不在上传区域显示预览）
            if (files.length > 0 && toolType !== 'html-to-image' && toolType !== 'crop') {
                const file = files[0];
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.className = 'preview-image';
                    previewContainer.innerHTML = '';
                    previewContainer.appendChild(img);
                    currentImage = img;
                };
                reader.readAsDataURL(file);
            }
            
            // 裁剪工具：加载图片但不显示在上传区域，直接初始化裁剪工具
            if (files.length > 0 && toolType === 'crop') {
                const file = files[0];
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    currentImage = img;
                    
                    // 初始化裁剪工具（会自动设置原图像素并显示预览）
                    setTimeout(initCropTool, 100);
                };
                reader.readAsDataURL(file);
            }
            
            if (uploadedFiles.length > 0) {
                processBtn.disabled = false;
            }
        }
        
        function displayFileList() {
            fileList.innerHTML = '';
            uploadedFiles.forEach((file, index) => {
                const fileItem = document.createElement('div');
                fileItem.className = 'file-item';
                fileItem.innerHTML = `
                    <span class="file-name">${file.name} (${formatFileSize(file.size)})</span>
                    <span class="file-remove" onclick="removeFile(${index})">×</span>
                `;
                fileList.appendChild(fileItem);
            });
        }
        
        window.removeFile = function(index) {
            uploadedFiles.splice(index, 1);
            displayFileList();
            const previewContainer = document.getElementById('preview-container');
            if (previewContainer) previewContainer.innerHTML = '';
            currentImage = null;
            const processBtn = document.getElementById('process-btn');
            if (processBtn) {
                processBtn.disabled = uploadedFiles.length === 0;
            }
        };
    }
    
    // 初始化裁剪工具
    function initCropTool() {
        if (!currentImage || currentTool !== 'crop') return;
        
        const container = document.getElementById('crop-canvas-container');
        if (!container) return;
        
        const cropWidth = document.getElementById('crop-width');
        const cropHeight = document.getElementById('crop-height');
        
        // 初始化图片偏移（如果还没有）
        if (window.cropImageOffsetX === undefined) {
            window.cropImageOffsetX = 0;
            window.cropImageOffsetY = 0;
        }
        
        // 自动设置原图尺寸到宽高输入框
        const img = new Image();
        img.onload = function() {
            if (cropWidth && cropHeight) {
                cropWidth.value = img.width;
                cropHeight.value = img.height;
            }
            // 重新绘制
            drawCropPreview();
        };
        img.src = currentImage.src;
    }
    
    // 绘制裁剪预览
    function drawCropPreview() {
        if (!currentImage || currentTool !== 'crop') return;
        
        const container = document.getElementById('crop-canvas-container');
        const previewWrapper = document.getElementById('crop-preview-wrapper');
        const originalWrapper = document.getElementById('crop-original-wrapper');
        const cropWidth = document.getElementById('crop-width');
        const cropHeight = document.getElementById('crop-height');
        
        if (!container || !previewWrapper || !originalWrapper || !cropWidth || !cropHeight) return;
        
        const img = new Image();
        img.onload = function() {
            // 获取目标裁剪尺寸
            const targetWidth = parseInt(cropWidth.value || img.width);
            const targetHeight = parseInt(cropHeight.value || img.height);
            
            // ========== 左侧：裁剪预览 ==========
            // 计算画布尺寸（以裁剪框为中心，留出足够空间显示图片）
            // 增大预览尺寸（四五倍）
            const cropBoxDisplayWidth = Math.min(2000, targetWidth);
            const cropBoxDisplayHeight = Math.min(1600, targetHeight);
            const scale = Math.min(cropBoxDisplayWidth / targetWidth, cropBoxDisplayHeight / targetHeight);
            
            const cropBoxCanvasWidth = targetWidth * scale;
            const cropBoxCanvasHeight = targetHeight * scale;
            
            // 画布需要足够大以显示整个图片（考虑偏移）
            const canvasPadding = 100; // 留出边距
            const canvasWidth = Math.max(cropBoxCanvasWidth + canvasPadding * 2, img.width * scale + canvasPadding * 2);
            const canvasHeight = Math.max(cropBoxCanvasHeight + canvasPadding * 2, img.height * scale + canvasPadding * 2);
            
            // 创建或获取画布
            let canvas = document.getElementById('crop-canvas');
            if (!canvas) {
                canvas = document.createElement('canvas');
                canvas.id = 'crop-canvas';
                canvas.className = 'canvas-editor';
                canvas.style.cursor = 'move';
                canvas.style.maxWidth = '100%';
                canvas.style.maxHeight = '600px';
                canvas.style.width = 'auto';
                canvas.style.height = 'auto';
                previewWrapper.innerHTML = '';
                previewWrapper.appendChild(canvas);
            }
            
            // 确保事件监听器已绑定（每次绘制时重新绑定，防止丢失）
            canvas.removeEventListener('mousedown', startDragImage);
            canvas.addEventListener('mousedown', startDragImage);
            
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            
            cropCanvas = canvas;
            cropCtx = canvas.getContext('2d');
            
            // 清空画布
            cropCtx.fillStyle = '#f5f5f5';
            cropCtx.fillRect(0, 0, canvas.width, canvas.height);
            
            // 计算裁剪框在画布中的位置（居中）
            const cropBoxX = (canvas.width - cropBoxCanvasWidth) / 2;
            const cropBoxY = (canvas.height - cropBoxCanvasHeight) / 2;
            
            // 保存裁剪框信息（用于裁剪计算）
            window.cropBoxCanvasX = cropBoxX;
            window.cropBoxCanvasY = cropBoxY;
            window.cropBoxCanvasWidth = cropBoxCanvasWidth;
            window.cropBoxCanvasHeight = cropBoxCanvasHeight;
            window.cropCanvasScale = scale;
            
            // 计算图片在画布中的位置（考虑偏移）
            const imageCanvasWidth = img.width * scale;
            const imageCanvasHeight = img.height * scale;
            const imageX = cropBoxX + window.cropImageOffsetX * scale;
            const imageY = cropBoxY + window.cropImageOffsetY * scale;
            
            // 应用旋转和翻转
            let rotation = window.cropRotation || 0;
            let flip = window.cropFlip || { h: false, v: false };
            
            // 绘制图片（考虑旋转和翻转）
            cropCtx.save();
            cropCtx.translate(imageX + imageCanvasWidth / 2, imageY + imageCanvasHeight / 2);
            
            if (rotation !== 0) {
                cropCtx.rotate(rotation * Math.PI / 180);
            }
            
            if (flip.h) {
                cropCtx.scale(-1, 1);
            }
            if (flip.v) {
                cropCtx.scale(1, -1);
            }
            
            cropCtx.drawImage(img, -imageCanvasWidth / 2, -imageCanvasHeight / 2, imageCanvasWidth, imageCanvasHeight);
            cropCtx.restore();
            
            // 绘制裁剪框（固定大小，在图片上方）
            cropCtx.strokeStyle = '#4CAF50';
            cropCtx.lineWidth = 3;
            cropCtx.setLineDash([8, 4]);
            cropCtx.strokeRect(cropBoxX, cropBoxY, cropBoxCanvasWidth, cropBoxCanvasHeight);
            cropCtx.setLineDash([]);
            
            // 绘制裁剪框外的遮罩（半透明）
            cropCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            // 上
            cropCtx.fillRect(0, 0, canvas.width, cropBoxY);
            // 下
            cropCtx.fillRect(0, cropBoxY + cropBoxCanvasHeight, canvas.width, canvas.height - cropBoxY - cropBoxCanvasHeight);
            // 左
            cropCtx.fillRect(0, cropBoxY, cropBoxX, cropBoxCanvasHeight);
            // 右
            cropCtx.fillRect(cropBoxX + cropBoxCanvasWidth, cropBoxY, canvas.width - cropBoxX - cropBoxCanvasWidth, cropBoxCanvasHeight);
            
            // 绘制裁剪框边框（更明显）
            cropCtx.strokeStyle = '#4CAF50';
            cropCtx.lineWidth = 2;
            cropCtx.strokeRect(cropBoxX, cropBoxY, cropBoxCanvasWidth, cropBoxCanvasHeight);
            
            // 绘制角落控制点
            const cornerSize = 12;
            cropCtx.fillStyle = '#4CAF50';
            const corners = [
                [cropBoxX, cropBoxY],
                [cropBoxX + cropBoxCanvasWidth, cropBoxY],
                [cropBoxX, cropBoxY + cropBoxCanvasHeight],
                [cropBoxX + cropBoxCanvasWidth, cropBoxY + cropBoxCanvasHeight]
            ];
            corners.forEach(([x, y]) => {
                cropCtx.fillRect(x - cornerSize/2, y - cornerSize/2, cornerSize, cornerSize);
            });
            
            // 显示尺寸信息
            cropCtx.fillStyle = '#333';
            cropCtx.font = '14px Arial';
            cropCtx.fillText(`宽: ${targetWidth}px 高: ${targetHeight}px`, cropBoxX + 10, cropBoxY - 10);
            
            // ========== 右侧：原图 ==========
            // 显示原图
            originalWrapper.innerHTML = '';
            const originalImg = document.createElement('img');
            originalImg.src = currentImage.src;
            originalImg.style.maxWidth = '100%';
            originalImg.style.height = 'auto';
            originalImg.style.borderRadius = '4px';
            originalWrapper.appendChild(originalImg);
        };
        img.src = currentImage.src;
    }
    
    // 图片拖拽功能
    function startDragImage(e) {
        if (currentTool !== 'crop' || !cropCanvas) return;
        e.preventDefault(); // 防止默认行为
        e.stopPropagation(); // 阻止事件冒泡
        
        isCropping = true;
        const rect = cropCanvas.getBoundingClientRect();
        window.dragStartX = e.clientX - rect.left;
        window.dragStartY = e.clientY - rect.top;
        window.dragImageStartOffsetX = window.cropImageOffsetX || 0;
        window.dragImageStartOffsetY = window.cropImageOffsetY || 0;
        
        // 移除可能存在的旧监听器，然后添加新的
        document.removeEventListener('mousemove', dragImage);
        document.removeEventListener('mouseup', endDragImage);
        
        // 添加全局事件监听（即使鼠标移出canvas也能继续拖拽）
        document.addEventListener('mousemove', dragImage);
        document.addEventListener('mouseup', endDragImage);
        
        // 防止文本选择
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'move';
    }
    
    function dragImage(e) {
        if (!isCropping || currentTool !== 'crop') return;
        e.preventDefault(); // 防止默认行为
        
        const rect = cropCanvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        
        // 计算偏移量（画布坐标转图片坐标）
        const scale = window.cropCanvasScale || 1;
        const deltaX = (currentX - window.dragStartX) / scale;
        const deltaY = (currentY - window.dragStartY) / scale;
        
        // 更新图片偏移
        window.cropImageOffsetX = window.dragImageStartOffsetX + deltaX;
        window.cropImageOffsetY = window.dragImageStartOffsetY + deltaY;
        
        // 限制偏移范围（确保裁剪框内始终有图片内容）
        const cropWidth = document.getElementById('crop-width');
        const cropHeight = document.getElementById('crop-height');
        if (cropWidth && cropHeight && currentImage) {
            const targetWidth = parseInt(cropWidth.value);
            const targetHeight = parseInt(cropHeight.value);
            
            // 直接使用已加载的图片尺寸，避免重复加载
            const imgWidth = currentImage.width;
            const imgHeight = currentImage.height;
            
            // 限制偏移：裁剪框不能超出图片范围
            const maxOffsetX = Math.max(0, imgWidth - targetWidth);
            const maxOffsetY = Math.max(0, imgHeight - targetHeight);
            window.cropImageOffsetX = Math.max(-maxOffsetX, Math.min(0, window.cropImageOffsetX));
            window.cropImageOffsetY = Math.max(-maxOffsetY, Math.min(0, window.cropImageOffsetY));
        }
        
        // 重绘
        drawCropPreview();
    }
    
    function endDragImage(e) {
        if (!isCropping) return;
        e.preventDefault();
        
        isCropping = false;
        
        // 移除全局事件监听
        document.removeEventListener('mousemove', dragImage);
        document.removeEventListener('mouseup', endDragImage);
        
        // 恢复文本选择和光标
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
    }
    
    // 格式化文件大小
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }
    
    // 处理图片
    window.processImage = async function() {
        // HTML转图片工具不需要文件，只需要URL
        if (currentTool !== 'html-to-image' && uploadedFiles.length === 0) {
            alert('请先选择文件');
            return;
        }
        
        // 清空之前的处理文件列表
        processedFiles = [];
        const downloadAllBtn = document.getElementById('download-all-btn');
        if (downloadAllBtn) {
            downloadAllBtn.style.display = 'none';
        }
        
        const processBtn = document.getElementById('process-btn');
        const progressBar = document.getElementById('progress-bar');
        const progressFill = document.getElementById('progress-fill');
        const resultInfo = document.getElementById('result-info');
        
        processBtn.disabled = true;
        progressBar.style.display = 'block';
        progressFill.style.width = '0%';
        resultInfo.style.display = 'none';
        
        try {
            updateProgress(10);
            
            let result;
            switch(currentTool) {
                case 'compress':
                    result = await compressImage();
                    break;
                case 'resize':
                    result = await resizeImage();
                    break;
                case 'crop':
                    result = await cropImage();
                    break;
                case 'to-jpg':
                    result = await convertToJPG();
                    break;
                case 'from-jpg':
                    result = await convertFromJPG();
                    break;
                case 'editor':
                    result = await editImage();
                    break;
                case 'enhance':
                    result = await enhanceImage();
                    break;
                case 'remove-bg':
                    result = await removeBackground();
                    break;
                case 'watermark':
                    result = await addWatermark();
                    break;
                case 'rotate':
                    result = await rotateImage();
                    break;
                case 'html-to-image':
                    result = await htmlToImage();
                    break;
                case 'blur':
                    result = await blurImage();
                    break;
                default:
                    throw new Error('未知的工具类型');
            }
            
            updateProgress(100);
            
            if (result) {
                resultInfo.style.display = 'block';
                resultInfo.innerHTML = `
                    <strong>✓ 处理完成！</strong>
                    <p style="margin-top: 10px;">文件已准备好下载</p>
                `;
            }
            
        } catch (error) {
            console.error('处理图片时出错:', error);
            alert('处理失败: ' + error.message);
            progressBar.style.display = 'none';
        } finally {
            processBtn.disabled = false;
        }
    };
    
    function updateProgress(percent) {
        const progressFill = document.getElementById('progress-fill');
        if (progressFill) {
            progressFill.style.width = percent + '%';
        }
    }
    
    // 压缩图片
    async function compressImage() {
        if (typeof imageCompression === 'undefined') {
            alert('图片压缩库未加载');
            return false;
        }
        
        const file = uploadedFiles[0];
        const quality = parseFloat(document.getElementById('compress-quality').value) || 0.8;
        const maxWidth = parseInt(document.getElementById('compress-max-width').value) || 1920;
        const maxHeight = parseInt(document.getElementById('compress-max-height').value) || 1920;
        
        updateProgress(30);
        
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: Math.max(maxWidth, maxHeight) || undefined,
            useWebWorker: true,
            fileType: file.type
        };
        
        if (quality < 1) {
            options.initialQuality = quality;
        }
        
        try {
            const compressedFile = await imageCompression(file, options);
            updateProgress(90);
            
            downloadFile(compressedFile, getFileName(file.name, 'compressed'), compressedFile.type);
            return true;
        } catch (error) {
            throw new Error('压缩失败: ' + error.message);
        }
    }
    
    // 调整图片大小
    async function resizeImage() {
        const file = uploadedFiles[0];
        const mode = document.getElementById('resize-mode').value;
        const keepAspect = document.getElementById('resize-keep-aspect').value === 'true';
        
        updateProgress(20);
        
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = function() {
                updateProgress(40);
                
                let newWidth, newHeight;
                
                if (mode === 'percentage') {
                    const percentage = parseFloat(document.getElementById('resize-value').value) / 100;
                    newWidth = Math.round(img.width * percentage);
                    newHeight = Math.round(img.height * percentage);
                } else {
                    const targetWidth = parseInt(document.getElementById('resize-value').value);
                    if (keepAspect) {
                        const ratio = targetWidth / img.width;
                        newWidth = targetWidth;
                        newHeight = Math.round(img.height * ratio);
                    } else {
                        newWidth = targetWidth;
                        newHeight = img.height;
                    }
                }
                
                updateProgress(60);
                
                const canvas = document.createElement('canvas');
                canvas.width = newWidth;
                canvas.height = newHeight;
                const ctx = canvas.getContext('2d');
                
                ctx.drawImage(img, 0, 0, newWidth, newHeight);
                
                updateProgress(80);
                
                canvas.toBlob((blob) => {
                    updateProgress(95);
                    downloadFile(blob, getFileName(file.name, 'resized'), file.type);
                    resolve(true);
                }, file.type, 0.95);
            };
            
            img.onerror = () => reject(new Error('无法加载图片'));
            img.src = URL.createObjectURL(file);
        });
    }
    
    // 裁剪图片
    async function cropImage() {
        const file = uploadedFiles[0];
        
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = function() {
                updateProgress(40);
                
                // 获取裁剪参数
                const cropWidth = document.getElementById('crop-width');
                const cropHeight = document.getElementById('crop-height');
                const cropUnit = document.getElementById('crop-unit');
                
                let targetWidth = parseInt(cropWidth?.value || img.width);
                let targetHeight = parseInt(cropHeight?.value || img.height);
                const unit = cropUnit?.value || 'px';
                
                // 如果是毫米单位，转换为像素（96 DPI）
                if (unit === 'mm') {
                    targetWidth = Math.round(targetWidth * 96 / 25.4);
                    targetHeight = Math.round(targetHeight * 96 / 25.4);
                }
                
                // 限制在图片范围内
                targetWidth = Math.min(targetWidth, img.width);
                targetHeight = Math.min(targetHeight, img.height);
                
                // 计算裁剪位置（根据图片偏移）
                // 图片偏移是相对于裁剪框左上角的偏移（负值表示图片向左/上移动）
                let x = -window.cropImageOffsetX || 0;
                let y = -window.cropImageOffsetY || 0;
                
                // 确保在图片范围内
                x = Math.max(0, Math.min(x, img.width - targetWidth));
                y = Math.max(0, Math.min(y, img.height - targetHeight));
                targetWidth = Math.min(targetWidth, img.width - x);
                targetHeight = Math.min(targetHeight, img.height - y);
                
                updateProgress(60);
                
                // 创建画布
                const canvas = document.createElement('canvas');
                canvas.width = targetWidth;
                canvas.height = targetHeight;
                const ctx = canvas.getContext('2d');
                
                // 应用旋转和翻转
                let rotation = window.cropRotation || 0;
                let flip = window.cropFlip || { h: false, v: false };
                
                if (rotation !== 0 || flip.h || flip.v) {
                    // 需要旋转或翻转，创建临时画布
                    const tempCanvas = document.createElement('canvas');
                    tempCanvas.width = img.width;
                    tempCanvas.height = img.height;
                    const tempCtx = tempCanvas.getContext('2d');
                    
                    tempCtx.save();
                    tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
                    
                    if (rotation !== 0) {
                        tempCtx.rotate(rotation * Math.PI / 180);
                    }
                    
                    if (flip.h) {
                        tempCtx.scale(-1, 1);
                    }
                    if (flip.v) {
                        tempCtx.scale(1, -1);
                    }
                    
                    tempCtx.drawImage(img, -img.width / 2, -img.height / 2);
                    tempCtx.restore();
                    
                    // 从临时画布裁剪
                    ctx.drawImage(tempCanvas, x, y, targetWidth, targetHeight, 0, 0, targetWidth, targetHeight);
                } else {
                    // 直接裁剪
                    ctx.drawImage(img, x, y, targetWidth, targetHeight, 0, 0, targetWidth, targetHeight);
                }
                
                updateProgress(80);
                
                canvas.toBlob((blob) => {
                    updateProgress(95);
                    downloadFile(blob, getFileName(file.name, 'cropped'), file.type);
                    resolve(true);
                }, file.type, 0.95);
            };
            
            img.onerror = () => reject(new Error('无法加载图片'));
            img.src = URL.createObjectURL(file);
        });
    }
    
    // 转换为JPG
    async function convertToJPG() {
        updateProgress(10);
        
        for (let i = 0; i < uploadedFiles.length; i++) {
            const file = uploadedFiles[i];
            
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = function() {
                    updateProgress(20 + (i * 70 / uploadedFiles.length));
                    
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    
                    // 填充白色背景（JPG不支持透明）
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    
                    ctx.drawImage(img, 0, 0);
                    
                    canvas.toBlob((blob) => {
                        downloadFile(blob, getFileName(file.name, null, 'jpg'), 'image/jpeg');
                        if (i === uploadedFiles.length - 1) {
                            updateProgress(100);
                            resolve(true);
                        }
                    }, 'image/jpeg', 0.9);
                };
                
                img.onerror = () => reject(new Error('无法加载图片'));
                img.src = URL.createObjectURL(file);
            });
        }
    }
    
    // 从JPG转换
    async function convertFromJPG() {
        const format = document.getElementById('convert-format').value;
        const files = uploadedFiles;
        
        updateProgress(10);
        
        if (format === 'gif' && files.length > 1) {
            // 创建动画GIF
            return new Promise((resolve, reject) => {
                const images = [];
                let loaded = 0;
                
                files.forEach((file, index) => {
                    const img = new Image();
                    img.onload = function() {
                        images[index] = img;
                        loaded++;
                        
                        if (loaded === files.length) {
                            updateProgress(50);
                            createAnimatedGIF(images, files[0].name);
                            updateProgress(100);
                            resolve(true);
                        }
                    };
                    img.onerror = () => reject(new Error('无法加载图片'));
                    img.src = URL.createObjectURL(file);
                });
            });
        } else {
            // 转换为PNG
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = function() {
                        updateProgress(20 + (i * 70 / files.length));
                        
                        const canvas = document.createElement('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext('2d');
                        
                        ctx.drawImage(img, 0, 0);
                        
                        canvas.toBlob((blob) => {
                            downloadFile(blob, getFileName(file.name, null, 'png'), 'image/png');
                            if (i === files.length - 1) {
                                updateProgress(100);
                                resolve(true);
                            }
                        }, 'image/png');
                    };
                    
                    img.onerror = () => reject(new Error('无法加载图片'));
                    img.src = URL.createObjectURL(file);
                });
            }
        }
    }
    
    // 创建动画GIF（简化版）
    function createAnimatedGIF(images, originalName) {
        // 注意：完整的GIF动画需要专门的库，这里使用简化实现
        // 实际应用中可以使用 gif.js 或类似的库
        alert('动画GIF功能需要额外的库支持。当前版本将下载第一张图片为PNG格式。');
        
        const canvas = document.createElement('canvas');
        canvas.width = images[0].width;
        canvas.height = images[0].height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(images[0], 0, 0);
        
        canvas.toBlob((blob) => {
            downloadFile(blob, getFileName(originalName, 'animated', 'png'), 'image/png');
        }, 'image/png');
    }
    
    // 编辑图片
    async function editImage() {
        const file = uploadedFiles[0];
        const text = document.getElementById('editor-text').value;
        const fontSize = parseInt(document.getElementById('editor-font-size').value) || 24;
        const textColor = document.getElementById('editor-text-color').value;
        const x = parseInt(document.getElementById('editor-x').value) || 50;
        const y = parseInt(document.getElementById('editor-y').value) || 50;
        const border = document.getElementById('editor-border').value;
        const borderWidth = parseInt(document.getElementById('editor-border-width').value) || 5;
        const borderColor = document.getElementById('editor-border-color').value;
        
        updateProgress(20);
        
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = function() {
                updateProgress(40);
                
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                
                ctx.drawImage(img, 0, 0);
                
                // 添加边框
                if (border !== 'none') {
                    ctx.strokeStyle = borderColor;
                    ctx.lineWidth = borderWidth;
                    
                    if (border === 'dashed') {
                        ctx.setLineDash([10, 5]);
                    } else if (border === 'dotted') {
                        ctx.setLineDash([2, 2]);
                    }
                    
                    ctx.strokeRect(borderWidth / 2, borderWidth / 2, 
                                  canvas.width - borderWidth, canvas.height - borderWidth);
                    ctx.setLineDash([]);
                }
                
                // 添加文字
                if (text) {
                    ctx.font = `${fontSize}px Arial`;
                    ctx.fillStyle = textColor;
                    ctx.fillText(text, x, y);
                }
                
                updateProgress(80);
                
                canvas.toBlob((blob) => {
                    updateProgress(95);
                    downloadFile(blob, getFileName(file.name, 'edited'), file.type);
                    resolve(true);
                }, file.type, 0.95);
            };
            
            img.onerror = () => reject(new Error('无法加载图片'));
            img.src = URL.createObjectURL(file);
        });
    }
    
    // 提升图片质量（放大）
    async function enhanceImage() {
        const file = uploadedFiles[0];
        const scale = parseFloat(document.getElementById('enhance-scale').value) || 2;
        
        updateProgress(20);
        
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = function() {
                updateProgress(40);
                
                const canvas = document.createElement('canvas');
                canvas.width = img.width * scale;
                canvas.height = img.height * scale;
                const ctx = canvas.getContext('2d');
                
                // 使用图像平滑算法提高质量
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                updateProgress(80);
                
                canvas.toBlob((blob) => {
                    updateProgress(95);
                    downloadFile(blob, getFileName(file.name, 'enhanced'), file.type);
                    resolve(true);
                }, file.type, 0.95);
            };
            
            img.onerror = () => reject(new Error('无法加载图片'));
            img.src = URL.createObjectURL(file);
        });
    }
    
    // 去除背景（简化版，使用颜色范围）
    async function removeBackground() {
        const file = uploadedFiles[0];
        
        updateProgress(20);
        
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = function() {
                updateProgress(40);
                
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                
                ctx.drawImage(img, 0, 0);
                
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                
                // 简单的背景去除：假设边缘颜色是背景色
                const edgeColor = getEdgeColor(data, canvas.width, canvas.height);
                const threshold = 30; // 颜色相似度阈值
                
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    
                    const diff = Math.abs(r - edgeColor.r) + 
                                Math.abs(g - edgeColor.g) + 
                                Math.abs(b - edgeColor.b);
                    
                    if (diff < threshold) {
                        data[i + 3] = 0; // 设置为透明
                    }
                }
                
                ctx.putImageData(imageData, 0, 0);
                
                updateProgress(80);
                
                canvas.toBlob((blob) => {
                    updateProgress(95);
                    downloadFile(blob, getFileName(file.name, 'no-bg', 'png'), 'image/png');
                    resolve(true);
                }, 'image/png');
            };
            
            img.onerror = () => reject(new Error('无法加载图片'));
            img.src = URL.createObjectURL(file);
        });
    }
    
    // 获取边缘颜色（用于背景去除）
    function getEdgeColor(data, width, height) {
        let r = 0, g = 0, b = 0, count = 0;
        
        // 采样边缘像素
        for (let i = 0; i < width; i++) {
            const idx = i * 4;
            r += data[idx];
            g += data[idx + 1];
            b += data[idx + 2];
            count++;
        }
        
        for (let i = 0; i < width; i++) {
            const idx = ((height - 1) * width + i) * 4;
            r += data[idx];
            g += data[idx + 1];
            b += data[idx + 2];
            count++;
        }
        
        return {
            r: Math.round(r / count),
            g: Math.round(g / count),
            b: Math.round(b / count)
        };
    }
    
    // 添加水印（参考watermark.js实现）
    async function addWatermark() {
        const file = uploadedFiles[0];
        const watermarkText = document.getElementById('watermark-text').value;
        
        if (!watermarkText) {
            alert('请输入水印文字');
            return false;
        }
        
        updateProgress(20);
        
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = function() {
                updateProgress(40);
                
                try {
                    // 获取水印参数
                    const watermarkColor = document.getElementById('watermark-color').value;
                    const watermarkOpacity = parseInt(document.getElementById('watermark-opacity').value) / 100;
                    const watermarkFontSize = parseInt(document.getElementById('watermark-font-size').value);
                    const watermarkSpacing = parseInt(document.getElementById('watermark-spacing').value);
                    const watermarkAngle = parseInt(document.getElementById('watermark-angle').value);
                    
                    // 创建canvas来处理图片
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // 设置canvas尺寸与原图一致
                    canvas.width = img.width;
                    canvas.height = img.height;
                    
                    // 绘制原图
                    ctx.drawImage(img, 0, 0);
                    
                    // 设置水印样式
                    ctx.fillStyle = hexToRgbA(watermarkColor, watermarkOpacity);
                    ctx.font = `${watermarkFontSize}px Arial`;
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'top';
                    
                    // 保存当前状态
                    ctx.save();
                    
                    // 移动到画布中心进行旋转
                    ctx.translate(canvas.width / 2, canvas.height / 2);
                    ctx.rotate(watermarkAngle * Math.PI / 180);
                    
                    // 计算水印文本的尺寸
                    const textWidth = ctx.measureText(watermarkText).width;
                    
                    // 绘制水印（重复平铺效果）
                    const startX = -canvas.width / 2;
                    const startY = -canvas.height / 2;
                    const endX = canvas.width / 2;
                    const endY = canvas.height / 2;
                    
                    for (let y = startY; y < endY; y += watermarkSpacing + watermarkFontSize) {
                        for (let x = startX; x < endX; x += watermarkSpacing + textWidth) {
                            ctx.fillText(watermarkText, x, y);
                        }
                    }
                    
                    // 恢复状态
                    ctx.restore();
                    
                    updateProgress(80);
                    
                    // 将结果保存为图片
                    canvas.toBlob((blob) => {
                        updateProgress(95);
                        downloadFile(blob, getFileName(file.name, 'watermarked'), file.type);
                        resolve(true);
                    }, file.type, 0.95);
                } catch (error) {
                    reject(new Error('添加水印时出错: ' + error.message));
                }
            };
            
            img.onerror = () => reject(new Error('无法加载图片'));
            img.src = URL.createObjectURL(file);
        });
    }
    
    // 将十六进制颜色转换为RGBA
    function hexToRgbA(hex, opacity) {
        let c;
        if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
            c = hex.substring(1).split('');
            if (c.length === 3) {
                c = [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c = '0x' + c.join('');
            return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + opacity + ')';
        }
        return 'rgba(204, 204, 204, ' + opacity + ')';
    }
    
    // 旋转图片
    async function rotateImage() {
        const angle = parseInt(document.getElementById('rotate-angle').value);
        const files = uploadedFiles;
        
        updateProgress(10);
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            await new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = function() {
                    updateProgress(20 + (i * 70 / files.length));
                    
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // 计算旋转后的尺寸
                    const rad = (angle * Math.PI) / 180;
                    const cos = Math.abs(Math.cos(rad));
                    const sin = Math.abs(Math.sin(rad));
                    
                    canvas.width = img.width * cos + img.height * sin;
                    canvas.height = img.width * sin + img.height * cos;
                    
                    ctx.translate(canvas.width / 2, canvas.height / 2);
                    ctx.rotate(rad);
                    ctx.drawImage(img, -img.width / 2, -img.height / 2);
                    
                    canvas.toBlob((blob) => {
                        downloadFile(blob, getFileName(file.name, 'rotated'), file.type);
                        if (i === files.length - 1) {
                            updateProgress(100);
                        }
                        resolve();
                    }, file.type, 0.95);
                };
                
                img.onerror = () => reject(new Error('无法加载图片'));
                img.src = URL.createObjectURL(file);
            });
        }
        
        return true;
    }
    
    // HTML转图片（参考iloveimg实现 - URL截图）
    async function htmlToImage() {
        if (typeof html2canvas === 'undefined') {
            alert('html2canvas库未加载，请刷新页面重试');
            return false;
        }
        
        const url = document.getElementById('html-url').value.trim();
        if (!url) {
            const urlError = document.getElementById('html-url-error');
            if (urlError) urlError.style.display = 'block';
            alert('请输入网站URL');
            return false;
        }
        
        // 验证URL格式
        if (!isValidUrl(url)) {
            const urlError = document.getElementById('html-url-error');
            if (urlError) urlError.style.display = 'block';
            alert('URL格式不正确，请检查输入');
            return false;
        }
        
        const screenSize = parseInt(document.getElementById('html-screen-size').value) || 1920;
        const format = document.getElementById('html-output-format').value;
        const loadingStatus = document.getElementById('html-loading-status');
        const previewContainer = document.getElementById('html-preview-container');
        
        // 显示加载状态
        if (loadingStatus) {
            loadingStatus.style.display = 'block';
            loadingStatus.innerHTML = `
                <div style="font-size: 14px; color: #1976d2;">正在访问 URL...</div>
                <div style="font-size: 12px; color: #666; margin-top: 5px;">这可能需要一会儿...</div>
                <div style="font-size: 12px; color: #666; margin-top: 5px;">我们将扫描所有的URL内容以便为你提供最佳的转换质量。</div>
            `;
        }
        if (previewContainer) previewContainer.style.display = 'none';
        
        updateProgress(10);
        
        try {
            // 由于浏览器跨域限制，无法直接通过iframe加载外部URL
            // 这里尝试使用CORS代理服务，或者提示用户使用服务端方案
            
            // 方案1：尝试使用iframe（仅同源URL有效）
            const urlObj = new URL(url);
            const currentOrigin = window.location.origin;
            
            if (urlObj.origin === currentOrigin) {
                // 同源URL，可以直接使用iframe
                return await captureUrlWithIframe(url, screenSize, format, loadingStatus, previewContainer);
            } else {
                // 跨域URL，尝试多种方法
                updateProgress(20);
                
                // 方法1：尝试直接使用iframe（即使跨域，html2canvas也可能工作）
                try {
                    if (loadingStatus) {
                        loadingStatus.innerHTML = `
                            <div style="font-size: 14px; color: #1976d2;">正在尝试加载URL...</div>
                            <div style="font-size: 12px; color: #666; margin-top: 5px;">请稍候...</div>
                        `;
                    }
                    
                    const result = await captureUrlWithIframe(url, screenSize, format, loadingStatus, previewContainer);
                    if (result) return true;
                } catch (iframeError) {
                    console.log('iframe方法失败，尝试代理:', iframeError);
                }
                
                // 方法2：尝试使用多个CORS代理服务
                const proxyServices = [
                    `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
                    `https://corsproxy.io/?${encodeURIComponent(url)}`,
                    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`
                ];
                
                for (let i = 0; i < proxyServices.length; i++) {
                    try {
                        updateProgress(30 + i * 10);
                        
                        if (loadingStatus) {
                            loadingStatus.innerHTML = `
                                <div style="font-size: 14px; color: #1976d2;">正在通过代理服务访问URL (${i + 1}/${proxyServices.length})...</div>
                                <div style="font-size: 12px; color: #666; margin-top: 5px;">请稍候...</div>
                            `;
                        }
                        
                        const response = await fetch(proxyServices[i], {
                            method: 'GET',
                            headers: {
                                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                            }
                        });
                        
                        let htmlContent = null;
                        
                        // 处理不同的代理响应格式
                        if (proxyServices[i].includes('allorigins.win')) {
                            const data = await response.json();
                            htmlContent = data.contents;
                        } else if (proxyServices[i].includes('corsproxy.io')) {
                            htmlContent = await response.text();
                        } else if (proxyServices[i].includes('codetabs.com')) {
                            htmlContent = await response.text();
                        }
                        
                        if (htmlContent) {
                            updateProgress(60);
                            
                            // 创建临时容器显示HTML内容
                            const container = document.createElement('div');
                            container.style.width = screenSize + 'px';
                            container.style.position = 'absolute';
                            container.style.left = '-9999px';
                            container.style.top = '0';
                            container.style.background = 'white';
                            container.style.overflow = 'auto';
                            
                            // 创建iframe来加载HTML内容（更好的渲染）
                            const iframe = document.createElement('iframe');
                            iframe.style.width = screenSize + 'px';
                            iframe.style.height = '2000px';
                            iframe.style.border = 'none';
                            container.appendChild(iframe);
                            document.body.appendChild(container);
                            
                            // 写入HTML内容到iframe
                            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                            iframeDoc.open();
                            iframeDoc.write(htmlContent);
                            iframeDoc.close();
                            
                            // 等待内容渲染
                            await new Promise(resolve => setTimeout(resolve, 2000));
                            
                            // 等待iframe加载完成
                            await new Promise((resolve) => {
                                if (iframe.contentWindow) {
                                    iframe.contentWindow.onload = resolve;
                                    setTimeout(resolve, 3000); // 超时保护
                                } else {
                                    resolve();
                                }
                            });
                            
                            updateProgress(70);
                            
                            if (loadingStatus) {
                                loadingStatus.innerHTML = `
                                    <div style="font-size: 14px; color: #1976d2;">正在将HTML转换为图片...</div>
                                    <div style="font-size: 12px; color: #666; margin-top: 5px;">正在处理</div>
                                `;
                            }
                            
                            // 获取iframe的实际内容高度
                            const body = iframeDoc.body;
                            const html = iframeDoc.documentElement;
                            const height = Math.max(
                                body.scrollHeight, body.offsetHeight,
                                html.clientHeight, html.scrollHeight, html.offsetHeight
                            );
                            
                            const canvas = await html2canvas(body || html, {
                                width: screenSize,
                                height: Math.min(height, 10000), // 限制最大高度
                                useCORS: true,
                                allowTaint: true,
                                scale: 1,
                                logging: false,
                                windowWidth: screenSize,
                                windowHeight: height
                            });
                            
                            document.body.removeChild(container);
                            
                            updateProgress(90);
                            
                            if (loadingStatus) loadingStatus.style.display = 'none';
                            
                            // 显示预览
                            const previewImage = document.getElementById('html-preview-image');
                            if (previewContainer && previewImage) {
                                previewImage.src = canvas.toDataURL();
                                previewContainer.style.display = 'block';
                            }
                            
                            const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
                            canvas.toBlob((blob) => {
                                downloadFile(blob, `html-to-image.${format}`, mimeType);
                            }, mimeType, format === 'jpg' ? 0.9 : 1.0);
                            
                            updateProgress(100);
                            return true;
                        }
                    } catch (proxyError) {
                        console.error(`代理服务 ${i + 1} 失败:`, proxyError);
                        // 继续尝试下一个代理
                        continue;
                    }
                }
                
                // 所有方法都失败，提示用户
                if (loadingStatus) loadingStatus.style.display = 'none';
                alert('由于浏览器安全限制，无法直接访问跨域URL进行截图。\n\n建议：\n1. 使用浏览器扩展（如Full Page Screen Capture）\n2. 使用服务端API（如Puppeteer）\n3. 或者将网页保存为HTML文件后使用"上传文件"功能');
                return false;
            }
        } catch (error) {
            if (loadingStatus) loadingStatus.style.display = 'none';
            alert('HTML转图片失败: ' + error.message);
            return false;
        }
    }
    
    // 使用iframe截图（尝试跨域URL）
    async function captureUrlWithIframe(url, screenSize, format, loadingStatus, previewContainer) {
        return new Promise((resolve, reject) => {
            updateProgress(20);
            
            const iframe = document.createElement('iframe');
            iframe.style.width = screenSize + 'px';
            iframe.style.height = '2000px';
            iframe.style.border = 'none';
            iframe.style.position = 'absolute';
            iframe.style.left = '-9999px';
            iframe.style.top = '0';
            document.body.appendChild(iframe);
            
            let resolved = false;
            const timeout = setTimeout(() => {
                if (!resolved) {
                    resolved = true;
                    document.body.removeChild(iframe);
                    reject(new Error('加载超时'));
                }
            }, 30000); // 30秒超时
            
            iframe.onload = async function() {
                if (resolved) return;
                
                updateProgress(50);
                
                if (loadingStatus) {
                    loadingStatus.innerHTML = `
                        <div style="font-size: 14px; color: #1976d2;">正在将HTML转换为图片...</div>
                        <div style="font-size: 12px; color: #666; margin-top: 5px;">正在处理</div>
                    `;
                }
                
                try {
                    // 等待页面完全加载
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    
                    updateProgress(60);
                    
                    // 尝试访问iframe内容（可能因为跨域失败）
                    let body, html, height;
                    try {
                        body = iframe.contentDocument?.body;
                        html = iframe.contentDocument?.documentElement;
                        if (!body || !html) {
                            throw new Error('无法访问iframe内容（跨域限制）');
                        }
                        height = Math.max(
                            body.scrollHeight, body.offsetHeight,
                            html.clientHeight, html.scrollHeight, html.offsetHeight
                        );
                    } catch (accessError) {
                        // 如果无法访问内容，尝试直接截图iframe元素
                        const canvas = await html2canvas(iframe, {
                            width: screenSize,
                            useCORS: true,
                            allowTaint: true,
                            scale: 1,
                            logging: false
                        });
                        
                        clearTimeout(timeout);
                        resolved = true;
                        document.body.removeChild(iframe);
                        
                        updateProgress(90);
                        
                        if (loadingStatus) loadingStatus.style.display = 'none';
                        
                        // 显示预览
                        const previewImage = document.getElementById('html-preview-image');
                        if (previewContainer && previewImage) {
                            previewImage.src = canvas.toDataURL();
                            previewContainer.style.display = 'block';
                        }
                        
                        const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
                        canvas.toBlob((blob) => {
                            downloadFile(blob, `html-to-image.${format}`, mimeType);
                            resolve(true);
                        }, mimeType, format === 'jpg' ? 0.9 : 1.0);
                        return;
                    }
                    
                    // 使用html2canvas截图
                    const canvas = await html2canvas(body, {
                        width: screenSize,
                        height: Math.min(height, 10000), // 限制最大高度
                        useCORS: true,
                        allowTaint: true,
                        scale: 1,
                        logging: false,
                        windowWidth: screenSize,
                        windowHeight: height
                    });
                    
                    clearTimeout(timeout);
                    resolved = true;
                    document.body.removeChild(iframe);
                    
                    updateProgress(90);
                    
                    if (loadingStatus) loadingStatus.style.display = 'none';
                    
                    // 显示预览
                    const previewImage = document.getElementById('html-preview-image');
                    if (previewContainer && previewImage) {
                        previewImage.src = canvas.toDataURL();
                        previewContainer.style.display = 'block';
                    }
                    
                    const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
                    canvas.toBlob((blob) => {
                        downloadFile(blob, `html-to-image.${format}`, mimeType);
                        resolve(true);
                    }, mimeType, format === 'jpg' ? 0.9 : 1.0);
                } catch (error) {
                    clearTimeout(timeout);
                    if (!resolved) {
                        resolved = true;
                        document.body.removeChild(iframe);
                        if (loadingStatus) loadingStatus.style.display = 'none';
                        reject(new Error('转换失败: ' + error.message));
                    }
                }
            };
            
            iframe.onerror = () => {
                clearTimeout(timeout);
                if (!resolved) {
                    resolved = true;
                    document.body.removeChild(iframe);
                    if (loadingStatus) loadingStatus.style.display = 'none';
                    reject(new Error('无法加载URL'));
                }
            };
            
            iframe.src = url;
        });
    }
    
    // URL验证函数
    function isValidUrl(string) {
        try {
            const url = new URL(string);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch (_) {
            return false;
        }
    }
    
    // 模糊图片
    async function blurImage() {
        const file = uploadedFiles[0];
        const mode = document.getElementById('blur-mode').value;
        const intensity = parseInt(document.getElementById('blur-intensity').value) || 10;
        
        updateProgress(20);
        
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = function() {
                updateProgress(40);
                
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                
                ctx.drawImage(img, 0, 0);
                
                if (mode === 'full') {
                    // 模糊整张图片
                    ctx.filter = `blur(${intensity}px)`;
                    ctx.drawImage(img, 0, 0);
                } else if (mode === 'manual') {
                    // 手动选择区域（简化实现：模糊中心区域）
                    const centerX = canvas.width / 2;
                    const centerY = canvas.height / 2;
                    const radius = Math.min(canvas.width, canvas.height) / 4;
                    
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                    ctx.clip();
                    ctx.filter = `blur(${intensity}px)`;
                    ctx.drawImage(img, 0, 0);
                    ctx.restore();
                } else {
                    // 自动检测面部（简化实现：模糊中心区域）
                    const centerX = canvas.width / 2;
                    const centerY = canvas.height / 2;
                    const radius = Math.min(canvas.width, canvas.height) / 6;
                    
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                    ctx.clip();
                    ctx.filter = `blur(${intensity}px)`;
                    ctx.drawImage(img, 0, 0);
                    ctx.restore();
                }
                
                ctx.filter = 'none';
                
                updateProgress(80);
                
                canvas.toBlob((blob) => {
                    updateProgress(95);
                    downloadFile(blob, getFileName(file.name, 'blurred'), file.type);
                    resolve(true);
                }, file.type, 0.95);
            };
            
            img.onerror = () => reject(new Error('无法加载图片'));
            img.src = URL.createObjectURL(file);
        });
    }
    
    // 获取文件名（添加后缀）
    // 存储处理后的文件列表
    let processedFiles = [];
    
    function getFileName(originalName, suffix, newExt) {
        const lastDot = originalName.lastIndexOf('.');
        const name = lastDot > 0 ? originalName.substring(0, lastDot) : originalName;
        const ext = newExt || (lastDot > 0 ? originalName.substring(lastDot + 1) : 'jpg');
        const suffixStr = suffix ? '_' + suffix : '';
        
        // 添加时间戳（年-月-日-时-分-秒）
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hour = String(now.getHours()).padStart(2, '0');
        const minute = String(now.getMinutes()).padStart(2, '0');
        const second = String(now.getSeconds()).padStart(2, '0');
        const timestamp = `${year}${month}${day}${hour}${minute}${second}`;
        
        return `${name}${suffixStr}_${timestamp}.${ext}`;
    }
    
    // 下载文件
    function downloadFile(blob, filename, mimeType, addToDownloadList = true) {
        // 添加到下载列表（克隆blob，因为原始blob在下载后会被释放）
        if (addToDownloadList) {
            const blobClone = blob.slice(0, blob.size, blob.type);
            processedFiles.push({
                blob: blobClone,
                filename: filename,
                mimeType: mimeType
            });
            
            // 显示下载所有按钮
            const downloadAllBtn = document.getElementById('download-all-btn');
            if (downloadAllBtn && processedFiles.length > 0) {
                downloadAllBtn.style.display = 'block';
            }
        }
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 100);
    }
    
    // 下载所有文件
    window.downloadAllFiles = function() {
        if (processedFiles.length === 0) {
            alert('没有可下载的文件');
            return;
        }
        
        // 逐个下载文件，添加延迟避免浏览器阻止
        processedFiles.forEach((file, index) => {
            setTimeout(() => {
                downloadFile(file.blob, file.filename, file.mimeType, false);
            }, index * 300); // 每个文件延迟300ms
        });
        
        // 清空列表
        processedFiles = [];
        const downloadAllBtn = document.getElementById('download-all-btn');
        if (downloadAllBtn) {
            downloadAllBtn.style.display = 'none';
        }
    };
    
    // 点击模态框外部关闭
    window.onclick = function(event) {
        const modal = document.getElementById('tool-modal');
        if (event.target === modal) {
            closeToolModal();
        }
    };
    
    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSearch);
    } else {
        initSearch();
    }
})();

