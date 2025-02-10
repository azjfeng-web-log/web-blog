import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Card } from "tdesign-react";
import Button from "tdesign-react/es/button/Button";

import hljs from "highlight.js";
import "highlight.js/styles/github.css"; // 选择你喜欢的样式

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

const modules = {
  toolbar: [
    [{ font: [] }, { size: [] }],
    [{ align: [] }, "direction"],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "super" }, { script: "sub" }],
    ["blockquote", "code-block"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image", "video"],
    ["clean"],
  ],
};
export default function CreationPage() {
  const [codeValues, setCodeValues] = useState("");
  const [previewData, setPreviewData] = useState("");

  function onChange(value) {
    //|<\/pre>|<code[^>]*>|<\/code>
    const result = value
      .replace(/<pre[^>]*>/gi, "<pre><code>")
      .replace(/<\/pre>/gi, "</code></pre>")
      .replace(/<code[^>]*>/gi, '<code class="language-javascript">')
      .replace(/<\/code>/gi, "</code>");
    console.log("onChangereaplds", result);
    setCodeValues(value);
    setPreviewData(result);
  }
  const createMarkup = (html) => {
    return {
      __html:
        highlightWithHLJS(html),
    };
  };
  return (
    <>
      <div style={{ margin: "20px" }}>
        <Card>
          <div className="flex justify-end mb-[20px]">
            <Button theme="primary" style={{ marginRight: "4px" }}>
              预览
            </Button>
            <Button theme="primary">提交</Button>
          </div>
          <ReactQuill
            theme="snow"
            value={codeValues}
            onChange={onChange}
            modules={modules}
          />
        </Card>
        <Card style={{ marginTop: "20px" }}>
          <div
            className="t_code_block_preview"
            dangerouslySetInnerHTML={createMarkup(previewData)}
          />
        </Card>
      </div>
    </>
  );
}
