import React, { useEffect, useState } from "react";
import { FileIcon, Dashboard1Icon, MapEditIcon } from "tdesign-icons-react";
import { Menu } from "tdesign-react";
import { useNavigate } from "react-router-dom";
import { useIndexStore } from "@src/store";

const { MenuItem, SubMenu } = Menu;

const routerMap = {
  index: "/",
  "create-page": "/create-page",
  "creation-hunyuan-image": "/creation/hunyuan-image"
};

export default function NavAsideMenu() {
  const navigate = useNavigate();
  // const [menuIndex, setMenuIndex] = useState("index");
  const menuIndex = useIndexStore((state) => state.menuIndex);
  const setMenuIndex = useIndexStore((state) => state.setMenuIndex);
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const index = hash.split("/").slice(1);
      setMenuIndex(index.join('-') || "index");
    }
  }, []);
  function onChange(value: any) {
    if (value === menuIndex) {
      return;
    }
    setMenuIndex(value);
    navigate(routerMap[value]);
  }
  return (
    <div
      style={{
        background: "var(--bg-color-page)",
        borderRadius: 3,
      }}
    >
      <Menu
        expandType="normal"
        theme="light"
        onChange={onChange}
        value={menuIndex}
      >
        <MenuItem icon={<Dashboard1Icon />} value="index">
          总览
        </MenuItem>
        <MenuItem icon={<MapEditIcon />} value="create-page">
          创作页
        </MenuItem>
        <MenuItem icon={<MapEditIcon />} value="creation-hunyuan-image">
          混元生图
        </MenuItem>
        {/* <SubMenu
          icon={<MapEditIcon />}
          title={<span>资源列表</span>}
          value="1"
        >
          <MenuItem disabled value="1-1">
            <span>菜单二</span>
          </MenuItem>
        </SubMenu> */}
      </Menu>
    </div>
  );
}
