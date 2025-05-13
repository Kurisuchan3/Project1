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
  const [username, setUsername]       = useState('');
  const [cartCount, setCartCount]     = useState(0);

  // Fetch user info (and optionally store role_id if returned)
  const fetchUserData = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setIsAuthenticated(false);
      setUsername('');
      return;
    }

    try {
      const { data } = await axios.get("/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setUsername(data.data.username);
        // If API returns role_id, you can also do:
        // localStorage.setItem('userRole', data.data.role_id.toString());
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

  // Fetch cart count
  const fetchCartCount = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      setCartCount(guestCart.length);
      return;
    }

    try {
      const { data } = await axios.get("/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartCount(data.length || 0);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
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

  // (Optional) fetch addresses if you use them elsewhere
  const fetchAddresses = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;
    try {
      await axios.get("/api/addresses", {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Error fetching address:", error);
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

    // If something changes elsewhere (e.g. login/logout in another tab)
    const handleStorageChange = () => {
      fetchUserData();
      fetchCartCount();
      fetchAddresses();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [navigate]);

  // Logout → reset state + send to homepagecontent
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

  // === ROLE-BASED LOGO CLICK ===
  const handleLogoClick = () => {
    const role = localStorage.getItem('userRole');  // "1" = Admin, "2" = Customer
    if (role === '1') {
      navigate('/admindashboard');
    } else {
      navigate('/homepagecontent');
    }
  };

  // Other nav links
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
