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
          setOrders(response.data.data);
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
      <div className="orders-content" style={{ marginLeft: '200px' }}>
        <h1 className="orders-title">All Customer Orders</h1>
        <div className="orders-list">
          {orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            orders.map((order) => {
              const firstItem = order.orderItems && order.orderItems.length > 0 ? order.orderItems[0] : null;
              return (
                <div className="orders-item" key={order.id}>
                  <div className="orders-info">
                    {firstItem ? (
                      <>
                        <p>Product: {firstItem.product?.name || 'N/A'}</p>
                        <p>Price: ₱{firstItem.price.toLocaleString()}</p>
                        <p>Quantity: {firstItem.quantity}</p>
                      </>
                    ) : (
                      <p>No items in this order.</p>
                    )}
                    <p>Order Date: {new Date(order.created_at).toLocaleDateString()}</p>
                    <p>Total: ₱{order.total.toLocaleString()}</p>
                    <p>Status: {order.status?.status_name || 'N/A'}</p>
                  </div>
                  <button className="orders-view-details" onClick={() => openModal(order)}>
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