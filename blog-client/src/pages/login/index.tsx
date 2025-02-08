import { UseLogin } from "@src/common/request";
import React, { useEffect } from "react";
import { Form, Input, Button, MessagePlugin } from "tdesign-react";
import type { FormProps } from "tdesign-react";

import { DesktopIcon, LockOnIcon } from "tdesign-icons-react";

const { FormItem } = Form;

export default function LoginPage() {
  useEffect(() => {
    // login();
  }, []);
  async function login(params = {}) {
    const res = await UseLogin("/auth/login", params);
    console.log("loginUser", res);
    return res;
  }
  const onSubmit: FormProps["onSubmit"] = async (e: any) => {
    if (e.validateResult === true) {
      const { account, password } = e.fields;
      const result: any = await login({
        username: account,
        password,
      });
      console.log("login", result);
      if (result.status === 200) {
        window.location.href = "/";
        return;
      }
      MessagePlugin.error("登录失败");
    }
  };

  const onReset: FormProps["onReset"] = (e) => {
    MessagePlugin.info("重置成功");
  };

  return (
    <div className="page-login absolute top-0 bottom-0 left-0 right-0 bg-cover bg-center bg-no-repeat">
      <div style={{ width: 350 }} className="absolute login-form">
        <Form
          statusIcon={true}
          onSubmit={onSubmit}
          onReset={onReset}
          colon={true}
          labelWidth={0}
        >
          <FormItem name="account">
            <Input
              clearable={true}
              prefixIcon={<DesktopIcon />}
              placeholder="请输入账户名"
            />
          </FormItem>
          <FormItem name="password">
            <Input
              type="password"
              prefixIcon={<LockOnIcon />}
              clearable={true}
              placeholder="请输入密码"
            />
          </FormItem>
          <FormItem>
            <Button theme="primary" type="submit" block>
              登录
            </Button>
          </FormItem>
        </Form>
      </div>
    </div>
  );
}
