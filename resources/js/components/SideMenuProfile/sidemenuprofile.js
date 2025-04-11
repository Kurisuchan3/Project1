import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../../sass/components/sidemenuprofile.scss';

const SideMenuProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: 'My Profile', path: '/profile' },
    { label: 'My Purchases', path: '/purchases' },
    { label: 'My Addresses', path: '/addresses' },
  ];

  const handleMenuClick = (path) => {
    if (path === '/purchases' || path === '/addresses') {
      alert('Coming soon!'); // Placeholder for future routes
    } else {
      navigate(path);
    }
  };

  return (
    <div className="side-menu">
      <ul className="side-menu__list">
        {menuItems.map((item) => (
          <li
            key={item.path}
            className={`side-menu__item ${
              location.pathname === item.path ? 'side-menu__item--active' : ''
            }`}
            onClick={() => handleMenuClick(item.path)}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideMenuProfile;