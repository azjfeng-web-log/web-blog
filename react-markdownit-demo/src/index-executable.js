import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppWithCodeExecution from './AppWithCodeExecution';

// 将 React 和 ReactDOM 暴露到全局，供代码执行器使用
window.React = React;
window.ReactDOM = ReactDOM;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppWithCodeExecution />
  </React.StrictMode>
);