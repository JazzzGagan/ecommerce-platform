import "./TopBar.css";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const TopBar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const displayName = user?.firstName || user?.email || "User";

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="top-bar">
      <div className="top-bar-container">
        <div className="top-bar-left">
          <span className="help-text">Need help?</span>
          <a href="tel:01-5350440" className="help-phone">
            01-5350440
          </a>
          <span className="separator">|</span>
          <Link to="/contact" className="contact-link">
            Contact
          </Link>
        </div>
        <div className="top-bar-right">
          {isAuthenticated ? (
            <>
              <span className="account-link">Hi, {displayName}</span>
              <button
                type="button"
                className="sign-in-link"
                onClick={handleLogout}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/signup" className="account-link">
                Register
              </Link>
              <Link to="/login" className="sign-in-link">
                Sign in
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
