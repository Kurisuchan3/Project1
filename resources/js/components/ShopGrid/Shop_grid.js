// Shop_grid.js
import React from 'react';
import { IconStarFilled, IconStar } from '@tabler/icons-react';
import "./../../../sass/components/Shop_grid.scss";

// Placeholder imports for product images
import Product1 from '../../../../public/images/tuf.svg';
import Product2 from '../../../../public/images/tuf.svg';
import Product3 from '../../../../public/images/tuf.svg';
import Product4 from '../../../../public/images/tuf.svg';
import Product5 from '../../../../public/images/tuf.svg';

const ShopGrid = () => {
  const products = [
    { id: 1, name: "Razer HKC NTX", price: "P2,000", rating: 5, image: Product1 },
    { id: 2, name: "TITAN 18 HX AI A2XW", price: "P2,000", rating: 4, image: Product2 },
    { id: 3, name: "ASUS TUF GMJING A14", price: "P2,000", rating: 4, image: Product3 },
    { id: 4, name: "TITAN 18 HX AI A2XW", price: "P2,000", rating: 5, image: Product4 },
    { id: 5, name: "Acer Predator Helios", price: "P2,000", rating: 4, image: Product5 },
  ];

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

  return (
    <section className="product-grid">
      <div className="grid-container">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-top">
              <img src={product.image} alt={product.name} className="product-image" />
            </div>
            <div className="product-details">
              <h3 className="product-name">{product.name}</h3>
              {renderStars(product.rating)}
              <p className="product-price">{product.price}</p>
              <div className="button-container">
                <button className="add-to-cart">add to cart</button>
              </div>
            </div>
          </div>
        ))}
        {/* Empty divs to maintain 4-column layout */}
        <div className="product-card empty"></div>
        <div className="product-card empty"></div>
        <div className="product-card empty"></div>
      </div>
    </section>
  );
};

export default ShopGrid;