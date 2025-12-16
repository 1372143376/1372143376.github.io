// Json2Any工具功能集合
// 支持JSON转Go结构体、JSON转Protobuf、JSON转PHP数组、YAML转Protobuf、SQL转GORM等功能
function jsonToGoStruct() {
    const inputText = document.getElementById('input-text').value.trim();
    
    if (!inputText) {
        showAlert('请输入要转换的JSON');
        return;
    }
    
    try {
        // 解析JSON
        const jsonObj = JSON.parse(inputText);
        const goStruct = convertJsonToGoStruct(jsonObj, "Data");
        displayResult('Go结构体结果', goStruct);
    } catch (error) {
        showAlert('JSON解析出错: ' + error.message);
        console.error(error);
    }
}

// JSON转Protobuf功能
function jsonToProtobuf() {
    const inputText = document.getElementById('input-text').value.trim();
    
    if (!inputText) {
        showAlert('请输入要转换的JSON');
        return;
    }
    
    try {
        // 解析JSON
        const jsonObj = JSON.parse(inputText);
        const protobuf = convertJsonToProtobuf(jsonObj, "Message");
        displayResult('Protobuf结果', protobuf);
    } catch (error) {
        showAlert('JSON解析出错: ' + error.message);
        console.error(error);
    }
}

// 将JSON对象转换为Protobuf消息定义（支持多层级结构）
function convertJsonToProtobuf(obj, messageName) {
    let messageDefinitions = []; // 存储所有消息定义
    let mainMessageName = messageName;
    
    // 如果顶层是一个数组，则将其作为重复字段处理
    if (Array.isArray(obj)) {
        if (obj.length === 0) {
            return `message ${mainMessageName} {\n    repeated string items = 1;\n}`;
        }
        
        // 对于非空数组，我们假设所有元素具有相同的结构
        const firstElement = obj[0];
        if (typeof firstElement === 'object' && firstElement !== null) {
            // 生成元素的消息定义
            const elementMessageName = mainMessageName;
            const elementMessage = generateMessageDefinition(firstElement, elementMessageName, messageDefinitions);
            messageDefinitions.push(elementMessage);
            
            // 返回消息定义
            return messageDefinitions.join('\n\n');
        } else {
            // 数组元素是基本类型
            const elementType = getProtobufType(firstElement);
            return `message ${mainMessageName} {\n    repeated ${elementType} items = 1;\n}`;
        }
    } else if (typeof obj === 'object' && obj !== null) {
        // 顶层是对象的情况
        const mainMessage = generateMessageDefinition(obj, mainMessageName, messageDefinitions);
        messageDefinitions.push(mainMessage);
        
        return messageDefinitions.join('\n\n');
    } else {
        // 顶层是基本类型的情况
        const fieldType = getProtobufType(obj);
        return `message ${mainMessageName} {\n    ${fieldType} value = 1;\n}`;
    }
}

// 生成消息定义（递归处理嵌套对象）
function generateMessageDefinition(obj, messageName, messageDefinitions, parentName = '') {
    let messageCode = `message ${messageName} {\n`;
    let fieldNumber = 1;
    
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            const fieldName = key;
            
            let fieldType;
            if (typeof value === 'object' && value !== null) {
                if (Array.isArray(value)) {
                    if (value.length === 0) {
                        fieldType = 'repeated string';
                    } else {
                        const firstElement = value[0];
                        if (typeof firstElement === 'object' && firstElement !== null) {
                            // 为数组元素创建新的消息
                            const elementMessageName = generateUniqueMessageName(capitalize(fieldName), parentName, messageDefinitions);
                            const elementMessage = generateMessageDefinition(firstElement, elementMessageName, messageDefinitions, messageName);
                            messageDefinitions.push(elementMessage);
                            fieldType = `repeated ${elementMessageName}`;
                        } else {
                            // 数组元素是基本类型
                            const elementType = getProtobufType(firstElement);
                            fieldType = `repeated ${elementType}`;
                        }
                    }
                } else {
                    // 嵌套对象，为其创建新的消息
                    const nestedMessageName = generateUniqueMessageName(capitalize(fieldName), parentName, messageDefinitions);
                    const nestedMessage = generateMessageDefinition(value, nestedMessageName, messageDefinitions, messageName);
                    messageDefinitions.push(nestedMessage);
                    fieldType = nestedMessageName;
                }
            } else {
                // 基本类型
                fieldType = getProtobufType(value);
            }
            
            messageCode += `    ${fieldType} ${fieldName} = ${fieldNumber};\n`;
            fieldNumber++;
        }
    }
    
    messageCode += '}';
    return messageCode;
}

// 生成唯一的消息名称，避免命名冲突
function generateUniqueMessageName(baseName, parentName, messageDefinitions) {
    // 首先尝试使用基础名称
    let candidateName = baseName;
    
    // 如果父名称存在，尝试组合名称
    if (parentName) {
        candidateName = `${parentName}${baseName}`;
    }
    
    // 检查是否已存在同名消息
    let counter = 1;
    let finalName = candidateName;
    while (messageDefinitions.some(def => def.startsWith(`message ${finalName} {`))) {
        finalName = `${candidateName}${counter}`;
        counter++;
    }
    
    return finalName;
}

// 获取JavaScript值对应的Protobuf类型
function getProtobufType(value) {
    if (value === null) return 'string';
    if (Array.isArray(value)) {
        if (value.length === 0) return 'repeated string';
        const elementType = getProtobufType(value[0]);
        if (elementType.startsWith('repeated ')) {
            return `repeated ${elementType.substring(9)}`;
        }
        return `repeated ${elementType}`;
    }
    switch (typeof value) {
        case 'string': return 'string';
        case 'number': 
            if (Number.isInteger(value)) return 'int32';
            return 'double';
        case 'boolean': return 'bool';
        case 'object': 
            if (value instanceof Date) return 'string';
            return 'string';
        default: return 'string';
    }
}

// YAML转Protobuf功能
function yamlToProtobuf() {
    const inputText = document.getElementById('input-text').value.trim();
    
    if (!inputText) {
        showAlert('请输入要转换的YAML');
        return;
    }
    
    try {
        // 解析YAML
        const yamlObj = jsyaml.load(inputText);
        const protobuf = convertJsonToProtobuf(yamlObj, "Message");
        displayResult('Protobuf结果', protobuf);
    } catch (error) {
        showAlert('YAML解析出错: ' + error.message);
        console.error(error);
    }
}

// SQL转GORM功能
function sqlToGorm() {
    const inputText = document.getElementById('input-text').value.trim();
    
    if (!inputText) {
        showAlert('请输入要转换的SQL语句');
        return;
    }
    
    try {
        const gormStruct = convertSqlToGorm(inputText);
        displayResult('GORM结构体结果', gormStruct);
    } catch (error) {
        showAlert('SQL转换出错: ' + error.message);
        console.error(error);
    }
}

// 将JSON对象转换为Go结构体（支持多维JSON和切片定义）
function convertJsonToGoStruct(obj, structName) {
    let structDefinitions = []; // 存储所有结构体定义
    let mainStructName = structName;
    
    // 如果顶层是一个数组，则将其作为切片处理
    if (Array.isArray(obj)) {
        if (obj.length === 0) {
            return `type ${mainStructName} []interface{}`;
        }
        
        // 对于非空数组，我们假设所有元素具有相同的结构
        const firstElement = obj[0];
        if (typeof firstElement === 'object' && firstElement !== null) {
            // 生成元素的结构体定义
            const elementStructName = mainStructName;
            const elementStruct = generateStructDefinition(firstElement, elementStructName, structDefinitions, '');
            structDefinitions.push(elementStruct);
            
            // 返回切片定义
            return `type ${mainStructName} []${elementStructName}\n\n` + structDefinitions.join('\n\n');
        } else {
            // 数组元素是基本类型
            const elementType = getGoType(firstElement);
            return `type ${mainStructName} []${elementType}`;
        }
    } else if (typeof obj === 'object' && obj !== null) {
        // 顶层是对象的情况
        const mainStruct = generateStructDefinition(obj, mainStructName, structDefinitions, '');
        structDefinitions.push(mainStruct);
        
        return structDefinitions.join('\n\n');
    } else {
        // 顶层是基本类型的情况
        return `type ${mainStructName} ${getGoType(obj)}`;
    }
}

// 生成结构体定义（递归处理嵌套对象）
function generateStructDefinition(obj, structName, structDefinitions, parentName = '') {
    let structCode = `type ${structName} struct {\n`;
    
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            const fieldName = toCamelCase(key);
            
            let goType;
            if (typeof value === 'object' && value !== null) {
                if (Array.isArray(value)) {
                    if (value.length === 0) {
                        goType = '[]interface{}';
                    } else {
                        const firstElement = value[0];
                        if (typeof firstElement === 'object' && firstElement !== null) {
                            // 为数组元素创建新的结构体，使用更具描述性的名称
                            const elementStructName = generateUniqueStructName(capitalize(fieldName), parentName, structDefinitions);
                            const elementStruct = generateStructDefinition(firstElement, elementStructName, structDefinitions, structName);
                            structDefinitions.push(elementStruct);
                            goType = `[]${elementStructName}`;
                        } else {
                            // 数组元素是基本类型
                            const elementType = getGoType(firstElement);
                            goType = `[]${elementType}`;
                        }
                    }
                } else {
                    // 嵌套对象，为其创建新的结构体
                    const nestedStructName = generateUniqueStructName(capitalize(fieldName), parentName, structDefinitions);
                    const nestedStruct = generateStructDefinition(value, nestedStructName, structDefinitions, structName);
                    structDefinitions.push(nestedStruct);
                    goType = nestedStructName;
                }
            } else {
                // 基本类型
                goType = getGoType(value);
            }
            
            const jsonTag = key !== fieldName ? ` \`json:"${key}"\`` : '';
            structCode += `    ${fieldName} ${goType}${jsonTag}\n`;
        }
    }
    
    structCode += '}';
    return structCode;
}

// 生成唯一的结构体名称，避免命名冲突
function generateUniqueStructName(baseName, parentName, structDefinitions) {
    // 首先尝试使用基础名称
    let candidateName = baseName;
    
    // 如果父名称存在，尝试组合名称
    if (parentName) {
        candidateName = `${parentName}${baseName}`;
    }
    
    // 检查是否已存在同名结构体
    let counter = 1;
    let finalName = candidateName;
    while (structDefinitions.some(def => def.startsWith(`type ${finalName} struct`))) {
        finalName = `${candidateName}${counter}`;
        counter++;
    }
    
    return finalName;
}

// 获取JavaScript值对应的Go类型
function getGoType(value) {
    if (value === null) return 'interface{}';
    if (Array.isArray(value)) {
        if (value.length === 0) return '[]interface{}';
        const elementType = getGoType(value[0]);
        return `[]${elementType}`;
    }
    switch (typeof value) {
        case 'string': return 'string';
        case 'number': 
            if (Number.isInteger(value)) return 'int';
            return 'float64';
        case 'boolean': return 'bool';
        case 'object': 
            if (value instanceof Date) return 'time.Time';
            return 'struct{}';
        default: return 'interface{}';
    }
}

// 将字符串转换为驼峰命名
function toCamelCase(str) {
    return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase())
              .replace(/^([A-Z])/, (match) => match.toLowerCase())
              .replace(/^./, (match) => match.toUpperCase());
}

// 首字母大写
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// 将SQL转换为GORM结构体（增强版）
function convertSqlToGorm(sql) {
    // 提取表名
    let tableName = 'TableName';
    const tableMatch = sql.match(/create\s+table\s+(?:if\s+not\s+exists\s+)?`?(\w+)`?/i);
    if (tableMatch) {
        tableName = toCamelCase(tableMatch[1]);
        // 首字母大写
        tableName = tableName.charAt(0).toUpperCase() + tableName.slice(1);
    }
    
    // 简单的SQL解析实现
    const lines = sql.split('\n');
    let structCode = `type ${tableName} struct {\n`;
    
    for (const line of lines) {
        const trimmedLine = line.trim();
        // 匹配字段定义行
        if (trimmedLine.startsWith('`') && trimmedLine.includes('`')) {
            const fieldNameMatch = trimmedLine.match(/`([^`]+)`/);
            if (fieldNameMatch) {
                const fieldName = fieldNameMatch[1];
                const goFieldName = toCamelCase(fieldName);
                let goType = 'string'; // 默认类型
                
                // 根据SQL类型推断Go类型
                const lowerLine = trimmedLine.toLowerCase();
                
                // 处理整数类型
                if (lowerLine.includes('bigint')) {
                    goType = 'int64';
                } else if (lowerLine.includes('int')) {
                    // 检查是否为ID字段且是主键
                    if ((fieldName.toLowerCase() === 'id' || fieldName.toLowerCase().endsWith('_id')) && 
                        (lowerLine.includes('primary key') || lowerLine.includes('primary_key'))) {
                        goType = 'int64';
                    } else {
                        goType = 'int32';
                    }
                } else if (lowerLine.includes('tinyint')) {
                    goType = 'int32';
                } else if (lowerLine.includes('varchar') || 
                          lowerLine.includes('text') || 
                          lowerLine.includes('char')) {
                    goType = 'string';
                } else if (lowerLine.includes('datetime') || 
                          lowerLine.includes('timestamp')) {
                    goType = 'time.Time';
                } else if (lowerLine.includes('decimal') || 
                          lowerLine.includes('float') || 
                          lowerLine.includes('double')) {
                    goType = 'float64';
                } else if (lowerLine.includes('bool') || 
                          lowerLine.includes('boolean')) {
                    goType = 'bool';
                }
                
                // 解析GORM标签
                const gormTags = [];
                gormTags.push(`column:${fieldName}`);
                
                // 检查是否为主键
                if (lowerLine.includes('primary key') || 
                    lowerLine.includes('primary_key')) {
                    gormTags.push('primaryKey');
                }
                
                // 检查是否为自增字段
                if (lowerLine.includes('auto_increment') || 
                    lowerLine.includes('autoincrement')) {
                    gormTags.push('autoIncrement');
                }
                
                // 检查默认值
                const defaultValueMatch = trimmedLine.match(/default\s+['"]?([^'"]+)['"]?/i);
                if (defaultValueMatch) {
                    gormTags.push(`default:${defaultValueMatch[1]}`);
                }
                
                // 检查是否允许为空
                if (lowerLine.includes('not null')) {
                    // GORM默认所有字段都是NOT NULL，除非明确指定
                } else {
                    gormTags.push('omitempty');
                }
                
                // 检查唯一约束
                if (lowerLine.includes('unique')) {
                    gormTags.push('unique');
                }
                
                // 检查索引
                if (lowerLine.includes('index')) {
                    gormTags.push('index');
                }
                
                // 提取字段注释
                const commentMatch = trimmedLine.match(/comment\s+['"]([^'"]+)['"]/i);
                if (commentMatch) {
                    gormTags.push(`comment:${commentMatch[1]}`);
                }
                
                // 生成GORM标签
                const gormTag = ` \`gorm:"${gormTags.join(';')}"\``;
                structCode += `    ${goFieldName} ${goType}${gormTag}\n`;
            }
        }
    }
    
    structCode += '}';
    return structCode;
}

