import React from 'react';
import { Card, Typography } from 'antd';
import { ArrowDownOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

export default function PercentageCard() {
  return (
    <Card>
      <Title level={4}>Conversion Rate</Title>
      <Title level={2}>15%</Title>
      <Text>vs. target</Text> <ArrowDownOutlined style={{ color: 'red' }} />
    </Card>
  );
}
