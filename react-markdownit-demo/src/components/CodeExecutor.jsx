import React, { useState, useRef, useEffect, useCallback } from 'react';
import './CodeExecutor.css';

/**
 * CodeExecutor 组件
 * 支持执行 HTML、CSS、JavaScript 代码并实时渲染
 */
const CodeExecutor = ({ 
  htmlCode = '', 
  cssCode = '', 
  jsCode = '', 
  title = '代码演示',
  height = '400px',
  showCode = true,
  autoRun = true,
  enableConsole = true
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState(null);
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [activeTab, setActiveTab] = useState('html');
  const [showPreview, setShowPreview] = useState(true);
  const iframeRef = useRef(null);
  const consoleRef = useRef(null);

  // 清理控制台输出
  const clearConsole = useCallback(() => {
    setConsoleOutput([]);
  }, []);

  // 添加控制台输出
  const addConsoleOutput = useCallback((type, message, timestamp = new Date()) => {
    setConsoleOutput(prev => [...prev, { type, message, timestamp }]);
  }, []);

  // 执行代码
  const executeCode = useCallback(async () => {
    if (!iframeRef.current) return;

    setIsRunning(true);
    setError(null);
    clearConsole();

    try {
      // 创建完整的 HTML 文档
      const fullHtml = createFullHtmlDocument(htmlCode, cssCode, jsCode, enableConsole);
      
      // 写入 iframe
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      
      doc.open();
      doc.write(fullHtml);
      doc.close();

      // 设置 iframe 消息监听
      setupIframeMessageListener(iframe);

    } catch (err) {
      setError(err.message);
      addConsoleOutput('error', `执行错误: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  }, [htmlCode, cssCode, jsCode, enableConsole, addConsoleOutput, clearConsole]);

  // 创建完整的 HTML 文档
  const createFullHtmlDocument = (html, css, js, enableConsole) => {
    const consoleScript = enableConsole ? `
      <script>
        // 重写 console 方法以捕获输出
        (function() {
          const originalConsole = window.console;
          const methods = ['log', 'warn', 'error', 'info', 'debug'];
          
          methods.forEach(method => {
            window.console[method] = function(...args) {
              // 发送消息到父窗口
              window.parent.postMessage({
                type: 'console',
                method: method,
                args: args.map(arg => {
                  if (typeof arg === 'object') {
                    try {
                      return JSON.stringify(arg, null, 2);
                    } catch (e) {
                      return String(arg);
                    }
                  }
                  return String(arg);
                })
              }, '*');
              
              // 调用原始方法
              originalConsole[method].apply(originalConsole, args);
            };
          });

          // 捕获未处理的错误
          window.addEventListener('error', function(e) {
            window.parent.postMessage({
              type: 'console',
              method: 'error',
              args: [\`错误: \${e.message} (行 \${e.lineno})\`]
            }, '*');
          });

          // 捕获未处理的 Promise 拒绝
          window.addEventListener('unhandledrejection', function(e) {
            window.parent.postMessage({
              type: 'console',
              method: 'error',
              args: [\`未处理的 Promise 拒绝: \${e.reason}\`]
            }, '*');
          });
        })();
      </script>
    ` : '';

    return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>代码执行预览</title>
    <style>
        body {
            margin: 0;
            padding: 16px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.6;
            color: #333;
            background: #fff;
        }
        
        * {
            box-sizing: border-box;
        }
        
        /* 用户自定义样式 */
        ${css}
    </style>
    ${consoleScript}
</head>
<body>
    ${html}
    
    <script>
        try {
            ${js}
        } catch (error) {
            console.error('JavaScript 执行错误:', error.message);
        }
    </script>
</body>
</html>`;
  };

  // 设置 iframe 消息监听
  const setupIframeMessageListener = (iframe) => {
    const handleMessage = (event) => {
      if (event.source !== iframe.contentWindow) return;
      
      if (event.data.type === 'console') {
        const { method, args } = event.data;
        addConsoleOutput(method, args.join(' '));
      }
    };

    window.addEventListener('message', handleMessage);
    
    // 清理函数
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  };

  // 自动执行
  useEffect(() => {
    if (autoRun && (htmlCode || cssCode || jsCode)) {
      const timer = setTimeout(executeCode, 300);
      return () => clearTimeout(timer);
    }
  }, [htmlCode, cssCode, jsCode, autoRun, executeCode]);

  // 滚动控制台到底部
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [consoleOutput]);

  const hasCode = htmlCode || cssCode || jsCode;

  return (
    <div className="code-executor">
      <div className="code-executor-header">
        <h3 className="code-executor-title">{title}</h3>
        <div className="code-executor-controls">
          {showCode && (
            <div className="view-toggle">
              <button 
                className={`toggle-btn ${!showPreview ? 'active' : ''}`}
                onClick={() => setShowPreview(false)}
              >
                代码
              </button>
              <button 
                className={`toggle-btn ${showPreview ? 'active' : ''}`}
                onClick={() => setShowPreview(true)}
              >
                预览
              </button>
            </div>
          )}
          <button 
            className="run-btn"
            onClick={executeCode}
            disabled={isRunning || !hasCode}
          >
            {isRunning ? '执行中...' : '运行代码'}
          </button>
          {enableConsole && (
            <button 
              className="clear-btn"
              onClick={clearConsole}
            >
              清空控制台
            </button>
          )}
        </div>
      </div>

      <div className="code-executor-content">
        {showCode && !showPreview && (
          <div className="code-panels">
            <div className="code-tabs">
              <button 
                className={`tab-btn ${activeTab === 'html' ? 'active' : ''}`}
                onClick={() => setActiveTab('html')}
              >
                HTML
              </button>
              <button 
                className={`tab-btn ${activeTab === 'css' ? 'active' : ''}`}
                onClick={() => setActiveTab('css')}
              >
                CSS
              </button>
              <button 
                className={`tab-btn ${activeTab === 'js' ? 'active' : ''}`}
                onClick={() => setActiveTab('js')}
              >
                JavaScript
              </button>
            </div>
            
            <div className="code-content">
              {activeTab === 'html' && (
                <pre className="code-block">
                  <code className="language-html">{htmlCode}</code>
                </pre>
              )}
              {activeTab === 'css' && (
                <pre className="code-block">
                  <code className="language-css">{cssCode}</code>
                </pre>
              )}
              {activeTab === 'js' && (
                <pre className="code-block">
                  <code className="language-javascript">{jsCode}</code>
                </pre>
              )}
            </div>
          </div>
        )}

        {showPreview && (
          <div className="preview-panel">
            {error && (
              <div className="error-message">
                <strong>执行错误:</strong> {error}
              </div>
            )}
            
            <iframe
              ref={iframeRef}
              className="preview-iframe"
              style={{ height }}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
              title="代码预览"
            />
          </div>
        )}
      </div>

      {enableConsole && consoleOutput.length > 0 && (
        <div className="console-panel">
          <div className="console-header">
            <span>控制台输出</span>
            <button className="console-clear" onClick={clearConsole}>
              清空
            </button>
          </div>
          <div className="console-content" ref={consoleRef}>
            {consoleOutput.map((output, index) => (
              <div key={index} className={`console-line console-${output.type}`}>
                <span className="console-timestamp">
                  {output.timestamp.toLocaleTimeString()}
                </span>
                <span className="console-message">{output.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeExecutor;