import "../styles/global.css";
import { Link } from "react-router-dom";

function HeroSection() {
return (
   <div className="hero">
    <div className="hero-overlay"></div>
      <div className="hero-content">  
        <div className="hero-badge">
            ● NEW COLLECTION 2026 – SHOP NOW
        </div>

        <h1 className="hero-title">
          TRAIN HARD. <br /> 
          <span className="hero-title-orange">LIVE STRONG</span>
        </h1>

        <p className="hero-description">
           Nepal's premier gym gear & supplements store. From Olympic <br />
          barbells to performance supplements — everything you need to <br />
          crush your fitness goals.
        </p>

        <div className="hero-buttons">
          <Link to="/products" className="hero-btn-primary">
            SHOP ALL PRODUCTS →
          </Link>

          <Link to="/bmi" className="hero-btn-secondary">
            ▦ BMI CALCULATOR
          </Link>
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <span className="stat-number">500+</span>
            <span className="stat-label">Products</span>
          </div>
          <div className="hero-stat">
            <span className="stat-number">10K+</span>
            <span className="stat-label">Happy Customers</span>
          </div>
          <div className="hero-stat">
            <span className="stat-number">4.8★</span>
            <span className="stat-label">AVG RATING</span>
          </div>
          <div className="hero-stat">
            <span className="stat-number-orange">Free</span>
            <span className="stat-label">DELIVERY OVER RS.5000</span>
          </div>
        </div>
     </div>

      <div className="hero-scroll">
        SCROLL
        <div className="hero-scroll-arrow">↓</div>
      </div>
      
   </div>
);
}

export default HeroSection;