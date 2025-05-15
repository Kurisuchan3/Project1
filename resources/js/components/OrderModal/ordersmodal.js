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

  useEffect(() => {
    console.log('Order data in modal:', order);
  }, [order]);

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

  const getImageUrl = (imagePath) => {
    if (imagePath?.startsWith('/images/') || imagePath?.startsWith('/storage/')) {
      return `http://localhost:8000${encodeURI(imagePath)}`;
    }
    return 'https://via.placeholder.com/80';
  };

  const userProfileImage = order.user?.profile?.profile_picture
    ? `http://localhost:8000/storage/${order.user.profile.profile_picture}`
    : 'https://via.placeholder.com/40';

  const paymentMethod = order.paymentDetail?.payment_method
    ? (order.paymentDetail.payment_method === 'credit_card' ? 'Credit Card' :
       order.paymentDetail.payment_method === 'cod' ? 'Cash on Delivery' :
       order.paymentDetail.payment_method === 'gcash' ? 'GCash' : 'N/A')
    : 'N/A';

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <h2 className="modal-title">Order Details #{order.id}</h2>

        <div className="modal-section">
          <h3 className="modal-section-title">Order Summary</h3>
          <div className="modal-summary">
            <img src={userProfileImage} alt="User Profile" className="modal-user-image" />
            <div className="modal-summary-details">
              <p><strong>Username:</strong> {order.user?.username || 'N/A'}</p>
              <p><strong>Phone Number:</strong> {order.user?.profile?.phone || 'N/A'}</p>
              <p><strong>Order Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
              <p><strong>Total:</strong> ₱{order.total?.toLocaleString() || 'N/A'}</p>
              <p className={`modal-status modal-status-${order.status?.status_name?.toLowerCase() || 'na'}`}>
                <strong>Status:</strong> {order.status?.status_name || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="modal-section">
          <h3 className="modal-section-title">Shipping Details</h3>
          <p><strong>Barangay:</strong> {order.barangay || 'N/A'}</p>
          <p><strong>City:</strong> {order.city || 'N/A'}</p>
          <p><strong>Province:</strong> {order.province || 'N/A'}</p>
          <p><strong>Country:</strong> {order.country || 'N/A'}</p>
          <p><strong>Order Note:</strong> {order.order_notes || 'None'}</p>
        </div>

        <div className="modal-section">
          <h3 className="modal-section-title">Payment & Status</h3>
          <p><strong>Payment Method:</strong> {paymentMethod}</p>
          {isAdmin && statuses.length > 0 && (
            <div className="modal-status-update">
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
              <button className="modal-update-button" onClick={handleStatusChange}>
                Update
              </button>
            </div>
          )}
        </div>

        <div className="modal-section">
          <h3 className="modal-section-title">Ordered Items</h3>
          {order.orderItems && order.orderItems.length > 0 ? (
            order.orderItems.map((item) => (
              <div className="modal-item" key={item.id}>
                <img src={getImageUrl(item.product?.image)} alt={item.product?.name || 'Product'} className="modal-product-image" />
                <div className="modal-product-info">
                  <p className="modal-product-name">{item.product?.name || 'N/A'}</p>
                  <p>Price: ₱{item.price?.toLocaleString() || 'N/A'}</p>
                  <p>Quantity: {item.quantity || 'N/A'}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="modal-empty">No items found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersModal;