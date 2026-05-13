import { useNavigate } from "react-router-dom";
import "../styles/global.css";

function ProductCard({ product, addToCart }) {
    const navigate = useNavigate();
   
    return (
        <div className="product-card">

          <div className="product-card-img" onClick={() => navigate(`/products/${product.id}`)}>
              <img
                src={product.image || "https://via.placeholder.com/200"}
                alt={product.name}
              />
          </div>

          <div className="product-card-body">
            <p className="product-card-category">{product.category_name || "General"}</p>
            <h3 className="product-card-name" onClick={() => navigate(`/products/${product.id}`)}>
              {product.name}
            </h3>
            <p className="product-card-description">{product.description}</p>

            <div className="product-card-footer">
              <span className="product-card-price">Rs. {Number(product.price).toLocaleString()}</span>
                <button
                  className="product-card-btn"
                  onClick={(e) => {e.stopPropagation(); addToCart(product);}}
                >
                  Add to Cart
                </button>
            </div>
          </div>
        
        </div>
      );
}

export default ProductCard;