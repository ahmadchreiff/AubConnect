import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "boxicons/css/boxicons.min.css";
import { useAuth } from "../../context/AuthContext"; // Add this import



const CourseDetail = () => {
  const { id } = useParams();
  const { currentUser, isAuthenticated } = useAuth(); // Add this line
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loggedInUsername, setLoggedInUsername] = useState("");
  const navigate = useNavigate();

  // Add these states for the review form
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    rating: 1,
    reviewText: '',
    type: 'course',
    course: id
  });

  useEffect(() => {
    const fetchCourseAndReviews = async () => {
      try {
        // Fetch course details
        const courseResponse = await fetch(`http://localhost:5001/api/courses/${id}`);

        if (!courseResponse.ok) {
          throw new Error("Failed to fetch course details");
        }

        const courseData = await courseResponse.json();
        setCourse(courseData);

        // Fetch reviews for this course
        const reviewsResponse = await fetch(`http://localhost:5001/api/courses/${id}/reviews`);

        if (!reviewsResponse.ok) {
          throw new Error("Failed to fetch course reviews");
        }

        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData);
        setLoading(false);

        // Set the logged-in username
        const username = getUsernameFromToken();
        if (username) {
          setLoggedInUsername(username);
        }
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchCourseAndReviews();
  }, [id]);

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

  // Add these functions for the review form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReviewForm({
      ...reviewForm,
      [name]: name === 'rating' ? parseInt(value) : value
    });
  };

  const handleRatingChange = (rating) => {
    setReviewForm({
      ...reviewForm,
      rating
    });
  };

  // Modify your handleSubmitReview function like this:
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!isAuthenticated()) {
      setError("You must be logged in to submit a review.");
      return;
    }

    if (!reviewForm.reviewText.trim()) {
      setSubmitError('Please write your review before submitting.');
      return;
    }

    try {
      setSubmitLoading(true);
      setSubmitError(null);

      // Make sure we have the department ID
      if (!course || !course.department || !course.department._id) {
        setSubmitError('Department information is missing. Please refresh the page.');
        return;
      }

      const reviewData = {
        ...reviewForm,
        username: currentUser.username,
        department: course.department._id  // Add the department ID
      };

      // Log exactly what we're sending
      console.log('Sending review data:', reviewData);

      const res = await axios.post(`http://localhost:5001/api/reviews`, reviewData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      // Add the new review to the reviews list
      setReviews([res.data.review, ...reviews]);

      // Reset the form
      setReviewForm({
        rating: 5,
        reviewText: '',
        type: 'course',
        course: id
      });

      setShowReviewForm(false);
      setSuccess('Review submitted successfully!');

      // Refresh course data to get updated rating
      const courseResponse = await fetch(`http://localhost:5001/api/courses/${id}`);
      const courseData = await courseResponse.json();
      setCourse(courseData);

      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      console.error('Error submitting review:', err);
      // Log the actual error response for debugging
      console.log('Error response:', err.response?.data);
      setSubmitError(err.response?.data?.message || 'Failed to submit review. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handle upvote
  const handleUpvote = async (reviewId) => {
    try {
      const username = getUsernameFromToken();
      if (!username) {
        setError("You must be logged in to upvote reviews.");
        return;
      }

      const response = await axios.post(
        `http://localhost:5001/api/reviews/${reviewId}/upvote`,
        { username },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      // Update the reviews state with the updated review
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === reviewId ? response.data.review : review
        )
      );

      setSuccess(response.data.message);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to process vote.");
      setTimeout(() => setError(null), 3000);
    }
  };

  // Handle downvote
  const handleDownvote = async (reviewId) => {
    try {
      const username = getUsernameFromToken();
      if (!username) {
        setError("You must be logged in to downvote reviews.");
        return;
      }

      const response = await axios.post(
        `http://localhost:5001/api/reviews/${reviewId}/downvote`,
        { username },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      // Update the reviews state with the updated review
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === reviewId ? response.data.review : review
        )
      );

      setSuccess(response.data.message);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to process vote.");
      setTimeout(() => setError(null), 3000);
    }
  };

  // Calculate average rating
  const averageRating = reviews.length
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 'N/A';

  return (
    <div className="min-h-screen flex flex-col">
      {/* Unified Navbar */}
      <Navbar />

      {/* Notification Messages */}
      {error && (
        <div className="fixed top-20 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50">
          {error}
        </div>
      )}
      {success && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50">
          {success}
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#860033]"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p>{error}</p>
            </div>
          ) : course ? (
            <>
              {/* Breadcrumb */}
              <nav className="mb-4">
                <ol className="flex text-sm">
                  <li className="flex items-center">
                    <Link to="/Homepage" className="text-gray-500 hover:text-gray-700">Home</Link>
                    <i className="bx bx-chevron-right text-gray-400 mx-2"></i>
                  </li>
                  <li className="flex items-center">
                    <Link to="/departments" className="text-gray-500 hover:text-gray-700">Departments</Link>
                    <i className="bx bx-chevron-right text-gray-400 mx-2"></i>
                  </li>
                  <li className="flex items-center">
                    <Link to={`/departments/${course.department._id}`} className="text-gray-500 hover:text-gray-700">
                      {course.department.code}
                    </Link>
                    <i className="bx bx-chevron-right text-gray-400 mx-2"></i>
                  </li>
                  <li className="text-gray-900 font-medium">
                    {course.courseNumber}
                  </li>
                </ol>
              </nav>

              {/* Course Header */}
              <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <div>
                    <h1 className="text-3xl font-bold text-[#860033]">
                      {course.department.code} {course.courseNumber}
                    </h1>
                    <h2 className="text-xl text-gray-700 mb-2">{course.name}</h2>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                        {course.creditHours} {course.creditHours === 1 ? "credit" : "credits"}
                      </span>
                      <Link
                        to={`/departments/${course.department._id}`}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#860033] bg-opacity-10 text-[#860033]"
                      >
                        {course.department.name}
                      </Link>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex flex-col items-center">
                    <div className="text-4xl font-bold text-[#860033]">{averageRating}</div>
                    <div className="text-sm text-gray-500">
                      {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                    </div>
                    <Link
                      to={`/courses/${id}/stat`}
                      className="text-gray-500 text-xs underline hover:text-gray-700 m-0 p-0"
                    >
                      more statistics
                    </Link>

                    <button
                      onClick={() => navigate(`/reviews?type=course&id=${id}&name=${encodeURIComponent(course.name)}&department=${course.department._id}&courseNumber=${encodeURIComponent(course.courseNumber)}`)}
                      className="mt-3 bg-[#860033] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#6a0026] transition-all duration-200"
                    >
                      Write a Review
                    </button>
                  </div>
                </div>

                {/* Course Description & Details */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  {course.description && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-2">Course Description</h3>
                      <p className="text-gray-700">{course.description}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {course.prerequisites && course.prerequisites.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">Prerequisites</h3>
                        <ul className="list-disc list-inside text-gray-700">
                          {course.prerequisites.map((prereq, index) => (
                            <li key={index}>{prereq}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {course.corequisites && course.corequisites.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">Corequisites</h3>
                        <ul className="list-disc list-inside text-gray-700">
                          {course.corequisites.map((coreq, index) => (
                            <li key={index}>{coreq}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {course.syllabus && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-2">Syllabus</h3>
                      <div className="p-4 bg-gray-50 rounded border border-gray-200">
                        <pre className="whitespace-pre-wrap text-gray-700 font-sans text-sm">
                          {course.syllabus}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Reviews Section */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="border-b border-gray-200 pb-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold mb-4">
                      Reviews
                      {reviews.length > 0 && <span className="ml-2 text-gray-500">({reviews.length})</span>}
                    </h2>
                  </div>

                  {/* Review Form */}
                  {showReviewForm && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Share Your Experience</h3>

                      {submitError && (
                        <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm text-red-700">{submitError}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <form onSubmit={handleSubmitReview}>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => handleRatingChange(star)}
                                className="focus:outline-none"
                              >
                                <svg
                                  className={`h-8 w-8 ${star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="mb-4">
                          <label htmlFor="reviewText" className="block text-sm font-medium text-gray-700 mb-1">
                            Your Review
                          </label>
                          <textarea
                            id="reviewText"
                            name="reviewText"
                            rows={4}
                            value={reviewForm.reviewText}
                            onChange={handleInputChange}
                            placeholder="Share your experience with this course..."
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#860033] focus:border-[#860033]"
                          />
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={submitLoading}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#860033] hover:bg-[#6a0026] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#860033] disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {submitLoading ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Submitting...
                              </>
                            ) : (
                              'Submit Review'
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>

                {/* Reviews List */}
                {reviews.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">No reviews yet. Be the first to review this course!</p>
                  </div>
                ) : (
                  <div className="space-y-6 mt-6">
                    {reviews.map((review) => (
                      <div key={review._id} className="border-b border-gray-200 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="bg-[#860033] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                              {review.rating}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm text-gray-500">Posted by</div>
                              <div className="font-medium">{review.displayName || review.username}</div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <p className="text-gray-700">{review.reviewText}</p>
                        <div className="mt-4 flex items-center text-sm text-gray-500">
                          <button
                            onClick={() => handleUpvote(review._id)}
                            className={`flex items-center mr-4 px-2 py-1 rounded-full transition-colors ${review.upvotes?.includes(loggedInUsername)
                              ? "bg-[#860033]/10 text-[#860033]"
                              : "hover:bg-pink-50 hover:text-[#860033]"
                              }`}
                          >
                            <i className={`bx ${review.upvotes?.includes(loggedInUsername) ? 'bxs-like' : 'bx-like'} mr-1`}></i>
                            <span>{review.upvotes?.length || 0}</span>
                          </button>
                          <button
                            onClick={() => handleDownvote(review._id)}
                            className={`flex items-center px-2 py-1 rounded-full transition-colors ${review.downvotes?.includes(loggedInUsername)
                              ? "bg-red-100 text-red-600"
                              : "hover:bg-red-50 hover:text-red-600"
                              }`}
                          >
                            <i className={`bx ${review.downvotes?.includes(loggedInUsername) ? 'bxs-dislike' : 'bx-dislike'} mr-1`}></i>
                            <span>{review.downvotes?.length || 0}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <p className="text-lg text-gray-600">Course not found</p>
            </div>
          )}
        </div>
      </main>

      {/* Unified Footer */}
      <Footer />
    </div>
  );
};

export default CourseDetail;