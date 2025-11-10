// 网络带宽计算工具

// 初始化页面
function initBandwidthCalculator() {
    // 模式切换
    const modeButtons = document.querySelectorAll('.mode-btn');
    const modeContents = document.querySelectorAll('.mode-content');
    
    modeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有active类
            modeButtons.forEach(btn => btn.classList.remove('active'));
            modeContents.forEach(content => content.classList.remove('active'));
            
            // 添加active类
            this.classList.add('active');
            const mode = this.getAttribute('data-mode');
            document.getElementById(mode + '-mode').classList.add('active');
        });
    });
    
    // 为输入框添加实时计算功能
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value && this.value > 0) {
                const parentMode = this.closest('.mode-content');
                if (parentMode && parentMode.classList.contains('active')) {
                    const mode = parentMode.id.replace('-mode', '');
                    if (mode === 'download-time') {
                        calculateDownloadTime();
                    } else if (mode === 'required-bandwidth') {
                        calculateRequiredBandwidth();
                    } else if (mode === 'unit-convert') {
                        convertUnits();
                    }
                }
            }
        });
    });
    
    // 为下拉选择框添加事件
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
        select.addEventListener('change', function() {
            const parentMode = this.closest('.mode-content');
            if (parentMode && parentMode.classList.contains('active')) {
                const mode = parentMode.id.replace('-mode', '');
                if (mode === 'download-time') {
                    calculateDownloadTime();
                } else if (mode === 'required-bandwidth') {
                    calculateRequiredBandwidth();
                } else if (mode === 'unit-convert') {
                    convertUnits();
                }
            }
        });
    });
}

// 下载时间计算
function calculateDownloadTime() {
    try {
        const fileSizeInput = document.getElementById('file-size');
        const fileSizeUnitSelect = document.getElementById('file-size-unit');
        const downloadSpeedInput = document.getElementById('download-speed');
        const speedUnitSelect = document.getElementById('speed-unit');
        
        const fileSize = parseFloat(fileSizeInput.value);
        const fileSizeUnit = parseFloat(fileSizeUnitSelect.value);
        const downloadSpeed = parseFloat(downloadSpeedInput.value);
        const speedUnit = parseFloat(speedUnitSelect.value);
        
        if (!fileSize || !downloadSpeed || fileSize <= 0 || downloadSpeed <= 0) {
            document.getElementById('download-time-output').innerHTML = 
                '<p class="error">请输入有效的文件大小和下载速度</p>';
            return;
        }
        
        // 将文件大小转换为字节
        const fileSizeBytes = fileSize * fileSizeUnit;
        
        // 将速度转换为字节/秒
        // speedUnit 表示每个单位对应的字节/秒
        const speedBytesPerSecond = downloadSpeed * speedUnit;
        
        if (speedBytesPerSecond <= 0) {
            document.getElementById('download-time-output').innerHTML = 
                '<p class="error">下载速度不能为0</p>';
            return;
        }
        
        // 计算下载时间（秒）
        const downloadTimeSeconds = fileSizeBytes / speedBytesPerSecond;
        
        // 格式化时间
        const formattedTime = formatTime(downloadTimeSeconds);
        
        // 显示结果
        document.getElementById('download-time-output').innerHTML = `
            <div class="result-item">
                <span class="result-label">下载时间：</span>
                <span class="result-value">${formattedTime}</span>
            </div>
            <div class="result-item">
                <span class="result-label">文件大小：</span>
                <span class="result-value">${formatFileSize(fileSizeBytes)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">下载速度：</span>
                <span class="result-value">${formatSpeed(speedBytesPerSecond)}</span>
            </div>
            <div class="result-detail">
                <p>计算过程：</p>
                <p>文件大小：${fileSizeBytes.toLocaleString()} 字节</p>
                <p>下载速度：${speedBytesPerSecond.toFixed(2)} 字节/秒</p>
                <p>下载时间 = 文件大小 ÷ 下载速度</p>
            </div>
        `;
        
    } catch (error) {
        console.error('计算下载时间时出错:', error);
        document.getElementById('download-time-output').innerHTML = 
            '<p class="error">计算过程中出现错误，请检查输入值</p>';
    }
}

