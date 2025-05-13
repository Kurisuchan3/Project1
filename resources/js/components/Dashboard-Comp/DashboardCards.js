import React from 'react';
import { Row, Col, Card, Typography } from 'antd';
import {
  AppstoreOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  ClockCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';

const { Text, Title } = Typography;

export default function DashboardCards() {
  const cards = [
    {
      title: 'Total Products',
      value: 25,
      change: '15%',
      up: true,
      icon: <AppstoreOutlined style={{ fontSize: 24 }} />,
    },
    {
      title: 'Total Users',
      value: 15,
      change: '6%',
      up: true,
      icon: <UserOutlined style={{ fontSize: 24 }} />,
    },
    {
      title: 'Total Orders',
      value: 10,
      change: '2%',
      up: true,
      icon: <ShoppingCartOutlined style={{ fontSize: 24 }} />,
    },
    {
      title: 'Pending Orders',
      value: 2,
      change: '1%',
      up: false,
      icon: <ClockCircleOutlined style={{ fontSize: 24 }} />,
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      {cards.map(({ title, value, change, up, icon }) => (
        <Col xs={24} sm={12} md={6} key={title}>
          <Card>
            <Row align="middle" justify="space-between">
              <Title level={5}>{title}</Title>
              {icon}
            </Row>
            <Title level={2}>{value}</Title>
            <Text style={{ color: up ? '#3f8600' : '#cf1322' }}>
              {up ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {change} from last month
            </Text>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
