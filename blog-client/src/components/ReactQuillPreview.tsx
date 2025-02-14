import React from "react";

import hljs from "highlight.js";
import { Card } from "tdesign-react";
// 配置Highlight.js
hljs.configure({
  languages: ["javascript", "ruby", "python", "html"], // 只包括你需要的语言
});

const highlightWithHLJS = (content) => {
  const root = document.createElement("div");
  root.innerHTML = content;

  const nodes = root.querySelectorAll("pre code");
  nodes.forEach((node: any) => {
    hljs.highlightElement(node);
  });

  return root.innerHTML;
};

const createMarkup = (html) => {
  return {
    __html: highlightWithHLJS(html),
  };
};

export default function ReactQuillPreview({ children }) {
  return (
    <Card>
      <div
        className="t_code_block_preview ql-editor"
        dangerouslySetInnerHTML={createMarkup(children)}
      />
    </Card>
  );
}
