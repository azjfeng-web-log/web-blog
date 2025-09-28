#!/bin/bash

# Web Blog 项目回滚脚本
# 用于快速回滚到上一个版本

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

# 配置
PROJECT_NAME=${PROJECT_NAME:-"web-blog"}
PROJECT_PATH=${PROJECT_PATH:-"/Users/jameifeng/codeProject/personerCode/web-blog"}
PROJECT_SERVICES=${PROJECT_SERVICES:-"blog-server,blog-client"}
BACKUP_DIR="$PROJECT_PATH/.deploy-backups"

log_info "开始回滚 $PROJECT_NAME 项目"

# 检查项目路径
if [ ! -d "$PROJECT_PATH" ]; then
    log_error "项目路径不存在: $PROJECT_PATH"
    exit 1
fi

cd "$PROJECT_PATH"

# 检查备份目录
if [ ! -d "$BACKUP_DIR" ]; then
    log_error "备份目录不存在: $BACKUP_DIR"
    exit 1
fi

# 获取最新的备份
LATEST_BACKUP=$(ls -t "$BACKUP_DIR"/backup_*.commit 2>/dev/null | head -n 1)

if [ -z "$LATEST_BACKUP" ]; then
    log_error "没有找到备份文件"
    exit 1
fi

# 读取备份的提交 ID
BACKUP_COMMIT=$(cat "$LATEST_BACKUP")
log_info "找到备份提交: $BACKUP_COMMIT"

# 回滚到指定提交
log_info "回滚到提交: $BACKUP_COMMIT"
git checkout "$BACKUP_COMMIT"

# 重新部署服务
if [[ "$PROJECT_SERVICES" == *"blog-server"* ]]; then
    log_info "重新部署后端服务..."
    cd "$PROJECT_PATH/blog-server"
    
    npm run build
    pm2 restart blog-server
    
    log_success "后端服务回滚完成"
fi

if [[ "$PROJECT_SERVICES" == *"blog-client"* ]]; then
    log_info "重新部署前端服务..."
    cd "$PROJECT_PATH/blog-client"
    
    npm run build
    
    log_success "前端服务回滚完成"
fi

log_success "回滚完成！当前版本: $BACKUP_COMMIT"