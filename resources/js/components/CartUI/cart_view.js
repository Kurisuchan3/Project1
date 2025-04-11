import React, { useState, useEffect } from 'react';
import './../../../sass/components/cart_view.scss';
import Header from '../Header/header';
import { IconX } from '@tabler/icons-react';
import CartEmpty from '../EmptycartUI/cart_empty';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CartView = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [address, setAddress] = useState({
    country: "Philippines",
    state: "Agusan Del Norte",
    city: "Butuan City",
    zip: "8600"
  });
  const [loading, setLoading] = useState(true);

  const statesByCountry = {
    Philippines: ["Agusan Del Norte", "Cebu", "Davao del Sur"],
    US: ["California", "Texas", "New York"]
  };

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      axios
        .get('/api/cart', { headers: { Authorization: token } })
        .then((response) => {
          const items = response.data.map(item => ({
            id: item.product.id,
            name: item.product.name,
            price: parseFloat(item.product.price),
            quantity: item.quantity,
            image: item.product.image,
            cartItemId: item.id // Store cart item ID for updates/removal
          }));
          setCartItems(items);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching cart:', error);
          setLoading(false);
        });
    } else {
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      setCartItems(guestCart);
      setLoading(false);
    }
  }, []);

  const updateCart = (newCart) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Sync with backend
      newCart.forEach(item => {
        if (item.cartItemId) {
          axios.put(`/api/cart/${item.cartItemId}`, { quantity: item.quantity }, {
            headers: { Authorization: token }
          }).catch(error => console.error('Error updating cart:', error));
        }
      });
    } else {
      localStorage.setItem('guestCart', JSON.stringify(newCart));
    }
    setCartItems(newCart);
    window.dispatchEvent(new Event('storage')); // Update Header
  };

  const removeItem = (itemId) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const item = cartItems.find(i => i.id === itemId);
      axios
        .delete(`/api/cart/${item.cartItemId}`, { headers: { Authorization: token } })
        .then(() => {
          setCartItems(cartItems.filter(i => i.id !== itemId));
          window.dispatchEvent(new Event('storage'));
        })
        .catch(error => console.error('Error removing item:', error));
    } else {
      updateCart(cartItems.filter(item => item.id !== itemId));
    }
  };

  const incrementQuantity = (itemId) => {
    updateCart(cartItems.map(item =>
      item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const decrementQuantity = (itemId) => {
    updateCart(cartItems.map(item =>
      item.id === itemId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    ));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleContinueShopping = () => {
    navigate('/shopui');
  };

  const toggleAddressForm = () => {
    setIsAddressFormOpen(!isAddressFormOpen);
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => {
      const updatedAddress = { ...prev, [name]: value };
      if (name === "country") {
        updatedAddress.state = statesByCountry[value][0];
      }
      return updatedAddress;
    });
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    setIsAddressFormOpen(false);
  };

  const handleProceedToCheckout = () => {
    const token = localStorage.getItem('authToken');
    if (cartItems.length === 0) {
      alert("Your cart is empty. Please add items to proceed to checkout.");
      return;
    }
    if (!token) {
      alert("Please log in to proceed to checkout.");
      navigate('/login', { state: { from: '/cartview', cartItems, address } });
      return;
    }
    navigate('/payment', { state: { cartItems, subtotal, address } });
  };

  if (loading) return <div>Loading cart...</div>;

  return (
    <div className="cart-view">
      <Header />
      <div className="cart-content">
        <h1 className="cart-title">Your Cart</h1>
        {cartItems.length === 0 ? (
          <CartEmpty onContinueShopping={handleContinueShopping} />
        ) : (
          <div className="cart-container">
            <div className="cart-table-container">
              <div className="cart-table">
                <div className="cart-header">
                  <div className="header-item product-col">Product</div>
                  <div className="header-item">Price</div>
                  <div className="header-item">Quantity</div>
                  <div className="header-item">Subtotal</div>
                  <div className="header-item action-col"></div>
                </div>
                {cartItems.map((item) => (
                  <div className="cart-item" key={item.id}>
                    <div className="item-details product-col">
                      <img src={item.image ? window.location.origin + item.image : '/images/placeholder.jpg'} alt={item.name} className="product-image" />
                      <div className="product-name">{item.name}</div>
                    </div>
                    <div className="item-price">₱{item.price.toLocaleString()}</div>
                    <div className="item-quantity">
                      <div className="quantity-control">
                        <button
                          className="quantity-btn"
                          onClick={() => decrementQuantity(item.id)}
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          −
                        </button>
                        <span className="quantity-value">{item.quantity}</span>
                        <button
                          className="quantity-btn"
                          onClick={() => incrementQuantity(item.id)}
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="item-subtotal">₱{(item.price * item.quantity).toLocaleString()}</div>
                    <div className="item-remove">
                      <button 
                        className="remove-btn"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <IconX size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="cart-totals-container">
              <div className="cart-totals">
                <h2 className="totals-title">Cart Totals</h2>
                <div className="totals-row">
                  <span className="totals-label">Subtotal</span>
                  <span className="totals-value">₱{subtotal.toLocaleString()}</span>
                </div>
                <div className="shipping-section">
                  <div className="shipping-title">Shipping to:</div>
                  <div className="shipping-address">
                    Purok 6 960-B RCES, Baan riverside. (Bgy. 19)<br />
                    {address.city}, {address.country === "Philippines" ? "Mindanao" : ""}, {address.state} {address.zip}
                  </div>
                  <button className="change-address-btn" onClick={toggleAddressForm}>
                    Change address
                  </button>
                  <div className={`address-form-container ${isAddressFormOpen ? 'open' : 'closed'}`}>
                    <form className="address-form" onSubmit={handleAddressSubmit}>
                      <div className="form-group">
                        <label htmlFor="country">Country / Region</label>
                        <select
                          id="country"
                          name="country"
                          value={address.country}
                          onChange={handleAddressChange}
                        >
                          <option value="Philippines">Philippines</option>
                          <option value="US">United States</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="state">State / County</label>
                        <select
                          id="state"
                          name="state"
                          value={address.state}
                          onChange={handleAddressChange}
                        >
                          {statesByCountry[address.country].map(state => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="city">Town / City</label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={address.city}
                          onChange={handleAddressChange}
                          placeholder="Enter your city"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="zip">Postcode / ZIP code</label>
                        <input
                          type="text"
                          id="zip"
                          name="zip"
                          value={address.zip}
                          onChange={handleAddressChange}
                          placeholder="Enter your ZIP code"
                        />
                      </div>
                      <div className="form-actions">
                        <button type="submit" className="save-address-btn">Save</button>
                        <button
                          type="button"
                          className="cancel-address-btn"
                          onClick={toggleAddressForm}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="totals-row grand-total">
                  <span className="totals-label">Total</span>
                  <span className="totals-value">₱{subtotal.toLocaleString()}</span>
                </div>
                <button className="checkout-button" onClick={handleProceedToCheckout}>
                  Proceed to checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartView;