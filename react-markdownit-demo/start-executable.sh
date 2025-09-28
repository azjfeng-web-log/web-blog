#!/bin/bash

# React + MarkdownIt 代码执行功能启动脚本

set -e

echo "🚀 启动 React + MarkdownIt 代码执行演示"
echo "=================================="

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到 Node.js，请先安装 Node.js"
    exit 1
fi

# 检查 npm 是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: 未找到 npm，请先安装 npm"
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"
echo "✅ npm 版本: $(npm --version)"
echo ""

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 请在 react-markdownit-demo 目录中运行此脚本"
    exit 1
fi

# 安装依赖
echo "📦 安装项目依赖..."
npm install

# 备份原始入口文件
if [ -f "src/index.js" ] && [ ! -f "src/index.js.backup" ]; then
    echo "💾 备份原始入口文件..."
    cp src/index.js src/index.js.backup
fi

# 使用代码执行版本的入口文件
echo "🔄 切换到代码执行版本..."
cp src/index-executable.js src/index.js

# 更新 package.json 添加启动脚本
echo "⚙️  配置启动脚本..."
if ! grep -q "start:executable" package.json; then
    # 使用 sed 添加新的脚本
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' 's/"start": "react-scripts start",/"start": "react-scripts start",\
    "start:executable": "REACT_APP_MODE=executable react-scripts start",/' package.json
    else
        # Linux
        sed -i 's/"start": "react-scripts start",/"start": "react-scripts start",\n    "start:executable": "REACT_APP_MODE=executable react-scripts start",/' package.json
    fi
fi

echo ""
echo "🎉 配置完成！"
echo ""
echo "📋 可用的启动命令:"
echo "  npm start              - 启动代码执行演示"
echo "  npm run start:original - 启动原始演示（需要先恢复）"
echo ""
echo "🌐 启动开发服务器..."
echo "   服务器将在 http://localhost:3000 启动"
echo "   选择 '代码执行演示' 标签页查看功能"
echo ""

# 启动开发服务器
npm start