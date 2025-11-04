// PDF工具功能实现
(function() {
    'use strict';
    
    // 工具配置
    const toolConfigs = {
        merge: {
            title: '合并PDF',
            description: '选择多个PDF文件合并成一个',
            multiple: true,
            accept: '.pdf'
        },
        split: {
            title: '拆分PDF',
            description: '将一个PDF文件拆分成多个独立的PDF文件',
            multiple: false,
            accept: '.pdf'
        },
        compress: {
            title: '压缩PDF',
            description: '减小PDF文件大小',
            multiple: false,
            accept: '.pdf'
        },
        rotate: {
            title: '旋转PDF页面',
            description: '旋转PDF文件的页面方向',
            multiple: false,
            accept: '.pdf'
        },
        delete: {
            title: '删除PDF页面',
            description: '从PDF中删除指定的页面',
            multiple: false,
            accept: '.pdf'
        },
        extract: {
            title: '提取PDF页面',
            description: '从PDF中提取指定的页面',
            multiple: false,
            accept: '.pdf'
        },
        images2pdf: {
            title: '图片转PDF',
            description: '将多张图片合并成一个PDF文件',
            multiple: true,
            accept: 'image/*'
        },
        pdf2images: {
            title: 'PDF转图片',
            description: '将PDF的每一页转换为图片',
            multiple: false,
            accept: '.pdf'
        },
        watermark: {
            title: '添加水印',
            description: '在PDF页面上添加文字水印',
            multiple: false,
            accept: '.pdf'
        },
        reorder: {
            title: '重新排列页面',
            description: '重新排列PDF页面的顺序',
            multiple: false,
            accept: '.pdf'
        },
        edit: {
            title: '编辑PDF',
            description: '在PDF中添加文本、形状等元素',
            multiple: false,
            accept: '.pdf'
        },
        sign: {
            title: '签署PDF',
            description: '在PDF中添加签名（图片或手写）',
            multiple: false,
            accept: '.pdf'
        },
        crop: {
            title: '裁剪PDF',
            description: '裁剪PDF页面的边缘',
            multiple: false,
            accept: '.pdf'
        },
        'extract-images': {
            title: '从PDF提取图片',
            description: '从PDF文件中提取所有图片',
            multiple: false,
            accept: '.pdf'
        },
        pagenumbers: {
            title: '添加页码',
            description: '在PDF页面底部添加页码',
            multiple: false,
            accept: '.pdf'
        },
        overlay: {
            title: 'PDF叠加',
            description: '将一个PDF叠加到另一个PDF上（需要上传两个PDF文件）',
            multiple: true,
            accept: '.pdf'
        },
        annotate: {
            title: '注释PDF',
            description: '在PDF上添加注释和标记',
            multiple: false,
            accept: '.pdf'
        },
        ocr: {
            title: 'PDF文本识别',
            description: '识别PDF中的文字（OCR）',
            multiple: false,
            accept: '.pdf'
        },
        'pdf-to-word': {
            title: 'PDF转Word',
            description: '将PDF转换为Word文档',
            multiple: false,
            accept: '.pdf'
        }
    };
    
    // 全局变量
    let uploadedFiles = [];
    let currentTool = null;
    
    // 初始化搜索功能
    function initSearch() {
        const searchInput = document.getElementById('search-input');
        const toolCards = document.querySelectorAll('.pdf-tool-card');
        const sections = document.querySelectorAll('.pdf-tools-section');
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
                const cards = section.querySelectorAll('.pdf-tool-card');
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
        const config = toolConfigs[toolType];
        if (!config) return;
        
        const modal = document.getElementById('tool-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalContent = document.getElementById('modal-content');
        
        modalTitle.textContent = config.title;
        modalContent.innerHTML = generateModalContent(toolType, config);
        modal.style.display = 'block';
        
        // 初始化文件上传
        initFileUpload(toolType, config);
        
        // 初始化水印透明度滑块
        if (toolType === 'watermark') {
            const opacitySlider = document.getElementById('watermark-opacity');
            const opacityValue = document.getElementById('watermark-opacity-value');
            if (opacitySlider && opacityValue) {
                opacitySlider.addEventListener('input', function() {
                    const value = Math.round(parseFloat(this.value) * 100);
                    opacityValue.textContent = value + '%';
                });
            }
        }
    };
    
    // 关闭工具模态框
    window.closeToolModal = function() {
        const modal = document.getElementById('tool-modal');
        modal.style.display = 'none';
        uploadedFiles = [];
        currentTool = null;
    };
    
    // 生成模态框内容
    function generateModalContent(toolType, config) {
        let html = `<p style="color: #666; margin-bottom: 20px;">${config.description}</p>`;
        
        html += `
            <div class="file-upload-area" id="upload-area">
                <div style="font-size: 48px; margin-bottom: 15px;">📁</div>
                <div style="font-size: 16px; color: #666; margin-bottom: 10px;">
                    点击或拖拽文件到此处
                </div>
                <div style="font-size: 14px; color: #999;">
                    ${config.multiple ? '支持选择多个文件' : '仅支持单个文件'}
                </div>
                <input type="file" id="file-input" class="file-input" 
                       accept="${config.accept}" 
                       ${config.multiple ? 'multiple' : ''}>
            </div>
            <div class="file-list" id="file-list"></div>
            <div id="tool-options"></div>
            <button class="process-btn" id="process-btn" onclick="processPDF()" disabled>
                处理PDF
            </button>
            <div class="progress-bar" id="progress-bar">
                <div class="progress-fill" id="progress-fill"></div>
            </div>
            <div class="result-info" id="result-info"></div>
        `;
        
        // 根据工具类型添加特定选项
        if (toolType === 'rotate') {
            html += `
                <div class="form-group" style="margin-top: 20px;">
                    <label>旋转角度：</label>
                    <select id="rotate-angle" style="width: 100%; padding: 10px; margin-top: 8px;">
                        <option value="90">顺时针90度</option>
                        <option value="180">180度</option>
                        <option value="270">逆时针90度</option>
                    </select>
                </div>
            `;
        }
        
        if (toolType === 'delete' || toolType === 'extract') {
            html += `
                <div class="form-group" style="margin-top: 20px;">
                    <label>页面范围（例如：1,3-5,10）：</label>
                    <input type="text" id="page-range" placeholder="1,3-5,10" 
                           style="width: 100%; padding: 10px; margin-top: 8px;">
                </div>
            `;
        }
        
        if (toolType === 'watermark') {
            html += `
                <div class="form-group" style="margin-top: 20px;">
                    <label>水印文字：</label>
                    <input type="text" id="watermark-text" placeholder="输入水印文字" 
                           style="width: 100%; padding: 10px; margin-top: 8px;">
                </div>
                <div class="form-group" style="margin-top: 15px;">
                    <label>字体大小：</label>
                    <input type="number" id="watermark-size" value="24" min="12" max="72"
                           style="width: 100%; padding: 10px; margin-top: 8px;">
                </div>
                <div class="form-group" style="margin-top: 15px;">
                    <label>水印颜色：</label>
                    <input type="color" id="watermark-color" value="#B3B3B3" 
                           style="width: 100%; padding: 10px; margin-top: 8px; height: 50px; cursor: pointer;">
                </div>
                <div class="form-group" style="margin-top: 15px;">
                    <label>透明度：</label>
                    <input type="range" id="watermark-opacity" min="0.1" max="1" step="0.1" value="0.3"
                           style="width: 100%; margin-top: 8px;">
                    <span id="watermark-opacity-value" style="display: inline-block; margin-top: 5px;">30%</span>
                </div>
            `;
        }
        
        if (toolType === 'edit') {
            html += `
                <div class="form-group" style="margin-top: 20px;">
                    <label>文本内容：</label>
                    <input type="text" id="edit-text" placeholder="输入要添加的文本" 
                           style="width: 100%; padding: 10px; margin-top: 8px;">
                </div>
                <div class="form-group" style="margin-top: 15px;">
                    <label>字体大小：</label>
                    <input type="number" id="edit-size" value="24" min="10" max="72"
                           style="width: 100%; padding: 10px; margin-top: 8px;">
                </div>
                <div class="form-group" style="margin-top: 15px;">
                    <label>X坐标：</label>
                    <input type="number" id="edit-x" value="50" min="0"
                           style="width: 100%; padding: 10px; margin-top: 8px;">
                </div>
                <div class="form-group" style="margin-top: 15px;">
                    <label>Y坐标：</label>
                    <input type="number" id="edit-y" value="50" min="0"
                           style="width: 100%; padding: 10px; margin-top: 8px;">
                </div>
            `;
        }
        
        if (toolType === 'sign') {
            html += `
                <div class="form-group" style="margin-top: 20px;">
                    <label>上传签名图片：</label>
                    <input type="file" id="signature-input" accept="image/*" 
                           style="width: 100%; padding: 10px; margin-top: 8px;">
                </div>
                <div class="form-group" style="margin-top: 15px;">
                    <label>X坐标：</label>
                    <input type="number" id="sign-x" value="50" min="0"
                           style="width: 100%; padding: 10px; margin-top: 8px;">
                </div>
                <div class="form-group" style="margin-top: 15px;">
                    <label>Y坐标：</label>
                    <input type="number" id="sign-y" value="50" min="0"
                           style="width: 100%; padding: 10px; margin-top: 8px;">
                </div>
                <div class="form-group" style="margin-top: 15px;">
                    <label>宽度：</label>
                    <input type="number" id="sign-width" value="100" min="10"
                           style="width: 100%; padding: 10px; margin-top: 8px;">
                </div>
                <div class="form-group" style="margin-top: 15px;">
                    <label>高度：</label>
                    <input type="number" id="sign-height" value="50" min="10"
                           style="width: 100%; padding: 10px; margin-top: 8px;">
                </div>
            `;
        }
        
        
        if (toolType === 'crop') {
            html += `
                <div class="form-group" style="margin-top: 20px;">
                    <label>上边距（像素）：</label>
                    <input type="number" id="crop-top" value="0" min="0"
                           style="width: 100%; padding: 10px; margin-top: 8px;">
                </div>
                <div class="form-group" style="margin-top: 15px;">
                    <label>右边距（像素）：</label>
                    <input type="number" id="crop-right" value="0" min="0"
                           style="width: 100%; padding: 10px; margin-top: 8px;">
                </div>
                <div class="form-group" style="margin-top: 15px;">
                    <label>下边距（像素）：</label>
                    <input type="number" id="crop-bottom" value="0" min="0"
                           style="width: 100%; padding: 10px; margin-top: 8px;">
                </div>
                <div class="form-group" style="margin-top: 15px;">
                    <label>左边距（像素）：</label>
                    <input type="number" id="crop-left" value="0" min="0"
                           style="width: 100%; padding: 10px; margin-top: 8px;">
                </div>
            `;
        }
        
        if (toolType === 'pagenumbers') {
            html += `
                <div class="form-group" style="margin-top: 20px;">
                    <label>页码位置：</label>
                    <select id="page-number-position" style="width: 100%; padding: 10px; margin-top: 8px;">
                        <option value="bottom-center">底部居中</option>
                        <option value="bottom-right">底部右侧</option>
                        <option value="top-center">顶部居中</option>
                    </select>
                </div>
                <div class="form-group" style="margin-top: 15px;">
                    <label>字体大小：</label>
                    <input type="number" id="page-number-size" value="12" min="8" max="24"
                           style="width: 100%; padding: 10px; margin-top: 8px;">
                </div>
                <div class="form-group" style="margin-top: 15px;">
                    <label>起始页码：</label>
                    <input type="number" id="page-number-start" value="1" min="1"
                           style="width: 100%; padding: 10px; margin-top: 8px;">
                </div>
            `;
        }
        
        if (toolType === 'overlay') {
            html += `
                <div class="form-group" style="margin-top: 20px; color: #666;">
                    <p>请上传两个PDF文件，第二个PDF将叠加到第一个PDF上</p>
                </div>
            `;
        }
        
        if (toolType === 'annotate') {
            html += `
                <div class="form-group" style="margin-top: 20px;">
                    <label>注释内容：</label>
                    <input type="text" id="annotation-text" placeholder="输入注释" 
                           style="width: 100%; padding: 10px; margin-top: 8px;">
                </div>
                <div class="form-group" style="margin-top: 15px;">
                    <label>页面编号：</label>
                    <input type="number" id="annotation-page" value="1" min="1"
                           style="width: 100%; padding: 10px; margin-top: 8px;">
                </div>
                <div class="form-group" style="margin-top: 15px;">
                    <label>X坐标：</label>
                    <input type="number" id="annotation-x" value="50" min="0"
                           style="width: 100%; padding: 10px; margin-top: 8px;">
                </div>
                <div class="form-group" style="margin-top: 15px;">
                    <label>Y坐标：</label>
                    <input type="number" id="annotation-y" value="50" min="0"
                           style="width: 100%; padding: 10px; margin-top: 8px;">
                </div>
            `;
        }
        
        if (toolType === 'reorder') {
            html += `
                <div class="form-group" style="margin-top: 20px;">
                    <label>新的页面顺序（用逗号分隔，例如：3,1,2,5,4）：</label>
                    <input type="text" id="reorder-sequence" placeholder="3,1,2,5,4" 
                           style="width: 100%; padding: 10px; margin-top: 8px;">
                </div>
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
        
        function handleFiles(files, toolType) {
            if (!config.multiple && files.length > 1) {
                alert('此工具仅支持单个文件');
                files = [files[0]];
            }
            
            uploadedFiles = files;
            displayFileList();
            
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
                    <span class="file-name">${file.name}</span>
                    <span class="file-remove" onclick="removeFile(${index})">×</span>
                `;
                fileList.appendChild(fileItem);
            });
        }
        
        window.removeFile = function(index) {
            uploadedFiles.splice(index, 1);
            displayFileList();
            if (uploadedFiles.length === 0) {
                processBtn.disabled = true;
            }
        };
    }
    
    // 处理PDF
    window.processPDF = async function() {
        if (uploadedFiles.length === 0) {
            alert('请先选择文件');
            return;
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
            updateProgress(30);
            
            let result;
            switch(currentTool) {
                case 'merge':
                    result = await mergePDFs();
                    break;
                case 'split':
                    result = await splitPDF();
                    break;
                case 'compress':
                    result = await compressPDF();
                    break;
                case 'rotate':
                    result = await rotatePDF();
                    break;
                case 'delete':
                    result = await deletePages();
                    break;
                case 'extract':
                    result = await extractPages();
                    break;
                case 'images2pdf':
                    result = await imagesToPDF();
                    break;
                case 'pdf2images':
                    result = await pdfToImages();
                    break;
                case 'watermark':
                    result = await addWatermark();
                    break;
                case 'reorder':
                    result = await reorderPages();
                    break;
                case 'edit':
                    result = await editPDF();
                    break;
                case 'sign':
                    result = await signPDF();
                    break;
                case 'crop':
                    result = await cropPDF();
                    break;
                case 'extract-images':
                    result = await extractImagesFromPDF();
                    break;
                case 'pagenumbers':
                    result = await addPageNumbers();
                    break;
                case 'overlay':
                    result = await overlayPDFs();
                    break;
                case 'annotate':
                    result = await annotatePDF();
                    break;
                case 'ocr':
                    result = await pdfOCR();
                    break;
                case 'pdf-to-word':
                    result = await pdfToWord();
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
            console.error('处理PDF时出错:', error);
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
    
    // 合并PDF
    async function mergePDFs() {
        const { PDFDocument } = PDFLib;
        const mergedPdf = await PDFDocument.create();
        
        updateProgress(40);
        
        for (let i = 0; i < uploadedFiles.length; i++) {
            const file = uploadedFiles[i];
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await PDFDocument.load(arrayBuffer);
            const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            pages.forEach(page => mergedPdf.addPage(page));
            updateProgress(40 + (i + 1) * 50 / uploadedFiles.length);
        }
        
        const pdfBytes = await mergedPdf.save();
        downloadFile(pdfBytes, 'merged.pdf', 'application/pdf');
        return true;
    }
    
    // 拆分PDF
    async function splitPDF() {
        const { PDFDocument } = PDFLib;
        const file = uploadedFiles[0];
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const pageCount = pdf.getPageCount();
        
        updateProgress(50);
        
        for (let i = 0; i < pageCount; i++) {
            const newPdf = await PDFDocument.create();
            const [page] = await newPdf.copyPages(pdf, [i]);
            newPdf.addPage(page);
            const pdfBytes = await newPdf.save();
            downloadFile(pdfBytes, `page_${i + 1}.pdf`, 'application/pdf');
            updateProgress(50 + (i + 1) * 50 / pageCount);
        }
        
        return true;
    }
    
    // 压缩PDF（通过移除不必要的对象）
    async function compressPDF() {
        const { PDFDocument } = PDFLib;
        const file = uploadedFiles[0];
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        
        updateProgress(80);
        
        const pdfBytes = await pdf.save({ useObjectStreams: false });
        downloadFile(pdfBytes, 'compressed.pdf', 'application/pdf');
        return true;
    }
    
    // 旋转PDF
    async function rotatePDF() {
        const { PDFDocument, degrees } = PDFLib;
        const file = uploadedFiles[0];
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        
        const angle = parseInt(document.getElementById('rotate-angle').value);
        const pages = pdf.getPages();
        
        updateProgress(60);
        
        pages.forEach((page, index) => {
            page.setRotation(degrees(angle));
            updateProgress(60 + (index + 1) * 40 / pages.length);
        });
        
        const pdfBytes = await pdf.save();
        downloadFile(pdfBytes, 'rotated.pdf', 'application/pdf');
        return true;
    }
    
    // 删除页面
    async function deletePages() {
        const { PDFDocument } = PDFLib;
        const file = uploadedFiles[0];
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        
        const pageRange = document.getElementById('page-range').value;
        const pagesToDelete = parsePageRange(pageRange, pdf.getPageCount());
        
        updateProgress(70);
        
        const pagesToKeep = [];
        for (let i = 0; i < pdf.getPageCount(); i++) {
            if (!pagesToDelete.includes(i)) {
                pagesToKeep.push(i);
            }
        }
        
        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(pdf, pagesToKeep);
        copiedPages.forEach(page => newPdf.addPage(page));
        
        updateProgress(90);
        
        const pdfBytes = await newPdf.save();
        downloadFile(pdfBytes, 'deleted.pdf', 'application/pdf');
        return true;
    }
    
    // 提取页面
    async function extractPages() {
        const { PDFDocument } = PDFLib;
        const file = uploadedFiles[0];
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        
        const pageRange = document.getElementById('page-range').value;
        const pagesToExtract = parsePageRange(pageRange, pdf.getPageCount());
        
        updateProgress(70);
        
        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(pdf, pagesToExtract);
        copiedPages.forEach(page => newPdf.addPage(page));
        
        updateProgress(90);
        
        const pdfBytes = await newPdf.save();
        downloadFile(pdfBytes, 'extracted.pdf', 'application/pdf');
        return true;
    }
    
    // 将文本转换为图片（支持中文）
    async function textToImage(text, fontSize, width, height, options = {}) {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            
            // 计算合适的画布尺寸
            const canvasWidth = width || 400;
            const canvasHeight = height || 200;
            
            // 使用高DPI以提高清晰度
            const dpr = window.devicePixelRatio || 2;
            canvas.width = canvasWidth * dpr;
            canvas.height = canvasHeight * dpr;
            
            const ctx = canvas.getContext('2d');
            
            // 缩放上下文以匹配DPI
            ctx.scale(dpr, dpr);
            
            // 设置背景透明
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            
            // 设置文字样式（支持中文的字体）
            ctx.font = `${fontSize}px "Microsoft YaHei", "SimHei", "SimSun", "Arial", sans-serif`;
            ctx.fillStyle = options.color || 'rgba(179, 179, 179, 0.3)';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // 如果有旋转角度
            if (options.rotate) {
                ctx.save();
                ctx.translate(canvasWidth / 2, canvasHeight / 2);
                ctx.rotate(options.rotate * Math.PI / 180);
                ctx.fillText(text, 0, 0);
                ctx.restore();
            } else {
                ctx.fillText(text, canvasWidth / 2, canvasHeight / 2);
            }
            
            // 转换为PNG
            canvas.toBlob((blob) => {
                if (blob) {
                    blob.arrayBuffer().then(resolve).catch(reject);
                } else {
                    reject(new Error('无法将Canvas转换为Blob'));
                }
            }, 'image/png');
        });
    }
    
    // 检测图片格式
    function detectImageFormat(arrayBuffer) {
        const bytes = new Uint8Array(arrayBuffer);
        
        // PNG: 89 50 4E 47 0D 0A 1A 0A
        if (bytes.length >= 8 && 
            bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47 &&
            bytes[4] === 0x0D && bytes[5] === 0x0A && bytes[6] === 0x1A && bytes[7] === 0x0A) {
            return 'png';
        }
        
        // JPEG: FF D8 (SOI marker)
        if (bytes.length >= 2 && bytes[0] === 0xFF && bytes[1] === 0xD8) {
            return 'jpg';
        }
        
        // GIF: 47 49 46 38
        if (bytes.length >= 4 && 
            bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) {
            return 'gif';
        }
        
        // WebP: RIFF...WEBP
        if (bytes.length >= 12 && 
            bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
            bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) {
            return 'webp';
        }
        
        return null;
    }
    
    // 将图片转换为Canvas（用于处理不支持直接嵌入的格式）
    async function imageToCanvas(imageBytes, format) {
        return new Promise((resolve, reject) => {
            const blob = new Blob([imageBytes], { type: `image/${format}` });
            const url = URL.createObjectURL(blob);
            const img = new Image();
            
            img.onload = function() {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                URL.revokeObjectURL(url);
                resolve(canvas);
            };
            
            img.onerror = function() {
                URL.revokeObjectURL(url);
                reject(new Error(`无法加载${format}格式图片`));
            };
            
            img.src = url;
        });
    }
    
    // 图片转PDF
    async function imagesToPDF() {
        const { PDFDocument, rgb } = PDFLib;
        const pdf = await PDFDocument.create();
        
        updateProgress(10);
        
        for (let i = 0; i < uploadedFiles.length; i++) {
            const file = uploadedFiles[i];
            const imageBytes = await file.arrayBuffer();
            
            try {
                // 首先尝试通过文件头检测格式
                let detectedFormat = detectImageFormat(imageBytes);
                let image;
                let useCanvas = false;
                
                // 如果检测到格式，优先使用pdf-lib的嵌入方法
                if (detectedFormat === 'png') {
                    try {
                        image = await pdf.embedPng(imageBytes);
                    } catch (e) {
                        console.warn('PNG嵌入失败，尝试Canvas方法:', e);
                        useCanvas = true;
                    }
                } else if (detectedFormat === 'jpg') {
                    try {
                        image = await pdf.embedJpg(imageBytes);
                    } catch (e) {
                        console.warn('JPG嵌入失败，尝试Canvas方法:', e);
                        useCanvas = true;
                    }
                } else {
                    // 未检测到格式或格式不支持，使用Canvas方法
                    useCanvas = true;
                }
                
                // 如果pdf-lib方法失败或格式不支持，使用Canvas转换
                if (useCanvas || !image) {
                    // 根据MIME类型或检测到的格式确定格式
                    let format = detectedFormat || 'png';
                    if (!detectedFormat) {
                        if (file.type.includes('jpeg') || file.type.includes('jpg')) {
                            format = 'jpeg';
                        } else if (file.type.includes('png')) {
                            format = 'png';
                        } else if (file.type.includes('gif')) {
                            format = 'gif';
                        } else if (file.type.includes('webp')) {
                            format = 'webp';
                        } else {
                            format = 'png'; // 默认尝试PNG
                        }
                    }
                    
                    const canvas = await imageToCanvas(imageBytes, format);
                    const canvasBytes = await new Promise(resolve => {
                        canvas.toBlob(blob => {
                            blob.arrayBuffer().then(resolve);
                        }, 'image/png');
                    });
                    image = await pdf.embedPng(canvasBytes);
                }
                
                // 创建页面并添加图片
                const page = pdf.addPage([image.width, image.height]);
                page.drawImage(image, {
                    x: 0,
                    y: 0,
                    width: image.width,
                    height: image.height,
                });
                
                updateProgress(10 + ((i + 1) * 90 / uploadedFiles.length));
                
            } catch (error) {
                console.error(`处理图片 ${file.name} 时出错:`, error);
                let errorMsg = `处理图片 "${file.name}" 失败`;
                
                if (error.message.includes('SOI') || error.message.includes('JPEG')) {
                    errorMsg += ': 图片文件可能已损坏或格式不正确。请检查文件完整性，或尝试重新保存图片。';
                } else if (error.message.includes('无法加载')) {
                    errorMsg += ': 无法加载图片，请确认文件是有效的图片格式。';
                } else {
                    errorMsg += `: ${error.message}`;
                }
                
                errorMsg += '\n\n支持的格式: PNG、JPG、GIF、WebP';
                
                throw new Error(errorMsg);
            }
        }
        
        updateProgress(95);
        
        const pdfBytes = await pdf.save();
        downloadFile(pdfBytes, 'images.pdf', 'application/pdf');
        return true;
    }
    
    // PDF转图片（使用PDF.js）
    async function pdfToImages() {
        if (typeof pdfjsLib === 'undefined') {
            alert('PDF.js库未加载，无法使用此功能。请刷新页面重试。');
            return false;
        }
        
        const file = uploadedFiles[0];
        const arrayBuffer = await file.arrayBuffer();
        
        updateProgress(10);
        
        try {
            // 确保worker已配置
            if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
                pdfjsLib.GlobalWorkerOptions.workerSrc = '../js/lib/pdf.worker.min.js';
            }
            
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            const numPages = pdf.numPages;
            
            updateProgress(30);
            
            let downloadCount = 0;
            
            for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const viewport = page.getViewport({ scale: 2.0 });
                
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                
                const renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };
                
                await page.render(renderContext).promise;
                
                // 转换为blob并下载
                await new Promise((resolve) => {
                    canvas.toBlob((blob) => {
                        const timestamp = getTimestamp();
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `page_${pageNum}_${timestamp}.png`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        downloadCount++;
                        resolve();
                    }, 'image/png');
                });
                
                updateProgress(30 + (pageNum * 70 / numPages));
            }
            
            updateProgress(100);
            
            return true;
        } catch (error) {
            console.error('PDF转图片失败:', error);
            
            let errorMsg = '转换失败: ';
            if (error.message.includes('worker') || error.message.includes('Cannot load script')) {
                errorMsg += 'PDF.js Worker文件加载失败。';
                errorMsg += '\n\n请确保pdf.worker.min.js文件存在于 js/lib/ 目录中。';
                errorMsg += '\n或者刷新页面让系统自动使用CDN备用方案。';
            } else {
                errorMsg += error.message;
            }
            
            alert(errorMsg);
            return false;
        }
    }
    
    // 添加水印
    async function addWatermark() {
        try {
            const { PDFDocument } = PDFLib;
            const file = uploadedFiles[0];
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await PDFDocument.load(arrayBuffer);
            
            const watermarkText = document.getElementById('watermark-text').value || '水印';
            const fontSize = parseInt(document.getElementById('watermark-size').value) || 24;
            
            // 获取颜色和透明度
            const colorInput = document.getElementById('watermark-color');
            const opacityInput = document.getElementById('watermark-opacity');
            const colorHex = colorInput ? colorInput.value : '#B3B3B3';
            const opacity = opacityInput ? parseFloat(opacityInput.value) : 0.3;
            
            // 将十六进制颜色转换为RGBA
            const r = parseInt(colorHex.slice(1, 3), 16);
            const g = parseInt(colorHex.slice(3, 5), 16);
            const b = parseInt(colorHex.slice(5, 7), 16);
            const colorRgba = `rgba(${r}, ${g}, ${b}, ${opacity})`;
            
            const pages = pdf.getPages();
            if (pages.length === 0) {
                alert('PDF文件没有页面');
                return false;
            }
            
            updateProgress(10);
            
            // 统一使用Canvas方式处理水印（支持中英文）
            // 计算合适的画布尺寸（基于第一个页面的尺寸）
            const firstPage = pages[0];
            const { width: pageWidth, height: pageHeight } = firstPage.getSize();
            
            // 水印尺寸应该足够大以覆盖页面
            const textWidth = Math.max(pageWidth * 0.6, watermarkText.length * fontSize * 1.5);
            const textHeight = Math.max(pageHeight * 0.6, fontSize * 2);
            
            updateProgress(20);
            
            const imageBytes = await textToImage(watermarkText, fontSize, textWidth, textHeight, {
                color: colorRgba,
                rotate: -45
            });
            
            updateProgress(40);
            
            const watermarkImage = await pdf.embedPng(imageBytes);
            
            if (!watermarkImage) {
                throw new Error('无法嵌入水印图片');
            }
            
            updateProgress(50);
            
            for (let index = 0; index < pages.length; index++) {
                const page = pages[index];
                const { width, height } = page.getSize();
                
                // 获取水印图片的原始尺寸
                const imageWidth = watermarkImage.width;
                const imageHeight = watermarkImage.height;
                
                if (!imageWidth || !imageHeight || imageWidth <= 0 || imageHeight <= 0) {
                    console.warn(`水印图片尺寸无效: ${imageWidth}x${imageHeight}`);
                    continue;
                }
                
                // 计算缩放比例，使水印覆盖页面的大部分区域
                const scale = Math.min(width / imageWidth, height / imageHeight) * 1.2;
                const scaledWidth = imageWidth * scale;
                const scaledHeight = imageHeight * scale;
                
                // 居中绘制水印（注意：图片本身已经包含透明度，这里不再设置opacity）
                page.drawImage(watermarkImage, {
                    x: width / 2 - scaledWidth / 2,
                    y: height / 2 - scaledHeight / 2,
                    width: scaledWidth,
                    height: scaledHeight,
                });
                
                updateProgress(50 + ((index + 1) * 45 / pages.length));
            }
            
            updateProgress(95);
            
            const pdfBytes = await pdf.save();
            downloadFile(pdfBytes, 'watermarked.pdf', 'application/pdf');
            return true;
        } catch (error) {
            console.error('添加水印失败:', error);
            alert('添加水印失败: ' + error.message);
            return false;
        }
    }
    
    // 重新排列页面
    async function reorderPages() {
        const newOrderInput = document.getElementById('reorder-sequence');
        if (!newOrderInput || !newOrderInput.value) {
            alert('请输入新的页面顺序（例如：3,1,2,5,4）');
            return false;
        }
        
        const { PDFDocument } = PDFLib;
        const file = uploadedFiles[0];
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        
        const order = newOrderInput.value.split(',').map(n => parseInt(n.trim()) - 1);
        
        // 验证顺序是否有效
        const maxPage = pdf.getPageCount();
        if (order.some(p => p < 0 || p >= maxPage)) {
            alert('页面顺序超出范围，请检查输入');
            return false;
        }
        
        const newPdf = await PDFDocument.create();
        
        updateProgress(50);
        
        const copiedPages = await newPdf.copyPages(pdf, order);
        copiedPages.forEach(page => newPdf.addPage(page));
        
        updateProgress(90);
        
        const pdfBytes = await newPdf.save();
        downloadFile(pdfBytes, 'reordered.pdf', 'application/pdf');
        return true;
    }
    
    // PDF转图片（使用PDF.js）
    async function pdfToImages() {
        if (typeof pdfjsLib === 'undefined') {
            alert('PDF.js库未加载，无法使用此功能');
            return false;
        }
        
        const file = uploadedFiles[0];
        const arrayBuffer = await file.arrayBuffer();
        
        updateProgress(20);
        
        try {
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            const numPages = pdf.numPages;
            
            updateProgress(40);
            
            for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const viewport = page.getViewport({ scale: 2.0 });
                
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                
                await page.render({
                    canvasContext: context,
                    viewport: viewport
                }).promise;
                
                canvas.toBlob((blob) => {
                    const timestamp = getTimestamp();
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `page_${pageNum}_${timestamp}.png`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }, 'image/png');
                
                updateProgress(40 + (pageNum * 60 / numPages));
            }
            
            return true;
        } catch (error) {
            console.error('PDF转图片失败:', error);
            alert('转换失败: ' + error.message);
            return false;
        }
    }
    
    // 编辑PDF（添加文本）
    async function editPDF() {
        const { PDFDocument } = PDFLib;
        const file = uploadedFiles[0];
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        
        const text = document.getElementById('edit-text')?.value || '示例文本';
        const fontSize = parseInt(document.getElementById('edit-size')?.value) || 24;
        const x = parseFloat(document.getElementById('edit-x')?.value) || 50;
        const y = parseFloat(document.getElementById('edit-y')?.value) || 50;
        
        const pages = pdf.getPages();
        
        updateProgress(30);
        
        // 检测文本是否包含非ASCII字符（如中文）
        const hasNonAscii = /[^\x00-\x7F]/.test(text);
        
        let textImage;
        if (hasNonAscii) {
            // 对于中文，使用Canvas转换为图片
            const textWidth = text.length * fontSize * 1.2;
            const textHeight = fontSize * 1.5;
            const imageBytes = await textToImage(text, fontSize, textWidth, textHeight, {
                color: 'rgba(0, 0, 0, 1)'
            });
            textImage = await pdf.embedPng(imageBytes);
        }
        
        updateProgress(50);
        
        for (let index = 0; index < pages.length; index++) {
            const page = pages[index];
            
            if (hasNonAscii && textImage) {
                // 使用图片方式添加文本（支持中文）
                page.drawImage(textImage, {
                    x: x,
                    y: y,
                    width: textImage.width,
                    height: textImage.height,
                });
            } else {
                // 使用文字方式添加文本（仅英文）
                const font = await pdf.embedFont(PDFLib.StandardFonts.Helvetica);
                page.drawText(text, {
                    x: x,
                    y: y,
                    size: fontSize,
                    font: font,
                    color: PDFLib.rgb(0, 0, 0),
                });
            }
            
            updateProgress(50 + ((index + 1) * 50 / pages.length));
        }
        
        const pdfBytes = await pdf.save();
        downloadFile(pdfBytes, 'edited.pdf', 'application/pdf');
        return true;
    }
    
    // 签署PDF
    async function signPDF() {
        const { PDFDocument } = PDFLib;
        const file = uploadedFiles[0];
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        
        const signatureInput = document.getElementById('signature-input');
        if (!signatureInput || !signatureInput.files || signatureInput.files.length === 0) {
            alert('请先上传签名图片');
            return false;
        }
        
        const signatureFile = signatureInput.files[0];
        const signatureBytes = await signatureFile.arrayBuffer();
        
        let image;
        if (signatureFile.type === 'image/png') {
            image = await pdf.embedPng(signatureBytes);
        } else if (signatureFile.type === 'image/jpeg' || signatureFile.type === 'image/jpg') {
            image = await pdf.embedJpg(signatureBytes);
        } else {
            alert('签名图片格式不支持，请使用PNG或JPG');
            return false;
        }
        
        const pages = pdf.getPages();
        const x = parseFloat(document.getElementById('sign-x')?.value) || 50;
        const y = parseFloat(document.getElementById('sign-y')?.value) || 50;
        const width = parseFloat(document.getElementById('sign-width')?.value) || 100;
        const height = parseFloat(document.getElementById('sign-height')?.value) || 50;
        
        updateProgress(50);
        
        pages.forEach((page, index) => {
            page.drawImage(image, {
                x: x,
                y: y,
                width: width,
                height: height,
            });
            updateProgress(50 + (index + 1) * 50 / pages.length);
        });
        
        const pdfBytes = await pdf.save();
        downloadFile(pdfBytes, 'signed.pdf', 'application/pdf');
        return true;
    }
    
    // 裁剪PDF
    async function cropPDF() {
        const { PDFDocument } = PDFLib;
        const file = uploadedFiles[0];
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        
        const top = parseFloat(document.getElementById('crop-top')?.value) || 0;
        const right = parseFloat(document.getElementById('crop-right')?.value) || 0;
        const bottom = parseFloat(document.getElementById('crop-bottom')?.value) || 0;
        const left = parseFloat(document.getElementById('crop-left')?.value) || 0;
        
        const pages = pdf.getPages();
        
        updateProgress(50);
        
        pages.forEach((page, index) => {
            const { width, height } = page.getSize();
            page.setMediaBox(left, bottom, width - left - right, height - top - bottom);
            updateProgress(50 + (index + 1) * 50 / pages.length);
        });
        
        const pdfBytes = await pdf.save();
        downloadFile(pdfBytes, 'cropped.pdf', 'application/pdf');
        return true;
    }
    
    // 从PDF提取图片
    async function extractImagesFromPDF() {
        if (typeof pdfjsLib === 'undefined') {
            alert('PDF.js库未加载，无法使用此功能');
            return false;
        }
        
        const file = uploadedFiles[0];
        const arrayBuffer = await file.arrayBuffer();
        
        updateProgress(20);
        
        try {
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            const numPages = pdf.numPages;
            
            let imageCount = 0;
            
            for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const ops = await page.getOperatorList();
                
                // 简化实现：提取页面为图片
                const viewport = page.getViewport({ scale: 2.0 });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                
                await page.render({
                    canvasContext: context,
                    viewport: viewport
                }).promise;
                
                canvas.toBlob((blob) => {
                    const timestamp = getTimestamp();
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `extracted_image_${pageNum}_${timestamp}.png`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    imageCount++;
                }, 'image/png');
                
                updateProgress(20 + (pageNum * 80 / numPages));
            }
            
            return true;
        } catch (error) {
            console.error('提取图片失败:', error);
            alert('提取失败: ' + error.message);
            return false;
        }
    }
    
    // 添加页码
    async function addPageNumbers() {
        const { PDFDocument, rgb, StandardFonts } = PDFLib;
        const file = uploadedFiles[0];
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        
        const font = await pdf.embedFont(StandardFonts.Helvetica);
        const pages = pdf.getPages();
        const position = document.getElementById('page-number-position')?.value || 'bottom-center';
        const fontSize = parseInt(document.getElementById('page-number-size')?.value) || 12;
        const startPage = parseInt(document.getElementById('page-number-start')?.value) || 1;
        
        updateProgress(50);
        
        pages.forEach((page, index) => {
            const { width, height } = page.getSize();
            const pageNumber = startPage + index;
            let x, y;
            
            switch(position) {
                case 'bottom-center':
                    x = width / 2 - 10;
                    y = 20;
                    break;
                case 'bottom-right':
                    x = width - 30;
                    y = 20;
                    break;
                case 'top-center':
                    x = width / 2 - 10;
                    y = height - 20;
                    break;
                default:
                    x = width / 2 - 10;
                    y = 20;
            }
            
            page.drawText(pageNumber.toString(), {
                x: x,
                y: y,
                size: fontSize,
                font: font,
                color: rgb(0, 0, 0),
            });
            
            updateProgress(50 + (index + 1) * 50 / pages.length);
        });
        
        const pdfBytes = await pdf.save();
        downloadFile(pdfBytes, 'numbered.pdf', 'application/pdf');
        return true;
    }
    
    // PDF叠加（使用PDF.js将页面转换为图片后叠加）
    async function overlayPDFs() {
        const { PDFDocument } = PDFLib;
        
        if (uploadedFiles.length < 2) {
            alert('请上传至少两个PDF文件');
            return false;
        }
        
        if (typeof pdfjsLib === 'undefined') {
            alert('PDF.js库未加载，无法使用此功能');
            return false;
        }
        
        const baseFile = uploadedFiles[0];
        const overlayFile = uploadedFiles[1];
        
        updateProgress(10);
        
        const baseArrayBuffer = await baseFile.arrayBuffer();
        const overlayArrayBuffer = await overlayFile.arrayBuffer();
        
        updateProgress(20);
        
        const basePdf = await PDFDocument.load(baseArrayBuffer);
        
        // 确保worker已配置
        if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
            pdfjsLib.GlobalWorkerOptions.workerSrc = '../js/lib/pdf.worker.min.js';
        }
        
        // 使用PDF.js加载overlay PDF
        const overlayLoadingTask = pdfjsLib.getDocument({ data: overlayArrayBuffer });
        const overlayPdfJs = await overlayLoadingTask.promise;
        
        updateProgress(40);
        
        const basePages = basePdf.getPages();
        const overlayPageCount = overlayPdfJs.numPages;
        const minPages = Math.min(basePages.length, overlayPageCount);
        
        if (minPages === 0) {
            alert('PDF文件没有页面');
            return false;
        }
        
        updateProgress(50);
        
        // 将overlay PDF的每一页转换为图片，然后叠加到base PDF上
        for (let i = 0; i < minPages; i++) {
            const basePage = basePages[i];
            const { width, height } = basePage.getSize();
            
            try {
                // 获取overlay PDF的页面
                const overlayPage = await overlayPdfJs.getPage(i + 1);
                const viewport = overlayPage.getViewport({ scale: 2.0 });
                
                // 将页面渲染到canvas
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                
                await overlayPage.render({
                    canvasContext: context,
                    viewport: viewport
                }).promise;
                
                // 将canvas转换为PNG图片
                const imageBytes = await new Promise((resolve) => {
                    canvas.toBlob((blob) => {
                        blob.arrayBuffer().then(resolve);
                    }, 'image/png');
                });
                
                // 将图片嵌入到base PDF
                const overlayImage = await basePdf.embedPng(imageBytes);
                
                // 将图片绘制到base页面上
                basePage.drawImage(overlayImage, {
                    x: 0,
                    y: 0,
                    width: width,
                    height: height,
                });
                
            } catch (error) {
                console.error(`处理第${i + 1}页时出错:`, error);
                alert(`处理第${i + 1}页时出错: ${error.message}`);
                return false;
            }
            
            updateProgress(50 + ((i + 1) * 45 / minPages));
        }
        
        updateProgress(95);
        
        const pdfBytes = await basePdf.save();
        downloadFile(pdfBytes, 'overlaid.pdf', 'application/pdf');
        return true;
    }
    
    // 注释PDF
    async function annotatePDF() {
        const { PDFDocument, rgb } = PDFLib;
        const file = uploadedFiles[0];
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        
        const comment = document.getElementById('annotation-text')?.value || '注释';
        const pageNum = parseInt(document.getElementById('annotation-page')?.value) || 1;
        const x = parseFloat(document.getElementById('annotation-x')?.value) || 50;
        const y = parseFloat(document.getElementById('annotation-y')?.value) || 50;
        
        if (pageNum < 1 || pageNum > pdf.getPageCount()) {
            alert('页面编号超出范围');
            return false;
        }
        
        const page = pdf.getPage(pageNum - 1);
        
        updateProgress(50);
        
        // 检测文本是否包含非ASCII字符（如中文）
        const hasNonAscii = /[^\x00-\x7F]/.test(comment);
        
        // 添加注释背景
        const textWidth = comment.length * (hasNonAscii ? 12 : 8) + 10;
        page.drawRectangle({
            x: x - 5,
            y: y - 5,
            width: textWidth,
            height: 20,
            color: rgb(1, 1, 0.8),
            opacity: 0.8,
        });
        
        updateProgress(70);
        
        if (hasNonAscii) {
            // 对于中文，使用Canvas转换为图片
            const imageBytes = await textToImage(comment, 12, textWidth, 20, {
                color: 'rgba(0, 0, 0, 1)'
            });
            const commentImage = await pdf.embedPng(imageBytes);
            page.drawImage(commentImage, {
                x: x,
                y: y,
                width: commentImage.width,
                height: commentImage.height,
            });
        } else {
            // 使用文字方式添加注释（仅英文）
            const font = await pdf.embedFont(PDFLib.StandardFonts.Helvetica);
            page.drawText(comment, {
                x: x,
                y: y,
                size: 12,
                font: font,
                color: rgb(0, 0, 0),
            });
        }
        
        updateProgress(90);
        
        const pdfBytes = await pdf.save();
        downloadFile(pdfBytes, 'annotated.pdf', 'application/pdf');
        return true;
    }
    
    // 解析页面范围（如：1,3-5,10）
    function parsePageRange(rangeStr, maxPages) {
        const pages = new Set();
        const parts = rangeStr.split(',');
        
        parts.forEach(part => {
            part = part.trim();
            if (part.includes('-')) {
                const [start, end] = part.split('-').map(n => parseInt(n.trim()));
                for (let i = start; i <= end; i++) {
                    if (i >= 1 && i <= maxPages) {
                        pages.add(i - 1); // 转换为0-based索引
                    }
                }
            } else {
                const page = parseInt(part);
                if (page >= 1 && page <= maxPages) {
                    pages.add(page - 1);
                }
            }
        });
        
        return Array.from(pages);
    }
    
    // 生成时间戳 yyyyMMDDHHmmss
    function getTimestamp() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${year}${month}${day}${hours}${minutes}${seconds}`;
    }
    
    // 下载文件（自动添加时间戳）
    function downloadFile(data, filename, mimeType) {
        // 分离文件名和扩展名
        const lastDotIndex = filename.lastIndexOf('.');
        let nameWithoutExt, extension;
        
        if (lastDotIndex > 0) {
            nameWithoutExt = filename.substring(0, lastDotIndex);
            extension = filename.substring(lastDotIndex);
        } else {
            nameWithoutExt = filename;
            extension = '';
        }
        
        // 添加时间戳
        const timestamp = getTimestamp();
        const filenameWithTimestamp = `${nameWithoutExt}_${timestamp}${extension}`;
        
        const blob = new Blob([data], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filenameWithTimestamp;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    // 点击模态框外部关闭
    window.onclick = function(event) {
        const modal = document.getElementById('tool-modal');
        if (event.target === modal) {
            closeToolModal();
        }
    };
    
    // PDF文本识别（OCR）
    async function pdfOCR() {
        if (typeof pdfjsLib === 'undefined') {
            alert('PDF.js库未加载，无法使用此功能');
            return false;
        }
        
        // 检查Tesseract.js是否可用
        if (typeof Tesseract === 'undefined') {
            alert('OCR功能需要Tesseract.js库。\n\n请先加载Tesseract.js库：\n<script src="https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js"></script>');
            return false;
        }
        
        const file = uploadedFiles[0];
        const arrayBuffer = await file.arrayBuffer();
        
        updateProgress(10);
        
        try {
            // 确保worker已配置
            if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
                pdfjsLib.GlobalWorkerOptions.workerSrc = '../js/lib/pdf.worker.min.js';
            }
            
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            const numPages = pdf.numPages;
            
            updateProgress(20);
            
            let allText = '';
            
            // 初始化Tesseract
            const { createWorker } = Tesseract;
            const worker = await createWorker('chi_sim+eng'); // 中文简体+英文
            
            updateProgress(30);
            
            for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const viewport = page.getViewport({ scale: 2.0 });
                
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                
                await page.render({
                    canvasContext: context,
                    viewport: viewport
                }).promise;
                
                updateProgress(30 + (pageNum * 30 / numPages));
                
                // 使用Tesseract进行OCR识别
                const { data: { text } } = await worker.recognize(canvas);
                allText += `\n\n=== 第 ${pageNum} 页 ===\n\n${text}`;
                
                updateProgress(30 + (pageNum * 50 / numPages));
            }
            
            await worker.terminate();
            
            updateProgress(90);
            
            // 将识别的文本保存为TXT文件
            const blob = new Blob([allText], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ocr_result_${getTimestamp()}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            updateProgress(100);
            
            alert(`文本识别完成！共识别 ${numPages} 页内容。`);
            return true;
        } catch (error) {
            console.error('OCR识别失败:', error);
            alert('OCR识别失败: ' + error.message);
            return false;
        }
    }
    
    // PDF转Word（提取文本并生成简单的Word文档）
    async function pdfToWord() {
        if (typeof pdfjsLib === 'undefined') {
            alert('PDF.js库未加载，无法使用此功能');
            return false;
        }
        
        const file = uploadedFiles[0];
        const arrayBuffer = await file.arrayBuffer();
        
        updateProgress(10);
        
        try {
            // 确保worker已配置
            if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
                pdfjsLib.GlobalWorkerOptions.workerSrc = '../js/lib/pdf.worker.min.js';
            }
            
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            const numPages = pdf.numPages;
            
            updateProgress(20);
            
            let allText = '';
            
            // 提取每一页的文本
            for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                
                // 尝试提取文本内容
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                
                if (pageText.trim()) {
                    allText += `\n\n=== 第 ${pageNum} 页 ===\n\n${pageText}`;
                } else {
                    // 如果无法提取文本（可能是扫描件），提示用户
                    allText += `\n\n=== 第 ${pageNum} 页 ===\n\n[此页为图片，无法提取文本。如需识别文字，请使用"PDF文本识别"功能。]`;
                }
                
                updateProgress(20 + (pageNum * 60 / numPages));
            }
            
            updateProgress(85);
            
            // 生成简单的Word文档（使用HTML格式，浏览器可以打开）
            // 注意：这是一个简化的实现，生成的是RTF格式的文本
            const wordContent = `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}} {\\colortbl ;\\red0\\green0\\blue0;} \\f0\\fs24 ${escapeRtfText(allText)} }`;
            
            const blob = new Blob([wordContent], { type: 'application/msword' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `converted_${getTimestamp()}.doc`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            updateProgress(100);
            
            alert(`PDF转Word完成！共转换 ${numPages} 页内容。\n\n注意：这是基于文本提取的简化版本，布局和格式可能不完整。`);
            return true;
        } catch (error) {
            console.error('PDF转Word失败:', error);
            alert('PDF转Word失败: ' + error.message);
            return false;
        }
    }
    
    // RTF文本转义函数
    function escapeRtfText(text) {
        return text
            .replace(/\\/g, '\\\\')
            .replace(/{/g, '\\{')
            .replace(/}/g, '\\}')
            .replace(/\n/g, '\\par ')
            .replace(/\r/g, '');
    }
    
    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSearch);
    } else {
        initSearch();
    }
})();
