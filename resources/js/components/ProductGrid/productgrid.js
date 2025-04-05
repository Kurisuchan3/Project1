import React, { useState, useEffect } from 'react';
import "../../../sass/components/productgrid.scss";
import ProductModal from '../ProductModal/productview'; // Import ProductModal
import axios from 'axios';

const Grid = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null); // For modal
  const [modalOpen, setModalOpen] = useState(false); // Modal visibility

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Render star ratings
  const renderStars = (rating) => {
    return (
      <div className="product-rating">
        {[...Array(5)].map((_, index) => (
          <span key={index} className={index < rating ? "star filled" : "star"}>
            {index < rating ? "★" : "☆"}
          </span>
        ))}
      </div>
    );
  };

  // Open modal with selected product
  const openModal = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setSelectedProduct(null);
    setModalOpen(false);
  };

  return (
    <section className="product-grid">
      <h2 className="grid-title">Explore Our Top Picks</h2>
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div className="grid-container">
          {products.map((product) => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => openModal(product)} // Click to open modal
            >
              <img
                src={product.image ? window.location.origin + product.image : '/images/placeholder.jpg'}
                alt={product.name}
                className="product-image"
              />
              <div className="product-details">
                <h3 className="product-name">{product.name}</h3>
                {renderStars(product.rating || 4)} {/* Default rating if not provided */}
                <p className="product-price">₱{parseFloat(product.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                <div className="button-container">
                  <button className="add-to-cart">add to cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ProductModal
        visible={modalOpen}
        product={selectedProduct}
        onClose={closeModal}
      />
    </section>
  );
};

export default Grid;