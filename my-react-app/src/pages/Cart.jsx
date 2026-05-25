import { useNavigate } from "react-router-dom";
import "../styles/global.css";
import { FiTrash2, FiArrowLeft, FiShoppingCart } from "react-icons/fi";
import { CATEGORY_IMAGES } from "../utils/categoryImages";

function getImage(product) {
  if (product.image_url) return product.image_url;
  const imgs = CATEGORY_IMAGES[product.category_name] || CATEGORY_IMAGES["Gym Gears"];
  return imgs[product.id % imgs.length];
}

function Cart({ cart, increaseQty, decreaseQty, removeFromCart }) {
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Empty cart
  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-header-section">
          <h1 className="cart-title">SHOPPING <span className="orange">CART</span></h1>
          <p className="cart-subtitle">0 items in your cart</p>
        </div>
        <div className="cart-empty">
          <FiShoppingCart size={80} color="#dddddd" />
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything yet.</p>
          <button className="cart-continue-btn" onClick={() => navigate("/products")}>
            ← Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">

      {/* Header */}
      <div className="cart-header-section">
        <h1 className="cart-title">SHOPPING <span className="orange">CART</span></h1>
        <p className="cart-subtitle">{totalItems} item{totalItems > 1 ? "s" : ""} in your cart</p>
      </div>

      <div className="cart-layout">

        {/* Left — Cart Items */}
        <div className="cart-items-section">

          {/* Table Header */}
          <div className="cart-table-header">
            <span>PRODUCT</span>
            <span>PRICE</span>
            <span>QTY</span>
            <span>TOTAL</span>
          </div>

          {/* Cart Items */}
          {cart.map(item => (
            <div key={item.id} className="cart-item">

              {/* Product info */}
              <div className="cart-item-product">
                <img
                  src={getImage(item)}
                  alt={item.name}
                  className="cart-item-img"
                  onClick={() => navigate(`/products/${item.id}`)}
                />
                <div className="cart-item-details">
                  <p className="cart-item-category">{item.category_name}</p>
                  <p className="cart-item-name" onClick={() => navigate(`/products/${item.id}`)}>
                    {item.name}
                  </p>
                  <p className="cart-item-stock">● In Stock</p>
                  <button
                    className="cart-item-remove"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <FiTrash2 size={12} /> Remove
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="cart-item-price">
                Rs.{Number(item.price).toLocaleString()}
              </div>

              {/* Quantity */}
              <div className="cart-item-qty">
                <button onClick={() => decreaseQty(item.id)}>−</button>
                <span>{item.quantity}</span>
                <button onClick={() => increaseQty(item.id)}>+</button>
              </div>

              {/* Total */}
              <div className="cart-item-total">
                Rs.{(Number(item.price) * item.quantity).toLocaleString()}
              </div>

            </div>
          ))}

          {/* Continue Shopping */}
          <div className="cart-continue" onClick={() => navigate("/products")}>
            <FiArrowLeft size={14} /> Continue Shopping
          </div>

        </div>

        {/* Right — Order Summary */}
        <div className="cart-summary">
          <h2 className="cart-summary-title">ORDER SUMMARY</h2>

          <div className="cart-summary-row">
            <span>Subtotal ({totalItems} items)</span>
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
          <p className="cart-summary-tax">Inclusive of all taxes</p>

          <button className="cart-checkout-btn" onClick={() => navigate("/checkout")}>
            PROCEED TO CHECKOUT →
          </button>

          {/* Payment methods */}
          <p className="cart-payment-label">Accepted Payment Methods</p>
          <div className="cart-payment-methods">
            <span className="cart-payment-badge">eSewa</span>
            <span className="cart-payment-badge">Cash on Delivery</span>
            <span className="cart-payment-badge">Bank Transfer</span>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Cart;