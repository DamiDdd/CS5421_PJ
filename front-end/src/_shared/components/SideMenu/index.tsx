import React from "react";
import { Menu } from "antd";
import s from "./s.module.scss";
import { Link, useLocation } from "react-router-dom";
import { ConsoleSqlOutlined } from "@ant-design/icons";

const SideMenu = () => {
  const location = useLocation();

  return (
    <Menu
      mode="inline"
      selectedKeys={[location.pathname]}
      selectable={true}
      className={s.sideMenu}
    >
      <Menu.Item>
        <Link to={"/"}>
          <ConsoleSqlOutlined translate={undefined} />
          <span>Competition</span>
        </Link>
      </Menu.Item>
    </Menu>
  );
};

export default SideMenu;
