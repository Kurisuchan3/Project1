// complete.js
import React from 'react';
import './../../../sass/components/complete.scss';  // Adjust the path based on your project structure


// Placeholder SVG import (you'll replace this with your actual SVG)
import CheckmarkIcon from '../../../../public/images/complete.svg';  // Adjust the path based on your project structure

const Complete = () => {
  return (
    <div className="order-success-container">
      {/* Illustration Section */}
      <div className="illustration">
        <img src={CheckmarkIcon} alt="Order Success Checkmark" className="checkmark" />
      </div>

      {/* Text Section */}
      <div className="success-message">
        <p>
          Thanks for your order! We’re on it and will send you a confirmation soon. Questions? Just let us know!
        </p>
      </div>

      {/* Button Section */}
      <button className="continue-shopping-btn">
        Continue to Shopping
      </button>
    </div>
  );
};

export default Complete;