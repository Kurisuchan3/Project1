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

  useEffect(() => {
    fetchUserData();
    fetchCartCount();
    fetchAddresses();

    const handleStorageChange = () => {
      fetchUserData();
      fetchCartCount();
      fetchAddresses();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [navigate]);

  const handleLogoutClick = async () => {
    await handleLogout();
    setIsAuthenticated(false);
    setUsername('');
    setCartCount(0);
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
    navigate('/homepagecontent');
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

  const menu = (
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
          <a href="#" className="header__link" onClick={handleBrandsClick}>Brands</a>
          <a href="#" className="header__link" onClick={handlePeripheralsClick}>Peripherals</a>
          <a href="#" className="header__link">Support</a>
          <a href="#" className="header__link" onClick={handleAboutClick}>About us</a>
        </nav>
      </div>

      <div className="header__right">
        <IconSearch className="header__icon" />
        <IconBellFilled className="header__icon" />
        <div className="header__cart" onClick={handleCartClick}>
          <IconShoppingCart className="header__icon" />
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </div>
        {isAuthenticated ? (
          <div className="header__profile">
            <Dropdown overlay={menu} trigger={['click']}>
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
