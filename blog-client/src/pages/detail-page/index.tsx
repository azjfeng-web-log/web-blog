import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function DetailPage() {
  const { articleId } = useParams();
  const [pageId, setPageId] = useState<string>("");
  useEffect(() => {
    setPageId(articleId);
    console.log(articleId);
  }, []);
  return <>detail page {pageId}</>;
}
