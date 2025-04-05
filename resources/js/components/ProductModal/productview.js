import React from 'react';
import '../../../sass/components/product_modal.scss';

const ProductModal = ({ visible, product, onClose }) => {
  if (!visible || !product) return null;

  return (
    <div className={`product-modal ${visible ? 'visible' : ''}`}>
      <div className="product-modal-overlay" onClick={onClose}></div>
      <div className="product-modal-content">
        <button className="product-modal-close" onClick={onClose}>×</button>
        <div className="product-modal-image">
          {product.image ? (
            <img
              alt={product.name}
              src={window.location.origin + product.image}
              style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ height: '300px', backgroundColor: '#f0f0f0' }} />
          )}
        </div>
        <div className="product-modal-details">
          <h2>{product.name}</h2>
          <p className="price">₱{parseFloat(product.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          <p className="description">{product.description || 'No description available.'}</p>
          <ul className="specs">
            {/* Placeholder specs; replace with actual data if available */}
            <li>Intel Core i5-1235U</li>
            <li>8GB DDR4 RAM</li>
            <li>512GB SSD</li>
            <li>14-inch FHD Display</li>
            <li>Windows 11</li>
          </ul>
          <button className="add-to-cart-btn">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;