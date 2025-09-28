import React, { useMemo } from 'react';
import MarkdownIt from 'markdown-it';
import DOMPurify from 'dompurify';

// 导入插件
import markdownItAbbr from 'markdown-it-abbr';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItAttrs from 'markdown-it-attrs';
import markdownItContainer from 'markdown-it-container';
import markdownItDeflist from 'markdown-it-deflist';
// import markdownItEmoji from 'markdown-it-emoji';
import markdownItFootnote from 'markdown-it-footnote';
import markdownItHighlightjs from 'markdown-it-highlightjs';
import markdownItIns from 'markdown-it-ins';
import markdownItMark from 'markdown-it-mark';
import markdownItSub from 'markdown-it-sub';
import markdownItSup from 'markdown-it-sup';
import markdownItTaskLists from 'markdown-it-task-lists';
import markdownItToc from 'markdown-it-table-of-contents';

// 导入样式
import 'highlight.js/styles/github.css';
import './MarkdownRenderer.css';

/**
 * MarkdownRenderer 组件
 * 用于渲染 Markdown 内容为 HTML
 */
const MarkdownRenderer = ({ 
  content = '', 
  options = {}, 
  plugins = [], 
  className = '',
  enableSanitize = true,
  onLinkClick = null 
}) => {
  
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
    // { plugin: markdownItEmoji },
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

    // 自定义渲染器
    setupCustomRenderers(instance, onLinkClick);

    return instance;
  }, [options, plugins, onLinkClick]);

  // 渲染 HTML
  const renderedHtml = useMemo(() => {
    if (!content) return '';
    
    let html = md.render(content);
    
    // 安全清理 HTML
    if (enableSanitize) {
      html = DOMPurify.sanitize(html, {
        ADD_ATTR: ['target', 'rel'],
        ADD_TAGS: ['iframe'],
        ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
      });
    }
    
    return html;
  }, [content, md, enableSanitize]);

  return (
    <div 
      className={`markdown-renderer ${className}`}
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
    
    const titleAttr = title ? ` title="${(title)}"` : '';
    
    return `<img src="${(src)}" alt="${(alt)}"${titleAttr} loading="lazy" class="markdown-image" />`;
  };

  // 自定义代码块渲染器
  md.renderer.rules.fence = function (tokens, idx, options, env, renderer) {
    const token = tokens[idx];
    const info = token.info ? md.utils.unescapeAll(token.info).trim() : '';
    const langName = info ? info.split(/\s+/g)[0] : '';
    const langClass = langName ? ` class="language-${(langName)}"` : '';
    
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
      <pre><code${langClass}>${(token.content)}</code></pre>
    </div>`;
  };
}

export default MarkdownRenderer;