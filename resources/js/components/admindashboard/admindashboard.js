import React, { useState } from 'react';
import { Layout } from 'antd';
import AdminSideMenu from '../admin-sidemenu';
import TopNav from '../topnav';
import {
  DashboardCards,
  OrdersOverview,
  RecentOrders,
} from '../Dashboard-Comp';

import '../../../sass/components/_admindashboard.scss';

const { Content } = Layout;
const NAV_HEIGHT = 76;

export default function DashboardWelcome() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="dashboard-page">
      <TopNav />
      <Layout style={{ minHeight: '100vh', marginTop: NAV_HEIGHT }}>
        <AdminSideMenu collapsed={collapsed} onCollapse={setCollapsed} />
        <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
          <Content style={{ padding: 24 }}>
            <DashboardCards />
            <OrdersOverview />
            <RecentOrders />
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}
