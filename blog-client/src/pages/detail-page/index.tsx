import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function DetailPage() {
  const { articleId } = useParams();
  const [pageId, setPageId] = useState<string>("");
  useEffect(() => {
    const pageID = articleId.split("=")[1];
    setPageId(pageID);
    console.log(articleId, pageID);
  }, []);
  return <>detail page {pageId}</>;
}
