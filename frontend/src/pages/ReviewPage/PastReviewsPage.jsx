import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./PastReviewsPage.css";

const PastReviewsPage = () => {
  const [pastReviews, setPastReviews] = useState([]);
  const [anonymousReviews, setAnonymousReviews] = useState([]);
  const [error, setError] = useState("");

  const getUsernameFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to view past reviews.");
      return null;
    }

    try {
      const decoded = jwtDecode(token);
      return decoded.username;
    } catch (err) {
      setError("Invalid token. Please log in again.");
      return null;
    }
  };

  useEffect(() => {
    const fetchPastReviews = async () => {
      const username = getUsernameFromToken();
      if (!username) return;

      try {
        // Fetch named reviews
        const response = await axios.get(
          `http://localhost:5001/api/reviews/user/${username}/past`
        );
        console.log("Named Reviews Response:", response.data);
        setPastReviews(response.data || []);

        // Fetch anonymous reviews
        const anonymousResponse = await axios.get(
          `http://localhost:5001/api/reviews/user/${username}/anonymous`
        );
        console.log("Anonymous Reviews Response:", anonymousResponse.data);
        setAnonymousReviews(anonymousResponse.data || []);

        // ✅ Reset error since fetching succeeded
        setError(""); // <---- This is the fix!
      } catch (err) {
        console.error(
          "Error fetching reviews:",
          err.response ? err.response.data : err.message
        );
        setError(
          "Failed to fetch past reviews. Please check your connection or try again later."
        );
      }
    };

    fetchPastReviews();
  }, []);

  return (
    <div className="past-reviews-page">
      <h1 className="header">Your Past Reviews</h1>

      {error && pastReviews.length === 0 && <p className="error-message">{error}</p>}


      <div className="reviews-list">
        {pastReviews.length === 0 && anonymousReviews.length === 0 ? (
          <p>You have no past reviews.</p>
        ) : (
          <>
            {pastReviews.map((review) => (
              <div key={review._id} className="review-card">
                <h3 className="review-title">
                  {review.username} - {review.title} ({review.type})
                </h3>
                <div className="rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star ${
                        star <= review.rating ? "filled" : ""
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p>{review.reviewText}</p>
              </div>
            ))}

            {anonymousReviews.map((review) => (
              <div key={review._id} className="review-card">
                <h3 className="review-title">
                  Anonymous - {review.title} ({review.type})
                </h3>
                <div className="rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star ${
                        star <= review.rating ? "filled" : ""
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p>{review.reviewText}</p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default PastReviewsPage;