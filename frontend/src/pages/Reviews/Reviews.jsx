import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { ClipLoader } from "react-spinners";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import SearchableProfessorDropdown from "../../components/SearchableProfessorDropdown";
import "boxicons/css/boxicons.min.css";

const ReviewsPage = () => {
  // React hooks: useState and context setup
  const navigate = useNavigate();
  const location = useLocation();

  // Parse URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const reviewType = queryParams.get('type'); // 'professor' or 'course'
  const entityId = queryParams.get('id'); // professor or course ID
  const entityName = queryParams.get('name'); // professor name or course name
  const departmentId = queryParams.get('department'); // Only for courses
  const courseNumber = queryParams.get('courseNumber'); // Only for courses

  // State variables
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedProfessor, setSelectedProfessor] = useState("");
  const [uniqueCourses, setUniqueCourses] = useState([]);
  const [uniqueProfessors, setUniqueProfessors] = useState([]);
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
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [currentReportReview, setCurrentReportReview] = useState(null);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');

  // useEffect hooks
  // Handle auto-opening the form with prefilled data from URL params
  useEffect(() => {
    // Check if we have query parameters to prefill the form
    if (reviewType && entityId) {
      // First check if the user is logged in
      const username = getUsernameFromToken();
      if (!username) {
        setError("You must be logged in to post a review.");
        return;
      }

      // Prefill the form based on the redirect source
      const reviewData = {
        type: reviewType,
        title: entityName || "",
        department: reviewType === "course" ? departmentId || "" : "",
        course: reviewType === "course" ? entityId : "",
        professor: reviewType === "professor" ? entityId : "",
        rating: 0,
        reviewText: "",
        anonymous: false,
      };

      setNewReview(reviewData);

      // Auto-open the modal
      setIsModalOpen(true);

      // Clear the URL parameters after processing them
      // This prevents the form from reopening if the user refreshes the page
      navigate('/reviews', { replace: true });
    }
  }, [reviewType, entityId, entityName, departmentId, courseNumber, navigate, location.pathname, location.search]);

  // Update course or professor title when selection changes
  useEffect(() => {
    // Update title when course changes
    if (newReview.type === "course" && newReview.course) {
      const selectedCourse = courses.find(course => course._id === newReview.course);
      if (selectedCourse) {
        const deptCode = departments.find(d => d._id === newReview.department)?.code || '';
        const title = `${deptCode} ${selectedCourse.courseNumber}: ${selectedCourse.name}`;
        setNewReview(prev => ({ ...prev, title }));
      }
    }
    // Update title when professor changes
    else if (newReview.type === "professor" && newReview.professor) {
      const selectedProfessor = professors.find(prof => prof._id === newReview.professor);
      if (selectedProfessor) {
        setNewReview(prev => ({ ...prev, title: selectedProfessor.name }));
      }
    }
  }, [newReview.course, newReview.professor, newReview.department, newReview.type, courses, professors, departments]);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);

        // Fetch reviews
        const reviewsRes = await axios.get("https://aubconnectbackend-h22c.onrender.com/api/reviews");
        
        // Client-side safety filter to remove rejected reviews
        const filteredReviews = reviewsRes.data.filter(review =>
          review.status !== 'rejected'
        );
        setReviews(filteredReviews);

        // Fetch departments
        const departmentsRes = await axios.get("https://aubconnectbackend-h22c.onrender.com/api/departments");
        setDepartments(departmentsRes.data);

        // Fetch all courses
        const coursesRes = await axios.get("https://aubconnectbackend-h22c.onrender.com/api/courses");
        setCourses(coursesRes.data);

        // Fetch all professors
        const professorsRes = await axios.get("https://aubconnectbackend-h22c.onrender.com/api/professors");
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
        // Check if department is an object with _id property
        if (typeof course.department === 'object' && course.department !== null) {
          return course.department._id === newReview.department;
        }
        // Check if department is a string ID directly
        else {
          return course.department === newReview.department;
        }
      });
      setFilteredCourses(filtered);
      
      // Reset course selection if the previously selected course isn't in this department
      if (newReview.course && !filtered.find(c => c._id === newReview.course)) {
        setNewReview(prev => ({ ...prev, course: "" }));
      }
    } else {
      setFilteredCourses([]);
      setNewReview(prev => ({ ...prev, course: "" }));
    }
  }, [newReview.department, courses]);

  // Extract unique courses and professors from reviews
  useEffect(() => {
    // Extract unique courses from reviews
    const courseMap = new Map();
    const professorMap = new Map();

    reviews.forEach(review => {
      if (review.type === 'course' && review.course) {
        // For course, use the course ID as the key
        const courseId = review.course._id || review.course;
        // Only add if not already in the map
        if (!courseMap.has(courseId)) {
          courseMap.set(courseId, {
            id: courseId,
            title: review.title,
            // You can add more properties if needed
          });
        }
      } else if (review.type === 'professor' && review.professor) {
        // For professor, use the professor ID as the key
        const profId = review.professor._id || review.professor;
        // Only add if not already in the map
        if (!professorMap.has(profId)) {
          professorMap.set(profId, {
            id: profId,
            name: review.title,
            // You can add more properties if needed
          });
        }
      }
    });

    // Convert maps to arrays and sort alphabetically
    const sortedCourses = Array.from(courseMap.values()).sort((a, b) =>
      a.title.localeCompare(b.title)
    );

    const sortedProfessors = Array.from(professorMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    setUniqueCourses(sortedCourses);
    setUniqueProfessors(sortedProfessors);
  }, [reviews]);

  // Derived/computed variables
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
    try {
      if (!Array.isArray(reviews)) return []; // Safety check
      
      let filtered = [...reviews];
    
      // Apply search query
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(review => {
          // Skip if review is invalid
          if (!review || typeof review !== 'object') return false;
          
          // Check title and review text as before
          if (review.title.toLowerCase().includes(query) ||
            review.reviewText.toLowerCase().includes(query) ||
            review.username.toLowerCase().includes(query)) {
            return true;
          }

          // Additional checks for course information
          if (review.type === "course") {
            // Check course name if available
            if (review.course?.name?.toLowerCase().includes(query)) {
              return true;
            }
            // Check course number if available
            if (review.course?.courseNumber?.toLowerCase().includes(query)) {
              return true;
            }
            // Check department code if available
            if (review.department?.code?.toLowerCase().includes(query)) {
              return true;
            }
          }

          return false;
        });
      }

      // Filter by review type
      if (filter === "courses") {
        filtered = filtered.filter(review => review.type === "course");
      } else if (filter === "professors") {
        filtered = filtered.filter(review => review.type === "professor");
      }

      // Filter by specific course
      if (selectedCourse) {
        filtered = filtered.filter(review =>
          review.type === "course" &&
          (review.course?._id === selectedCourse || review.course === selectedCourse)
        );
      }

      // Filter by specific professor
      if (selectedProfessor) {
        filtered = filtered.filter(review =>
          review.type === "professor" &&
          (review.professor?._id === selectedProfessor || review.professor === selectedProfessor)
        );
      }

      // Sorting logic
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

  // Handler functions
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

  // Handle upvote
  const handleUpvote = async (id) => {
    try {
      const username = getUsernameFromToken();
      if (!username) {
        setError("You must be logged in to vote on reviews.");
        return;
      }

      // Find the review being upvoted
      const reviewToUpvote = reviews.find(review => review._id === id);

      // Check if the current user is the author of the review
      if (reviewToUpvote.username === username) {
        setError("You cannot vote on your own reviews.");
        return;
      }

      const response = await axios.post(
        `https://aubconnectbackend-h22c.onrender.com/api/reviews/${id}/upvote`,
        { username },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      // Refresh reviews
      const reviewsRes = await axios.get("https://aubconnectbackend-h22c.onrender.com/api/reviews");
      setReviews(reviewsRes.data.filter(review => review.status !== 'rejected'));

      setSuccess(response.data.message);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to process vote.");
      console.error("Error processing vote:", err);
      setTimeout(() => setError(""), 3000);
    }
  };

  // Handle downvote
  const handleDownvote = async (id) => {
    try {
      const username = getUsernameFromToken();
      if (!username) {
        setError("You must be logged in to vote on reviews.");
        return;
      }

      // Find the review being downvoted
      const reviewToDownvote = reviews.find(review => review._id === id);

      // Check if the current user is the author of the review
      if (reviewToDownvote.username === username) {
        setError("You cannot vote on your own reviews.");
        return;
      }

      const response = await axios.post(
        `https://aubconnectbackend-h22c.onrender.com/api/reviews/${id}/downvote`,
        { username },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      // Refresh reviews
      const reviewsRes = await axios.get("https://aubconnectbackend-h22c.onrender.com/api/reviews");
      setReviews(reviewsRes.data.filter(review => review.status !== 'rejected'));

      setSuccess(response.data.message);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to process vote.");
      console.error("Error processing vote:", err);
      setTimeout(() => setError(""), 3000);
    }
  };

  // Submit or update a review
  const submitReview = async () => {
    const username = getUsernameFromToken();
    if (!username) {
      setError("You must be logged in to post a review.");
      return;
    }

    // Validate form based on review type
    if (newReview.type === "course") {
      if (!newReview.department) {
        setError("Please select a department.");
        return;
      }

      if (!newReview.course) {
        setError("Please select a course.");
        return;
      }
    } else {
      // Professor review validation
      if (!newReview.professor) {
        setError("Please select a professor.");
        return;
      }
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
        username, // Always use actual username for ownership
        isAnonymous: newReview.anonymous, // Match both field names from branches
        anonymous: newReview.anonymous, // Pass anonymous flag instead of changing username
        displayName: newReview.anonymous ? "Anonymous" : username
      };

      let response;
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      };

      if (editReviewId) {
        // Update the review
        response = await axios.put(
          `https://aubconnectbackend-h22c.onrender.com/api/reviews/${editReviewId}`,
          reviewData,
          config
        );
      } else {
        // Submit a new review
        response = await axios.post(
          "https://aubconnectbackend-h22c.onrender.com/api/reviews",
          reviewData,
          config
        );
      }

      // Fetch updated reviews
      const reviewsResponse = await axios.get("https://aubconnectbackend-h22c.onrender.com/api/reviews");

      // Filter out rejected reviews
      const filteredReviews = reviewsResponse.data.filter(review =>
        review.status !== 'rejected'
      );
      setReviews(filteredReviews);

      // Reset the form and close the modal
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

      setSuccess(editReviewId ? "Review updated successfully!" : "Review posted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      if (err.response?.data?.error === "INAPPROPRIATE_CONTENT") {
        setError("Review contains inappropriate content, unable to post");
      } else {
        setError(err.response?.data?.message || "Failed to submit review.");
      }
      console.error("Error submitting review:", err);
    }
  };

  // Handle editing a review
  const handleEditReview = (id) => {
    const reviewToEdit = reviews.find((review) => review._id === id);
    if (reviewToEdit) {
      // Check if the review has received any feedback
      if ((reviewToEdit.upvotes && reviewToEdit.upvotes.length > 0) ||
        (reviewToEdit.downvotes && reviewToEdit.downvotes.length > 0)) {
        setError("Reviews that have received feedback cannot be edited.");
        return;
      }

      setNewReview({
        type: reviewToEdit.type,
        title: reviewToEdit.title,
        department: reviewToEdit.department?._id || "",
        course: reviewToEdit.course?._id || "",
        professor: reviewToEdit.professor?._id || "",
        rating: reviewToEdit.rating,
        reviewText: reviewToEdit.reviewText,
        anonymous: reviewToEdit.isAnonymous || reviewToEdit.anonymous || false
      });
      setEditReviewId(id);
      setIsModalOpen(true);
    }
  };

  // Handle deleting a review
  const handleDeleteReview = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this review?");
    if (!isConfirmed) return;

    const username = getUsernameFromToken();
    if (!username) {
      setError("You must be logged in to delete a review.");
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      };

      await axios.delete(
        `https://aubconnectbackend-h22c.onrender.com/api/reviews/${id}`,
        {
          ...config,
          data: { username } // Send username in the request body
        }
      );

      // Refresh reviews
      const reviewsRes = await axios.get("https://aubconnectbackend-h22c.onrender.com/api/reviews");
      setReviews(reviewsRes.data.filter(review => review.status !== 'rejected'));
      setSuccess("Review deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete review.");
      console.error("Error deleting review:", err);
    }
  };

  // Handle report submission
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
        `https://aubconnectbackend-h22c.onrender.com/api/reviews/${currentReportReview._id}/report`,
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

  // UI Helper functions
  const getRatingColor = (rating) => {
    if (rating >= 4) return "bg-green-100 text-green-700";
    if (rating >= 3) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
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
        <div className="flex flex-col gap-4 bg-white rounded-lg shadow-sm p-4 mb-6">
          {/* Filter buttons */}
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 w-full">
            <button
              className={`px-4 py-2 rounded-md transition-all whitespace-nowrap ${filter === 'all' ? 'bg-pink-100 text-[#860033] font-medium' : 'hover:bg-gray-100'}`}
              onClick={() => {
                setFilter('all');
                setSelectedCourse("");
                setSelectedProfessor("");
              }}
            >
              All Reviews
            </button>
            <button
              className={`px-4 py-2 rounded-md transition-all whitespace-nowrap ${filter === 'courses' ? 'bg-pink-100 text-[#860033] font-medium' : 'hover:bg-gray-100'}`}
              onClick={() => {
                setFilter('courses');
                setSelectedProfessor("");
              }}
            >
              Courses
            </button>
            <button
              className={`px-4 py-2 rounded-md transition-all whitespace-nowrap ${filter === 'professors' ? 'bg-pink-100 text-[#860033] font-medium' : 'hover:bg-gray-100'}`}
              onClick={() => {
                setFilter('professors');
                setSelectedCourse("");
              }}
            >
              Professors
            </button>
          </div>

          {/* Advanced filters */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Course filter - only show when viewing all or courses */}
            {(filter === 'all' || filter === 'courses') && (
              <div className="w-full md:w-1/3">
                <label className="block text-sm font-medium text-gray-600 mb-1">Filter by Course</label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#860033] focus:border-[#860033]"
                >
                  <option value="">All Courses</option>
                  {uniqueCourses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Professor filter - only show when viewing all or professors */}
            {(filter === 'all' || filter === 'professors') && (
              <div className="w-full md:w-1/3">
                <label className="block text-sm font-medium text-gray-600 mb-1">Filter by Professor</label>
                <select
                  value={selectedProfessor}
                  onChange={(e) => setSelectedProfessor(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#860033] focus:border-[#860033]"
                >
                  <option value="">All Professors</option>
                  {uniqueProfessors.map(professor => (
                    <option key={professor.id} value={professor.id}>
                      {professor.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Sort option */}
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-medium text-gray-600 mb-1">Sort by</label>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#860033] focus:border-[#860033]"
              >
                <option value="newest">Newest</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
                {/* <option value="mostHelpful">Most Helpful</option> */}
              </select>
            </div>
          </div>

          {/* Active filters display */}
          {(selectedCourse || selectedProfessor) && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedCourse && (
                <div className="bg-pink-50 text-[#860033] px-3 py-1 rounded-full text-sm flex items-center">
                  <span>Course: {uniqueCourses.find(c => c.id === selectedCourse)?.title}</span>
                  <button
                    onClick={() => setSelectedCourse("")}
                    className="ml-2 hover:text-[#6a0026]"
                  >
                    <i className="bx bx-x"></i>
                  </button>
                </div>
              )}
              {selectedProfessor && (
                <div className="bg-pink-50 text-[#860033] px-3 py-1 rounded-full text-sm flex items-center">
                  <span>Professor: {uniqueProfessors.find(p => p.id === selectedProfessor)?.name}</span>
                  <button
                    onClick={() => setSelectedProfessor("")}
                    className="ml-2 hover:text-[#6a0026]"
                  >
                    <i className="bx bx-x"></i>
                  </button>
                </div>
              )}
              {(selectedCourse || selectedProfessor) && (
                <button
                  onClick={() => {
                    setSelectedCourse("");
                    setSelectedProfessor("");
                  }}
                  className="text-[#860033] hover:underline text-sm ml-1"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
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
                          by {review.anonymous || review.isAnonymous ? "Anonymous" : review.username}
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
                          disabled={review.username === loggedInUsername}
                          className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${review.upvotes?.includes(loggedInUsername)
                            ? "bg-[#860033]/10 text-[#860033]"
                            : review.username === loggedInUsername
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-gray-50 hover:bg-pink-50 text-gray-600 hover:text-[#860033]"
                            }`}
                        >
                          <i className={`bx ${review.upvotes?.includes(loggedInUsername) ? 'bxs-like' : 'bx-like'}`}></i>
                          <span>{review.upvotes?.length || 0}</span>
                        </button>
                        <button
                          onClick={() => handleDownvote(review._id)}
                          disabled={review.username === loggedInUsername}
                          className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${review.downvotes?.includes(loggedInUsername)
                            ? "bg-red-100 text-red-600"
                            : review.username === loggedInUsername
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
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
                          {/* Only show Edit button if review has no feedback */}
                          {(!review.upvotes?.length && !review.downvotes?.length) && (
                            <button
                              onClick={() => handleEditReview(review._id)}
                              className="text-sm text-[#860033] hover:text-[#6a0026] transition-colors flex items-center"
                            >
                              <i className="bx bx-edit mr-1"></i> Edit
                            </button>
                          )}
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
                      onChange={handleInputChange}
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
                          onChange={handleInputChange}
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
                          onChange={handleInputChange}
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