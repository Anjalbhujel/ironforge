import { useNavigate } from "react-router-dom";
import { FaBox, FaTruck, FaMobile, FaCheckCircle, FaShoppingBag, FaHome } from "react-icons/fa";
import "../styles/global.css";

function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div className="success-page">
      <div className="success-card">

        <div className="success-icon">
          <FaCheckCircle size={64} color="#2e7d32" />
        </div>

        <h1 className="success-title">Order Placed Successfully!</h1>
        <p className="success-desc">
          Thank you for your order! We'll process it shortly and notify you when it's on its way.
        </p>

        <div className="success-info">
          <p><FaBox color="#f57f17"/> Your order is being processed</p>
          <p><FaTruck color="#f57f17" /> Estimated delivery: 1-3 business days</p>
          <p><FaMobile color="#f57f17" /> You'll receive updates via phone</p>
        </div>

        <div className="success-buttons">
          <button
            className="success-btn-primary"
            onClick={() => navigate("/products")}
          >
            <FaShoppingBag size={14} /> Continue Shopping
          </button>
          <button
            className="success-btn-secondary"
            onClick={() => navigate("/")}
          >
            <FaHome size={14} /> Back to Home
          </button>
        </div>

      </div>
    </div>
  );
}

export default OrderSuccess;