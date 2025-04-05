// footer_content.js
import React from 'react';
import "./../../../sass/components/footercontent.scss";
import { IconBrandFacebook, IconBrandX } from '@tabler/icons-react';

const FooterContent = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Product Categories Section */}
        <div className="footer-section">
          <h3 className="footer-title">Product Categories</h3>
          <ul className="footer-list">
            <li><a href="/laptop">Laptop</a></li>
            <li><a href="/keyboard">Keyboard</a></li>
            <li><a href="/mouse">Mouse</a></li>
          </ul>
        </div>

        {/* Support Section */}
        <div className="footer-section">
          <h3 className="footer-title">Support</h3>
          <ul className="footer-list">
            <li><a href="/get-help">Get Help</a></li>
            <li><a href="/lapnix-support">LAPNIX Support</a></li>
          </ul>
        </div>

        {/* Company Section */}
        <div className="footer-section">
          <h3 className="footer-title">Company</h3>
          <ul className="footer-list">
            <li><a href="/about-us">About us</a></li>
            <li><a href="/careers">Careers</a></li>
          </ul>
        </div>

        {/* Follow Us Section */}
        <div className="footer-section">
          <h3 className="footer-title">Follow Us</h3>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <IconBrandFacebook size={24} />
            </a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer">
              <IconBrandX size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom Links */}
      <div className="footer-bottom">
        <div className="footer-links">
          <a href="/cookie-policy">Cookie Policy</a>
          <a href="/privacy-policy">Privacy Policy</a>
          <a href="/terms-of-use">Terms of Use</a>
          <a href="/contact-us">Contact Us</a>
        </div>
        <div className="footer-copyright">
          <p>LAPNIX Copyright® All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterContent;