import React, { useState } from "react";
import { Layout, Menu, Button } from "antd";
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
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "../../sass/components/_sidemenu.scss";

const { Sider } = Layout;

const menuItems = [
  { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard", path: "/admindashboard" },
  { key: "orders", icon: <ShoppingCartOutlined />, label: "Orders", path: "/orders" },
  { key: "products", icon: <AppstoreOutlined />, label: "Products", path: "/adminproducts" },
  { key: "inventory", icon: <InboxOutlined />, label: "Inventory", path: "/inventory" },
  { key: "cancellations", icon: <CloseCircleOutlined />, label: "Cancellation Requests", path: "/cancellations" },
  { key: "users", icon: <UserOutlined />, label: "Users", path: "/usertable" },
  { key: "customers", icon: <TeamOutlined />, label: "Customers", path: "/customers" },
  { key: "reviews", icon: <StarOutlined />, label: "Reviews", path: "/reviews" },
  { key: "shop", icon: <ShopOutlined />, label: "Shop Here", path: "/shop" },
  { key: "adminsetting", icon: <SettingOutlined />, label: "Admin Setting", path: "/adminsetting" },
];

const AdminSideMenu = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleMenuClick = ({ key }) => {
    const selectedItem = menuItems.find((item) => item.key === key);
    if (selectedItem?.path) {
      navigate(selectedItem.path);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Sider
       collapsible
       collapsed={collapsed}
       onCollapse={toggleCollapsed}
       className="side-menu"
       width={200}
      style={{
         background: "#24067e",
         position: "fixed",
         top: 64,         // exactly the height of your Header
         left: 0,
         bottom: 0,
         overflowY: "auto"
       }}
     >
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["dashboard"]}
        onClick={handleMenuClick}
      >
        {menuItems.map(({ key, icon, label }) => (
          <Menu.Item key={key} icon={icon}>
            {label}
          </Menu.Item>
        ))}
      </Menu>
      <div className="logout-container">
        <Button
          type="text"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          className="logout-button"
        >
          {!collapsed && "Log Out"}
        </Button>
      </div>
    </Sider>
  );
};

export default AdminSideMenu;