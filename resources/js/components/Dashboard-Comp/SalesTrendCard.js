import React from 'react';
import { Card, Typography } from 'antd';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const { Title } = Typography;

const data = [
  { month: 'Jan', sales: 65000 },
  { month: 'Feb', sales: 30000 },
  { month: 'Mar', sales: 48000 },
  { month: 'Apr', sales: 31000 },
  { month: 'May', sales: 64000 },
  { month: 'Jun', sales: 52000 },
  { month: 'Jul', sales: 38000 },
  { month: 'Aug', sales: 55000 },
  { month: 'Sep', sales: 50000 },
  { month: 'Oct', sales: 75000 },
  { month: 'Nov', sales: 42000 },
  { month: 'Dec', sales: 60000 },
];

export default function SalesTrendChart() {
  return (
    <Card>
      <Title level={4}>Monthly Sales Trend (2025)</Title>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="sales" stroke="#1890ff" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
