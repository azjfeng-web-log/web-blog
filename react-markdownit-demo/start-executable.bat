@echo off
REM React + MarkdownIt 代码执行功能启动脚本 (Windows)

echo 🚀 启动 React + MarkdownIt 代码执行演示
echo ==================================

REM 检查 Node.js 是否安装
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未找到 Node.js，请先安装 Node.js
    pause
    exit /b 1
)

REM 检查 npm 是否安装
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未找到 npm，请先安装 npm
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i

echo ✅ Node.js 版本: %NODE_VERSION%
echo ✅ npm 版本: %NPM_VERSION%
echo.

REM 检查是否在正确的目录
if not exist "package.json" (
    echo ❌ 错误: 请在 react-markdownit-demo 目录中运行此脚本
    pause
    exit /b 1
)

REM 安装依赖
echo 📦 安装项目依赖...
npm install

REM 备份原始入口文件
if exist "src\index.js" (
    if not exist "src\index.js.backup" (
        echo 💾 备份原始入口文件...
        copy "src\index.js" "src\index.js.backup" >nul
    )
)

REM 使用代码执行版本的入口文件
echo 🔄 切换到代码执行版本...
copy "src\index-executable.js" "src\index.js" >nul

echo.
echo 🎉 配置完成！
echo.
echo 📋 可用的启动命令:
echo   npm start              - 启动代码执行演示
echo   npm run start:original - 启动原始演示（需要先恢复）
echo.
echo 🌐 启动开发服务器...
echo    服务器将在 http://localhost:3000 启动
echo    选择 '代码执行演示' 标签页查看功能
echo.

REM 启动开发服务器
npm start