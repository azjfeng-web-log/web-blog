import React, { useEffect } from "react";
import { Layout, Card, Badge, Tag } from "tdesign-react";
import { useNavigate } from "react-router-dom";
import {
  TimeIcon,
  User1Icon,
} from "tdesign-icons-react";
const { Content } = Layout;

export default function Index() {
  const navigate = useNavigate();
  useEffect(() => {
    console.log("init page");
  }, []);
  function onJumpDetailPage() {
    navigate("/detail-page/123456789");
  }
  return (
    <>
      <Layout>
        <Content style={{ margin: "20px" }}>
          <Layout className="gap-[20px]" direction="horizontal">
            <Content className="flex flex-col gap-[20px]">
              <Card
                title="你好你好"
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
                style={{ width: "100%" }}
              >
                <div className="card_blog_content">
                  仅有内容区域的卡片形式。卡片内容区域可以是文字、图片、表单、表格等形式信息内容。可使用大中小不同的卡片尺寸，按业务需求进行呈现。
                </div>
                <div className="card_blog_footer flex gap-[10px] justify-end text-[12px] mt-[20px]">
                  <span className="flex gap-[4px] items-center justify-center">
                    <User1Icon />
                    jameinfeng
                  </span>
                  <span className="flex gap-[4px] items-center justify-center">
                    <TimeIcon /> 2025/02/10 10:00:00
                  </span>
                </div>
                {/* <div className="card_blog_footer flex gap-[20px] justify-end mt-[10px]">
              <Badge count={100} shape="circle" size="medium">
                <ThumbUp2Icon size={'large'}/>
              </Badge>
              <Badge count={100} shape="circle" size="medium">
                <ThumbDown2Icon size={'large'} />
              </Badge>
            </div> */}
              </Card>
              <Card
                title="你好你好"
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
                style={{ width: "100%" }}
              >
                <img
                  style={{
                    maxHeight: "200px",
                    width: "auto",
                    marginBottom: "20px",
                  }}
                  src="https://cloudcache.tencent-cloud.com/qcloud/ui/static/static_source_business/0df3469f-def3-4036-a175-2b1c1fa05746.png"
                  alt=""
                />
                <div className="card_blog_content">
                  仅有内容区域的卡片形式。卡片内容区域可以是文字、图片、表单、表格等形式信息内容。可使用大中小不同的卡片尺寸，按业务需求进行呈现。
                </div>
                <div className="card_blog_footer flex gap-[10px] justify-end text-[12px] mt-[20px]">
                  <span className="flex gap-[4px] items-center justify-center">
                    <User1Icon />
                    jameinfeng
                  </span>
                  <span className="flex gap-[4px] items-center justify-center">
                    <TimeIcon /> 2025/02/10 10:00:00
                  </span>
                </div>
                {/* <div className="card_blog_footer flex gap-[20px] justify-end mt-[10px]">
              <Badge count={100} shape="circle" size="medium">
                <ThumbUp2Icon size={'large'}/>
              </Badge>
              <Badge count={100} shape="circle" size="medium">
                <ThumbDown2Icon size={'large'} />
              </Badge>
            </div> */}
              </Card>
            </Content>
            <Content
              style={{ width: "40%" }}
              className="flex flex-col gap-[10px] bg-gray-100 p-[20px] rounded-[10px]"
            >
              <Card hoverShadow style={{ width: "100%", minHeight: "200px" }}>
                <div className="">
                  <header className="">标签云 </header>
                  <div className="bg-gray-200	rounded-[4px] flex flex-row gap-[4px] mt-[4px]">
                    <Tag
                      shape="square"
                      size="medium"
                      theme="default"
                      variant="dark"
                      className="cursor-pointer"
                    >
                      标签
                    </Tag>
                    <Tag
                      shape="square"
                      size="medium"
                      theme="default"
                      variant="dark"
                      className="cursor-pointer"
                    >
                      标签
                    </Tag>
                  </div>
                </div>
              </Card>
              <Card hoverShadow style={{ width: "100%", minHeight: "200px" }}>
                <div className="">
                  <header className="">标签云 </header>
                  <div className="bg-gray-200	rounded-[4px] flex flex-row gap-[4px] mt-[4px]">
                    <Tag
                      shape="square"
                      size="medium"
                      theme="default"
                      variant="dark"
                      className="cursor-pointer"
                    >
                      标签
                    </Tag>
                    <Tag
                      shape="square"
                      size="medium"
                      theme="default"
                      variant="dark"
                      className="cursor-pointer"
                    >
                      标签
                    </Tag>
                  </div>
                </div>
              </Card>
            </Content>
          </Layout>
        </Content>
      </Layout>
    </>
  );
}
