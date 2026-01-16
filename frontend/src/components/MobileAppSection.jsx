import './MobileAppSection.css';

const MobileAppSection = () => {
  return (
    <section className="mobile-app-section">
      <div className="container">
        <div className="app-content">
          <div className="app-text">
            <h2 className="app-title">Take Your Experience to the Next Level</h2>
            <p className="app-subtitle">Download from the App store & Play Store</p>
            <div className="app-buttons">
              <a href="#" className="app-button app-store">
                <span className="app-button-text">Download on the</span>
                <span className="app-button-store">App Store</span>
              </a>
              <a href="#" className="app-button play-store">
                <span className="app-button-text">Download on the</span>
                <span className="app-button-store">Google Play</span>
              </a>
            </div>
          </div>
          <div className="app-image">
            <div className="phone-mockup"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileAppSection;

