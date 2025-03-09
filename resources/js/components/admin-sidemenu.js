import React from "react";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  InboxOutlined,
  CloseCircleOutlined,
  UserOutlined,
  TeamOutlined,
  StarOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import "../../sass/components/_sidemenu.scss";

const { Sider } = Layout;

const AdminSideMenu = () => {
  return (
    <Sider className="side-menu" collapsible>
      <Menu theme="light" mode="inline" defaultSelectedKeys={["1"]}>
        <Menu.Item key="1" icon={<DashboardOutlined />}>Dashboard</Menu.Item>
        <Menu.Item key="2" icon={<ShoppingCartOutlined />}>Orders</Menu.Item>
        <Menu.Item key="3" icon={<AppstoreOutlined />}>Products</Menu.Item>
        <Menu.Item key="4" icon={<InboxOutlined />}>Inventory</Menu.Item>
        <Menu.Item key="5" icon={<CloseCircleOutlined />}>Cancellation Requests</Menu.Item>
        <Menu.Item key="6" icon={<UserOutlined />}>Users</Menu.Item>
        <Menu.Item key="7" icon={<TeamOutlined />}>Customers</Menu.Item>
        <Menu.Item key="8" icon={<StarOutlined />}>Reviews</Menu.Item>
        <Menu.Item key="9" icon={<ShopOutlined />}>Shop Here</Menu.Item>
      </Menu>
    </Sider>
  );
};

export default AdminSideMenu;
