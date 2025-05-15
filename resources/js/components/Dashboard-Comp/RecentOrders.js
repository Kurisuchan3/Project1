import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Spin } from 'antd';
import axios from 'axios';

// Move str_pad outside component to avoid scope issues
const str_pad = (number, length, padString) => {
  const str = number.toString();
  return padString.repeat(Math.max(0, length - str.length)) + str;
};

const columns = [
  {
    title: 'Order ID',
    dataIndex: 'id',
    key: 'id',
    render: id => str_pad(id, 2, '0'), // Use str_pad directly
  },
  {
    title: 'Customer',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Product',
    dataIndex: 'product_name',
    key: 'product_name',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: status => {
      const color = status === 'Completed' ? 'green' : status === 'Pending' ? 'gold' : 'blue';
      return <Tag color={color}>{status}</Tag>;
    },
  },
];

// Fallback data to ensure table renders
const fallbackData = [
  {
    key: '1',
    id: 0,
    name: 'N/A',
    product_name: 'N/A',
    status: 'N/A',
  },
];

export default function RecentOrders() {
  const [data, setData] = useState(fallbackData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const source = axios.CancelToken.source();

    const fetchRecentOrders = async () => {
      try {
        const response = await axios.get('/api/dashboard/recent-orders', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          cancelToken: source.token,
        });
        if (isMounted && response.data.success) {
          setData(response.data.data.map((order, index) => ({
            key: (index + 1).toString(),
            id: order.id,
            name: order.name,
            product_name: order.product_name,
            status: order.status,
          })));
        } else if (isMounted) {
          setData(fallbackData);
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          return; // Request was canceled
        }
        console.error('Error fetching recent orders:', error);
        if (isMounted) {
          setData(fallbackData);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchRecentOrders();

    return () => {
      isMounted = false;
      source.cancel('Component unmounted');
    };
  }, []);

  return (
    <Card style={{ marginTop: 16 }}>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin size="large" tip="Loading recent orders..." />
        </div>
      ) : (
        <Table
          title={() => 'Recent Orders'}
          pagination={false}
          dataSource={data}
          columns={columns}
          bordered={false}
        />
      )}
    </Card>
  );
}