// 所需带宽计算
function calculateRequiredBandwidth() {
    try {
        const fileSizeInput = document.getElementById('required-file-size');
        const fileSizeUnitSelect = document.getElementById('required-file-size-unit');
        const targetTimeInput = document.getElementById('target-time');
        const timeUnitSelect = document.getElementById('time-unit');
        
        const fileSize = parseFloat(fileSizeInput.value);
        const fileSizeUnit = parseFloat(fileSizeUnitSelect.value);
        const targetTime = parseFloat(targetTimeInput.value);
        const timeUnit = parseFloat(timeUnitSelect.value);
        
        if (!fileSize || !targetTime || fileSize <= 0 || targetTime <= 0) {
            document.getElementById('required-bandwidth-output').innerHTML = 
                '<p class="error">请输入有效的文件大小和目标时间</p>';
            return;
        }
        
        // 将文件大小转换为字节
        const fileSizeBytes = fileSize * fileSizeUnit;
        
        // 将目标时间转换为秒
        const targetTimeSeconds = targetTime * timeUnit;
        
        if (targetTimeSeconds <= 0) {
            document.getElementById('required-bandwidth-output').innerHTML = 
                '<p class="error">目标时间不能为0</p>';
            return;
        }
        
        // 计算所需带宽（字节/秒）
        const requiredBandwidthBytesPerSecond = fileSizeBytes / targetTimeSeconds;
        
        // 显示结果
        document.getElementById('required-bandwidth-output').innerHTML = `
            <div class="result-item">
                <span class="result-label">所需带宽：</span>
                <span class="result-value">${formatSpeed(requiredBandwidthBytesPerSecond)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">文件大小：</span>
                <span class="result-value">${formatFileSize(fileSizeBytes)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">目标时间：</span>
                <span class="result-value">${formatTime(targetTimeSeconds)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">换算为 Mbps：</span>
                <span class="result-value">${(requiredBandwidthBytesPerSecond / 125000).toFixed(2)} Mbps</span>
            </div>
            <div class="result-detail">
                <p>计算过程：</p>
                <p>文件大小：${fileSizeBytes.toLocaleString()} 字节</p>
                <p>目标时间：${targetTimeSeconds.toLocaleString()} 秒</p>
                <p>所需带宽 = 文件大小 ÷ 目标时间</p>
            </div>
        `;
        
    } catch (error) {
        console.error('计算所需带宽时出错:', error);
        document.getElementById('required-bandwidth-output').innerHTML = 
            '<p class="error">计算过程中出现错误，请检查输入值</p>';
    }
}

// 单位转换
function convertUnits() {
    try {
        const convertValueInput = document.getElementById('convert-value');
        const convertFromUnitSelect = document.getElementById('convert-from-unit');
        
        const convertValue = parseFloat(convertValueInput.value);
        const convertFromUnit = parseFloat(convertFromUnitSelect.value);
        
        if (!convertValue || convertValue <= 0) {
            document.getElementById('unit-convert-output').innerHTML = 
                '<p class="error">请输入有效的转换值</p>';
            return;
        }
        
        // 将输入值转换为字节/秒
        const bytesPerSecond = convertValue * convertFromUnit;
        
        // 转换到各种单位
        const conversions = {
            'Kbps': bytesPerSecond / 0.125,
            'Mbps': bytesPerSecond / 0.000125,
            'Gbps': bytesPerSecond / 1.25e-7,
            'KB/s': bytesPerSecond / 1,
            'MB/s': bytesPerSecond / 0.001,
            'GB/s': bytesPerSecond / 1e-6
        };
        
        let resultHTML = '';
        for (const [unit, value] of Object.entries(conversions)) {
            resultHTML += `
                <div class="result-item">
                    <span class="result-label">${unit}：</span>
                    <span class="result-value">${value.toFixed(6)}</span>
                </div>
            `;
        }
        
        // 显示结果
        document.getElementById('unit-convert-output').innerHTML = `
            ${resultHTML}
            <div class="result-detail">
                <p>单位换算说明：</p>
                <p>• 1 Byte = 8 bits</p>
                <p>• 1 KB/s = 8 Kbps</p>
                <p>• 1 MB/s = 8 Mbps</p>
                <p>• 带宽单位 (bps) 通常用于网络连接速度</p>
                <p>• 传输速度单位 (B/s) 通常用于实际下载速度</p>
            </div>
        `;
        
    } catch (error) {
        console.error('单位转换时出错:', error);
        document.getElementById('unit-convert-output').innerHTML = 
            '<p class="error">转换过程中出现错误，请检查输入值</p>';
    }
}

// 格式化时间
function formatTime(seconds) {
    if (seconds < 1) {
        return `${(seconds * 1000).toFixed(2)} 毫秒`;
    }
    
    if (seconds < 60) {
        return `${seconds.toFixed(2)} 秒`;
    }
    
    const minutes = seconds / 60;
    if (minutes < 60) {
        return `${minutes.toFixed(2)} 分钟`;
    }
    
    const hours = minutes / 60;
    if (hours < 24) {
        return `${hours.toFixed(2)} 小时`;
    }
    
    const days = hours / 24;
    return `${days.toFixed(2)} 天`;
}

// 格式化文件大小
function formatFileSize(bytes) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }
    
    return `${size.toFixed(2)} ${units[unitIndex]}`;
}

// 格式化速度
function formatSpeed(bytesPerSecond) {
    if (bytesPerSecond < 1) {
        return `${(bytesPerSecond * 8).toFixed(2)} bps`;
    }
    
    if (bytesPerSecond < 1024) {
        return `${bytesPerSecond.toFixed(2)} B/s`;
    }
    
    const kbps = bytesPerSecond * 8 / 1000;
    if (kbps < 1000) {
        return `${kbps.toFixed(2)} Kbps`;
    }
    
    const mbps = kbps / 1000;
    if (mbps < 1000) {
        return `${mbps.toFixed(2)} Mbps`;
    }
    
    const gbps = mbps / 1000;
    return `${gbps.toFixed(2)} Gbps`;
}

// 清除所有输入
function clearAll() {
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.value = '';
    });
    
    const resultElements = document.querySelectorAll('.result-output');
    resultElements.forEach(element => {
        element.innerHTML = '';
    });
}

// 页面加载完成后初始化
window.addEventListener('load', function() {
    initBandwidthCalculator();
    
    // 设置默认值示例
    setTimeout(function() {
        document.getElementById('file-size').value = '100';
        document.getElementById('download-speed').value = '10';
        calculateDownloadTime();
    }, 1000);
});