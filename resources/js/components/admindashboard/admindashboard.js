import React from "react";
import { Card, Typography, Layout } from "antd";
import AdminSideMenu from "../admin-sidemenu";
import TopNav from "../topnav";

const { Title } = Typography;
const { Content } = Layout;

const DashboardWelcome = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* TopNav is now outside the main Layout so it spans full width */}
      <TopNav />
      
      {/* This Layout contains SideMenu and Content */}
      <Layout>
        <AdminSideMenu />
        <Content style={{ margin: "20px", padding: "20px", background: "#fff" }}>
          <Card style={{ textAlign: "center", margin: "20px", padding: "20px" }}>
            <Title level={2}>Welcome to Dashboard</Title>
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardWelcome;
