import React, { useState, useEffect } from 'react';
import "../../../sass/components/productgrid.scss";
import ProdModal from '../ModalUI/ProdModal';
import axios from 'axios';
import { IconStarFilled, IconStar } from '@tabler/icons-react';

const Grid = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [guestCart, setGuestCart] = useState(() => {
    const savedCart = localStorage.getItem('guestCart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [productRatings, setProductRatings] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        setProducts(response.data);
        setLoading(false);
        fetchProductRatings(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    const fetchProductRatings = async (products) => {
      try {
        const ratingsPromises = products.map(async (product) => {
          try {
            const response = await axios.get(`/api/ratings/product/${product.id}`);
            const ratings = response.data.data || [];
            const averageRating =
              ratings.length > 0
                ? Math.round(
                    ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
                  )
                : 0;
            return { productId: product.id, averageRating };
          } catch (err) {
            console.warn(`No ratings for product ${product.id}:`, err.message);
            return { productId: product.id, averageRating: 0 };
          }
        });

        const ratingsData = await Promise.all(ratingsPromises);
        const ratingsMap = ratingsData.reduce((acc, { productId, averageRating }) => {
          acc[productId] = averageRating;
          return acc;
        }, {});
        setProductRatings(ratingsMap);
      } catch (error) {
        console.error('Error fetching product ratings:', error);
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

  const renderStars = (productId) => {
    const rating = productRatings[productId] || 0;
    return (
      <div className="product-rating">
        {[...Array(5)].map((_, index) => (
          <span key={index}>
            {index < rating ? (
              <IconStarFilled className="star filled" size={16} />
            ) : (
              <IconStar className="star" size={16} />
            )}
          </span>
        ))}
        {rating === 0 && <span className="no-rating">No ratings</span>}
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
                {renderStars(product.id)}
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