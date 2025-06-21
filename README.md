# Mermaid在线编辑器

这是一个简单但功能强大的Mermaid在线编辑器，允许用户创建和导出流程图。

## 功能特点

- 实时编辑和预览Mermaid图表
- 支持导出为多种格式：PNG、JPG、SVG和PDF
- 响应式设计，支持移动设备
- 简洁直观的用户界面

## 使用方法

1. 打开index.html文件
2. 在左侧编辑区输入Mermaid代码
3. 点击"渲染"按钮查看结果
4. 使用底部的导出按钮将图表保存为所需格式

## 示例代码

```
graph TD;
    A[开始] --> B[流程];
    B --> C{条件};
    C -->|是| D[处理1];
    C -->|否| E[处理2];
    D --> F[结束];
    E --> F;
```

```
sequenceDiagram
    participant 用户
    participant 系统
    用户->>系统: 请求数据
    系统->>数据库: 查询数据
    数据库-->>系统: 返回结果
    系统-->>用户: 显示数据
```

## 技术栈

- HTML5
- CSS3
- JavaScript (ES6+)
- Mermaid.js - 图表渲染
- html2canvas - 图像导出
- jsPDF - PDF导出
- FileSaver.js - 文件保存

## 本地部署

只需将所有文件放在同一目录下，然后在浏览器中打开index.html文件即可使用。

## 浏览器兼容性

支持所有现代浏览器：
- Chrome
- Firefox
- Edge
- Safari 