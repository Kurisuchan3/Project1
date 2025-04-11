// homepageContent.js
import React from 'react';
import "./../../../sass/components/homepage.scss";
import Header from '../Header/header';
import StatsSection from '../Stats/stats';
import ProductGrid from '../ProductGrid/productgrid';
import { useNavigate } from 'react-router-dom';

// Updated filepath for the SVG image
import HeroImage from '../../../../public/images/herolapnix.svg';

const HomepageContent = () => {
  const navigate = useNavigate();

  const handleShopNowClick = () => {
    navigate('/shopui');
  };

  return (
    <div className="homepage">
      <Header />
      <section className="hero">
        <div className="hero__content">
          <h1 className="hero__title">
            LEVEL UP YOUR <span className="hero__title-highlight">SETUP</span>
          </h1>
          <p className="hero__subtitle">
            Discover Top-Tier Laptops, Keyboards & Mice Built for Ultimate Gaming Performance and Seamless Work Productivity
          </p>
          <div className="hero__buttons">
            <button
              className="hero__button hero__button--primary"
              onClick={handleShopNowClick}
            >
              Shop Now
            </button>
            <button className="hero__button hero__button--secondary">
              Learn More
            </button>
          </div>
        </div>
        <div className="hero__image">
          <img src={HeroImage} alt="Hero Setup" className="hero__img" />
        </div>
      </section>
      <StatsSection />
      <ProductGrid />
    </div>
  );
};

export default HomepageContent;