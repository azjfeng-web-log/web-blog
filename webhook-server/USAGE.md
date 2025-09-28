# GitHub Webhook 自动部署系统使用指南

## 🚀 快速开始

### 1. 一键安装
```bash
cd webhook-server
./install.sh
```

### 2. 快速启动
```bash
./start.sh
```

### 3. 配置 GitHub Webhook
在你的 GitHub 仓库中配置 Webhook：
- URL: `http://your-server:3001/webhook`
- Content type: `application/json`
- Secret: 与 `.env` 文件中的密钥相同
- Events: Push events

## 📋 详细配置

### 环境变量配置 (.env)
```bash
# 必需配置
WEBHOOK_SECRET=your_secure_secret_here
WEBHOOK_PORT=3001

# 可选配置
LOG_LEVEL=info
ENABLE_IP_WHITELIST=false
MAX_PAYLOAD_SIZE=1mb
```

### 项目配置 (projects.json)
```json
{
  "projects": {
    "your-project": {
      "name": "Your Project Name",
      "repository": "username/repository",
      "branch": "main",
      "path": "/path/to/your/project",
      "scripts": {
        "deploy": "./scripts/deploy-your-project.sh"
      },
      "services": ["service1", "service2"]
    }
  }
}
```

## 🛠️ 管理命令

### 服务管理
```bash
# 启动服务
./start.sh

# 停止服务
pm2 stop webhook-server

# 重启服务
pm2 restart webhook-server

# 查看状态
pm2 status

# 查看日志
pm2 logs webhook-server
```

### 监控和测试
```bash
# 系统监控
./monitor.sh              # 显示完整状态
./monitor.sh -r            # 实时监控模式
./monitor.sh -s            # 只显示服务状态

# 运行测试
./test.sh                  # 完整测试
./test.sh -p 3002          # 指定端口测试
```

## 🔧 部署脚本开发

### 创建新的部署脚本
1. 在 `scripts/` 目录下创建脚本文件
2. 使用环境变量获取项目信息：
   ```bash
   PROJECT_NAME=${PROJECT_NAME}
   PROJECT_PATH=${PROJECT_PATH}
   PROJECT_BRANCH=${PROJECT_BRANCH}
   PROJECT_SERVICES=${PROJECT_SERVICES}
   ```

### 脚本模板
```bash
#!/bin/bash
set -e

# 日志函数
log_info() { echo "[INFO] $1"; }
log_success() { echo "[SUCCESS] $1"; }
log_error() { echo "[ERROR] $1"; }

# 进入项目目录
cd "$PROJECT_PATH"

# 拉取代码
git pull origin "$PROJECT_BRANCH"

# 安装依赖
npm install

# 构建项目
npm run build

# 重启服务
pm2 restart your-service

log_success "部署完成"
```

## 🌐 Nginx 配置

### 基础配置
```nginx
upstream webhook_backend {
    server 127.0.0.1:3001;
}

server {
    listen 80;
    server_name your-domain.com;

    location /webhook {
        proxy_pass http://webhook_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### HTTPS 配置
参考 `nginx.conf.example` 文件获取完整的 HTTPS 配置。

## 🔒 安全最佳实践

### 1. 签名验证
- 始终设置 `WEBHOOK_SECRET`
- 使用强密码（至少 32 字符）
- 定期更换密钥

### 2. 网络安全
```bash
# 防火墙配置
sudo ufw allow 3001/tcp

