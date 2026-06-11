import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";
import "../styles/global.css";

function PaymentFailure() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (!params.toString()) {
      navigate("/");
    }
  }, []);

  return (
    <div className="payment-result-page">
      <div className="payment-result-card">
        <div className="payment-result-icon">
          <FaTimesCircle size={64} color="#e53935" />
        </div>
        <h2 className="payment-failed-title">Payment Failed</h2>
        <p className="payment-result-desc">
          Your eSewa payment was cancelled or failed. No charges were made.
        </p>
        <div className="payment-result-buttons">
          <button onClick={() => navigate("/cart")} className="payment-primary-btn">
            Back to Cart
          </button>
          <button onClick={() => navigate("/")} className="payment-secondary-btn">
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentFailure;