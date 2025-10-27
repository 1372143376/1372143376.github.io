// curl命令转代码函数
function convertCurl() {
    const curlInput = document.getElementById('curl-input').value.trim();
    const language = document.getElementById('language-select').value;
    const resultDiv = document.getElementById('curl-result');
    
    if (!curlInput) {
        showAlert('请输入curl命令');
        return;
    }
    
    try {
        // 解析curl命令
        const parsedCommand = parseCurlCommand(curlInput);
        
        // 根据选择的语言生成代码
        let code = '';
        switch (language) {
            case 'python':
                code = generatePythonCode(parsedCommand);
                break;
            case 'javascript':
                code = generateJavaScriptCode(parsedCommand);
                break;
            case 'php':
                code = generatePHPCode(parsedCommand);
                break;
            case 'go':
                code = generateGoCode(parsedCommand);
                break;
            case 'java':
                code = generateJavaCode(parsedCommand);
                break;
            case 'csharp':
                code = generateCSharpCode(parsedCommand);
                break;
            case 'c':
                code = generateCCode(parsedCommand);
                break;
            case 'wget':
                code = generateWgetCode(parsedCommand);
                break;
            case 'rust':
                code = generateRustCode(parsedCommand);
                break;
            default:
                code = '暂不支持该语言';
        }
        
        // 显示结果
        if (resultDiv) {
            resultDiv.innerHTML = `
                <div class="result-item">
                    <div class="result-title">${getLanguageName(language)}代码：</div>
                    <div class="result-value"><pre>${escapeHtml(code)}</pre></div>
                    <button class="copy-btn" onclick="copyToClipboard(${JSON.stringify(code).replace(/"/g, '&quot;')})">复制</button>
                </div>
            `;
            resultDiv.style.display = 'block';
        }
    } catch (error) {
        showAlert('转换过程中出现错误：' + error.message);
        console.error(error);
    }
}

// 清空输入和结果
function clearInput() {
    document.getElementById('curl-input').value = 'curl -X GET "https://www.baidu.com"';
    const resultDiv = document.getElementById('curl-result');
    if (resultDiv) {
        resultDiv.style.display = 'none';
        resultDiv.innerHTML = '';
    }
    // 设置默认语言为Go
    document.getElementById('language-select').value = 'go';
}

// 页面加载完成后添加事件监听器
document.addEventListener('DOMContentLoaded', function() {
    // 设置默认语言为Go
    document.getElementById('language-select').value = 'go';
    
    // 为示例按钮添加点击事件
    const exampleButtons = document.querySelectorAll('.example-btn');
    exampleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const example = this.getAttribute('data-example');
            const curlInput = document.getElementById('curl-input');
            
            switch (example) {
                case 'get':
                    curlInput.value = 'curl -X GET "https://www.baidu.com"';
                    break;
                case 'post':
                    curlInput.value = 'curl -X POST "https://www.baidu.com" \\\n-H "Content-Type: application/json" \\\n-d \'{"key":"value"}\'';
                    break;
                case 'basic_auth':
                    curlInput.value = 'curl -u username:password "https://www.baidu.com"';
                    break;
                case 'wget':
                    curlInput.value = 'wget --header="Content-Type: application/json;charset=UTF-8" \\\n--post-data=\'{"msg1":"hello","msg2":"world"}\' \\\n--output-document - \\\nhttps://test.url.com/api/ApiName';
                    break;
                default:
                    curlInput.value = 'curl -X GET "https://www.baidu.com"';
            }
        });
    });
});

// 解析curl命令
function parseCurlCommand(curlCommand) {
    // 检查是否是wget命令
    if (curlCommand.startsWith('wget')) {
        return parseWgetCommand(curlCommand);
    }
    
    // 移除开头的curl命令
    let command = curlCommand.replace(/^curl\s+/, '');
    
    const result = {
        method: 'GET',
        url: '',
        headers: {},
        data: null,
        auth: null
    };
    
    // 解析选项
    const args = command.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) || [];
    let i = 0;
    
    while (i < args.length) {
        const arg = args[i];
        
        if (arg === '-X' || arg === '--request') {
            result.method = args[++i].toUpperCase();
        } else if (arg === '-H' || arg === '--header') {
            const header = args[++i];
            const [key, value] = header.split(':').map(s => s.trim());
            result.headers[key] = value;
        } else if (arg === '-d' || arg === '--data' || arg === '--data-raw') {
            result.data = args[++i];
        } else if (arg === '-u' || arg === '--user') {
            result.auth = args[++i];
        } else if (arg.startsWith('-')) {
            // 忽略其他选项
            i++;
        } else {
            // URL应该在最后
            if (!result.url) {
                result.url = arg.replace(/['"]/g, '');
            }
        }
        i++;
    }
    
    // 如果没有指定方法但有数据，则默认为POST
    if (result.method === 'GET' && result.data) {
        result.method = 'POST';
    }
    
    return result;
}

// 解析wget命令
function parseWgetCommand(wgetCommand) {
    let command = wgetCommand.replace(/^wget\s+/, '');
    
    const result = {
        method: 'GET',
        url: '',
        headers: {},
        data: null,
        auth: null
    };
    
    // 解析选项
    const args = command.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) || [];
    let i = 0;
    
    while (i < args.length) {
        const arg = args[i];
        
        if (arg === '--header') {
            const header = args[++i];
            const [key, value] = header.split(':').map(s => s.trim());
            result.headers[key] = value;
        } else if (arg === '--post-data') {
            result.method = 'POST';
            result.data = args[++i];
        } else if (arg === '--output-document' || arg === '-O') {
            // 跳过输出文件参数
            i++;
        } else if (arg.startsWith('--')) {
            // 忽略其他选项
            i++;
        } else if (!arg.startsWith('-')) {
            // URL应该在最后
            if (!result.url) {
                result.url = arg;
            }
        }
        i++;
    }
    
    return result;
}

// 生成Python代码
function generatePythonCode(parsedCommand) {
    let code = 'import requests\n\n';
    
    // 准备参数
    const params = [];
    if (Object.keys(parsedCommand.headers).length > 0) {
        code += 'headers = {\n';
        for (const [key, value] of Object.entries(parsedCommand.headers)) {
            code += `    '${key}': '${value}',\n`;
        }
        code += '}\n\n';
        params.push('headers=headers');
    }
    
    if (parsedCommand.data) {
        // 尝试解析为JSON
        try {
            const jsonData = JSON.parse(parsedCommand.data);
            code += `json_data = ${JSON.stringify(jsonData, null, 2)}\n\n`;
            params.push('json=json_data');
        } catch (e) {
            code += `data = '''${parsedCommand.data}'''\n\n`;
            params.push('data=data');
        }
    }
    
    if (parsedCommand.auth) {
        const [username, password] = parsedCommand.auth.split(':');
        code += `auth = ('${username}', '${password}')\n\n`;
        params.push(`auth=auth`);
    }
    
    const paramsStr = params.length > 0 ? `, ${params.join(', ')}` : '';
    code += `response = requests.${parsedCommand.method.toLowerCase()}('${parsedCommand.url}'${paramsStr})\n`;
    code += 'print(response.text)';
    
    return code;
}

// 生成JavaScript (Node.js) 代码
function generateJavaScriptCode(parsedCommand) {
    let code = 'const axios = require(\'axios\');\n\n';
    
    const config = {
        method: parsedCommand.method,
        url: parsedCommand.url
    };
    
    if (Object.keys(parsedCommand.headers).length > 0) {
        config.headers = parsedCommand.headers;
    }
    
    if (parsedCommand.data) {
        // 尝试解析为JSON
        try {
            const jsonData = JSON.parse(parsedCommand.data);
            config.data = jsonData;
        } catch (e) {
            config.data = parsedCommand.data;
        }
    }
    
    if (parsedCommand.auth) {
        const [username, password] = parsedCommand.auth.split(':');
        config.auth = {
            username: username,
            password: password
        };
    }
    
    code += 'const config = ' + JSON.stringify(config, null, 2) + ';\n\n';
    code += 'axios(config)\n';
    code += '  .then(response => {\n';
    code += '    console.log(JSON.stringify(response.data));\n';
    code += '  })\n';
    code += '  .catch(error => {\n';
    code += '    console.log(error);\n';
    code += '  });';
    
    return code;
}

