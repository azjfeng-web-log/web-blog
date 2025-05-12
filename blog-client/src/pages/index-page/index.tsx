import React, { useEffect } from "react";
import { Layout, Card, Badge, Tag } from "tdesign-react";
import { useNavigate } from "react-router-dom";
import { BrowseIcon, TimeIcon, User1Icon } from "tdesign-icons-react";
import { useIndexStore } from "@src/store";
const { Content } = Layout;

export default function Index() {
  const navigate = useNavigate();
  const blogs = useIndexStore((state) => state.blogs);

  function onJumpDetailPage(id) {
    navigate(`/detail-page/${id}`);
  }
  return (
    <>
      <Layout>
        <Content style={{ margin: "20px" }}>
          <Layout className="gap-[20px]" direction="horizontal">
            <Content className="flex flex-col gap-[20px]">
              {blogs.map((item: any, key: number) => {
                return (
                  <Card
                    title={item.title}
                    actions={
                      <a
                        href={null}
                        style={{ cursor: "pointer" }}
                        onClick={() => onJumpDetailPage(item.link_id)}
                      >
                        阅读全文
                      </a>
                    }
                    hoverShadow
                    style={{ width: "100%" }}
                    key={key}
                  >
                    <img
                      style={{
                        maxHeight: "200px",
                        width: "auto",
                        marginBottom: "20px",
                      }}
                      src={item.bg_url}
                      alt=""
                    />
                    <div className="card_blog_content">{item.description}</div>
                    <div className="card_blog_footer flex gap-[10px] justify-end text-[12px] mt-[20px]">
                      <span className="flex gap-[4px] items-center justify-center">
                        <User1Icon />
                        {item.author}
                      </span>
                      <span className="flex gap-[4px] items-center justify-center">
                        <TimeIcon /> {item.created_at}
                      </span>
                      <span className="flex gap-[4px] items-center justify-center">
                        <BrowseIcon /> {item.view_num}
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
                );
              })}
            </Content>
            <Content
              style={{ width: "40%" }}
              className="flex flex-col gap-[10px] bg-gray-100 p-[20px] rounded-[10px]"
            >
              <Card hoverShadow style={{ width: "100%", minHeight: "200px" }}>
                <div>
                  <header className="">标签云 </header>
                  <div className="bg-gray-200	rounded-[4px] flex flex-row gap-[4px] mt-[4px] p-[8px]">
                    <Tag
                      shape="square"
                      size="medium"
                      theme="success"
                      variant="light"
                      className="cursor-pointer"
                    >
                      标签
                    </Tag>
                    <Tag
                      shape="square"
                      size="medium"
                      theme="success"
                      variant="light"
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
