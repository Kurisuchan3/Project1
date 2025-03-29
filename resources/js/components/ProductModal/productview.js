import React from 'react';
import { Modal, Button } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import '../../../sass/components/product_modal.scss';

const ProductModal = ({ visible, product, onClose }) => {
  if (!product) return null;

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      footer={null}
      className="product-modal"
      width={600}
    >
      <div className="product-modal-content">
        <div className="product-modal-image">
          {product.image ? (
            <img
              alt={product.name}
              src={window.location.origin + product.image}
              style={{ width: '100%', maxHeight: 300, objectFit: 'cover' }}
            />
          ) : (
            <div style={{ height: 300, backgroundColor: '#f0f0f0' }} />
          )}
        </div>
        <div className="product-modal-details">
          <h2>{product.name}</h2>
          <p className="price">{`₱${parseFloat(product.price).toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}`}</p>
          <ul className="specs">
            {/* Placeholder specs; replace with actual data if available */}
            <li>Intel Core i5-1235U</li>
            <li>8GB DDR4 RAM</li>
            <li>512GB SSD</li>
            <li>14-inch FHD Display</li>
            <li>Windows 11</li>
          </ul>
          <Button type="primary" icon={<ShoppingCartOutlined />} size="large">
            Add to Cart
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ProductModal;