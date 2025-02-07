import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "tdesign-react/dist/tdesign.css"; // 全局引入所有组件样式代码
import App from "@src/App";

ReactDOM.createRoot(document.getElementById("root") as any).render(
  <React.StrictMode>
    <App></App>
  </React.StrictMode>
);
