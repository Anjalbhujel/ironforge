import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";
import { FaBolt, FaFire, FaHeartbeat, FaRunning } from "react-icons/fa";
import { GiWeight, GiBodyHeight } from "react-icons/gi";

const FITNESS_GOALS = [
  { id: "muscle", label: "Muscle Gain", icon: <FaBolt size={20} /> },
  { id: "weightloss", label: "Weight Loss", icon: <FaFire size={20} /> },
  { id: "maintenance", label: "Maintenance", icon: <FaHeartbeat size={20} /> },
  { id: "endurance", label: "Endurance", icon: <FaRunning size={20} /> },
];

function getBMICategory(bmi) {
  if (bmi < 18.5) return { label: "Underweight", color: "#1565c0" };
  if (bmi < 25) return { label: "Normal weight", color: "#2e7d32" };
  if (bmi < 30) return { label: "Overweight", color: "#f57f17" };
  return { label: "Obese", color: "#c62828" };
}

function getRecommendations(bmi, goal) {
  const recs = {
    muscle: [
      {
        name: "Whey Protein Pro",
        category: "SUPPLEMENTS",
        desc: "Essential for muscle recovery and growth",
        price: 4999,
        image:
          "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=200&q=80",
      },
      {
        name: "Creatine Monohydrate",
        category: "SUPPLEMENTS",
        desc: "Boost strength and muscle performance",
        price: 1899,
        image:
          "https://images.unsplash.com/photo-1542435503-956c469947f6?w=200&q=80",
      },
    ],
    weightloss: [
      {
        name: "BCAA Recovery Mix",
        category: "SUPPLEMENTS",
        desc: "Preserve muscle while burning fat",
        price: 1599,
        image:
          "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=200&q=80",
      },
      {
        name: "Jump Rope Pro",
        category: "CARDIO EQUIPMENT",
        desc: "Burn calories with high intensity cardio",
        price: 649,
        image:
          "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=200&q=80",
      },
    ],
    maintenance: [
      {
        name: "Multivitamin Pack",
        category: "SUPPLEMENTS",
        desc: "Daily essentials for active lifestyles",
        price: 999,
        image:
          "https://images.unsplash.com/photo-1563203369-26f2e4a5ccf7?w=200&q=80",
      },
      {
        name: "Resistance Bands Set",
        category: "ACCESSORIES",
        desc: "Versatile training for all fitness levels",
        price: 1299,
        image:
          "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=200&q=80",
      },
    ],
    endurance: [
      {
        name: "Pre-Workout Blast",
        category: "SUPPLEMENTS",
        desc: "Energy and focus for intense sessions",
        price: 2499,
        image:
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&q=80",
      },
      {
        name: "Omega-3 Fish Oil",
        category: "SUPPLEMENTS",
        desc: "Supports cardiovascular health",
        price: 1299,
        image:
          "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=200&q=80",
      },
    ],
  };
  return recs[goal] || recs.maintenance;
}

