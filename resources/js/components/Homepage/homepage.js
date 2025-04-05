// homepageContent.js
import React from 'react';
import "./../../../sass/components/homepage.scss";
import Header from '../Header/header'; 
import StatsSection from '../Stats/stats'; // Adjust the path based on your project structure
import ProductGrid from '../ProductGrid/productgrid'; // Import the ProductGrid component

// Updated filepath for the SVG image
import HeroImage from '../../../../public/images/herolapnix.svg';

const HomepageContent = () => {
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
            <button className="hero__button hero__button--primary">Shop Now</button>
            <button className="hero__button hero__button--secondary">Learn More</button>
          </div>
        </div>
        <div className="hero__image">
          <img src={HeroImage} alt="Hero Setup" className="hero__img" />
        </div>
      </section>
      <StatsSection />
      <ProductGrid /> {/* Added ProductGrid component */}
    </div>
  );
};

export default HomepageContent;