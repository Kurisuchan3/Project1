import React, { useState, useEffect } from 'react';
import '../../../sass/components/mypurchase.scss';
import Header from '../Header/header';
import SideMenuProfile from '../SideMenuProfile/sidemenuprofile';
import MyPurchaseModal from '../MyPurchaseModal/mypurchase_modal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyPurchase = () => {
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
          const transformedOrders = response.data.data.map(order => ({
            ...order,
            orderItems: order.order_items || [],
          }));
          setOrders(transformedOrders);
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

  const openModal = (order) => setSelectedOrder(order);
  const closeModal = () => setSelectedOrder(null);

  const getImageUrl = (imagePath) => {
    if (imagePath?.startsWith('/images/') || imagePath?.startsWith('/storage/')) {
      return `http://localhost:8000${encodeURI(imagePath)}`;
    }
    return 'https://via.placeholder.com/80';
  };

  return (
    <div className="purchases-page">
      <Header />
      <div className="purchases-layout">
        <SideMenuProfile />
        <div className="purchases-content">
          <div className="purchases-container">
            <div className="purchases-header">
              <h2>My Purchases</h2>
            </div>
            <h3>Order History</h3>
            {orders.length === 0 ? (
              <p>No purchases found.</p>
            ) : (
              orders.map(order => (
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
                      <div className="purchase-info"><p className="product-name">No Products</p></div>
                    )}
                  </div>
                  <div className="purchase-right">
                    <div className="purchase-meta">
                      <p>Order Date: {new Date(order.created_at).toLocaleDateString()}</p>
                      <p>Total: ₱{parseFloat(order.total).toLocaleString()}</p>
                    </div>
                    <div className="purchase-status">
                      <p>Status: <span className={`status-${order.status?.status_name?.toLowerCase()}`}>{order.status?.status_name || 'Unknown'}</span></p>
                    </div>
                    <button className="view-btn" onClick={() => openModal(order)}>View Details</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {selectedOrder && <MyPurchaseModal order={selectedOrder} onClose={closeModal} />}
    </div>
  );
};

export default MyPurchase;
