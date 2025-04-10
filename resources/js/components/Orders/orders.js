import React, { useState } from 'react';
import { Layout } from 'antd';
import '../../../sass/components/orders.scss';
import OrdersModal from '../OrderModal/ordersmodal';
import TopNav from '../topnav';
import AdminSideMenu from '../admin-sidemenu';

const { Content } = Layout;

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

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* TopNav spans the full width at the top */}
      <TopNav />

      {/* Nested Layout for Sidebar and Content */}
      <Layout>
        {/* Sidebar (AdminSideMenu) */}
        <AdminSideMenu />

        {/* Main Content Area */}
        <Content style={{ margin: '16px', padding: 24, background: '#fff', minHeight: 280 }}>
          <div className="orders-container">
            <h2>Orders</h2>
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Item Name</th>
                  <th>User Name</th>
                  <th>Email</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {ordersData.map((order) => (
                  <tr key={order.id} onClick={() => handleRowClick(order)}>
                    <td>
                      <img src={order.image} alt="item" className="order-image" />
                    </td>
                    <td>{order.itemName}</td>
                    <td>{order.userName}</td>
                    <td>{order.email}</td>
                    <td>
                      <span className={`status ${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Render the OrdersModal component when the modal is open */}
            {isModalOpen && selectedOrder && (
              <OrdersModal order={selectedOrder} onClose={closeModal} />
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Orders;