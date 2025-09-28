import React, { useMemo, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import MarkdownIt from 'markdown-it';
import DOMPurify from 'dompurify';
import CodeExecutor from './CodeExecutor';
import ReactCodeExecutor from './ReactCodeExecutor';

// 导入插件
import markdownItAbbr from 'markdown-it-abbr';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItAttrs from 'markdown-it-attrs';
import markdownItContainer from 'markdown-it-container';
import markdownItDeflist from 'markdown-it-deflist';
import markdownItFootnote from 'markdown-it-footnote';
import markdownItHighlightjs from 'markdown-it-highlightjs';
import markdownItIns from 'markdown-it-ins';
import markdownItMark from 'markdown-it-mark';
import markdownItSub from 'markdown-it-sub';
import markdownItSup from 'markdown-it-sup';
import markdownItTaskLists from 'markdown-it-task-lists';
import markdownItToc from 'markdown-it-table-of-contents';

// 导入自定义插件
import markdownItExecutable from '../plugins/markdown-it-executable';

// 导入样式
import 'highlight.js/styles/github.css';
import './MarkdownRenderer.css';

/**
 * 增强版 MarkdownRenderer 组件
 * 支持代码执行和实时渲染功能
 */
const EnhancedMarkdownRenderer = ({ 
  content = '', 
  options = {}, 
  plugins = [], 
  className = '',
  enableSanitize = true,
  enableCodeExecution = true,
  onLinkClick = null 
}) => {
  const containerRef = useRef(null);
  
  // 默认配置
  const defaultOptions = {
    html: true,
    xhtmlOut: false,
    breaks: false,
    langPrefix: 'language-',
    linkify: true,
    typographer: true,
    quotes: '""',
  };

  // 默认插件配置
  const defaultPlugins = [
    { plugin: markdownItFootnote },
    { plugin: markdownItDeflist },
    { plugin: markdownItAbbr },
    { plugin: markdownItIns },
    { plugin: markdownItMark },
    { plugin: markdownItSub },
    { plugin: markdownItSup },
    { plugin: markdownItTaskLists, options: { enabled: true } },
    { plugin: markdownItHighlightjs },
    { plugin: markdownItAttrs },
    { 
      plugin: markdownItAnchor, 
      options: {
        permalink: markdownItAnchor.permalink.headerLink(),
        permalinkBefore: true,
        permalinkSymbol: '#'
      }
    },
    {
      plugin: markdownItToc,
      options: {
        includeLevel: [1, 2, 3, 4],
        containerClass: 'table-of-contents',
        markerPattern: /^\[\[toc\]\]/im
      }
    },
    // 可执行代码块插件
    ...(enableCodeExecution ? [{
      plugin: markdownItExecutable,
      options: {
        executableLanguages: ['html', 'css', 'javascript', 'js', 'jsx', 'react', 'vue'],
        autoRun: true,
        enableConsole: true,
        defaultHeight: '400px'
      }
    }] : []),
    // 容器插件
    {
      plugin: markdownItContainer,
      name: 'warning',
      options: {
        validate: function(params) {
          return params.trim().match(/^warning\s+(.*)$/);
        },
        render: function (tokens, idx, _options, env, renderer) {
          const m = tokens[idx].info.trim().match(/^warning\s+(.*)$/);
          if (tokens[idx].nesting === 1) {
            return '<div class="alert alert-warning">\n<div class="alert-title">' + 
                   (m[1]) + '</div>\n';
          } else {
            return '</div>\n';
          }
        }
      }
    },
    {
      plugin: markdownItContainer,
      name: 'info',
      options: {
        validate: function(params) {
          return params.trim().match(/^info\s+(.*)$/);
        },
        render: function (tokens, idx, _options, env, renderer) {
          const m = tokens[idx].info.trim().match(/^info\s+(.*)$/);
          if (tokens[idx].nesting === 1) {
            return '<div class="alert alert-info">\n<div class="alert-title">' + 
                   (m[1]) + '</div>\n';
          } else {
            return '</div>\n';
          }
        }
      }
    },
    {
      plugin: markdownItContainer,
      name: 'success',
      options: {
        validate: function(params) {
          return params.trim().match(/^success\s+(.*)$/);
        },
        render: function (tokens, idx, _options, env, renderer) {
          const m = tokens[idx].info.trim().match(/^success\s+(.*)$/);
          if (tokens[idx].nesting === 1) {
            return '<div class="alert alert-success">\n<div class="alert-title">' + 
                   (m[1]) + '</div>\n';
          } else {
            return '</div>\n';
          }
        }
      }
    },
    {
      plugin: markdownItContainer,
      name: 'demo',
      options: {
        validate: function(params) {
          return params.trim().match(/^demo\s*(.*)$/);
        },
        render: function (tokens, idx, _options, env, renderer) {
          const m = tokens[idx].info.trim().match(/^demo\s*(.*)$/);
          if (tokens[idx].nesting === 1) {
            const title = m[1] || '代码演示';
            return `<div class="demo-container">
              <div class="demo-header">
                <h4 class="demo-title">${renderer.utils.escapeHtml(title)}</h4>
              </div>
              <div class="demo-content">`;
          } else {
            return '</div></div>';
          }
        }
      }
    }
  ];

  // 创建 MarkdownIt 实例
  const md = useMemo(() => {
    const mergedOptions = { ...defaultOptions, ...options };
    const instance = new MarkdownIt(mergedOptions);

    // 加载插件
    const allPlugins = [...defaultPlugins, ...plugins];
    allPlugins.forEach(({ plugin, name, options: pluginOptions }) => {
      if (name) {
        instance.use(plugin, name, pluginOptions);
      } else {
        instance.use(plugin, pluginOptions);
      }
    });

    // 设置自定义渲染器
    setupCustomRenderers(instance, onLinkClick);

    return instance;
  }, [options, plugins, onLinkClick, enableCodeExecution]);

  // 渲染 HTML
  const renderedHtml = useMemo(() => {
    if (!content) return '';
    
    let html = md.render(content);
    
    // 安全清理 HTML
    if (enableSanitize) {
      html = DOMPurify.sanitize(html, {
        ADD_ATTR: ['target', 'rel', 'data-*'],
        ADD_TAGS: ['iframe'],
        ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
      });
    }
    
    return html;
  }, [content, md, enableSanitize]);

  // 处理代码执行器的初始化
  useEffect(() => {
    if (!enableCodeExecution || !containerRef.current) return;

    const container = containerRef.current;
    
    // 处理普通代码执行器
    const executorWrappers = container.querySelectorAll('.code-executor-wrapper');
    executorWrappers.forEach((wrapper, index) => {
      // 避免重复初始化
      if (wrapper.dataset.initialized) return;
      
      const htmlCode = decodeURIComponent(wrapper.dataset.html || '');
      const cssCode = decodeURIComponent(wrapper.dataset.css || '');
      const jsCode = decodeURIComponent(wrapper.dataset.js || '');
      const title = wrapper.dataset.title || '代码演示';
      const height = wrapper.dataset.height || '400px';
      const autoRun = wrapper.dataset.autoRun === 'true';
      const enableConsole = wrapper.dataset.console === 'true';

      // 创建 React 元素并渲染
      const executorElement = React.createElement(CodeExecutor, {
        htmlCode,
        cssCode,
        jsCode,
        title,
        height,
        autoRun,
        enableConsole,
        key: `executor-${index}`
      });

      // 使用 React 18 的 createRoot API
      try {
        const root = createRoot(wrapper);
        root.render(executorElement);
      } catch (err) {
        console.error('代码执行器渲染失败:', err);
        wrapper.innerHTML = `
          <div class="code-executor-error">
            <p>代码执行器渲染失败: ${err.message}</p>
            <details>
              <summary>查看代码</summary>
              <pre><code>${htmlCode || cssCode || jsCode}</code></pre>
            </details>
          </div>
        `;
      }

      wrapper.dataset.initialized = 'true';
    });

    // 处理 React 代码执行器
    const reactWrappers = container.querySelectorAll('.react-executor-wrapper');
    reactWrappers.forEach((wrapper, index) => {
      // 避免重复初始化
      if (wrapper.dataset.initialized) return;
      
      const code = decodeURIComponent(wrapper.dataset.code || '');
      const language = wrapper.dataset.language || 'jsx';
      const title = wrapper.dataset.title || 'React 组件演示';
      const height = wrapper.dataset.height || '400px';
      const autoRun = wrapper.dataset.autoRun === 'true';
      const enableConsole = wrapper.dataset.console === 'true';

      // 创建 React 代码执行器元素
      const reactExecutorElement = React.createElement(ReactCodeExecutor, {
        code,
        language,
        title,
        height,
        showCode: true,
        showPreview: true,
        onError: (error) => {
          console.error('React 代码执行错误:', error);
        },
        onSuccess: (message) => {
          console.log('React 代码执行成功:', message);
        },
        key: `react-executor-${index}`
      });

      // 使用 React 18 的新 API 或回退到旧 API
      if (window.ReactDOM?.createRoot) {
        const root = window.ReactDOM.createRoot(wrapper);
        root.render(reactExecutorElement);
      } else if (window.ReactDOM?.render) {
        window.ReactDOM.render(reactExecutorElement, wrapper);
      } else {
        // 如果 ReactDOM 不可用，显示错误信息
        wrapper.innerHTML = `
          <div class="code-executor-error">
            <p>React 代码执行器需要 React 环境支持</p>
            <details>
              <summary>查看代码</summary>
              <pre><code>${code}</code></pre>
            </details>
          </div>
        `;
      }

      wrapper.dataset.initialized = 'true';
    });

    // 清理函数
    return () => {
      // React 18 不需要手动清理，createRoot 会自动处理
    };
  }, [renderedHtml, enableCodeExecution]);

  return (
    <div 
      ref={containerRef}
      className={`markdown-renderer enhanced ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
};

// 设置自定义渲染器
function setupCustomRenderers(md, onLinkClick) {
  // 自定义链接渲染器
  const defaultLinkRender = md.renderer.rules.link_open || function(tokens, idx, options, env, renderer) {
    return renderer.renderToken(tokens, idx, options);
  };

  md.renderer.rules.link_open = function (tokens, idx, options, env, renderer) {
    const token = tokens[idx];
    const hrefIndex = token.attrIndex('href');
    
    if (hrefIndex >= 0) {
      const href = token.attrs[hrefIndex][1];
      
      // 外部链接添加 target="_blank"
      if (href.startsWith('http') || href.startsWith('//')) {
        const targetIndex = token.attrIndex('target');
        if (targetIndex < 0) {
          token.attrPush(['target', '_blank']);
        } else {
          token.attrs[targetIndex][1] = '_blank';
        }
        
        const relIndex = token.attrIndex('rel');
        if (relIndex < 0) {
          token.attrPush(['rel', 'noopener noreferrer']);
        } else {
          token.attrs[relIndex][1] = 'noopener noreferrer';
        }
      }
      
      // 添加点击事件处理
      if (onLinkClick) {
        const onclickIndex = token.attrIndex('onclick');
        const clickHandler = `(function(e) { 
          const handler = ${onLinkClick.toString()};
          return handler(e, '${href}');
        })(event)`;
        
        if (onclickIndex < 0) {
          token.attrPush(['onclick', clickHandler]);
        } else {
          token.attrs[onclickIndex][1] = clickHandler;
        }
      }
    }
    
    return defaultLinkRender(tokens, idx, options, env, renderer);
  };

  // 自定义图片渲染器
  md.renderer.rules.image = function (tokens, idx, options, env, renderer) {
    const token = tokens[idx];
    const srcIndex = token.attrIndex('src');
    const altIndex = token.attrIndex('alt');
    const titleIndex = token.attrIndex('title');
    
    let src = '';
    let alt = '';
    let title = '';
    
    if (srcIndex >= 0) {
      src = token.attrs[srcIndex][1];
    }
    
    if (altIndex >= 0) {
      alt = token.attrs[altIndex][1];
    }
    
    if (titleIndex >= 0) {
      title = token.attrs[titleIndex][1];
    }
    
    const titleAttr = title ? ` title="${md.utils.escapeHtml(title)}"` : '';
    
    return `<img src="${md.utils.escapeHtml(src)}" alt="${md.utils.escapeHtml(alt)}"${titleAttr} loading="lazy" class="markdown-image" />`;
  };

  // 增强代码块渲染器
  const originalFence = md.renderer.rules.fence || function(tokens, idx, options, env, renderer) {
    return renderer.renderToken(tokens, idx, options);
  };

  md.renderer.rules.fence = function (tokens, idx, options, env, renderer) {
    const token = tokens[idx];
    const info = token.info ? md.utils.unescapeAll(token.info).trim() : '';
    const langName = info ? info.split(/\s+/g)[0] : '';
    const content = token.content;

    // 检查是否是可执行代码块
    const executableLanguages = ['html', 'css', 'javascript', 'js', 'jsx', 'vue', 'react'];
    const isExecutable = executableLanguages.includes(langName.toLowerCase()) || 
                        info.includes('executable') || 
                        info.includes('runnable') || 
                        info.includes('demo');

    if (isExecutable) {
      // 解析参数
      const params = parseCodeBlockParams(info);
      const title = params.title || `${langName.toUpperCase()} 演示`;
      const height = params.height || '400px';
      const autoRun = params.autorun !== undefined ? params.autorun : true;
      const showConsole = params.console !== undefined ? params.console : true;

      // 根据语言类型生成执行器
      if (['jsx', 'react'].includes(langName.toLowerCase())) {
        // React/JSX 代码执行器
        return `<div class="executable-code-block">
          <div class="react-executor-wrapper" 
               data-code="${encodeURIComponent(content)}"
               data-language="${langName.toLowerCase()}"
               data-title="${md.utils.escapeHtml(title)}"
               data-height="${height}"
               data-auto-run="${autoRun}"
               data-console="${showConsole}">
          </div>
        </div>`;
      } else {
        // 普通代码执行器 (HTML/CSS/JS)
        let htmlCode = '';
        let cssCode = '';
        let jsCode = '';

        if (langName.toLowerCase() === 'html') {
          htmlCode = content;
        } else if (langName.toLowerCase() === 'css') {
          cssCode = content;
          htmlCode = `<div class="css-demo">
            <h3>CSS 样式演示</h3>
            <p>这是一个段落文本。</p>
            <button>按钮</button>
            <div class="box">盒子元素</div>
          </div>`;
        } else if (['javascript', 'js'].includes(langName.toLowerCase())) {
          jsCode = content;
          htmlCode = `<div class="js-demo">
            <h3>JavaScript 演示</h3>
            <button id="demo-btn">点击我</button>
            <div id="output"></div>
          </div>`;
        }

        return `<div class="executable-code-block">
          <div class="code-executor-wrapper" 
               data-html="${encodeURIComponent(htmlCode)}"
               data-css="${encodeURIComponent(cssCode)}"
               data-js="${encodeURIComponent(jsCode)}"
               data-title="${md.utils.escapeHtml(title)}"
               data-height="${height}"
               data-auto-run="${autoRun}"
               data-console="${showConsole}">
          </div>
        </div>`;
      }
    }

    // 普通代码块，添加复制功能
    const langClass = langName ? ` class="language-${md.utils.escapeHtml(langName)}"` : '';
    
    return `<div class="code-block-wrapper">
      <div class="code-block-header">
        <span class="language-label">${langName || 'text'}</span>
        <button class="copy-button" onclick="copyCodeToClipboard(this)" title="复制代码">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="m5 15-4-4 4-4"></path>
          </svg>
        </button>
      </div>
      <pre><code${langClass}>${md.utils.escapeHtml(content)}</code></pre>
    </div>`;
  };
}

// 解析代码块参数
function parseCodeBlockParams(info) {
  const params = {};
  if (!info) return params;

  const parts = info.split(/\s+/);
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    if (part.includes('=')) {
      const [key, value] = part.split('=', 2);
      params[key.toLowerCase()] = value === 'true' ? true : 
                                  value === 'false' ? false : 
                                  value;
    }
  }

  return params;
}

export default EnhancedMarkdownRenderer;