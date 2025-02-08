import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import router from "@src/router/router";
import { Loading } from "tdesign-react";
import { CheckLogin } from "@src/common/request";
import { useIndexStore } from "@src/store";
export default function App() {
  const isInit = useIndexStore((state) => state.isInit);
  const setIsInit = useIndexStore((state) => state.setIsInit);

  useEffect(() => {
    async function checkLogin() {
      try {
        const res = await CheckLogin("/auth/profile", {});
        console.log("checkLogin", res);
        setIsInit(true);
      } catch (error) {
        setIsInit(true);
      }
    }
    window.addEventListener("hashchange", async () => {
      await checkLogin();
    });
    checkLogin();
  }, []);
  useEffect(() => {
    if (location.hash === "#login") {
      setIsInit(true);
      return;
    }
    const timer = setTimeout(() => {
      setIsInit(true);
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [location]);
  if (isInit) {
    return <RouterProvider router={router} />;
  }
  return (
    <Loading
      loading={true}
      fullscreen
      preventScrollThrough={true}
      text="页面加载中"
    ></Loading>
  );
}
