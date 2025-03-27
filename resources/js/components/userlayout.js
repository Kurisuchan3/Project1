import React from 'react';
import { Layout, Menu, Breadcrumb, theme } from 'antd';

const { Header, Content, Footer } = Layout;

// Sample menu items
const menuItems = Array.from({ length: 5 }).map((_, index) => ({
  key: index + 1,
  label: `Menu ${index + 1}`,
}));

const UserLayoutLandingPage = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ color: '#fff', fontWeight: 'bold', marginRight: '20px' }}>
          LAPNIX
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          items={menuItems}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>

      <Content style={{ padding: '0 48px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>Store</Breadcrumb.Item>
          <Breadcrumb.Item>Landing Page</Breadcrumb.Item>
        </Breadcrumb>

        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          <h1>Welcome to LAPNIX</h1>
          <p>Explore laptops, peripherals, and more.</p>
        </div>
      </Content>

      <Footer style={{ textAlign: 'center' }}>
        LAPNIX ©{new Date().getFullYear()} Created by YourTeam
      </Footer>
    </Layout>
  );
};

export default UserLayoutLandingPage;
