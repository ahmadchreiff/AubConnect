import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { ClipLoader } from "react-spinners";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import "boxicons/css/boxicons.min.css";

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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
  const navigate = useNavigate();

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
      if (!username) {
        setError("You must be logged in to upvote reviews.");
        return;
      }

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
      
      setSuccess("Review upvoted!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upvote review.");
      console.error("Error upvoting review:", err);
    }
  };

  // Handle downvote
  const handleDownvote = async (id) => {
    try {
      const username = getUsernameFromToken();
      if (!username) {
        setError("You must be logged in to downvote reviews.");
        return;
      }

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
      
      setSuccess("Review downvoted!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to downvote review.");
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
    if (!username) {
      setError("You must be logged in to post a review.");
      return;
    }

    // Validate form
    if (!newReview.title.trim()) {
      setError("Please enter a title for your review.");
      return;
    }

    if (newReview.rating === 0) {
      setError("Please select a rating.");
      return;
    }

    if (!newReview.reviewText.trim()) {
      setError("Please write your review.");
      return;
    }

    try {
      const reviewData = {
        ...newReview,
        username: newReview.anonymous ? "Anonymous" : username,
      };

      if (editReviewId) {
        // Update the review
        const response = await axios.put(
          `http://localhost:5001/api/reviews/${editReviewId}`, 
          reviewData,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        console.log("Review updated:", response.data);
      } else {
        // Submit a new review
        const response = await axios.post(
          "http://localhost:5001/api/reviews", 
          reviewData,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
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
      setError(err.response?.data?.message || "Failed to submit review.");
      console.error("Error submitting review:", err);
    }
  };

  const handleEditReview = (id) => {
    const reviewToEdit = reviews.find((review) => review._id === id);
    if (reviewToEdit) {
      setNewReview({
        type: reviewToEdit.type,
        title: reviewToEdit.title,
        rating: reviewToEdit.rating,
        reviewText: reviewToEdit.reviewText,
        anonymous: reviewToEdit.username === "Anonymous",
      });
      setEditReviewId(id);
      setIsModalOpen(true);
    }
  };

  const handleDeleteReview = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this review?");
    if (!isConfirmed) return;

    const username = getUsernameFromToken();
    if (!username) {
      setError("You must be logged in to delete a review.");
      return;
    }

    try {
      await axios.delete(`http://localhost:5001/api/reviews/${id}`, {
        data: { username },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const updatedReviews = reviews.filter((review) => review._id !== id);
      setReviews(updatedReviews);
      setSuccess("Review deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete review.");
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

  // Filter and search reviews
  const filteredReviews = () => {
    let filtered = [...reviews];
    
    // Apply search query
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(review => 
        review.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        review.reviewText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply type filter
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
        ((b.upvotes?.length || 0) - (b.downvotes?.length || 0)) - 
        ((a.upvotes?.length || 0) - (a.downvotes?.length || 0))
      );
    } else {
      // newest (default)
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    return filtered;
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return "bg-green-100 text-green-700";
    if (rating >= 3) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and brand */}
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <div className="h-10 w-10 mr-2">
                  <svg viewBox="0 0 100 100" className="h-full w-full fill-current text-[#860033]">
                    <path d="M50,15 C35,15 25,25 25,40 C25,50 30,55 40,65 C45,70 50,85 50,85 C50,85 55,70 60,65 C70,55 75,50 75,40 C75,25 65,15 50,15 Z"></path>
                  </svg>
                </div>
                <span className="font-serif text-xl tracking-tight text-[#860033]">AubConnect</span>
              </Link>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-3">
              <Link to="/courses" className="text-gray-700 hover:text-[#860033] px-3 py-2 text-sm font-medium">
                Courses
              </Link>
              <Link to="/professors" className="text-gray-700 hover:text-[#860033] px-3 py-2 text-sm font-medium">
                Professors
              </Link>
              <Link to="/reviews" className="text-[#860033] px-3 py-2 text-sm font-medium border-b-2 border-[#860033]">
                Reviews
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-[#860033] px-3 py-2 text-sm font-medium">
                About
              </Link>
              
              {loggedInUsername ? (
                <div className="flex items-center gap-3">
                  <span className="text-gray-700 text-sm">
                    Hi, {loggedInUsername}
                  </span>
                  <button 
                    onClick={() => {
                      localStorage.removeItem("token");
                      setLoggedInUsername("");
                      navigate("/login");
                    }}
                    className="text-gray-700 hover:text-[#860033] px-3 py-2 text-sm font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-[#860033] ml-3 px-3 py-2 text-sm font-medium border border-gray-300 rounded-lg">
                    Log In
                  </Link>
                  <Link to="/register" className="bg-[#860033] text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#6a0026] transition-all duration-200">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Stats */}
      <section className="bg-gradient-to-r from-[#860033] to-[#6a0026] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Campus Reviews</h1>
              <p className="text-lg opacity-90">
                See what students are saying about courses and professors at AUB
              </p>
              
              <div className="flex flex-wrap gap-x-6 gap-y-3 mt-6">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mr-2">
                    <i className="bx bx-book-alt text-lg"></i>
                  </div>
                  <div>
                    <p className="text-xl font-semibold">{calculateStats().courseCount}</p>
                    <p className="text-sm text-white/80">Courses</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mr-2">
                    <i className="bx bx-user text-lg"></i>
                  </div>
                  <div>
                    <p className="text-xl font-semibold">{calculateStats().professorCount}</p>
                    <p className="text-sm text-white/80">Professors</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mr-2">
                    <i className="bx bx-message-square-detail text-lg"></i>
                  </div>
                  <div>
                    <p className="text-xl font-semibold">{reviews.length}</p>
                    <p className="text-sm text-white/80">Reviews</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (!loggedInUsername) {
                    setError("You must be logged in to post a review.");
                    return;
                  }
                  setIsModalOpen(true);
                }}
                className="bg-white text-[#860033] px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-pink-50 transition-all duration-300 flex items-center"
              >
                <i className="bx bx-plus mr-2 text-xl"></i> Add a Review
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="bx bx-search text-gray-400 text-xl"></i>
            </div>
            <input
              type="text"
              placeholder="Search for courses, professors, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#860033] focus:border-[#860033] transition-all"
            />
          </div>
        </div>
      </div>

      {/* Notification Messages */}
      <div className="fixed top-5 right-5 z-50">
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg mb-2 flex items-center"
            >
              <i className="bx bx-error-circle mr-2 text-xl"></i>
              {error}
              <button 
                onClick={() => setError("")}
                className="ml-3 text-white/80 hover:text-white"
              >
                <i className="bx bx-x"></i>
              </button>
            </motion.div>
          )}
          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center"
            >
              <i className="bx bx-check-circle mr-2 text-xl"></i>
              {success}
              <button 
                onClick={() => setSuccess("")}
                className="ml-3 text-white/80 hover:text-white"
              >
                <i className="bx bx-x"></i>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Sorting */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
            <button 
              className={`px-4 py-2 rounded-md transition-all whitespace-nowrap ${filter === 'all' ? 'bg-pink-100 text-[#860033] font-medium' : 'hover:bg-gray-100'}`}
              onClick={() => setFilter('all')}
            >
              All Reviews
            </button>
            <button 
              className={`px-4 py-2 rounded-md transition-all whitespace-nowrap ${filter === 'courses' ? 'bg-pink-100 text-[#860033] font-medium' : 'hover:bg-gray-100'}`}
              onClick={() => setFilter('courses')}
            >
              Courses
            </button>
            <button 
              className={`px-4 py-2 rounded-md transition-all whitespace-nowrap ${filter === 'professors' ? 'bg-pink-100 text-[#860033] font-medium' : 'hover:bg-gray-100'}`}
              onClick={() => setFilter('professors')}
            >
              Professors
            </button>
          </div>
          <div className="flex items-center">
            <label className="mr-2 text-gray-600 whitespace-nowrap">Sort by:</label>
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
        ) : filteredReviews().length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center mt-8">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <i className="bx bx-search text-gray-400 text-3xl"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery ? "Try adjusting your search or filter criteria." : 
                "Be the first to share your experience!"}
            </p>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="text-[#860033] font-medium hover:underline"
              >
                Clear search
              </button>
            )}
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
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                            review.type === "course" 
                              ? "bg-pink-100 text-[#860033]" 
                              : "bg-amber-100 text-amber-800"
                          }`}>
                            {review.type === "course" ? "Course" : "Professor"}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">{review.title}</h3>
                        <p className="text-sm text-gray-500">
                          by {review.username}
                        </p>
                      </div>
                      <div className={`${getRatingColor(review.rating)} text-xl font-bold rounded-lg h-12 w-12 flex items-center justify-center`}>
                        {review.rating.toFixed(1)}
                      </div>
                    </div>
                    
                    <div className="flex mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i 
                          key={star}
                          className={`bx ${star <= review.rating ? 'bxs-star text-[#ffd700]' : 'bx-star text-gray-300'} text-xl`}
                        ></i>
                      ))}
                    </div>
                    
                    <p className="text-gray-700 mb-5 line-clamp-4">{review.reviewText}</p>
                    
                    <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => handleUpvote(review._id)} 
                          className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${
                            review.upvotes?.includes(loggedInUsername)
                              ? "bg-[#860033]/10 text-[#860033]"
                              : "bg-gray-50 hover:bg-pink-50 text-gray-600 hover:text-[#860033]"
                          }`}
                        >
                          <i className={`bx ${review.upvotes?.includes(loggedInUsername) ? 'bxs-like' : 'bx-like'}`}></i>
                          <span>{review.upvotes?.length || 0}</span>
                        </button>
                        <button 
                          onClick={() => handleDownvote(review._id)} 
                          className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${
                            review.downvotes?.includes(loggedInUsername)
                              ? "bg-red-100 text-red-600"
                              : "bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600"
                          }`}
                        >
                          <i className={`bx ${review.downvotes?.includes(loggedInUsername) ? 'bxs-dislike' : 'bx-dislike'}`}></i>
                          <span>{review.downvotes?.length || 0}</span>
                        </button>
                      </div>
                      
                      {review.username === loggedInUsername && (
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleEditReview(review._id)} 
                            className="text-sm text-[#860033] hover:text-[#6a0026] transition-colors flex items-center"
                          >
                            <i className="bx bx-edit mr-1"></i> Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteReview(review._id)} 
                            className="text-sm text-red-600 hover:text-red-800 transition-colors flex items-center"
                          >
                            <i className="bx bx-trash mr-1"></i> Delete
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
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-lg w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-[#860033] to-[#6a0026] text-white py-4 px-6 flex justify-between items-center">
                <h2 className="text-xl font-bold">
                  {editReviewId ? "Edit Your Review" : "Share Your Experience"}
                </h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <i className="bx bx-x text-2xl"></i>
                </button>
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
                      {newReview.type === "course" ? "Course Code/Name" : "Professor Name"}
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={newReview.title}
                      onChange={handleInputChange}
                      placeholder={newReview.type === "course" ? "e.g., CMPS 200" : "e.g., Dr. John Smith"}
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
                          <i
                            className={`bx ${star <= newReview.rating ? 'bxs-star text-[#ffd700]' : 'bx-star text-gray-300'} text-3xl cursor-pointer hover:text-[#ffd700] transition-colors`}
                          ></i>
                        </button>
                      ))}
                      <span className="ml-2 text-gray-500 self-center">
                        {newReview.rating > 0 ? `${newReview.rating}/5` : "Select a rating"}
                      </span>
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
                      placeholder="Share your experience with this course or professor..."
                      rows="5"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#860033] focus:border-[#860033] resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Be constructive and respectful in your review to help others make informed decisions.
                    </p>
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
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#860033] focus:border-[#860033] transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={submitReview}
                    className="px-4 py-2 bg-gradient-to-r from-[#860033] to-[#6a0026] rounded-md text-white shadow-sm hover:from-[#9a0039] hover:to-[#7a002d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#860033] transition-all duration-200"
                  >
                    {editReviewId ? "Update Review" : "Submit Review"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-1 text-[#860033]">
              <div className="h-8 w-8">
                <svg viewBox="0 0 100 100" className="h-full w-full fill-current">
                  <path d="M50,15 C35,15 25,25 25,40 C25,50 30,55 40,65 C45,70 50,85 50,85 C50,85 55,70 60,65 C70,55 75,50 75,40 C75,25 65,15 50,15 Z"></path>
                </svg>
              </div>
              <span className="font-serif text-lg">AubConnect</span>
            </div>
            
            <div className="flex items-center space-x-6">
              <Link to="/about" className="text-sm text-gray-500 hover:text-gray-900">About</Link>
              <Link to="/privacy" className="text-sm text-gray-500 hover:text-gray-900">Privacy</Link>
              <Link to="/terms" className="text-sm text-gray-500 hover:text-gray-900">Terms</Link>
              <Link to="/contact" className="text-sm text-gray-500 hover:text-gray-900">Contact</Link>
            </div>
            
            <div className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} American University of Beirut
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ReviewsPage;