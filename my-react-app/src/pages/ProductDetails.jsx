import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaTruck, FaShieldAlt, FaBox, FaHeadset, FaTrophy, FaUndo, FaShoppingCart} from "react-icons/fa";
import "../styles/global.css";
import { getImage } from "../utils/categoryImages";

function ProductDetail({ addToCart, products }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="pd-loading">Loading...</div>;
  if (!product) return <div className="pd-loading">Product not found.</div>;

  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  const related = products
    .filter(
      (p) => p.category_name === product.category_name && p.id !== product.id,
    )
    .slice(0, 3);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    alert(`${quantity} x ${product.name} added to cart!`);
  };

  return (
    <div className="pd-page">
      <div className="pd-main">
        <div className="pd-image-section">
          <div className="pd-badges">
            <span className="pd-badge-featured">FEATURED</span>
            <span className="pd-badge-sale">SALE</span>
          </div>
          <img
            src={getImage(product)}
            alt={product.name}
            className="pd-image"
          />
        </div>

        <div className="pd-info">
          <p className="pd-category">{product.category_name}</p>

          <h1 className="pd-name">{product.name}</h1>

          <div className="pd-stars">
            <span className="pd-star-icons">★★★★☆</span>
            <span className="pd-star-score">4.8</span>
            <span className="pd-star-count">(reviews)</span>
          </div>

          <div className="pd-price-row">
            <span className="pd-price">
              Rs.{Number(product.price).toLocaleString()}
            </span>
            <span className="pd-price-old">
              Rs.{(Number(product.price) * 1.2).toLocaleString()}
            </span>
            <span className="pd-save">
              Save Rs.{(Number(product.price) * 0.2).toLocaleString()}
            </span>
          </div>

          <p className="pd-desc">{product.description}</p>

          <div className="pd-stock">
            {isOutOfStock ? (
              <span className="stock-out">● Out of Stock</span>
            ) : isLowStock ? (
              <span className="stock-low">● Only {product.stock} left!</span>
            ) : (
              <span className="stock-in">
                ● In Stock ({product.stock} available)
              </span>
            )}
          </div>

          <div className="pd-quantity-row">
            <span className="pd-qty-label">Quantity:</span>
            <div className="pd-qty-controls">
              <button
                className="pd-qty-btn"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span className="pd-qty-num">{quantity}</span>
              <button
                className="pd-qty-btn"
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </button>
            </div>
            <span className="pd-qty-total">
              = Rs.{(Number(product.price) * quantity).toLocaleString()}
            </span>
          </div>

          <div className="pd-buttons">
            <button
              className="pd-add-btn"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              <FaShoppingCart size={16} /> Add to Cart
            </button>
            <button className="pd-buy-btn" disabled={isOutOfStock}>
              ⚡ Buy Now
            </button>
          </div>

          <div className="pd-trust">
            <div className="pd-trust-item">
              <FaTruck size={24} color="#ff6b00" />
              <span className="pd-trust-text">
                Free Shipping
                <br />
                &gt;Rs.5000
              </span>
            </div>
            <div className="pd-trust-item">
              <FaShieldAlt size={24} color="#ff6b00" />
              <span className="pd-trust-text">
                100%
                <br />
                Authentic
              </span>
            </div>
            <div className="pd-trust-item">
              <FaBox size={24} color="#ff6b00" />
              <span className="pd-trust-text">
                30-Day
                <br />
                Returns
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="pd-tabs-section">
        <div className="pd-tabs">
          <button
            className={`pd-tab ${activeTab === "description" ? "active" : ""}`}
            onClick={() => setActiveTab("description")}
          >
            DESCRIPTION
          </button>
          <button
            className={`pd-tab ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            REVIEWS
          </button>
        </div>

        {activeTab === "description" && (
          <div className="pd-tab-content">
            <h3>About this product</h3>
            <p>{product.description}</p>
            <p>
              This premium {product.category_name} is designed for serious
              athletes and fitness enthusiasts. Made with high-quality
              materials, backed by our 30-day satisfaction guarantee, and
              shipped directly from our Kathmandu warehouse.
            </p>

            <div className="pd-features">
              <div className="pd-feature">
                <FaTrophy size={24} color="#ff6b00" />
                <div>
                  <p className="pd-feature-title">Quality Guaranteed</p>
                  <p className="pd-feature-desc">Premium grade materials</p>
                </div>
              </div>
              <div className="pd-feature">
                <FaTruck size={24} color="#ff6b00" />
                <div>
                  <p className="pd-feature-title">Fast Delivery</p>
                  <p className="pd-feature-desc">1-3 days across Nepal</p>
                </div>
              </div>
              <div className="pd-feature">
                <FaHeadset size={24} color="#ff6b00" />
                <div>
                  <p className="pd-feature-title">Expert Support</p>
                  <p className="pd-feature-desc">Call us anytime</p>
                </div>
              </div>
              <div className="pd-feature">
                <FaUndo size={24} color="#ff6b00" />
                <div>
                  <p className="pd-feature-title">Easy Returns</p>
                  <p className="pd-feature-desc">30 days hassle-free</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="pd-tab-content">
            <p style={{ color: "#888" }}>
              No reviews yet. Be the first to review this product!
            </p>
          </div>
        )}
      </div>

      {related.length > 0 && (
        <div className="pd-related">
          <h2 className="pd-related-title">
            RELATED <span className="orange">PRODUCTS</span>
          </h2>
          <div className="pd-related-grid">
            {related.map((p) => (
              <div
                key={p.id}
                className="pd-related-card"
                onClick={() => navigate(`/products/${p.id}`)}
              >
                <div className="pd-related-img">
                  <img src={getImage(p)} alt={p.name} />
                </div>
                <div className="pd-related-info">
                  <p className="pd-related-category">{p.category_name}</p>
                  <p className="pd-related-name">{p.name}</p>
                  <p className="pd-related-price">
                    Rs.{Number(p.price).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
