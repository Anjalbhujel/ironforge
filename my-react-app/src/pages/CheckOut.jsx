import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdVerified } from "react-icons/md";
import "../styles/global.css";
import {
  FaTruck,
  FaCreditCard,
  FaClipboardCheck,
  FaMobileAlt,
  FaMoneyBillWave,
  FaInfoCircle,
  FaCheck,
  FaMapMarkerAlt,
  FaShoppingBag,
} from "react-icons/fa";
// import { getImage } from "../utils/categoryImages";

const PROVINCES = [
  "Koshi Province",
  "Madhesh Province",
  "Bagmati Province",
  "Gandaki Province",
  "Lumbini Province",
  "Karnali Province",
  "Sudurpashchim Province",
];

function Checkout({ cart, clearCart }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [step, setStep] = useState(1);

  const [shipping, setShipping] = useState({
    fullName: user?.name || "",
    phone: "",
    address: "",
    city: "Kathmandu",
    province: "Bagmati Province",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleShippingChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const placeOrder = async () => {
  const token = localStorage.getItem("token");
  const orderData = {
    shipping_address: `${shipping.address}, ${shipping.city}, ${shipping.province}`,
    payment_method: paymentMethod,
    items: cart.map(item => ({
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
    })),
  };

  try {
    // First create the order
    const res = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });
    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Order failed");
      return;
    }

    const orderId = data.order_id;

    // If eSewa payment — redirect to eSewa
    if (paymentMethod === "eSewa") {
      const esewaRes = await fetch("http://localhost:5000/api/esewa/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ amount: subtotal, order_id: orderId })
      });
      const esewaData = await esewaRes.json();

      // Create and submit form to eSewa
      const form = document.createElement("form");
      form.method = "POST";
      form.action = esewaData.esewa_url;

      const fields = {
        amount: subtotal,
        tax_amount: 0,
        total_amount: subtotal,
        transaction_uuid: esewaData.transaction_uuid,
        product_code: esewaData.product_code,
        product_service_charge: 0,
        product_delivery_charge: 0,
        success_url: esewaData.success_url,
        failure_url: esewaData.failure_url,
        signed_field_names: esewaData.signed_field_names,
        signature: esewaData.signature,
      };

      Object.entries(fields).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();

    } else {
      // COD — go to success page directly
      clearCart();
      navigate("/order-success");
    }

  } catch (err) {
    alert("Something went wrong");
  }
};

  return (
    <div className="checkout-page">
      <h1 className="checkout-title">CHECKOUT</h1>

      <div className="checkout-steps">
        <div className={`checkout-step ${step >= 1 ? "active" : ""}`}>
          <div className="step-circle">{step > 1 ? "✓" : "1"}</div>
          <span>Shipping</span>
        </div>
        <div
          className={`checkout-step-line ${step >= 2 ? "active" : ""}`}
        ></div>
        <div className={`checkout-step ${step >= 2 ? "active" : ""}`}>
          <div className="step-circle">{step > 2 ? "✓" : "2"}</div>
          <span>Payment</span>
        </div>
        <div
          className={`checkout-step-line ${step >= 3 ? "active" : ""}`}
        ></div>
        <div className={`checkout-step ${step >= 3 ? "active" : ""}`}>
          <div className="step-circle">3</div>
          <span>Review</span>
        </div>
      </div>

      <div className="checkout-layout">
        <div className="checkout-content">
          {step === 1 && (
            <div className="checkout-card">
              <h2 className="checkout-card-title">
                <FaTruck size={18} color="#ff6b00" /> DELIVERY ADDRESS
              </h2>

              <div className="checkout-form-grid">
                <div className="checkout-field">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={shipping.fullName}
                    onChange={handleShippingChange}
                    placeholder="Full Name"
                  />
                </div>
                <div className="checkout-field">
                  <label>Phone Number *</label>
                  <input
                    type="text"
                    name="phone"
                    value={shipping.phone}
                    onChange={handleShippingChange}
                    placeholder="+977-98XXXXXXXX"
                  />
                </div>
              </div>

              <div className="checkout-field full">
                <label>Street Address *</label>
                <input
                  type="text"
                  name="address"
                  value={shipping.address}
                  onChange={handleShippingChange}
                  placeholder="Tole, Ward No., Locality"
                />
              </div>

              <div className="checkout-form-grid">
                <div className="checkout-field">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={shipping.city}
                    onChange={handleShippingChange}
                    placeholder="Kathmandu"
                  />
                </div>
                <div className="checkout-field">
                  <label>Province *</label>
                  <select
                    name="province"
                    value={shipping.province}
                    onChange={handleShippingChange}
                  >
                    {PROVINCES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                className="checkout-continue-btn"
                onClick={() => {
                  if (
                    !shipping.fullName ||
                    !shipping.phone ||
                    !shipping.address
                  ) {
                    alert("Please fill in all required fields");
                    return;
                  }
                  setStep(2);
                }}
              >
                CONTINUE TO PAYMENT →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="checkout-card">
              <h2 className="checkout-card-title">
                <FaCreditCard size={18} color="#ff6b00" /> PAYMENT METHOD
              </h2>

              <div className="payment-options">
                <div
                  className={`payment-option ${paymentMethod === "eSewa" ? "active" : ""}`}
                  onClick={() => setPaymentMethod("eSewa")}
                >
                  <div className="payment-radio">
                    {paymentMethod === "eSewa" && (
                      <div className="payment-radio-dot"></div>
                    )}
                  </div>
                  <FaMobileAlt
                    size={20}
                    color={paymentMethod === "eSewa" ? "#ff6b00" : "#888"}
                  />
                  <div className="payment-option-text">
                    <p className="payment-option-name">eSewa</p>
                    <p className="payment-option-desc">
                      Pay securely via eSewa mobile wallet
                    </p>
                  </div>
                  {paymentMethod === "eSewa" && (
                    <FaCheck
                      size={14}
                      color="#2e7d32"
                      className="payment-check"
                    />
                  )}
                </div>

                {/* Cash on Delivery */}
                <div
                  className={`payment-option ${paymentMethod === "COD" ? "active" : ""}`}
                  onClick={() => setPaymentMethod("COD")}
                >
                  <div className="payment-radio">
                    {paymentMethod === "COD" && (
                      <div className="payment-radio-dot"></div>
                    )}
                  </div>
                  <FaMoneyBillWave
                    size={20}
                    color={paymentMethod === "COD" ? "#ff6b00" : "#888"}
                  />
                  <div className="payment-option-text">
                    <p className="payment-option-name">Cash on Delivery</p>
                    <p className="payment-option-desc">
                      Pay when you receive the order
                    </p>
                  </div>
                  {paymentMethod === "COD" && (
                    <FaCheck
                      size={14}
                      color="#2e7d32"
                      className="payment-check"
                    />
                  )}
                </div>
              </div>

              {paymentMethod === "eSewa" && (
                <div className="payment-instruction">
                  <p className="payment-instruction-title">
                    <FaInfoCircle size={14} color="#2e7d32" /> eSewa Payment
                    Instructions
                  </p>
                  <p className="payment-instruction-text">
                    After placing your order, you'll receive our eSewa ID
                    (9851XXXXXX) to complete the payment. Send the exact amount
                    and share the screenshot via WhatsApp.
                  </p>
                </div>
              )}

              <div className="checkout-step-buttons">
                <button
                  className="checkout-back-btn"
                  onClick={() => setStep(1)}
                >
                  ← Back
                </button>
                <button
                  className="checkout-continue-btn"
                  onClick={() => setStep(3)}
                >
                  REVIEW ORDER →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="checkout-card">
              <h2 className="checkout-card-title">
                <FaClipboardCheck size={18} color="#ff6b00" /> REVIEW YOUR ORDER
              </h2>

              {/* Delivery Address */}
              <div className="review-section">
                <div className="review-section-header">
                  <h3>
                    <FaMapMarkerAlt size={14} color="#ff6b00" /> Delivery
                    Address
                  </h3>
                  <span onClick={() => setStep(1)}>Edit</span>
                </div>
                <p className="review-detail">{shipping.fullName}</p>
                <p className="review-detail">{shipping.phone}</p>
                <p className="review-detail">
                  {shipping.address}, {shipping.city}, {shipping.province}
                </p>
              </div>

              {/* Payment Method */}
              <div className="review-section">
                <div className="review-section-header">
                  <h3>
                    <FaCreditCard size={14} color="#ff6b00" /> Payment Method
                  </h3>
                  <span onClick={() => setStep(2)}>Edit</span>
                </div>
                <p className="review-detail">
                  {paymentMethod === "COD" ? "Cash on Delivery" : paymentMethod}
                </p>
              </div>

              {/* Order Items */}
              <div className="review-section">
                <div className="review-section-header">
                  <h3>
                    <FaShoppingBag size={14} color="#ff6b00" /> Order Items (
                    {cart.length})
                  </h3>
                </div>
                {cart.map((item) => (
                  <div key={item.id} className="review-item">
                    <div className="review-item-left">
                      <img
                        src={
                          item.image_url ||
                          `https://via.placeholder.com/48x48?text=${item.name[0]}`
                        }
                        alt={item.name}
                        className="review-item-img"
                      />
                      <div>
                        <p className="review-item-name">{item.name}</p>
                        <p className="review-item-qty">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="review-item-price">
                      Rs.{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="checkout-step-buttons">
                <button
                  className="checkout-back-btn"
                  onClick={() => setStep(2)}
                >
                  ← Back
                </button>
                <button className="checkout-place-btn" onClick={placeOrder}>
                  <FaCheck size={14} /> PLACE ORDER · Rs.
                  {subtotal.toLocaleString()}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="cart-summary">
          <h2 className="cart-summary-title">ORDER SUMMARY</h2>
          {cart.map((item) => (
            <div key={item.id} className="checkout-summary-item">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>Rs.{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div className="cart-summary-divider"></div>
          <div className="cart-summary-row">
            <span>Subtotal</span>
            <span>Rs.{subtotal.toLocaleString()}</span>
          </div>
          <div className="cart-summary-row">
            <span>Shipping</span>
            <span className="cart-free">Free</span>
          </div>
          <div className="cart-summary-divider"></div>
          <div className="cart-summary-total">
            <span>Total</span>
            <span>Rs.{subtotal.toLocaleString()}</span>
          </div>
          <div className="checkout-secure">
            <MdVerified size={14} color="#2e7d32" /> Secure & encrypted checkout
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
