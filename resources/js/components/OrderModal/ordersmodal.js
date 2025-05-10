import React, { useState, useEffect } from 'react';
import '../../../sass/components/ordersmodal.scss';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OrdersModal = ({ order, onClose }) => {
  const [statuses, setStatuses] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(order.status_id);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Please log in to view order details');
      navigate('/login');
      return;
    }

    const fetchStatuses = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/statuses', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          const orderStatuses = response.data.data.filter(status =>
            ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].includes(status.status_name)
          );
          setStatuses(orderStatuses);
        }
      } catch (error) {
        console.error('Error fetching statuses:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userRole');
          alert('Session expired. Please log in again.');
          navigate('/login');
        }
      }
    };

    const checkAdmin = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.user) {
          // Check roles_id (1 for admin, assuming 2 is customer)
          setIsAdmin(response.data.user.roles_id === 1);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userRole');
          alert('Session expired. Please log in again.');
          navigate('/login');
        }
      }
    };

    fetchStatuses();
    checkAdmin();
  }, [navigate]);

  const handleStatusChange = async () => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.put(`http://localhost:8000/api/orders/${order.id}/status`, {
        status_id: selectedStatus,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        alert('Status updated successfully');
        onClose();
      }
    } catch (error) {
      alert('Error updating status: ' + (error.response?.data?.message || error.message));
      if (error.response?.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        alert('Session expired. Please log in again.');
        navigate('/login');
      }
    }
  };

  return (
    <div className="orders-modal-overlay">
      <div className="orders-modal-content">
        <button className="orders-modal-close" onClick={onClose}>×</button>
        <h2 className="orders-modal-title">Order Details #{order.id}</h2>
        <div className="orders-modal-section">
          <h3>Items</h3>
          {order.orderItems.map((item) => (
            <div className="orders-modal-item" key={item.id}>
              <img src={item.product.image || '/images/tuf.svg'} alt={item.product.name} className="orders-modal-product-image" />
              <div className="orders-modal-product-info">
                <p>{item.product.name}</p>
                <p>Qty: {item.quantity}</p>
                <p>Price: ₱{item.price.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="orders-modal-section">
          <h3>Shipping Address</h3>
          <p>{order.barangay}, {order.city}, {order.province}, {order.country}</p>
        </div>
        <div className="orders-modal-section">
          <h3>Payment Method</h3>
          <p>{order.paymentDetail.payment_method === 'credit_card' ? 'Credit Card' : order.paymentDetail.payment_method === 'cod' ? 'Cash on Delivery' : 'GCash'}</p>
          {order.paymentDetail.details && (
            <div>
              {order.paymentDetail.payment_method === 'credit_card' && (
                <>
                  <p>Name on Card: {order.paymentDetail.details.nameOnCard}</p>
                  <p>Card Number: ****{order.paymentDetail.details.cardNumber.slice(-4)}</p>
                </>
              )}
              {order.paymentDetail.payment_method === 'gcash' && (
                <>
                  <p>Account Name: {order.paymentDetail.details.accountName}</p>
                  <p>Phone Number: {order.paymentDetail.details.phoneNumber}</p>
                </>
              )}
            </div>
          )}
        </div>
        <div className="orders-modal-section">
          <h3>Order Summary</h3>
          <p>Subtotal: ₱{order.subtotal.toLocaleString()}</p>
          <p>Shipping Fee: ₱{order.shipping_fee.toLocaleString()}</p>
          <p>Total: ₱{order.total.toLocaleString()}</p>
          <p>Order Date: {new Date(order.created_at).toLocaleDateString()}</p>
          <p>Status: {order.status.status_name}</p>
          {isAdmin && (
            <div className="orders-modal-status-update">
              <label htmlFor="status">Update Status:</label>
              <select
                id="status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {statuses.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.status_name}
                  </option>
                ))}
              </select>
              <button className="orders-modal-update-status" onClick={handleStatusChange}>
                Update
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersModal;