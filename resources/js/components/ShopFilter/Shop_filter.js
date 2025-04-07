import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./../../../sass/components/Shop_filter.scss";

const ShopFilter = ({ onFilterChange }) => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Laptops'); // Default to "Laptops" (All)
  const [selectedBrand, setSelectedBrand] = useState(null); // No brand selected by default
  const [selectedPeripheral, setSelectedPeripheral] = useState(null); // For peripherals
  const [brandSearch, setBrandSearch] = useState('');

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get('/api/subcategories');
        // Filter subcategories that belong to the "Brands" category
        const brandsCategory = await axios.get('/api/categories');
        const brandsCategoryId = brandsCategory.data.find(cat => cat.name === 'Brands')?.id;
        const filteredBrands = response.data.filter(sub => sub.category_id === brandsCategoryId);
        setBrands(filteredBrands);
      } catch (error) {
        console.error('Error fetching brands:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedBrand(null);
    setSelectedPeripheral(null);
    onFilterChange(null); // Show all products
  };

  // Handle brand selection
  const handleBrandSelect = (brand) => {
    setSelectedBrand(brand);
    setSelectedCategory(null);
    setSelectedPeripheral(null);
    onFilterChange(brand); // Filter by brand
  };

  // Handle peripheral selection
  const handlePeripheralSelect = (peripheral) => {
    setSelectedPeripheral(peripheral);
    setSelectedCategory(null);
    setSelectedBrand(null);
    onFilterChange(null); // For now, peripherals don't filter (static)
  };

  // Filter brands based on search input
  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(brandSearch.toLowerCase())
  );

  // Static peripherals list
  const peripherals = ['Mouse', 'Keyboard'];

  return (
    <div className="shop-filter">
      <div className="filter-section">
        <h3 className="filter-title">Product Categories</h3>
        <ul className="filter-list">
          <li
            className={`filter-item ${selectedCategory === 'Laptops' ? 'selected' : ''}`}
            onClick={() => handleCategorySelect('Laptops')}
          >
            Laptops
          </li>
        </ul>
      </div>

      <div className="filter-section">
        <h3 className="filter-title">Brands</h3>
        <input
          type="text"
          className="filter-input"
          placeholder="Search brands..."
          value={brandSearch}
          onChange={(e) => setBrandSearch(e.target.value)}
        />
        {loading ? (
          <p>Loading brands...</p>
        ) : (
          <ul className="filter-list">
            {filteredBrands.map((brand) => (
              <li
                key={brand.id}
                className={`filter-item ${selectedBrand === brand.name ? 'selected' : ''}`}
                onClick={() => handleBrandSelect(brand.name)}
              >
                {brand.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="filter-section">
        <h3 className="filter-title">Peripherals</h3>
        <ul className="filter-list">
          {peripherals.map((peripheral) => (
            <li
              key={peripheral}
              className={`filter-item ${selectedPeripheral === peripheral ? 'selected' : ''}`}
              onClick={() => handlePeripheralSelect(peripheral)}
            >
              {peripheral}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ShopFilter;