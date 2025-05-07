import React, { useState } from 'react';
import '../../../sass/components/mypurchase.scss';
import Header from '../Header/header';
import SideMenuProfile from '../SideMenuProfile/sidemenuprofile';
import AsusImage from '../../../../public/images/Asus ROG Zephyrus.svg';
import MacBookImage from '../../../../public/images/Apple MacBook Pro M2.svg';
import MyPurchaseModal from '../MyPurchaseModal/mypurchase_modal';

const MyPurchases = () => {
    const [purchases] = useState([
      {
        order_id: 1,
        order_date: '2025-04-15',
        products: [
          { product_name: 'Asus ROG Zephyrus G14', price: 1299.99, image: AsusImage },
        ],
        status: 'Delivered',
      },
      {
        order_id: 2,
        order_date: '2025-03-20',
        products: [
          { product_name: 'Apple MacBook Pro M2', price: 1999.99, image: MacBookImage },
        ],
        status: 'Shipped',
      },
      {
        order_id: 3,
        order_date: '2025-02-10',
        products: [
          { product_name: 'Asus ROG Zephyrus G14', price: 1299.99, image: AsusImage },
          { product_name: 'Apple MacBook Pro M2', price: 1999.99, image: MacBookImage },
        ],
        status: 'Delivered',
      },
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPurchase, setSelectedPurchase] = useState(null);
  
    const handleViewDetails = (purchase) => {
      setSelectedPurchase(purchase);
      setIsModalOpen(true);
    };
  
    return (
      <div className="purchases-page">
        <Header />
        <div className="purchases-layout">
          <SideMenuProfile />
          <div className="purchases-content">
            <div className="purchases-container">
              <div className="purchases-header">
                <h2>My Purchases</h2>
              </div>
              <h3>Order History</h3>
              {purchases.length === 0 ? (
                <p>No purchases found.</p>
              ) : (
                purchases.map((purchase) => (
                  <div key={purchase.order_id} className="purchase-item">
                    <div className="purchase-image">
                      <img src={purchase.products[0].image} alt={purchase.products[0].product_name} />
                      {purchase.products.length > 1 && (
                        <span className="item-count">+{purchase.products.length - 1}</span>
                      )}
                    </div>
                    <div className="purchase-details">
                      <p className="product-name">{purchase.products[0].product_name} {purchase.products.length > 1 ? `and ${purchase.products.length - 1} more` : ''}</p>
                      <p>Order Date: {purchase.order_date}</p>
                      <p>Price: ${purchase.products.reduce((total, product) => total + product.price, 0).toFixed(2)}</p>
                      <p>
                        Status: <span className={`status-${purchase.status.toLowerCase()}`}>{purchase.status}</span>
                      </p>
                    </div>
                    <div className="purchase-actions">
                      <button className="view-btn" onClick={() => handleViewDetails(purchase)}>View Details</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <MyPurchaseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          purchase={selectedPurchase}
        />
      </div>
    );
  };
  
  export default MyPurchases;