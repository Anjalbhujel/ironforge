import "../styles/global.css";
import { FaTruck, FaShieldAlt, FaUndo, FaHeadset, FaLock, FaTrophy } from "react-icons/fa";

const features = [
  {
    icon: <FaTruck size={25} color="#ff6b00"/>,
    color: "#ff6b00",
    title: "Free Delivery",
    desc: "Free shipping on orders above Rs. 5,000 across Nepal"
  },
  {
    icon: <FaShieldAlt size={25} color="#2e7d32"/>,
    color: "#2e7d32",
    title: "100% Authentic",
    desc: "All products are genuine and verified by our quality team"
  },
  {
    icon: <FaUndo size={25} color="#ff6b00"/>,
    color: "#ff6b00",
    title: "Easy Returns",
    desc: "30-day hassle-free return policy on all products"
  },
  {
    icon: <FaHeadset size={25} color="#e53935"/>,
    color: "#e53935",
    title: "24/7 Support",
    desc: "Round the clock customer support via call, chat & email"
  },
  {
    icon: <FaLock size={25} color="#00897b"/>,
    color: "#2e7d32",
    title: "Secure Payments",
    desc: "Pay safely via eSewa, bank transfer, or cash on delivery"
  },
  {
    icon: <FaTrophy size={25} color="#7b1fa2"/>,
    color: "#7b1fa2",
    title: "Top Brands",
    desc: "We carry only the best international and domestic brands"
  },
];

function WhyUs() {
  return (
    <div className="whyus-section">

      <div className="whyus-header">
        <p className="whyus-tag">WHY IRONFORGE</p>
        <h2 className="whyus-title">
          THE <span className="orange">IRONFORGE</span> DIFFERENCE
        </h2>
        <p className="whyus-subtitle">
          We don't just sell products. We help you build the gym of your dreams and reach your peak performance.
        </p>
      </div>

      <div className="whyus-grid">
        {features.map((f, i) => (
          <div key={i} className="whyus-card">
            <div className="whyus-icon" style={{ color: f.color }}>
              {f.icon}
            </div>
            <h3 className="whyus-card-title">{f.title}</h3>
            <p className="whyus-card-desc">{f.desc}</p>
          </div>
        ))}
      </div>

    </div>
  );
}

export default WhyUs;