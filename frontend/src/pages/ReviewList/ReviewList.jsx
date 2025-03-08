import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./ReviewList.css";

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    type: "course",
    title: "",
    rating: 0,
    reviewText: "",
    anonymous: false,
  });
  const [editReviewId, setEditReviewId] = useState(null);
  const [loggedInUsername, setLoggedInUsername] = useState("");

  // Fetch reviews and set logged-in username
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

    // Set the logged-in username
    const username = getUsernameFromToken();
    if (username) {
      setLoggedInUsername(username);
    }
  }, []);

  // Function to get the username from the JWT token
  const getUsernameFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to post a review.");
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

  // Handle upvote
  const handleUpvote = async (id) => {
    try {
      const username = getUsernameFromToken();
      if (!username) return;

      const response = await axios.post(
        `http://localhost:5001/api/reviews/${id}/upvote`,
        { username },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === id ? response.data.review : review
        )
      );
    } catch (err) {
      setError("Failed to upvote review.");
      console.error("Error upvoting review:", err);
    }
  };

  // Handle downvote
  const handleDownvote = async (id) => {
    try {
      const username = getUsernameFromToken();
      if (!username) return;

      const response = await axios.post(
        `http://localhost:5001/api/reviews/${id}/downvote`,
        { username },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === id ? response.data.review : review
        )
      );
    } catch (err) {
      setError("Failed to downvote review.");
      console.error("Error downvoting review:", err);
    }
  };

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
    if (!username) return;

    try {
      const reviewData = {
        ...newReview,
        username: newReview.anonymous ? "Anonymous" : username,
      };

      if (editReviewId) {
        // Update the review
        const response = await axios.put(`http://localhost:5001/api/reviews/${editReviewId}`, reviewData);
        console.log("Review updated:", response.data);
      } else {
        // Submit a new review
        const response = await axios.post("http://localhost:5001/api/reviews", reviewData);
        console.log("Review submitted:", response.data);
      }

      // Fetch updated reviews
      const reviewsResponse = await axios.get("http://localhost:5001/api/reviews");
      setReviews(reviewsResponse.data);

      // Reset the form and close the modal
      setNewReview({
        type: "course",
        title: "",
        rating: 0,
        reviewText: "",
        anonymous: false,
      });
      setEditReviewId(null);
      setIsModalOpen(false);

      setSuccess(editReviewId ? "Review updated successfully!" : "Review posted successfully!");
      setTimeout(() => setSuccess(""), 3000); // Clear success message after 3 seconds
    } catch (err) {
      setError("Failed to submit review.");
      console.error("Error submitting review:", err);
    }
  };

  const handleEditReview = (id) => {
    const reviewToEdit = reviews.find((review) => review._id === id);
    if (reviewToEdit) {
      setNewReview(reviewToEdit);
      setEditReviewId(id);
      setIsModalOpen(true);
    }
  };

  const handleDeleteReview = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this review?");
    if (!isConfirmed) return;

    const username = getUsernameFromToken();
    if (!username) return;

    try {
      await axios.delete(`http://localhost:5001/api/reviews/${id}`, {
        data: { username },
      });
      const updatedReviews = reviews.filter((review) => review._id !== id);
      setReviews(updatedReviews);
      setSuccess("Review deleted successfully!"); // Set success message
      setTimeout(() => setSuccess(""), 3000); // Clear success message after 3 seconds
    } catch (err) {
      setError("Failed to delete review.");
      console.error("Error deleting review:", err);
    }
  };

  return (
    <div className="review-list-page">
      <h1>Reviews</h1>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      {/* Button to open the modal */}
      <button onClick={() => setIsModalOpen(true)} className="add-review-button">
        Add a Review
      </button>

      {/* Modal for review submission */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editReviewId ? "Edit Review" : "Submit a Review"}</h2>
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
                {editReviewId ? "Update Review" : "Submit Review"}
              </button>
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* List of reviews */}
      <div className="reviews-container">
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
            <div className="vote-buttons">
              <button onClick={() => handleUpvote(review._id)}>
                👍 {review.upvotes?.length || 0}
              </button>
              <button onClick={() => handleDownvote(review._id)}>
                👎 {review.downvotes?.length || 0}
              </button>
            </div>
            {review.username === loggedInUsername && (
              <div className="actions">
                <button onClick={() => handleEditReview(review._id)} className="action-btn">
                  Edit
                </button>
                <button onClick={() => handleDeleteReview(review._id)} className="action-btn">
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;