// 生成PHP代码
function generatePHPCode(parsedCommand) {
    let code = '<?php\n\n';
    code += '$curl = curl_init();\n\n';
    
    code += `curl_setopt_array($curl, array(\n`;
    code += `  CURLOPT_URL => '${parsedCommand.url}',\n`;
    code += `  CURLOPT_RETURNTRANSFER => true,\n`;
    code += `  CURLOPT_ENCODING => '',\n`;
    code += `  CURLOPT_MAXREDIRS => 10,\n`;
    code += `  CURLOPT_TIMEOUT => 0,\n`;
    code += `  CURLOPT_FOLLOWLOCATION => true,\n`;
    code += `  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,\n`;
    code += `  CURLOPT_CUSTOMREQUEST => '${parsedCommand.method}',\n`;
    
    if (parsedCommand.data) {
        code += `  CURLOPT_POSTFIELDS => '${parsedCommand.data.replace(/'/g, "\\'")}',\n`;
    }
    
    if (Object.keys(parsedCommand.headers).length > 0) {
        code += `  CURLOPT_HTTPHEADER => array(\n`;
        for (const [key, value] of Object.entries(parsedCommand.headers)) {
            code += `    '${key}: ${value}',\n`;
        }
        code += `  ),\n`;
    }
    
    code += `));\n\n`;
    code += `$response = curl_exec($curl);\n\n`;
    code += `curl_close($curl);\n`;
    code += `echo $response;\n`;
    code += `?>`;
    
    return code;
}

// 生成Go代码
function generateGoCode(parsedCommand) {
    let code = 'package main\n\n';
    code += 'import (\n';
    code += '  "fmt"\n';
    code += '  "strings"\n';
    code += '  "net/http"\n';
    code += '  "io"\n';
    code += ')\n\n';
    code += 'func main() {\n';
    code += `  url := "${parsedCommand.url}"\n`;
    code += `  method := "${parsedCommand.method}"\n\n`;
    
    if (parsedCommand.data) {
        code += `  payload := strings.NewReader(\`${parsedCommand.data}\`)\n\n`;
    } else {
        code += '  var payload io.Reader\n\n';
    }
    
    code += '  client := &http.Client {}\n';
    code += '  req, err := http.NewRequest(method, url, payload)\n';
    code += '  if err != nil {\n';
    code += '    fmt.Println(err)\n';
    code += '    return\n';
    code += '  }\n\n';
    
    for (const [key, value] of Object.entries(parsedCommand.headers)) {
        code += `  req.Header.Add("${key}", "${value}")\n`;
    }
    
    if (parsedCommand.auth) {
        const [username, password] = parsedCommand.auth.split(':');
        code += `  req.SetBasicAuth("${username}", "${password}")\n`;
    }
    
    code += '\n  res, err := client.Do(req)\n';
    code += '  if err != nil {\n';
    code += '    fmt.Println(err)\n';
    code += '    return\n';
    code += '  }\n';
    code += '  defer res.Body.Close()\n\n';
    code += '  body, err := io.ReadAll(res.Body)\n';
    code += '  if err != nil {\n';
    code += '    fmt.Println(err)\n';
    code += '    return\n';
    code += '  }\n';
    code += '  fmt.Println(string(body))\n';
    code += '}';
    
    return code;
}

// 生成Java代码
function generateJavaCode(parsedCommand) {
    let code = 'import java.io.*;\n';
    code += 'import java.net.*;\n';
    code += 'import java.util.*;\n\n';
    code += 'public class CurlRequest {\n';
    code += '  public static void main(String[] args) throws Exception {\n';
    code += `    URL url = new URL("${parsedCommand.url}");\n`;
    code += `    HttpURLConnection conn = (HttpURLConnection) url.openConnection();\n`;
    code += `    conn.setRequestMethod("${parsedCommand.method}");\n\n`;
    
    // 设置Headers
    for (const [key, value] of Object.entries(parsedCommand.headers)) {
        code += `    conn.setRequestProperty("${key}", "${value}");\n`;
    }
    
    // Basic Auth
    if (parsedCommand.auth) {
        // 简化处理，实际应该使用Base64编码
        code += `    // 注意：需要添加Base64编码逻辑\n`;
        code += `    String auth = "${parsedCommand.auth}";\n`;
        code += `    String encodedAuth = java.util.Base64.getEncoder().encodeToString(auth.getBytes());\n`;
        code += `    conn.setRequestProperty("Authorization", "Basic " + encodedAuth);\n`;
    }
    
    // POST数据
    if (parsedCommand.data) {
        code += '\n    conn.setDoOutput(true);\n';
        code += '    String postData = "' + parsedCommand.data.replace(/"/g, '\\"') + '";\n';
        code += '    try (OutputStream os = conn.getOutputStream()) {\n';
        code += '      byte[] input = postData.getBytes("utf-8");\n';
        code += '      os.write(input, 0, input.length);\n';
        code += '    }\n';
    }
    
    code += '\n    try (BufferedReader br = new BufferedReader(\n';
    code += '      new InputStreamReader(conn.getInputStream(), "utf-8"))) {\n';
    code += '      StringBuilder response = new StringBuilder();\n';
    code += '      String responseLine = null;\n';
    code += '      while ((responseLine = br.readLine()) != null) {\n';
    code += '        response.append(responseLine.trim());\n';
    code += '      }\n';
    code += '      System.out.println(response.toString());\n';
    code += '    }\n';
    code += '  }\n';
    code += '}';
    
    return code;
}

// 生成C#代码
function generateCSharpCode(parsedCommand) {
    let code = 'using System;\n';
    code += 'using System.Net.Http;\n';
    code += 'using System.Threading.Tasks;\n\n';
    code += 'class Program\n';
    code += '{\n';
    code += '  static async Task Main(string[] args)\n';
    code += '  {\n';
    code += '    var client = new HttpClient();\n\n';
    
    // 设置Headers
    for (const [key, value] of Object.entries(parsedCommand.headers)) {
        code += `    client.DefaultRequestHeaders.Add("${key}", "${value}");\n`;
    }
    
    // Basic Auth
    if (parsedCommand.auth) {
        const [username, password] = parsedCommand.auth.split(':');
        code += `    var authToken = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes("${username}:${password}"));\n`;
        code += '    client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", authToken);\n';
    }
    
    if (parsedCommand.method === 'GET') {
        code += `\n    var response = await client.GetAsync("${parsedCommand.url}");\n`;
        code += '    var responseBody = await response.Content.ReadAsStringAsync();\n';
        code += '    Console.WriteLine(responseBody);\n';
    } else if (parsedCommand.method === 'POST' && parsedCommand.data) {
        code += `\n    var requestData = @"${parsedCommand.data}";\n`;
        code += '    var content = new StringContent(requestData, System.Text.Encoding.UTF8, "application/json");\n';
        code += `    var response = await client.PostAsync("${parsedCommand.url}", content);\n`;
        code += '    var responseBody = await response.Content.ReadAsStringAsync();\n';
        code += '    Console.WriteLine(responseBody);\n';
    }
    
    code += '  }\n';
    code += '}';
    
    return code;
}

// 生成C代码
function generateCCode(parsedCommand) {
    let code = '#include <stdio.h>\n';
    code += '#include <stdlib.h>\n';
    code += '#include <string.h>\n\n';
    code += '// 注意：此代码需要libcurl库\n';
    code += '#include <curl/curl.h>\n\n';
    code += 'struct string {\n';
    code += '  char *ptr;\n';
    code += '  size_t len;\n';
    code += '};\n\n';
    code += 'void init_string(struct string *s) {\n';
    code += '  s->len = 0;\n';
    code += '  s->ptr = malloc(s->len+1);\n';
    code += '  if (s->ptr == NULL) {\n';
    code += '    fprintf(stderr, "malloc() failed\\n");\n';
    code += '    exit(EXIT_FAILURE);\n';
    code += '  }\n';
    code += '  s->ptr[0] = \'\\0\';\n';
    code += '}\n\n';
    code += 'size_t writefunc(void *ptr, size_t size, size_t nmemb, struct string *s) {\n';
    code += '  size_t new_len = s->len + size*nmemb;\n';
    code += '  s->ptr = realloc(s->ptr, new_len+1);\n';
    code += '  if (s->ptr == NULL) {\n';
    code += '    fprintf(stderr, "realloc() failed\\n");\n';
    code += '    exit(EXIT_FAILURE);\n';
    code += '  }\n';
    code += '  memcpy(s->ptr+s->len, ptr, size*nmemb);\n';
    code += '  s->ptr[new_len] = \'\\0\';\n';
    code += '  s->len = new_len;\n';
    code += '  return size*nmemb;\n';
    code += '}\n\n';
    code += 'int main(void) {\n';
    code += '  CURL *curl;\n';
    code += '  CURLcode res;\n';
    code += '  struct string s;\n';
    code += '  init_string(&s);\n\n';
    code += '  curl = curl_easy_init();\n';
    code += '  if(curl) {\n';
    code += `    curl_easy_setopt(curl, CURLOPT_URL, "${parsedCommand.url}");\n`;
    
    if (parsedCommand.method !== 'GET') {
        code += `    curl_easy_setopt(curl, CURLOPT_CUSTOMREQUEST, "${parsedCommand.method}");\n`;
    }
    
    if (parsedCommand.data) {
        code += `    curl_easy_setopt(curl, CURLOPT_POSTFIELDS, "${parsedCommand.data.replace(/"/g, '\\"')}");\n`;
    }
    
    for (const [key, value] of Object.entries(parsedCommand.headers)) {
        code += `    curl_easy_setopt(curl, CURLOPT_HTTPHEADER, curl_slist_append(NULL, "${key}: ${value}"));\n`;
    }
    
    if (parsedCommand.auth) {
        const [username, password] = parsedCommand.auth.split(':');
        code += `    curl_easy_setopt(curl, CURLOPT_USERPWD, "${username}:${password}");\n`;
    }
    
    code += '    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, writefunc);\n';
    code += '    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &s);\n';
    code += '    res = curl_easy_perform(curl);\n';
    code += '    if(res != CURLE_OK)\n';
    code += '      fprintf(stderr, "curl_easy_perform() failed: %s\\n", curl_easy_strerror(res));\n\n';
    code += '    printf("%s\\n", s.ptr);\n';
    code += '    free(s.ptr);\n';
    code += '    curl_easy_cleanup(curl);\n';
    code += '  }\n';
    code += '  return 0;\n';
    code += '}';
    
    return code;
}

// 生成Wget代码
function generateWgetCode(parsedCommand) {
    let code = '';
    
    // 构建wget命令
    code += 'wget';
    
    // 添加headers
    for (const [key, value] of Object.entries(parsedCommand.headers)) {
        code += ` \\\n--header="${key}: ${value}"`;
    }
    
    // 添加POST数据
    if (parsedCommand.method === 'POST' && parsedCommand.data) {
        code += ` \\\n--post-data='${parsedCommand.data}'`;
    }
    
    // 输出到标准输出
    code += ' \\\n--output-document -';
    
    // 添加URL
    code += ` \\\n${parsedCommand.url}`;
    
    return code;
}

// 生成Rust代码
function generateRustCode(parsedCommand) {
    let code = 'use reqwest;\n';
    code += 'use std::error::Error;\n\n';
    code += '#[tokio::main]\n';
    code += 'async fn main() -> Result<(), Box<dyn Error>> {\n';
    code += '    let client = reqwest::Client::new();\n\n';
    
    // 构建请求
    code += `    let mut request = client.${parsedCommand.method.toLowerCase()}("${parsedCommand.url}")`;
    
    // 添加headers
    if (Object.keys(parsedCommand.headers).length > 0) {
        code += '\n';
        for (const [key, value] of Object.entries(parsedCommand.headers)) {
            code += `        .header("${key}", "${value}")\n`;
        }
    }
    
    // 添加body
    if (parsedCommand.data) {
        code += `        .body(r#"${parsedCommand.data}"#)`;
    }
    
    code += ';\n\n';
    code += '    let response = request.send().await?;\n';
    code += '    let body = response.text().await?;\n';
    code += '    println!("{}", body);\n\n';
    code += '    Ok(())\n';
    code += '}';
    
    return code;
}

// 获取语言名称
function getLanguageName(lang) {
    const names = {
        'python': 'Python',
        'javascript': 'JavaScript (Node.js)',
        'php': 'PHP',
        'go': 'Go',
        'java': 'Java',
        'csharp': 'C#',
        'c': 'C',
        'wget': 'Wget',
        'rust': 'Rust'
    };
    return names[lang] || lang;
}

// 转义HTML特殊字符
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// 复制到剪贴板功能
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