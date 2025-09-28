import React, { useState } from 'react';
import MarkdownEditor from './components/MarkdownEditor';
import MarkdownRenderer from './components/MarkdownRenderer';
import EnhancedMarkdownRenderer from './components/EnhancedMarkdownRenderer';
import CodeExecutor from './components/CodeExecutor';
import './App.css';

// 示例 Markdown 内容
const exampleMarkdown = `# React + MarkdownIt 演示

[[toc]]

## 🚀 功能特性

这是一个完整的 React + MarkdownIt 集成演示，展示了如何在 React 应用中使用 MarkdownIt 来渲染 Markdown 内容。

### ✨ 支持的功能

- **基础语法**: 标题、段落、列表、链接、图片
- **扩展语法**: 表格、代码块、任务列表、脚注
- **插件功能**: Emoji、容器、锚点、目录生成
- **实时预览**: 边写边看效果
- **工具栏**: 快速插入常用格式
- **响应式**: 支持移动端和桌面端

## 📝 基础语法演示

### 文本格式

这是 **粗体文字**，这是 *斜体文字*，这是 ~~删除线~~。

你也可以使用 ==高亮文本== 和 ++插入文本++。

### 列表

#### 无序列表
- 第一项
- 第二项
  - 嵌套项目
  - 另一个嵌套项目
- 第三项

#### 有序列表
1. 第一步
2. 第二步
3. 第三步

#### 任务列表
- [x] 已完成的任务
- [ ] 未完成的任务
- [x] 另一个已完成的任务

### 链接和图片

[GitHub](https://github.com) 是一个代码托管平台。

![示例图片](https://via.placeholder.com/400x200/0969da/ffffff?text=MarkdownIt+Demo)

## 💻 代码演示

### 内联代码

使用 \`console.log()\` 来输出调试信息。

### 代码块

\`\`\`javascript
// React 组件示例
import React, { useState } from 'react';
import MarkdownRenderer from './MarkdownRenderer';

function App() {
  const [content, setContent] = useState('# Hello World');
  
  return (
    <div>
      <textarea 
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <MarkdownRenderer content={content} />
    </div>
  );
}

export default App;
\`\`\`

\`\`\`python
# Python 示例
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# 计算斐波那契数列
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")
\`\`\`

## 📊 表格

| 功能 | 支持 | 说明 |
|------|------|------|
| 基础语法 | ✅ | 标题、段落、列表等 |
| 扩展语法 | ✅ | 表格、任务列表等 |
| 插件系统 | ✅ | 丰富的插件生态 |
| 自定义渲染 | ✅ | 可自定义 HTML 输出 |
| 性能优化 | ✅ | 支持缓存和懒加载 |

## 🎨 容器和提示框

::: info 信息提示
这是一个信息提示框，用于显示一般性信息。
:::

::: warning 注意事项
这是一个警告提示框，用于显示需要注意的内容。
:::

::: success 成功提示
这是一个成功提示框，用于显示操作成功的信息。
:::

## 📚 引用和脚注

> 这是一个引用块。
> 
> 可以包含多行内容，也可以嵌套其他元素。
> 
> — 某位智者

这里有一个脚注引用[^1]，还有另一个脚注[^note]。

## 🔬 高级功能

### 数学公式 (需要额外插件)

水的化学式是 H~2~O，爱因斯坦的质能方程是 E=mc^2^。

### 缩写

HTML 和 CSS 是网页开发的基础技术。

*[HTML]: HyperText Markup Language
*[CSS]: Cascading Style Sheets

### 定义列表

Apple
:   一种红色或绿色的水果

Orange
:   一种橙色的柑橘类水果

Banana
:   一种黄色的热带水果

## 🎯 Emoji 支持

支持 emoji 短代码：:smile: :heart: :thumbsup: :rocket: :tada:

## 🔧 使用方法

### 1. 安装依赖

\`\`\`bash
npm install markdown-it react
npm install markdown-it-emoji markdown-it-anchor markdown-it-attrs
\`\`\`

### 2. 基础使用

\`\`\`jsx
import MarkdownRenderer from './components/MarkdownRenderer';

function MyComponent() {
  const markdown = '# Hello World\\n\\nThis is **bold** text.';
  
  return <MarkdownRenderer content={markdown} />;
}
\`\`\`

### 3. 高级配置

\`\`\`jsx
const customOptions = {
  html: true,
  linkify: true,
  typographer: true
};

const customPlugins = [
  { plugin: markdownItEmoji },
  { plugin: markdownItAnchor, options: { permalink: true } }
];

<MarkdownRenderer 
  content={markdown}
  options={customOptions}
  plugins={customPlugins}
/>
\`\`\`

---

[^1]: 这是第一个脚注的内容，可以包含更多详细信息。

[^note]: 这是一个命名脚注，展示了脚注的灵活性。

## 📖 更多资源

- [MarkdownIt 官方文档](https://markdown-it.github.io/)
- [React 官方文档](https://react.dev/)
- [Markdown 语法指南](https://www.markdownguide.org/)

**感谢使用 React + MarkdownIt！** 🎉`;

