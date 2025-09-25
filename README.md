# 🎨 GenerateIcon Web

一个现代化的Web图标生成器，支持多种图标类型和自定义尺寸，使用纯前端技术构建。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)

## ✨ 功能特点

- 🎯 **多种图标类型**: 计算器、鼠标、键盘、显示器、定位等
- 📏 **多尺寸支持**: 24px、32px、64px、128px、1024px及自定义尺寸
- 🎨 **高质量输出**: 使用Canvas API生成高质量PNG图标
- 📱 **响应式设计**: 完美支持桌面和移动端
- ⚡ **即开即用**: 无需安装，直接在浏览器中运行
- 🎭 **优雅交互**: 弹窗式尺寸选择，流畅的动画效果

## 🚀 快速开始

### 方法一：直接使用（推荐）

1. 克隆项目
```bash
git clone https://github.com/Garenge/GenerateIcon-web.git
cd GenerateIcon-web
```

2. 用浏览器打开 `index.html` 即可使用

### 方法二：本地服务器

```bash
# 使用Python（推荐）
python -m http.server 8000

# 或使用Node.js
npx http-server

# 或使用PHP
php -S localhost:8000
```

然后访问 `http://localhost:8000`

## 🛠️ 开发环境

### Node.js 的作用

本项目是**纯前端项目**，Node.js仅用于开发工具：

- **ESLint**: 代码质量检查和格式化
- **开发依赖管理**: 通过package.json管理开发工具
- **代码规范**: 确保代码风格一致性

### 安装开发依赖

```bash
npm install
```

### 开发命令

```bash
# 代码检查
npm run lint

# 自动修复代码问题
npm run lint:fix
```

## 📁 项目结构

```
GenerateIcon-web/
├── index.html              # 主页面
├── styles.css              # 样式文件
├── js/                     # JavaScript模块
│   ├── utils.js            # 通用工具函数
│   ├── main.js             # 主应用程序逻辑
│   ├── calculator-icon.js  # 计算器图标生成器
│   ├── mouse-icon.js       # 鼠标图标生成器
│   ├── keyboard-icon.js    # 键盘图标生成器
│   ├── monitor-icon.js     # 显示器图标生成器
│   └── location-icon.js    # 定位图标生成器
├── package.json            # 项目配置（开发工具）
├── .eslintrc.js           # ESLint配置
└── README.md              # 项目说明
```

## 🎯 支持的图标类型

| 图标 | 名称 | 描述 |
|------|------|------|
| 🧮 | 计算器 | 完整的计算器界面，带屏幕和按钮 |
| 🖱️ | 鼠标 | 现代鼠标设计，带滚轮和线缆 |
| ⌨️ | 键盘 | QWERTY键盘布局，错位排列 |
| 🖥️ | 显示器 | 带支架的显示器，显示"Hello World" |
| 📍 | 定位 | 定位应用图标，带信号波纹和坐标网格 |

## 📏 支持的尺寸

- **24px**: 工具栏图标
- **32px**: 任务栏图标
- **64px**: 桌面图标
- **128px**: 应用商店图标
- **1024px**: 高质量图标
- **自定义**: 16px - 2048px 任意尺寸

## 🎨 使用方法

1. **选择图标类型**: 在左侧面板选择要生成的图标
2. **预览效果**: 在中间区域查看256x256预览
3. **选择尺寸**: 点击"生成并下载图标"按钮
4. **确认下载**: 在弹窗中选择尺寸并确认
5. **获取图标**: 自动下载PNG格式图标文件

## 🔧 技术栈

- **前端**: HTML5 + CSS3 + JavaScript (ES6+)
- **图形**: Canvas API
- **样式**: 纯CSS，无框架依赖
- **开发工具**: ESLint (Node.js环境)
- **版本控制**: Git

## 🌟 特色功能

### 弹窗式尺寸选择
- 优雅的渐变弹出动画
- 多种关闭方式（ESC键、点击外部、按钮）
- 实时尺寸显示和使用提示

### 模块化设计
- 每个图标类型独立文件
- 通用工具函数复用
- 易于扩展新图标类型

### 响应式布局
- 桌面端：三栏布局
- 移动端：垂直堆叠
- 自适应按钮和弹窗

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📝 开发规范

项目使用ESLint进行代码检查，主要规则：

- 使用4个空格缩进
- 单引号字符串
- 必须使用分号
- 函数命名使用驼峰式

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- Canvas API 提供强大的图形绘制能力
- ESLint 确保代码质量
- GitHub 提供代码托管服务

## 📞 联系方式

- 项目链接: [https://github.com/Garenge/GenerateIcon-web](https://github.com/Garenge/GenerateIcon-web)
- 问题反馈: [Issues](https://github.com/Garenge/GenerateIcon-web/issues)

---

⭐ 如果这个项目对你有帮助，请给它一个星标！
