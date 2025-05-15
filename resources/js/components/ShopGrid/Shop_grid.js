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
  const [productRatings, setProductRatings] = useState({});
  const [failedImages, setFailedImages] = useState(new Set());

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories');
        console.log('Fetched Categories:', response.data);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        console.log('Fetched Products:', response.data);
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
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
          alert(`${product.name} added to cart!`);
          window.dispatchEvent(new Event('storage'));
        })
        .catch((error) => {
          console.error('Error adding to cart:', error);
          alert('Failed to add to cart.');
        });
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

  const filteredProducts = filteredBrand
    ? products.filter((product) => {
        if (!product.subcategory) {
          console.log(`Product ${product.name} has no subcategory`);
          return false;
        }
        if (filteredBrand.type === 'category') {
          const categoryId = categories.find((cat) => cat.name === filteredBrand.value)?.id;
          if (!categoryId) {
            console.log(`Category ${filteredBrand.value} not found`);
            return false;
          }
          const matches = product.subcategory.category_id === categoryId;
          console.log(
            `Product: ${product.name}, Subcategory: ${product.subcategory.name}, Category ID: ${product.subcategory.category_id}, Expected Category ID: ${categoryId}, Matches: ${matches}`
          );
          return matches;
        } else if (filteredBrand.type === 'subcategory') {
          const matches = product.subcategory.name === filteredBrand.value;
          console.log(
            `Product: ${product.name}, Subcategory: ${product.subcategory.name}, Expected Subcategory: ${filteredBrand.value}, Matches: ${matches}`
          );
          return matches;
        }
        return false;
      })
    : products;

  console.log('Filtered Products:', filteredProducts);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath || failedImages.has(imagePath)) return '/images/placeholder.jpg';
    // Handle inconsistent paths (e.g., public/images/ or images/)
    const cleanPath = imagePath.replace(/^\/?(public\/)?images\//, 'images/');
    return `http://127.0.0.1:8000/${cleanPath}`;
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
                  src={getImageUrl(product.image)}
                  alt={product.name}
                  className="product-image"
                  onError={(e) => {
                    if (!failedImages.has(product.image)) {
                      console.warn(`Failed to load image for ${product.name}: ${product.image}`);
                      setFailedImages((prev) => new Set(prev).add(product.image));
                    }
                    e.target.src = '/images/placeholder.jpg';
                  }}
                />
              </div>
              <div className="product-details">
                <h3 className="product-name">{product.name}</h3>
                {renderStars(product.id)}
                <p className="product-price">₱{parseFloat(product.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                <div className="button-container">
                  <button
                    className="add-to-cart"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                  >
                    Add to Cart
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