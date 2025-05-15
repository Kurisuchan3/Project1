import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Spin } from 'antd';
import {
  AppstoreOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  ClockCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import axios from 'axios';

const { Text, Title } = Typography;

// Fallback data to ensure cards are always displayed
const fallbackCards = [
  {
    title: 'Total Products',
    value: 0,
    change: '0%',
    up: true,
    icon: <AppstoreOutlined style={{ fontSize: 24 }} />,
  },
  {
    title: 'Total Users',
    value: 0,
    change: '0%',
    up: true,
    icon: <UserOutlined style={{ fontSize: 24 }} />,
  },
  {
    title: 'Total Orders',
    value: 0,
    change: '0%',
    up: true,
    icon: <ShoppingCartOutlined style={{ fontSize: 24 }} />,
  },
  {
    title: 'Pending Orders',
    value: 0,
    change: '0%',
    up: false,
    icon: <ClockCircleOutlined style={{ fontSize: 24 }} />,
  },
];

export default function DashboardCards() {
  const [cards, setCards] = useState(fallbackCards);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/dashboard/stats', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const fetchedCards = response.data.cards.map(card => ({
          ...card,
          icon: getIcon(card.title),
        }));
        setCards(fetchedCards);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        // Keep fallback cards in case of error
        setCards(fallbackCards);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getIcon = (title) => {
    switch (title) {
      case 'Total Products':
        return <AppstoreOutlined style={{ fontSize: 24 }} />;
      case 'Total Users':
        return <UserOutlined style={{ fontSize: 24 }} />;
      case 'Total Orders':
        return <ShoppingCartOutlined style={{ fontSize: 24 }} />;
      case 'Pending Orders':
        return <ClockCircleOutlined style={{ fontSize: 24 }} />;
      default:
        return null;
    }
  };

  return (
    <Row gutter={[16, 16]}>
      {loading ? (
        <Col span={24} style={{ textAlign: 'center', padding: '20px' }}>
          <Spin size="large" tip="Loading dashboard..." />
        </Col>
      ) : (
        cards.map(({ title, value, change, up, icon }) => (
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
        ))
      )}
    </Row>
  );
}