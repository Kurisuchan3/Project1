import React from 'react';
import { Card, Typography } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

export default function DateCard() {
  return (
    <Card>
      <Title level={4}>As of Date</Title>
      <Title level={2}>{new Date().toLocaleDateString()}</Title>
      <Text>last refresh</Text> <ExclamationCircleOutlined />
    </Card>
  );
}
