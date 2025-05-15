import React, { useState, useEffect } from 'react';
import '../../../sass/components/mypurchase.scss';
import Header from '../Header/header';
import SideMenuProfile from '../SideMenuProfile/sidemenuprofile';
import MyPurchaseModal from '../MyPurchaseModal/mypurchase_modal';
import RateModal from '../RateModal/rate_modal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// MyPurchase component displays a user's order history with filtering and rating capabilities
const MyPurchase = () => {
  // State for orders, selected order for modal, rate modal, and status filter
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [rateOrder, setRateOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const navigate = useNavigate();

  // Status options based on provided table for filtering
  const statusOptions = [
    { id: 'All', name: 'All' },
    { id: 1, name: 'Pending' },
    { id: 2, name: 'Processing' },
    { id: 3, name: 'Shipped' },
    { id: 4, name: 'Delivered' },
    { id: 5, name: 'Cancelled' },
    { id: 6, name: 'Instock' },
    { id: 7, name: 'Out of stock' },
    { id: 8, name: 'Active' },
    { id: 9, name: 'Inactive' },
    { id: 10, name: 'Deactivated' },
  ];

  // Fetch orders on component mount
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
          const transformedOrders = response.data.data.map(order => ({
            ...order,
            orderItems: Array.isArray(order.order_items) ? order.order_items : [],
          }));
          // Sort: Pending (status_id === 1) first, then by created_at descending
          const sortedOrders = transformedOrders.sort((a, b) => {
            if (a.status_id === 1 && b.status_id !== 1) return -1;
            if (a.status_id !== 1 && b.status_id === 1) return 1;
            return new Date(b.created_at) - new Date(a.created_at);
          });
          setOrders(sortedOrders);
        } else {
          setOrders([]);
        }
      } catch (error) {
        if (error.response?.status === 401) {
          alert('Session expired or invalid token. Please log in again.');
          localStorage.removeItem('authToken');
          navigate('/login');
        } else {
          alert('Failed to fetch orders. Please try again later.');
        }
      }
    };
    fetchOrders();
  }, [navigate]);

  // Modal control functions
  const openModal = (order) => setSelectedOrder(order);
  const closeModal = () => setSelectedOrder(null);
  const openRateModal = (order) => setRateOrder(order);
  const closeRateModal = () => setRateOrder(null);

  // Generate image URL for product images
  const getImageUrl = (imagePath) => {
    if (imagePath?.startsWith('/images/') || imagePath?.startsWith('/storage/')) {
      return `http://localhost:8000${encodeURI(imagePath)}`;
    }
    return 'https://via.placeholder.com/80';
  };

  // Filter orders based on selected status
  const filteredOrders = statusFilter === 'All'
    ? orders
    : orders.filter(order => order.status?.status_name === statusFilter);

  return (
    <div className="purchases-page">
      <Header />
      <div className="purchases-layout">
        <SideMenuProfile />
        <div className="purchases-content">
          <div className="purchases-container">
            {/* Header section */}
            <div className="purchases-header">
              <h2>My Purchases</h2>
            </div>
            {/* Order history with filter */}
            <div className="purchases-filter-section">
              <h3>Order History</h3>
              <div className="status-filter">
                <label htmlFor="status-filter">Filter by Status:</label>
                <select
                  id="status-filter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="status-filter-select"
                  aria-label="Filter orders by status"
                >
                  {statusOptions.map(option => (
                    <option key={option.id} value={option.name}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* Order list */}
            {filteredOrders.length === 0 ? (
              <p className="no-purchases">No orders found for selected status.</p>
            ) : (
              <div className="purchases-list">
                {filteredOrders.map(order => (
                  <div className="purchase-item" key={order.id}>
                    <div className="purchase-left">
                      {order.orderItems.length > 0 ? (
                        order.orderItems.map((item, index) => (
                          <div key={index} className="purchase-item-details">
                            <div className="purchase-image">
                              <img
                                src={getImageUrl(item.product?.image)}
                                alt={item.product?.name || 'Product'}
                              />
                            </div>
                            <div className="purchase-info">
                              <p className="product-name">{item.product?.name || 'Unknown Product'}</p>
                              <p>Price: ₱{parseFloat(item.price).toLocaleString()}</p>
                              <p>Quantity: {item.quantity}</p>
                            </div>
                            {index < order.orderItems.length - 1 && <hr className="item-separator" />}
                          </div>
                        ))
                      ) : (
                        <div className="purchase-info">
                          <p className="product-name">No Products</p>
                        </div>
                      )}
                    </div>
                    <div className="purchase-right">
                      <div className="purchase-meta">
                        <p>Order Date: {new Date(order.created_at).toLocaleDateString()}</p>
                        <p>Total: ₱{parseFloat(order.total).toLocaleString()}</p>
                      </div>
                      <div className="purchase-status">
                        <p>
                          Status:{' '}
                          <span className={`status-${order.status?.status_name?.toLowerCase()}`}>
                            {order.status?.status_name || 'Unknown'}
                          </span>
                        </p>
                      </div>
                      <div className="purchase-actions">
                        <button className="view-btn" onClick={() => openModal(order)}>
                          View Details
                        </button>
                        {order.status_id === 4 && (
                          <button className="rate-btn" onClick={() => openRateModal(order)}>
                            Rate
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Modals for order details and rating */}
      {selectedOrder && <MyPurchaseModal order={selectedOrder} onClose={closeModal} />}
      {rateOrder && <RateModal order={rateOrder} onClose={closeRateModal} />}
    </div>
  );
};

export default MyPurchase;