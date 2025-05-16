import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Card, Typography, Spin } from 'antd';
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
  // users
  const [userCount, setUserCount] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // products
  const [productCount, setProductCount] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    // fetch users
    axios.get('/api/users/count')
      .then(({ data }) => setUserCount(data.count))
      .catch(console.error)
      .finally(() => setLoadingUsers(false));

    // fetch products
    axios.get('/api/products/count')
      .then(({ data }) => setProductCount(data.count))
      .catch(console.error)
      .finally(() => setLoadingProducts(false));
  }, []);

  const cards = [
    {
      title: 'Total Products',
      // show spinner until we get the count
      value: loadingProducts ? <Spin size="small" /> : productCount,
      change: '15%',
      up: true,
      icon: <AppstoreOutlined style={{ fontSize: 24 }} />,
    },
    {
      title: 'Total Users',
      value: loadingUsers ? <Spin size="small" /> : userCount,
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
