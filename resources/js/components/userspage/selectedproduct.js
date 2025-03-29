import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import TopNav from '../topnav';
import Footer from '../footer';
import { Button } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import '../../../sass/components/selectedproduct.scss'; // Add your styles

const SelectedProduct = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/api/products/${id}`);
      setProduct(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="selected-product-page">
      <TopNav />

      <main className="product-details">
        <div className="product-container">
          <div className="product-image">
            {product.image ? (
              <img
                alt={product.name}
                src={window.location.origin + product.image}
                style={{ maxWidth: '100%', maxHeight: 400, objectFit: 'cover' }}
              />
            ) : (
              <div style={{ height: 400, backgroundColor: '#f0f0f0' }} />
            )}
          </div>
          <div className="product-info">
            <h1>{product.name}</h1>
            <p className="price">{`₱${parseFloat(product.price).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}`}</p>
            <div className="product-specs">
              <h3>Specifications</h3>
              <ul>
                {/* Replace with actual product data if available */}
                <li>Intel Core i5-1235U</li>
                <li>8GB DDR4 RAM</li>
                <li>512GB SSD</li>
                <li>14-inch FHD Display</li>
                <li>Windows 11</li>
              </ul>
            </div>
            <Button type="primary" icon={<ShoppingCartOutlined />} size="large">
              Add to Cart
            </Button>
            <Button onClick={() => navigate('/userlandingpage')} style={{ marginLeft: '10px' }}>
              Back to Home
            </Button>
          </div>
        </div>
      </main>

      <Footer /> 
    </div>
  );
};

export default SelectedProduct;