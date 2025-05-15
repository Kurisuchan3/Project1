import React, { useState, useEffect, useCallback, useRef } from 'react';
import { IconStar } from '@tabler/icons-react';
import './../../../sass/components/rate_modal.scss';

const RateModal = ({ order, onClose }) => {
  const [ratings, setRatings] = useState(
    order.orderItems.map(item => ({
      product_id: item.product_id,
      rating: 0,
      hoverRating: 0,
      comment: '',
      photo: null,
      preview: null,
      error: '',
      submitting: false,
      hasRated: false,
    }))
  );
  const [userId, setUserId] = useState(null);
  const modalRef = useRef(null);
  const isMounted = useRef(true);

  useEffect(() => {
    let isActive = true;

    const fetchUserProfileAndReviews = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('No token found. Please login.');
        }

        const userResponse = await fetch('/api/user', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        if (!userResponse.ok) {
          throw new Error(`Failed to fetch user profile: ${userResponse.statusText}`);
        }

        const userData = await userResponse.json();
        if (isActive && userData.success && userData.data && userData.data.user_id) {
          setUserId(userData.data.user_id);
        } else {
          throw new Error('User data does not contain a user_id in the data object');
        }

        for (let index = 0; index < order.orderItems.length; index++) {
          const item = order.orderItems[index];
          const reviewsResponse = await fetch(`/api/ratings/product/${item.product_id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
            },
          });

          if (!reviewsResponse.ok) {
            throw new Error(`Failed to fetch reviews for product ${item.product_id}: ${reviewsResponse.statusText}`);
          }

          const reviewsData = await reviewsResponse.json();
          const orderReview = reviewsData.data.find(
            r => r.user_id === userId
          );
          if (isActive && orderReview) {
            setRatings(prev => {
              const newRatings = [...prev];
              newRatings[index] = { ...newRatings[index], hasRated: true, error: 'You have already rated this product.' };
              return newRatings;
            });
          }
        }
      } catch (err) {
        console.error('Fetch Error:', err);
        if (isActive) {
          setRatings(prev => prev.map(rating => ({ ...rating, error: err.message })));
        }
      }
    };

    fetchUserProfileAndReviews();

    return () => {
      isActive = false;
    };
  }, [order, userId]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.focus();
    }
  }, []);

  const handleRatingClick = useCallback((index, value) => {
    if (!ratings[index].hasRated) {
      setRatings(prev => {
        const newRatings = [...prev];
        newRatings[index].rating = value;
        return newRatings;
      });
    }
  }, [ratings]);

  const handleRatingHover = useCallback((index, value) => {
    if (!ratings[index].hasRated) {
      setRatings(prev => {
        const newRatings = [...prev];
        newRatings[index].hoverRating = value;
        return newRatings;
      });
    }
  }, [ratings]);

  const handleMouseLeave = useCallback((index) => {
    if (!ratings[index].hasRated) {
      setRatings(prev => {
        const newRatings = [...prev];
        newRatings[index].hoverRating = 0;
        return newRatings;
      });
    }
  }, [ratings]);

  const handleCommentChange = useCallback((index, event) => {
    if (!ratings[index].hasRated) {
      setRatings(prev => {
        const newRatings = [...prev];
        newRatings[index].comment = event.target.value;
        return newRatings;
      });
    }
  }, [ratings]);

  const handlePhotoChange = useCallback((index, event) => {
    if (!ratings[index].hasRated) {
      const file = event.target.files[0];
      setRatings(prev => {
        const newRatings = [...prev];
        if (file) {
          if (file.size > 5 * 1024 * 1024) {
            newRatings[index].error = 'File size exceeds 5MB';
            return newRatings;
          }
          if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
            newRatings[index].error = 'Only JPG, JPEG, or PNG files are allowed';
            return newRatings;
          }
          newRatings[index].photo = file;
          newRatings[index].preview = URL.createObjectURL(file);
          newRatings[index].error = '';
        } else {
          newRatings[index].photo = null;
          newRatings[index].preview = null;
          newRatings[index].error = '';
        }
        return newRatings;
      });
    }
  }, [ratings]);

  const handleRemoveImage = useCallback((index) => {
    if (!ratings[index].hasRated) {
      setRatings(prev => {
        const newRatings = [...prev];
        newRatings[index].photo = null;
        newRatings[index].preview = null;
        return newRatings;
      });
    }
  }, [ratings]);

  const resetForm = useCallback((index) => {
    setRatings(prev => {
      const newRatings = [...prev];
      newRatings[index] = {
        ...newRatings[index],
        rating: 0,
        hoverRating: 0,
        comment: '',
        photo: null,
        preview: null,
        error: '',
        submitting: false,
      };
      return newRatings;
    });
  }, []);

  const handleSubmit = useCallback(async (index, event) => {
    event.preventDefault();
    if (ratings[index].hasRated) {
      return;
    }
    if (ratings[index].rating === 0 || !userId) {
      setRatings(prev => {
        const newRatings = [...prev];
        newRatings[index].error = 'Please provide a rating and ensure you are logged in.';
        return newRatings;
      });
      return;
    }

    setRatings(prev => {
      const newRatings = [...prev];
      newRatings[index].submitting = true;
      newRatings[index].error = '';
      return newRatings;
    });

    const formData = new FormData();
    formData.append('product_id', ratings[index].product_id);
    formData.append('user_id', userId);
    formData.append('rating', ratings[index].rating);
    formData.append('comment', ratings[index].comment);
    if (ratings[index].photo) {
      formData.append('photo', ratings[index].photo);
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || JSON.stringify(errorData.errors) || 'Failed to submit rating');
      }

      const result = await response.json();
      if (result.success) {
        setRatings(prev => {
          const newRatings = [...prev];
          newRatings[index].hasRated = true;
          newRatings[index].submitting = false;
          return newRatings;
        });
        resetForm(index);
        alert(`Rating for ${order.orderItems[index].product?.name || 'product'} submitted successfully`);
        onClose();
      }
    } catch (err) {
      console.error('Submission Error:', err);
      setRatings(prev => {
        const newRatings = [...prev];
        newRatings[index].submitting = false;
        newRatings[index].error = err.message;
        return newRatings;
      });
    }
  }, [ratings, userId, order, resetForm, onClose]);

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-content" ref={modalRef} tabIndex={-1}>
        <div className="modal-header">
          <h2>Rate Order #{order.id}</h2>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        <div className="modal-body">
          {order.orderItems.length === 0 ? (
            <p className="no-items">No products to rate.</p>
          ) : (
            order.orderItems.map((item, index) => (
              <div key={item.product_id} className="product-rating-section">
                <h3 className="product-name">{item.product?.name || 'Unknown Product'}</h3>
                {ratings[index].hasRated ? (
                  <p className="rated-message" role="alert">
                    You have already rated this product.
                  </p>
                ) : (
                  <>
                    {ratings[index].error && (
                      <p className="error-message" role="alert">
                        {ratings[index].error}
                      </p>
                    )}
                    <form onSubmit={(e) => handleSubmit(index, e)}>
                      <div className="rating-section">
                        <label className="rating-label">Rating</label>
                        <div className="star-rating" role="radiogroup">
                          {[1, 2, 3, 4, 5].map((star) => {
                            const isFilled = star <= (ratings[index].hoverRating || ratings[index].rating);
                            return (
                              <span
                                key={star}
                                className={`star ${isFilled ? 'filled' : ''}`}
                                onClick={() => handleRatingClick(index, star)}
                                onMouseEnter={() => handleRatingHover(index, star)}
                                onMouseLeave={() => handleMouseLeave(index)}
                                role="radio"
                                aria-checked={ratings[index].rating === star}
                                tabIndex={0}
                              >
                                <IconStar
                                  size={28}
                                  fill={isFilled ? '#FF0000' : 'none'}
                                  stroke={isFilled ? '#FF0000' : '#ccc'}
                                />
                              </span>
                            );
                          })}
                        </div>
                      </div>
                      <div className="review-section">
                        <label htmlFor={`review-${index}`} className="review-label">
                          Your Review
                        </label>
                        <textarea
                          id={`review-${index}`}
                          value={ratings[index].comment}
                          onChange={(e) => handleCommentChange(index, e)}
                          placeholder="Share your thoughts about the product..."
                          rows="4"
                          maxLength={500}
                          aria-describedby={`char-count-${index}`}
                        />
                        <p id={`char-count-${index}`} className="char-count">
                          {ratings[index].comment.length}/500
                        </p>
                      </div>
                      <div className="photo-section">
                        <label htmlFor={`photo-${index}`} className="photo-label">
                          Upload Photo (optional, max 5MB)
                        </label>
                        <input
                          type="file"
                          id={`photo-${index}`}
                          accept="image/jpeg,image/jpg,image/png"
                          onChange={(e) => handlePhotoChange(index, e)}
                          className="photo-input"
                        />
                        {ratings[index].preview && (
                          <div className="photo-preview-container">
                            <div className="photo-preview">
                              <img
                                src={ratings[index].preview}
                                alt={`Preview for ${item.product?.name || 'product'}`}
                              />
                              <button
                                type="button"
                                className="remove-photo"
                                onClick={() => handleRemoveImage(index)}
                                aria-label={`Remove photo for ${item.product?.name || 'product'}`}
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="button-group">
                        <button
                          type="submit"
                          className="btn submit-btn"
                          disabled={ratings[index].rating === 0 || !userId || ratings[index].submitting}
                        >
                          {ratings[index].submitting ? 'Submitting...' : 'Submit Rating'}
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RateModal;