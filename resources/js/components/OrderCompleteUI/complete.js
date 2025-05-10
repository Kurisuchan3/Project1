import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './../../../sass/components/complete.scss';
import CheckmarkIcon from '../../../../public/images/complete.svg';

const Complete = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Access the order data from location.state
  const { order } = location.state || {};

  // If no order data is available, show a fallback message
  if (!order) {
    return (
      <div className="order-success-container">
        <div className="illustration">
          <img src={CheckmarkIcon} alt="Order Success Checkmark" className="checkmark" />
        </div>
        <div className="success-message">
          <p>No order details available. Your order was placed successfully!</p>
        </div>
        <button className="continue-shopping-btn" onClick={() => navigate('/homepagecontent')}>
          Continue to Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="order-success-container">
      <div className="illustration">
        <img src={CheckmarkIcon} alt="Order Success Checkmark" className="checkmark" />
      </div>
      <div className="success-message">
        <p>
          Thanks for your order! We’re on it and will send you a confirmation soon. Questions? Just let us know!
        </p>
        <h3>Order #{order.id}</h3>
        <div className="order-items">
          {order.orderItems && order.orderItems.length > 0 ? (
            order.orderItems.map((item) => (
              <div key={item.id} className="order-item">
                <img
                  src={item.product.image || '/images/tuf.svg'}
                  alt={item.product.name}
                  className="order-item-image"
                />
                <div className="order-item-details">
                  <p>{item.product.name}</p>
                  <p>Qty: {item.quantity}</p>
                  <p>Price: ₱{item.price.toLocaleString()}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No items found in this order.</p>
          )}
        </div>
        <p>Total: ₱{order.total.toLocaleString()}</p>
      </div>
      <button className="continue-shopping-btn" onClick={() => navigate('/homepagecontent')}>
        Continue to Shopping
      </button>
    </div>
  );
};

export default Complete;