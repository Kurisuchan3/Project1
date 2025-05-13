import React from 'react';
import { Card, Typography } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

export default function OrdersNumberCard() {
  return (
    <Card>
      <Title level={4}>Orders Processed</Title>
      <Title level={2}>74,914</Title>
      <Text>this period</Text> <CheckCircleOutlined style={{ color: '#1890ff' }} />
    </Card>
  );
}
