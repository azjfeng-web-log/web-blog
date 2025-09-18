import React, { useEffect, useState } from "react";
import {
  SubmitHunyuanImageJob,
  QueryHunyuanImageJob,
} from "@src/common/request";
import {
  Button,
  Card,
  Layout,
  Row,
  Col,
  Form,
  Input,
  Checkbox,
  Select,
  MessagePlugin,
  Loading,
} from "tdesign-react";
import { sleep } from "@src/utils/utils";
import FormItem from "tdesign-react/es/form/FormItem";
import CheckboxGroup from "tdesign-react/es/checkbox/CheckboxGroup";
const { Content } = Layout;

export function HunYuanImage() {
  const [imageUrls, setImageUrls] = useState([]);
  const [prompt, setPrompt] = useState(
    "请生成一幅画，画中的人物是美女，画中的人物穿着白色衣服，画中的人物戴着眼镜，画中的人物戴着帽子，画中的人物戴着围巾，画中的人物戴着手套，画中的人物戴着手表，画中的人物戴着口罩，画中的人物戴着耳环，画中的人物戴着项链，画中的人物戴着手链，画中的人物戴着手套，画中的人物戴着手套，画中的人物戴着手套，画中的人物戴着手套，画中的人物戴着手套，画中的人"
  );
  const [negativePrompt, setNegativePrompt] = useState("");
  const [style, setStyle] = useState("riman");
  const [resolution, setResolution] = useState<any>("1024:1024");
  const [secretId, setSecretId] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onChange = (value: string) => {
    setStyle(value);
  };

  async function submitHunyuanImageJob(
    params: any,
    secretId: string,
    secretKey: string
  ) {
    const result = await SubmitHunyuanImageJob(params, secretId, secretKey);
    return result;
  }
  async function queryHunyuanImageJob(JobId: string, secretId, secretKey) {
    try {
      let jobResult: any = "";
      while (!["4", "5"].includes(jobResult)) {
        const rsp: any = await QueryHunyuanImageJob(
          { JobId },
          secretId,
          secretKey
        );
        jobResult = rsp?.data?.Response?.JobStatusCode;
        if (jobResult === "5") {
          const { ResultImage } = rsp?.data?.Response;
          setImageUrls(ResultImage);
          console.log("result", ResultImage);
        } else if (jobResult === "4") {
          const JobErrorMsg = rsp?.data?.Response;
          MessagePlugin.error(JobErrorMsg, 3000);
          console.log("result fail", JobErrorMsg);
        } else {
          await sleep(500);
        }
      }
    } catch (error) {
      MessagePlugin.error("生成图片失败", 3000);
      setIsLoading(false);
    }
  }

  async function generateImage() {
    if (!prompt) {
      MessagePlugin.error("请输入提示词", 3000);
      return;
    }
    if (!secretId) {
      MessagePlugin.error("请输入secretId", 3000);
      return;
    }
    if (!secretKey) {
      MessagePlugin.error("请输入secretKey", 3000);
      return;
    }
    setIsLoading(true);
    const params = {
      Style: style,
      Prompt: prompt,
      NegativePrompt: negativePrompt,
      Resolution: resolution,
    };

    const result: any = await submitHunyuanImageJob(
      params,
      secretId,
      secretKey
    );
    const { JobId } = result?.data?.Response;
    if (!JobId) {
      MessagePlugin.error(
        result?.data?.Response?.Error?.Message || "生成失败",
        3000
      );
      return;
    }
    await queryHunyuanImageJob(JobId, secretId, secretKey);
    setIsLoading(false);
  }

  return (
    <>
      <Layout>
        <Content style={{ margin: "20px", height: "100%" }}>
          <Layout className="gap-[20px] h-full" direction="horizontal">
            <Content className="flex flex-col gap-[20px] h-full">
              <Row gutter={20} className="h-full">
                <Col span={4} className="h-full">
                  <Card className="h-full flex justify-between overflow-scroll">
                    <div className="h-full flex flex-col justify-between">
                      <Form
                        labelAlign="right"
                        layout="vertical"
                        preventSubmitDefault
                        requiredMarkPosition="left"
                        resetType="empty"
                        showErrorMessage
                      >
                        <FormItem
                          initialData={prompt}
                          label="文本描述"
                          name="prompt"
                        >
                          <Input
                            placeholder="请输入文本描述"
                            onChange={(value) => setPrompt(value)}
                          />
                        </FormItem>
                        <FormItem
                          initialData={negativePrompt}
                          label="反向提示词"
                          name="negativePrompt"
                        >
                          <Input
                            placeholder="请输入反向提示词"
                            onChange={(value) => setNegativePrompt(value)}
                          />
                        </FormItem>
                        <FormItem
                          initialData={style}
                          label="绘画风格"
                          name="style"
                        >
                          <Select
                            value={style}
                            onChange={onChange}
                            clearable
                            options={[
                              {
                                label: "日漫动画",
                                value: "riman",
                              },
                              { label: "水墨画", value: "shuimo" },
                              { label: "莫奈", value: "monai" },
                            ]}
                          />
                        </FormItem>
                        <FormItem
                          initialData={resolution}
                          label="分辨率"
                          name="resolution"
                        >
                          <Select
                            value={resolution}
                            onChange={(value) => setResolution(value)}
                            clearable
                            options={[
                              {
                                label: "768:768（1:1）",
                                value: "768:768",
                              },
                              { label: "768:1024（3:4）", value: "768:1024" },
                              { label: "1024:768（4:3）", value: "1024:768" },
                              { label: "1024:1024（1:1）", value: "1024:1024" },

                              { label: "720:1280（9:16）", value: "720:1280" },
                              { label: "1280:720（16:9）", value: "1280:720" },
                              { label: "768:1280（3:5）", value: "768:1280" },
                              { label: "1280:768（5:3）", value: "1280:768" },
                            ]}
                          />
                        </FormItem>
                        <FormItem
                          initialData={secretId}
                          label="secretId"
                          name="secretId"
                        >
                          <Input
                            placeholder="请输入secertId"
                            onChange={(value) => setSecretId(value)}
                          />
                        </FormItem>
                        <FormItem
                          initialData={secretKey}
                          label="secertKey"
                          name="secretKey"
                        >
                          <Input
                            placeholder="请输入secretKey"
                            onChange={(value) => setSecretKey(value)}
                          />
                        </FormItem>
                      </Form>
                      <Button
                        size="large"
                        onClick={generateImage}
                        disabled={isLoading}
                      >
                        开始生成
                      </Button>
                    </div>
                  </Card>
                </Col>
                <Col span={8} className="h-full">
                  <Card className="h-full flex items-center justify-center">
                    {isLoading ? (
                      <Loading
                        loading={true}
                        text="生成中..."
                        size="small"
                      ></Loading>
                    ) : (
                      <>
                        {imageUrls.map((item: any, key: number) => {
                          return (
                            <img
                              src={item}
                              key={key}
                              width={400}
                              height={400}
                              className="object-cover"
                            />
                          );
                        })}
                      </>
                    )}
                  </Card>
                </Col>
              </Row>
            </Content>
          </Layout>
        </Content>
      </Layout>
    </>
  );
}
