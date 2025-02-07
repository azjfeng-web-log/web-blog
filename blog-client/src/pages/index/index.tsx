import React, { useEffect } from "react";
import NavHeader from "@src/components/NavHeader";
import { Layout } from "tdesign-react";

export default function Index() {
  useEffect(() => {
    console.log('init page')
  }, []);
  return (
    <div>
      <Layout>
        <NavHeader></NavHeader>
      </Layout>
    </div>
  );
}
