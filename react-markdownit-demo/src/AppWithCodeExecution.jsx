import React, { useState } from 'react';
import MarkdownEditor from './components/MarkdownEditor';
import MarkdownRenderer from './components/MarkdownRenderer';
import EnhancedMarkdownRenderer from './components/EnhancedMarkdownRenderer';
import CodeExecutor from './components/CodeExecutor';
import './App.css';

// 包含可执行代码的示例 Markdown 内容
const executableMarkdown = `# React + MarkdownIt 代码执行演示

这个演示展示了如何在 Markdown 中嵌入可执行的 HTML、CSS 和 JavaScript 代码。

## 🎨 HTML 演示

下面是一个简单的 HTML 示例：

\`\`\`html
<div class="greeting">
  <h2>Hello, World! 🌍</h2>
  <p>这是一个可执行的 HTML 代码块。</p>
  <button onclick="alert('Hello from HTML!')">点击我</button>
</div>

<style>
.greeting {
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 10px;
  text-align: center;
}

.greeting button {
  background: white;
  color: #667eea;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

.greeting button:hover {
  background: #f0f0f0;
}
</style>
\`\`\`

## 🎨 CSS 样式演示

这个 CSS 代码块会应用到默认的演示 HTML 上：

\`\`\`css
.css-demo {
  font-family: 'Arial', sans-serif;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border-radius: 15px;
  color: white;
  text-align: center;
}

.css-demo h3 {
  margin-top: 0;
  font-size: 24px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.css-demo p {
  font-size: 16px;
  line-height: 1.6;
}

.css-demo button {
  background: white;
  color: #ff6b6b;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.css-demo button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.3);
}

.css-demo .box {
  width: 100px;
  height: 100px;
  background: rgba(255,255,255,0.2);
  margin: 20px auto;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
\`\`\`

## 💻 JavaScript 交互演示

这个 JavaScript 代码块展示了交互功能：

\`\`\`javascript
// 获取元素
const btn = document.getElementById('demo-btn');
const output = document.getElementById('output');

// 计数器
let count = 0;

// 点击事件
btn.addEventListener('click', function() {
  count++;
  output.innerHTML = \`
    <div style="
      padding: 15px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 8px;
      margin-top: 10px;
      text-align: center;
    ">
      <h4>🎉 按钮被点击了 \${count} 次!</h4>
      <p>当前时间: \${new Date().toLocaleTimeString()}</p>
    </div>
  \`;
});

// 自动显示欢迎信息
setTimeout(() => {
  console.log('JavaScript 代码执行成功! 🚀');
  output.innerHTML = \`
    <div style="
      padding: 10px;
      background: #e8f5e8;
      color: #2d5a2d;
      border-radius: 5px;
      border-left: 4px solid #4caf50;
    ">
      ✅ JavaScript 已加载，点击按钮试试看！
    </div>
  \`;
}, 100);
\`\`\`

## 🎯 复杂交互演示

下面是一个更复杂的示例，包含动画和用户交互：

\`\`\`html
<div class="interactive-demo">
  <h3>🎮 互动游戏演示</h3>
  <div class="game-area">
    <div class="score">得分: <span id="score">0</span></div>
    <div class="target" id="target">🎯</div>
    <button id="start-game">开始游戏</button>
  </div>
</div>

<style>
.interactive-demo {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  background: #f0f8ff;
  border-radius: 15px;
  border: 2px solid #4169e1;
}

.game-area {
  position: relative;
  height: 300px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  overflow: hidden;
}

.score {
  position: absolute;
  top: 10px;
  left: 10px;
  color: white;
  font-weight: bold;
  font-size: 18px;
  z-index: 10;
}

.target {
  position: absolute;
  font-size: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
}

.target:hover {
  transform: scale(1.2);
}

#start-game {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

#start-game:hover {
  background: #ff5252;
  transform: translateX(-50%) translateY(-2px);
}
</style>

<script>
let gameScore = 0;
let gameActive = false;
let targetElement = document.getElementById('target');
let scoreElement = document.getElementById('score');
let startButton = document.getElementById('start-game');

function moveTarget() {
  if (!gameActive) return;
  
  const gameArea = document.querySelector('.game-area');
  const maxX = gameArea.clientWidth - 50;
  const maxY = gameArea.clientHeight - 50;
  
  const x = Math.random() * maxX;
  const y = Math.random() * maxY;
  
  targetElement.style.left = x + 'px';
  targetElement.style.top = y + 'px';
}

targetElement.addEventListener('click', function() {
  if (!gameActive) return;
  
  gameScore += 10;
  scoreElement.textContent = gameScore;
  
  // 添加点击效果
  this.style.transform = 'scale(1.5)';
  setTimeout(() => {
    this.style.transform = 'scale(1)';
  }, 150);
  
  moveTarget();
  
  console.log(\`目标被击中! 当前得分: \${gameScore}\`);
});

startButton.addEventListener('click', function() {
  if (gameActive) {
    // 停止游戏
    gameActive = false;
    this.textContent = '开始游戏';
    targetElement.style.display = 'none';
    console.log(\`游戏结束! 最终得分: \${gameScore}\`);
  } else {
    // 开始游戏
    gameActive = true;
    gameScore = 0;
    scoreElement.textContent = gameScore;
    this.textContent = '停止游戏';
    targetElement.style.display = 'block';
    moveTarget();
    
    // 自动移动目标
    const moveInterval = setInterval(() => {
      if (!gameActive) {
        clearInterval(moveInterval);
        return;
      }
      moveTarget();
    }, 2000);
    
    console.log('游戏开始! 点击移动的目标来得分!');
  }
});

// 初始化
targetElement.style.display = 'none';
</script>
\`\`\`

## 📊 数据可视化演示

使用 JavaScript 创建简单的图表：

\`\`\`javascript
// 创建一个简单的柱状图
const data = [
  { label: 'HTML', value: 85, color: '#e34c26' },
  { label: 'CSS', value: 78, color: '#1572b6' },
  { label: 'JavaScript', value: 92, color: '#f1e05a' },
  { label: 'React', value: 88, color: '#61dafb' }
];

const chartContainer = document.getElementById('output');
chartContainer.innerHTML = '<h4>📊 技能水平图表</h4>';

const chartDiv = document.createElement('div');
chartDiv.style.cssText = \`
  display: flex;
  align-items: end;
  height: 200px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
  margin-top: 10px;
  gap: 15px;
\`;

data.forEach(item => {
  const bar = document.createElement('div');
  bar.style.cssText = \`
    flex: 1;
    background: \${item.color};
    height: \${item.value}%;
    border-radius: 5px 5px 0 0;
    position: relative;
    transition: all 0.3s ease;
    cursor: pointer;
  \`;
  
  const label = document.createElement('div');
  label.textContent = item.label;
  label.style.cssText = \`
    position: absolute;
    bottom: -25px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 12px;
    font-weight: bold;
    color: #333;
  \`;
  
  const value = document.createElement('div');
  value.textContent = item.value + '%';
  value.style.cssText = \`
    position: absolute;
    top: -25px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 12px;
    font-weight: bold;
    color: #333;
    opacity: 0;
    transition: opacity 0.3s ease;
  \`;
  
  bar.appendChild(label);
  bar.appendChild(value);
  
  // 悬停效果
  bar.addEventListener('mouseenter', () => {
    bar.style.transform = 'scale(1.05)';
    value.style.opacity = '1';
  });
  
  bar.addEventListener('mouseleave', () => {
    bar.style.transform = 'scale(1)';
    value.style.opacity = '0';
  });
  
  chartDiv.appendChild(bar);
});

chartContainer.appendChild(chartDiv);

console.log('📊 图表渲染完成!');
\`\`\`

## 🎉 总结

这个演示展示了如何在 Markdown 中嵌入可执行的代码块，支持：

- ✅ **HTML 渲染** - 直接渲染 HTML 内容
- ✅ **CSS 样式** - 应用自定义样式
- ✅ **JavaScript 交互** - 添加动态交互功能
- ✅ **实时预览** - 代码修改后立即看到效果
- ✅ **控制台输出** - 查看 JavaScript 执行日志
- ✅ **错误处理** - 显示代码执行错误

这为创建交互式文档、教程和演示提供了强大的功能！`;

