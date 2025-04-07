import React, { useState, useEffect } from 'react';
import { IconStarFilled, IconStar } from '@tabler/icons-react';
import axios from 'axios';
import "./../../../sass/components/Shop_grid.scss";

const ShopGrid = ({ filteredBrand }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        console.log('Fetched Products:', response.data); // Debug log
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const renderStars = (rating) => {
    return (
      <div className="product-rating">
        {[...Array(5)].map((_, index) => (
          <span key={index}>
            {index < rating ? (
              <IconStarFilled className="star filled" size={16} />
            ) : (
              <IconStar className="star" size={16} />
            )}
          </span>
        ))}
      </div>
    );
  };

  // Filter products based on the selected brand
  console.log('Filtered Brand:', filteredBrand); // Debug log
  const filteredProducts = filteredBrand
    ? products.filter(product => {
        const matches = product.subcategory?.name === filteredBrand;
        console.log(`Product: ${product.name}, Subcategory: ${product.subcategory?.name}, Matches: ${matches}`); // Debug log
        return matches;
      })
    : products;

  return (
    <section className="product-grid">
      <div className="grid-container">
        {loading ? (
          <p>Loading products...</p>
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-top">
                <img
                  src={product.image ? window.location.origin + product.image : '/images/placeholder.jpg'}
                  alt={product.name}
                  className="product-image"
                />
              </div>
              <div className="product-details">
                <h3 className="product-name">{product.name}</h3>
                {renderStars(product.rating || 4)}
                <p className="product-price">₱{parseFloat(product.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                <div className="button-container">
                  <button className="add-to-cart">add to cart</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No products found for this brand.</p>
        )}
        {filteredProducts.length > 0 && (
          <>
            <div className="product-card empty"></div>
            <div className="product-card empty"></div>
            <div className="product-card empty"></div>
          </>
        )}
      </div>
    </section>
  );
};

export default ShopGrid;