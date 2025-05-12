import React, { useState } from "react";
import { Card, Typography, Layout } from "antd";
import AdminSideMenu from "../admin-sidemenu";
import TopNav from "../topnav";

import "../../../sass/components/_topnav.scss";
import "../../../sass/components/_admindashboard.scss";

const { Title } = Typography;
const { Content } = Layout;

// Calculate this the same way you did elsewhere:
// 44px input height + 16px padding-top + 16px padding-bottom
const NAV_HEIGHT = 76;

export default function DashboardWelcome() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="dashboard-page">
      {/* Fixed TopNav */}
      <TopNav />

      {/* Push the Ant Layout down by NAV_HEIGHT */}
      <Layout style={{ minHeight: "100vh", marginTop: NAV_HEIGHT }}>
        {/* Sidebar (collapsible) */}
        <AdminSideMenu collapsed={collapsed} onCollapse={setCollapsed} />

        {/* Main content shifts right when sidebar collapses */}
        <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
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
    </div>
  );
}
