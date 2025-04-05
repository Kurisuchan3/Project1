// Updated Shop_ui.js without ads
import React from 'react';
import ShopFilter from '../ShopFilter/Shop_filter';
import ShopGrid from '../ShopGrid/Shop_grid';
import "./../../../sass/components/shop_ui.scss";
import Header from '../Header/header'; 

const Shop_ui = () => {
  return (
    <div className="shop-page">
      <Header />
      
      <div className="shop-container">
        {/* Filter Section - now centered above the grid */}
        <div className="shop-filter-container">
          <ShopFilter />
        </div>
        
        {/* Product Grid */}
        <div className="shop-grid-container">
          <ShopGrid />
        </div>
      </div>
    </div>
  );
};

export default Shop_ui;