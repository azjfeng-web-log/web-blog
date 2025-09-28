/**
 * MarkdownIt 可执行代码块插件
 * 支持 HTML、CSS、JavaScript 代码的实时执行和渲染
 */

function markdownItExecutable(md, options = {}) {
  const defaultOptions = {
    // 支持的可执行语言
    executableLanguages: ['html', 'css', 'javascript', 'js', 'jsx', 'vue', 'react'],
    // 是否启用自动执行
    autoRun: true,
    // 是否显示控制台
    enableConsole: true,
    // 默认高度
    defaultHeight: '400px',
    // 是否允许全屏
    allowFullscreen: true,
    // 安全模式（限制某些 API）
    safeMode: true
  };

  const opts = { ...defaultOptions, ...options };

  // 存储代码块信息
  let codeBlocks = [];
  let currentBlockId = 0;

  // 重写 fence 规则来处理可执行代码块
  const originalFence = md.renderer.rules.fence || function(tokens, idx, options, env, renderer) {
    return renderer.renderToken(tokens, idx, options);
  };

  md.renderer.rules.fence = function(tokens, idx, options, env, renderer) {
    const token = tokens[idx];
    const info = token.info ? md.utils.unescapeAll(token.info).trim() : '';
    const langName = info ? info.split(/\s+/g)[0] : '';
    const content = token.content;

    // 检查是否是可执行代码块
    if (opts.executableLanguages.includes(langName.toLowerCase())) {
      return renderExecutableCodeBlock(token, langName, content, opts, ++currentBlockId);
    }

    // 检查是否是组合代码块（多语言）
    if (info.includes('executable') || info.includes('runnable') || info.includes('demo')) {
      return renderExecutableCodeBlock(token, langName, content, opts, ++currentBlockId);
    }

    // 普通代码块，使用原始渲染器
    return originalFence(tokens, idx, options, env, renderer);
  };

  // 添加容器支持，用于组合多个代码块
  if (md.use && typeof md.use === 'function') {
    // 尝试使用 markdown-it-container 插件
    try {
      const markdownItContainer = require('markdown-it-container');
      
      md.use(markdownItContainer, 'demo', {
        validate: function(params) {
          return params.trim().match(/^demo\s*(.*)$/);
        },
        render: function(tokens, idx, _options, env, renderer) {
          const m = tokens[idx].info.trim().match(/^demo\s*(.*)$/);
          
          if (tokens[idx].nesting === 1) {
            const title = m[1] || '代码演示';
            const blockId = ++currentBlockId;
            
            return `<div class="executable-demo-container" data-demo-id="${blockId}">
              <div class="demo-header">
                <h4 class="demo-title">${md.utils.escapeHtml(title)}</h4>
              </div>
              <div class="demo-content">`;
          } else {
            return `</div></div>`;
          }
        }
      });
    } catch (e) {
      // markdown-it-container 不可用，跳过
    }
  }
}

// 渲染可执行代码块
function renderExecutableCodeBlock(token, langName, content, options, blockId) {
  const lang = langName.toLowerCase();
  const escapedContent = escapeHtml(content);
  
  // 解析代码块参数
  const params = parseCodeBlockParams(token.info);
  const title = params.title || `${langName.toUpperCase()} 演示`;
  const height = params.height || options.defaultHeight;
  const autoRun = params.autorun !== undefined ? params.autorun : options.autoRun;
  const showConsole = params.console !== undefined ? params.console : options.enableConsole;

  // 根据语言类型生成不同的执行器
  if (lang === 'html') {
    return renderHtmlExecutor(escapedContent, title, height, autoRun, showConsole, blockId);
  } else if (lang === 'css') {
    return renderCssExecutor(escapedContent, title, height, autoRun, blockId);
  } else if (lang === 'javascript' || lang === 'js') {
    return renderJsExecutor(escapedContent, title, height, autoRun, showConsole, blockId);
  } else if (lang === 'jsx' || lang === 'react') {
    return renderReactExecutor(escapedContent, title, height, autoRun, showConsole, blockId);
  } else if (lang === 'vue') {
    return renderVueExecutor(escapedContent, title, height, autoRun, showConsole, blockId);
  }

  // 默认渲染为普通代码块
  return `<div class="code-block-wrapper">
    <pre><code class="language-${lang}">${escapedContent}</code></pre>
  </div>`;
}

// 渲染 HTML 执行器
function renderHtmlExecutor(content, title, height, autoRun, showConsole, blockId) {
  return `<div class="executable-code-block" data-block-id="${blockId}" data-type="html">
    <div class="code-executor-wrapper" 
         data-html="${encodeURIComponent(content)}"
         data-title="${escapeHtml(title)}"
         data-height="${height}"
         data-auto-run="${autoRun}"
         data-console="${showConsole}">
    </div>
  </div>`;
}

// 渲染 CSS 执行器
function renderCssExecutor(content, title, height, autoRun, blockId) {
  const demoHtml = `<div class="css-demo">
    <h3>CSS 样式演示</h3>
    <p>这是一个段落文本。</p>
    <button>按钮</button>
    <div class="box">盒子元素</div>
  </div>`;

  return `<div class="executable-code-block" data-block-id="${blockId}" data-type="css">
    <div class="code-executor-wrapper" 
         data-html="${encodeURIComponent(demoHtml)}"
         data-css="${encodeURIComponent(content)}"
         data-title="${escapeHtml(title)}"
         data-height="${height}"
         data-auto-run="${autoRun}"
         data-console="false">
    </div>
  </div>`;
}

// 渲染 JavaScript 执行器
function renderJsExecutor(content, title, height, autoRun, showConsole, blockId) {
  const demoHtml = `<div id="js-demo-${blockId}">
    <h3>JavaScript 演示</h3>
    <button id="demo-btn-${blockId}">点击我</button>
    <div id="output-${blockId}"></div>
  </div>`;

  return `<div class="executable-code-block" data-block-id="${blockId}" data-type="javascript">
    <div class="code-executor-wrapper" 
         data-html="${encodeURIComponent(demoHtml)}"
         data-js="${encodeURIComponent(content)}"
         data-title="${escapeHtml(title)}"
         data-height="${height}"
         data-auto-run="${autoRun}"
         data-console="${showConsole}">
    </div>
  </div>`;
}

// 渲染 React 执行器
function renderReactExecutor(content, title, height, autoRun, showConsole, blockId) {
  // 包装 React 代码
  const wrappedCode = `
// React 组件代码
${content}

// 渲染到页面
const container = document.getElementById('react-root-${blockId}');
if (typeof ReactDOM !== 'undefined' && typeof React !== 'undefined') {
  const root = ReactDOM.createRoot ? ReactDOM.createRoot(container) : null;
  if (root) {
    root.render(React.createElement(App));
  } else {
    ReactDOM.render(React.createElement(App), container);
  }
} else {
  container.innerHTML = '<p style="color: red;">React 库未加载，无法执行 JSX 代码</p>';
}
  `;

  const demoHtml = `<div id="react-root-${blockId}"></div>`;

  return `<div class="executable-code-block" data-block-id="${blockId}" data-type="react">
    <div class="code-executor-wrapper" 
         data-html="${encodeURIComponent(demoHtml)}"
         data-js="${encodeURIComponent(wrappedCode)}"
         data-title="${escapeHtml(title)}"
         data-height="${height}"
         data-auto-run="${autoRun}"
         data-console="${showConsole}"
         data-requires="react">
    </div>
  </div>`;
}

// 渲染 Vue 执行器
function renderVueExecutor(content, title, height, autoRun, showConsole, blockId) {
  const wrappedCode = `
// Vue 组件代码
${content}

// 挂载到页面
if (typeof Vue !== 'undefined') {
  new Vue({
    el: '#vue-root-${blockId}',
    ...App
  });
} else {
  document.getElementById('vue-root-${blockId}').innerHTML = 
    '<p style="color: red;">Vue 库未加载，无法执行 Vue 代码</p>';
}
  `;

  const demoHtml = `<div id="vue-root-${blockId}"></div>`;

  return `<div class="executable-code-block" data-block-id="${blockId}" data-type="vue">
    <div class="code-executor-wrapper" 
         data-html="${encodeURIComponent(demoHtml)}"
         data-js="${encodeURIComponent(wrappedCode)}"
         data-title="${escapeHtml(title)}"
         data-height="${height}"
         data-auto-run="${autoRun}"
         data-console="${showConsole}"
         data-requires="vue">
    </div>
  </div>`;
}

// 解析代码块参数
function parseCodeBlockParams(info) {
  const params = {};
  if (!info) return params;

  // 解析类似 "javascript title=演示 height=300px autorun=false" 的参数
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

// HTML 转义
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

module.exports = markdownItExecutable;