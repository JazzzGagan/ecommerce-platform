import './TopBar.css';

const TopBar = () => {
  return (
    <div className="top-bar">
      <div className="top-bar-container">
        <div className="top-bar-left">
          <span className="help-text">Need help?</span>
          <a href="tel:01-5350440" className="help-phone">01-5350440</a>
          <span className="separator">|</span>
          <a href="/contact" className="contact-link">Contact</a>
        </div>
        <div className="top-bar-right">
          <a href="/account" className="account-link">My Account</a>
          <a href="/login" className="sign-in-link">Sign in</a>
        </div>
      </div>
    </div>
  );
};

export default TopBar;

