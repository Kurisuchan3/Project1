import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNav from '../topnav';
import Footer from '../footer';
import ProductModal from '../ProductModal/productview'; // Import the new modal component
import '../../../sass/components/user-components/userlandingpage.scss';
import axios from 'axios';
import { Card, Button } from 'antd';
import { ShoppingCartOutlined, EyeOutlined } from '@ant-design/icons';

const { Meta } = Card;

const UserLandingPage = () => {
  const [products, setProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const [selectedProduct, setSelectedProduct] = useState(null); // Selected product state
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Function to show the modal
  const showModal = (product) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  // Function to hide the modal
  const hideModal = () => {
    setIsModalVisible(false);
    setSelectedProduct(null);
  };

  // Function to navigate to the product details page
  const viewProductDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="user-landing-page">
      <TopNav />

      <main className="main-content">
        <div className="content-container">
          <h1>Welcome to LAPNIX</h1>
          <p>Explore the best laptops, peripherals, and accessories all in one place.</p>
        </div>

        <section className="best-selling-section">
          <h2>Best Selling Products</h2>
          <div className="product-carousel">
            <div className="product-grid">
              {products.map((product) => (
                <Card
                  key={product.id}
                  hoverable
                  style={{ width: 250, margin: '10px' }}
                  cover={
                    <div className="product-image-wrapper" onClick={() => showModal(product)}>
                      {product.image ? (
                        <img
                          alt={product.name}
                          src={window.location.origin + product.image}
                          className="product-image"
                        />
                      ) : (
                        <div className="product-image-placeholder" />
                      )}
                    </div>
                  }
                  onClick={() => showModal(product)} // Click on card triggers modal
                  actions={[
                    <Button
                      size="small"
                      icon={<EyeOutlined />}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click from triggering modal
                        viewProductDetails(product.id);
                      }}
                    >
                      View Details
                    </Button>,
                    <Button size="small" icon={<ShoppingCartOutlined />} onClick={(e) => e.stopPropagation()} />,
                  ]}
                >
                  <Meta
                    title={product.name}
                    description={`₱${parseFloat(product.price).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}`}
                  />
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Render the ProductModal */}
      <ProductModal
        visible={isModalVisible}
        product={selectedProduct}
        onClose={hideModal}
      />

      <Footer />
    </div>
  );
};

export default UserLandingPage;