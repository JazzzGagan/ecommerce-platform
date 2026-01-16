import { useState } from "react";
import "./test.css";

export default function Header() {
  const [activeMenu, setActiveMenu] = useState(null);

  return (
    <header className="header">
      <nav className="nav">
        <ul className="nav-menu">
          {/* CATEGORY (MEGA MENU) */}
          <li
            className="nav-item"
            onMouseEnter={() => setActiveMenu("category")}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <span className="nav-link">Categories</span>

            {activeMenu === "category" && (
              <div className="submenu full-width">
                <div className="mega-grid">
                  <div>
                    <h4>Laptops</h4>
                    <p>Dell</p>
                    <p>HP</p>
                    <p>Lenovo</p>
                  </div>

                  <div>
                    <h4>Accessories</h4>
                    <p>Mouse</p>
                    <p>Keyboard</p>
                    <p>Headphones</p>
                  </div>

                  <div>
                    <h4>Gaming</h4>
                    <p>MSI</p>
                    <p>Asus</p>
                    <p>Acer</p>
                  </div>
                </div>
              </div>
            )}
          </li>

          {/* ACCOUNT (NORMAL DROPDOWN) */}
          <li
            className="nav-item"
            onMouseEnter={() => setActiveMenu("account")}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <span className="nav-link">Account</span>

            {activeMenu === "account" && (
              <div className="submenu">
                <ul className="dropdown">
                  <li>Profile</li>
                  <li>Orders</li>
                  <li>Logout</li>
                </ul>
              </div>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}
