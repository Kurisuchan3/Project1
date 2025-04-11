import React from 'react';
import "./../../../sass/components/ProdModal.scss";
import { IconStarFilled } from '@tabler/icons-react';

// Placeholder imports
import Avatar1 from '../../../../public/images/tuf.svg';
import Avatar2 from '../../../../public/images/tuf.svg';
import Avatar3 from '../../../../public/images/tuf.svg';
// Review image import (replace with your actual SVG)
import ReviewImage from '../../../../public/images/tuf.svg';

const ProdModal = ({ product, onClose }) => {
  if (!product) return null;

  const reviews = [
    {
      id: 1,
      name: "Kaan, ju",
      rating: 3,
      text: "I bought a laptop from this site and it arrived in just a few days. It runs fast and looks great. Really happy with the quality and service!",
      avatar: Avatar1,
      date: "2 weeks ago",
      hasImage: true
    },
    {
      id: 2,
      name: "Christine, Medo",
      rating: 3,
      text: "The keyboard I ordered feels really good to type on. It's quiet and comfortable. Great for both work and gaming.",
      avatar: Avatar2,
      date: "1 month ago",
      hasImage: false
    },
    {
      id: 3,
      name: "Jhon, Vand",
      rating: 3,
      text: "I needed a new mouse for my setup and found the perfect one here. It's smooth, fits well in my hand, and works great with my laptop.",
      avatar: Avatar3,
      date: "3 weeks ago",
      hasImage: false
    }
  ];

  const renderStars = (rating) => {
    return (
      <div className="lapnix-rating-stars">
        {[...Array(5)].map((_, index) => (
          <IconStarFilled 
            key={index} 
            size={18} 
            className={index < rating ? "lapnix-filled" : "lapnix-empty"} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="lapnix-product-modal-overlay" onClick={onClose}>
      <div className="lapnix-product-modal" onClick={(e) => e.stopPropagation()}>
        <button className="lapnix-modal-close-btn" onClick={onClose}>
          &times;
        </button>
        
        <div className="lapnix-modal-content">
          {/* Product Image and Basic Info */}
          <div className="lapnix-product-header">
            <div className="lapnix-product-image-container">
              <img src={product.image} alt={product.name} />
            </div>
            
            <div className="lapnix-product-basic-info">
              <h1 className="lapnix-product-name">{product.name}</h1>
              
              {/* Rating above price */}
              <div className="lapnix-product-rating">
                {renderStars(4)}
                <span className="lapnix-rating-count">4.7 (85 reviews)</span>
              </div>
              
              <div className="lapnix-price-section">
                <span className="lapnix-current-price">${product.price}</span>
                {product.originalPrice && (
                  <span className="lapnix-original-price">${product.originalPrice}</span>
                )}
              </div>
              
              <div className="lapnix-action-buttons">
                <button className="lapnix-add-to-cart-btn">Add to cart</button>
                <button className="lapnix-buy-now-btn">Buy now</button>
              </div>
            </div>
          </div>
          
          {/* Product Details and Reviews */}
          <div className="lapnix-product-details">
            {/* Specifications Section */}
            <div className="lapnix-specs-section">
              <h3 className="lapnix-section-title">Specifications</h3>
              <div className="lapnix-specs-grid">
                <div className="lapnix-spec-item">
                  <span className="lapnix-spec-label">Processor:</span>
                  <span className="lapnix-spec-value">{product.specs?.processor || 'Intel Core i7-12700H'}</span>
                </div>
                <div className="lapnix-spec-item">
                  <span className="lapnix-spec-label">RAM:</span>
                  <span className="lapnix-spec-value">{product.specs?.ram || '16GB DDR5'}</span>
                </div>
                <div className="lapnix-spec-item">
                  <span className="lapnix-spec-label">Storage:</span>
                  <span className="lapnix-spec-value">{product.specs?.storage || '1TB NVMe SSD'}</span>
                </div>
                <div className="lapnix-spec-item">
                  <span className="lapnix-spec-label">Display:</span>
                  <span className="lapnix-spec-value">{product.specs?.display || '15.6" FHD 144Hz'}</span>
                </div>
                <div className="lapnix-spec-item">
                  <span className="lapnix-spec-label">Graphics:</span>
                  <span className="lapnix-spec-value">{product.specs?.graphics || 'NVIDIA RTX 3060'}</span>
                </div>
              </div>
            </div>
            
            {/* Reviews Section */}
            <div className="lapnix-reviews-section">
              <h3 className="lapnix-section-title">Reviews and ratings</h3>
              <div className="lapnix-rating-summary">
                <span className="lapnix-average-rating">4.7</span>
                <div className="lapnix-rating-details">
                  {renderStars(4)}
                  <span className="lapnix-rating-count">Based on 85 ratings</span>
                </div>
              </div>
              
              <div className="lapnix-reviews-list">
                {reviews.map(review => (
                  <div key={review.id} className="lapnix-review-item">
                    <div className="lapnix-review-header">
                      <img src={review.avatar} alt={review.name} className="lapnix-review-avatar" />
                      <div className="lapnix-review-meta">
                        <span className="lapnix-reviewer-name">{review.name}</span>
                        <div className="lapnix-review-rating">
                          {renderStars(review.rating)}
                          <span className="lapnix-review-date">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="lapnix-review-text">{review.text}</p>
                    {review.hasImage && (
                      <div className="lapnix-review-image-container">
                        <img src={ReviewImage} alt="Review" className="lapnix-review-image" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProdModal;