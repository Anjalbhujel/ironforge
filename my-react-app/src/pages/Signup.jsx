import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/global.css";
import { FaEnvelope, FaUserPlus, FaLock, FaUser } from "react-icons/fa";

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password
        })
      });
      const data = await res.json();
      if (res.ok) {
        navigate("/login");
        alert("Account created! Please login.");
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-logo-wrap">
          <div className="auth-logo-box"><FaUserPlus size={28} color="white" /></div>
        </div>

        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Start your fitness journey today</p>

        <form onSubmit={handleSubmit}>

          <div className="auth-field">
            <label>Full Name</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon"><FaUser size={14} color="#aaa" /></span>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="auth-field">
            <label>Email</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon"><FaEnvelope size={14} color="#aaa" /></span>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="auth-field">
            <label>Password</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon"><FaLock size={14} color="#aaa" /></span>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="auth-field">
            <label>Confirm Password</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon"><FaLock size={14} color="#aaa" /></span>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Password"
                value={form.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>

        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>

        <div className="auth-back" onClick={() => navigate("/")}>
          ← Back to home
        </div>

      </div>
    </div>
  );
}

export default Signup;