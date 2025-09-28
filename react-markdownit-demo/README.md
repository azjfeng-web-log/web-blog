# React + MarkdownIt 完整集成指南

这是一个完整的 React + MarkdownIt 集成演示项目，展示了如何在 React 应用中使用 MarkdownIt 来创建功能强大的 Markdown 渲染器和编辑器。

## 🚀 功能特性

### 📝 MarkdownRenderer 组件
- ✅ **完整的 Markdown 支持** - 标题、段落、列表、链接、图片、表格等
- ✅ **丰富的插件生态** - Emoji、脚注、任务列表、容器、锚点等
- ✅ **自定义渲染器** - 可自定义 HTML 输出和样式
- ✅ **安全性** - 内置 DOMPurify 防止 XSS 攻击
- ✅ **响应式设计** - 支持移动端和桌面端
- ✅ **无障碍支持** - 符合 WCAG 标准

### ✏️ MarkdownEditor 组件
- ✅ **实时预览** - 边写边看效果
- ✅ **工具栏** - 快速插入常用格式
- ✅ **快捷键支持** - Ctrl+B (粗体), Ctrl+I (斜体), Ctrl+K (链接)
- ✅ **拖拽上传** - 支持拖拽图片文件
- ✅ **自动保存** - 内容自动保存到本地存储
- ✅ **全屏模式** - 专注写作体验
- ✅ **字数统计** - 实时显示字符、行数、单词数

## 📦 安装和使用

### 1. 克隆项目
```bash
git clone <repository-url>
cd react-markdownit-demo
```

### 2. 安装依赖
```bash
npm install
```

### 3. 启动开发服务器
```bash
npm start
```

### 4. 构建生产版本
```bash
npm run build
```

## 🛠️ 核心组件使用

### MarkdownRenderer 基础使用

```jsx
import MarkdownRenderer from './components/MarkdownRenderer';

function MyComponent() {
  const markdown = `
# 标题
这是 **粗体** 和 *斜体* 文字。

- 列表项 1
- 列表项 2