function BMI() {
  const navigate = useNavigate();
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [goal, setGoal] = useState("muscle");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const calculate = async () => {
    if (!height || !weight) {
      setError("Please enter both height and weight");
      return;
    }
    if (height < 50 || height > 300) {
      setError("Please enter a valid height (50-300 cm)");
      return;
    }
    if (weight < 10 || weight > 500) {
      setError("Please enter a valid weight (10-500 kg)");
      return;
    }
    setError("");

    const h = height / 100;
    const bmi = (weight / (h * h)).toFixed(1);
    const category = getBMICategory(parseFloat(bmi));
    const recommendations = getRecommendations(parseFloat(bmi), goal);
    setResult({ bmi, category, recommendations });

    const token = localStorage.getItem("token");
    if (token) {
      try {
        await fetch("http://localhost:5000/api/users/bmi", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ bmi: parseFloat(bmi), fitness_goal: goal, height: parseFloat(height), weight: parseFloat(weight) }),
        });
      } catch (err) {
        console.log("Could not save BMI:", err);
      }
    }
  };

  return (
    <div className="bmi-page">
      <div className="bmi-container">
        <h1 className="bmi-title">BMI Calculator</h1>
        <p className="bmi-subtitle">
          Calculate your BMI and get personalized product recommendations
        </p>

        <div className="bmi-card">
          <div className="bmi-inputs">
            <div className="bmi-field">
              <label>Height (cm)</label>
              <div className="bmi-input-wrap">
                <GiBodyHeight size={16} color="#aaa" />
                <input
                  type="number"
                  placeholder="175"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
              </div>
            </div>
            <div className="bmi-field">
              <label>Weight (kg)</label>
              <div className="bmi-input-wrap">
                <GiWeight size={16} color="#aaa" />
                <input
                  type="number"
                  placeholder="70"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="bmi-goal-section">
            <label>Fitness Goal</label>
            <div className="bmi-goals">
              {FITNESS_GOALS.map((g) => (
                <div
                  key={g.id}
                  className={`bmi-goal ${goal === g.id ? "active" : ""}`}
                  onClick={() => setGoal(g.id)}
                >
                  <span className="bmi-goal-icon">{g.icon}</span>
                  <span className="bmi-goal-label">{g.label}</span>
                </div>
              ))}
            </div>
          </div>

          {error && <p className="bmi-error">{error}</p>}

          <button className="bmi-btn" onClick={calculate}>
            Calculate BMI & Get Recommendations
          </button>
        </div>

        {result && (
          <div className="bmi-result-card">
            <div className="bmi-score-section">
              <div
                className="bmi-score-circle"
                style={{ borderColor: result.category.color }}
              >
                <p
                  className="bmi-score-number"
                  style={{ color: result.category.color }}
                >
                  {result.bmi}
                </p>
                <p className="bmi-score-label">BMI</p>
              </div>
              <div className="bmi-score-info">
                <h2 className="bmi-score-title">Your BMI Score</h2>
                <p
                  className="bmi-score-category"
                  style={{ color: result.category.color }}
                >
                  {result.category.label}
                </p>
                <p className="bmi-score-desc">
                  {result.category.label === "Normal weight"
                    ? "Great job! You're at a healthy weight. Keep maintaining your fitness routine."
                    : result.category.label === "Underweight"
                      ? "You're below the healthy weight range. Focus on nutrition and strength training."
                      : result.category.label === "Overweight"
                        ? "You're slightly above the healthy range. Regular exercise and balanced diet can help."
                        : "Consider consulting a healthcare provider for a personalized fitness plan."}
                </p>
              </div>
            </div>

            <div className="bmi-scale">
              <div className="bmi-scale-bar">
                <div className="bmi-scale-section underweight">
                  Underweight
                  <br />
                  &lt;18.5
                </div>
                <div className="bmi-scale-section normal">
                  Normal
                  <br />
                  18.5-24.9
                </div>
                <div className="bmi-scale-section overweight">
                  Overweight
                  <br />
                  25-29.9
                </div>
                <div className="bmi-scale-section obese">
                  Obese
                  <br />
                  &gt;30
                </div>
              </div>
            </div>

            <div className="bmi-recs">
              <h3 className="bmi-recs-title">Recommended For You</h3>
              <p className="bmi-recs-subtitle">
                Based on your BMI ({result.bmi}) and fitness goal
              </p>
              <div className="bmi-recs-grid">
                {result.recommendations.map((rec, i) => (
                  <div
                    key={i}
                    className="bmi-rec-card"
                    onClick={() => navigate("/products")}
                  >
                    <div className="bmi-rec-img">
                      <img src={rec.image} alt={rec.name} />
                    </div>
                    <div className="bmi-rec-info">
                      <p className="bmi-rec-category">{rec.category}</p>
                      <p className="bmi-rec-name">{rec.name}</p>
                      <p className="bmi-rec-desc">{rec.desc}</p>
                      <p className="bmi-rec-price">
                        Rs.{rec.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                className="bmi-view-all"
                onClick={() => navigate("/products")}
              >
                View All Products →
              </button>
            </div>
          </div>
        )}

        <div className="bmi-back" onClick={() => navigate("/")}>
          ← Back to Home
        </div>
      </div>
    </div>
  );
}

export default BMI;
