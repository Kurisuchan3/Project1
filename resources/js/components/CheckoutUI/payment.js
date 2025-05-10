import React, { useState, useEffect } from 'react';
import '../../../sass/components/payment.scss';
import productImage from '../../../../public/images/tuf.svg';
import gcashImage from '../../../../public/images/CashG.svg';
import Header from '../Header/header';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { cartItems = [], subtotal = 0, address = {} } = location.state || {};

  const [billingDetails, setBillingDetails] = useState({
    firstName: '',
    lastName: '',
    country: address.country || 'Philippines',
    barangay: address.barangay || '',
    city: address.city || '',
    province: address.province || '',
    mobilePhone: '',
    orderNotes: '',
    address_id: address.id || null,
  });

  const [visibleSections, setVisibleSections] = useState({
    creditCard: false,
    cashOnDelivery: false,
    gcash: false,
  });

  const [creditCardDetails, setCreditCardDetails] = useState({
    nameOnCard: '',
    cardNumber: '',
    expirationDate: '',
    securityCode: '',
  });

  const [gcashDetails, setGcashDetails] = useState({
    accountName: '',
    phoneNumber: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      console.log('Token:', token); // Debug token
      const fetchProfile = async () => {
        try {
          const response = await axios.get('http://localhost:8000/api/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data.success && response.data.data) {
            setBillingDetails((prev) => ({
              ...prev,
              firstName: response.data.data.first_name || prev.firstName,
              lastName: response.data.data.last_name || prev.lastName,
              mobilePhone: response.data.data.phone || prev.mobilePhone,
            }));
          } else {
            console.warn('Profile data not found or success is false:', response.data);
          }
        } catch (error) {
          console.error('Error fetching profile:', error.response?.data || error.message);
          if (error.response?.status === 401) {
            localStorage.removeItem('authToken');
            alert('Session expired. Please log in again.');
            navigate('/login');
          }
        }
      };
      fetchProfile();
    } else {
      alert('Please log in to proceed with checkout.');
      navigate('/login');
    }
  }, [navigate]);

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillingDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreditCardChange = (e) => {
    const { name, value } = e.target;
    setCreditCardDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleGcashChange = (e) => {
    const { name, value } = e.target;
    setGcashDetails((prev) => ({ ...prev, [name]: value }));
  };

  const toggleSection = (section) => {
    setVisibleSections((prev) => {
      const newState = {
        creditCard: false,
        cashOnDelivery: false,
        gcash: false,
      };
      if (!prev[section]) {
        newState[section] = true;
      }
      return newState;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Please log in to place an order');
      navigate('/login');
      return;
    }

    let paymentMethod = '';
    let paymentDetails = {};

    if (visibleSections.creditCard) {
      paymentMethod = 'credit_card';
      paymentDetails = creditCardDetails;
    } else if (visibleSections.cashOnDelivery) {
      paymentMethod = 'cod';
      paymentDetails = {};
    } else if (visibleSections.gcash) {
      paymentMethod = 'gcash';
      paymentDetails = gcashDetails;
    } else {
      alert('Please select a payment method');
      return;
    }

    const orderData = {
      billingDetails: {
        firstName: billingDetails.firstName,
        lastName: billingDetails.lastName,
        country: billingDetails.country,
        barangay: billingDetails.barangay,
        city: billingDetails.city,
        province: billingDetails.province,
        mobilePhone: billingDetails.mobilePhone,
        orderNotes: billingDetails.orderNotes,
        address_id: billingDetails.address_id,
      },
      cartItems: cartItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
      payment_method: paymentMethod,
      payment_details: paymentDetails,
    };

    try {
      const response = await axios.post('http://localhost:8000/api/orders', orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        navigate('/complete', { state: { order: response.data.data } });
      } else {
        alert('Failed to place order: ' + response.data.message);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('authToken');
        alert('Session expired. Please log in again.');
        navigate('/login');
      } else {
        alert('Error placing order: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const orderSummary = {
    products: cartItems.length > 0 ? cartItems : [{
      id: 'default-product',
      name: 'ASUS TUF GAMING A14',
      price: 2620,
      quantity: 1,
      image: productImage,
    }],
    shippingFee: 80,
    subtotal: subtotal || 2620,
    total: (subtotal || 2620) + 80,
  };

  return (
    <div className="payment-method-wrapper">
      <Header />
      <div className="payment-method-content">
        <h1 className="payment-method-title">Checkout</h1>
        
        <div className="payment-method-layout">
          <div className="payment-method-billing">
            <h2 className="payment-method-section-heading">Billing Details</h2>
            <form className="payment-method-billing-form" onSubmit={handleSubmit}>
              <div className="payment-method-form-row">
                <div className="payment-method-form-field">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={billingDetails.firstName}
                    onChange={handleBillingChange}
                    placeholder="First Name"
                    required
                  />
                </div>
                <div className="payment-method-form-field">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={billingDetails.lastName}
                    onChange={handleBillingChange}
                    placeholder="Last Name"
                    required
                  />
                </div>
              </div>

              <div className="payment-method-form-field">
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={billingDetails.country}
                  onChange={handleBillingChange}
                  placeholder="Country"
                  required
                />
              </div>

              <div className="payment-method-form-field">
                <label htmlFor="barangay">Barangay</label>
                <input
                  type="text"
                  id="barangay"
                  name="barangay"
                  value={billingDetails.barangay}
                  onChange={handleBillingChange}
                  placeholder="Barangay"
                  required
                />
              </div>

              <div className="payment-method-form-field">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={billingDetails.city}
                  onChange={handleBillingChange}
                  placeholder="City"
                  required
                />
              </div>

              <div className="payment-method-form-field">
                <label htmlFor="province">Province</label>
                <input
                  type="text"
                  id="province"
                  name="province"
                  value={billingDetails.province}
                  onChange={handleBillingChange}
                  placeholder="Province"
                  required
                />
              </div>

              <div className="payment-method-form-field">
                <label htmlFor="mobilePhone">Mobile Phone</label>
                <input
                  type="tel"
                  id="mobilePhone"
                  name="mobilePhone"
                  value={billingDetails.mobilePhone}
                  onChange={handleBillingChange}
                  placeholder="Mobile Phone Number"
                  required
                />
              </div>

              <div className="payment-method-form-field">
                <label htmlFor="orderNotes">Order notes (optional)</label>
                <textarea
                  id="orderNotes"
                  name="orderNotes"
                  value={billingDetails.orderNotes}
                  onChange={handleBillingChange}
                  placeholder="Notes about your order, e.g. special notes for delivery."
                  rows="4"
                />
              </div>

              <div className="payment-method-payment-options">
                <h2 className="payment-method-section-heading">Payment Method</h2>
                <div className="payment-method-options-list">
                  <button
                    type="button"
                    className={`payment-method-option-button ${visibleSections.creditCard ? 'payment-method-option-active' : ''}`}
                    onClick={() => toggleSection('creditCard')}
                  >
                    Credit Card
                  </button>
                  {visibleSections.creditCard && (
                    <div className="payment-method-credit-card-form">
                      <div className="payment-method-form-field">
                        <label htmlFor="nameOnCard">Name on card</label>
                        <input
                          type="text"
                          id="nameOnCard"
                          name="nameOnCard"
                          value={creditCardDetails.nameOnCard}
                          onChange={handleCreditCardChange}
                          placeholder="Name on card"
                          required
                        />
                      </div>
                      <div className="payment-method-form-field">
                        <label htmlFor="cardNumber">Card Number</label>
                        <input
                          type="text"
                          id="cardNumber"
                          name="cardNumber"
                          value={creditCardDetails.cardNumber}
                          onChange={handleCreditCardChange}
                          placeholder="Card Number"
                          required
                        />
                      </div>
                      <div className="payment-method-form-row">
                        <div className="payment-method-form-field">
                          <label htmlFor="expirationDate">Expiration Date (MM / YY)</label>
                          <input
                            type="text"
                            id="expirationDate"
                            name="expirationDate"
                            value={creditCardDetails.expirationDate}
                            onChange={handleCreditCardChange}
                            placeholder="MM / YY"
                            required
                          />
                        </div>
                        <div className="payment-method-form-field">
                          <label htmlFor="securityCode">Security Code</label>
                          <input
                            type="text"
                            id="securityCode"
                            name="securityCode"
                            value={creditCardDetails.securityCode}
                            onChange={handleCreditCardChange}
                            placeholder="Security Code"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    className={`payment-method-option-button ${visibleSections.cashOnDelivery ? 'payment-method-option-active' : ''}`}
                    onClick={() => toggleSection('cashOnDelivery')}
                  >
                    Cash on Delivery
                  </button>
                  {visibleSections.cashOnDelivery && (
                    <div className="payment-method-cod-info">
                      <p>Please prepare the exact amount for delivery.</p>
                    </div>
                  )}

                  <button
                    type="button"
                    className={`payment-method-option-button ${visibleSections.gcash ? 'payment-method-option-active' : ''}`}
                    onClick={() => toggleSection('gcash')}
                  >
                    Gcash
                  </button>
                  {visibleSections.gcash && (
                    <div className="payment-method-gcash">
                      <div className="payment-method-gcash-container">
                        <div className="payment-method-gcash-form">
                          <div className="payment-method-form-field">
                            <label htmlFor="accountName">Account Name</label>
                            <input
                              type="text"
                              id="accountName"
                              name="accountName"
                              value={gcashDetails.accountName}
                              onChange={handleGcashChange}
                              placeholder="Account Name"
                              required
                            />
                          </div>
                          <div className="payment-method-form-field">
                            <label htmlFor="phoneNumber">Phone Number</label>
                            <input
                              type="tel"
                              id="phoneNumber"
                              name="phoneNumber"
                              value={gcashDetails.phoneNumber}
                              onChange={handleGcashChange}
                              placeholder="Phone Number (e.g., 09123456789)"
                              required
                            />
                          </div>
                        </div>
                        <div className="payment-method-gcash-qr">
                          <img src={gcashImage} alt="GCash QR Code" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button type="submit" className="payment-method-place-order">
                  Place Order
                </button>
              </div>
            </form>
          </div>

          <div className="payment-method-order">
            <div className="payment-method-order-details">
              <h2 className="payment-method-section-heading">Your Order</h2>
              {orderSummary.products.map((product) => (
                <div className="payment-method-order-item" key={product.id || 'default-product'}>
                  <img src={product.image || productImage} alt={product.name} className="payment-method-product-image" />
                  <div className="payment-method-product-info">
                    <div className="payment-method-product-name">{product.name}</div>
                    <div className="payment-method-product-quantity">Qty: {product.quantity}</div>
                  </div>
                </div>
              ))}

              <div className="payment-method-summary-row">
                <span className="payment-method-summary-label">Estimated shipping fee</span>
                <span className="payment-method-summary-value">₱{orderSummary.shippingFee.toLocaleString()}</span>
              </div>

              <div className="payment-method-summary-row">
                <span className="payment-method-summary-label">Subtotal</span>
                <span className="payment-method-summary-value">₱{orderSummary.subtotal.toLocaleString()}</span>
              </div>

              <div className="payment-method-summary-row payment-method-total">
                <span className="payment-method-summary-label">Total</span>
                <span className="payment-method-summary-value">₱{orderSummary.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;