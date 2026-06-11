import "../styles/global.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FiSearch, FiShoppingCart, FiUser } from "react-icons/fi";
import { FaBolt, FaTachometerAlt, FaShoppingBag, FaCalculator, FaSignOutAlt } from "react-icons/fa"; // ← add these

function Navbar({ cartCount }) {

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const isHomePage = location.pathname === "/";
  const isTransparent = isHomePage && !scrolled;

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  return (
    <nav className={`navbar ${isTransparent ? "navbar-top" : "navbar-scrolled"}`}>

      <Link to="/" className="nav-logo">
        <div className="nav-logo-icon">
          <FaBolt size={16} color="white" />
        </div>
        <span className="nav-logo-text">
          <span style={{ color: "white" }}>Iron</span>Forge
        </span>
      </Link>

      <div className="nav-links">
        <Link to="/products" className="nav-link">All Products</Link>
        <Link to="/products?category=gym-gears" className="nav-link">Gym Gears</Link>
        <Link to="/products?category=supplements" className="nav-link">Supplements</Link>
        <Link to="/products?category=accessories" className="nav-link">Accessories</Link>
        <Link to="/products?category=cardio" className="nav-link">Cardio</Link>
      </div>

      <div className="nav-right">
        <button className="nav-icon-btn">
          <FiSearch size={20} />
        </button>

        <Link to="/cart" className="nav-icon-btn cart-icon">
          <FiShoppingCart size={20} />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>

        {user ? (
          <div className="nav-user-dropdown" ref={dropdownRef}>
            <div
              className="nav-avatar"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {getInitials(user.name)}
            </div>

            {dropdownOpen && (
              <div className="nav-dropdown">
                <div className="dropdown-user-info">
                  <p className="dropdown-user-name">{user.name}</p>
                  <p className="dropdown-user-email">{user.email}</p>
                </div>

                <div className="dropdown-divider"></div>
{user?.role === "admin" && (
  <Link to="/admin" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
    <FaBolt size={14} color="#ff6b00" />
    Admin Panel
  </Link>
)}
                <Link to="/dashboard" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  <FaTachometerAlt size={14} color="#ff6b00" />
                  My Dashboard
                </Link>
                <Link to="/dashboard?tab=orders" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  <FaShoppingBag size={14} color="#ff6b00" />
                  My Orders
                </Link>
                <Link to="/bmi" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  <FaCalculator size={14} color="#ff6b00" />
                  BMI Calculator
                </Link>

                <div className="dropdown-divider"></div>

                <button className="dropdown-logout" onClick={handleLogout}>
                  <FaSignOutAlt size={14} />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="nav-signin-btn">
            <FiUser size={14} /> Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;