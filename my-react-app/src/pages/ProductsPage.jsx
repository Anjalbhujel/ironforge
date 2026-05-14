import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";

const CATEGORY_IMAGES = {
  "Supplements": [
    "https://images.unsplash.com/photo-1542435503-956c469947f6?w=400&q=80",
    "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&q=80",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
    "https://images.unsplash.com/photo-1563203369-26f2e4a5ccf7?w=400&q=80",
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
const SORT_OPTIONS = ["Featured", "Price: Low to High", "Price: High to Low", "Newest"];
const CATEGORIES = ["ALL Products", "Gym Gears", "Supplements", "Accessories", "Cardio Equipment"];

function getImage(product) {
    if (product.img_url) return product.img_url;
    const imgs = CATEGORY_IMAGES[product.category_name] || CATEGORY_IMAGES["Gym Gears"];
    return imgs[product.id % imgs.length];
}

function getBadge(product) {
  return BADGES[product.id % BADGES.length];
}

function ProductsPage({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All Products");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Featured");
  const navigate = useNavigate();

useEffect(() => {
    fetch("http://localhost:5000/products")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.log(err));
  }, []);

  const filtered = products
    .filter(p => {
      const matchCategory = category === "All Products" || p.category_name === category;
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    })
    .sort((a, b) => {
      if (sort === "Price: Low to High") return a.price - b.price;
      if (sort === "Price: High to Low") return b.price - a.price;
      return 0;
    });

  return (
    <div className="products-page">

     <div className="products-page-header">
            <div className="products-page-header-left">
             <p className="products-page-tag">IRONFORGE STORE</p>
             <h1 className="products-page-title">ALL PRODUCTS</h1>
             <p className="products-page-count">{filtered.length} products found</p>
            </div>
            <div className="products-page-search">
             <span className="search-icon-inside">🔍</span>
             <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
             />
            </div>
      </div>

      <div className="products-filter-bar">
            <div className="products-filter-pills">
              {CATEGORIES.map(cat => (
                <button
                    key={cat}
                    className={`filter-pill ${category === cat ? "active" : ""}`}
                    onClick={() => setCategory(cat)}
                >
                    {cat}
                </button>
             ))}
            </div>
            <select
            className="sort-select"
            value={sort}
            onChange={e => setSort(e.target.value)}
            >
            {SORT_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
            ))}
            </select>
        </div>

        <div className="products-page-grid">
        {filtered.length === 0 ? (
          <p className="no-products">No products found.</p>
        ) : (
          filtered.map(product => {
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

                  {badge && (
                    <span className="pp-badge-left">{badge}</span>
                  )}

                  <span className="pp-badge-right">SALE</span>

                  {isLowStock && (
                    <span className="pp-badge-stock">
                      Only {product.stock} left
                    </span>
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
                    {"★★★★☆"} <span className="pp-card-reviews">(reviews)</span>
                  </div>

                  <div className="pp-card-price-row">
                    <div className="pp-card-prices">
                      <span className="pp-card-price">
                        Rs.{Number(product.price).toLocaleString()}
                      </span>
                    </div>
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
          })
        )}
      </div>

    </div>
  );
}

export default ProductsPage;