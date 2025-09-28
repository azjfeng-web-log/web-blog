const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const winston = require('winston');
require('dotenv').config();

// 配置日志
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'webhook-server' },
  transports: [
    new winston.transports.File({ filename: process.env.LOG_FILE || './logs/webhook.log' }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// 创建日志目录
const logDir = path.dirname(process.env.LOG_FILE || './logs/webhook.log');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const app = express();
const PORT = process.env.WEBHOOK_PORT || 3001;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

// 加载项目配置
let projectsConfig;
try {
  const configPath = process.env.PROJECTS_CONFIG_PATH || './projects.json';
  projectsConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  logger.info('项目配置加载成功', { projectCount: Object.keys(projectsConfig.projects).length });
} catch (error) {
  logger.error('无法加载项目配置文件', { error: error.message });
  process.exit(1);
}

// GitHub IP 白名单（可选）
const GITHUB_IPS = process.env.GITHUB_IPS ? process.env.GITHUB_IPS.split(',') : [];

// 中间件配置
app.use(bodyParser.json({ 
  limit: process.env.MAX_PAYLOAD_SIZE || '1mb',
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

// IP 白名单验证中间件
function verifyGitHubIP(req, res, next) {
  if (process.env.ENABLE_IP_WHITELIST === 'true' && GITHUB_IPS.length > 0) {
    const clientIP = req.ip || req.connection.remoteAddress;
    // 这里可以添加更复杂的 IP 验证逻辑
    logger.info('IP 验证', { clientIP });
  }
  next();
}

// GitHub 签名验证
function verifyGitHubSignature(req, res, next) {
  if (!WEBHOOK_SECRET) {
    logger.warn('未设置 WEBHOOK_SECRET，跳过签名验证');
    return next();
  }

  const signature = req.get('X-Hub-Signature-256');
  if (!signature) {
    logger.error('缺少 GitHub 签名');
    return res.status(401).json({ error: '缺少签名' });
  }

  const expectedSignature = 'sha256=' + crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(req.rawBody)
    .digest('hex');

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    logger.error('签名验证失败', { 
      received: signature,
      expected: expectedSignature.substring(0, 20) + '...'
    });
    return res.status(401).json({ error: '签名验证失败' });
  }

  logger.info('签名验证成功');
  next();
}

// 执行部署脚本
function executeDeployScript(projectKey, scriptPath, callback) {
  const project = projectsConfig.projects[projectKey];
  if (!project) {
    return callback(new Error(`项目 ${projectKey} 不存在`));
  }

  logger.info('开始执行部署脚本', { 
    project: projectKey, 
    script: scriptPath,
    path: project.path 
  });

  const fullScriptPath = path.resolve(__dirname, scriptPath);
  
  // 检查脚本文件是否存在
  if (!fs.existsSync(fullScriptPath)) {
    return callback(new Error(`部署脚本不存在: ${fullScriptPath}`));
  }

  // 执行脚本，传递项目信息作为环境变量
  const env = {
    ...process.env,
    PROJECT_NAME: projectKey,
    PROJECT_PATH: project.path,
    PROJECT_BRANCH: project.branch || 'main',
    PROJECT_SERVICES: project.services ? project.services.join(',') : ''
  };

  exec(`bash ${fullScriptPath}`, { 
    env,
    cwd: project.path,
    timeout: 300000 // 5分钟超时
  }, (error, stdout, stderr) => {
    if (error) {
      logger.error('部署脚本执行失败', { 
        project: projectKey,
        error: error.message,
        stdout,
        stderr 
      });
      return callback(error);
    }

    logger.info('部署脚本执行成功', { 
      project: projectKey,
      stdout: stdout.substring(0, 500) // 限制日志长度
    });
    
    callback(null, { stdout, stderr });
  });
}

// 发送通知（可扩展支持钉钉、邮件等）
function sendNotification(project, status, message) {
  if (!project.notifications || !project.notifications.enabled) {
    return;
  }

  logger.info('发送部署通知', { 
    project: project.name,
    status,
    message: message.substring(0, 200)
  });

  // 这里可以添加具体的通知实现
  // 例如：钉钉机器人、邮件、Slack 等
}

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    projects: Object.keys(projectsConfig.projects)
  });
});

// 主要的 webhook 处理端点
app.post('/webhook', verifyGitHubIP, verifyGitHubSignature, (req, res) => {
  const event = req.get('X-GitHub-Event');
  const payload = req.body;

  logger.info('收到 GitHub Webhook', { 
    event,
    repository: payload.repository?.full_name,
    ref: payload.ref,
    commits: payload.commits?.length || 0
  });

  // 只处理 push 事件
  if (event !== 'push') {
    logger.info('忽略非 push 事件', { event });
    return res.json({ message: '事件已忽略' });
  }

  // 查找匹配的项目
  const repositoryName = payload.repository?.full_name;
  const branch = payload.ref?.replace('refs/heads/', '');
  
  let matchedProject = null;
  let projectKey = null;

  for (const [key, project] of Object.entries(projectsConfig.projects)) {
    if (project.repository === repositoryName && 
        (!project.branch || project.branch === branch)) {
      matchedProject = project;
      projectKey = key;
      break;
    }
  }

  if (!matchedProject) {
    logger.warn('未找到匹配的项目配置', { 
      repository: repositoryName,
      branch 
    });
    return res.status(404).json({ 
      error: '未找到匹配的项目配置',
      repository: repositoryName,
      branch
    });
  }

  // 立即响应 GitHub
  res.json({ 
    message: '部署请求已接收',
    project: matchedProject.name,
    repository: repositoryName,
    branch
  });

  // 异步执行部署
  const deployScript = matchedProject.scripts.deploy;
  if (!deployScript) {
    logger.error('项目未配置部署脚本', { project: projectKey });
    sendNotification(matchedProject, 'error', '项目未配置部署脚本');
    return;
  }

  executeDeployScript(projectKey, deployScript, (error, result) => {
    if (error) {
      sendNotification(matchedProject, 'failed', `部署失败: ${error.message}`);
    } else {
      sendNotification(matchedProject, 'success', '部署成功完成');
    }
  });
});

// 手动触发部署端点（用于测试）
app.post('/deploy/:project', (req, res) => {
  const projectKey = req.params.project;
  const project = projectsConfig.projects[projectKey];

  if (!project) {
    return res.status(404).json({ error: '项目不存在' });
  }

  logger.info('手动触发部署', { project: projectKey });

  executeDeployScript(projectKey, project.scripts.deploy, (error, result) => {
    if (error) {
      return res.status(500).json({ 
        error: '部署失败',
        message: error.message 
      });
    }

    res.json({ 
      message: '部署成功',
      project: project.name,
      result: result.stdout
    });
  });
});

// 错误处理中间件
app.use((error, req, res, next) => {
  logger.error('服务器错误', { error: error.message, stack: error.stack });
  res.status(500).json({ error: '内部服务器错误' });
});

// 启动服务器
app.listen(PORT, () => {
  logger.info(`Webhook 服务器启动成功`, { 
    port: PORT,
    projects: Object.keys(projectsConfig.projects)
  });
});

// 优雅关闭
process.on('SIGTERM', () => {
  logger.info('收到 SIGTERM 信号，正在关闭服务器...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('收到 SIGINT 信号，正在关闭服务器...');
  process.exit(0);
});