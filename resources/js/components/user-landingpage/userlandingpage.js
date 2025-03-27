import React, { useEffect, useState } from 'react';
import TopNav from '../topnav';
import Footer from '../footer';
import '../../../sass/components/user-components/userlandingpage.scss';
import axios from 'axios';
import { Card, Button } from 'antd';
import { ShoppingCartOutlined, EyeOutlined } from '@ant-design/icons';

const { Meta } = Card;

const UserLandingPage = () => {
  const [products, setProducts] = useState([]);

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

  return (
    <div className="user-landing-page">
      <TopNav />

      <main className="main-content">
        <div className="content-container">
          <h1>Welcome to LAPNIX</h1>
          <p>Explore the best laptops, peripherals, and accessories all in one place.</p>
        </div>

        {/* Product Carousel Section */}
        <section className="best-selling-section">
          <h2>Best Selling Products</h2>
          <div className="product-carousel">
            {products.map((product) => (
              <Card
                key={product.id}
                hoverable
                style={{ width: 250, margin: '10px' }}
                cover={
                  product.image ? (
                    <img
                      alt={product.name}
                      src={window.location.origin + product.image}
                      style={{ height: 180, objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ height: 180, backgroundColor: '#f0f0f0' }} />
                  )
                }
                actions={[
                  <Button size="small" icon={<EyeOutlined />}>Quick View</Button>,
                  <Button size="small" icon={<ShoppingCartOutlined />} />
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
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default UserLandingPage;
