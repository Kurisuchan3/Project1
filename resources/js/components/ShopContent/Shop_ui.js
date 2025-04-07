import React, { useState } from 'react';
import ShopFilter from '../ShopFilter/Shop_filter';
import ShopGrid from '../ShopGrid/Shop_grid';
import "./../../../sass/components/shop_ui.scss";
import Header from '../Header/header';

const Shop_ui = () => {
  const [filteredBrand, setFilteredBrand] = useState(null);

  const handleFilterChange = (brand) => {
    setFilteredBrand(brand);
  };

  return (
    <div className="shop-page">
      <Header />
      <div className="shop-container">
        <div className="shop-filter-container">
          <ShopFilter onFilterChange={handleFilterChange} />
        </div>
        <div className="shop-grid-container">
          <ShopGrid filteredBrand={filteredBrand} />
        </div>
      </div>
    </div>
  );
};

export default Shop_ui;