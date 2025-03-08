import React, { useState, useEffect } from "react";
import axios from "axios";
// import jwtDecode from "jwt-decode"; // Install this library to decode JWT tokens
import { jwtDecode } from "jwt-decode";
import "./ReviewPage.css";

const ReviewPage = () => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    type: "course",
    title: "",
    rating: 0,
    reviewText: "",
    anonymous: false,
  });
  const [editReviewId, setEditReviewId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Function to get the username from the JWT token
  const getUsernameFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to post a review.");
      return null;
    }

    try {
      const decoded = jwtDecode(token);
      return decoded.username; // Retrieve the username from the token
    } catch (err) {
      setError("Invalid token. Please log in again.");
      return null;
    }
  };

  // Fetch reviews from the backend when the component mounts
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/reviews");
        setReviews(response.data);
      } catch (err) {
        setError("Failed to fetch reviews.");
        console.error("Error fetching reviews:", err);
      }
    };

    fetchReviews();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewReview({
      ...newReview,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleRatingChange = (rating) => {
    setNewReview({ ...newReview, rating });
  };

  const submitReview = async () => {
    const username = getUsernameFromToken();
    if (!username) return; // Stop if username is not available

    try {
      const reviewData = {
        ...newReview,
        username: newReview.anonymous ? "Anonymous" : username, // Include the username (or "Anonymous")
      };

      if (editReviewId !== null) {
        // Update the review (delete the old one and create a new one)
        const response = await axios.put(`http://localhost:5001/api/reviews/${editReviewId}`, reviewData);
        console.log("Review updated:", response.data);

        // Reset the edit state
        setEditReviewId(null);
      } else {
        // Submit a new review
        const response = await axios.post("http://localhost:5001/api/reviews", reviewData);
        console.log("Review submitted:", response.data);
      }

      // Fetch updated reviews
      const reviewsResponse = await axios.get("http://localhost:5001/api/reviews");
      setReviews(reviewsResponse.data);

      // Reset the form
      setNewReview({
        type: "course",
        title: "",
        rating: 0,
        reviewText: "",
        anonymous: false,
      });

      setSuccess(editReviewId !== null ? "Review updated successfully!" : "Review posted successfully!");
    } catch (err) {
      setError("Failed to submit review.");
      console.error("Error submitting review:", err);
    }
  };

  const editReview = (id) => {
    const reviewToEdit = reviews.find((review) => review._id === id);
    setNewReview(reviewToEdit);
    setEditReviewId(id);
  };

  const deleteReview = async (id) => {
    try {
      // Send a DELETE request to the backend
      await axios.delete(`http://localhost:5001/api/reviews/${id}`);

      // Remove the deleted review from the local state
      const updatedReviews = reviews.filter((review) => review._id !== id);
      setReviews(updatedReviews);

      // Show a success message
      setSuccess("Review deleted successfully!");
    } catch (err) {
      setError("Failed to delete review.");
      console.error("Error deleting review:", err);
    }
  };

  const handleVote = async (id, type) => {
    try {
      await axios.post(`http://localhost:5001/api/reviews/${id}/vote`, { type });
      const response = await axios.get("http://localhost:5001/api/reviews");
      setReviews(response.data);
    } catch (err) {
      setError("Failed to vote.");
      console.error("Error voting:", err);
    }
  };

  return (
    <div className="review-page">
      <h1 className="header">AUB Review Hub</h1>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <div className="review-form">
        <div className="form-group">
          <label>Review Type:</label>
          <select name="type" value={newReview.type} onChange={handleInputChange}>
            <option value="course">Course</option>
            <option value="professor">Professor</option>
          </select>
        </div>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={newReview.title}
            onChange={handleInputChange}
            placeholder="Enter course or professor name"
          />
        </div>
        <div className="form-group">
          <label>Rating:</label>
          <div className="rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${star <= newReview.rating ? "filled" : ""}`}
                onClick={() => handleRatingChange(star)}
              >
                ★
              </span>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label>Review:</label>
          <textarea
            name="reviewText"
            value={newReview.reviewText}
            onChange={handleInputChange}
            placeholder="Write your review here..."
          />
        </div>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="anonymous"
              checked={newReview.anonymous}
              onChange={handleInputChange}
            />
            Submit Anonymously
          </label>
        </div>
        <button onClick={submitReview}>
          {editReviewId !== null ? "Update Review" : "Submit Review"}
        </button>
      </div>

      <div className="reviews-list">
        <h2>Latest Reviews</h2>
        {reviews.map((review) => (
          <div key={review._id} className="review-card">
            <h3 className="review-title">
              {review.username} - {review.title} ({review.type})
            </h3>
            <div className="rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${star <= review.rating ? "filled" : ""}`}
                >
                  ★
                </span>
              ))}
            </div>
            <p>{review.reviewText}</p>
            <div className="actions">
              <button onClick={() => editReview(review._id)} className="action-btn">
                Edit
              </button>
              <button onClick={() => deleteReview(review._id)} className="action-btn">
                Delete
              </button>
              <button onClick={() => handleVote(review._id, "upvote")} className="vote-btn">
                Upvote ({review.upvotes || 0})
              </button>
              <button onClick={() => handleVote(review._id, "downvote")} className="vote-btn">
                Downvote ({review.downvotes || 0})
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewPage;