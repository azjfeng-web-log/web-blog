#!/bin/bash

# GitHub Webhook 系统监控脚本
# 用于监控服务状态、资源使用情况和部署历史

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# 配置
WEBHOOK_PORT=${WEBHOOK_PORT:-3001}
LOG_FILE="logs/webhook.log"
MONITOR_INTERVAL=5

# 显示标题
show_header() {
    clear
    echo -e "${CYAN}========================================"
    echo -e "GitHub Webhook 系统监控面板"
    echo -e "========================================"
    echo -e "时间: $(date '+%Y-%m-%d %H:%M:%S')"
    echo -e "端口: $WEBHOOK_PORT"
    echo -e "========================================${NC}"
    echo
}

# 显示服务状态
show_service_status() {
    echo -e "${BLUE}[服务状态]${NC}"
    
    if pm2 list | grep -q "webhook-server.*online"; then
        echo -e "Webhook 服务: ${GREEN}运行中${NC}"
        
        # 获取 PM2 详细信息
        local pm2_info=$(pm2 jlist | jq -r '.[] | select(.name=="webhook-server") | "PID: \(.pid), 内存: \(.monit.memory/1024/1024 | floor)MB, CPU: \(.monit.cpu)%"' 2>/dev/null || echo "无法获取详细信息")
        echo "详情: $pm2_info"
    else
        echo -e "Webhook 服务: ${RED}未运行${NC}"
    fi
    
    # 检查端口占用
    if lsof -i :$WEBHOOK_PORT >/dev/null 2>&1; then
        echo -e "端口 $WEBHOOK_PORT: ${GREEN}已占用${NC}"
    else
        echo -e "端口 $WEBHOOK_PORT: ${RED}未占用${NC}"
    fi
    
    # 检查健康状态
    if curl -f http://localhost:$WEBHOOK_PORT/health >/dev/null 2>&1; then
        echo -e "健康检查: ${GREEN}通过${NC}"
    else
        echo -e "健康检查: ${RED}失败${NC}"
    fi
    
    echo
}

# 显示系统资源
show_system_resources() {
    echo -e "${BLUE}[系统资源]${NC}"
    
    # CPU 使用率
    local cpu_usage=$(top -l 1 | grep "CPU usage" | awk '{print $3}' | sed 's/%//' 2>/dev/null || echo "N/A")
    echo "CPU 使用率: ${cpu_usage}%"
    
    # 内存使用率
    local memory_info=$(vm_stat | grep -E "(free|active|inactive|wired)" | awk '{print $3}' | sed 's/\.//' 2>/dev/null || echo "")
    if [ -n "$memory_info" ]; then
        local total_pages=$(echo "$memory_info" | awk '{sum+=$1} END {print sum}')
        local free_pages=$(echo "$memory_info" | head -1)
        local memory_usage=$(echo "scale=1; (($total_pages - $free_pages) * 100) / $total_pages" | bc 2>/dev/null || echo "N/A")
        echo "内存使用率: ${memory_usage}%"
    else
        echo "内存使用率: N/A"
    fi
    
    # 磁盘使用率
    local disk_usage=$(df -h . | tail -1 | awk '{print $5}' | sed 's/%//')
    echo "磁盘使用率: ${disk_usage}%"
    
    echo
}

# 显示最近的日志
show_recent_logs() {
    echo -e "${BLUE}[最近日志 (最新 10 条)]${NC}"
    
    if [ -f "$LOG_FILE" ]; then
        tail -10 "$LOG_FILE" | while read -r line; do
            if echo "$line" | grep -q "ERROR"; then
                echo -e "${RED}$line${NC}"
            elif echo "$line" | grep -q "SUCCESS"; then
                echo -e "${GREEN}$line${NC}"
            elif echo "$line" | grep -q "WARNING"; then
                echo -e "${YELLOW}$line${NC}"
            else
                echo "$line"
            fi
        done
    else
        echo "日志文件不存在: $LOG_FILE"
    fi
    
    echo
}

