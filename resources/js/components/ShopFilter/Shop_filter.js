// Shop_filter.js
import React from 'react';
import "./../../../sass/components/Shop_filter.scss";

const ShopFilter = () => {
  return (
    <div className="shop-filter">
      <div className="filter-section">
        <h3 className="filter-title">Product Categories</h3>
        <input type="text" className="filter-input" placeholder="Search categories..." />
        <ul className="filter-list">
          <li className="filter-item">Laptops</li>
          <li className="filter-item">Keyboards</li>
          <li className="filter-item">Mice</li>
        </ul>
      </div>

      <div className="filter-section">
        <h3 className="filter-title">Brands</h3>
        <input type="text" className="filter-input" placeholder="Search brands..." />
        <ul className="filter-list">
          <li className="filter-item">ASUS</li>
          <li className="filter-item">Razer</li>
          <li className="filter-item">Acer</li>
          <li className="filter-item">MSI</li>
        </ul>
      </div>
    </div>
  );
};

export default ShopFilter;