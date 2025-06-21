document.addEventListener('DOMContentLoaded', function() {
    // 初始化Mermaid
    mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose',
        fontFamily: 'Microsoft YaHei, sans-serif'
    });
    
    // 获取DOM元素
    const codeEditor = document.getElementById('code-editor');
    const renderBtn = document.getElementById('render-btn');
    const clearBtn = document.getElementById('clear-btn');
    const previewContainer = document.getElementById('preview-container');
    const mermaidDiagram = document.getElementById('mermaid-diagram');
    
    const exportPngBtn = document.getElementById('export-png');
    const exportJpgBtn = document.getElementById('export-jpg');
    const exportSvgBtn = document.getElementById('export-svg');
    const exportPdfBtn = document.getElementById('export-pdf');
    
    // 初始渲染
    renderMermaidDiagram();
    
    // 渲染按钮点击事件
    renderBtn.addEventListener('click', renderMermaidDiagram);
    
    // 清除按钮点击事件
    clearBtn.addEventListener('click', function() {
        codeEditor.value = '';
        mermaidDiagram.innerHTML = '';
    });
    
    // 导出按钮点击事件
    exportPngBtn.addEventListener('click', function() {
        exportDiagram('png');
    });
    
    exportJpgBtn.addEventListener('click', function() {
        exportDiagram('jpg');
    });
    
    exportSvgBtn.addEventListener('click', function() {
        exportDiagram('svg');
    });
    
    exportPdfBtn.addEventListener('click', function() {
        exportDiagram('pdf');
    });
    
    // 渲染Mermaid图表函数
    function renderMermaidDiagram() {
        const code = codeEditor.value.trim();
        if (!code) {
            mermaidDiagram.innerHTML = '<div class="empty-message">请输入Mermaid代码</div>';
            return;
        }
        
        try {
            mermaidDiagram.innerHTML = code;
            mermaid.render('mermaid-svg', code).then(result => {
                mermaidDiagram.innerHTML = result.svg;
            }).catch(error => {
                console.error('Mermaid渲染错误:', error);
                mermaidDiagram.innerHTML = `<div class="error-message">代码语法错误:<br>${error.message}</div>`;
            });
        } catch (error) {
            console.error('Mermaid处理错误:', error);
            mermaidDiagram.innerHTML = `<div class="error-message">处理错误:<br>${error.message}</div>`;
        }
    }
    
    // 改进的导出图表函数
    function exportDiagram(format) {
        const svgElement = previewContainer.querySelector('svg');
        
        if (!svgElement) {
            alert('请先渲染有效的Mermaid图表');
            return;
        }
        
        // 获取当前日期时间作为文件名的一部分
        const date = new Date();
        const timestamp = date.toISOString().replace(/[:.]/g, '-').substring(0, 19);
        const filename = `mermaid-diagram-${timestamp}`;
        
        switch (format) {
            case 'svg':
                // 直接导出SVG
                const svgData = new XMLSerializer().serializeToString(svgElement);
                const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
                saveAs(svgBlob, `${filename}.svg`);
                break;
                
            case 'png':
            case 'jpg':
                // 使用新方案导出图像
                exportImageWithDownloadButton(format, filename);
                break;
                
            case 'pdf':
                // PDF导出方法
                exportToPDF(filename);
                break;
        }
    }
    
    // 改进的图像导出方法 - 添加直接下载按钮
    function exportImageWithDownloadButton(format, filename) {
        try {
            // 显示加载提示
            const loadingMsg = document.createElement('div');
            loadingMsg.textContent = '正在准备图像导出...';
            loadingMsg.style.position = 'fixed';
            loadingMsg.style.top = '50%';
            loadingMsg.style.left = '50%';
            loadingMsg.style.transform = 'translate(-50%, -50%)';
            loadingMsg.style.padding = '10px 20px';
            loadingMsg.style.background = 'rgba(0,0,0,0.7)';
            loadingMsg.style.color = 'white';
            loadingMsg.style.borderRadius = '5px';
            loadingMsg.style.zIndex = '9999';
            document.body.appendChild(loadingMsg);
            
            // 直接使用当前渲染的图表代码重新渲染
            const mermaidCode = codeEditor.value.trim();
            
            // 设置背景颜色（JPG需要白色背景）
            const bgColor = format === 'jpg' ? '#FFFFFF' : 'transparent';
            
            // 创建包含Mermaid代码的HTML
            const htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Mermaid图表 - ${filename}.${format}</title>
                    <script src="https://cdn.jsdelivr.net/npm/mermaid@10.6.1/dist/mermaid.min.js"></script>
                    <script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
                    <script src="https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js"></script>
                    <style>
                        body {
                            margin: 0;
                            padding: 40px;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                            min-height: 100vh;
                            background-color: ${bgColor};
                            font-family: 'Microsoft YaHei', Arial, sans-serif;
                        }
                        .mermaid {
                            text-align: center;
                            width: 100%;
                            max-width: 100%;
                            margin-bottom: 20px;
                        }
                        .wrapper {
                            max-width: 90%;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        .btn-container {
                            margin-top: 30px;
                            display: flex;
                            flex-wrap: wrap;
                            gap: 15px;
                            justify-content: center;
                        }
                        .download-btn {
                            background-color: ${format === 'png' ? '#28a745' : '#fd7e14'};
                            color: white;
                            border: none;
                            border-radius: 4px;
                            padding: 12px 20px;
                            font-size: 16px;
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                            gap: 8px;
                            transition: all 0.2s;
                        }
                        .download-btn:hover {
                            opacity: 0.85;
                            transform: translateY(-2px);
                        }
                        .step-num {
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                            width: 24px;
                            height: 24px;
                            border-radius: 50%;
                            background-color: white;
                            color: #333;
                            font-weight: bold;
                            font-size: 14px;
                            margin-right: 8px;
                        }
                        .screenshot-btn {
                            background-color: #4a89dc;
                        }
                        .instructions {
                            margin: 20px 0;
                            padding: 15px;
                            background-color: #f8f9fa;
                            border-radius: 5px;
                            width: 100%;
                            max-width: 600px;
                        }
                        .instructions h3 {
                            margin-top: 0;
                        }
                        .instructions p {
                            margin-bottom: 0;
                        }
                        .status {
                            margin-top: 15px;
                            padding: 10px;
                            border-radius: 5px;
                            text-align: center;
                            display: none;
                        }
                        .status.success {
                            background-color: #d4edda;
                            color: #155724;
                            display: block;
                        }
                        .status.error {
                            background-color: #f8d7da;
                            color: #721c24;
                            display: block;
                        }
                        /* 快捷键提示 */
                        .shortcut {
                            display: inline-block;
                            padding: 2px 6px;
                            background-color: #eee;
                            border-radius: 3px;
                            margin: 0 3px;
                            font-family: monospace;
                            font-weight: bold;
                        }
                        /* 加载中动画 */
                        .spinner {
                            display: inline-block;
                            width: 20px;
                            height: 20px;
                            border: 3px solid rgba(255,255,255,0.3);
                            border-radius: 50%;
                            border-top-color: #fff;
                            animation: spin 1s ease-in-out infinite;
                            margin-left: 10px;
                        }
                        @keyframes spin {
                            to { transform: rotate(360deg); }
                        }
                        .hidden {
                            display: none;
                        }
                        /* 清晰度选择 */
                        .resolution-options {
                            display: flex;
                            gap: 10px;
                            margin-bottom: 15px;
                            flex-wrap: wrap;
                            justify-content: center;
                        }
                        .resolution-option {
                            padding: 8px 15px;
                            border: 2px solid ${format === 'png' ? '#28a745' : '#fd7e14'};
                            border-radius: 4px;
                            cursor: pointer;
                            transition: all 0.2s;
                        }
                        .resolution-option:hover {
                            background-color: #f0f0f0;
                        }
                        .resolution-option.selected {
                            background-color: ${format === 'png' ? '#28a745' : '#fd7e14'};
                            color: white;
                        }
                        .resolution-label {
                            font-size: 13px;
                            color: #666;
                            margin-top: 5px;
                            text-align: center;
                        }
                    </style>
                </head>
                <body>
                    <div class="wrapper">
                        <div class="instructions">
                            <h3>导出为 ${format.toUpperCase()} 图像</h3>
                            <p>请选择分辨率并点击下载按钮：</p>
                        </div>
                        
                        <div class="resolution-options">
                            <div class="resolution-option" data-scale="2" onclick="selectResolution(2)">标准清晰度</div>
                            <div class="resolution-option selected" data-scale="4" onclick="selectResolution(4)">高清</div>
                            <div class="resolution-option" data-scale="8" onclick="selectResolution(8)">超高清</div>
                        </div>
                        <div class="resolution-label">提示：分辨率越高图像越清晰，但生成时间更长</div>
                        
                        <div id="diagram-container">
                            <div class="mermaid" id="mermaid-diagram">
                                ${mermaidCode}
                            </div>
                        </div>
                        
                        <div class="btn-container">
                            <button id="download-btn" class="download-btn" onclick="downloadImage()">
                                <span class="step-num">1</span>
                                点击下载${format.toUpperCase()}图像
                                <span id="spinner" class="spinner hidden"></span>
                            </button>
                            <button class="download-btn screenshot-btn" onclick="showScreenshotHelp()">
                                <span class="step-num">2</span>
                                或使用截图工具
                            </button>
                        </div>
                        
                        <div id="status" class="status"></div>
                    </div>
                    
                    <script>
                        // 初始化Mermaid
                        mermaid.initialize({
                            startOnLoad: true,
                            theme: 'default',
                            securityLevel: 'loose',
                            fontFamily: 'Microsoft YaHei, sans-serif'
                        });
                        
                        // 当前选择的分辨率比例
                        let selectedScale = 4; // 默认4倍分辨率
                        
                        // 选择分辨率
                        function selectResolution(scale) {
                            selectedScale = scale;
                            document.querySelectorAll('.resolution-option').forEach(option => {
                                option.classList.remove('selected');
                            });
                            document.querySelector(\`.resolution-option[data-scale="\${scale}"]\`).classList.add('selected');
                        }
                        
                        // 等待图表渲染完成
                        window.onload = function() {
                            setTimeout(function() {
                                if (window.opener && !window.opener.closed) {
                                    window.opener.postMessage('image-ready', '*');
                                }
                            }, 1000);
                        };
                        
                        // 下载图像
                        function downloadImage() {
                            const spinner = document.getElementById('spinner');
                            const statusDiv = document.getElementById('status');
                            const downloadBtn = document.getElementById('download-btn');
                            
                            spinner.classList.remove('hidden');
                            downloadBtn.disabled = true;
                            statusDiv.textContent = '正在生成图像，请稍候...';
                            statusDiv.className = 'status success';
                            
                            try {
                                // 获取图表容器
                                const diagramContainer = document.getElementById('diagram-container');
                                
                                // 设置截图选项 - 使用选定的缩放比例
                                const options = {
                                    backgroundColor: '${bgColor}',
                                    scale: selectedScale, // 使用选定的分辨率
                                    useCORS: true,
                                    allowTaint: true,
                                    logging: false,
                                    imageTimeout: 0, // 禁用超时
                                    windowWidth: window.innerWidth,
                                    windowHeight: window.innerHeight
                                };
                                
                                setTimeout(function() {
                                    statusDiv.textContent = '正在渲染高分辨率图像，复杂图表可能需要较长时间...';
                                    
                                    html2canvas(diagramContainer, options)
                                    .then(function(canvas) {
                                        try {
                                            statusDiv.textContent = '图像生成完成，准备下载...';
                                            
                                            // 转换为图像并下载
                                            const mime = '${format}' === 'jpg' ? 'image/jpeg' : 'image/png';
                                            const quality = '${format}' === 'jpg' ? 1.0 : 1.0; // 最高质量
                                            
                                            canvas.toBlob(function(blob) {
                                                if (blob) {
                                                    saveAs(blob, '${filename}.${format}');
                                                    statusDiv.textContent = '下载成功！图像尺寸: ' + canvas.width + 'x' + canvas.height + ' 像素';
                                                    statusDiv.className = 'status success';
                                                } else {
                                                    throw new Error('无法创建图像数据');
                                                }
                                                spinner.classList.add('hidden');
                                                downloadBtn.disabled = false;
                                            }, mime, quality);
                                        } catch (e) {
                                            console.error('导出错误:', e);
                                            statusDiv.textContent = '导出失败: ' + e.message;
                                            statusDiv.className = 'status error';
                                            spinner.classList.add('hidden');
                                            downloadBtn.disabled = false;
                                        }
                                    })
                                    .catch(function(error) {
                                        console.error('截图错误:', error);
                                        statusDiv.textContent = '截图失败: ' + error.message;
                                        statusDiv.className = 'status error';
                                        spinner.classList.add('hidden');
                                        downloadBtn.disabled = false;
                                    });
                                }, 500); // 延迟执行，确保渲染完成
                            } catch (e) {
                                console.error('处理错误:', e);
                                statusDiv.textContent = '处理错误: ' + e.message;
                                statusDiv.className = 'status error';
                                spinner.classList.add('hidden');
                                downloadBtn.disabled = false;
                            }
                        }
                        
                        // 显示截图帮助
                        function showScreenshotHelp() {
                            const statusDiv = document.getElementById('status');
                            const isWindows = navigator.platform.indexOf('Win') > -1;
                            const isMac = navigator.platform.indexOf('Mac') > -1;
                            
                            let shortcut = '';
                            if (isWindows) {
                                shortcut = '<span class="shortcut">Win</span> + <span class="shortcut">Shift</span> + <span class="shortcut">S</span>';
                            } else if (isMac) {
                                shortcut = '<span class="shortcut">Command</span> + <span class="shortcut">Shift</span> + <span class="shortcut">4</span>';
                            } else {
                                shortcut = '截图快捷键';
                            }
                            
                            statusDiv.innerHTML = '使用系统截图工具 (' + shortcut + ') 对图表区域进行截图，然后保存到本地。';
                            statusDiv.className = 'status success';
                        }
                    </script>
                </body>
                </html>
            `;
            
            // 创建Blob并打开新窗口
            const htmlBlob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
            const blobUrl = URL.createObjectURL(htmlBlob);
            const imageWindow = window.open(blobUrl, '_blank');
            
            // 移除加载提示
            document.body.removeChild(loadingMsg);
            
            if (!imageWindow) {
                alert('请允许弹出窗口以便导出图像。请在浏览器设置中允许弹出窗口，然后重试。');
                return;
            }
            
            // 清理资源
            setTimeout(() => {
                URL.revokeObjectURL(blobUrl);
            }, 2000);
            
        } catch (e) {
            console.error('图像导出准备错误:', e);
            alert('无法准备图像导出: ' + e.message);
        }
    }
    
    // 修复乱码问题的PDF导出函数
    function exportToPDF(filename) {
        try {
            // 显示加载提示
            const loadingMsg = document.createElement('div');
            loadingMsg.textContent = '正在准备PDF导出...';
            loadingMsg.style.position = 'fixed';
            loadingMsg.style.top = '50%';
            loadingMsg.style.left = '50%';
            loadingMsg.style.transform = 'translate(-50%, -50%)';
            loadingMsg.style.padding = '10px 20px';
            loadingMsg.style.background = 'rgba(0,0,0,0.7)';
            loadingMsg.style.color = 'white';
            loadingMsg.style.borderRadius = '5px';
            loadingMsg.style.zIndex = '9999';
            document.body.appendChild(loadingMsg);
            
            // 直接使用当前渲染的图表代码重新渲染到PDF
            const mermaidCode = codeEditor.value.trim();
            
            // 创建包含Mermaid代码的HTML
            const htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Mermaid图表 - ${filename}</title>
                    <script src="https://cdn.jsdelivr.net/npm/mermaid@10.6.1/dist/mermaid.min.js"></script>
                    <style>
                        body {
                            margin: 0;
                            padding: 20px;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            min-height: 100vh;
                            background-color: white;
                            font-family: 'Microsoft YaHei', Arial, sans-serif;
                        }
                        .mermaid {
                            text-align: center;
                            max-width: 100%;
                        }
                        @media print {
                            body {
                                padding: 0;
                                margin: 0;
                            }
                            .print-instruction {
                                display: none;
                            }
                        }
                        .print-instruction {
                            position: fixed;
                            top: 10px;
                            left: 0;
                            right: 0;
                            background-color: #4a89dc;
                            color: white;
                            text-align: center;
                            padding: 10px;
                            font-size: 14px;
                            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                        }
                    </style>
                </head>
                <body>
                    <div class="print-instruction">
                        请按 Ctrl+P / Cmd+P 打印此页面，选择"另存为PDF"选项，并调整页面大小适应图表
                    </div>
                    <div class="mermaid">
                        ${mermaidCode}
                    </div>
                    
                    <script>
                        // 初始化Mermaid
                        mermaid.initialize({
                            startOnLoad: true,
                            theme: 'default',
                            securityLevel: 'loose',
                            fontFamily: 'Microsoft YaHei, sans-serif'
                        });
                        
                        // 确保Mermaid完全加载和渲染后才显示内容
                        window.onload = function() {
                            // 等待渲染完成
                            setTimeout(function() {
                                // 完成加载
                                if (window.opener && !window.opener.closed) {
                                    window.opener.postMessage('mermaid-ready', '*');
                                }
                            }, 1000);
                        };
                    </script>
                </body>
                </html>
            `;
            
            // 创建Blob并打开新窗口
            const htmlBlob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
            const blobUrl = URL.createObjectURL(htmlBlob);
            const printWindow = window.open(blobUrl, '_blank');
            
            // 移除加载提示
            document.body.removeChild(loadingMsg);
            
            if (!printWindow) {
                alert('请允许弹出窗口以便导出PDF。请在浏览器设置中允许弹出窗口，然后重试。');
                return;
            }
            
            // 显示打印指南
            const guideMsg = document.createElement('div');
            guideMsg.innerHTML = `
                <div style="padding: 20px; background-color: #f8f9fa; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); max-width: 500px;">
                    <h3 style="margin-top: 0; color: #4a89dc;">如何保存为PDF</h3>
                    <ol style="padding-left: 20px; line-height: 1.5;">
                        <li>等待新窗口中的图表<strong>完全渲染</strong>完成</li>
                        <li>点击浏览器的<strong>打印</strong>按钮（或按Ctrl+P / Cmd+P）</li>
                        <li>在打印对话框中，选择<strong>目标打印机</strong>为<strong>"另存为PDF"</strong>或类似选项</li>
                        <li>根据需要调整页面方向和其他设置</li>
                        <li>点击<strong>保存</strong>按钮并选择保存位置</li>
                    </ol>
                    <p style="margin-bottom: 0;">完成后可关闭此消息。</p>
                    <button id="close-guide" style="margin-top: 15px; padding: 5px 10px; background: #4a89dc; color: white; border: none; border-radius: 4px; cursor: pointer;">关闭提示</button>
                </div>
            `;
            guideMsg.style.position = 'fixed';
            guideMsg.style.top = '50%';
            guideMsg.style.left = '50%';
            guideMsg.style.transform = 'translate(-50%, -50%)';
            guideMsg.style.zIndex = '10000';
            document.body.appendChild(guideMsg);
            
            // 添加关闭按钮功能
            document.getElementById('close-guide').addEventListener('click', function() {
                document.body.removeChild(guideMsg);
            });
            
            // 处理消息事件，在图表渲染完毕后提醒用户
            window.addEventListener('message', function(event) {
                if (event.data === 'mermaid-ready') {
                    // 可以在这里添加通知或者其他功能
                    console.log('Mermaid图表已准备完成，可以打印为PDF');
                }
            });
            
            // 清理资源
            setTimeout(() => {
                URL.revokeObjectURL(blobUrl);
            }, 2000);
            
        } catch (e) {
            console.error('PDF准备错误:', e);
            alert('无法准备PDF: ' + e.message);
        }
    }
    
    // 添加提示信息样式
    const style = document.createElement('style');
    style.textContent = `
        .empty-message, .error-message {
            color: #666;
            text-align: center;
            padding: 20px;
            font-style: italic;
        }
        .error-message {
            color: #d9534f;
            white-space: pre-wrap;
            text-align: left;
            background: #f8d7da;
            border-radius: 4px;
            padding: 10px;
        }
    `;
    document.head.appendChild(style);
}); 