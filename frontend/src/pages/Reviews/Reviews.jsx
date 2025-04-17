import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { ClipLoader } from "react-spinners";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import SearchableProfessorDropdown from "../../components/SearchableProfessorDropdown";
import "boxicons/css/boxicons.min.css";

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newReview, setNewReview] = useState({
    type: "course",
    title: "",
    department: "",
    course: "",
    professor: "",
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
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [currentReportReview, setCurrentReportReview] = useState(null);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch reviews
        const reviewsRes = await axios.get("http://localhost:5001/api/reviews");
        setReviews(reviewsRes.data.filter(review => review.status !== 'rejected'));

        // Fetch departments
        const departmentsRes = await axios.get("http://localhost:5001/api/departments");
        setDepartments(departmentsRes.data);

        // Fetch courses
        const coursesRes = await axios.get("http://localhost:5001/api/courses");
        setCourses(coursesRes.data);

        // Fetch professors
        const professorsRes = await axios.get("http://localhost:5001/api/professors");
        setProfessors(professorsRes.data);

      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();

    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setLoggedInUsername(decoded.username);
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    }
  }, []);

  // Filter courses based on selected department
  useEffect(() => {
    if (newReview.department) {
      const filtered = courses.filter(course => {
        if (typeof course.department === 'object') {
          return course.department._id === newReview.department;
        }
        return course.department === newReview.department;
      });
      setFilteredCourses(filtered);
      
      if (newReview.course && !filtered.some(c => c._id === newReview.course)) {
        setNewReview(prev => ({ ...prev, course: "" }));
      }
    } else {
      setFilteredCourses([]);
      setNewReview(prev => ({ ...prev, course: "" }));
    }
  }, [newReview.department, courses]);

  // Update the submitReview function
  const submitReview = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to post a review.");
      return;
    }
  
    // Validation
    if (newReview.type === "course" && (!newReview.department || !newReview.course)) {
      setError("Please select both department and course.");
      return;
    }
    
    if (newReview.type === "professor" && !newReview.professor) {
      setError("Please select a professor.");
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
      // Prepare the review data
      const reviewData = {
        type: newReview.type,
        title: newReview.title,
        rating: newReview.rating,
        reviewText: newReview.reviewText,
        username: loggedInUsername,
        anonymous: newReview.anonymous,
        isAnonymous: newReview.anonymous,
        displayName: newReview.anonymous ? "Anonymous" : loggedInUsername
      };
  
      // Add type-specific fields
      if (newReview.type === "professor") {
        reviewData.professor = newReview.professor;
      } else {
        reviewData.department = newReview.department;
        reviewData.course = newReview.course;
      }
  
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
  
      let response;
      if (editReviewId) {
        response = await axios.put(
          `http://localhost:5001/api/reviews/${editReviewId}`,
          reviewData,
          config
        );
      } else {
        response = await axios.post(
          "http://localhost:5001/api/reviews",
          reviewData,
          config
        );
      }
  
      // Refresh reviews
      const reviewsRes = await axios.get("http://localhost:5001/api/reviews");
      setReviews(reviewsRes.data.filter(review => review.status !== 'rejected'));
  
      // Reset form
      setNewReview({
        type: "course",
        title: "",
        department: "",
        course: "",
        professor: "",
        rating: 0,
        reviewText: "",
        anonymous: false,
      });
      setEditReviewId(null);
      setIsModalOpen(false);
  
      setSuccess(editReviewId ? "Review updated!" : "Review posted!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error submitting review:", err.response?.data || err);
      setError(err.response?.data?.message || "Failed to submit review.");
    }
  };
  // Handle report submission
  // Update the submitReport function in Reviews.jsx
