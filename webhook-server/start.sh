#!/bin/bash

# GitHub Webhook 系统快速启动脚本

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
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

# 显示横幅
show_banner() {
    echo -e "${CYAN}"
    echo "========================================"
    echo "  GitHub Webhook 自动部署系统"
    echo "========================================"
    echo -e "${NC}"
}

# 检查环境
check_environment() {
    log_info "检查运行环境..."
    
    # 检查配置文件
    if [ ! -f ".env" ]; then
        log_error ".env 文件不存在，请先运行 ./install.sh"
        exit 1
    fi
    
    if [ ! -f "projects.json" ]; then
        log_error "projects.json 文件不存在"
        exit 1
    fi
    
    # 检查依赖
    if [ ! -d "node_modules" ]; then
        log_warning "依赖未安装，正在安装..."
        npm install
    fi
    
    # 创建日志目录
    mkdir -p logs
    
    log_success "环境检查完成"
}

# 启动服务
start_service() {
    log_info "启动 Webhook 服务..."
    
    # 检查是否已经运行
    if pm2 list | grep -q "webhook-server.*online"; then
        log_warning "服务已在运行，正在重启..."
        pm2 restart webhook-server
    else
        # 启动新服务
        pm2 start ecosystem.config.js
    fi
    
    # 等待服务启动
    sleep 3
    
    # 验证服务状态
    if pm2 list | grep -q "webhook-server.*online"; then
        log_success "服务启动成功"
        
        # 获取端口信息
        local port=$(grep WEBHOOK_PORT .env | cut -d'=' -f2 || echo "3001")
        log_info "服务运行在端口: $port"
        log_info "健康检查: http://localhost:$port/health"
        
        # 测试健康检查
        if curl -f http://localhost:$port/health >/dev/null 2>&1; then
            log_success "健康检查通过"
        else
            log_warning "健康检查失败，请检查服务状态"
        fi
    else
        log_error "服务启动失败"
        pm2 logs webhook-server --lines 10
        exit 1
    fi
}

# 显示状态信息
show_status() {
    echo
    log_info "服务状态信息:"
    pm2 list | grep webhook-server || log_warning "未找到 webhook-server 进程"
    
    echo
    log_info "可用命令:"
    echo "  pm2 logs webhook-server    # 查看日志"
    echo "  pm2 restart webhook-server # 重启服务"
    echo "  pm2 stop webhook-server    # 停止服务"
    echo "  ./monitor.sh               # 监控面板"
    echo "  ./test.sh                  # 运行测试"
}

# 显示配置提示
show_config_tips() {
    echo
    log_info "配置提示:"
    
    # 检查 Webhook Secret
    if grep -q "your_github_webhook_secret_here" .env; then
        log_warning "请设置 GitHub Webhook Secret (.env 文件)"
    fi
    
    # 检查项目配置
    if grep -q "your-username" projects.json; then
        log_warning "请更新项目配置 (projects.json 文件)"
    fi
    
    echo
    log_info "GitHub Webhook 配置:"
    local port=$(grep WEBHOOK_PORT .env | cut -d'=' -f2 || echo "3001")
    echo "  Payload URL: http://your-server-ip:$port/webhook"
    echo "  Content type: application/json"
    echo "  Secret: (与 .env 文件中的 WEBHOOK_SECRET 相同)"
    echo "  Events: Just the push event"
}

# 主函数
main() {
    show_banner
    check_environment
    start_service
    show_status
    show_config_tips
    
    echo
    log_success "Webhook 服务已启动完成！"
    log_info "使用 './monitor.sh -r' 进入实时监控模式"
}

# 显示帮助
show_help() {
    echo "GitHub Webhook 系统启动脚本"
    echo
    echo "用法: $0 [选项]"
    echo
    echo "选项:"
    echo "  -h, --help     显示帮助信息"
    echo "  -q, --quiet    静默模式"
    echo "  -f, --force    强制重启服务"
    echo
    echo "示例:"
    echo "  $0             # 正常启动"
    echo "  $0 -f          # 强制重启"
}

# 解析命令行参数
QUIET_MODE=false
FORCE_RESTART=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -q|--quiet)
            QUIET_MODE=true
            shift
            ;;
        -f|--force)
            FORCE_RESTART=true
            shift
            ;;
        *)
            echo "未知选项: $1"
            show_help
            exit 1
            ;;
    esac
done

# 强制重启模式
if [ "$FORCE_RESTART" = true ]; then
    log_info "强制重启模式"
    pm2 delete webhook-server 2>/dev/null || true
fi

# 静默模式
if [ "$QUIET_MODE" = true ]; then
    exec > /dev/null 2>&1
fi

# 运行主函数
main