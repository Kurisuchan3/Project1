import React, { useState, useEffect } from 'react';
import "./../../../sass/components/ProdModal.scss";
import { IconStarFilled } from '@tabler/icons-react';

const ProdModal = ({ product, onClose, addToCart }) => {
  if (!product) return null;

  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const stockQuantity = product.inventory?.stock_quantity || 0;

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          console.error('No token found. Please login.');
          return;
        }

        const response = await fetch(`/api/ratings/product/${product.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch ratings: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setReviews(data.data);
          const totalRating = data.data.reduce((sum, review) => sum + review.rating, 0);
          const avg = data.data.length > 0 ? totalRating / data.data.length : 0;
          setAverageRating(Math.round(avg * 10) / 10); // Round to 1 decimal place
        }
      } catch (err) {
        console.error('Fetch Error:', err);
      }
    };

    fetchRatings();
  }, [product.id]);

  const handleIncrement = () => {
    if (quantity < stockQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating); // Number of full stars
    const fractionalPart = rating - fullStars; // Decimal part for partial star
    const hasPartialStar = fractionalPart > 0;

    return (
      <div className="lapnix-rating-stars">
        {[...Array(5)].map((_, index) => {
          let starClass = 'lapnix-empty';
          let fillPercentage = 0;

          if (index < fullStars) {
            starClass = 'lapnix-filled';
            fillPercentage = 100;
          } else if (index === fullStars && hasPartialStar) {
            starClass = 'lapnix-partial';
            fillPercentage = Math.round(fractionalPart * 100); // Convert to percentage
          }

          return (
            <div key={index} className={`lapnix-star-wrapper ${starClass}`} style={{ '--fill-percentage': `${fillPercentage}%` }}>
              <IconStarFilled size={18} />
            </div>
          );
        })}
      </div>
    );
  };

  const specsArray = product.specifications && typeof product.specifications === 'string'
    ? product.specifications.split(',').map(item => item.trim())
    : [];
  const specs = {
    processor: specsArray[0] || 'N/A',
    ram: specsArray[1] || 'N/A',
    storage: specsArray[2] || 'N/A',
    display: specsArray[3] || 'N/A',
    graphics: specsArray[4] || 'N/A'
  };

  return (
    <div className="lapnix-product-modal-overlay" onClick={onClose}>
      <div className="lapnix-product-modal" onClick={(e) => e.stopPropagation()}>
        <button className="lapnix-modal-close-btn" onClick={onClose}>
          ×
        </button>
        
        <div className="lapnix-modal-content">
          <div className="lapnix-product-header">
            <div className="lapnix-product-image-container">
              <img src={product.image} alt={product.name} />
            </div>
            
            <div className="lapnix-product-basic-info">
              <h1 className="lapnix-product-name">{product.name}</h1>
              
              <div className="lapnix-product-rating">
                {renderStars(averageRating || 4)}
                <span className="lapnix-rating-count">{averageRating ? `${averageRating} (${reviews.length} reviews)` : '0 (0 reviews)'}</span>
              </div>
              
              <div className="lapnix-price-section">
                <span className="lapnix-current-price">
                  ₱{parseFloat(product.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="lapnix-availability-section">
                <span className="lapnix-availability-label">Availability: </span>
                <span className="lapnix-availability-value">
                  {stockQuantity > 0 ? `${stockQuantity} in stock` : 'Out of stock'}
                </span>
              </div>

              <div className="lapnix-quantity-selector">
                <span className="lapnix-quantity-label">Quantity: </span>
                <button
                  className="lapnix-quantity-btn"
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="lapnix-quantity-value">{quantity}</span>
                <button
                  className="lapnix-quantity-btn"
                  onClick={handleIncrement}
                  disabled={quantity >= stockQuantity}
                >
                  +
                </button>
              </div>
              
              <div className="lapnix-action-buttons">
                <button
                  className="lapnix-add-to-cart-btn"
                  onClick={() => addToCart({ ...product, quantity })}
                  disabled={stockQuantity === 0}
                >
                  Add to cart
                </button>
                <button
                  className="lapnix-buy-now-btn"
                  disabled={stockQuantity === 0}
                >
                  Buy now
                </button>
              </div>
            </div>
          </div>
          
          <div className="lapnix-product-details">
            {product.description && (
              <div className="lapnix-description-section">
                <h3 className="lapnix-section-title">Description</h3>
                <p className="lapnix-description-text">{product.description}</p>
              </div>
            )}

            <div className="lapnix-specs-section">
              <h3 className="lapnix-section-title">Specifications</h3>
              <div className="lapnix-specs-grid">
                <div className="lapnix-spec-item">
                  <span className="lapnix-spec-label">Processor:</span>
                  <span className="lapnix-spec-value">{specs.processor}</span>
                </div>
                <div className="lapnix-spec-item">
                  <span className="lapnix-spec-label">RAM:</span>
                  <span className="lapnix-spec-value">{specs.ram}</span>
                </div>
                <div className="lapnix-spec-item">
                  <span className="lapnix-spec-label">Storage:</span>
                  <span className="lapnix-spec-value">{specs.storage}</span>
                </div>
                <div className="lapnix-spec-item">
                  <span className="lapnix-spec-label">Display:</span>
                  <span className="lapnix-spec-value">{specs.display}</span>
                </div>
                <div className="lapnix-spec-item">
                  <span className="lapnix-spec-label">Graphics:</span>
                  <span className="lapnix-spec-value">{specs.graphics}</span>
                </div>
              </div>
            </div>
            
            <div className="lapnix-reviews-section">
              <h3 className="lapnix-section-title">Reviews and ratings</h3>
              <div className="lapnix-rating-summary">
                <span className="lapnix-average-rating">{averageRating || 0}</span>
                <div className="lapnix-rating-details">
                  {renderStars(averageRating || 0)}
                  <span className="lapnix-rating-count">Based on {reviews.length || 0} ratings</span>
                </div>
              </div>
              
              <div className="lapnix-reviews-list">
                {reviews.length > 0 ? (
                  reviews.map(review => (
                    <div key={review.id} className="lapnix-review-item">
                      <div className="lapnix-review-header">
                        <img src={review.profile_picture} alt={review.name} className="lapnix-review-avatar" />
                        <div className="lapnix-review-meta">
                          <span className="lapnix-reviewer-name">{review.name}</span>
                          <div className="lapnix-review-rating">
                            {renderStars(review.rating)}
                            <span className="lapnix-review-date">{new Date(review.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                          </div>
                        </div>
                      </div>
                      <p className="lapnix-review-text">{review.comment}</p>
                      {review.photo && (
                        <div className="lapnix-review-image-container">
                          <img src={review.photo} alt="Review" className="lapnix-review-image" />
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No reviews available for this product.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProdModal;