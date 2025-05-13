import React from 'react';
import { Card, Table, Tag } from 'antd';

const data = [
  { key: '1', id: '02', customer: 'John Doe', product: 'Gaming Laptop', status: 'Pending' },
  { key: '2', id: '01', customer: 'Jane Smith', product: 'Headphones', status: 'Completed' },
  { key: '3', id: '03', customer: 'Bob Johnson', product: 'Mouse', status: 'Ongoing' },
];

const columns = [
  { title: 'Order ID', dataIndex: 'id', key: 'id' },
  { title: 'Customer', dataIndex: 'customer', key: 'customer' },
  { title: 'Product', dataIndex: 'product', key: 'product' },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: status => {
      const color = status === 'Completed' ? 'green' : status === 'Pending' ? 'gold' : 'blue';
      return <Tag color={color}>{status}</Tag>;
    }
  },
];

export default function RecentOrders() {
  return (
    <Card style={{ marginTop: 16 }}>
      <Table
        title={() => 'Recent Orders'}
        pagination={false}
        dataSource={data}
        columns={columns}
        bordered={false}
      />
    </Card>
  );
}
