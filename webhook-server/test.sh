#!/bin/bash

# GitHub Webhook 系统测试脚本

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[TEST]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

log_error() {
    echo -e "${RED}[FAIL]${NC} $1"
}

# 配置
WEBHOOK_PORT=${WEBHOOK_PORT:-3001}
BASE_URL="http://localhost:$WEBHOOK_PORT"

# 测试计数器
TESTS_TOTAL=0
TESTS_PASSED=0

# 测试函数
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    TESTS_TOTAL=$((TESTS_TOTAL + 1))
    log_info "测试: $test_name"
    
    if eval "$test_command"; then
        log_success "$test_name"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        log_error "$test_name"
    fi
    echo
}

# 检查服务是否运行
check_service_running() {
    if pm2 list | grep -q "webhook-server.*online"; then
        return 0
    else
        return 1
    fi
}

# 测试健康检查端点
test_health_endpoint() {
    local response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/health")
    [ "$response" = "200" ]
}

# 测试健康检查响应内容
test_health_response() {
    local response=$(curl -s "$BASE_URL/health")
    echo "$response" | grep -q "status.*ok"
}

# 测试手动部署端点 (应该返回 404，因为项目不存在)
test_manual_deploy_nonexistent() {
    local response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/deploy/nonexistent-project")
    [ "$response" = "404" ]
}

# 测试 Webhook 端点 (没有签名应该返回 401)
test_webhook_no_signature() {
    local response=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
        -H "Content-Type: application/json" \
        -d '{"test": "data"}' \
        "$BASE_URL/webhook")
    [ "$response" = "401" ]
}

# 测试无效的 HTTP 方法
test_invalid_method() {
    local response=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/webhook")
    [ "$response" = "404" ] || [ "$response" = "405" ]
}

# 测试日志文件是否存在
test_log_files() {
    [ -f "logs/webhook.log" ] || [ -f "logs/out.log" ]
}

# 测试配置文件
test_config_files() {
    [ -f ".env" ] && [ -f "projects.json" ]
}

# 测试脚本权限
test_script_permissions() {
    [ -x "scripts/deploy-blog.sh" ] && [ -x "scripts/rollback-blog.sh" ]
}

# 主测试流程
main() {
    echo "========================================"
    echo "GitHub Webhook 系统测试"
    echo "========================================"
    echo
    
    # 基础检查
    log_info "开始基础检查..."
    
    run_test "PM2 服务运行状态" "check_service_running"
    run_test "配置文件存在" "test_config_files"
    run_test "脚本执行权限" "test_script_permissions"
    run_test "日志文件存在" "test_log_files"
    
    # API 端点测试
    log_info "开始 API 端点测试..."
    
    run_test "健康检查端点" "test_health_endpoint"
    run_test "健康检查响应内容" "test_health_response"
    run_test "手动部署不存在项目" "test_manual_deploy_nonexistent"
    run_test "Webhook 无签名验证" "test_webhook_no_signature"
    run_test "无效 HTTP 方法" "test_invalid_method"
    
    # 测试结果
    echo "========================================"
    echo "测试结果"
    echo "========================================"
    echo "总测试数: $TESTS_TOTAL"
    echo "通过测试: $TESTS_PASSED"
    echo "失败测试: $((TESTS_TOTAL - TESTS_PASSED))"
    
    if [ $TESTS_PASSED -eq $TESTS_TOTAL ]; then
        log_success "所有测试通过！"
        exit 0
    else
        log_error "部分测试失败，请检查系统配置"
        exit 1
    fi
}

# 显示帮助信息
show_help() {
    echo "GitHub Webhook 系统测试脚本"
    echo
    echo "用法: $0 [选项]"
    echo
    echo "选项:"
    echo "  -h, --help     显示帮助信息"
    echo "  -p, --port     指定测试端口 (默认: 3001)"
    echo
    echo "示例:"
    echo "  $0                # 使用默认端口测试"
    echo "  $0 -p 3002       # 使用端口 3002 测试"
}

# 解析命令行参数
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -p|--port)
            WEBHOOK_PORT="$2"
            BASE_URL="http://localhost:$WEBHOOK_PORT"
            shift 2
            ;;
        *)
            echo "未知选项: $1"
            show_help
            exit 1
            ;;
    esac
done

# 运行测试
main