import React, { useState } from 'react';
import { Layout, Row, Col } from 'antd';
import AdminSideMenu from '../admin-sidemenu';
import TopNav from '../topnav';

import TotalSalesCard from '../Dashboard-Comp/DateCard';
import PercentageCard from '../Dashboard-Comp/OrdersNumberCard';
import OrdersNumberCard from '../Dashboard-Comp/PercentageCard';
import DateCard from '../Dashboard-Comp/SalesTrendCard';
import SalesTrendChart from '../Dashboard-Comp/TotalSalesCard';

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
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}><TotalSalesCard /></Col>
              <Col xs={24} sm={12} md={6}><PercentageCard /></Col>
              <Col xs={24} sm={12} md={6}><OrdersNumberCard /></Col>
              <Col xs={24} sm={12} md={6}><DateCard /></Col>
              <Col xs={24}><SalesTrendChart /></Col>
            </Row>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}
