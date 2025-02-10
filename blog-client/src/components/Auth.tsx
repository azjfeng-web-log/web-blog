import { Suspense } from "react";
import NavHeader from "./NavHeader";
import NavAsideMenu from "./NavAsideMenu";
import { Layout } from "tdesign-react";
import React from "react";
const { Aside } = Layout;

export default function Auth(props: any) {
  const { children } = props;
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Layout className="is-console" style={{ height: "100%" }}>
          <NavHeader />
          <Layout style={{ height: "100%" }}>
            <Aside style={{ height: "100%" }}>
              <NavAsideMenu />
            </Aside>
            {children}
          </Layout>
        </Layout>
      </Suspense>
    </>
  );
}
