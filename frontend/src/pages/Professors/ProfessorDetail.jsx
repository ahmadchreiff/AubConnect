import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const ProfessorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [professor, setProfessor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    reviewText: '',
    type: 'professor',
    professor: id
  });
  
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  
  useEffect(() => {
    const fetchProfessorData = async () => {
      try {
        setLoading(true);
        
        // Fetch professor details
        const professorRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/professors/${id}`);
        setProfessor(professorRes.data);
        
        // Fetch professor reviews
        const reviewsRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/reviews/professor/${id}`);
        setReviews(reviewsRes.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching professor data:', err);
        setError('Failed to load professor data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchProfessorData();
  }, [id]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReviewForm({
      ...reviewForm,
      [name]: name === 'rating' ? parseInt(value) : value
    });
  };
  
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: `/professors/${id}` } });
      return;
    }
    
    if (!reviewForm.reviewText.trim()) {
      setSubmitError('Please write your review before submitting.');
      return;
    }
    
    try {
      setSubmitLoading(true);
      setSubmitError(null);
      
      const reviewData = {
        ...reviewForm,
        username: user.username
      };
      
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/reviews`, reviewData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      // Add the new review to the reviews list
      setReviews([res.data.review, ...reviews]);
      
      // Reset the form
      setReviewForm({
        rating: 5,
        reviewText: '',
        type: 'professor',
        professor: id
      });
      
      setShowReviewForm(false);
      setSuccess('Review submitted successfully!');
      
      // Refresh professor data to get updated rating
      const professorRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/professors/${id}`);
      setProfessor(professorRes.data);
      
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      console.error('Error submitting review:', err);
      setSubmitError(err.response?.data?.message || 'Failed to submit review. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };
  
  const handleRatingChange = (rating) => {
    setReviewForm({
      ...reviewForm,
      rating
    });
  };

  const handleUpvote = async (reviewId) => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: `/professors/${id}` } });
      return;
    }
    
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/reviews/${reviewId}/upvote`,
        { username: user.username },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      
      setReviews(reviews.map(review => 
        review._id === reviewId ? res.data.review : review
      ));
    } catch (err) {
      console.error('Error upvoting review:', err);
      setError(err.response?.data?.message || 'Failed to upvote review.');
    }
  };
  
  const handleDownvote = async (reviewId) => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: `/professors/${id}` } });
      return;
    }
    
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/reviews/${reviewId}/downvote`,
        { username: user.username },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      
      setReviews(reviews.map(review => 
        review._id === reviewId ? res.data.review : review
      ));
    } catch (err) {
      console.error('Error downvoting review:', err);
      setError(err.response?.data?.message || 'Failed to downvote review.');
    }
  };
  
  const handleDeleteReview = async (reviewId) => {
    if (!isAuthenticated()) {
      return;
    }
    
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }
    
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/reviews/${reviewId}`,
        { 
          data: { username: user.username },
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
        }
      );
      
      setReviews(reviews.filter(review => review._id !== reviewId));
      setSuccess('Review deleted successfully!');
      
      // Refresh professor data to get updated rating
      const professorRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/professors/${id}`);
      setProfessor(professorRes.data);
      
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      console.error('Error deleting review:', err);
      setError(err.response?.data?.message || 'Failed to delete review.');
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6D0B24]"></div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <p className="text-red-700">{error}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!professor) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <p className="text-yellow-700">Professor not found. Please check the URL and try again.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  // Helper function to format rating
  const getRatingColor = (rating) => {
    if (rating >= 4) return "bg-green-100 text-green-700";
    if (rating >= 3) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {success && (
        <div className="fixed top-5 right-5 z-50 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center">
          <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {success}
          <button 
            onClick={() => setSuccess('')}
            className="ml-3 text-white/80 hover:text-white"
          >
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
      
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Professor Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-[#860033] to-[#6a0026] text-white p-6">
                <div className="flex justify-between items-start">
                  <h1 className="text-2xl font-bold">{professor.name}</h1>
                  {professor.avgRating > 0 && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1 flex items-center">
                      <svg className="h-5 w-5 text-yellow-300 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-bold">{professor.avgRating.toFixed(1)}</span>
                      <span className="text-sm text-white/80 ml-1">/ 5</span>
                    </div>
                  )}
                </div>
                <p className="mt-1 text-white/90">{professor.title}</p>
              </div>
              
              <div className="p-6">
                {/* Department Affiliations */}
                {professor.departments && professor.departments.length > 0 && (
                  <div className="mb-4">
                    <h2 className="text-sm font-medium text-gray-500 uppercase mb-2">Departments</h2>
                    <div className="flex flex-wrap gap-2">
                      {professor.departments.map(dept => (
                        <Link 
                          key={typeof dept === 'object' ? dept._id : dept}
                          to={`/departments/${typeof dept === 'object' ? dept._id : dept}`}
                          className="inline-block px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full transition-colors"
                        >
                          {typeof dept === 'object' ? dept.code : dept}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Contact Information */}
                {professor.email && (
                  <div className="mb-4">
                    <h2 className="text-sm font-medium text-gray-500 uppercase mb-2">Contact</h2>
                    <p className="flex items-center text-gray-600">
                      <svg className="h-5 w-5 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <a href={`mailto:${professor.email}`} className="text-[#860033] hover:underline">
                        {professor.email}
                      </a>
                    </p>
                  </div>
                )}
                
                {/* Office Information */}
                {(professor.office || professor.officeHours) && (
                  <div className="mb-4">
                    <h2 className="text-sm font-medium text-gray-500 uppercase mb-2">Office</h2>
                    {professor.office && (
                      <p className="flex items-center text-gray-600 mb-1">
                        <svg className="h-5 w-5 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                        </svg>
                        {professor.office}
                      </p>
                    )}
                    
                    {professor.officeHours && (
                      <p className="flex items-center text-gray-600">
                        <svg className="h-5 w-5 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        {professor.officeHours}
                      </p>
                    )}
                  </div>
                )}
                
                {/* Biography */}
                {professor.bio && (
                  <div className="mb-4">
                    <h2 className="text-sm font-medium text-gray-500 uppercase mb-2">Biography</h2>
                    <p className="text-gray-600">{professor.bio}</p>
                  </div>
                )}
                
                {/* Courses */}
                {professor.courses && professor.courses.length > 0 && (
                  <div>
                    <h2 className="text-sm font-medium text-gray-500 uppercase mb-2">Courses</h2>
                    <ul className="space-y-2">
                      {professor.courses.map(course => (
                        <li key={typeof course === 'object' ? course._id : course}>
                          <Link 
                            to={`/courses/${typeof course === 'object' ? course._id : course}`}
                            className="flex items-center text-[#860033] hover:underline"
                          >
                            <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                            </svg>
                            {typeof course === 'object' 
                              ? `${course.courseNumber}: ${course.name}` 
                              : course}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Reviews Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="border-b border-gray-200 p-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">
                    Reviews
                    {reviews.length > 0 && <span className="ml-2 text-gray-500">({reviews.length})</span>}
                  </h2>
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#860033] hover:bg-[#6a0026] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#860033]"
                  >
                    {showReviewForm ? 'Cancel' : 'Write a Review'}
                  </button>
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
                          placeholder="Share your experience with this professor..."
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
                <div className="text-center py-12">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No reviews yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Be the first to share your experience with {professor.name}.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {reviews.map(review => (
                    <div key={review._id} className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <div className="mr-4">
                              <div className={`text-2xl font-bold rounded-lg h-12 w-12 flex items-center justify-center ${getRatingColor(review.rating)}`}>
                                {review.rating?.toFixed(1)}
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">{review.username}</p>
                              <p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
                            </div>
                          </div>
                          <div className="mt-4 text-gray-700">{review.reviewText}</div>
                        </div>
                        
                        {/* User actions */}
                        {isAuthenticated() && user.username === review.username && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleDeleteReview(review._id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {/* Upvotes and downvotes */}
                      <div className="mt-4 flex items-center space-x-4">
                        <button
                          onClick={() => handleUpvote(review._id)}
                          className={`flex items-center space-x-1 text-sm ${
                            isAuthenticated() && review.upvotes?.includes(user.username)
                              ? 'text-[#860033] font-medium'
                              : 'text-gray-500 hover:text-[#860033]'
                          }`}
                        >
                          <svg
                            className="h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                          </svg>
                          <span>Helpful ({review.upvotes?.length || 0})</span>
                        </button>
                        
                        <button
                          onClick={() => handleDownvote(review._id)}
                          className={`flex items-center space-x-1 text-sm ${
                            isAuthenticated() && review.downvotes?.includes(user.username)
                              ? 'text-red-600 font-medium'
                              : 'text-gray-500 hover:text-red-600'
                          }`}
                        >
                          <svg
                            className="h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                          </svg>
                          <span>Not Helpful ({review.downvotes?.length || 0})</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProfessorDetail;