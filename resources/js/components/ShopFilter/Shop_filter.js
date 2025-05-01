import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./../../../sass/components/Shop_filter.scss";

const ShopFilter = ({ onFilterChange, filteredBrand }) => {
  const [brands, setBrands] = useState([]);
  const [peripherals, setPeripherals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedPeripheral, setSelectedPeripheral] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const subcategoriesResponse = await axios.get('/api/subcategories');
        const subcategories = subcategoriesResponse.data;

        const categoriesResponse = await axios.get('/api/categories');
        const categories = categoriesResponse.data;

        const brandsCategoryId = categories.find(cat => cat.name === 'Brands')?.id;
        const peripheralsCategoryId = categories.find(cat => cat.name === 'Peripherals')?.id;

        const filteredBrands = subcategories.filter(sub => sub.category_id === brandsCategoryId);
        setBrands(filteredBrands);

        const filteredPeripherals = subcategories.filter(sub => sub.category_id === peripheralsCategoryId);
        setPeripherals(filteredPeripherals);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Initialize and sync selectedBrand/selectedPeripheral based on filteredBrand
  useEffect(() => {
    console.log('Filtered Brand in ShopFilter:', filteredBrand); // Debug log
    if (filteredBrand) {
      if (filteredBrand.type === 'category' && filteredBrand.value === 'Brands') {
        setSelectedBrand('All');
        setSelectedPeripheral(null);
        console.log('Setting selectedBrand to All for Brands'); // Debug log
      } else if (filteredBrand.type === 'category' && filteredBrand.value === 'Peripherals') {
        setSelectedPeripheral('All');
        setSelectedBrand(null);
        console.log('Setting selectedPeripheral to All for Peripherals'); // Debug log
      } else if (filteredBrand.type === 'subcategory') {
        // If a specific subcategory is selected, set the appropriate state
        if (brands.some(brand => brand.name === filteredBrand.value)) {
          setSelectedBrand(filteredBrand.value);
          setSelectedPeripheral(null);
          console.log(`Setting selectedBrand to ${filteredBrand.value}`); // Debug log
        } else if (peripherals.some(peripheral => peripheral.name === filteredBrand.value)) {
          setSelectedPeripheral(filteredBrand.value);
          setSelectedBrand(null);
          console.log(`Setting selectedPeripheral to ${filteredBrand.value}`); // Debug log
        }
      }
    }
  }, [filteredBrand, brands, peripherals]);

  const handleBrandSelect = (brand) => {
    setSelectedBrand(brand);
    setSelectedPeripheral(null);
    console.log(`Brand selected: ${brand}`); // Debug log
    if (brand === 'All') {
      onFilterChange({ type: 'category', value: 'Brands' });
    } else {
      onFilterChange({ type: 'subcategory', value: brand });
    }
  };

  const handlePeripheralSelect = (peripheral) => {
    setSelectedPeripheral(peripheral);
    setSelectedBrand(null);
    console.log(`Peripheral selected: ${peripheral}`); // Debug log
    if (peripheral === 'All') {
      onFilterChange({ type: 'category', value: 'Peripherals' });
    } else {
      onFilterChange({ type: 'subcategory', value: peripheral });
    }
  };

  return (
    <div className="shop-filter">
      <div className="filter-section">
        <h3 className="filter-title">Product Categories</h3>
      </div>

      <div className="filter-section">
        <h3 className="filter-title">Brands</h3>
        <ul className="filter-list">
          <li
            className={`filter-item ${selectedBrand === 'All' ? 'selected' : ''}`}
            onClick={() => handleBrandSelect('All')}
          >
            All
          </li>
          {loading ? (
            <p>Loading brands...</p>
          ) : (
            brands.map((brand) => (
              <li
                key={brand.id}
                className={`filter-item ${selectedBrand === brand.name ? 'selected' : ''}`}
                onClick={() => handleBrandSelect(brand.name)}
              >
                {brand.name}
              </li>
            ))
          )}
        </ul>
      </div>

      <div className="filter-section">
        <h3 className="filter-title">Peripherals</h3>
        <ul className="filter-list">
          <li
            className={`filter-item ${selectedPeripheral === 'All' ? 'selected' : ''}`}
            onClick={() => handlePeripheralSelect('All')}
          >
            All
          </li>
          {loading ? (
            <p>Loading peripherals...</p>
          ) : (
            peripherals.map((peripheral) => (
              <li
                key={peripheral.id}
                className={`filter-item ${selectedPeripheral === peripheral.name ? 'selected' : ''}`}
                onClick={() => handlePeripheralSelect(peripheral.name)}
              >
                {peripheral.name}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default ShopFilter;