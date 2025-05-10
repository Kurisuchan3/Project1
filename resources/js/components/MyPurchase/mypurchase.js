import React, { useState, useEffect } from 'react';
import '../../../sass/components/mypurchase.scss';
import Header from '../Header/header';
import MyPurchaseModal from '../MyPurchaseModal/mypurchase_modal';
import axios from 'axios';

const MyPurchase = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Please log in to view orders');
        return;
      }

      try {
        const response = await axios.get('http://localhost:8000/api/orders', {
          headers: { Authorization: token },
        });
        if (response.data.success) {
          setOrders(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, []);

  const openModal = (order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="mypurchase-wrapper">
      <Header />
      <div className="mypurchase-content">
        <h1 className="mypurchase-title">My Purchases</h1>
        <div className="mypurchase-list">
          {orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            orders.map((order) => (
              <div className="mypurchase-item" key={order.id}>
                <div className="mypurchase-info">
                  <p>Order #{order.id}</p>
                  <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>
                  <p>Total: ₱{order.total.toLocaleString()}</p>
                  <p>Status: {order.status.status_name}</p>
                </div>
                <button className="mypurchase-view-details" onClick={() => openModal(order)}>
                  View Details
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      {selectedOrder && <MyPurchaseModal order={selectedOrder} onClose={closeModal} />}
    </div>
  );
};

export default MyPurchase;