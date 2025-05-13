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
    let isMounted = true;
    const source = axios.CancelToken.source();

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
          cancelToken: source.token,
        });
        if (isMounted && response.data.success) {
          const orderStatuses = response.data.data.filter(status =>
            ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].includes(status.status_name)
          );
          setStatuses(orderStatuses);
        }
      } catch (error) {
        if (axios.isCancel(error)) return;
        console.error('Error fetching statuses:', error);
        if (isMounted && error.response?.status === 401) {
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
          cancelToken: source.token,
        });
        if (isMounted && response.data.data) {
          setIsAdmin(response.data.data.roles_id === 1);
        }
      } catch (error) {
        if (axios.isCancel(error)) return;
        console.error('Error checking admin status:', error);
        if (isMounted && error.response?.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userRole');
          alert('Session expired. Please log in again.');
          navigate('/login');
        }
      }
    };

    fetchStatuses();
    checkAdmin();

    return () => {
      isMounted = false;
      source.cancel('Component unmounted');
    };
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
          <h3>Order Summary</h3>
          <p>Order Date: {new Date(order.created_at).toLocaleDateString()}</p>
          <p>Total: ₱{order.total.toLocaleString()}</p>
          <p>Status: {order.status?.status_name || 'N/A'}</p>
        </div>

        <div className="orders-modal-section">
          <h3>Shipping Details</h3>
          <p>Barangay: {order.barangay}</p>
          <p>City: {order.city}</p>
          <p>Province: {order.province}</p>
          <p>Country: {order.country}</p>
          <p>Order Note: {order.order_notes || 'None'}</p>
        </div>

        <div className="orders-modal-section">
          <h3>Payment & Status</h3>
          <p>Status: {order.status?.status_name || 'N/A'}</p>
          <p>Payment: {order.paymentDetail?.payment_method === 'credit_card' ? 'Credit Card' : order.paymentDetail?.payment_method === 'cod' ? 'Cash on Delivery' : order.paymentDetail?.payment_method === 'gcash' ? 'GCash' : 'N/A'}</p>
          {isAdmin && statuses.length > 0 && (
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

        <div className="orders-modal-section">
          <h3>Ordered Items</h3>
          {order.orderItems && order.orderItems.length > 0 ? (
            order.orderItems.map((item) => (
              <div className="orders-modal-item" key={item.id}>
                <img src={item.product?.image || '/images/tuf.svg'} alt={item.product?.name || 'Product'} className="orders-modal-product-image" />
                <div className="orders-modal-product-info">
                  <p>{item.product?.name || 'N/A'}</p>
                  <p>Price: ₱{item.price.toLocaleString()}</p>
                  <p>Quantity: {item.quantity}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No items found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersModal;