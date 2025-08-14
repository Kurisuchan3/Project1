import React, { useState, useEffect } from 'react';
import "../../../sass/components/user-components/header.scss";
import { IconSearch, IconBellFilled, IconShoppingCart, IconUser } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useLogout from '../logout';
import Logo from "../../../../public/images/lapnixlogo.svg";
import { Dropdown, Menu } from 'antd';

const Header = () => {
  const navigate = useNavigate();
  const handleLogout = useLogout();
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("authToken"));
  const [username, setUsername] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);

  const fetchUserData = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setIsAuthenticated(false);
      setUsername('');
      return;
    }

    try {
      const response = await axios.get("/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success && response.data.data) {
        setUsername(response.data.data.username || '');
        if (response.data.data.roles_id) {
          localStorage.setItem('userRole', response.data.data.roles_id.toString());
        } else {
          console.warn("roles_id not found in user data:", response.data.data);
          localStorage.setItem('userRole', '2'); // Default to customer role
        }
      } else {
        console.warn("Unexpected user data structure:", response.data);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userRole");
        setIsAuthenticated(false);
        setUsername('');
        navigate('/login');
      }
    }
  };

  const fetchCartCount = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      setCartCount(guestCart.length);
      return;
    }

    try {
      const response = await axios.get("/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartCount(response.data.length || 0);
    } catch (error) {
      console.error("Failed to fetch cart:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userRole");
        setCartCount(0);
        navigate('/login');
      } else {
        setCartCount(0);
      }
    }
  };

  const fetchAddresses = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const response = await axios.get("/api/addresses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        // No need to set state here unless used elsewhere
      }
    } catch (error) {
      console.error("Error fetching address:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userRole");
        navigate('/login');
      }
    }
  };

  const fetchNotifications = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const response = await axios.get("/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Notifications response:", response.data);
      if (response.data.success) {
        setNotifications(response.data.data || []);
        setNotificationCount(response.data.data.filter(n => !n.is_read).length);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userRole");
        navigate('/login');
      }
    }
  };

  const markNotificationAsRead = async (id) => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const response = await axios.post(`/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Mark as read response:", response.data);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
      setNotificationCount(prev => Math.max(prev - 1, 0));
    } catch (error) {
      console.error("Failed to mark notification as read:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchCartCount();
    fetchAddresses();
    fetchNotifications();

    const handleStorageChange = () => {
      fetchUserData();
      fetchCartCount();
      fetchAddresses();
      fetchNotifications();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [navigate]);

  useEffect(() => {
    const handleCartCleared = () => {
      fetchCartCount();
    };

    window.addEventListener('cartCleared', handleCartCleared);
    return () => window.removeEventListener('cartCleared', handleCartCleared);
  }, []);

  const handleLogoutClick = async () => {
    await handleLogout();
    setIsAuthenticated(false);
    setUsername('');
    setCartCount(0);
    setNotifications([]);
    setNotificationCount(0);
    localStorage.removeItem('guestCart');
    navigate('/homepagecontent');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleCartClick = () => {
    navigate('/cartview');
  };

  const handleLogoClick = () => {
    const role = localStorage.getItem('userRole');
    if (role === '1') {
      navigate('/admindashboard');
    } else {
      navigate('/homepagecontent');
    }
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    navigate('/homepagecontent');
  };

  const handleBrandsClick = (e) => {
    e.preventDefault();
    navigate('/shopui?category=Brands');
  };

  const handlePeripheralsClick = (e) => {
    e.preventDefault();
    navigate('/shopui?category=Peripherals');
  };

  const handleAboutClick = (e) => {
    e.preventDefault();
    navigate('/about');
  };

  const notificationMenu = (
    <Menu
      items={
        notifications.length === 0
          ? [
              {
                key: 'no-notifications',
                label: 'No notifications',
              },
            ]
          : notifications.map(notification => ({
              key: notification.id,
              label: (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '14px', color: notification.is_read ? '#666' : '#1a1a1a', fontWeight: notification.is_read ? 'normal' : '500' }}>
                    {notification.message}
                  </span>
                  <span style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                    {new Date(notification.created_at).toLocaleString()}
                  </span>
                </div>
              ),
              onClick: () => {
                markNotificationAsRead(notification.id);
                if (notification.order_id) {
                  navigate(`/purchases`);
                }
              },
              style: {
                backgroundColor: notification.is_read ? '#fff' : '#e6f0ff',
                padding: '10px 15px',
                borderBottom: '1px solid #f0f0f0',
              },
            }))
      }
      style={{ maxHeight: '300px', overflowY: 'auto', width: '300px' }}
    />
  );

  const userMenu = (
    <Menu
      items={[
        {
          key: 'profile',
          label: 'Profile',
          onClick: handleProfileClick,
        },
        {
          key: 'logout',
          label: 'Logout',
          onClick: handleLogoutClick,
        },
      ]}
    />
  );

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo" onClick={handleLogoClick}>
          <img src={Logo} alt="Lapnix Logo" />
        </div>
        <nav className="header-nav">
          <a href="#" onClick={handleHomeClick}>Home</a>
          <a href="#" onClick={handleBrandsClick}>Brands</a>
          <a href="#" onClick={handlePeripheralsClick}>Peripherals</a>
          <a href="#" onClick={handleAboutClick}>About</a>
        </nav>
        <div className="header-actions">
          <div className="header-search">
            <IconSearch size={20} />
          </div>
          <Dropdown overlay={notificationMenu} trigger={['click']}>
            <div className="header-notification">
              <IconBellFilled size={20} />
              {notificationCount > 0 && (
                <span className="header-notification-count">{notificationCount}</span>
              )}
            </div>
          </Dropdown>
          <div className="header-cart" onClick={handleCartClick}>
            <IconShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="header-cart-count">{cartCount}</span>
            )}
          </div>
          {isAuthenticated ? (
            <Dropdown overlay={userMenu} trigger={['click']}>
              <div className="header-user">
                <IconUser size={20} />
                <span>{username}</span>
              </div>
            </Dropdown>
          ) : (
            <div className="header-user" onClick={() => navigate('/login')}>
              <IconUser size={20} />
              <span>Login</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;