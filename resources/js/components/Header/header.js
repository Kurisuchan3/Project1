import React, { useState, useEffect } from 'react';
import "../../../sass/components/user-components/header.scss";
import { IconSearch, IconBellFilled, IconShoppingCart, IconUser } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useLogout from '../logout';
import Logo from "../../../../public/images/lapnixlogo.svg";

const Header = () => {
  const navigate = useNavigate();
  const handleLogout = useLogout();
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("authToken"));
  const [username, setUsername] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Navigate handlers
  const handleLogoClick = () => navigate('/homepagecontent');
  const handleHomeClick = e => { e.preventDefault(); navigate('/homepagecontent'); };
  const handleShopClick = e => { e.preventDefault(); navigate('/shopui'); };
  const handleAboutClick = e => { e.preventDefault(); navigate('/about'); };
  // (Optional) you can add support handler if you have a /support route:
  // const handleSupportClick = e => { e.preventDefault(); navigate('/support'); };

  const fetchUserData = () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
      axios
        .get("/api/user", { headers: { Authorization: token } })
        .then(res => setUsername(res.data.user.username))
        .catch(() => {
          localStorage.removeItem("authToken");
          localStorage.removeItem("userRole");
          setIsAuthenticated(false);
          setUsername('');
        });
    } else {
      setIsAuthenticated(false);
      setUsername('');
    }
  };

  const fetchCartCount = () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      axios
        .get("/api/cart", { headers: { Authorization: token } })
        .then(res => setCartCount(res.data.length))
        .catch(() => setCartCount(0));
    } else {
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      setCartCount(guestCart.length);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchCartCount();
    const onStorage = () => { fetchUserData(); fetchCartCount(); };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleLogoutClick = async () => {
    setDropdownOpen(false);
    await handleLogout();
    localStorage.removeItem('guestCart');
    setIsAuthenticated(false);
    setUsername('');
    setCartCount(0);
    navigate('/homepagecontent');
  };

  const toggleDropdown = () => setDropdownOpen(open => !open);
  const handleProfileClick = () => { setDropdownOpen(false); navigate('/profile'); };
  const handleCartClick = () => navigate('/cartview');

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
          <a href="#" className="header__link" onClick={handleShopClick}>Brands</a>
          <a href="#" className="header__link" onClick={handleShopClick}>Peripherals</a>
          <a href="#" className="header__link" /*onClick={handleSupportClick}*/>Support</a>
          <a href="#" className="header__link" onClick={handleAboutClick}>About Us</a>
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
            <div className="header__profile-toggle" onClick={toggleDropdown}>
              <IconUser className="header__icon" />
              <span className="header__username">{username || 'User'}</span>
            </div>
            {dropdownOpen && (
              <div className="header__dropdown">
                <button className="header__dropdown-item" onClick={handleProfileClick}>
                  Profile
                </button>
                <button className="header__dropdown-item" onClick={handleLogoutClick}>
                  Logout
                </button>
              </div>
            )}
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
