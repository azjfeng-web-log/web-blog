import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useIndexStore } from "@src/store";
import ReactQuillPreview from "@src/components/ReactQuillPreview";
import { eslintCodeStyle } from "@src/utils/utils";
import { Breadcrumb, Empty } from "tdesign-react";

const { BreadcrumbItem } = Breadcrumb;

export default function DetailPage() {
  const navigate = useNavigate();
  const setMenuIndex = useIndexStore((state) => state.setMenuIndex);
  const { articleId } = useParams();
  const blogs = useIndexStore((state) => state.blogs);
  const [detail, setDetail] = useState<any>({});
  useEffect(() => {
    const items = blogs.filter((item) => item.link_id === articleId);
    setDetail(items[0] || {});
  }, [articleId, blogs]);

  function handlerReCreatePage(target: string, path: string) {
    setMenuIndex(target);
    navigate(path);
  }

  return (
    <div
      className="blog-detail"
      style={{ margin: "20px", width: "100%", overflow: "auto" }}
    >
      {detail?.content ? (
        <>
          <Breadcrumb
            maxItemWidth="200px"
            style={{ marginBottom: "4px", color: "rgba(0, 0, 0, 0.9)" }}
          >
            <BreadcrumbItem
              onClick={() => handlerReCreatePage("index", '/')}
            >
              首页
            </BreadcrumbItem>
            <BreadcrumbItem>{detail.author}</BreadcrumbItem>
            <BreadcrumbItem>{detail.title}</BreadcrumbItem>
            <BreadcrumbItem>{detail.created_at}</BreadcrumbItem>
            <BreadcrumbItem
              onClick={() =>
                handlerReCreatePage(
                  "create-page",
                  `/create-page/${detail.link_id}`
                )
              }
            >
              编辑
            </BreadcrumbItem>
          </Breadcrumb>
          <ReactQuillPreview
            children={eslintCodeStyle(detail?.content || "")}
          ></ReactQuillPreview>
        </>
      ) : (
        <Empty style={{ marginTop: "50%" }} />
      )}
    </div>
  );
}
