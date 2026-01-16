import './Footer.css';

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-main">
        <div className="container">
          <div className="footer-content">
            <div className="footer-column">
              <h3 className="footer-heading">Support</h3>
              <div className="footer-info">
                <p>
                  <a href="mailto:sales@computerworld.com">sales@computerworld.com</a>
                </p>
                <p>
                  <a href="tel:01-5350440">01-5350440</a> / <a href="tel:01-5911594">01-5911594</a>
                </p>
              </div>
            </div>

            <div className="footer-column">
              <h3 className="footer-heading">Categories</h3>
              <ul className="footer-links">
                <li><a href="/gaming">Gaming</a></li>
                <li><a href="/desktop-server">Desktop & Server</a></li>
                <li><a href="/monitors">Monitors</a></li>
                <li><a href="/accessories">Accessories</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-heading">About Us</h3>
              <ul className="footer-links">
                <li><a href="/about">About Us</a></li>
                <li><a href="/terms">Terms & Conditions</a></li>
                <li><a href="/warranty">Warranty</a></li>
                <li><a href="/privacy">Privacy Policy</a></li>
                <li><a href="/blog">Blog</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-heading">Customer Service</h3>
              <ul className="footer-links">
                <li><a href="/refund">Refund & Return Policy</a></li>
                <li><a href="/account">My Account</a></li>
                <li><a href="/contact">Contact Us</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-heading">Newsletter</h3>
              <p className="newsletter-text">Trade Alert - Delivering the latest product trends and industry news straight to your inbox.</p>
              <form className="newsletter-form">
                <input type="email" placeholder="Enter your email" className="newsletter-input" />
                <button type="submit" className="newsletter-submit">Subscribe</button>
              </form>
              <div className="social-icons">
                <a href="#" className="social-icon" aria-label="Facebook">f</a>
                <a href="#" className="social-icon" aria-label="Twitter">t</a>
                <a href="#" className="social-icon" aria-label="Pinterest">p</a>
                <a href="#" className="social-icon" aria-label="YouTube">y</a>
                <a href="#" className="social-icon" aria-label="Instagram">i</a>
              </div>
            </div>
          </div>

          <div className="payment-methods">
            <div className="payment-icons">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="payment-icon"></div>
              ))}
            </div>
          </div>

          <div className="store-locations">
            <h3>Find our store</h3>
            <div className="store-icons">
              <div className="store-icon"></div>
              <div className="store-icon"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p className="footer-description">
            Buying a laptop in Nepal can be a tough job. Due to the small market, computer stores always bring just a few models of laptops and all with limited stock. So chances of finding a laptop that fits your requirements are feeble. And if you further look at the laptop price in Nepal, you will be shocked to see it being exorbitantly high. Limited availability and the high price of the laptops has definitely created an inconvenience amongst the customers. With a view to solving this problem, Computer World Pvt Ltd was established.
          </p>
          <p className="footer-description">
            In our 15 years of illustrious journey, we always strived to provide the best of our services. With a wide variety of products and a reasonable price, we definitely have made big efforts to provide the best laptops to our customers at the best price. So acknowledging our untiring efforts to keep the customers happy, Computer World Pvt Ltd is often lauded as the best place to buy laptops in Nepal.
          </p>
          <p className="footer-description">
            Although our store is located in Putalisadak, Kathmandu, our service is not just limited to valley dwellers. To ensure convenience for the people outside the Kathmandu valley, we have a free shipping service. And to further improve your online purchasing experience, we are also offering 7-days no questions asked return policy. So we've got you all covered.
          </p>
          <p className="copyright">
            Computer World Pvt. Ltd. © 2026. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

