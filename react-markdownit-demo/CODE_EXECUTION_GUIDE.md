# MarkdownIt 代码执行功能使用指南

## 🚀 功能概述

这个增强版的 MarkdownIt 渲染器支持在 Markdown 文档中嵌入可执行的 HTML、CSS 和 JavaScript 代码，实现类似 CodePen 或 JSFiddle 的效果。

## 📦 快速开始

### 1. 安装依赖
```bash
cd react-markdownit-demo
npm install
```

### 2. 启动代码执行演示
```bash
# 方式1: 修改 package.json 中的入口文件
# 将 src/index.js 改为 src/index-executable.js

# 方式2: 直接运行
npm start
```

### 3. 访问演示
打开浏览器访问 `http://localhost:3000`，选择"代码执行演示"标签页。

## 💻 支持的代码类型

### HTML 代码块
```markdown
\`\`\`html
<div style="padding: 20px; background: #f0f8ff; border-radius: 8px;">
  <h3>Hello World! 🌍</h3>
  <button onclick="alert('Hello from HTML!')">点击我</button>
</div>
\`\`\`
```

### CSS 代码块
```markdown
\`\`\`css
.demo-box {
  width: 200px;
  height: 100px;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border-radius: 10px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
\`\`\`
```

### JavaScript 代码块
```markdown
\`\`\`javascript
let count = 0;
const btn = document.getElementById('demo-btn');
const output = document.getElementById('output');

btn.addEventListener('click', () => {
  count++;
  output.innerHTML = `点击了 ${count} 次`;
  console.log('按钮被点击:', count);
});
\`\`\`
```

## 🎯 高级功能

### 1. 代码块参数
你可以为代码块添加参数来控制执行行为：

```markdown
\`\`\`html title=我的演示 height=300px autorun=true console=true
<button onclick="console.log('Hello!')">点击我</button>
\`\`\`
```

支持的参数：
- `title`: 设置演示标题
- `height`: 设置预览区域高度
- `autorun`: 是否自动执行（默认 true）
- `console`: 是否显示控制台（默认 true）

### 2. 组合代码块
使用容器语法组合多个代码块：

```markdown
::: demo 复杂演示
\`\`\`html
<div id="app">
  <h3>计数器应用</h3>
  <button id="increment">+</button>
  <span id="counter">0</span>
  <button id="decrement">-</button>
</div>
\`\`\`

\`\`\`css
#app {
  text-align: center;
  padding: 20px;
  font-family: Arial, sans-serif;
}

button {
  font-size: 20px;
  padding: 10px 15px;
  margin: 0 10px;
  cursor: pointer;
}
\`\`\`

\`\`\`javascript
let count = 0;
const counter = document.getElementById('counter');
const increment = document.getElementById('increment');
const decrement = document.getElementById('decrement');

increment.addEventListener('click', () => {
  count++;
  counter.textContent = count;
});

decrement.addEventListener('click', () => {
  count--;
  counter.textContent = count;
});
\`\`\`
:::
```

## 🛠️ 组件使用

### EnhancedMarkdownRenderer 组件

```jsx
import EnhancedMarkdownRenderer from './components/EnhancedMarkdownRenderer';

function MyComponent() {
  const markdown = `
# 我的演示

\`\`\`html
<button onclick="alert('Hello!')">点击我</button>
\`\`\`
  `;
  
  return (
    <EnhancedMarkdownRenderer 
      content={markdown}
      enableCodeExecution={true}
      enableSanitize={true}
      className="my-renderer"
    />
  );
}
```

### CodeExecutor 组件

```jsx
import CodeExecutor from './components/CodeExecutor';

function MyDemo() {
  const htmlCode = '<button onclick="alert(\'Hello!\')">点击我</button>';
  const cssCode = 'button { padding: 10px; background: #007bff; color: white; }';
  const jsCode = 'console.log("JavaScript 执行成功!");';
  
  return (
    <CodeExecutor
      htmlCode={htmlCode}
      cssCode={cssCode}
      jsCode={jsCode}
      title="我的演示"
      height="400px"
      autoRun={true}
      enableConsole={true}
    />
  );
}
```

## 🔧 配置选项

### MarkdownIt 插件配置

```javascript
import markdownItExecutable from './plugins/markdown-it-executable';

const md = new MarkdownIt()
  .use(markdownItExecutable, {
    // 支持的可执行语言
    executableLanguages: ['html', 'css', 'javascript', 'js', 'jsx', 'vue'],
    // 是否启用自动执行
    autoRun: true,
    // 是否显示控制台
    enableConsole: true,
    // 默认高度
    defaultHeight: '400px',
    // 安全模式
    safeMode: true
  });
