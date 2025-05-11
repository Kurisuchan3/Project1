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
  const [selectedItems, setSelectedItems] = useState([]);
  const [address, setAddress] = useState({
    barangay: '',
    city: '',
    province: '',
    country: 'Philippines'
  });
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchCart = async () => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.get('/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        const items = response.data.data.map(item => ({
          id: item.product.id,
          name: item.product.name,
          price: parseFloat(item.product.price),
          quantity: item.quantity,
          image: item.product.image,
          cartItemId: item.id
        }));
        setCartItems(items);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchDefaultAddress = async () => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.get('/api/addresses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        const defaultAddress = response.data.data.find(addr => addr.is_default) || response.data.data[0];
        if (defaultAddress) {
          setAddress({
            barangay: defaultAddress.barangay || '',
            city: defaultAddress.city || '',
            province: defaultAddress.province || '',
            country: defaultAddress.country || 'Philippines'
          });
        }
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      Promise.all([fetchCart(), fetchDefaultAddress()]).catch(() => setLoading(false));
    } else {
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      setCartItems(guestCart);
      setLoading(false);
    }

    // Listen for cartCleared event to refresh cart
    const handleCartCleared = () => {
      if (token) {
        fetchCart();
      } else {
        setCartItems([]);
        localStorage.removeItem('guestCart');
      }
    };

    window.addEventListener('cartCleared', handleCartCleared);
    return () => {
      window.removeEventListener('cartCleared', handleCartCleared);
    };
  }, [navigate]);

  const updateCart = (newCart) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      newCart.forEach(item => {
        if (item.cartItemId) {
          axios.put(`/api/cart/${item.cartItemId}`, { quantity: item.quantity }, {
            headers: { Authorization: `Bearer ${token}` }
          }).catch(error => console.error('Error updating cart:', error));
        }
      });
    } else {
      localStorage.setItem('guestCart', JSON.stringify(newCart));
    }
    setCartItems(newCart);
    window.dispatchEvent(new Event('storage'));
  };

  const removeItem = (itemId) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const item = cartItems.find(i => i.id === itemId);
      axios
        .delete(`/api/cart/${item.cartItemId}`, { headers: { Authorization: `Bearer ${token}` } })
        .then(() => {
          setCartItems(cartItems.filter(i => i.id !== itemId));
          setSelectedItems(selectedItems.filter(id => id !== itemId));
          window.dispatchEvent(new Event('storage'));
        })
        .catch(error => console.error('Error removing item:', error));
    } else {
      const newCart = cartItems.filter(item => item.id !== itemId);
      updateCart(newCart);
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    }
  };

  const removeSelectedItems = () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      Promise.all(
        selectedItems.map(itemId => {
          const item = cartItems.find(i => i.id === itemId);
          return axios.delete(`/api/cart/${item.cartItemId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
        })
      )
        .then(() => {
          setCartItems(cartItems.filter(item => !selectedItems.includes(item.id)));
          setSelectedItems([]);
          window.dispatchEvent(new Event('storage'));
        })
        .catch(error => console.error('Error removing selected items:', error));
    } else {
      const newCart = cartItems.filter(item => !selectedItems.includes(item.id));
      updateCart(newCart);
      setSelectedItems([]);
    }
  };

  const toggleSelectItem = (itemId) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map(item => item.id));
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

  const subtotal = selectedItems.reduce((sum, itemId) => {
    const item = cartItems.find(i => i.id === itemId);
    return item ? sum + (item.price * item.quantity) : sum;
  }, 0);

  const handleContinueShopping = () => {
    navigate('/shopui');
  };

  const toggleAddressForm = () => {
    setIsAddressFormOpen(!isAddressFormOpen);
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const response = await axios.post('/api/addresses', {
          ...address,
          is_default: true
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setAddress(response.data.data);
          setIsAddressFormOpen(false);
        }
      } catch (error) {
        console.error('Error saving address:', error);
      }
    }
  };

  const handleProceedToCheckout = () => {
    const token = localStorage.getItem('authToken');
    if (selectedItems.length === 0) {
      alert("Please select at least one item to proceed to checkout.");
      return;
    }
    if (!token) {
      alert("Please log in to proceed to checkout.");
      navigate('/login', {
        state: {
          from: '/cartview',
          cartItems: cartItems.filter(item => selectedItems.includes(item.id)),
          address
        }
      });
      return;
    }
    navigate('/payment', {
      state: {
        cartItems: cartItems.filter(item => selectedItems.includes(item.id)),
        subtotal,
        address
      }
    });
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
                  <div className="header-item checkbox-col">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === cartItems.length && cartItems.length > 0}
                      onChange={toggleSelectAll}
                      aria-label="Select all items"
                    />
                  </div>
                  <div className="header-item product-col">Product</div>
                  <div className="header-item">Price</div>
                  <div className="header-item">Quantity</div>
                  <div className="header-item">Subtotal</div>
                  <div className="header-item action-col"></div>
                </div>
                {cartItems.map((item) => (
                  <div className="cart-item" key={item.id}>
                    <div className="item-checkbox checkbox-col">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleSelectItem(item.id)}
                        aria-label={`Select ${item.name}`}
                      />
                    </div>
                    <div className="item-details product-col">
                      <img
                        src={item.image ? window.location.origin + item.image : '/images/placeholder.jpg'}
                        alt={item.name}
                        className="product-image"
                      />
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
              {selectedItems.length > 0 && (
                <button
                  className="remove-selected-btn"
                  onClick={removeSelectedItems}
                >
                  Remove Selected ({selectedItems.length})
                </button>
              )}
            </div>
            <div className="cart-totals-container">
              <div className="cart-totals">
                <h2 className="totals-title">Cart Totals</h2>
                {selectedItems.length > 0 && (
                  <div className="totals-row">
                    <span className="totals-label">Subtotal</span>
                    <span className="totals-value">₱{subtotal.toLocaleString()}</span>
                  </div>
                )}
                <div className="shipping-section">
                  <div className="shipping-title">Shipping to:</div>
                  <div className="shipping-address">
                    {address.barangay || address.city || address.province || address.country ? (
                      `${address.barangay ? address.barangay + ', ' : ''}${address.city ? address.city + ', ' : ''}${address.province ? address.province + ', ' : ''}${address.country}`
                    ) : (
                      'No address set'
                    )}
                  </div>
                  <button className="change-address-btn" onClick={toggleAddressForm}>
                    Change address
                  </button>
                  <div className={`address-form-container ${isAddressFormOpen ? 'open' : 'closed'}`}>
                    <form className="address-form" onSubmit={handleAddressSubmit}>
                      <div className="form-group">
                        <label htmlFor="barangay">Barangay</label>
                        <input
                          type="text"
                          id="barangay"
                          name="barangay"
                          value={address.barangay}
                          onChange={handleAddressChange}
                          placeholder="Enter your barangay"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="city">City</label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={address.city}
                          onChange={handleAddressChange}
                          placeholder="Enter your city"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="province">Province</label>
                        <input
                          type="text"
                          id="province"
                          name="province"
                          value={address.province}
                          onChange={handleAddressChange}
                          placeholder="Enter your province"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="country">Country</label>
                        <input
                          type="text"
                          id="country"
                          name="country"
                          value={address.country}
                          onChange={handleAddressChange}
                          placeholder="Enter your country"
                          required
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
                {selectedItems.length > 0 && (
                  <div className="totals-row grand-total">
                    <span className="totals-label">Total</span>
                    <span className="totals-value">₱{subtotal.toLocaleString()}</span>
                  </div>
                )}
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