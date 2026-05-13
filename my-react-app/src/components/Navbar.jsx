import "../styles/global.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar({ cartCount }) {

const user = JSON.parse(localStorage.getItem("user"));
const navigate = useNavigate();

const [scrolled, setScrolled] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    if (window.scrollY > 50) {
      setScrolled(true);
    }else {
      setScrolled(false);
    }
  };

  window.addEventListener("scroll", handleScroll);
  return () => {window.removeEventListener("scroll", handleScroll)};
}, []);

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  alert("Logged out successfully!");
  window.location.reload();
  navigate("/");
};

return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : "navbar-top"}`}>
        
        <Link to="/" className="nav-logo">
          <div className="nav-logo-icon">⚡</div>
          <span className="nav-logo-text">
            <span style={{ color: "white" }}>Iron</span>Forge
            </span>
        </Link>

        <div className="nav-links">
          <Link to="/products" className="nav-link">AllProducts</Link>
          <Link to="/products?category=gym-gears" className="nav-link">Gym Gears</Link>
          <Link to="/products?category=supplements" className="nav-link">Supplements</Link>
          <Link to="/products?category=accessories" className="nav-link">Accessories</Link>
          <Link to="/products?category=cardio" className="nav-link">Cardio</Link>
        </div>  

        <div className="nav-right">
          <button className="nav-icon-btn">
            🔍
          </button>

           <Link to="/cart" className="nav-icon-btn cart-icon">
          🛒
          {cartCount > 0 && (
            <span className="cart-badge">{cartCount}</span>
          )}
          </Link>
        
          {user ? (
            <div className="nav-user-area">
            <span className="nav-username">👤 {user.name}</span>
            <button className="nav-signout-btn" onClick={handleLogout}>
              Sign Out
            </button>
            </div>
            ) : (
            <Link to="/login" className="nav-signin-btn">
            👤 Sign In
            </Link>
          )}
        </div>
    </nav>
  );
}

export default Navbar; 