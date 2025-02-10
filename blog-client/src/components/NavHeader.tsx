import React from "react";
import { Dropdown, Layout, Menu } from "tdesign-react";
import {
  SearchIcon,
  NotificationFilledIcon,
  User1Icon,
} from "tdesign-icons-react";
import { Logout } from "@src/common/request";

import { useNavigate } from "react-router-dom";
import header from '@src/assets/image/header.png';

const { HeadMenu, MenuItem } = Menu;
const { Header } = Layout;

/**
 * 用户操作列表
 */
const DropItems = [
  {
    content: "退出登录",
    value: 1,
  },
];

export default function NavHeader() {
  const navigate = useNavigate();
  async function handlerJump(data) {
    switch (data.value) {
      case 1:
        await Logout();
        break;
      default:
        break;
    }
  }
  return (
    <Layout>
      <Header>
        <HeadMenu
          value="item1"
          logo={
            <img
              src={header}
              alt="logo"
              style={{width: 'auto', height: '100%'}}
            />
          }
          operations={
            <div className="t-menu__operations">
              <SearchIcon className="t-menu__operations-icon" />
              <NotificationFilledIcon className="t-menu__operations-icon" />
              <Dropdown
                direction="right"
                hideAfterItemClick
                options={DropItems}
                placement="bottom-left"
                trigger="hover"
                onClick={(data) => handlerJump(data)}
              >
                <User1Icon className="t-menu__operations-icon" />
              </Dropdown>
            </div>
          }
        >
          {/* <MenuItem value="item1">已选内容</MenuItem>
          <MenuItem value="item2">菜单内容一</MenuItem>
          <MenuItem value="item3">菜单内容二</MenuItem>
          <MenuItem value="item4" disabled>
            菜单内容三
          </MenuItem> */}
        </HeadMenu>
      </Header>
    </Layout>
  );
}