```

### 自定义渲染器

```javascript
// 自定义 HTML 渲染
md.renderer.rules.fence = function(tokens, idx, options, env, renderer) {
  const token = tokens[idx];
  const info = token.info ? md.utils.unescapeAll(token.info).trim() : '';
  const langName = info ? info.split(/\s+/g)[0] : '';
  
  if (langName === 'html' && info.includes('executable')) {
    return renderExecutableHtml(token.content);
  }
  
  return originalFence(tokens, idx, options, env, renderer);
};
```

## 🛡️ 安全性

### 沙箱执行
- 所有代码在 iframe 沙箱中执行
- 限制对父页面的访问
- 防止恶意代码执行

### 内容清理
- 使用 DOMPurify 清理 HTML 内容
- 过滤危险的标签和属性
- 支持白名单配置

### 安全配置
```javascript
<EnhancedMarkdownRenderer 
  content={markdown}
  enableCodeExecution={true}
  enableSanitize={true}
  // 自定义 DOMPurify 配置
  sanitizeOptions={{
    ALLOWED_TAGS: ['div', 'span', 'p', 'button'],
    ALLOWED_ATTR: ['class', 'id', 'style', 'onclick']
  }}
/>
```

## 📱 响应式设计

### 移动端适配
- 自动检测屏幕尺寸
- 移动端显示标签切换
- 触摸友好的交互

### 自定义断点
```css
@media (max-width: 768px) {
  .code-executor .editor-panels {
    flex-direction: column;
  }
  
  .mobile-tabs {
    display: flex;
  }
}
```

## 🎨 主题定制

### CSS 变量
```css
.code-executor {
  --executor-bg: #ffffff;
  --executor-border: #e1e4e8;
  --executor-text: #24292f;
  --executor-accent: #0969da;
}

/* 深色主题 */
@media (prefers-color-scheme: dark) {
  .code-executor {
    --executor-bg: #0d1117;
    --executor-border: #30363d;
    --executor-text: #f0f6fc;
    --executor-accent: #58a6ff;
  }
}
```

### 自定义样式
```css
.my-custom-executor {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.my-custom-executor .preview-iframe {
  border-radius: 8px;
}
```

## 🚀 性能优化

### 懒加载
```javascript
import { lazy, Suspense } from 'react';

const CodeExecutor = lazy(() => import('./components/CodeExecutor'));

function MyComponent() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <CodeExecutor {...props} />
    </Suspense>
  );
}
```

### 缓存优化
```javascript
const memoizedRenderer = useMemo(() => {
  return new MarkdownIt().use(markdownItExecutable);
}, [options]);

const renderedContent = useMemo(() => {
  return memoizedRenderer.render(content);
}, [content, memoizedRenderer]);
```

## 🧪 测试

### 单元测试
```javascript
import { render, screen } from '@testing-library/react';
import EnhancedMarkdownRenderer from './EnhancedMarkdownRenderer';

test('renders executable code blocks', () => {
  const markdown = `
\`\`\`html
<button>Test Button</button>
\`\`\`
  `;
  
  render(<EnhancedMarkdownRenderer content={markdown} enableCodeExecution={true} />);
  
  expect(screen.getByText('Test Button')).toBeInTheDocument();
});
```

### 集成测试
```javascript
test('executes JavaScript code', async () => {
  const markdown = `
\`\`\`javascript
document.getElementById('output').textContent = 'Success!';
\`\`\`
  `;
  
  render(<EnhancedMarkdownRenderer content={markdown} enableCodeExecution={true} />);
  
  await waitFor(() => {
    expect(screen.getByText('Success!')).toBeInTheDocument();
  });
});
```

## 📚 示例项目

### 博客系统
```javascript
// 博客文章组件
function BlogPost({ post }) {
  return (
    <article>
      <h1>{post.title}</h1>
      <EnhancedMarkdownRenderer 
        content={post.content}
        enableCodeExecution={true}
        className="blog-content"
      />
    </article>
  );
}
```

### 文档系统
```javascript
// 技术文档组件
function Documentation({ doc }) {
  return (
    <div className="documentation">
      <EnhancedMarkdownRenderer 
        content={doc.content}
        enableCodeExecution={true}
        options={{
          html: true,
          linkify: true,
          typographer: true
        }}
      />
    </div>
  );
}
```

### 在线教程
```javascript
// 交互式教程组件
function InteractiveTutorial({ lesson }) {
  return (
    <div className="tutorial">
      <EnhancedMarkdownRenderer 
        content={lesson.content}
        enableCodeExecution={true}
        enableConsole={true}
      />
    </div>
  );
}
```

## 🔗 相关资源

- [MarkdownIt 官方文档](https://markdown-it.github.io/)
- [React 官方文档](https://react.dev/)
- [DOMPurify 文档](https://github.com/cure53/DOMPurify)
- [Highlight.js 文档](https://highlightjs.org/)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## 📄 许可证

MIT License

---

**🎉 现在你可以在 Markdown 中创建真正的交互式内容了！**