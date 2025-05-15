import React, { useState, useEffect } from 'react';
import '../../../sass/components/orders.scss';
import TopNav from '../topnav';
import AdminSideMenu from '../admin-sidemenu';
import OrdersModal from '../OrderModal/ordersmodal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const source = axios.CancelToken.source();

    const fetchOrders = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Please log in to view orders');
        navigate('/login');
        return;
      }

      try {
        const userResponse = await axios.get('http://localhost:8000/api/user', {
          headers: { Authorization: `Bearer ${token}` },
          cancelToken: source.token,
        });

        if (isMounted) {
          if (userResponse.data.data && userResponse.data.data.roles_id === 1) {
            setIsAdmin(true);
          } else {
            alert('Access denied. Admins only.');
            navigate('/homepagecontent');
            return;
          }
        }

        const response = await axios.get('http://localhost:8000/api/admin/orders', {
          headers: { Authorization: `Bearer ${token}` },
          cancelToken: source.token,
        });

        if (isMounted && response.data.success) {
          const transformedOrders = response.data.data.map(order => ({
            ...order,
            orderItems: order.order_items || [],
            paymentDetail: order.payment_detail || {},
          }));
          setOrders(transformedOrders);
        }
      } catch (error) {
        if (axios.isCancel(error)) return;
        console.error('Error fetching orders:', error);
        if (isMounted && error.response?.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userRole');
          alert('Session expired. Please log in again.');
          navigate('/login');
        }
      }
    };

    fetchOrders();

    return () => {
      isMounted = false;
      source.cancel('Component unmounted');
    };
  }, [navigate]);

  const openModal = (order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="orders-wrapper">
      <TopNav />
      <AdminSideMenu />
      <div className="orders-content">
        <h1 className="orders-title">All Customer Orders</h1>
        <div className="orders-list">
          {orders.length === 0 ? (
            <p className="orders-empty">No orders found.</p>
          ) : (
            orders.map((order) => {
              const userProfileImage = order.user?.profile?.profile_picture
                ? `http://localhost:8000/${order.user.profile.profile_picture}`
                : 'https://via.placeholder.com/40';
              return (
                <div className="orders-card" key={order.id}>
                  <div className="orders-card-header">
                    <img src={userProfileImage} alt="User Profile" className="orders-card-image" />
                    <div className="orders-card-info">
                      <p className="orders-username">{order.user?.username || 'N/A'}</p>
                      <p className="orders-date">Order Date: {new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="orders-card-details">
                    <p className="orders-total">Total: ₱{order.total?.toLocaleString() || 'N/A'}</p>
                    <p className={`orders-status orders-status-${order.status?.status_name?.toLowerCase() || 'na'}`}>
                      Status: {order.status?.status_name || 'N/A'}
                    </p>
                  </div>
                  <button className="orders-card-button" onClick={() => openModal(order)}>
                    View Details
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
      {selectedOrder && <OrdersModal order={selectedOrder} onClose={closeModal} />}
    </div>
  );
};

export default Orders;