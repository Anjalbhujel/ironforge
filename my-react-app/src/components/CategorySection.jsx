import { useNavigate } from "react-router-dom";
import "../styles/global.css";

const categoroies = [
     {
    name: "Gym Gears",
    label: "GYM GEARS",
    count: "24 Products",
    color: "rgba(180, 60, 0, 0.6)",
    icon: "🏋️",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
    link: "/products?category=gym-gears"
  },
  {
    name: "Supplements",
    label: "SUPPLEMENTS",
    count: "36 Products",
    color: "rgba(0, 80, 60, 0.6)",
    icon: "💊",
    image: "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=600&q=80",
    link: "/products?category=supplements"
  },
  {
    name: "Accessories",
    label: "ACCESSORIES",
    count: "18 Products",
    color: "rgba(150, 80, 0, 0.6)",
    icon: "🎽",
    image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&q=80",
    link: "/products?category=accessories"
  },
  {
    name: "Cardio Equipment",
    label: "CARDIO EQUIPMENT",
    count: "12 Products",
    color: "rgba(180, 30, 30, 0.6)",
    icon: "❤️",
    image: "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=600&q=80",
    link: "/products?category=cardio"
  }
];

function CategorySection() {
    const navigate = useNavigate();

    return (
    <div className="category-section">
        <div className="category-header">
            <div>
                <p className="category-tag">SHOP BY CATEGORY</p>
                <h2 className="category-title">
                    BROWSE <span className="orange"> CATEGORIES</span>
                </h2>
            </div>
            <span
                className="view-all-link"
                onClick={() => navigate("/products")}
            >
                View All Products →
            </span>
        </div>

        <div className="category-grid">
            {categoroies.map((cat) => (
                <div    
                    key={cat.name}
                    className="category-card"
                    onClick={() => navigate(cat.link)}
                >
                    <img src={cat.image} alt={cat.name} className="category-card-image" />

                    <div 
                        className="category-card-overlay"
                        style={{background: cat.color}}
                    ></div>

                    <div className="category-card-arrow">↗</div>

                    <div className="category-card-info">
                        <div className="category-card-icon">{cat.icon}</div>
                        <div>
                            <p className="category-card-name">{cat.label}</p>
                            <p className="category-card-count">{cat.count}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
    );
}

export default CategorySection;