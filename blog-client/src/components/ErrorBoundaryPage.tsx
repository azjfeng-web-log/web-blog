import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loading } from "tdesign-react";

export default function ErrorBoundaryPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 1500);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="error_boundary_page">
      <Loading
        loading={true}
        text="页面渲染失败,即将返回首页"
        size="small"
      ></Loading>
    </div>
  );
}
