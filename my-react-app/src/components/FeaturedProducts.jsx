import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";

const CATEGORIES = ["All", "Gym Gears", "Supplements", "Accessories", "Cardio Equipment"];
const CATEGORY_IMAGES = {
  "Supplements": [
    "https://images.unsplash.com/photo-1680265158261-5fd6ba5d9959?q=80&w=435&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1693996045435-af7c48b9cafb?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1709976142402-0ce49c22dbfc?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    
  ],
  "Accessories": [
    "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400&q=80",
    "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&q=80",
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80",
    "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?w=400&q=80",
  ],
  "Gym Gears": [
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80",
    "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=400&q=80",
    "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&q=80",
    "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400&q=80",
  ],
  "Cardio Equipment": [
    "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=400&q=80",
    "https://images.unsplash.com/photo-1520877880798-5ee004e3f11e?w=400&q=80",
    "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=400&q=80",
    "https://images.unsplash.com/photo-1544033527-b192daee1f5b?w=400&q=80",
  ],
};

const BADGES = ["FEATURED", "BESTSELLER", "NEW", "HOT", "RECOVERY", null];
function getImage(product){
    if(product.image_url) return product.image_url;
    const imgs = CATEGORY_IMAGES[product.category_name] || CATEGORY_IMAGES["Gym Gears"];
    return imgs[product.id % imgs.length];
}

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