// 显示结果
function displayResult(title, result) {
    const resultDiv = document.getElementById('json2go-result');
    if (resultDiv) {
        // 创建结果容器
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        
        // 创建标题容器
        const titleDiv = document.createElement('div');
        titleDiv.className = 'result-title';
        
        // 创建标题文本
        const titleText = document.createElement('div');
        titleText.className = 'result-title-text';
        titleText.textContent = title + '：';
        
        // 创建复制按钮
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.textContent = '复制';
        copyBtn.addEventListener('click', function() {
            copyToClipboard(result);
        });
        
        // 组装标题行
        titleDiv.appendChild(titleText);
        titleDiv.appendChild(copyBtn);
        
        // 创建结果值
        const valueDiv = document.createElement('div');
        valueDiv.className = 'result-value';
        valueDiv.textContent = result;
        
        // 组装元素
        resultItem.appendChild(titleDiv);
        resultItem.appendChild(valueDiv);
        
        // 清空并添加新结果
        resultDiv.innerHTML = '';
        resultDiv.appendChild(resultItem);
        resultDiv.style.display = 'block';
    }
}

// 复制到剪贴板 - 与其他页面保持一致的实现
function copyToClipboard(text) {
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

// 清空输入和结果
function clearInput() {
    document.getElementById('input-text').value = '';
    const resultDiv = document.getElementById('json2go-result');
    if (resultDiv) {
        resultDiv.style.display = 'none';
        resultDiv.innerHTML = '';
    }
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

// JSON转PHP数组功能
function jsonToPhpArray() {
    const inputText = document.getElementById('input-text').value.trim();
    
    if (!inputText) {
        showAlert('请输入要转换的JSON');
        return;
    }
    
    try {
        // 解析JSON
        const jsonObj = JSON.parse(inputText);
        const phpArray = convertJsonToPhpArray(jsonObj);
        displayResult('PHP数组结果', phpArray);
    } catch (error) {
        showAlert('JSON解析出错: ' + error.message);
        console.error(error);
    }
}

// 将JavaScript对象转换为PHP数组
function convertJsonToPhpArray(obj, indent = 0) {
    const spaces = ' '.repeat(indent);
    
    if (obj === null) {
        return 'null';
    }
    
    if (Array.isArray(obj)) {
        if (obj.length === 0) {
            return '[]';
        }
        
        const items = obj.map(item => {
            return `${spaces}    ${convertJsonToPhpArray(item, indent + 4)}`;
        });
        
        return `[\n${items.join(',\n')}\n${spaces}]`;
    }
    
    if (typeof obj === 'object') {
        const keys = Object.keys(obj);
        if (keys.length === 0) {
            return '[]';
        }
        
        const items = keys.map(key => {
            const value = obj[key];
            const formattedKey = typeof key === 'string' ? `'${key}'` : key;
            return `${spaces}    ${formattedKey} => ${convertJsonToPhpArray(value, indent + 4)}`;
        });
        
        return `[\n${items.join(',\n')}\n${spaces}]`;
    }
    
    // 处理基本类型
    if (typeof obj === 'string') {
        return `'${obj.replace(/'/g, "\\'")}'`;
    }
    
    if (typeof obj === 'boolean') {
        return obj ? 'true' : 'false';
    }
    
    return String(obj);
}