# 显示部署统计
show_deployment_stats() {
    echo -e "${BLUE}[部署统计]${NC}"
    
    if [ -f "$LOG_FILE" ]; then
        local total_deployments=$(grep -c "开始执行部署脚本" "$LOG_FILE" 2>/dev/null || echo "0")
        local successful_deployments=$(grep -c "部署脚本执行成功" "$LOG_FILE" 2>/dev/null || echo "0")
        local failed_deployments=$(grep -c "部署脚本执行失败" "$LOG_FILE" 2>/dev/null || echo "0")
        
        echo "总部署次数: $total_deployments"
        echo -e "成功部署: ${GREEN}$successful_deployments${NC}"
        echo -e "失败部署: ${RED}$failed_deployments${NC}"
        
        # 成功率
        if [ "$total_deployments" -gt 0 ]; then
            local success_rate=$(echo "scale=1; ($successful_deployments * 100) / $total_deployments" | bc 2>/dev/null || echo "0")
            echo "成功率: ${success_rate}%"
        fi
        
        # 最近部署时间
        local last_deployment=$(grep "开始执行部署脚本" "$LOG_FILE" | tail -1 | awk '{print $1, $2}' 2>/dev/null || echo "无")
        echo "最近部署: $last_deployment"
    else
        echo "无法获取部署统计信息"
    fi
    
    echo
}

# 显示活跃项目
show_active_projects() {
    echo -e "${BLUE}[活跃项目]${NC}"
    
    if [ -f "projects.json" ]; then
        local projects=$(jq -r '.projects | keys[]' projects.json 2>/dev/null || echo "")
        if [ -n "$projects" ]; then
            echo "$projects" | while read -r project; do
                local repo=$(jq -r ".projects.\"$project\".repository" projects.json 2>/dev/null || echo "unknown")
                local branch=$(jq -r ".projects.\"$project\".branch" projects.json 2>/dev/null || echo "main")
                echo "- $project ($repo:$branch)"
            done
        else
            echo "无法解析项目配置"
        fi
    else
        echo "项目配置文件不存在"
    fi
    
    echo
}

# 实时监控模式
real_time_monitor() {
    while true; do
        show_header
        show_service_status
        show_system_resources
        show_recent_logs
        show_deployment_stats
        show_active_projects
        
        echo -e "${CYAN}按 Ctrl+C 退出实时监控${NC}"
        sleep $MONITOR_INTERVAL
    done
}

# 显示帮助信息
show_help() {
    echo "GitHub Webhook 系统监控脚本"
    echo
    echo "用法: $0 [选项]"
    echo
    echo "选项:"
    echo "  -h, --help        显示帮助信息"
    echo "  -r, --realtime    实时监控模式"
    echo "  -s, --status      显示服务状态"
    echo "  -l, --logs        显示最近日志"
    echo "  -d, --deploy      显示部署统计"
    echo "  -p, --projects    显示项目列表"
    echo "  --port PORT       指定端口 (默认: 3001)"
    echo
    echo "示例:"
    echo "  $0                # 显示完整监控信息"
    echo "  $0 -r             # 实时监控模式"
    echo "  $0 -s             # 只显示服务状态"
    echo "  $0 --port 3002    # 使用端口 3002"
}

# 主函数
main() {
    show_header
    show_service_status
    show_system_resources
    show_recent_logs
    show_deployment_stats
    show_active_projects
}

# 解析命令行参数
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -r|--realtime)
            real_time_monitor
            exit 0
            ;;
        -s|--status)
            show_header
            show_service_status
            exit 0
            ;;
        -l|--logs)
            show_header
            show_recent_logs
            exit 0
            ;;
        -d|--deploy)
            show_header
            show_deployment_stats
            exit 0
            ;;
        -p|--projects)
            show_header
            show_active_projects
            exit 0
            ;;
        --port)
            WEBHOOK_PORT="$2"
            shift 2
            ;;
        *)
            echo "未知选项: $1"
            show_help
            exit 1
            ;;
    esac
done

# 运行主函数
main