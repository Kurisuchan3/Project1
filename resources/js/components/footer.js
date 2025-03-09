// Footer.js
import React from 'react';
import '../../sass/components/footer.scss'; // Import the SCSS file

const Footer = () => {
  return (
    <footer>
      <div className="footer-logo">
        {/* Replace with your actual logo image */}
        <img src="/path-to-your-logo.png" alt="LAPNIX Logo" />
        <span>LAPNIX</span>
      </div>
      <div className="footer-column">
        <h3>Menu</h3>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">Laptop</a></li>
          <li><a href="#">Peripherals</a></li>
          <li><a href="#">About Us</a></li>
        </ul>
      </div>
      <div className="footer-column">
        <h3>Support</h3>
        <ul>
          <li><a href="#">Modes of Payment</a></li>
          <li><a href="#">FAQ</a></li>
        </ul>
      </div>
      <div className="footer-column">
        <h3>Contact</h3>
        <ul>
          <li><a href="#">Contact Us</a></li>
          <li><a href="#">Customer Support</a></li>
          <li><a href="#">Privacy Policy</a></li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;