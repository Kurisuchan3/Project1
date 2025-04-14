import React from "react";
import { Card, Typography, Layout } from "antd";
import AdminSideMenu from "../admin-sidemenu";
import TopNav from "../topnav";
import "../../../sass/components/_admindashboard.scss";

const { Title } = Typography;
const { Header, Sider, Content } = Layout;

const DashboardWelcome = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ padding: 0, background: "#008cff", position: "fixed", width: "100%", zIndex: 1000 }}>
        <TopNav />
      </Header>
      <Layout style={{ marginTop: 64 }}>
        <Sider width={200}>
          <AdminSideMenu />
        </Sider>
        <Layout>
          <Content style={{ margin: "24px 16px", padding: 24, background: "#fff", minHeight: 280 }}>
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