import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { ClipLoader } from "react-spinners";
import { motion, AnimatePresence } from "framer-motion";

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
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [sortOption, setSortOption] = useState("newest");

  // Fetch reviews and set logged-in username
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/reviews");
        setReviews(response.data);
      } catch (err) {
        setError("Failed to fetch reviews.");
        console.error("Error fetching reviews:", err);
      } finally {
        setIsLoading(false);
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

  // Calculate statistics for more meaningful metrics
  const calculateStats = () => {
    if (reviews.length === 0) return { courseCount: 0, professorCount: 0, highestRated: { title: 'N/A', rating: 0 } };
    
    const courseReviews = reviews.filter(review => review.type === 'course');
    const professorReviews = reviews.filter(review => review.type === 'professor');
    
    // Find highest rated item
    const highestRated = [...reviews].sort((a, b) => b.rating - a.rating)[0] || { title: 'N/A', rating: 0 };
    
    // Get unique courses/professors (only count unique titles)
    const uniqueCourses = new Set(courseReviews.map(review => review.title));
    const uniqueProfessors = new Set(professorReviews.map(review => review.title));
    
    return {
      courseCount: uniqueCourses.size,
      professorCount: uniqueProfessors.size,
      highestRated
    };
  };

  // Filter reviews
  const filteredReviews = () => {
    let filtered = [...reviews];
    
    if (filter === "courses") {
      filtered = filtered.filter(review => review.type === "course");
    } else if (filter === "professors") {
      filtered = filtered.filter(review => review.type === "professor");
    }
    
    // Sort reviews
    if (sortOption === "highest") {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortOption === "lowest") {
      filtered.sort((a, b) => a.rating - b.rating);
    } else if (sortOption === "mostHelpful") {
      filtered.sort((a, b) => 
        (b.upvotes?.length || 0) - (a.upvotes?.length || 0)
      );
    } else {
      // newest (default)
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    return filtered;
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return "text-green-500";
    if (rating >= 3) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-gradient-to-r from-[#860033] to-[#6a0026] text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Campus Reviews</h1>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#860033]" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{calculateStats().courseCount}</p>
                    <p className="text-xs text-gray-500">Courses</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-700" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{calculateStats().professorCount}</p>
                    <p className="text-xs text-gray-500">Professors</p>
                  </div>
                </div>
                
                {calculateStats().highestRated.title !== 'N/A' && (
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-700" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Top Rated: {calculateStats().highestRated.title}</p>
                      <p className="text-xs text-gray-500">{calculateStats().highestRated.rating} / 5</p>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-sm opacity-80 mt-2">{reviews.length} total reviews</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-[#860033] px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-pink-50 transition-all duration-300"
            >
              + Add a Review
            </motion.button>
          </div>
        </div>
      </header>

      {/* Notification Messages */}
      <div className="fixed top-5 right-5 z-50">
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg mb-2"
            >
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg"
            >
              {success}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Filters and Sorting */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex gap-4">
            <button 
              className={`px-4 py-2 rounded-md transition-all ${filter === 'all' ? 'bg-pink-100 text-[#860033] font-medium' : 'hover:bg-gray-100'}`}
              onClick={() => setFilter('all')}
            >
              All Reviews
            </button>
            <button 
              className={`px-4 py-2 rounded-md transition-all ${filter === 'courses' ? 'bg-pink-100 text-[#860033] font-medium' : 'hover:bg-gray-100'}`}
              onClick={() => setFilter('courses')}
            >
              Courses
            </button>
            <button 
              className={`px-4 py-2 rounded-md transition-all ${filter === 'professors' ? 'bg-pink-100 text-[#860033] font-medium' : 'hover:bg-gray-100'}`}
              onClick={() => setFilter('professors')}
            >
              Professors
            </button>
          </div>
          <div className="flex items-center">
            <label className="mr-2 text-gray-600">Sort by:</label>
            <select 
              value={sortOption} 
              onChange={(e) => setSortOption(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#860033] focus:border-[#860033]"
            >
              <option value="newest">Newest</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
              <option value="mostHelpful">Most Helpful</option>
            </select>
          </div>
        </div>

        {/* Reviews Section */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <ClipLoader color="#860033" size={50} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <AnimatePresence>
              {filteredReviews().map((review, index) => (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full mb-2"
                          style={{ 
                            backgroundColor: review.type === "course" ? "#FFF1F2" : "#FEF3C7",
                            color: review.type === "course" ? "#860033" : "#854D0E" 
                          }}
                        >
                          {review.type === "course" ? "Course" : "Professor"}
                        </span>
                        <h3 className="text-xl font-bold text-gray-800">{review.title}</h3>
                        <p className="text-sm text-gray-500">
                          by {review.anonymous ? "Anonymous" : review.username}
                        </p>
                      </div>
                      <div className={`text-2xl font-bold rounded-full h-10 w-10 flex items-center justify-center ${getRatingColor(review.rating)}`}>
                        {review.rating}
                      </div>
                    </div>
                    
                    <div className="flex mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg 
                          key={star} 
                          className={`h-5 w-5 ${star <= review.rating ? `text-[#ffd700]` : `text-gray-300`}`}
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    
                    <p className="text-gray-700 mb-5">{review.reviewText}</p>
                    
                    <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => handleUpvote(review._id)} 
                          className="flex items-center space-x-1 px-3 py-1 bg-gray-50 hover:bg-pink-50 text-gray-600 hover:text-[#860033] rounded-full transition-colors"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905v.714L7.5 9h-3a2 2 0 00-2 2v.5" />
                          </svg>
                          <span>{review.upvotes?.length || 0}</span>
                        </button>
                        <button 
                          onClick={() => handleDownvote(review._id)} 
                          className="flex items-center space-x-1 px-3 py-1 bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-full transition-colors"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 14l-4 4m0 0l-4-4m4 4V5" />
                          </svg>
                          <span>{review.downvotes?.length || 0}</span>
                        </button>
                      </div>
                      
                      {review.username === loggedInUsername && (
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleEditReview(review._id)} 
                            className="text-sm text-[#860033] hover:text-[#6a0026] transition-colors"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteReview(review._id)} 
                            className="text-sm text-red-600 hover:text-red-800 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Modal for review submission */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-lg w-full overflow-hidden"
            >
              <div className="bg-gradient-to-r from-[#860033] to-[#6a0026] text-white py-4 px-6">
                <h2 className="text-xl font-bold">
                  {editReviewId ? "Edit Your Review" : "Share Your Experience"}
                </h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Review Type
                    </label>
                    <select 
                      name="type" 
                      value={newReview.type} 
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#860033] focus:border-[#860033]"
                    >
                      <option value="course">Course</option>
                      <option value="professor">Professor</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={newReview.title}
                      onChange={handleInputChange}
                      placeholder="Enter course or professor name"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#860033] focus:border-[#860033]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rating
                    </label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRatingChange(star)}
                          className="focus:outline-none"
                        >
                          <svg 
                            className={`h-8 w-8 ${star <= newReview.rating ? `text-[#ffd700]` : `text-gray-300`} cursor-pointer hover:text-[#ffd700] transition-colors`}
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Review
                    </label>
                    <textarea
                      name="reviewText"
                      value={newReview.reviewText}
                      onChange={handleInputChange}
                      placeholder="Write your review here..."
                      rows="4"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#860033] focus:border-[#860033] resize-none"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="anonymous"
                      name="anonymous"
                      checked={newReview.anonymous}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-[#860033] focus:ring-[#860033] border-gray-300 rounded"
                    />
                    <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-700">
                      Submit Anonymously
                    </label>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#860033] focus:border-[#860033]"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={submitReview}
                    className="px-4 py-2 bg-gradient-to-r from-[#860033] to-[#6a0026] rounded-md text-white shadow-sm hover:from-[#9a0039] hover:to-[#7a002d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#860033]"
                  >
                    {editReviewId ? "Update Review" : "Submit Review"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReviewList;