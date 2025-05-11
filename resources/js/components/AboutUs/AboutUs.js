import React from "react";
import "../../../sass/components/_aboutUs.scss";
import Header from '../Header/header';
import FooterContent from "../FooterContent/FooterContent";

const AboutUs = () => {
  return (
    <div className="about-page">
      {/* Main content wrapper to push footer down */}
      <div className="about-page-container">
        <Header />

        {/* Top wave */}
        <div className="wave wave-top">
          <svg viewBox="0 0 1440 200" preserveAspectRatio="none">
            <path d="M0,0 C480,200 960,0 1440,200 L1440,0 L0,0 Z" />
          </svg>
        </div>

        {/* Main white card */}
        <div className="about-card">
          <h1>ABOUT US – LapNix</h1>

          <div className="section">
            <p>
              Welcome to LapNix, your go-to online store for high-quality laptops. We
              specialize in providing the latest and most reliable laptops for gamers,
              professionals, students, and everyday users. Whether you need a powerful
              gaming laptop, a high-performance workstation, or a budget-friendly option
              for daily tasks, we have the perfect device for you.
            </p>
            <p>
              At LapNix, we are committed to offering top-tier products, competitive
              prices, and a seamless shopping experience. Our selection includes the
              latest models from leading brands, ensuring you get the best performance,
              durability, and value for your money. With secure transactions, fast
              shipping, and excellent customer support, we make buying a laptop easier
              than ever.
            </p>
            <p>
              We believe in empowering our customers with the right tools for work,
              play, and creativity. Whether you’re upgrading your device or searching
              for the perfect laptop for your needs, LapNix is here to help. Explore our
              collection today and experience hassle-free laptop shopping!
            </p>
          </div>

          <hr />

          <div className="section core-values">
            <h2>Core Values</h2>
            <ul>
              {[
                ["Customer Satisfaction", "We prioritize our customers by providing high-quality laptops, excellent service, and a seamless shopping experience."],
                ["Integrity & Transparency", "We believe in honesty and fairness, ensuring clear product descriptions, fair pricing, and secure transactions."],
                ["Innovation & Quality", "We stay ahead of technology trends, offering only the best and latest laptops to meet our customers’ evolving needs."],
                ["Reliability & Trust", "We partner with reputable brands and ensure that every laptop we sell meets high performance and durability standards."],
                ["Commitment to Excellence", "From product selection to customer support, we are dedicated to providing top-notch service and continuous improvement."],
                ["Accessibility & Convenience", "We make high-quality laptops accessible to everyone through flexible payment options, fast delivery, and a user-friendly online store."],
                ["Sustainability & Responsibility", "We support eco-friendly practices by promoting energy-efficient laptops and responsible e-waste disposal."]
              ].map(([title, desc]) => (
                <li key={title}>
                  <span className="dot" /> <strong>{title} –</strong> {desc}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="wave wave-bottom">
          <svg viewBox="0 0 1440 200" preserveAspectRatio="none">
            <path d="M0,0 C480,200 960,0 1440,200 L1440,200 L0,200 Z" />
          </svg>
        </div>
      </div>

      {/* Footer is outside the container */}
      <FooterContent />
    </div>
  );
};

export default AboutUs;