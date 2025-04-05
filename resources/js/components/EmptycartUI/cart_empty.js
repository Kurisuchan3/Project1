import React from 'react';
import './../../../sass/components/cart_empty.scss';
import emptyCartIllustration from '../../../../public/images/cart_empty.svg';

const CartEmpty = ({ onContinueShopping }) => {
  return (
    <div className="cart-empty">
      <h2 className="empty-cart-title">Your cart is empty</h2>
      <p className="empty-cart-message">Looks like you haven't added any items to your cart yet</p>
      <img 
        src={emptyCartIllustration} 
        alt="Empty shopping cart" 
        className="empty-cart-illustration" 
      />
      <button 
        className="continue-shopping-btn"
        onClick={onContinueShopping}
      >
        Continue Shopping
      </button>
    </div>
  );
};

export default CartEmpty;