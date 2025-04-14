import React, { useState } from 'react';
import { Layout, Table } from 'antd';
import '../../../sass/components/orders.scss';
import OrdersModal from '../OrderModal/ordersmodal';
import TopNav from '../topnav';
import AdminSideMenu from '../admin-sidemenu';

const { Header, Sider, Content } = Layout;

const Orders = () => {
  const ordersData = [
    {
      id: 1,
      image: '/images/tuf.svg',
      itemName: 'ACER NITRO LAPTOP 15',
      userName: 'Christian Pearl M.',
      lastName: 'Ebit',
      email: 'kurtchris123@gmail.com',
      phone: '(+63) 977 818 6065',
      address: 'P-1, Bray. Brongao, Butuan City, Agusan Del Norte',
      country: 'Philippines',
      paymentMethod: 'Cash on Delivery',
      subtotal: '30,050',
      total: '30,050',
      status: 'Completed',
    },
    {
      id: 2,
      image: '/images/tuf.svg',
      itemName: 'Item 2',
      userName: 'Jane Doe',
      lastName: 'Ebit',
      email: 'example@gmail.com',
      phone: '(+63) 380-1801',
      address: 'P-1, Bray. Brongao, Butuan City, Agusan Del Norte',
      country: 'Philippines',
      paymentMethod: 'Pay on Arrival',
      subtotal: '30,050',
      total: '30,050',
      status: 'Completed',
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleRowClick = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <img src={image} alt="item" style={{ width: 50, height: "auto" }} />
      ),
    },
    { title: "Item Name", dataIndex: "itemName", key: "itemName" },
    { title: "User Name", dataIndex: "userName", key: "userName" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span className={`status ${status.toLowerCase()}`}>{status}</span>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ padding: 0, background: "#008cff", position: "fixed", width: "100%", zIndex: 1000 }}>
        <TopNav />
      </Header>
      <Layout style={{ marginTop: 64 }}>
        <Sider width={200}>
          <AdminSideMenu />
        </Sider>
        <Layout>
          <Content style={{ margin: "24px 16px", padding: 24, background: "#fff", minHeight: 280 }}>
            <div className="orders-container">
              <h2>Orders</h2>
              <Table
                columns={columns}
                dataSource={ordersData}
                pagination={{ pageSize: 5 }}
                onRow={(record) => ({
                  onClick: () => handleRowClick(record),
                })}
              />

              {isModalOpen && selectedOrder && (
                <OrdersModal order={selectedOrder} onClose={closeModal} />
              )}
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Orders;