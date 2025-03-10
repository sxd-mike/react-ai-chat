# AI Chat 项目

这是一个基于 Next.js 和 OpenRouter API 构建的 AI 聊天应用。通过这个应用，你可以与 AI 进行实时对话交互。

## 功能特点

- 实时对话：支持与 AI 进行实时的对话交互
- 流式响应：AI 回复采用流式传输，实现打字机效果
- 响应式设计：适配不同屏幕尺寸的设备
- 简洁界面：现代化的 UI 设计，操作直观

## 环境要求

- Node.js 16.x 或更高版本
- npm 或 yarn 包管理器
- OpenRouter API Key（需要自行申请）

## 安装步骤

1. 项目放到本地：

2. 安装项目依赖：
   ```bash
   npm install
   # 或者使用 yarn
   yarn install
   ```

## 启动项目

1. 启动开发服务器：
   ```bash
   npm run dev
   # 或者使用 yarn
   yarn dev
   ```

2. 打开浏览器访问：
   ```
   http://localhost:3000
   ```

## 使用说明

1. 首次使用时，系统会提示输入 OpenRouter API Key
2. 在输入框中输入你想问的问题
3. 点击发送按钮或按回车键发送消息
4. AI 将以打字机效果实时显示回复内容

## 注意事项

- 请确保在使用前已经获取了有效的 OpenRouter API Key
- API Key 仅在当前会话中有效，刷新页面后需要重新输入
- 建议使用现代浏览器（如 Chrome、Firefox、Edge 等）以获得最佳体验

## 技术栈

- Next.js
- React
- TypeScript
- Material-UI

## 开发相关

- 项目使用 TypeScript 开发，确保类型安全
- 使用 Material-UI 组件库构建界面
- 采用 Next.js 框架，支持服务端渲染
- 使用 OpenRouter API 进行 AI 对话

## 项目截图
https://github.com/sxd-mike/react-ai-chat/blob/main/public/ex.png