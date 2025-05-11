// Adm indashboard.js
import React, { useState } from "react";
import { Card, Typography, Layout } from "antd";
import AdminSideMenu from "../admin-sidemenu";
import TopNav from "../topnav";
import "../../../sass/components/_admindashboard.scss";

const { Title } = Typography;
const { Header, Content } = Layout;

export default function DashboardWelcome() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Fixed Header */}
      <Header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: 64,
          padding: 0,
          background: "#008cff",
          zIndex: 1000,
        }}
      >
        <TopNav />
      </Header>

      <Layout>
        {/* Fixed Sider under the header */}
        <AdminSideMenu
          collapsed={collapsed}
          onCollapse={setCollapsed}
        />

        {/* ← Here is the “content-wrapper” Layout ↓ */}
        <Layout
          style={{
            marginTop: 64,                   // header height
            marginLeft: collapsed ? 80 : 200 // sider width (collapsed vs open)
          }}
        >
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              background: "#fff",
              minHeight: 280,
            }}
          >
            <Card className="dashboard-card">
              <Title level={2}>Welcome to Dashboard</Title>
            </Card>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
