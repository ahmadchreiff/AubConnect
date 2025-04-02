import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./ReviewList.css";

const AdminReviewList = () => {
  const [reportedReviews, setReportedReviews] = useState([]);
  const [error, setError] = useState("");

  // Fetch reported reviews
  useEffect(() => {
    const fetchReportedReviews = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/reported-reviews", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setReportedReviews(response.data);
      } catch (err) {
        setError("Failed to fetch reported reviews.");
        console.error("Error fetching reported reviews:", err);
      }
    };

    fetchReportedReviews();
  }, []);

  return (
    <div className="admin-review-list-page">
      <h1>Reported Reviews</h1>
      {error && <p className="error-message">{error}</p>}
      <div className="reported-reviews-container">
        {reportedReviews.map((review) => (
          <div key={review._id} className="review-card">
            <h3 className="review-title">
              {review.username} - {review.title} ({review.type})
            </h3>
            <p>{review.reviewText}</p>
            <p>Status: {review.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReviewList;
