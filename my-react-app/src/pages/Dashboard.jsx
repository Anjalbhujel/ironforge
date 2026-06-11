import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/global.css";
import {
  FaThLarge,
  FaShoppingBag,
  FaHeartbeat,
  FaCog,
  FaCalculator,
  FaSignOutAlt,
  FaMapMarkerAlt,
  FaDollarSign,
  FaWeight,
  FaArrowRight,
  FaBolt,
} from "react-icons/fa";
import { FiShoppingBag } from "react-icons/fi";
// import { getImage } from "../utils/categoryImages";

function getBMICategory(bmi) {
  if (bmi < 18.5) return { label: "Underweight", color: "#1565c0" };
  if (bmi < 25) return { label: "Normal weight", color: "#2e7d32" };
  if (bmi < 30) return { label: "Overweight", color: "#f57f17" };
  return { label: "Obese", color: "#c62828" };
}

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const params = new URLSearchParams(useLocation().search);
  const initialTab = params.get("tab") || "overview";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userBmi, setUserBmi] = useState(null);
  const [userHeight, setUserHeight] = useState(null);
  const [userWeight, setUserWeight] = useState(null);
  const [userFitnessGoal, setUserFitnessGoal] = useState(null);
  const [settingsName, setSettingsName] = useState(user?.name || "");
  const [settingsMsg, setSettingsMsg] = useState("");

  const handleSaveSettings = async () => {
  if (!settingsName.trim()) {
    setSettingsMsg("Name cannot be empty");
    return;
  }
  try {
    const res = await fetch("http://localhost:5000/api/users/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name: settingsName })
    });
    const data = await res.json();
    if (res.ok) {
      // Update localStorage so navbar shows new name
      const updatedUser = { ...user, name: settingsName };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setSettingsMsg("✅ Profile updated successfully!");
    } else {
      setSettingsMsg(data.message || "Update failed");
    }
  } catch {
    setSettingsMsg("Something went wrong");
  }
};

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:5000/api/orders/myorders", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetch("http://localhost:5000/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUserBmi(data.bmi);
        setUserHeight(data.height);
        setUserWeight(data.weight);
        setUserFitnessGoal(data.fitness_goal);
      })
      .catch(console.log);
  }, []);

  const totalSpent = orders.reduce((sum, o) => sum + Number(o.total_amount), 0);

  const getInitials = (name) => (name ? name.charAt(0).toUpperCase() : "U");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  if (!user) return null;

  return (
    <div className="dashboard-page">
      <div className="dashboard-top">
        <div className="dashboard-profile">
          <div className="dashboard-avatar">{getInitials(user.name)}</div>
          <div>
            <p className="dashboard-name">{user.name}</p>
            <p className="dashboard-email">{user.email}</p>
          </div>
        </div>
        <div className="dashboard-top-actions">
          <button className="dash-action-btn" onClick={() => navigate("/bmi")}>
            <FaCalculator size={14} /> BMI Calculator
          </button>
          <button className="dash-action-btn danger" onClick={handleLogout}>
            <FaSignOutAlt size={14} /> Logout
          </button>
        </div>
      </div>

      <div className="dashboard-layout">
        <div className="dashboard-sidebar">
          <div
            className={`dash-menu-item ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <FaThLarge size={16} /> Overview
          </div>
          <div
            className={`dash-menu-item ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            <FaShoppingBag size={16} /> Orders ({orders.length})
          </div>
          <div
            className={`dash-menu-item ${activeTab === "health" ? "active" : ""}`}
            onClick={() => setActiveTab("health")}
          >
            <FaHeartbeat size={16} /> Health Stats
          </div>
          <div
            className={`dash-menu-item ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <FaCog size={16} /> Settings
          </div>
        </div>

        <div className="dashboard-content">
          {activeTab === "overview" && (
            <>
              <div className="dash-stats-grid">
                <div className="dash-stat-card">
                  <div className="dash-stat-icon orange-bg">
                    <FiShoppingBag size={20} color="#ff6b00" />
                  </div>
                  <div>
                    <p className="dash-stat-label">Total Orders</p>
                    <p className="dash-stat-value">{orders.length}</p>
                    <p className="dash-stat-desc">Lifetime orders placed</p>
                  </div>
                </div>

                <div className="dash-stat-card">
                  <div className="dash-stat-icon green-bg">
                    <FaDollarSign size={20} color="#2e7d32" />
                  </div>
                  <div>
                    <p className="dash-stat-label">Total Spent</p>
                    <p className="dash-stat-value big">
                      Rs.{totalSpent.toLocaleString()}
                    </p>
                    <p className="dash-stat-desc">Across all orders</p>
                  </div>
                </div>

                <div className="dash-stat-card">
                  <div className="dash-stat-icon yellow-bg">
                    <FaWeight size={20} color="#f57f17" />
                  </div>
                  <div>
                    <p className="dash-stat-label">BMI Score</p>
                    <p className="dash-stat-value">{userBmi || "—"}</p>
                    <p className="dash-stat-desc">
                      {userBmi
                        ? getBMICategory(userBmi).label
                        : "Not Calculated"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="dash-section">
                <div className="dash-section-header">
                  <h2>Recent Orders</h2>
                  <span onClick={() => setActiveTab("orders")}>View All</span>
                </div>

                {loading ? (
                  <p className="dash-loading">Loading orders...</p>
                ) : orders.length === 0 ? (
                  <p className="dash-empty">No orders yet.</p>
                ) : (
                  orders.slice(0, 3).map((order) => (
                    <div key={order.id} className="dash-order-item">
                      <div className="dash-order-left">
                        <p className="dash-order-id">
                          ORD-{String(order.id).padStart(6, "0")}
                        </p>
                        <p className="dash-order-date">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                        <p className="dash-order-items">
                          {order.items?.length || 0} item
                          {order.items?.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="dash-order-right">
                        <p className="dash-order-total">
                          Rs.{Number(order.total_amount).toLocaleString()}
                        </p>
                        <span className="dash-order-status">
                          {order.order_status || "processing"}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="dash-bottom-cards">
                <div
                  className="dash-bottom-card"
                  onClick={() => navigate("/products")}
                >
                  <div className="dash-bottom-icon orange-bg">
                    <FiShoppingBag size={20} color="#ff6b00" />
                  </div>
                  <div className="dash-bottom-text">
                    <p className="dash-bottom-title">Browse Products</p>
                    <p className="dash-bottom-desc">
                      Explore gym gear and supplements
                    </p>
                  </div>
                  <FaArrowRight size={14} color="#888" />
                </div>

                <div
                  className="dash-bottom-card"
                  onClick={() => navigate("/bmi")}
                >
                  <div className="dash-bottom-icon yellow-bg">
                    <FaCalculator size={20} color="#f57f17" />
                  </div>
                  <div className="dash-bottom-text">
                    <p className="dash-bottom-title">BMI Calculator</p>
                    <p className="dash-bottom-desc">
                      Get personalized recommendations
                    </p>
                  </div>
                  <FaArrowRight size={14} color="#888" />
                </div>
              </div>
            </>
          )}

          {activeTab === "orders" && (
            <div className="dash-orders-section">
              <h2 className="dash-section-title">MY ORDERS</h2>
              {orders.length === 0 ? (
                <p className="dash-empty">No orders yet.</p>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="dash-order-card">
                    <div className="dash-order-header">
                      <div className="dash-order-header-item">
                        <p className="dash-order-header-label">Order ID</p>
                        <p className="dash-order-header-value">
                          ORD-{order.id}
                        </p>
                      </div>
                      <div className="dash-order-header-item">
                        <p className="dash-order-header-label">Placed On</p>
                        <p className="dash-order-header-value">
                          {new Date(order.created_at).toLocaleDateString(
                            "en-US",
                            { month: "long", day: "numeric", year: "numeric" },
                          )}
                        </p>
                      </div>
                      <div className="dash-order-header-item">
                        <p className="dash-order-header-label">Total</p>
                        <p className="dash-order-header-value">
                          Rs.{Number(order.total_amount).toLocaleString()}
                        </p>
                      </div>
                      <div className="dash-order-header-item">
                        <p className="dash-order-header-label">Payment</p>
                        <p className="dash-order-header-value">
                          {order.payment_method === "COD"
                            ? "Cash On Delivery"
                            : order.payment_method}
                        </p>
                      </div>
                      <span className="dash-order-status-badge">
                        {order.order_status || "Processing"}
                      </span>
                    </div>

                    <div className="dash-order-items-list">
                      {order.items?.map((item) => (
                        <div key={item.id} className="dash-order-product">
                          <img
                            src={
                              item.image_url ||
                              `https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=80&q=80`
                            }
                            alt={item.name}
                            className="dash-order-product-img"
                          />
                          <div className="dash-order-product-info">
                            <p className="dash-order-product-name">
                              {item.name}
                            </p>
                            <p className="dash-order-product-qty">
                              Qty: {item.quantity} × Rs.
                              {Number(item.price).toLocaleString()}
                            </p>
                          </div>
                          <p className="dash-order-product-total">
                            Rs.{(item.quantity * item.price).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Order Address */}
                    {order.shipping_address && (
                      <div className="dash-order-address">
                        <FaMapMarkerAlt size={12} color="#ff6b00" />
                        {order.shipping_address}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "health" && (
            <div className="dash-section">
              <h2 className="dash-section-title">HEALTH STATISTICS</h2>

              {userBmi ? (
                <>
                  {/* Stats Cards */}
                  <div className="health-stats-grid">
                    <div className="health-stat-card">
                      <p className="health-stat-label">BMI SCORE</p>
                      <p
                        className="health-stat-value"
                        style={{ color: getBMICategory(userBmi).color }}
                      >
                        {userBmi}
                      </p>
                      <p
                        className="health-stat-unit"
                        style={{ color: getBMICategory(userBmi).color }}
                      >
                        {getBMICategory(userBmi).label}
                      </p>
                    </div>
                    <div className="health-stat-card">
                      <p className="health-stat-label">HEIGHT</p>
                      <p className="health-stat-value">{userHeight || "—"}</p>
                      <p className="health-stat-unit">cm</p>
                    </div>
                    <div className="health-stat-card">
                      <p className="health-stat-label">WEIGHT</p>
                      <p className="health-stat-value">{userWeight || "—"}</p>
                      <p className="health-stat-unit">kg</p>
                    </div>
                  </div>

                  {/* Fitness Goal */}
                  {userFitnessGoal && (
                    <div className="health-goal-card">
                      <div className="health-goal-icon">
                        <FaBolt size={18} color="#ff6b00" />
                      </div>
                      <div>
                        <p className="health-goal-label">
                          Current Fitness Goal
                        </p>
                        <p className="health-goal-value">
                          {userFitnessGoal === "muscle"
                            ? "Muscle Gain"
                            : userFitnessGoal === "weightloss"
                              ? "Weight Loss"
                              : userFitnessGoal === "maintenance"
                                ? "Maintenance"
                                : "Endurance"}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Recalculate */}
                  <button
                    className="health-recalc-btn"
                    onClick={() => navigate("/bmi")}
                  >
                    <FaCalculator size={14} /> Recalculate BMI
                  </button>
                </>
              ) : (
                <div className="dash-bmi-prompt">
                  <FaWeight size={40} color="#f57f17" />
                  <p>You haven't calculated your BMI yet.</p>
                  <button
                    onClick={() => navigate("/bmi")}
                    className="dash-bmi-btn"
                  >
                    Calculate BMI Now
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div>
              <h2 className="dash-section-title">ACCOUNT SETTINGS</h2>

              {/* Personal Information */}
              <div className="settings-card">
                <h3 className="settings-card-title">Personal Information</h3>
                <div className="settings-form-grid">
                  <div className="settings-field">
                    <label>FULL NAME</label>
                    <input
                      type="text"
                      value={settingsName}
                      onChange={(e) => setSettingsName(e.target.value)}
                      className="settings-input"
                    />
                  </div>
                  <div className="settings-field">
                    <label>EMAIL</label>
                    <input
                      type="email"
                      defaultValue={user.email}
                      className="settings-input"
                      disabled
                    />
                  </div>
                </div>
                {settingsMsg && (
                  <p
                    className={`settings-msg ${settingsMsg.includes("✅") ? "success" : "error"}`}
                  >
                    {settingsMsg}
                  </p>
                )}
                <button
                  className="settings-save-btn"
                  onClick={handleSaveSettings}
                >
                  Save Changes
                </button>
              </div>

              {/* Danger Zone */}
              <div className="settings-card">
                <h3 className="settings-card-title">Danger Zone</h3>
                <p className="settings-danger-desc">
                  Permanently log out of your account.
                </p>
                <button className="settings-logout-btn" onClick={handleLogout}>
                  <FaSignOutAlt size={13} /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
