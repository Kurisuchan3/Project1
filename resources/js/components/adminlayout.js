import React from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import TopNav from "../components/topnav"; // ✅ Import the top navigation
import AdminSideMenu from "../components/admin-sidemenu"; // ✅ Import the sidebar
import "../../sass/components/_adminlayout.scss"; // Ensure correct styling

const { Header, Content, Sider } = Layout;

const AdminLayout = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* 🔹 Top Navigation */}
      <Header style={{ background: "#007bff", padding: 0 }}>
        <TopNav />
      </Header>

      <Layout>
        {/* 🔹 Sidebar */}
        <Sider width={250} style={{ background: "#f5f5f5" }}>
          <Menu theme="light" mode="inline" defaultSelectedKeys={["users"]}>
            <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
              <Link to="/admindashboard">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="users" icon={<UserOutlined />}>
              <Link to="/users">Users</Link>
            </Menu.Item>
            <Menu.Item key="inventory" icon={<ShoppingCartOutlined />}>
              <Link to="/inventory">Inventory</Link>
            </Menu.Item>
            <Menu.Item key="orders" icon={<FileTextOutlined />}>
              <Link to="/orders">Orders</Link>
            </Menu.Item>
            <Menu.Item key="customers" icon={<TeamOutlined />}>
              <Link to="/customers">Customers</Link>
            </Menu.Item>
          </Menu>
        </Sider>

        {/* 🔹 Content Area */}
        <Layout style={{ padding: "20px", background: "#fff" }}>
          <Content>
            <Outlet /> {/* 🔥 This will load the actual content (Users Table, Dashboard, etc.) */}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
