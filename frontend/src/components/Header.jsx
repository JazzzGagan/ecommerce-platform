import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { IoMdArrowDropdown } from "react-icons/io";
import { useCart } from "../context/CartContext.jsx";
import "./Header.css";
//import logo from "../assets/logos/Group 2.svg";
import API from "../api/api";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("all");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { items, itemCount, total, removeFromCart } = useCart();
  console.log(categories)

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
      (c) => c.parent?._id === parentId || c.parent === parentId,
    );
  const getProductsBySubCategory = (subCategoryId) =>
    products.filter(
      (p) => p.category?._id === subCategoryId || p.category === subCategoryId,
    );
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredProducts = normalizedQuery
    ? products.filter((p) => {
        const nameMatch = p.name?.toLowerCase().includes(normalizedQuery);
        if (!nameMatch) return false;
        if (searchCategory === "all") return true;
        const productCategory = p.category?.slug || p.category?.name || "";
        return productCategory.toLowerCase() === searchCategory.toLowerCase();
      })
    : [];

  const suggestions = filteredProducts.slice(0, 6);

  return (
    <header className="main-header">
      <div className="header-container">
        <Link to="/">
          <div className="header-logo">
            {/* <img src={logo} alt="Bites and B" /> */}
          </div>
        </Link>

        <div
          className="header-search"
          role="search"
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        >
          <div className="search-group">
            <input
              type="text"
              placeholder="Search"
              aria-label="Search products"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="search-divider" />
            <select
              aria-label="Search category"
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {mainCategories.map((c) => (
                <option key={c._id || c.id} value={c.slug || c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            className="search-btn"
            aria-label="Search"
            onClick={() => setShowSuggestions(true)}
          >
            Search
          </button>
          {showSuggestions && normalizedQuery && (
            <div className="search-suggestions">
              {suggestions.length === 0 ? (
                <div className="search-empty">No matching products</div>
              ) : (
                suggestions.map((p) => (
                  <Link
                    key={p._id}
                    to={`/product/${p._id}`}
                    className="search-suggestion"
                    onClick={() => {
                      setShowSuggestions(false);
                      setSearchQuery("");
                    }}
                  >
                    <img src={p.image || p.images?.[0] || ""} alt={p.name} />
                    <div className="search-suggestion-info">
                      <span className="search-suggestion-name">{p.name}</span>
                      <span className="search-suggestion-price">
                        ${p.price}
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}
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

          <div className="cart-wrapper">
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
              {itemCount > 0 && (
                <span className="cart-badge" aria-label="Cart items">
                  {itemCount}
                </span>
              )}
            </button>
            <div className="mini-cart">
              {items.length === 0 ? (
                <div className="mini-cart-empty">Your cart is empty</div>
              ) : (
                <>
                  <div className="mini-cart-items">
                    {items.slice(0, 4).map((item) => (
                      <div key={item.productId} className="mini-cart-item">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="mini-cart-thumb"
                        />
                        <div className="mini-cart-info">
                          <span className="mini-cart-name">{item.name}</span>
                          <span className="mini-cart-meta">
                            {item.quantity} × ${item.price}
                          </span>
                        </div>
                        <button
                          className="mini-cart-remove"
                          onClick={() => removeFromCart(item.productId)}
                          aria-label="Remove item"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mini-cart-total">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="mini-cart-actions">
                    <Link to="/cart" className="mini-cart-view">
                      View Cart
                    </Link>
                    <Link to="/checkout" className="mini-cart-checkout">
                      Checkout
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>

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
                const childCategories = getSubCategories(sub._id);
                return (
                  <div key={sub._id} className="submenu-column">
                    <NavLink
                      to={`/category/${sub.slug || sub.name}`}
                      className="submenu-title"
                    >
                      {sub.name}
                    </NavLink>
                    {childCategories.length > 0 && (
                      <ul>
                        {childCategories.map((child) => (
                          <li key={child._id}>
                            <NavLink
                              to={`/category/${child.slug || child.name}`}
                              className="submenu-link"
                              onClick={() => {
                                setActiveCategory(null);
                                setIsMenuOpen(false);
                              }}
                            >
                              {child.name}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
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
