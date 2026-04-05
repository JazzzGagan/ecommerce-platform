import { Link } from "react-router-dom";
import {
  FiUser,
  FiMapPin,
  FiPackage,
  FiHeart,
  FiStar,
  FiMail,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import "./Account.css";

const Account = () => {
  const { user } = useAuth();
  const displayName =
    user?.firstName || user?.fullName || user?.email || "User";

  const menuItems = [
    {
      title: "Personal Info",
      icon: <FiUser />,
      to: "/account",
    },
    {
      title: "Address Book",
      icon: <FiMapPin />,
      to: "/account/address-book",
    },
    {
      title: "My Orders",
      icon: <FiPackage />,
      to: "/account/orders",
    },
    {
      title: "Wishlist",
      icon: <FiHeart />,
      to: "/account/wishlist",
    },
    {
      title: "My Product Reviews",
      icon: <FiStar />,
      to: "/account/reviews",
    },
    {
      title: "Newsletter Subscription",
      icon: <FiMail />,
      to: "/account/newsletter",
    },
  ];

  const activeItem = "Personal Info";

  return (
    <div className="account-page">
      <div className="account-layout">
        <aside className="account-sidebar">
          <div className="account-sidebar-title">My Account</div>
          <nav className="account-menu">
            {menuItems.map((item) => (
              <Link
                key={item.title}
                to={item.to}
                className={`account-menu-item ${
                  activeItem === item.title ? "active" : ""
                }`}
              >
                <span className="account-menu-icon">{item.icon}</span>
                <span>{item.title}</span>
              </Link>
            ))}
          </nav>
        </aside>

        <section className="account-panel">
          <div className="account-panel-header">
            <h1>Personal Information</h1>
            <Link to="/account-info" className="account-edit">
              Edit
            </Link>
          </div>

          <div className="account-card-panel">
            <div className="account-card-title">Personal Info</div>
            <div className="account-info-grid">
              <div className="account-info-row">
                <span className="label">Full Name</span>
                <span className="value">{displayName}</span>
              </div>
              <div className="account-info-row">
                <span className="label">Email</span>
                <span className="value">{user?.email || "-"}</span>
              </div>
              <div className="account-info-row">
                <span className="label">Mobile No.</span>
                <span className="value">{user?.phone || "-"}</span>
              </div>
              <div className="account-info-row">
                <span className="label">Birthday</span>
                <span className="value">-</span>
              </div>
              <div className="account-info-row">
                <span className="label">Gender</span>
                <span className="value">-</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Account;
