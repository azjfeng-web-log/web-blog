import React, { useEffect, useState } from "react";
import { FileIcon, Dashboard1Icon, MapEditIcon } from "tdesign-icons-react";
import { Menu } from "tdesign-react";
import { useNavigate } from "react-router-dom";

const { MenuItem, SubMenu } = Menu;

const routerMap = {
  index: "/",
  "create-page": "/create-page",
};

export default function NavAsideMenu() {
  const navigate = useNavigate();
  const [menuIndex, setMenuIndex] = useState("index");
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const index = hash.split("/")[1];
      setMenuIndex(index || "index");
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
