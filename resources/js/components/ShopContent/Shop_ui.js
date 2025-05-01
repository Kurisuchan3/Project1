import React, { useState, useEffect } from 'react';
import ShopFilter from '../ShopFilter/Shop_filter';
import ShopGrid from '../ShopGrid/Shop_grid';
import "./../../../sass/components/shop_ui.scss";
import Header from '../Header/header';
import { useLocation } from 'react-router-dom';

const Shop_ui = () => {
  const [filteredBrand, setFilteredBrand] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get('category');
    console.log('Category from URL:', category); // Debug log
    if (category === 'Brands') {
      setFilteredBrand({ type: 'category', value: 'Brands' });
      console.log('Setting filteredBrand to Brands'); // Debug log
    } else if (category === 'Peripherals') {
      setFilteredBrand({ type: 'category', value: 'Peripherals' });
      console.log('Setting filteredBrand to Peripherals'); // Debug log
    }
  }, [location]);

  const handleFilterChange = (filter) => {
    setFilteredBrand(filter);
    console.log('Filter changed in Shop_ui:', filter); // Debug log
  };

  return (
    <div className="shop-page">
      <Header />
      <div className="shop-container">
        <div className="shop-filter-container">
          <ShopFilter onFilterChange={handleFilterChange} filteredBrand={filteredBrand} />
        </div>
        <div className="shop-grid-container">
          <ShopGrid filteredBrand={filteredBrand} />
        </div>
      </div>
    </div>
  );
};

export default Shop_ui;