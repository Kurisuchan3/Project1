import React from 'react';
import { Card, Typography } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

export default function TotalSalesCard() {
  return (
    <Card>
      <Title level={4}>Total Sales</Title>
      <Title level={2}>$1,921,384.00</Title>
      <Text>vs. last month</Text> <ArrowUpOutlined style={{ color: 'green' }} />
    </Card>
  );
}