[链接](https://example.com)
  `;
  
  return <MarkdownRenderer content={markdown} />;
}
```

### MarkdownRenderer 高级配置

```jsx
import MarkdownRenderer from './components/MarkdownRenderer';
import markdownItEmoji from 'markdown-it-emoji';
import markdownItAnchor from 'markdown-it-anchor';

function AdvancedRenderer() {
  const customOptions = {
    html: true,
    linkify: true,
    typographer: true,
    breaks: false
  };

  const customPlugins = [
    { plugin: markdownItEmoji },
    { 
      plugin: markdownItAnchor, 
      options: {
        permalink: markdownItAnchor.permalink.headerLink(),
        permalinkBefore: true
      }
    }
  ];

  const handleLinkClick = (e, href) => {
    console.log('链接点击:', href);
    // 自定义链接处理逻辑
    if (href.startsWith('#')) {
      e.preventDefault();
      // 平滑滚动到锚点
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
    return true;
  };

  return (
    <MarkdownRenderer 
      content={markdown}
      options={customOptions}
      plugins={customPlugins}
      onLinkClick={handleLinkClick}
      enableSanitize={true}
      className="custom-markdown"
    />
  );
}
```

### MarkdownEditor 使用

```jsx
import MarkdownEditor from './components/MarkdownEditor';

function EditorDemo() {
  const [content, setContent] = useState('# Hello World\n\n开始编写你的 Markdown...');

  return (
    <MarkdownEditor
      initialContent={content}
      onContentChange={setContent}
      height="500px"
      showPreview={true}
      showToolbar={true}
      placeholder="在这里输入 Markdown 内容..."
    />
  );
}
```

## 🔧 自定义配置

### 1. 自定义渲染器

```jsx
// 创建自定义 MarkdownIt 实例
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
});

// 自定义链接渲染
md.renderer.rules.link_open = function (tokens, idx, options, env, renderer) {
  const token = tokens[idx];
  const hrefIndex = token.attrIndex('href');
  
  if (hrefIndex >= 0) {
    const href = token.attrs[hrefIndex][1];
    
    // 外部链接添加 target="_blank"
    if (href.startsWith('http')) {
      token.attrPush(['target', '_blank']);
      token.attrPush(['rel', 'noopener noreferrer']);
    }
  }
  
  return renderer.renderToken(tokens, idx, options);
};

// 自定义图片渲染
md.renderer.rules.image = function (tokens, idx, options, env, renderer) {
  const token = tokens[idx];
  const srcIndex = token.attrIndex('src');
  const altIndex = token.attrIndex('alt');
  
  let src = token.attrs[srcIndex][1];
  let alt = token.attrs[altIndex] ? token.attrs[altIndex][1] : '';
  
  return `<img src="${src}" alt="${alt}" loading="lazy" class="responsive-image" />`;
};
```

### 2. 自定义插件开发

```jsx
// 简单的用户名链接插件
function usernamePlugin(md) {
  md.inline.ruler.before('emphasis', 'username', function(state, silent) {
    const start = state.pos;
    const max = state.posMax;
    
    if (state.src.charCodeAt(start) !== 0x40 /* @ */) {
      return false;
    }
    
    const match = state.src.slice(start).match(/^@([a-zA-Z0-9_]+)/);
    if (!match) {
      return false;
    }
    
    if (!silent) {
      const token = state.push('username', '', 0);
      token.content = match[0];
    }
    
    state.pos += match[0].length;
    return true;
  });
  
  md.renderer.rules.username = function(tokens, idx) {
    const token = tokens[idx];
    const username = token.content.match(/@([a-zA-Z0-9_]+)/)[1];
    return `<a href="https://github.com/${username}" class="username-link">${token.content}</a>`;
  };
}

// 使用自定义插件
const customPlugins = [
  { plugin: usernamePlugin }
];
```

### 3. 容器插件配置

```jsx
import markdownItContainer from 'markdown-it-container';

const containerPlugins = [
  {
    plugin: markdownItContainer,
    name: 'tip',
    options: {
      validate: function(params) {
        return params.trim().match(/^tip\s+(.*)$/);
      },
      render: function (tokens, idx, _options, env, renderer) {
        const m = tokens[idx].info.trim().match(/^tip\s+(.*)$/);
        if (tokens[idx].nesting === 1) {
          return `<div class="custom-tip">
            <div class="tip-title">${renderer.utils.escapeHtml(m[1])}</div>
            <div class="tip-content">`;
        } else {
          return '</div></div>';
        }
      }
    }
  }
];
```

## 🎨 样式自定义

### 1. CSS 变量自定义

```css
.markdown-renderer {
  --md-text-color: #1f2328;
  --md-bg-color: #ffffff;
  --md-border-color: #d1d9e0;
  --md-code-bg: #f6f8fa;
  --md-link-color: #0969da;
  --md-heading-color: #1f2328;
}

/* 深色模式 */
@media (prefers-color-scheme: dark) {
  .markdown-renderer {
    --md-text-color: #f0f6fc;
    --md-bg-color: #0d1117;
    --md-border-color: #30363d;
    --md-code-bg: #161b22;
    --md-link-color: #58a6ff;
    --md-heading-color: #f0f6fc;
  }
}
```

### 2. 自定义主题

```css
/* 自定义主题类 */
.markdown-renderer.theme-custom {
  font-family: 'Georgia', serif;
  line-height: 1.8;
  color: #2c3e50;
}

.markdown-renderer.theme-custom h1,
.markdown-renderer.theme-custom h2,
.markdown-renderer.theme-custom h3 {
  color: #34495e;
  font-weight: 300;
}

.markdown-renderer.theme-custom blockquote {
  border-left: 4px solid #3498db;
  background: #ecf0f1;
  font-style: italic;
}

.markdown-renderer.theme-custom code {
  background: #2c3e50;
  color: #ecf0f1;
  padding: 0.2em 0.4em;
  border-radius: 3px;
}
```

## 📱 响应式设计

组件已内置响应式设计，支持：

- **桌面端**: 并排显示编辑器和预览
- **平板端**: 可切换显示模式
- **移动端**: 标签切换编辑和预览模式

```css
/* 移动端适配 */
@media (max-width: 768px) {
  .markdown-editor .editor-panels {
    flex-direction: column;
  }
  
  .markdown-editor .mobile-tabs {
    display: flex;
  }
  
  .markdown-editor .editor-panel,
  .markdown-editor .preview-panel {
    display: none;
  }
  
  .markdown-editor .editor-panel.active,
  .markdown-editor .preview-panel.active {
    display: block;
  }
}
```

## 🔒 安全性

### XSS 防护

组件使用 DOMPurify 来清理 HTML 内容：

```jsx
import DOMPurify from 'dompurify';

// 在 MarkdownRenderer 中
const sanitizedHtml = DOMPurify.sanitize(html, {
  ADD_ATTR: ['target', 'rel'],
  ADD_TAGS: ['iframe'],
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
});
```

### 内容验证

```jsx
// 自定义内容验证
const validateContent = (content) => {
  // 检查内容长度
  if (content.length > 100000) {
    throw new Error('内容过长');
  }
  
  // 检查恶意脚本
  if (/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(content)) {
    throw new Error('包含不安全的脚本');
  }
  
  return true;
};
```

## ⚡ 性能优化

### 1. 缓存机制

```jsx
import { useMemo } from 'react';

const MarkdownRenderer = ({ content, options, plugins }) => {
  // 缓存 MarkdownIt 实例
  const md = useMemo(() => {
    const instance = new MarkdownIt(options);
    plugins.forEach(({ plugin, options }) => {
      instance.use(plugin, options);
    });
    return instance;
  }, [options, plugins]);

  // 缓存渲染结果
  const renderedHtml = useMemo(() => {
    return md.render(content);
  }, [content, md]);

  return <div dangerouslySetInnerHTML={{ __html: renderedHtml }} />;
};
```

### 2. 懒加载

```jsx
import { lazy, Suspense } from 'react';

// 懒加载编辑器组件
const MarkdownEditor = lazy(() => import('./components/MarkdownEditor'));

function App() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <MarkdownEditor />
    </Suspense>
  );
}
```

### 3. 虚拟滚动（大文档）

```jsx
import { FixedSizeList as List } from 'react-window';

const VirtualizedMarkdown = ({ content }) => {
  const lines = content.split('\n');
  
  const Row = ({ index, style }) => (
    <div style={style}>
      <MarkdownRenderer content={lines[index]} />
    </div>
  );

  return (
    <List
      height={600}
      itemCount={lines.length}
      itemSize={35}
    >
      {Row}
    </List>
  );
};
```

## 🧪 测试

### 单元测试示例

```jsx
import { render, screen } from '@testing-library/react';
import MarkdownRenderer from './MarkdownRenderer';

test('renders markdown content correctly', () => {
  const markdown = '# Hello World\n\nThis is **bold** text.';
  
  render(<MarkdownRenderer content={markdown} />);
  
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Hello World');
  expect(screen.getByText('bold')).toHaveStyle('font-weight: bold');
});

test('handles empty content', () => {
  render(<MarkdownRenderer content="" />);
  
  expect(screen.getByRole('article')).toBeEmptyDOMElement();
});

test('sanitizes dangerous HTML', () => {
  const dangerousMarkdown = '<script>alert("xss")</script>';
  
  render(<MarkdownRenderer content={dangerousMarkdown} />);
  
  expect(screen.queryByText('alert("xss")')).not.toBeInTheDocument();
});
```

## 📚 扩展阅读

- [MarkdownIt 官方文档](https://markdown-it.github.io/)
- [MarkdownIt 插件列表](https://www.npmjs.com/search?q=keywords:markdown-it-plugin)
- [React 性能优化](https://react.dev/learn/render-and-commit)
- [DOMPurify 安全指南](https://github.com/cure53/DOMPurify)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

---

**🎉 现在你已经拥有了一个功能完整的 React + MarkdownIt 解决方案！**