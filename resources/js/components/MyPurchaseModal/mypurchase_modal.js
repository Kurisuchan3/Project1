import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../../sass/components/mypurchase_modal.scss';
import AsusImage from '../../../../public/images/Asus ROG Zephyrus.svg';
import MacBookImage from '../../../../public/images/Apple MacBook Pro M2.svg';

const MyPurchaseModal = ({ isOpen, onClose, purchase }) => {
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
      orderStatus: 'Delivered',
      paymentMethod: 'Credit Card',
    });
  
    useEffect(() => {
      if (purchase) {
        setFormData({
          firstName: 'John',
          lastName: 'Doe',
          phoneNumber: '123-456-7890',
          email: 'john.doe@example.com',
          barangay: 'Sample Barangay',
          city: 'Sample City',
          province: 'Sample Province',
          country: 'Philippines',
          orderNote: 'Handle with care',
          otherInfo: 'No special instructions',
          orderStatus: purchase.status,
          paymentMethod: 'Credit Card',
        });
      }
    }, [purchase]);
  
    if (!isOpen) return null;
  
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
          <h2>Order Details</h2>
          <form>
            <div className="modal-field">
              <label>First Name</label>
              <input type="text" value={formData.firstName} readOnly />
            </div>
            <div className="modal-field">
              <label>Last Name</label>
              <input type="text" value={formData.lastName} readOnly />
            </div>
            <div className="modal-field">
              <label>Phone Number</label>
              <input type="text" value={formData.phoneNumber} readOnly />
            </div>
            <div className="modal-field">
              <label>Email</label>
              <input type="email" value={formData.email} readOnly />
            </div>
            <div className="modal-field">
              <label>Barangay</label>
              <input type="text" value={formData.barangay} readOnly />
            </div>
            <div className="modal-field">
              <label>City</label>
              <input type="text" value={formData.city} readOnly />
            </div>
            <div className="modal-field">
              <label>Province</label>
              <input type="text" value={formData.province} readOnly />
            </div>
            <div className="modal-field">
              <label>Country</label>
              <input type="text" value={formData.country} readOnly className="readonly-input" />
            </div>
            <div className="modal-field">
              <label>Order Note (Optional)</label>
              <input type="text" value={formData.orderNote} readOnly />
            </div>
            <div className="modal-field">
              <label>Other Information</label>
              <input type="text" value={formData.otherInfo} readOnly />
            </div>
            <div className="modal-field">
              <label>Order Status</label>
              <input type="text" value={formData.orderStatus} readOnly />
            </div>
            <div className="modal-field">
              <label>Payment Method</label>
              <input type="text" value={formData.paymentMethod} readOnly />
            </div>
            <h3>Order Summary</h3>
            {purchase?.products.map((product, index) => (
              <div key={index} className="order-summary">
                <div className="summary-image">
                  <img src={product.image} alt={product.product_name} />
                </div>
                <div className="summary-details">
                  <p className="product-name">{product.product_name}</p>
                  <p>Order Date: {purchase.order_date}</p>
                  <p>Price: ${product.price.toFixed(2)}</p>
                  <p>
                    Status: <span className={`status-${purchase.status.toLowerCase()}`}>{purchase.status}</span>
                  </p>
                </div>
              </div>
            ))}
          </form>
          <button className="modal-close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  };
  
  export default MyPurchaseModal;