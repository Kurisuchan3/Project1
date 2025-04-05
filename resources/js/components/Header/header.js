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
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("authToken")); // Initialize based on token
  const [username, setUsername] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Function to fetch user data and update state
  const fetchUserData = () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
      axios
        .get("/api/user", { headers: { Authorization: token } })
        .then((response) => {
          setUsername(response.data.user.username); // Access nested username
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

  // Fetch user data on mount and when authToken changes
  useEffect(() => {
    fetchUserData();

    // Listen for storage changes (e.g., logout from another tab)
    const handleStorageChange = () => {
      fetchUserData();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Update state after logout
  const handleLogoutClick = async () => {
    setDropdownOpen(false);
    await handleLogout();
    setIsAuthenticated(false); // Immediately update state
    setUsername(''); // Clear username
    navigate('/homepagecontent');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleProfileClick = () => {
    setDropdownOpen(false);
    navigate('/profile');
  };

  return (
    <header className="header">
      <div className="header__left">
        <img src={Logo} alt="Logo" className="header__logo" />
        <nav className="header__nav">
          <a href="#" className="header__link">Home</a>
          <a href="#" className="header__link">Brands</a>
          <a href="#" className="header__link">Peripherals</a>
          <a href="#" className="header__link">Support</a>
          <a href="#" className="header__link">About us</a>
        </nav>
      </div>
      <div className="header__right">
        <IconSearch className="header__icon" />
        <IconBellFilled className="header__icon" />
        <IconShoppingCart className="header__icon" />
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
          <button
            className="header__login-btn"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;