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

  const fetchUserData = () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
      axios
        .get("/api/user", { headers: { Authorization: token } })
        .then((response) => {
          setUsername(response.data.user.username);
        })
        .catch((error) => {
          console.error("Failed to fetch user:", error);
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
        .then((response) => {
          const count = response.data.length;
          setCartCount(count);
        })
        .catch((error) => {
          console.error("Failed to fetch cart:", error);
          setCartCount(0);
        });
    } else {
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      const count = guestCart.length;
      setCartCount(count);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchCartCount();

    const handleStorageChange = () => {
      fetchUserData();
      fetchCartCount();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogoutClick = async () => {
    setDropdownOpen(false);
    await handleLogout();
    setIsAuthenticated(false);
    setUsername('');
    setCartCount(0);
    localStorage.removeItem('guestCart');
    navigate('/homepagecontent');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleProfileClick = () => {
    setDropdownOpen(false);
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
          <a href="#" className="header__link" onClick={handleHomeClick}>
            Home
          </a>
          <a href="#" className="header__link" onClick={handleBrandsClick}>
            Brands
          </a>
          <a href="#" className="header__link" onClick={handlePeripheralsClick}>
            Peripherals
          </a>
          <a href="#" className="header__link">
            Support
          </a>
          <a href="#" className="header__link">
            About us
          </a>
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