const submitReport = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    setError("You must be logged in to report a review.");
    return;
  }

  if (!reportReason) {
    setError("Please select a reason for reporting.");
    return;
  }

  try {
    const config = {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    const response = await axios.post(
      `http://localhost:5001/api/reviews/${currentReportReview._id}/report`,
      {
        reason: reportReason,
        details: reportDetails || "No additional details",
        username: loggedInUsername  // Changed from 'reporter' to 'username'
      },
      config
    );

    if (response.data.message === "Review reported successfully!") {
      setIsReportModalOpen(false);
      setCurrentReportReview(null);
      setReportReason('');
      setReportDetails('');
      setSuccess("Report submitted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } else {
      setError(response.data.message || "Report submission failed.");
    }
  } catch (err) {
    console.error("Report submission error:", err);
    
    let errorMsg = "Failed to submit report";
    if (err.response) {
      if (err.response.status === 404) {
        errorMsg = "Review not found";
      } else if (err.response.data?.message) {
        errorMsg = err.response.data.message;
      }
    }
    setError(errorMsg);
  }
};
  // Handle upvote
  const handleUpvote = async (reviewId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to vote.");
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      await axios.post(
        `http://localhost:5001/api/reviews/${reviewId}/upvote`,
        {},
        config
      );

      // Refresh reviews
      const reviewsRes = await axios.get("http://localhost:5001/api/reviews");
      setReviews(reviewsRes.data.filter(review => review.status !== 'rejected'));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upvote.");
      console.error("Error upvoting:", err);
    }
  };

  // Handle downvote
  const handleDownvote = async (reviewId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to vote.");
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      await axios.post(
        `http://localhost:5001/api/reviews/${reviewId}/downvote`,
        {},
        config
      );

      // Refresh reviews
      const reviewsRes = await axios.get("http://localhost:5001/api/reviews");
      setReviews(reviewsRes.data.filter(review => review.status !== 'rejected'));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to downvote.");
      console.error("Error downvoting:", err);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to delete a review.");
      return;
    }
  
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }
  
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
  
      // Get the decoded token to get the username
      const decoded = jwtDecode(token);
      const username = decoded.username;
  
      await axios.delete(
        `http://localhost:5001/api/reviews/${reviewId}`,
        {
          ...config,
          data: { username } // Send username in the request body
        }
      );
  
      // Refresh reviews
      const reviewsRes = await axios.get("http://localhost:5001/api/reviews");
      setReviews(reviewsRes.data.filter(review => review.status !== 'rejected'));
      setSuccess("Review deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete review.");
      console.error("Error deleting review:", err);
    }
  };
  // Filter and sort reviews
  const filteredReviews = () => {
    try {
      if (!Array.isArray(reviews)) return []; // Safety check
      
      let filtered = [...reviews];
    
      // Apply search query
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(review => {
          // Skip if review is invalid
          if (!review || typeof review !== 'object') return false;
          
          // Check basic fields
          const matchesBasicFields = 
            (review.title && review.title.toLowerCase().includes(query)) ||
            (review.reviewText && review.reviewText.toLowerCase().includes(query)) ||
            (review.username && review.username.toLowerCase().includes(query));
          
          // Check course-specific fields if it's a course review
          const matchesCourseFields = review.type === "course" && 
            review.course && (
              (review.course.name && review.course.name.toLowerCase().includes(query)) ||
              (review.course.courseNumber && review.course.courseNumber.toLowerCase().includes(query)) ||
              (review.department && review.department.code && review.department.code.toLowerCase().includes(query))
            );
          
          return matchesBasicFields || matchesCourseFields;
        });
      }
      // Apply type filter
      if (filter === "courses") {
        filtered = filtered.filter(review => review.type === "course");
      } else if (filter === "professors") {
        filtered = filtered.filter(review => review.type === "professor");
      }
  
      // Apply sorting
      if (sortOption === "highest") {
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      } else if (sortOption === "lowest") {
        filtered.sort((a, b) => (a.rating || 0) - (b.rating || 0));
      } else if (sortOption === "mostHelpful") {
        filtered.sort((a, b) => 
          ((b.upvotes?.length || 0) - (b.downvotes?.length || 0)) -
          ((a.upvotes?.length || 0) - (a.downvotes?.length || 0))
        );
      } else {
        // Default: newest first
        filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      }
  
      return filtered;
    } catch (err) {
      console.error("Error filtering reviews:", err);
      return []; // Return empty array if error occurs
    }
  };

  // Helper functions
  const getRatingColor = (rating) => {
    if (rating >= 4) return "bg-green-100 text-green-700";
    if (rating >= 3) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Render
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#860033] to-[#6a0026] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Campus Reviews</h1>
              <p className="text-lg opacity-90">
                See what students are saying about courses and professors
              </p>
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
                          <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${review.type === "course"
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
                        {review.department && review.course && (
                          <p className="text-xs text-gray-500 mt-1">
                            {review.department.code} Department
                          </p>
                        )}
                        <p className="text-sm text-gray-500">
                          by {review.anonymous ? "Anonymous" : review.username}
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
                          className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${review.upvotes?.includes(loggedInUsername)
                            ? "bg-[#860033]/10 text-[#860033]"
                            : "bg-gray-50 hover:bg-pink-50 text-gray-600 hover:text-[#860033]"
                            }`}
                        >
                          <i className={`bx ${review.upvotes?.includes(loggedInUsername) ? 'bxs-like' : 'bx-like'}`}></i>
                          <span>{review.upvotes?.length || 0}</span>
                        </button>
                        <button
                          onClick={() => handleDownvote(review._id)}
                          className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${review.downvotes?.includes(loggedInUsername)
                            ? "bg-red-100 text-red-600"
                            : "bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600"
                            }`}
                        >
                          <i className={`bx ${review.downvotes?.includes(loggedInUsername) ? 'bxs-dislike' : 'bx-dislike'}`}></i>
                          <span>{review.downvotes?.length || 0}</span>
                        </button>
                        {loggedInUsername && loggedInUsername !== review.username && (
                          <button
                            onClick={() => {
                              setCurrentReportReview(review);
                              setIsReportModalOpen(true);
                            }}
                            className="flex items-center space-x-1 px-3 py-1 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition-colors"
                          >
                            <i className="bx bx-flag"></i>
                            <span>Report</span>
                          </button>
                        )}
                      </div>

                      {review.username === loggedInUsername && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setNewReview({
                                type: review.type,
                                title: review.title,
                                department: review.department?._id || "",
                                course: review.course?._id || "",
                                professor: review.professor?._id || "",
                                rating: review.rating,
                                reviewText: review.reviewText,
                                anonymous: review.anonymous || false
                              });
                              setEditReviewId(review._id);
                              setIsModalOpen(true);
                            }}
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

      {/* Review Submission Modal */}
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
                      onChange={(e) => setNewReview({...newReview, type: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#860033] focus:border-[#860033]"
                    >
                      <option value="course">Course</option>
                      <option value="professor">Professor</option>
                    </select>
                  </div>

                  {newReview.type === "course" ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Department
                        </label>
                        <select
                          name="department"
                          value={newReview.department}
                          onChange={(e) => setNewReview({...newReview, department: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#860033] focus:border-[#860033]"
                        >
                          <option value="">Select a department</option>
                          {departments.map(dept => (
                            <option key={dept._id} value={dept._id}>
                              {dept.code} - {dept.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Course
                        </label>
                        <select
                          name="course"
                          value={newReview.course}
                          onChange={(e) => setNewReview({...newReview, course: e.target.value})}
                          disabled={!newReview.department}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#860033] focus:border-[#860033] disabled:bg-gray-100 disabled:text-gray-500"
                        >
                          <option value="">
                            {newReview.department ? "Select a course" : "Select a department first"}
                          </option>
                          {filteredCourses.map(course => (
                            <option key={course._id} value={course._id}>
                              {course.courseNumber} - {course.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  ) : newReview.type === "professor" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Professor
                      </label>
                        <SearchableProfessorDropdown
                        professors={professors}
                          selectedProfessor={newReview.professor}
                          onChange={(e) => {
                            const professorId = e.target.value;
                            const selectedProf = professors.find(p => p._id === professorId);
                            setNewReview({
                              ...newReview,
                              professor: professorId,
                              title: selectedProf ? `Review for ${selectedProf.name}` : "Professor Review"
                            });
                          }}
                        />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rating
                    </label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview({...newReview, rating: star})}
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
                      onChange={(e) => setNewReview({...newReview, reviewText: e.target.value})}
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
                      onChange={(e) => setNewReview({...newReview, anonymous: e.target.checked})}
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

      {/* Report Modal */}
<AnimatePresence>
  {isReportModalOpen && currentReportReview && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={() => setIsReportModalOpen(false)}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-[#860033] to-[#6a0026] text-white py-4 px-6 flex justify-between items-center">
          <h2 className="text-xl font-bold">Report Review</h2>
          <button
            onClick={() => setIsReportModalOpen(false)}
            className="text-white/80 hover:text-white transition-colors"
          >
            <i className="bx bx-x text-2xl"></i>
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div>
              <p className="text-gray-700 mb-2">You are reporting the following review:</p>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="font-medium">{currentReportReview.title}</p>
                <p className="text-gray-600 text-sm line-clamp-2">{currentReportReview.reviewText}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Reporting
              </label>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#860033] focus:border-[#860033]"
                required
              >
                <option value="">Select a reason</option>
                <option value="inappropriate">Inappropriate content</option>
                <option value="spam">Spam or advertisement</option>
                <option value="misinformation">False information</option>
                <option value="harassment">Harassment or bullying</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Details (Optional)
              </label>
              <textarea
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                placeholder="Please provide more details about your report..."
                rows="3"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#860033] focus:border-[#860033] resize-none"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => setIsReportModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#860033] focus:border-[#860033] transition-all duration-200"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={submitReport}
              disabled={!reportReason}
              className={`px-4 py-2 rounded-md text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${
                !reportReason
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#860033] to-[#6a0026] hover:from-[#9a0039] hover:to-[#7a002d] focus:ring-[#860033]'
              }`}
            >
              Submit Report
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

      <Footer />
    </div>
  );
};

export default ReviewsPage;