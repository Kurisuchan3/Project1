import React from 'react';
import { Card, Typography } from 'antd';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const { Title } = Typography;

// 12-month data sample — replace “orders” values with your real numbers
const data = [
  { name: 'Jan', orders:  10 },
  { name: 'Feb', orders:  25 },
  { name: 'Mar', orders:  18 },
  { name: 'Apr', orders:  30 },
  { name: 'May', orders:  45 },
  { name: 'Jun', orders:  40 },
  { name: 'Jul', orders:  22 },
  { name: 'Aug', orders:  35 },
  { name: 'Sep', orders:  48 },
  { name: 'Oct', orders:  50 },
  { name: 'Nov', orders:  28 },
  { name: 'Dec', orders:  33 },
];

export default function OrdersOverview() {
  return (
    <Card style={{ marginTop: 16 }}>
      <Title level={4}>Orders Overview</Title>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="name" />
          <YAxis 
            allowDecimals={false} 
            domain={[0, 50]}        // scale from 0 up to 50
            ticks={[0, 10, 20, 30, 40, 50]} 
          />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="orders"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorOrders)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}