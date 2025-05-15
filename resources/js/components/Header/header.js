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
      if (response.data.success) {
        setUsername(response.data.data.username);
        localStorage.setItem('userRole', response.data.data.role_id.toString());
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
      if (response.data.success) {
        setNotifications(response.data.data);
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
      await axios.post(`/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
      setNotificationCount(prev => prev - 1);
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

  const handleAboutClick = (e) => {
    e.preventDefault();
    navigate('/about');
  };

  const notificationMenu = (
    <Menu style={{ maxHeight: '300px', overflowY: 'auto' }}>
      {notifications.length === 0 ? (
        <Menu.Item key="no-notifications">
          No notifications
        </Menu.Item>
      ) : (
        notifications.map(notification => (
          <Menu.Item
            key={notification.id}
            onClick={() => {
              markNotificationAsRead(notification.id);
              if (notification.order_id) {
                navigate(`/purchases`);
              }
            }}
            style={{ backgroundColor: notification.is_read ? '#fff' : '#f0f0f0' }}
          >
            <div>
              <span>{notification.message}</span>
              <br />
              <small>{new Date(notification.created_at).toLocaleString()}</small>
            </div>
          </Menu.Item>
        ))
      )}
    </Menu>
  );

  const profileMenu = (
    <Menu>
      <Menu.Item key="profile" onClick={handleProfileClick}>
        Profile
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogoutClick}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <header className="header">
      <div className="header__left">
        <img
          src={Logo}
          alt="Lapnix Logo"
          className="header__logo"
          onClick={handleLogoClick}
          style={{ cursor: 'pointer' }}
        />
        <nav className="header__nav">
          <a href="#" className="header__link" onClick={handleHomeClick}>Home</a>
          <a href="#" className="header__link" onClick={handleBrandsClick}>Shop</a>
          <a href="#" className="header__link">Support</a>
          <a href="#" className="header__link" onClick={handleAboutClick}>About us</a>
        </nav>
      </div>

      <div className="header__right">
        <IconSearch className="header__icon" />
        <div className="header__notifications">
          <Dropdown overlay={notificationMenu} trigger={['click']}>
            <div className="header__notification-toggle">
              <IconBellFilled className="header__icon" />
              {notificationCount > 0 && (
                <span className="notification-count">{notificationCount}</span>
              )}
            </div>
          </Dropdown>
        </div>
        <div className="header__cart" onClick={handleCartClick}>
          <IconShoppingCart className="header__icon" />
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </div>
        {isAuthenticated ? (
          <div className="header__profile">
            <Dropdown overlay={profileMenu} trigger={['click']}>
              <div className="header__profile-toggle">
                <IconUser className="header__icon" />
                <span className="header__username">{username || 'User'}</span>
              </div>
            </Dropdown>
          </div>
        ) : (
          <button className="header__login-btn" onClick={() => navigate('/login')}>
            Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;