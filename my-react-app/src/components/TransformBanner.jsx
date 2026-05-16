import { useNavigate } from "react-router-dom";
import "../styles/global.css";

function TransformBanner() {
  const navigate = useNavigate();

  return (
    <div className="transform-wrapper">
    <div className="transform-banner">

      <div className="transform-overlay"></div>

      <div className="transform-content">
        <div className="transform-left">
          <h2 className="transform-title">
            READY TO <span className="orange">TRANSFORM?</span>
          </h2>
          <p className="transform-desc">
            Get personalized product recommendations based on your BMI and fitness goals.
          </p>
        </div>
        <div className="transform-buttons">
          <button
            className="transform-btn-primary"
            onClick={() => navigate("/bmi")}
          >
            Calculate My BMI
          </button>
          <button
            className="transform-btn-secondary"
            onClick={() => navigate("/products")}
          >
            Shop Now
          </button>
        </div>
      </div>

    </div>
    </div>
  );
}

export default TransformBanner;