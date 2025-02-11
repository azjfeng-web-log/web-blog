import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Card, Form, Input, Upload } from "tdesign-react";
import Button from "tdesign-react/es/button/Button";
import { CreateBlog } from "@src/common/request";

import hljs from "highlight.js";
import { GetBase64Url, getCookie } from "@src/utils/utils";
const { FormItem } = Form;
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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files1, setFiles1] = useState<any>([]);
  const [bgImg, setBgimg] = useState("");

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
      __html: highlightWithHLJS(html),
    };
  };

  async function handlerSubmit() {
    const payload = {
      title,
      description,
      content: codeValues,
      bg_url: bgImg,
      author: getCookie(document.cookie, "account"),
      avatar_url: getCookie(document.cookie, "avatar_url"),
    };
    const result = await CreateBlog(payload);

    console.log(payload, result);
  }
  async function handlerUploadImage(files) {
    if (files.length === 0) {
      setFiles1([]);
      setBgimg('');
      return;
    }
    console.log(files);
    const image = await GetBase64Url(files[0].raw);
    setBgimg(image.url);
    console.log("handlerUploadImage", image);
    setFiles1(files);
  }
  return (
    <>
      <div style={{ margin: "20px" }}>
        <Card>
          <div className="flex justify-end mb-[20px]">
            <Button theme="primary" style={{ marginRight: "4px" }}>
              预览
            </Button>
            <Button theme="primary" onClick={handlerSubmit}>
              提交
            </Button>
          </div>
          <div>
            {/* <Form> */}
            <FormItem label="标题" labelAlign="left">
              <Input value={title} onChange={setTitle}></Input>
            </FormItem>
            <FormItem label="博客描述" labelAlign="left">
              <Input value={description} onChange={setDescription}></Input>
            </FormItem>
            <FormItem label="封面图" labelAlign="left">
              <Upload
                files={files1}
                onChange={handlerUploadImage}
                theme="image"
                accept="image/*"
                autoUpload={false}
                locale={{
                  triggerUploadText: {
                    image: "请选择图片",
                  },
                }}
              />
              {/* <Input value={bgImg} onChange={setBgimg}></Input> */}
            </FormItem>
            {/* </Form> */}
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
            className="t_code_block_preview ql-editor"
            dangerouslySetInnerHTML={createMarkup(previewData)}
          />
        </Card>
      </div>
    </>
  );
}
