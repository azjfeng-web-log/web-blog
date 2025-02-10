import React, { useEffect } from "react";
import { Layout, Card } from "tdesign-react";
import { useNavigate } from "react-router-dom";
const { Content } = Layout;

export default function Index() {
  const navigate = useNavigate();
  useEffect(() => {
    console.log("init page");
  }, []);
  function onJumpDetailPage() {
    navigate("/detail-page/articleId=123456789");
  }
  return (
    <>
      <Layout>
        <Content style={{ margin: "20px" }}>
          <Card
            title="标题"
            actions={
              <a
                href={null}
                style={{ cursor: "pointer" }}
                onClick={onJumpDetailPage}
              >
                阅读全文
              </a>
            }
            hoverShadow
            style={{ width: "400px" }}
          >
            <div className="card_blog_content">
              仅有内容区域的卡片形式。卡片内容区域可以是文字、图片、表单、表格等形式信息内容。可使用大中小不同的卡片尺寸，按业务需求进行呈现。
            </div>
            <div className="card_blog_footer flex gap-[10px] justify-end text-[12px] mt-[20px]">
              <span>author: jameinfeng</span>
              <span>time: 2025/02/10 10:00:00</span>
            </div>
          </Card>
        </Content>
      </Layout>
    </>
  );
}
