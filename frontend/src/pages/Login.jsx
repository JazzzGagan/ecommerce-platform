import "./login.css";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-page">
      <h2 className="login-title">CUSTOMER LOGIN</h2>

      <div className="login-card">
        <button className="google-btn">
          <FaGoogle className="google-icon" />
          Continue with Google
        </button>

        <div className="divider">
          <span>OR</span>
        </div>

        <div className="form-group">
          <label>
            Email <span>*</span>
          </label>
          <input type="email" placeholder="Enter your email" />
        </div>

        <div className="form-group">
          <label>
            Password <span>*</span>
          </label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="********"
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        <a href="#" className="forgot-link">
          Forgot your password?
        </a>

        <button className="login-btn">Sign In</button>

        <p className="register-text">
          Don't have an account? <Link to="/signup">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
