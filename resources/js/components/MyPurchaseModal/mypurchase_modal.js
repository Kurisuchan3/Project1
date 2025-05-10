import React from 'react';
import '../../../sass/components/mypurchase_modal.scss';

const MyPurchaseModal = ({ order, onClose }) => {
  return (
    <div className="mypurchase-modal-overlay">
      <div className="mypurchase-modal-content">
        <button className="mypurchase-modal-close" onClick={onClose}>×</button>
        <h2 className="mypurchase-modal-title">Order Details #{order.id}</h2>
        <div className="mypurchase-modal-section">
          <h3>Items</h3>
          {order.orderItems.map((item) => (
            <div className="mypurchase-modal-item" key={item.id}>
              <img src={item.product.image || '/images/tuf.svg'} alt={item.product.name} className="mypurchase-modal-product-image" />
              <div className="mypurchase-modal-product-info">
                <p>{item.product.name}</p>
                <p>Qty: {item.quantity}</p>
                <p>Price: ₱{item.price.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mypurchase-modal-section">
          <h3>Shipping Address</h3>
          <p>{order.barangay}, {order.city}, {order.province}, {order.country}</p>
        </div>
        <div className="mypurchase-modal-section">
          <h3>Payment Method</h3>
          <p>{order.paymentDetail.payment_method === 'credit_card' ? 'Credit Card' : order.paymentDetail.payment_method === 'cod' ? 'Cash on Delivery' : 'GCash'}</p>
          {order.paymentDetail.details && (
            <div>
              {order.paymentDetail.payment_method === 'credit_card' && (
                <>
                  <p>Name on Card: {order.paymentDetail.details.nameOnCard}</p>
                  <p>Card Number: ****{order.paymentDetail.details.cardNumber.slice(-4)}</p>
                </>
              )}
              {order.paymentDetail.payment_method === 'gcash' && (
                <>
                  <p>Account Name: {order.paymentDetail.details.accountName}</p>
                  <p>Phone Number: {order.paymentDetail.details.phoneNumber}</p>
                </>
              )}
            </div>
          )}
        </div>
        <div className="mypurchase-modal-section">
          <h3>Order Summary</h3>
          <p>Subtotal: ₱{order.subtotal.toLocaleString()}</p>
          <p>Shipping Fee: ₱{order.shipping_fee.toLocaleString()}</p>
          <p>Total: ₱{order.total.toLocaleString()}</p>
          <p>Status: {order.status.status_name}</p>
          <p>Order Date: {new Date(order.created_at).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default MyPurchaseModal;