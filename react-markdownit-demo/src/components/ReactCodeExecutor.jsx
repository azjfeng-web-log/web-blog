import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as Babel from '@babel/standalone';
import './ReactCodeExecutor.css';

const ReactCodeExecutor = ({ 
  code, 
  language = 'jsx',
  showCode = true,
  showPreview = true,
  height = '400px',
  onError,
  onSuccess 
}) => {
  const [output, setOutput] = useState('');
  const [error, setError] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const iframeRef = useRef(null);
  const timeoutRef = useRef(null);

  // 清理控制台日志
  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  // 执行 React 代码
  const executeReactCode = useCallback(async (reactCode) => {
    if (!reactCode.trim()) {
      setOutput('');
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    clearLogs();

    try {
      // 配置 Babel 预设
      const babelOptions = {
        presets: [
          ['react', { runtime: 'classic' }]
        ],
        plugins: []
      };

      // 转换 JSX 代码
      let transformedCode;
      try {
        transformedCode = Babel.transform(reactCode, babelOptions).code;
      } catch (babelError) {
        throw new Error(`JSX 语法错误: ${babelError.message}`);
      }

      // 创建完整的 HTML 文档
      const htmlContent = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React Code Preview</title>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #ffffff;
            color: #333;
        }
        
        .error {
            background: #fee;
            border: 1px solid #fcc;
            border-radius: 4px;
            padding: 15px;
            margin: 10px 0;
            color: #c33;
            font-family: monospace;
            white-space: pre-wrap;
        }
        
        .success {
            background: #efe;
            border: 1px solid #cfc;
            border-radius: 4px;
            padding: 15px;
            margin: 10px 0;
            color: #363;
        }
        
        /* 常用样式 */
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .card {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 20px;
            margin: 20px 0;
        }
        
        .btn {
            background: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            margin: 5px;
            transition: background-color 0.3s;
        }
        
        .btn:hover {
            background: #0056b3;
        }
        
        .btn-success {
            background: #28a745;
        }
        
        .btn-success:hover {
            background: #218838;
        }
        
        .btn-warning {
            background: #ffc107;
            color: #212529;
        }
        
        .btn-warning:hover {
            background: #e0a800;
        }
        
        .btn-danger {
            background: #dc3545;
        }
        
        .btn-danger:hover {
            background: #c82333;
        }
        
        .input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ced4da;
            border-radius: 4px;
            font-size: 14px;
            margin: 5px 0;
        }
        
        .input:focus {
            outline: none;
            border-color: #007bff;
            box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
        }
        
        .alert {
            padding: 15px;
            margin: 15px 0;
            border-radius: 4px;
            border-left: 4px solid;
        }
        
        .alert-info {
            background-color: #d1ecf1;
            border-color: #17a2b8;
            color: #0c5460;
        }
        
        .alert-success {
            background-color: #d4edda;
            border-color: #28a745;
            color: #155724;
        }
        
        .alert-warning {
            background-color: #fff3cd;
            border-color: #ffc107;
            color: #856404;
        }
        
        .alert-danger {
            background-color: #f8d7da;
            border-color: #dc3545;
            color: #721c24;
        }
        
        .grid {
            display: grid;
            gap: 20px;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        }
        
        .flex {
            display: flex;
            gap: 20px;
            align-items: center;
            flex-wrap: wrap;
        }
        
        .text-center {
            text-align: center;
        }
        
        .mt-4 {
            margin-top: 1.5rem;
        }
        
        .mb-4 {
            margin-bottom: 1.5rem;
        }
        
        .p-4 {
            padding: 1.5rem;
        }
    </style>
</head>
<body>
    <div id="root"></div>
    
    <script>
        // 捕获控制台输出
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;
        
        console.log = function(...args) {
            originalLog.apply(console, args);
            window.parent.postMessage({
                type: 'console',
                level: 'log',
                args: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg))
            }, '*');
        };
        
        console.error = function(...args) {
            originalError.apply(console, args);
            window.parent.postMessage({
                type: 'console',
                level: 'error',
                args: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg))
            }, '*');
        };
        
        console.warn = function(...args) {
            originalWarn.apply(console, args);
            window.parent.postMessage({
                type: 'console',
                level: 'warn',
                args: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg))
            }, '*');
        };
        
        // 错误处理
        window.addEventListener('error', function(event) {
            window.parent.postMessage({
                type: 'error',
                message: event.error ? event.error.message : event.message,
                stack: event.error ? event.error.stack : '',
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno
            }, '*');
        });
        
        window.addEventListener('unhandledrejection', function(event) {
            window.parent.postMessage({
                type: 'error',
                message: 'Unhandled Promise Rejection: ' + (event.reason ? event.reason.message || event.reason : 'Unknown error'),
                stack: event.reason ? event.reason.stack : ''
            }, '*');
        });
        
        // 等待 React 加载完成
        function waitForReact() {
            return new Promise((resolve) => {
                if (window.React && window.ReactDOM) {
                    resolve();
                } else {
                    setTimeout(() => waitForReact().then(resolve), 100);
                }
            });
        }
        
        // 执行用户代码
        waitForReact().then(() => {
            try {
                // 创建安全的执行环境
                const { createElement: h, useState, useEffect, useCallback, useMemo, useRef, Fragment } = React;
                const { createRoot } = ReactDOM;
                
                // 执行转换后的代码
                const userCode = \`${transformedCode}\`;
                
                // 创建执行函数
                const executeCode = new Function(
                    'React', 'ReactDOM', 'h', 'useState', 'useEffect', 'useCallback', 'useMemo', 'useRef', 'Fragment', 'createRoot',
                    \`
                    try {
                        \${userCode}
                    } catch (error) {
                        window.parent.postMessage({
                            type: 'error',
                            message: error.message,
                            stack: error.stack
                        }, '*');
                        throw error;
                    }
                    \`
                );
                
                // 执行代码
                executeCode(React, ReactDOM, h, useState, useEffect, useCallback, useMemo, useRef, Fragment, createRoot);
                
                // 通知执行成功
                window.parent.postMessage({
                    type: 'success',
                    message: 'React 组件渲染成功'
                }, '*');
                
            } catch (error) {
                console.error('执行错误:', error);
                document.getElementById('root').innerHTML = \`
                    <div class="error">
                        <strong>执行错误:</strong><br>
                        \${error.message}<br>
                        <details style="margin-top: 10px;">
                            <summary>错误详情</summary>
                            <pre style="margin-top: 10px; font-size: 12px;">\${error.stack || '无堆栈信息'}</pre>
                        </details>
                    </div>
                \`;
            }
        });
    </script>
</body>
</html>`;

      // 更新 iframe 内容
      if (iframeRef.current) {
        const iframe = iframeRef.current;
        iframe.srcdoc = htmlContent;
        
        // 设置超时
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = setTimeout(() => {
          setError('代码执行超时 (5秒)');
          setIsLoading(false);
        }, 5000);
      }

    } catch (err) {
      console.error('React 代码执行错误:', err);
      setError(err.message);
      setIsLoading(false);
      onError && onError(err);
    }
  }, [clearLogs, onError]);

  // 监听 iframe 消息
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.source !== iframeRef.current?.contentWindow) return;
      
      const { type, level, args, message, stack } = event.data;
      
      if (type === 'console') {
        setLogs(prev => [...prev, { level, args, timestamp: Date.now() }]);
      } else if (type === 'error') {
        setError(message + (stack ? '\n\n' + stack : ''));
        setIsLoading(false);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      } else if (type === 'success') {
        setIsLoading(false);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        onSuccess && onSuccess(message);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [onSuccess]);

  // 当代码改变时执行
  useEffect(() => {
    if (code && language === 'jsx') {
      executeReactCode(code);
    }
  }, [code, language, executeReactCode]);

  // 渲染日志
  const renderLogs = () => {
    if (logs.length === 0) return null;
    
    return (
      <div className="react-executor-logs">
        <div className="logs-header">
          <span>控制台输出</span>
          <button onClick={clearLogs} className="clear-logs-btn">清空</button>
        </div>
        <div className="logs-content">
          {logs.map((log, index) => (
            <div key={index} className={`log-entry log-${log.level}`}>
              <span className="log-level">[{log.level.toUpperCase()}]</span>
              <span className="log-content">{log.args.join(' ')}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (language !== 'jsx' && language !== 'react') {
    return null;
  }

  return (
    <div className="react-code-executor">
      <div className="executor-header">
        <div className="executor-title">
          <span className="executor-icon">⚛️</span>
          React 组件预览
        </div>
        <div className="executor-controls">
          {isLoading && <span className="loading-indicator">执行中...</span>}
          <button 
            onClick={() => executeReactCode(code)}
            className="refresh-btn"
            disabled={isLoading}
          >
            🔄 刷新
          </button>
        </div>
      </div>

      <div className="executor-content">
        {showCode && (
          <div className="code-panel">
            <div className="panel-header">JSX 代码</div>
            <pre className="code-display">
              <code>{code}</code>
            </pre>
          </div>
        )}

        {showPreview && (
          <div className="preview-panel">
            <div className="panel-header">预览结果</div>
            <div className="preview-container">
              {error ? (
                <div className="error-display">
                  <div className="error-title">❌ 执行错误</div>
                  <pre className="error-content">{error}</pre>
                </div>
              ) : (
                <iframe
                  ref={iframeRef}
                  className="preview-iframe"
                  style={{ height }}
                  title="React Component Preview"
                  sandbox="allow-scripts allow-same-origin"
                />
              )}
            </div>
          </div>
        )}
      </div>

      {renderLogs()}
    </div>
  );
};

export default ReactCodeExecutor;