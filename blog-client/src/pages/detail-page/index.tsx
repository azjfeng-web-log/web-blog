import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useIndexStore } from "@src/store";
import ReactQuillPreview from "@src/components/ReactQuillPreview";
import { eslintCodeStyle } from "@src/utils/utils";
import { Breadcrumb, Empty } from "tdesign-react";

const { BreadcrumbItem } = Breadcrumb;

export default function DetailPage() {
  const { articleId } = useParams();
  const blogs = useIndexStore((state) => state.blogs);
  const [detail, setDetail] = useState<any>({});
  useEffect(() => {
    console.log(articleId);
    const items = blogs.filter((item) => item.link_id === articleId);
    console.log(items);
    setDetail(items[0] || {});
  }, [articleId, blogs]);
  return (
    <div className="blog-detail" style={{ margin: "20px", width: "100%" }}>
      {detail?.content ? (
        <>
          <Breadcrumb maxItemWidth="200px" style={{marginBottom: '4px', color: 'rgba(0, 0, 0, 0.9)'}}>
            <BreadcrumbItem>{detail.author}</BreadcrumbItem>
            <BreadcrumbItem>{detail.title}</BreadcrumbItem>
            <BreadcrumbItem>{detail.created_at}</BreadcrumbItem>
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
