import React, { useEffect, useState } from 'react';
import '../../../sass/components/mypurchase_modal.scss';

const MyPurchaseModal = ({ order, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    barangay: '',
    city: '',
    province: '',
    country: 'Philippines',
    orderNote: '',
    otherInfo: '',
    orderStatus: '',
    paymentMethod: '',
  });

  const formatPaymentMethod = (method) => {
    switch (method?.toLowerCase()) {
      case 'cod':
        return 'Cash on Delivery';
      case 'gcash':
        return 'GCash';
      case 'credit_card':
        return 'Credit Card';
      default:
        return 'Unknown';
    }
  };

  useEffect(() => {
    if (order) {
      setFormData({
        firstName: 'Unknown',
        lastName: 'User',
        phoneNumber: 'N/A',
        email: 'N/A',
        barangay: order.barangay || '',
        city: order.city || '',
        province: order.province || '',
        country: order.country || 'Philippines',
        orderNote: order.order_notes || 'None',
        otherInfo: 'No special instructions',
        orderStatus: order.status?.status_name || 'Unknown',
        paymentMethod: formatPaymentMethod(order.payment_detail?.payment_method),
      });
    }
  }, [order]);

  const getImageUrl = (imagePath) => {
    if (imagePath?.startsWith('/images/') || imagePath?.startsWith('/storage/')) {
      return `http://localhost:8000${encodeURI(imagePath)}`;
    }
    return 'https://via.placeholder.com/80';
  };

  if (!order) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content scrollable" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>Order Summary</h2>

        <section className="modal-section">
          <h3>Shipping Details</h3>
          <div className="modal-grid">
            <div><strong>Barangay:</strong> {formData.barangay}</div>
            <div><strong>City:</strong> {formData.city}</div>
            <div><strong>Province:</strong> {formData.province}</div>
            <div><strong>Country:</strong> {formData.country}</div>
          </div>
          <div><strong>Order Note:</strong> {formData.orderNote}</div>
        </section>

        <section className="modal-section">
          <h3>Payment & Status</h3>
          <div className="modal-grid">
            <div><strong>Status:</strong> <span className={`status-${formData.orderStatus.toLowerCase()}`}>{formData.orderStatus}</span></div>
            <div><strong>Payment:</strong> {formData.paymentMethod}</div>
            <div><strong>Order Date:</strong> {new Date(order.created_at).toLocaleDateString()}</div>
            <div><strong>Total:</strong> ₱{parseFloat(order.total).toLocaleString()}</div>
          </div>
        </section>

        <section className="modal-section">
          <h3>Ordered Items</h3>
          {order.orderItems?.length > 0 ? (
            order.orderItems.map((item, index) => (
              <div className="order-summary" key={index}>
                <div className="summary-image">
                  <img src={getImageUrl(item.product?.image)} alt={item.product?.name || 'Product'} />
                </div>
                <div className="summary-details">
                  <p className="product-name">{item.product?.name || 'Unknown Product'}</p>
                  <p>Price: ₱{parseFloat(item.price).toLocaleString()}</p>
                  <p>Quantity: {item.quantity}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No items found.</p>
          )}
        </section>

        <button className="modal-close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default MyPurchaseModal;
