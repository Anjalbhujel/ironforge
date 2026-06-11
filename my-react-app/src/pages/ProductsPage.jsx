import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import "../styles/global.css";
import { getImage } from "../utils/categoryImages";

const BADGES = ["FEATURED", "BESTSELLER", "NEW", "HOT", "RECOVERY", null];
const SORT_OPTIONS = ["Featured", "Price: Low to High", "Price: High to Low", "Newest"];
const CATEGORIES = ["ALL Products", "Gym Gears", "Supplements", "Accessories", "Cardio Equipment"];

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
             <span className="search-icon-inside"><FiSearch /></span>
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