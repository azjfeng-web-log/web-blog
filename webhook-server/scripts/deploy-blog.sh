#!/bin/bash

# Web Blog 项目自动部署脚本
# 此脚本由 webhook 服务器调用

set -e  # 遇到错误立即退出

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# 从环境变量获取配置
PROJECT_NAME=${PROJECT_NAME:-"web-blog"}
PROJECT_PATH=${PROJECT_PATH:-"/Users/jameifeng/codeProject/personerCode/web-blog"}
PROJECT_BRANCH=${PROJECT_BRANCH:-"main"}
PROJECT_SERVICES=${PROJECT_SERVICES:-"blog-server,blog-client"}

# 部署配置
BACKUP_DIR="$PROJECT_PATH/.deploy-backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_PATH="$BACKUP_DIR/backup_$TIMESTAMP"

log_info "开始部署 $PROJECT_NAME 项目"
log_info "项目路径: $PROJECT_PATH"
log_info "分支: $PROJECT_BRANCH"
log_info "服务列表: $PROJECT_SERVICES"

# 检查项目路径是否存在
if [ ! -d "$PROJECT_PATH" ]; then
    log_error "项目路径不存在: $PROJECT_PATH"
    exit 1
fi

# 进入项目目录
cd "$PROJECT_PATH"

# 创建备份目录
mkdir -p "$BACKUP_DIR"

# 备份当前版本（可选）
log_info "创建当前版本备份..."
if [ -d ".git" ]; then
    CURRENT_COMMIT=$(git rev-parse HEAD 2>/dev/null || echo "unknown")
    echo "$CURRENT_COMMIT" > "$BACKUP_PATH.commit"
    log_info "当前提交: $CURRENT_COMMIT"
fi

# 检查 Git 状态
log_info "检查 Git 仓库状态..."
if [ ! -d ".git" ]; then
    log_error "不是一个 Git 仓库"
    exit 1
fi

# 保存本地修改（如果有）
if ! git diff-index --quiet HEAD --; then
    log_warning "检测到本地修改，正在暂存..."
    git stash push -m "Auto-stash before deployment at $TIMESTAMP"
fi

# 拉取最新代码
log_info "拉取最新代码..."
git fetch origin
git checkout "$PROJECT_BRANCH"
git pull origin "$PROJECT_BRANCH"

NEW_COMMIT=$(git rev-parse HEAD)
log_success "代码更新完成，新提交: $NEW_COMMIT"

# 检查是否有实际更新
if [ "$CURRENT_COMMIT" = "$NEW_COMMIT" ]; then
    log_info "代码没有更新，跳过部署"
    exit 0
fi

# 部署后端服务 (blog-server)
if [[ "$PROJECT_SERVICES" == *"blog-server"* ]]; then
    log_info "部署后端服务 (blog-server)..."
    
    cd "$PROJECT_PATH/blog-server"
    
    # 安装/更新依赖
    if [ -f "package-lock.json" ]; then
        log_info "使用 npm 安装依赖..."
        npm ci --production
    elif [ -f "pnpm-lock.yaml" ]; then
        log_info "使用 pnpm 安装依赖..."
        pnpm install --frozen-lockfile --prod
    elif [ -f "yarn.lock" ]; then
        log_info "使用 yarn 安装依赖..."
        yarn install --frozen-lockfile --production
    else
        log_info "使用 npm 安装依赖..."
        npm install --production
    fi
    
    # 构建项目
    log_info "构建后端项目..."
    if [ -f "package-lock.json" ]; then
        npm run build
    elif [ -f "pnpm-lock.yaml" ]; then
        pnpm run build
    else
        npm run build
    fi
    
    # 检查构建结果
    if [ ! -d "dist" ]; then
        log_error "构建失败，dist 目录不存在"
        exit 1
    fi
    
    # 重启 PM2 服务
    log_info "重启后端服务..."
    if pm2 list | grep -q "blog-server"; then
        pm2 restart blog-server
        log_success "blog-server 服务重启成功"
    else
        log_warning "blog-server 服务未在 PM2 中运行，尝试启动..."
        if [ -f "ecosystem.config.js" ]; then
            pm2 start ecosystem.config.js --only blog-server
        else
            pm2 start dist/main.js --name blog-server
        fi
        log_success "blog-server 服务启动成功"
    fi
    
    # 等待服务启动
    sleep 3
    
    # 健康检查
    log_info "执行后端服务健康检查..."
    for i in {1..10}; do
        if curl -f http://localhost:3000/health >/dev/null 2>&1; then
            log_success "后端服务健康检查通过"
            break
        elif [ $i -eq 10 ]; then
            log_error "后端服务健康检查失败"
            # 可以选择回滚或继续
            pm2 logs blog-server --lines 20
        else
            log_info "等待服务启动... ($i/10)"
            sleep 2
        fi
    done
fi

# 部署前端服务 (blog-client)
if [[ "$PROJECT_SERVICES" == *"blog-client"* ]]; then
    log_info "部署前端服务 (blog-client)..."
    
    cd "$PROJECT_PATH/blog-client"
    
    # 安装/更新依赖
    if [ -f "package-lock.json" ]; then
        log_info "使用 npm 安装依赖..."
        npm ci
    elif [ -f "pnpm-lock.yaml" ]; then
        log_info "使用 pnpm 安装依赖..."
        pnpm install --frozen-lockfile
    elif [ -f "yarn.lock" ]; then
        log_info "使用 yarn 安装依赖..."
        yarn install --frozen-lockfile
    else
        log_info "使用 npm 安装依赖..."
        npm install
    fi
    
    # 构建前端项目
    log_info "构建前端项目..."
    if [ -f "package-lock.json" ]; then
        npm run build
    elif [ -f "pnpm-lock.yaml" ]; then
        pnpm run build
    else
        npm run build
    fi
    
    # 检查构建结果
    if [ ! -d "dist" ]; then
        log_error "前端构建失败，dist 目录不存在"
        exit 1
    fi
    
    log_success "前端构建完成"
    
    # 如果有 nginx 或其他 web 服务器，可以在这里重启
    # systemctl reload nginx
fi

# 清理旧备份（保留最近 5 个）
log_info "清理旧备份文件..."
cd "$BACKUP_DIR"
ls -t backup_*.commit 2>/dev/null | tail -n +6 | xargs -r rm -f
log_info "备份清理完成"

# 部署完成
cd "$PROJECT_PATH"
log_success "=========================================="
log_success "部署完成！"
log_success "项目: $PROJECT_NAME"
log_success "新版本: $NEW_COMMIT"
log_success "部署时间: $(date '+%Y-%m-%d %H:%M:%S')"
log_success "=========================================="

# 发送部署成功通知（可选）
# 这里可以添加钉钉、邮件等通知逻辑

exit 0