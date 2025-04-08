import React from 'react';
import '../../../sass/components/ordersmodal.scss';

const OrdersModal = ({ order, onClose }) => {
  // Function to handle clicks on the overlay (outside the modal content)
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        {/* Add the "X" button in the top-right corner */}
        <button className="modal-close-x" onClick={onClose}>
          ×
        </button>

        <div className="modal-header">
          <img
            src="https://via.placeholder.com/100" // Placeholder for user image; replace if you have a specific user image
            alt="user"
            className="modal-user-image"
          />
          <div className="modal-user-info">
            <p>
              <strong>First Name:</strong> {order.userName}
            </p>
            <p>
              <strong>Last Name:</strong> {order.lastName}
            </p>
            <p>
              <strong>Phone Number:</strong> {order.phone}
            </p>
            <p>
              <strong>Email:</strong> {order.email}
            </p>
            <p>
              <strong>Street Address:</strong> {order.address}
            </p>
            <p>
              <strong>City:</strong> Butuan City
            </p>
            <p>
              <strong>Country:</strong> {order.country}
            </p>
          </div>
        </div>

        <div className="modal-section">
          <p>
            <strong>Order Note [Optional]</strong>
          </p>
          <textarea readOnly className="order-note" />
        </div>

        <div className="modal-section">
          <p>
            <strong>Other Information</strong>
          </p>
          <p>
            <strong>Order Status:</strong> Shipped
          </p>
          <p>
            <strong>Payment Method:</strong> {order.paymentMethod}
          </p>
        </div>

        <div className="modal-section">
          <p>
            <strong>Order Summary</strong>
          </p>
          <p>
            <strong>Subtotal:</strong> ₱ {order.subtotal}
          </p>
          <p>
            <strong>Total:</strong> ₱ {order.total}
          </p>
        </div>

        <div className="modal-section">
          <img
            src={order.image} // Use the tuf.svg image for the item
            alt="item"
            className="modal-item-image"
          />
          <p>
            <strong>{order.itemName}</strong>
          </p>
          <p>Qty: 1</p>
          <p>₱ {order.total}</p>
        </div>
      </div>
    </div>
  );
};

export default OrdersModal;