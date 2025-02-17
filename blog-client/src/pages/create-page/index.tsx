import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Card, Form, Input, Textarea, Upload } from "tdesign-react";
import Button from "tdesign-react/es/button/Button";
import { CreateBlog, UpdateBlog, UploadFiles } from "@src/common/request";

import { getCookie, eslintCodeStyle } from "@src/utils/utils";
import ReactQuillPreview from "@src/components/ReactQuillPreview";
import { useParams } from "react-router-dom";
import { useIndexStore } from "@src/store";
const { FormItem } = Form;

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
  const { articleId } = useParams();
  const blogs = useIndexStore((state) => state.blogs);
  const [codeValues, setCodeValues] = useState("");
  const [previewData, setPreviewData] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<any>([]);
  const [bgImg, setBgimg] = useState("");
  const [oldblog, setOldblog] = useState(null);

  useEffect(() => {
    if (!articleId) {
      return;
    }
    const items = blogs.filter((item) => item.link_id === articleId);
    if (items.length === 0) {
      return;
    }
    setTitle(items[0].title);
    setDescription(items[0].description);
    setBgimg(items[0].bg_url);
    setCodeValues(items[0].content);
    setFiles([
      { name: "预览图片", status: "success", url: items[0].bg_url, raw: {} },
    ]);
    setPreviewData(eslintCodeStyle(items[0].content));
    setOldblog(items[0]);
  }, [articleId, blogs]);

  function onChange(value) {
    const result = eslintCodeStyle(value);
    setCodeValues(value);
    setPreviewData(result);
  }

  async function handlerSubmit() {
    let payload = {
      title,
      description,
      content: codeValues,
      bg_url: bgImg,
      author: getCookie(document.cookie, "account"),
      avatar_url: getCookie(document.cookie, "avatar_url"),
    };
    if (oldblog) {
      payload = {
        ...oldblog,
        ...payload,
      };
    }
    if (oldblog) {
      const result = await UpdateBlog(payload);
    } else {
      const result = await CreateBlog(payload);
    }
    const refreshBlog = new CustomEvent("refreshBlog");
    document.dispatchEvent(refreshBlog);
    console.log(payload);
  }
  async function handlerUploadImage(files) {
    if (files.length === 0) {
      setFiles([]);
      setBgimg("");
      return;
    }
    const data = new FormData();
    data.append("file", files[0].raw);
    const result: any = await UploadFiles(data);
    console.log("UploadFiles", result);
    setBgimg(result.data.url);
    setFiles(files);
  }
  return (
    <>
      <div style={{ margin: "20px", overflow: "auto" }}>
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
            <FormItem label="标题" labelAlign="left" initialData={title}>
              <div className="w-full">
                <Input value={title} onChange={setTitle}></Input>
              </div>
            </FormItem>
            <FormItem
              label="博客描述"
              labelAlign="left"
              initialData={description}
            >
              <div className="w-full">
                <Textarea
                  value={description}
                  onChange={setDescription}
                ></Textarea>
              </div>
            </FormItem>
            <FormItem label="封面图" labelAlign="left">
              <div>
                <Upload
                  files={files}
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
              </div>
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
        <div className="mt-[20px]">
          <ReactQuillPreview children={previewData}></ReactQuillPreview>
        </div>
      </div>
    </>
  );
}
