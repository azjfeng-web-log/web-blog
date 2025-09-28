# GitHub Webhook 自动部署系统

这是一个基于 Node.js 的 GitHub Webhook 自动部署系统，可以在代码推送到 GitHub 时自动触发部署流程。

## 功能特性

- ✅ 安全的 GitHub Webhook 签名验证
- ✅ 多项目支持
- ✅ 自动代码拉取和构建
- ✅ PM2 服务管理
- ✅ 部署日志记录
- ✅ 回滚功能
- ✅ 健康检查
- ✅ 手动部署触发

## 系统架构

```
GitHub Repository → Webhook → Node.js Server → Bash Script → 项目部署
```

## 快速开始

### 1. 安装依赖

```bash
cd webhook-server
npm install
```

### 2. 配置环境变量

复制环境变量模板：
```bash
cp .env.example .env
```

编辑 `.env` 文件：
```bash
# GitHub Webhook 配置
WEBHOOK_SECRET=your_github_webhook_secret_here
WEBHOOK_PORT=3001

# 项目配置
PROJECTS_CONFIG_PATH=./projects.json

# 日志配置
LOG_LEVEL=info
LOG_FILE=./logs/webhook.log
```

### 3. 配置项目信息

编辑 `projects.json` 文件，配置你的项目信息：

```json
{
  "projects": {
    "web-blog": {
      "name": "Web Blog Project",
      "repository": "your-username/web-blog",
      "branch": "main",
      "path": "/Users/jameifeng/codeProject/personerCode/web-blog",
      "scripts": {
        "deploy": "./scripts/deploy-blog.sh",
        "rollback": "./scripts/rollback-blog.sh"
      },
      "services": ["blog-server", "blog-client"]
    }
  }
}
```

### 4. 设置脚本权限

```bash
chmod +x scripts/*.sh
```

### 5. 启动服务

#### 开发模式
```bash
npm run dev
```

#### 生产模式（使用 PM2）
```bash
npm run pm2:start
```

## GitHub Webhook 配置

1. 进入你的 GitHub 仓库设置页面
2. 点击 "Webhooks" → "Add webhook"
3. 配置以下信息：
   - **Payload URL**: `http://your-server-ip:3001/webhook`
   - **Content type**: `application/json`
   - **Secret**: 与 `.env` 文件中的 `WEBHOOK_SECRET` 相同
   - **Events**: 选择 "Just the push event"

## API 接口

### 健康检查
```bash
GET /health
```

### Webhook 接收
```bash
POST /webhook
```

### 手动部署
```bash
POST /deploy/:project
```

示例：
```bash
curl -X POST http://localhost:3001/deploy/web-blog
```

## 部署脚本说明

### deploy-blog.sh
主要功能：
- 拉取最新代码
- 安装/更新依赖
- 构建项目
- 重启服务
- 健康检查
- 备份管理

### rollback-blog.sh
回滚功能：
- 回滚到上一个版本
- 重新构建和部署
- 服务重启

## PM2 管理命令

```bash
# 启动服务
npm run pm2:start

# 停止服务
npm run pm2:stop

# 重启服务
npm run pm2:restart

# 查看日志
npm run pm2:logs

# 查看状态
pm2 status
```

## 日志管理

日志文件位置：
- 应用日志：`./logs/webhook.log`
- PM2 日志：`./logs/out.log`, `./logs/err.log`

查看实时日志：
```bash
tail -f logs/webhook.log
```

## 安全配置

### 1. 签名验证
确保设置了 `WEBHOOK_SECRET` 并与 GitHub Webhook 配置一致。

### 2. IP 白名单（可选）
```bash
ENABLE_IP_WHITELIST=true
GITHUB_IPS=140.82.112.0/20,185.199.108.0/22,192.30.252.0/22
```

### 3. 防火墙配置
```bash
# 开放 webhook 端口
sudo ufw allow 3001

# 限制访问来源（推荐）
sudo ufw allow from github-ip-range to any port 3001
```

## 故障排除

### 1. 502 错误
- 检查服务是否正常运行：`pm2 status`
- 查看服务日志：`pm2 logs webhook-server`
- 检查端口是否被占用：`lsof -i :3001`

### 2. 部署失败
- 查看部署日志：`tail -f logs/webhook.log`
- 检查项目路径是否正确
- 确认 Git 仓库状态
- 验证依赖安装

### 3. 权限问题
- 确保脚本有执行权限：`chmod +x scripts/*.sh`
- 检查项目目录访问权限
- 确认 PM2 进程权限

## 扩展功能

### 添加新项目
1. 在 `projects.json` 中添加项目配置
2. 创建对应的部署脚本
3. 重启 webhook 服务

### 通知集成
可以在部署脚本中添加：
- 钉钉机器人通知
- 邮件通知
- Slack 通知

### 多环境支持
通过分支配置支持不同环境：
```json
{
  "web-blog-dev": {
    "repository": "your-username/web-blog",
    "branch": "develop",
    "path": "/path/to/dev/project"
  },
  "web-blog-prod": {
    "repository": "your-username/web-blog", 
    "branch": "main",
    "path": "/path/to/prod/project"
  }
}
```

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License