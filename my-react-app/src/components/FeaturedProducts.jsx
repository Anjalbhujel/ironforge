import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";
import { getImage } from "../utils/categoryImages";

const CATEGORIES = ["All", "Gym Gears", "Supplements", "Accessories", "Cardio Equipment"];

const BADGES = ["FEATURED", "BESTSELLER", "NEW", "HOT", "RECOVERY", null];

function getBadge(product) {
    return BADGES[product.id % BADGES.length];
}

function FeaturedProducts({ products, addToCart}) {
    const [activeCategory, setActiveCategory] = useState("All");
    const navigate = useNavigate();

    const filtered = products
    .filter(p => activeCategory === "All" || p.category_name === activeCategory)
    .slice(0, 8);

  return (
    <div className="featured-section">

      <div className="featured-header">
        <div>
          <p className="featured-tag">TOP PICKS</p>
          <h2 className="featured-title">
            FEATURED <span className="orange">PRODUCTS</span>
          </h2>
        </div>
        <span className="featured-viewall" onClick={() => navigate("/products")}>
          View All →
        </span>
      </div>

      <div className="featured-pills">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`featured-pill ${activeCategory === cat ? "active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="no-products">No products found.</p>
      ) : (
        <div className="featured-grid">
          {filtered.map(product => {
            const badge = getBadge(product);
            const isLowStock = product.stock > 0 && product.stock <= 5;
            const isOutOfStock = product.stock === 0;

            return (
              <div key={product.id} className="pp-card">

                <div
                  className="pp-card-img"
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  <img src={getImage(product)} alt={product.name} />

                  {badge && <span className="pp-badge-left">{badge}</span>}

                  <span className="pp-badge-right">SALE</span>

                  {isLowStock && (
                    <span className="pp-badge-stock">Only {product.stock} left</span>
                  )}
                </div>

                <div className="pp-card-body">
                  <p className="pp-card-category">{product.category_name}</p>
                  <h3
                    className="pp-card-name"
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    {product.name}
                  </h3>

                  <div className="pp-card-stars">
                    ★★★★☆ <span className="pp-card-reviews">(reviews)</span>
                  </div>

                  <div className="pp-card-price-row">
                    <span className="pp-card-price">
                      Rs.{Number(product.price).toLocaleString()}
                    </span>
                    <button
                      className="pp-card-btn"
                      disabled={isOutOfStock}
                      onClick={() => addToCart(product)}
                    >
                      {isOutOfStock ? "Out of Stock" : "+ Add"}
                    </button>
                  </div>

                  <div className="pp-card-stock">
                    {isOutOfStock ? (
                      <span className="stock-out">● Out of stock</span>
                    ) : isLowStock ? (
                      <span className="stock-low">● Only {product.stock} left</span>
                    ) : (
                      <span className="stock-in">● In stock ({product.stock})</span>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

export default FeaturedProducts;
