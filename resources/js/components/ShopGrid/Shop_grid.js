import React, { useState, useEffect } from 'react';
import { IconStarFilled, IconStar } from '@tabler/icons-react';
import axios from 'axios';
import "./../../../sass/components/Shop_grid.scss";
import ProdModal from '../ModalUI/ProdModal';

const ShopGrid = ({ filteredBrand }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [guestCart, setGuestCart] = useState(() => {
    const savedCart = localStorage.getItem('guestCart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories');
        console.log('Fetched Categories:', response.data); // Debug log
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        console.log('Fetched Products:', response.data); // Debug log
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchCategories();
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
          headers: { Authorization: token }
        })
        .then(() => {
          alert(`${product.name} added to cart!`);
          window.dispatchEvent(new Event('storage'));
        })
        .catch((error) => console.error('Error adding to cart:', error));
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

  const renderStars = (rating) => {
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
      </div>
    );
  };

  // Filter products based on the selected filter (category or subcategory)
  console.log('Filtered Brand:', filteredBrand);
  console.log('Categories:', categories); // Debug log
  console.log('Products:', products); // Debug log
  const filteredProducts = filteredBrand
    ? products.filter(product => {
        if (!product.subcategory) {
          console.log(`Product ${product.name} has no subcategory`); // Debug log
          return false;
        }

        if (filteredBrand.type === 'category') {
          const categoryId = categories.find(cat => cat.name === filteredBrand.value)?.id;
          if (!categoryId) {
            console.log(`Category ${filteredBrand.value} not found`); // Debug log
            return false;
          }

          const matches = product.subcategory.category_id === categoryId;
          console.log(`Product: ${product.name}, Subcategory: ${product.subcategory.name}, Category ID: ${product.subcategory.category_id}, Expected Category ID: ${categoryId}, Matches: ${matches}`); // Debug log
          return matches;
        } else if (filteredBrand.type === 'subcategory') {
          const matches = product.subcategory.name === filteredBrand.value;
          console.log(`Product: ${product.name}, Subcategory: ${product.subcategory.name}, Expected Subcategory: ${filteredBrand.value}, Matches: ${matches}`); // Debug log
          return matches;
        }
        return false;
      })
    : products;

  console.log('Filtered Products:', filteredProducts); // Debug log

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <section className="product-grid">
      <div className="grid-container">
        {loading ? (
          <p>Loading products...</p>
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => handleProductClick(product)}
            >
              <div className="product-top">
                <img
                  src={product.image ? window.location.origin + product.image : '/images/placeholder.jpg'}
                  alt={product.name}
                  className="product-image"
                />
              </div>
              <div className="product-details">
                <h3 className="product-name">{product.name}</h3>
                {renderStars(product.rating || 4)}
                <p className="product-price">₱{parseFloat(product.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                <div className="button-container">
                  <button
                    className="add-to-cart"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                  >
                    add to cart
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No products found for this filter.</p>
        )}
        {filteredProducts.length > 0 && (
          <>
            <div className="product-card empty"></div>
            <div className="product-card empty"></div>
            <div className="product-card empty"></div>
          </>
        )}
      </div>

      {selectedProduct && (
        <ProdModal product={selectedProduct} onClose={handleCloseModal} addToCart={addToCart} />
      )}
    </section>
  );
};

export default ShopGrid;