function AppWithCodeExecution() {
  const [activeDemo, setActiveDemo] = useState('executable');
  const [content, setContent] = useState(executableMarkdown);

  const demos = [
    { id: 'executable', name: '代码执行演示', icon: '🚀' },
    { id: 'editor', name: '实时编辑器', icon: '✏️' },
    { id: 'comparison', name: '功能对比', icon: '⚖️' },
    { id: 'examples', name: '使用示例', icon: '📚' }
  ];

  const handleContentChange = (newContent) => {
    setContent(newContent);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('代码已复制到剪贴板！');
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 全局复制代码函数
  window.copyCodeToClipboard = function(button) {
    const codeBlock = button.closest('.code-block-wrapper').querySelector('code');
    const code = codeBlock.textContent;
    copyToClipboard(code);
    
    // 临时改变按钮文字
    const originalHTML = button.innerHTML;
    button.innerHTML = '✓';
    button.style.color = '#28a745';
    
    setTimeout(() => {
      button.innerHTML = originalHTML;
      button.style.color = '';
    }, 2000);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <h1>React + MarkdownIt 代码执行演示</h1>
          <p>支持 HTML、CSS、JavaScript 代码的实时执行和渲染</p>
        </div>
      </header>

      <nav className="app-nav">
        <div className="container">
          <div className="nav-tabs">
            {demos.map(demo => (
              <button
                key={demo.id}
                className={`nav-tab ${activeDemo === demo.id ? 'active' : ''}`}
                onClick={() => setActiveDemo(demo.id)}
              >
                <span className="tab-icon">{demo.icon}</span>
                <span className="tab-name">{demo.name}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="app-main">
        <div className="container">
          {activeDemo === 'executable' && (
            <div className="demo-section">
              <div className="section-header">
                <h2>🚀 代码执行演示</h2>
                <p>在 Markdown 中嵌入可执行的 HTML、CSS、JavaScript 代码</p>
              </div>
              
              <EnhancedMarkdownRenderer 
                content={content}
                enableCodeExecution={true}
                className="executable-demo"
              />
            </div>
          )}

          {activeDemo === 'editor' && (
            <div className="demo-section">
              <div className="section-header">
                <h2>✏️ 实时编辑器</h2>
                <p>编辑 Markdown 内容，实时查看代码执行效果</p>
              </div>
              
              <MarkdownEditor
                initialContent={content}
                onContentChange={handleContentChange}
                height="600px"
                showPreview={true}
                showToolbar={true}
                placeholder="在这里输入包含可执行代码的 Markdown 内容..."
              />
              
              <div className="editor-output">
                <h3>渲染结果（支持代码执行）</h3>
                <EnhancedMarkdownRenderer 
                  content={content}
                  enableCodeExecution={true}
                  className="editor-preview"
                />
              </div>
            </div>
          )}

          {activeDemo === 'comparison' && (
            <div className="demo-section">
              <div className="section-header">
                <h2>⚖️ 功能对比</h2>
                <p>对比普通渲染器和增强渲染器的差异</p>
              </div>
              
              <div className="comparison-grid">
                <div className="comparison-item">
                  <h3>普通 Markdown 渲染器</h3>
                  <div className="renderer-wrapper">
                    <MarkdownRenderer 
                      content={`# 普通渲染器

\`\`\`javascript
console.log('这只是代码展示，不会执行');
alert('这段代码不会运行');
\`\`\`

\`\`\`html
<button onclick="alert('不会执行')">按钮</button>
\`\`\``}
                      className="normal-renderer"
                    />
                  </div>
                </div>

                <div className="comparison-item">
                  <h3>增强渲染器（支持代码执行）</h3>
                  <div className="renderer-wrapper">
                    <EnhancedMarkdownRenderer 
                      content={`# 增强渲染器

\`\`\`javascript
console.log('这段代码会执行！');
document.getElementById('output').innerHTML = '<p style="color: green;">✅ JavaScript 执行成功!</p>';
\`\`\`

\`\`\`html
<button onclick="alert('这个按钮可以点击!')">可执行按钮</button>
<div id="output"></div>
\`\`\``}
                      enableCodeExecution={true}
                      className="enhanced-renderer"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeDemo === 'examples' && (
            <div className="demo-section">
              <div className="section-header">
                <h2>📚 使用示例</h2>
                <p>学习如何在你的项目中使用代码执行功能</p>
              </div>
              
              <div className="examples-grid">
                <div className="example-card">
                  <h3>基础 HTML 执行</h3>
                  <pre><code>{`\`\`\`html
<div style="padding: 20px; background: #f0f8ff; border-radius: 8px;">
  <h3>Hello World!</h3>
  <button onclick="alert('Hello!')">点击我</button>
</div>
\`\`\``}</code></pre>
                  <button 
                    className="copy-btn"
                    onClick={() => copyToClipboard(`\`\`\`html
<div style="padding: 20px; background: #f0f8ff; border-radius: 8px;">
  <h3>Hello World!</h3>
  <button onclick="alert('Hello!')">点击我</button>
</div>
\`\`\``)}
                  >
                    复制代码
                  </button>
                </div>

                <div className="example-card">
                  <h3>CSS 样式演示</h3>
                  <pre><code>{`\`\`\`css
.demo-box {
  width: 200px;
  height: 100px;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
\`\`\``}</code></pre>
                  <button 
                    className="copy-btn"
                    onClick={() => copyToClipboard(`\`\`\`css
.demo-box {
  width: 200px;
  height: 100px;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
\`\`\``)}
                  >
                    复制代码
                  </button>
                </div>

                <div className="example-card">
                  <h3>JavaScript 交互</h3>
                  <pre><code>{`\`\`\`javascript
let count = 0;
const btn = document.getElementById('demo-btn');
const output = document.getElementById('output');

btn.addEventListener('click', () => {
  count++;
  output.innerHTML = \`点击了 \${count} 次\`;
  console.log('按钮被点击:', count);
});
\`\`\``}</code></pre>
                  <button 
                    className="copy-btn"
                    onClick={() => copyToClipboard(`\`\`\`javascript
let count = 0;
const btn = document.getElementById('demo-btn');
const output = document.getElementById('output');

btn.addEventListener('click', () => {
  count++;
  output.innerHTML = \`点击了 \${count} 次\`;
  console.log('按钮被点击:', count);
});
\`\`\``)}
                  >
                    复制代码
                  </button>
                </div>

                <div className="example-card">
                  <h3>组件使用</h3>
                  <pre><code>{`import EnhancedMarkdownRenderer from './EnhancedMarkdownRenderer';

function MyComponent() {
  const markdown = \`
# 我的演示

\\\`\\\`\\\`html
<button onclick="alert('Hello!')">点击我</button>
\\\`\\\`\\\`
  \`;
  
  return (
    <EnhancedMarkdownRenderer 
      content={markdown}
      enableCodeExecution={true}
    />
  );
}`}</code></pre>
                  <button 
                    className="copy-btn"
                    onClick={() => copyToClipboard(`import EnhancedMarkdownRenderer from './EnhancedMarkdownRenderer';

function MyComponent() {
  const markdown = \`
# 我的演示

\\\`\\\`\\\`html
<button onclick="alert('Hello!')">点击我</button>
\\\`\\\`\\\`
  \`;
  
  return (
    <EnhancedMarkdownRenderer 
      content={markdown}
      enableCodeExecution={true}
    />
  );
}`)}
                  >
                    复制代码
                  </button>
                </div>
              </div>

              <div className="feature-highlights">
                <h3>🌟 功能特性</h3>
                <div className="features-grid">
                  <div className="feature-item">
                    <div className="feature-icon">🎯</div>
                    <h4>实时执行</h4>
                    <p>代码块中的 HTML、CSS、JavaScript 会立即执行并显示结果</p>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">🛡️</div>
                    <h4>安全沙箱</h4>
                    <p>代码在 iframe 沙箱中执行，确保安全性</p>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">📱</div>
                    <h4>响应式</h4>
                    <p>支持移动端和桌面端，自适应不同屏幕尺寸</p>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">🎨</div>
                    <h4>自定义样式</h4>
                    <p>支持自定义 CSS 样式和主题</p>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">🔧</div>
                    <h4>控制台支持</h4>
                    <p>显示 JavaScript 控制台输出和错误信息</p>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">⚡</div>
                    <h4>高性能</h4>
                    <p>优化的渲染性能，支持大量代码块</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>
            基于 <a href="https://markdown-it.github.io/" target="_blank" rel="noopener noreferrer">MarkdownIt</a> 和 <a href="https://react.dev/" target="_blank" rel="noopener noreferrer">React</a> 构建
          </p>
          <p>
            支持 HTML、CSS、JavaScript 代码的实时执行和渲染
          </p>
        </div>
      </footer>
    </div>
  );
}

export default AppWithCodeExecution;