import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import router from "@src/router/router";
import { Loading } from "tdesign-react";
import { getHello, login } from "@src/common/request";
export default function App() {
  const [isInit, setIsInit] = React.useState(false);
  useEffect(() => {
    async function loginUser() {
        const res = await login("/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: "john",
                password: "changeme",
            })
          });
          console.log('loginUser', res);
    }
    // loginUser();
    async function getHello2() {
      const res = await getHello("/auth/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log('getHello2', res);
      setIsInit(true);
    }
    getHello2();


  }, []);
  if (isInit) {
    return <RouterProvider router={router} />;
  }
  return (
    <Loading
      loading={true}
      fullscreen
      preventScrollThrough={true}
      text="加载中"
    ></Loading>
  );
}
