import React, { useState, useEffect } from 'react';
import "../../../sass/components/productgrid.scss";
import ProdModal from '../ModalUI/ProdModal';
import axios from 'axios';

const Grid = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [guestCart, setGuestCart] = useState(() => {
    const savedCart = localStorage.getItem('guestCart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    localStorage.setItem('guestCart', JSON.stringify(guestCart));
  }, [guestCart]);

  const addToCart = (product) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      axios
        .post('/api/cart', { product_id: product.id, quantity: 1 }, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
          alert(`${product.name} added to cart!`);
          window.dispatchEvent(new Event('storage'));
        })
        .catch((error) => console.error('Error adding to cart:', error.response?.data || error.message));
    } else {
      setGuestCart((prevCart) => {
        const existingItem = prevCart.find((item) => item.id === product.id);
        if (existingItem) {
          return prevCart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return [
          ...prevCart,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image,
          },
        ];
      });
      alert(`${product.name} added to cart!`);
      window.dispatchEvent(new Event('storage'));
    }
  };

  const openModal = (product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  const renderStars = (rating) => {
    return (
      <div className="product-rating">
        {[...Array(5)].map((_, index) => (
          <span key={index} className={index < rating ? "star filled" : "star"}>
            {index < rating ? "★" : "☆"}
          </span>
        ))}
      </div>
    );
  };

  return (
    <section className="product-grid">
      <h2 className="grid-title">Explore Our Top Picks</h2>
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div className="grid-container">
          {products.map((product) => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => openModal(product)}
            >
              <img
                src={product.image ? window.location.origin + product.image : '/images/placeholder.jpg'}
                alt={product.name}
                className="product-image"
              />
              <div className="product-details">
                <h3 className="product-name">{product.name}</h3>
                {renderStars(product.rating || 4)}
                <p className="product-price">₱{parseFloat(product.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                <div className="button-container">
                  <button className="add-to-cart" onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                  }}>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {selectedProduct && (
        <ProdModal
          product={selectedProduct}
          onClose={closeModal}
          addToCart={addToCart}
        />
      )}
    </section>
  );
};

export default Grid;