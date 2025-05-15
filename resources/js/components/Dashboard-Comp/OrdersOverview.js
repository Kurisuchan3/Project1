import React, { useState, useEffect } from 'react';
import { Card, Typography, Spin } from 'antd';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import axios from 'axios';

const { Title } = Typography;

// Fallback data for all months of 2025
const fallbackData = [
  { name: 'Jan 2025', orders: 0 },
  { name: 'Feb 2025', orders: 0 },
  { name: 'Mar 2025', orders: 0 },
  { name: 'Apr 2025', orders: 0 },
  { name: 'May 2025', orders: 0 },
  { name: 'Jun 2025', orders: 0 },
  { name: 'Jul 2025', orders: 0 },
  { name: 'Aug 2025', orders: 0 },
  { name: 'Sep 2025', orders: 0 },
  { name: 'Oct 2025', orders: 0 },
  { name: 'Nov 2025', orders: 0 },
  { name: 'Dec 2025', orders: 0 },
];

export default function OrdersOverview() {
  const [chartData, setChartData] = useState(fallbackData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderStats = async () => {
      try {
        const response = await axios.get('/api/dashboard/order-stats', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setChartData(response.data.data);
      } catch (error) {
        console.error('Error fetching order stats:', error);
        setChartData(fallbackData); // Revert to fallback on error
      } finally {
        setLoading(false);
      }
    };

    fetchOrderStats();
  }, []);

  return (
    <Card style={{ marginTop: 16 }}>
      <Title level={4}>Orders Overview</Title>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin size="large" tip="Loading order stats..." />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" />
            <YAxis
              allowDecimals={false}
              domain={[1, 100]}
              ticks={[1, 20, 40, 60, 80, 100]}
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
      )}
    </Card>
  );
}