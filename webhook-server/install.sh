#!/bin/bash

# GitHub Webhook 自动部署系统安装脚本

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查系统要求
check_requirements() {
    log_info "检查系统要求..."
    
    # 检查 Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js 未安装，请先安装 Node.js (建议版本 >= 16)"
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 16 ]; then
        log_warning "Node.js 版本较低 (当前: $(node -v))，建议升级到 16+ 版本"
    fi
    
    # 检查 npm
    if ! command -v npm &> /dev/null; then
        log_error "npm 未安装"
        exit 1
    fi
    
    # 检查 PM2
    if ! command -v pm2 &> /dev/null; then
        log_warning "PM2 未安装，正在安装..."
        npm install -g pm2
    fi
    
    # 检查 Git
    if ! command -v git &> /dev/null; then
        log_error "Git 未安装，请先安装 Git"
        exit 1
    fi
    
    log_success "系统要求检查通过"
}

# 安装依赖
install_dependencies() {
    log_info "安装项目依赖..."
    
    if [ -f "package-lock.json" ]; then
        npm ci
    else
        npm install
    fi
    
    log_success "依赖安装完成"
}

# 创建配置文件
setup_config() {
    log_info "设置配置文件..."
    
    # 复制环境变量文件
    if [ ! -f ".env" ]; then
        cp .env.example .env
        log_info "已创建 .env 文件，请编辑其中的配置"
    fi
    
    # 创建日志目录
    mkdir -p logs
    
    # 设置脚本权限
    chmod +x scripts/*.sh
    
    log_success "配置文件设置完成"
}

# 配置向导
config_wizard() {
    log_info "开始配置向导..."
    
    # 获取 Webhook Secret
    echo -n "请输入 GitHub Webhook Secret (留空跳过): "
    read -r webhook_secret
    
    if [ -n "$webhook_secret" ]; then
        sed -i.bak "s/your_github_webhook_secret_here/$webhook_secret/" .env
        log_success "Webhook Secret 已设置"
    fi
    
    # 获取端口
    echo -n "请输入 Webhook 服务端口 (默认 3001): "
    read -r webhook_port
    webhook_port=${webhook_port:-3001}
    
    sed -i.bak "s/WEBHOOK_PORT=3001/WEBHOOK_PORT=$webhook_port/" .env
    log_success "端口已设置为 $webhook_port"
    
    # 项目配置提示
    log_info "请编辑 projects.json 文件配置你的项目信息"
    log_info "配置完成后运行: npm run pm2:start"
}

# 测试安装
test_installation() {
    log_info "测试安装..."
    
    # 启动服务进行测试
    timeout 10s npm start &
    SERVER_PID=$!
    
    sleep 3
    
    # 测试健康检查
    if curl -f http://localhost:${webhook_port:-3001}/health >/dev/null 2>&1; then
        log_success "服务测试通过"
    else
        log_warning "服务测试失败，请检查配置"
    fi
    
    # 停止测试服务
    kill $SERVER_PID 2>/dev/null || true
}

# 主安装流程
main() {
    log_info "开始安装 GitHub Webhook 自动部署系统..."
    
    check_requirements
    install_dependencies
    setup_config
    
    echo
    log_success "安装完成！"
    echo
    log_info "下一步操作："
    log_info "1. 编辑 .env 文件设置 Webhook Secret"
    log_info "2. 编辑 projects.json 配置项目信息"
    log_info "3. 运行 npm run pm2:start 启动服务"
    log_info "4. 在 GitHub 仓库中配置 Webhook"
    echo
    
    # 询问是否运行配置向导
    echo -n "是否运行配置向导? (y/N): "
    read -r run_wizard
    
    if [[ "$run_wizard" =~ ^[Yy]$ ]]; then
        config_wizard
    fi
    
    echo
    log_info "安装完成！查看 README.md 获取详细使用说明"
}

# 运行主函数
main "$@"