function App() {
  const [activeDemo, setActiveDemo] = useState('executable');
  const [content, setContent] = useState(exampleMarkdown);

  const demos = [
    { id: 'executable', name: '代码执行演示', icon: '🚀' },
    { id: 'editor', name: '实时编辑器', icon: '✏️' },
    { id: 'renderer', name: '渲染器演示', icon: '🎨' },
    { id: 'examples', name: '功能示例', icon: '📚' }
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
          <h1>React + MarkdownIt 演示</h1>
          <p>功能完整的 Markdown 渲染器和编辑器</p>
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
              
              <div className="executable-examples">
                <div className="example-item">
                  <h3>HTML 交互演示</h3>
                  <EnhancedMarkdownRenderer 
                    content={`\`\`\`html
<div style="padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px; text-align: center;">
  <h3>🌍 Hello World!</h3>
  <p>这是一个可执行的 HTML 代码块</p>
  <button onclick="alert('Hello from MarkdownIt!')" style="background: white; color: #667eea; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold;">点击我</button>
</div>
\`\`\``}
                    enableCodeExecution={true}
                    className="executable-demo"
                  />
                </div>

                <div className="example-item">
                  <h3>CSS 样式演示</h3>
                  <EnhancedMarkdownRenderer 
                    content={`\`\`\`css
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
\`\`\``}
                    enableCodeExecution={true}
                    className="executable-demo"
                  />
                </div>

                <div className="example-item">
                  <h3>JavaScript 交互演示</h3>
                  <EnhancedMarkdownRenderer 
                    content={`\`\`\`javascript
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
\`\`\``}
                    enableCodeExecution={true}
                    className="executable-demo"
                  />
                </div>

                <div className="example-item">
                  <h3>复杂交互游戏</h3>
                  <EnhancedMarkdownRenderer 
                    content={`\`\`\`html
<div class="interactive-demo">
  <h3>🎮 点击游戏</h3>
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
\`\`\``}
                    enableCodeExecution={true}
                    className="executable-demo"
                  />
                </div>
              </div>

              <div className="demo-info">
                <h3>✨ 功能特性</h3>
                <ul>
                  <li>🎯 <strong>实时执行</strong> - HTML、CSS、JavaScript 代码立即执行</li>
                  <li>🛡️ <strong>安全沙箱</strong> - 代码在 iframe 中安全执行</li>
                  <li>📱 <strong>响应式设计</strong> - 支持移动端和桌面端</li>
                  <li>🔧 <strong>控制台支持</strong> - 显示 JavaScript 输出和错误</li>
                  <li>🎨 <strong>语法高亮</strong> - 代码块语法高亮显示</li>
                  <li>⚡ <strong>高性能</strong> - 优化的渲染和执行性能</li>
                </ul>
              </div>
            </div>
          )}

          {activeDemo === 'editor' && (
            <div className="demo-section">
              <div className="section-header">
                <h2>实时 Markdown 编辑器</h2>
                <p>支持实时预览、工具栏、快捷键和拖拽上传</p>
              </div>
              
              <MarkdownEditor
                initialContent={content}
                onContentChange={handleContentChange}
                height="500px"
                showPreview={true}
                showToolbar={true}
                placeholder="在这里输入你的 Markdown 内容..."
              />
              
              <div className="demo-info">
                <h3>功能特性</h3>
                <ul>
                  <li>🎯 实时预览 - 边写边看效果</li>
                  <li>🛠️ 工具栏 - 快速插入常用格式</li>
                  <li>⌨️ 快捷键 - Ctrl+B (粗体), Ctrl+I (斜体), Ctrl+K (链接)</li>
                  <li>📱 响应式 - 支持移动端和桌面端</li>
                  <li>💾 自动保存 - 内容自动保存到本地存储</li>
                  <li>🖼️ 拖拽上传 - 支持拖拽图片文件</li>
                </ul>
              </div>
            </div>
          )}

          {activeDemo === 'renderer' && (
            <div className="demo-section">
              <div className="section-header">
                <h2>Markdown 渲染器演示</h2>
                <p>展示 MarkdownIt 的渲染效果和各种插件功能</p>
              </div>
              
              <div className="renderer-demo">
                <MarkdownRenderer 
                  content={content}
                  className="demo-renderer"
                  onLinkClick={(e, href) => {
                    console.log('链接点击:', href);
                    if (href.startsWith('#')) {
                      e.preventDefault();
                      const element = document.querySelector(href);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }
                    return true;
                  }}
                />
              </div>
            </div>
          )}

          {activeDemo === 'examples' && (
            <div className="demo-section">
              <div className="section-header">
                <h2>代码示例</h2>
                <p>学习如何在你的项目中集成 MarkdownIt</p>
              </div>
              
              <div className="examples-grid">
                <div className="example-card">
                  <h3>基础使用</h3>
                  <pre><code>{`import MarkdownRenderer from './MarkdownRenderer';

function MyComponent() {
  const markdown = '# Hello World\\n\\nThis is **bold** text.';
  
  return <MarkdownRenderer content={markdown} />;
}`}</code></pre>
                  <button 
                    className="copy-btn"
                    onClick={() => copyToClipboard(`import MarkdownRenderer from './MarkdownRenderer';

function MyComponent() {
  const markdown = '# Hello World\\n\\nThis is **bold** text.';
  
  return <MarkdownRenderer content={markdown} />;
}`)}
                  >
                    复制代码
                  </button>
                </div>

                <div className="example-card">
                  <h3>自定义配置</h3>
                  <pre><code>{`const customOptions = {
  html: true,
  linkify: true,
  typographer: true
};

const customPlugins = [
  { plugin: markdownItEmoji },
  { plugin: markdownItAnchor, options: { permalink: true } }
];

<MarkdownRenderer 
  content={markdown}
  options={customOptions}
  plugins={customPlugins}
/>`}</code></pre>
                  <button 
                    className="copy-btn"
                    onClick={() => copyToClipboard(`const customOptions = {
  html: true,
  linkify: true,
  typographer: true
};

const customPlugins = [
  { plugin: markdownItEmoji },
  { plugin: markdownItAnchor, options: { permalink: true } }
];

<MarkdownRenderer 
  content={markdown}
  options={customOptions}
  plugins={customPlugins}
/>`)}
                  >
                    复制代码
                  </button>
                </div>

                <div className="example-card">
                  <h3>编辑器组件</h3>
                  <pre><code>{`<MarkdownEditor
  initialContent={content}
  onContentChange={setContent}
  height="400px"
  showPreview={true}
  showToolbar={true}
  placeholder="输入 Markdown..."
/>`}</code></pre>
                  <button 
                    className="copy-btn"
                    onClick={() => copyToClipboard(`<MarkdownEditor
  initialContent={content}
  onContentChange={setContent}
  height="400px"
  showPreview={true}
  showToolbar={true}
  placeholder="输入 Markdown..."
/>`)}
                  >
                    复制代码
                  </button>
                </div>

                <div className="example-card">
                  <h3>自定义渲染器</h3>
                  <pre><code>{`// 自定义链接渲染
md.renderer.rules.link_open = function (tokens, idx, options, env, renderer) {
  const token = tokens[idx];
  const hrefIndex = token.attrIndex('href');
  
  if (hrefIndex >= 0) {
    const href = token.attrs[hrefIndex][1];
    if (href.startsWith('http')) {
      token.attrPush(['target', '_blank']);
      token.attrPush(['rel', 'noopener']);
    }
  }
  
  return renderer.renderToken(tokens, idx, options);
};`}</code></pre>
                  <button 
                    className="copy-btn"
                    onClick={() => copyToClipboard(`// 自定义链接渲染
md.renderer.rules.link_open = function (tokens, idx, options, env, renderer) {
  const token = tokens[idx];
  const hrefIndex = token.attrIndex('href');
  
  if (hrefIndex >= 0) {
    const href = token.attrs[hrefIndex][1];
    if (href.startsWith('http')) {
      token.attrPush(['target', '_blank']);
      token.attrPush(['rel', 'noopener']);
    }
  }
  
  return renderer.renderToken(tokens, idx, options);
};`)}
                  >
                    复制代码
                  </button>
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
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">查看源码</a> | 
            <a href="https://markdown-it.github.io/" target="_blank" rel="noopener noreferrer">MarkdownIt 文档</a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;