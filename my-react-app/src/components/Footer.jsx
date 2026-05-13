import {Link} from 'react-router-dom';
import "../styles/global.css";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-main">
                <div className="footer-brand">
                    <div className="footer-logo">
                        <div className="nav-logo-icon">⚡</div>
                        <span className="footer-logo-text">
                            <span style={{ color: "white" }}>Iron</span>
                            <span style={{ color: "#ff6b00" }}>Forge</span> 
                        </span>
                    </div>
                    <p className="footer-desc">
                         Nepal's premier online gym gear & supplement store. Delivering quality fitness products since 2022.
                    </p>

                    <div className="footer-socials">
                        <a href="#" className="social-icon">f</a>
                        <a href="#" className="social-icon">in</a>
                        <a href="#" className="social-icon">𝕏</a>
                        <a href="#" className="social-icon">▶</a>
                    </div>
                </div>

                <div className="footer-col">
                    <h4 className="footer-col-title">SHOP</h4>
                    <ul className="footer-links">
                        <li><Link to="/products?category=gym-gears">Gym Gears</Link></li>
                        <li><Link to="/products?category=supplements">Supplements</Link></li>
                        <li><Link to="/products?category=accessories">Accessories</Link></li>
                        <li><Link to="/products?category=cardio">Cardio Equipment</Link></li>
                        <li><Link to="/products">New Arrivals</Link></li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h4 className="footer-col-title">ACCOUNT</h4>
                    <ul className="footer-links">
                        <li><Link to="/login">Sign In</Link></li>
                        <li><Link to="/signup">Create Account</Link></li>
                        <li><Link to="/dashboard">My Dashboard</Link></li>
                        <li><Link to="/orders">My Orders</Link></li>
                        <li><Link to="/bmi">BMI Calculator</Link></li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h4 className="footer-col-title">CONTACT</h4>
                    <ul className="footer-contact">
                        <li>
                            <span className="contact-icon">📍</span>
                            Putalisadak, Kathmandu, Nepal
                        </li>
                        <li>
                            <span className="contact-icon">📞</span>
                            +977-1-4012345
                        </li>
                        <li>
                            <span className="contact-icon">✉️</span>
                            info@ironforge.com.np
                        </li>
                        <li>
                            <span className="contact-icon">🕐</span>
                            Sun-Fri: 9AM - 6PM
                        </li>
                    </ul>
                 </div>

            </div>

            <div className="footer-bottom">
                <p className="footer-copy">© 2026 IronForge. All rights reserved.</p>
                <div className="footer-payments">
                    <span>Payment:</span>
                    <div className="payment-badge">eSewa</div>
                    <div className="payment-badge">Cash on Delivery</div>
                </div>
             </div>

    </footer>
  );
}

export default Footer;
