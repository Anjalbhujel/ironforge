import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "../styles/global.css";

function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    // eSewa sends back encoded data
    const data = searchParams.get("data");
    if (!data) {
      navigate("/");
      return;
    }

      try {
        const decoded = JSON.parse(atob(data));
        console.log("eSewa response:", decoded);
        if (decoded.status === "COMPLETE") {
          setStatus("success");
          localStorage.removeItem("cart");
        } else {
          setStatus("failed");
        }
      } catch {
        setStatus("failed");
      }
  }, []);

  return (
    <div className="payment-result-page">
      <div className="payment-result-card">
        {status === "verifying" && (
          <>
            <div className="payment-result-icon">⏳</div>
            <h2>Verifying Payment...</h2>
            <p>Please wait while we confirm your payment.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="payment-result-icon">
              <FaCheckCircle size={64} color="#2e7d32" />
            </div>
            <h2 className="payment-success-title">Payment Successful!</h2>
            <p className="payment-result-desc">
              Your eSewa payment has been confirmed. Your order is being processed.
            </p>
            <div className="payment-result-info">
              <p>📦 Order is being processed</p>
              <p>🚚 Estimated delivery: 1-3 business days</p>
            </div>
            <div className="payment-result-buttons">
              <button onClick={() => navigate("/dashboard?tab=orders")} className="payment-primary-btn">
                View My Orders
              </button>
              <button onClick={() => navigate("/products")} className="payment-secondary-btn">
                Continue Shopping
              </button>
            </div>
          </>
        )}

        {status === "failed" && (
          <>
            <div className="payment-result-icon">
              <FaTimesCircle size={64} color="#e53935" />
            </div>
            <h2 className="payment-failed-title">Payment Failed</h2>
            <p className="payment-result-desc">
              Your payment was not completed. Please try again.
            </p>
            <button onClick={() => navigate("/cart")} className="payment-primary-btn">
              Back to Cart
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default PaymentSuccess;