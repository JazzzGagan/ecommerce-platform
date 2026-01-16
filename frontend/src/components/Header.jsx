import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { IoMdArrowDropdown } from "react-icons/io";
import "./Header.css";
import logo from "../assets/logos/Group 2.svg";
import API from "../api/api";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    API.get(`/categories`)
      .then((res) => setCategories(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));

    API.get(`/products`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  const mainCategories = categories.filter((c) => !c.parent);

  const getSubCategories = (parentId) =>
    categories.filter(
      (c) => c.parent?._id === parentId || c.parent === parentId
    );
  const getProductsBySubCategory = (subCategoryId) =>
    products.filter(
      (p) => p.category?._id === subCategoryId || p.category === subCategoryId
    );
  console.log("products", products);

  return (
    <header className="main-header">
      <div className="header-container">
        <div className="header-logo">
          <img src={logo} alt="Bites and B" />
        </div>

        <div className="header-actions">
          <button className="compare-btn" aria-label="Compare">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <span>Compare</span>
          </button>

          <button className="cart-btn" aria-label="Shopping cart">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <span>Shopping cart</span>
          </button>

          <button className="wishlist-btn" aria-label="My Wish List">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span>My Wish List</span>
          </button>
        </div>

        <button
          className={`mobile-menu-toggle ${isMenuOpen ? "active" : ""}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <nav
        className={`main-nav ${isMenuOpen ? "active" : ""}`}
        onMouseLeave={() => setActiveCategory(null)}
      >
        <div className="nav-container">
          <ul className="nav-menu">
            {mainCategories.slice(0, 7).map((c) => {
              const categoryId = c._id || c.id;

              return (
                <li
                  key={categoryId}
                  className="nav-item"
                  onMouseEnter={() => setActiveCategory(categoryId)}
                >
                  <NavLink
                    to={`/category/${c.slug || c.name}`}
                    className="nav-link"
                  >
                    {c.name}
                    {getSubCategories(categoryId).length > 0 && (
                      <IoMdArrowDropdown style={{ marginLeft: "2px" }} />
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>

        {activeCategory && getSubCategories(activeCategory).length > 0 && (
          <div className="submenu full-width">
            <div className="submenu-container">
              {getSubCategories(activeCategory).map((sub) => {
                const products = getProductsBySubCategory(sub._id);
                return (
                  <div key={sub._id} className="submenu-column">
                    <NavLink
                      to={`/category/${sub.slug || sub.name}`}
                      className="submenu-title"
                    >
                      {sub.name}
                    </NavLink>
                    <ul>
                      {products.map((p) => (
                        <li key={p._id}>
                          <NavLink
                            to={`/product/${p.slug || p.name}`}
                            className="submenu-link"
                          >
                            {p.name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      <div className="mobile-nav-icons">
        <a href="/" className="mobile-nav-icon" aria-label="Home">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </a>
        <button className="mobile-nav-icon" aria-label="Search">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </button>
        <a href="/custom-pc" className="mobile-nav-icon" aria-label="Custom PC">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
        </a>
        <button className="mobile-nav-icon" aria-label="Cart">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
        </button>
        <button className="mobile-nav-icon" aria-label="Account">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
