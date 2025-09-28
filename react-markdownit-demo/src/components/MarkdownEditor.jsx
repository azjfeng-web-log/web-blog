import React, { useState, useCallback, useRef, useEffect } from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import './MarkdownEditor.css';

/**
 * MarkdownEditor 组件
 * 提供实时预览的 Markdown 编辑器
 */
const MarkdownEditor = ({ 
  initialContent = '', 
  onContentChange = null,
  height = '400px',
  showPreview = true,
  showToolbar = true,
  placeholder = '在这里输入 Markdown 内容...'
}) => {
  const [content, setContent] = useState(initialContent);
  const [activeTab, setActiveTab] = useState('edit');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const textareaRef = useRef(null);
  const editorRef = useRef(null);

  // 处理内容变化
  const handleContentChange = useCallback((e) => {
    const newContent = e.target.value;
    setContent(newContent);
    if (onContentChange) {
      onContentChange(newContent);
    }
  }, [onContentChange]);

  // 插入文本到光标位置
  const insertText = useCallback((before, after = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    const newText = before + selectedText + after;
    const newContent = content.substring(0, start) + newText + content.substring(end);
    
    setContent(newContent);
    
    // 设置新的光标位置
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);

    if (onContentChange) {
      onContentChange(newContent);
    }
  }, [content, onContentChange]);

  // 工具栏按钮配置
  const toolbarButtons = [
    {
      title: '粗体',
      icon: 'B',
      action: () => insertText('**', '**'),
      className: 'bold'
    },
    {
      title: '斜体',
      icon: 'I',
      action: () => insertText('*', '*'),
      className: 'italic'
    },
    {
      title: '删除线',
      icon: 'S',
      action: () => insertText('~~', '~~'),
      className: 'strikethrough'
    },
    {
      title: '标题',
      icon: 'H',
      action: () => insertText('## '),
      className: 'heading'
    },
    {
      title: '链接',
      icon: '🔗',
      action: () => insertText('[', '](url)'),
      className: 'link'
    },
    {
      title: '图片',
      icon: '🖼️',
      action: () => insertText('![alt](', ')'),
      className: 'image'
    },
    {
      title: '代码',
      icon: '</>',
      action: () => insertText('`', '`'),
      className: 'code'
    },
    {
      title: '代码块',
      icon: '{ }',
      action: () => insertText('```\n', '\n```'),
      className: 'code-block'
    },
    {
      title: '引用',
      icon: '❝',
      action: () => insertText('> '),
      className: 'quote'
    },
    {
      title: '无序列表',
      icon: '•',
      action: () => insertText('- '),
      className: 'list'
    },
    {
      title: '有序列表',
      icon: '1.',
      action: () => insertText('1. '),
      className: 'ordered-list'
    },
    {
      title: '任务列表',
      icon: '☑',
      action: () => insertText('- [ ] '),
      className: 'task-list'
    },
    {
      title: '分割线',
      icon: '—',
      action: () => insertText('\n---\n'),
      className: 'divider'
    },
    {
      title: '表格',
      icon: '⊞',
      action: () => insertText('\n| 列1 | 列2 | 列3 |\n|-----|-----|-----|\n| 内容 | 内容 | 内容 |\n'),
      className: 'table'
    }
  ];

  // 键盘快捷键
  const handleKeyDown = useCallback((e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          insertText('**', '**');
          break;
        case 'i':
          e.preventDefault();
          insertText('*', '*');
          break;
        case 'k':
          e.preventDefault();
          insertText('[', '](url)');
          break;
        case 'Enter':
          e.preventDefault();
          setIsFullscreen(!isFullscreen);
          break;
        default:
          break;
      }
    }
  }, [insertText, isFullscreen]);

  // 全屏切换
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  // 处理文件拖拽
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        // 这里可以实现图片上传逻辑
        const imageUrl = URL.createObjectURL(file);
        insertText(`![${file.name}](${imageUrl})`);
      }
    });
  }, [insertText]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  // 自动保存到 localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('markdown-editor-content', content);
    }, 1000);

    return () => clearTimeout(timer);
  }, [content]);

  // 从 localStorage 恢复内容
  useEffect(() => {
    if (!initialContent) {
      const saved = localStorage.getItem('markdown-editor-content');
      if (saved) {
        setContent(saved);
      }
    }
  }, [initialContent]);

  return (
    <div 
      className={`markdown-editor ${isFullscreen ? 'fullscreen' : ''}`}
      ref={editorRef}
    >
      {/* 工具栏 */}
      {showToolbar && (
        <div className="editor-toolbar">
          <div className="toolbar-group">
            {toolbarButtons.map((button, index) => (
              <button
                key={index}
                className={`toolbar-button ${button.className}`}
                title={button.title}
                onClick={button.action}
              >
                {button.icon}
              </button>
            ))}
          </div>
          
          <div className="toolbar-group">
            <button
              className="toolbar-button fullscreen-button"
              title="全屏 (Ctrl+Enter)"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? '⤓' : '⤢'}
            </button>
          </div>
        </div>
      )}

      {/* 编辑器内容 */}
      <div className="editor-content">
        {/* 移动端标签切换 */}
        <div className="mobile-tabs">
          <button
            className={`tab-button ${activeTab === 'edit' ? 'active' : ''}`}
            onClick={() => setActiveTab('edit')}
          >
            编辑
          </button>
          <button
            className={`tab-button ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            预览
          </button>
        </div>

        <div className="editor-panels">
          {/* 编辑面板 */}
          <div className={`editor-panel ${activeTab === 'edit' ? 'active' : ''}`}>
            <textarea
              ref={textareaRef}
              className="editor-textarea"
              value={content}
              onChange={handleContentChange}
              onKeyDown={handleKeyDown}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              placeholder={placeholder}
              style={{ height }}
              spellCheck={false}
            />
            
            {/* 字数统计 */}
            <div className="editor-status">
              <span>字符: {content.length}</span>
              <span>行数: {content.split('\n').length}</span>
              <span>单词: {content.trim() ? content.trim().split(/\s+/).length : 0}</span>
            </div>
          </div>

          {/* 预览面板 */}
          {showPreview && (
            <div className={`preview-panel ${activeTab === 'preview' ? 'active' : ''}`}>
              <div className="preview-content" style={{ height }}>
                <MarkdownRenderer 
                  content={content}
                  onLinkClick={(e, href) => {
                    console.log('Link clicked:', href);
                    // 可以在这里处理链接点击事件
                    return true; // 返回 true 允许默认行为
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 快捷键提示 */}
      <div className="keyboard-shortcuts">
        <small>
          快捷键: Ctrl+B (粗体), Ctrl+I (斜体), Ctrl+K (链接), Ctrl+Enter (全屏)
        </small>
      </div>
    </div>
  );
};

export default MarkdownEditor;