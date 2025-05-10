import React, { useState, useEffect } from 'react';
import '../../../sass/components/orders.scss';
import Header from '../Header/header';
import OrdersModal from '../OrderModal/ordersmodal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Please log in to view orders');
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:8000/api/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setOrders(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userRole');
          alert('Session expired. Please log in again.');
          navigate('/login');
        }
      }
    };
    fetchOrders();
  }, [navigate]);

  const openModal = (order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="orders-wrapper">
      <Header />
      <div className="orders-content">
        <h1 className="orders-title">All Orders</h1>
        <div className="orders-list">
          {orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            orders.map((order) => (
              <div className="orders-item" key={order.id}>
                <div className="orders-info">
                  <p>Order #{order.id}</p>
                  <p>User ID: {order.user_id}</p>
                  <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>
                  <p>Total: ₱{order.total.toLocaleString()}</p>
                  <p>Status: {order.status.status_name}</p>
                </div>
                <button className="orders-view-details" onClick={() => openModal(order)}>
                  View Details
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      {selectedOrder && <OrdersModal order={selectedOrder} onClose={closeModal} />}
    </div>
  );
};

export default Orders;