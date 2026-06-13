import "../styles/global.css";
import { MdVerified } from "react-icons/md";

const reviews = [
  {
    initials: "MJ",
    name: "Marcus Johnson",
    date: "March 2026",
    stars: 5,
    title: "Absolute beast of a barbell",
    text: "Incredibly high quality. The knurling is perfect - aggressive enough for a solid grip. Been using it for 6 months and it still looks brand new. Worth every penny!",
    color: "#ff6b00"
  },
  {
    initials: "DW",
    name: "Derek Williams",
    date: "January 2026",
    stars: 5,
    title: "Built my entire home gym around this",
    text: "Assembly was straightforward, took about 2 hours solo. The steel is incredibly solid - zero wobble even at heavy loads. The pull-up bar is a great bonus.",
    color: "#2e7d32"
  },
  {
    initials: "TB",
    name: "Tyler Brooks",
    date: "February 2026",
    stars: 5,
    title: "Replaced my entire dumbbell rack",
    text: "These saved so much space. The dial mechanism is smooth and reliable. I've dropped them a few times and they still work perfectly. Game changer for home gyms.",
    color: "#ff6b00"
  },
  {
    initials: "SC",
    name: "Sarah Chen",
    date: "February 2026",
    stars: 5,
    title: "Best tasting protein ever",
    text: "Mixes perfectly with just water, no clumps. Significant muscle recovery improvement since switching to this. The chocolate fudge flavor is insane!",
    color: "#e53935"
  },
  {
    initials: "PS",
    name: "Priya Sharma",
    date: "March 2026",
    stars: 4,
    title: "Great energy, solid product",
    text: "Great energy boost without the jitters. I take half a scoop and it's perfect for morning sessions. The watermelon flavor is refreshing.",
    color: "#7b1fa2"
  },
  {
    initials: "AT",
    name: "Aisha Thompson",
    date: "January 2026",
    stars: 5,
    title: "Dramatically reduced soreness",
    text: "My soreness has dramatically reduced since I started taking this post-workout. The tropical punch flavor is delicious and it mixes instantly.",
    color: "#2e7d32"
  },
];

function StarRating({ count }) {
  return (
    <div className="review-stars">
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= count ? "#ff6b00" : "#dddddd" }}>★</span>
      ))}
    </div>
  );
}

function Reviews() {
  return (
    <div className="reviews-section">

      <div className="reviews-header">
        <p className="reviews-tag">CUSTOMER LOVE</p>
        <h2 className="reviews-title">
          WHAT OUR <span className="orange">CUSTOMERS</span> SAY
        </h2>
        <div className="reviews-overall">
          <div className="reviews-overall-stars">
            ★★★★★
          </div>
          <span className="reviews-overall-text">4.8 out of 5 · 6,200+ reviews</span>
        </div>
      </div>

      <div className="reviews-grid">
        {reviews.map((review, i) => (
          <div key={i} className="review-card">

            <div className="review-top">
              <div className="review-avatar" style={{ background: review.color }}>
                {review.initials}
              </div>
              <div className="review-author">
                <p className="review-name">{review.name}</p>
                <p className="review-date">{review.date}</p>
              </div>
              <div className="review-verified">
                <MdVerified size={14} color="#2e7d32" /> Verified
                  
              </div>
            </div>

            <StarRating count={review.stars} />

            <p className="review-title">{review.title}</p>
            <p className="review-text">{review.text}</p>

          </div>
        ))}
      </div>

    </div>
  );
}

export default Reviews;