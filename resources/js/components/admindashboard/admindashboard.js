// C:\project-ecommerce-new\resources\js\components\admindashboard\admindashboard.js

import React, { useState } from "react";
import { Card, Typography, Layout } from "antd";
import AdminSideMenu from "../admin-sidemenu";
import TopNav from "../topnav";
import "../../../sass/components/_admindashboard.scss";

const { Title } = Typography;
const { Header, Content } = Layout;

const DashboardWelcome = () => {
  // Sidebar collapse state
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
        {/* Collapsible Sidebar */}
        <AdminSideMenu
          collapsed={collapsed}
          onCollapse={setCollapsed}
        />

        {/* Main Content Layout (adjusts based on sidebar width) */}
        <Layout
          style={{
            marginTop: 64,                     // Header height
            marginLeft: collapsed ? 80 : 200,  // Sidebar width (collapsed or not)
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
};

export default DashboardWelcome;
