import React, { useEffect, useState } from "react";
import {
  SubmitHunyuanImageJob,
  QueryHunyuanImageJob,
} from "@src/common/request";
import { Button } from "tdesign-react";
import { sleep } from "@src/utils/utils";

export function HunYuanImage() {
    const [imageUrls, setImageUrls] = useState([]);
  //   useEffect(() => {

  //     submitHunyuanImageJob();
  //   }, []);

  async function submitHunyuanImageJob() {
    const result = await SubmitHunyuanImageJob({
      Style: "riman",
      Prompt:
        "请生成一幅画，画中的人物是美女，画中的人物穿着白色衣服，画中的人物戴着眼镜，画中的人物戴着帽子，画中的人物戴着围巾，画中的人物戴着手套，画中的人物戴着手表，画中的人物戴着口罩，画中的人物戴着耳环，画中的人物戴着项链，画中的人物戴着手链，画中的人物戴着手套，画中的人物戴着手套，画中的人物戴着手套，画中的人物戴着手套，画中的人物戴着手套，画中的人",
    });
    return result;
  }
  async function queryHunyuanImageJob(JobId: string) {
    let jobResult: any = "";
    while (!["4", "5"].includes(jobResult)) {
      const rsp: any = await QueryHunyuanImageJob({ JobId });
      jobResult = rsp?.data?.Response?.JobStatusCode;
      if (jobResult === "5") {
        const {ResultImage} = rsp?.data?.Response;
        setImageUrls(ResultImage);
        console.log("result", ResultImage);
      } else if (jobResult === "4") {
        const result = rsp?.data?.Response;
        console.log("result fail", result);
      } else {
        await sleep(500);
      }
    }
  }

  async function generateImage() {
    const result: any = await submitHunyuanImageJob();
    console.log("result", result);
    const { JobId } = result?.data?.Response;

     await queryHunyuanImageJob(JobId);

  }

  return (
    <div>
      <p>HunYuanImage</p>
      <Button onClick={generateImage}>开始生成</Button>
      {
        imageUrls.map((item: any, key: number) => {
            return <img src={item} key={key} width={400} height={400} className="object-cover" />
        })
      }
    </div>
  );
}