# IP 白名单（可选）
ENABLE_IP_WHITELIST=true
GITHUB_IPS=140.82.112.0/20,185.199.108.0/22
```

### 3. 文件权限
```bash
# 设置适当的文件权限
chmod 600 .env
chmod 755 scripts/*.sh
```

## 📊 监控和日志

### 日志文件位置
- 应用日志: `logs/webhook.log`
- PM2 输出: `logs/out.log`
- PM2 错误: `logs/err.log`

### 监控指标
- 服务运行状态
- 部署成功率
- 系统资源使用
- 错误日志分析

### 日志轮转配置
```bash
# 创建 logrotate 配置
sudo tee /etc/logrotate.d/webhook-server << EOF
/path/to/webhook-server/logs/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 644 user group
    postrotate
        pm2 reloadLogs
    endscript
}
EOF
```

## 🚨 故障排除

### 常见问题

#### 1. 502 Bad Gateway
```bash
# 检查服务状态
pm2 status

# 查看错误日志
pm2 logs webhook-server --err

# 检查端口占用
lsof -i :3001
```

#### 2. 部署失败
```bash
# 查看部署日志
tail -f logs/webhook.log

# 手动测试部署脚本
cd /path/to/project
bash /path/to/deploy-script.sh
```

#### 3. 权限错误
```bash
# 检查文件权限
ls -la scripts/
ls -la .env

# 修复权限
chmod +x scripts/*.sh
chmod 600 .env
```

### 调试模式
```bash
# 启用详细日志
LOG_LEVEL=debug

# 查看实时日志
tail -f logs/webhook.log | grep ERROR
```

## 🔄 备份和恢复

### 自动备份
部署脚本会自动创建备份：
- 备份位置: `project/.deploy-backups/`
- 保留数量: 最近 5 个版本

### 手动回滚
```bash
# 使用回滚脚本
./scripts/rollback-blog.sh

# 或手动回滚到指定提交
cd /path/to/project
git checkout <commit-hash>
npm run build
pm2 restart service-name
```

## 📈 性能优化

### 1. 并发处理
```javascript
// 在 ecosystem.config.js 中配置多实例
instances: 2,  // 或 'max' 使用所有 CPU 核心
```

### 2. 缓存优化
```bash
# 使用 npm ci 而不是 npm install
npm ci --production
```

### 3. 资源限制
```javascript
// PM2 配置
max_memory_restart: '1G',
kill_timeout: 5000,
```

## 🔗 集成扩展

### 钉钉通知
在部署脚本中添加：
```bash
send_dingtalk_notification() {
    curl -X POST "https://oapi.dingtalk.com/robot/send?access_token=YOUR_TOKEN" \
         -H "Content-Type: application/json" \
         -d "{\"msgtype\":\"text\",\"text\":{\"content\":\"部署完成: $PROJECT_NAME\"}}"
}
```

### 邮件通知
```bash
send_email_notification() {
    echo "部署完成: $PROJECT_NAME" | mail -s "部署通知" admin@example.com
}
```

### Slack 集成
```bash
send_slack_notification() {
    curl -X POST -H 'Content-type: application/json' \
         --data "{\"text\":\"部署完成: $PROJECT_NAME\"}" \
         YOUR_SLACK_WEBHOOK_URL
}
```

## 📚 API 文档

### 健康检查
```http
GET /health
```
响应：
```json
{
  "status": "ok",
  "timestamp": "2023-12-01T10:00:00.000Z",
  "uptime": 3600,
  "projects": ["web-blog", "api-server"]
}
```

### 手动部署
```http
POST /deploy/:project
```
响应：
```json
{
  "message": "部署成功",
  "project": "Web Blog Project",
  "result": "..."
}
```

### Webhook 接收
```http
POST /webhook
Headers:
  X-GitHub-Event: push
  X-Hub-Signature-256: sha256=...
  Content-Type: application/json
```

## 🎯 最佳实践

1. **测试优先**: 在生产环境部署前，先在测试环境验证
2. **渐进部署**: 使用蓝绿部署或滚动更新策略
3. **监控告警**: 设置关键指标的监控和告警
4. **文档维护**: 保持部署文档和脚本的更新
5. **安全审计**: 定期检查安全配置和访问日志

## 📞 支持

如果遇到问题：
1. 查看 `logs/webhook.log` 日志文件
2. 运行 `./test.sh` 进行系统测试
3. 使用 `./monitor.sh` 检查系统状态
4. 参考故障排除章节

---

更多详细信息请参考 `README.md` 文件。